import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    // Google Authenticator 2FA (secrets are AES-GCM encrypted, see src/lib/totp.ts)
    totp_enabled: { type: Boolean, default: false },
    totp_secret: { type: String, default: "" },
    // Secret shown as a QR code until the first code confirms it
    totp_pending_secret: { type: String, default: "" },
    // Last accepted time step, so a code can't be reused
    totp_last_step: { type: Number, default: 0 },
  },
  { timestamps: true }
);

if (process.env.NODE_ENV !== "production" && mongoose.models.Admins) {
  mongoose.deleteModel("Admins");
}

const User = mongoose.models.Admins || mongoose.model("Admins", userSchema);
export default User;