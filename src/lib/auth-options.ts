import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/user.model";
import { compare } from "bcrypt";
import { loginGuard } from "./login-guard";
import { decryptSecret, verifyTotp } from "./totp";

interface SessionUser {
  username: string;
  _id: string;
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username",
          type: "text",
          placeholder: "Username",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
        code: {
          label: "Authenticator code",
          type: "text",
        },
      },
      // Step 2 of the admin login (step 1 is /api/admin/2fa): the password AND a
      // Google Authenticator code are required every time.
      async authorize(credentials, req) {
        const guard = loginGuard(req?.headers || {}, credentials?.username);
        if (guard.blocked()) {
          console.warn("[Auth] Login blocked, too many failed attempts:", { ip: guard.ip, username: guard.username });
          throw new Error("TOO_MANY_ATTEMPTS");
        }

        await connectToDatabase();
        const user = await User.findOne({ username: credentials?.username });
        if (!user || !(await compare(credentials?.password || "", user.password))) {
          guard.fail();
          return null;
        }

        // 2FA already set up: check against the saved secret.
        // First login: check against the pending secret shown as a QR code, and switch 2FA on.
        const enrolling = !user.totp_enabled;
        const stored = enrolling ? user.totp_pending_secret : user.totp_secret;
        let step: number | null = null;
        try {
          step = stored ? verifyTotp(decryptSecret(stored), String(credentials?.code || ""), user.totp_last_step || 0) : null;
        } catch (error) {
          console.error("[Auth] Could not read 2FA secret:", error);
        }
        if (step === null) {
          guard.fail();
          throw new Error("INVALID_2FA_CODE");
        }

        if (enrolling) {
          user.totp_secret = stored;
          user.totp_pending_secret = "";
          user.totp_enabled = true;
        }
        user.totp_last_step = step;
        await user.save();
        guard.succeed();
        return { id: String(user._id), _id: String(user._id), name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    // @ts-expect-error: sdfs
    async session({ session, token }) {
      await connectToDatabase();

      // Agar token mavjud bo'lmasa yoki yaroqsiz bo'lsa, sessionni null qaytarish.
      // Sessions created before 2FA existed (no "twoFactor" flag) are rejected too.
      if (!token || !token.sub || token.twoFactor !== true) {
        return null;
      }

      const isExistingUser = await User.findOne({
        // @ts-ignore
        _id: token.sub,
      });
      if (!isExistingUser) return null;

      // @ts-ignore
      session.user = {
        _id: isExistingUser?._id,
        username: isExistingUser?.username,
      } as SessionUser;

      // console.log(session)

      return session;
    },
    async jwt({ token, user }) {
      // Agar foydalanuvchi mavjud bo'lsa, token ga foydalanuvchi ma'lumotlarini qo'shish
      if (user) {
        // @ts-expect-error: error not defined
        token.sub = user._id;
        // Only reachable through authorize(), which requires the 2FA code
        token.twoFactor = true;
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
  // Admins sign in again (with a new 2FA code) at least every 12 hours
  session: { strategy: "jwt", maxAge: 12 * 60 * 60 },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
