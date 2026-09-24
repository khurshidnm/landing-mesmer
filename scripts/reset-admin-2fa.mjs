// Resets Google Authenticator 2FA for an admin who lost their phone.
// Their next login shows a new QR code to set it up again.
//
//   node --env-file=.env.local scripts/reset-admin-2fa.mjs <username>

import mongoose from "mongoose";

const username = process.argv[2];
if (!username) {
  console.error("Usage: node --env-file=.env.local scripts/reset-admin-2fa.mjs <username>");
  process.exit(1);
}

await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mesmer-admin", { dbName: "mesmer-admin" });
const result = await mongoose.connection.collection("admins").updateOne(
  { username },
  { $set: { totp_enabled: false, totp_secret: "", totp_pending_secret: "", totp_last_step: 0 } }
);
console.log(result.matchedCount ? `2FA reset for "${username}".` : `No admin named "${username}".`);
await mongoose.disconnect();
