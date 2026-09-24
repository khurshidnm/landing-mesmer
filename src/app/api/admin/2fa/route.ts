import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import QRCode from "qrcode";
import User from "@/database/user.model";
import { connectToDatabase } from "@/lib/mongoose";
import { loginGuard } from "@/lib/login-guard";
import { decryptSecret, encryptSecret, generateSecret, otpauthUrl } from "@/lib/totp";

// Step 1 of the admin login: checks username + password, then tells the login
// page whether to ask for the Google Authenticator code or to show the QR code
// for first-time setup. The session is only created by step 2 (NextAuth),
// which verifies the password again together with the code.
export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  const guard = loginGuard(req.headers, username);

  if (guard.blocked()) {
    return NextResponse.json({ success: false, error: "TOO_MANY_ATTEMPTS" }, { status: 429 });
  }
  if (typeof username !== "string" || typeof password !== "string" || !username || !password) {
    return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" }, { status: 400 });
  }

  await connectToDatabase();
  const user = await User.findOne({ username });
  if (!user || !(await compare(password, user.password))) {
    guard.fail();
    return NextResponse.json({ success: false, error: "INVALID_CREDENTIALS" }, { status: 401 });
  }

  if (user.totp_enabled && user.totp_secret) {
    return NextResponse.json({ success: true, step: "code" });
  }

  // First login with 2FA: keep one pending secret until a code confirms it,
  // so reloading the page shows the same QR code
  let secret = "";
  try {
    secret = user.totp_pending_secret ? decryptSecret(user.totp_pending_secret) : "";
  } catch {
    secret = "";
  }
  if (!secret) {
    secret = generateSecret();
    user.totp_pending_secret = encryptSecret(secret);
    await user.save();
  }

  const qr = await QRCode.toDataURL(otpauthUrl(user.username, secret), { margin: 1, width: 240 });
  return NextResponse.json({
    success: true,
    step: "setup",
    qr,
    // For typing into the app manually, in groups of four
    secret: secret.match(/.{1,4}/g)?.join(" "),
  });
}
