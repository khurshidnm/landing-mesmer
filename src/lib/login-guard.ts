// Brute-force protection for admin login (password and 2FA code steps share it).

import { checkLimit, getClientIp, hitLimit, resetLimit } from "./rate-limit";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILS_PER_IP = 10;
const MAX_FAILS_PER_USERNAME = 10;

type HeaderSource = Parameters<typeof getClientIp>[0];

export function loginGuard(headers: HeaderSource, rawUsername: unknown) {
  const username = String(rawUsername || "").trim().toLowerCase();
  const ip = getClientIp(headers);
  const ipKey = `login:ip:${ip || "unknown"}`;
  const userKey = `login:user:${username}`;
  return {
    ip,
    username,
    blocked: () => Boolean((ip && checkLimit(ipKey, MAX_FAILS_PER_IP)) || checkLimit(userKey, MAX_FAILS_PER_USERNAME)),
    fail: () => {
      if (ip) hitLimit(ipKey, MAX_FAILS_PER_IP, WINDOW_MS);
      hitLimit(userKey, MAX_FAILS_PER_USERNAME, WINDOW_MS);
    },
    succeed: () => {
      if (ip) resetLimit(ipKey);
      resetLimit(userKey);
    },
  };
}
