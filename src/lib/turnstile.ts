// Server-side verification of Cloudflare Turnstile tokens.
// Turnstile is enabled only when TURNSTILE_SECRET_KEY is set, so local
// development works without keys.

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function isTurnstileEnabled() {
  return Boolean(process.env.TURNSTILE_SECRET_KEY);
}

export async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set("remoteip", ip);

  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[Turnstile] verification failed:", data["error-codes"]);
    }
    return Boolean(data.success);
  } catch (error) {
    // Cloudflare unreachable: let the submission through (rate limiting still
    // applies) rather than losing a real customer's inquiry.
    console.error("[Turnstile] verification request failed, allowing submission:", error);
    return true;
  }
}
