// Time-based one-time passwords (RFC 6238) for admin 2FA, compatible with
// Google Authenticator: HMAC-SHA1, 6 digits, 30-second steps.
// Secrets are stored encrypted (AES-256-GCM) with a key derived from NEXTAUTH_SECRET.

import crypto from "crypto";

const STEP_SECONDS = 30;
const DIGITS = 6;
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export const TOTP_ISSUER = "MESMER Admin";

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += ALPHABET[(value << (5 - bits)) & 31];
  return output;
}

function base32Decode(input: string): Buffer {
  const clean = input.replace(/[\s=-]/g, "").toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];
  for (const char of clean) {
    const index = ALPHABET.indexOf(char);
    if (index === -1) throw new Error("Invalid base32 secret");
    value = (value << 5) | index;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/** New random secret (160 bits), base32-encoded as authenticator apps expect. */
export function generateSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

function codeForStep(secret: string, step: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const hmac = crypto.createHmac("sha1", base32Decode(secret)).update(counter).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const binary =
    ((hmac[offset] & 0x7f) << 24) | (hmac[offset + 1] << 16) | (hmac[offset + 2] << 8) | hmac[offset + 3];
  return String(binary % 10 ** DIGITS).padStart(DIGITS, "0");
}

export const currentStep = (now = Date.now()) => Math.floor(now / 1000 / STEP_SECONDS);

/**
 * Checks a 6-digit code, allowing one step of clock drift either way.
 * Returns the matched time step, or null. Steps at or before `lastUsedStep`
 * are rejected so a code can't be used twice.
 */
export function verifyTotp(secret: string, code: string, lastUsedStep = 0): number | null {
  const clean = String(code || "").replace(/\s/g, "");
  if (!/^\d{6}$/.test(clean)) return null;
  const now = currentStep();
  for (const step of [now, now - 1, now + 1]) {
    if (step <= lastUsedStep) continue;
    const expected = codeForStep(secret, step);
    if (crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(clean))) return step;
  }
  return null;
}

/** otpauth:// link encoded in the QR code that authenticator apps scan. */
export function otpauthUrl(account: string, secret: string): string {
  const label = encodeURIComponent(`${TOTP_ISSUER}:${account}`);
  return `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(TOTP_ISSUER)}&algorithm=SHA1&digits=${DIGITS}&period=${STEP_SECONDS}`;
}

function encryptionKey(): Buffer {
  const material = process.env.NEXTAUTH_SECRET || process.env.NEXTAUTH_JWT_SECRET;
  if (!material) throw new Error("NEXTAUTH_SECRET is required to store 2FA secrets");
  return crypto.createHash("sha256").update(`mesmer-2fa:${material}`).digest();
}

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map((b) => b.toString("base64")).join(".");
}

export function decryptSecret(payload: string): string {
  const [iv, tag, data] = payload.split(".").map((part) => Buffer.from(part, "base64"));
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(data), decipher.final()]).toString("utf8");
}
