// Simple in-memory fixed-window rate limiter.
// Good enough for a single Node process (pm2 fork mode). If the app is ever
// scaled to several processes/servers, move this to Redis or MongoDB.

type Entry = { count: number; resetAt: number };

const globalForRateLimit = globalThis as unknown as {
  rateLimitBuckets?: Map<string, Entry>;
};
const buckets = (globalForRateLimit.rateLimitBuckets ??= new Map<string, Entry>());

function sweep(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
}

function current(key: string, now: number): Entry | undefined {
  const entry = buckets.get(key);
  if (entry && entry.resetAt <= now) {
    buckets.delete(key);
    return undefined;
  }
  return entry;
}

/** Seconds until the window resets, or 0 if the key is under the limit. */
export function checkLimit(key: string, limit: number): number {
  const now = Date.now();
  const entry = current(key, now);
  if (entry && entry.count >= limit) {
    return Math.ceil((entry.resetAt - now) / 1000);
  }
  return 0;
}

/** Counts one hit. Returns seconds to wait if this hit went over the limit, else 0. */
export function hitLimit(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  sweep(now);
  const entry = current(key, now);
  if (!entry) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return 0;
  }
  entry.count += 1;
  return entry.count > limit ? Math.ceil((entry.resetAt - now) / 1000) : 0;
}

export function resetLimit(key: string) {
  buckets.delete(key);
}

type HeaderSource = Headers | Record<string, string | string[] | undefined>;

function readHeader(headers: HeaderSource, name: string): string {
  if (headers instanceof Headers) return headers.get(name) || "";
  const value = headers[name] ?? headers[name.toLowerCase()];
  return (Array.isArray(value) ? value[0] : value) || "";
}

/**
 * Client IP as seen by the reverse proxy. Prefers X-Real-IP (set by nginx from
 * the socket address, so it can't be spoofed), then the last X-Forwarded-For hop.
 * Returns "" when unknown (e.g. no proxy in front of the app).
 */
export function getClientIp(headers: HeaderSource): string {
  const realIp = readHeader(headers, "x-real-ip").trim();
  if (realIp) return realIp;
  const forwarded = readHeader(headers, "x-forwarded-for")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return forwarded[forwarded.length - 1] || "";
}

/**
 * Rate limit for public form submissions. Limits per IP when the IP is known;
 * otherwise falls back to a shared, more generous cap so real visitors aren't
 * all blocked together while a flood is still stopped.
 */
export function limitFormSubmission(
  bucket: string,
  ip: string,
  { perIp = 5, shared = 60, windowMs = 10 * 60 * 1000 } = {}
): number {
  return ip
    ? hitLimit(`${bucket}:ip:${ip}`, perIp, windowMs)
    : hitLimit(`${bucket}:shared`, shared, windowMs);
}
