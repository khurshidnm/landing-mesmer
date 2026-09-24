"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ArrowLeft, Loader2, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signIn } from "next-auth/react";
import { toast } from "@/hooks/use-toast";

type Step = "password" | "code" | "setup";

const ERRORS: Record<string, string> = {
  TOO_MANY_ATTEMPTS: "Juda ko'p noto'g'ri urinish. 15 daqiqadan so'ng qayta urinib ko'ring",
  INVALID_CREDENTIALS: "Iltimos, ma'lumotlarni to'gri kiriting",
  INVALID_2FA_CODE: "Tasdiqlash kodi noto'g'ri yoki eskirgan. Ilovadagi yangi kodni kiriting",
};

const showError = (code?: string) =>
  toast({ title: "Xatolik", description: ERRORS[code || ""] || ERRORS.INVALID_CREDENTIALS, variant: "destructive" });

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<Step>("password");
  const [setup, setSetup] = useState<{ qr: string; secret: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Step 1: username + password → ask for the code (or show 2FA setup)
  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return toast({
        title: "Xatolik",
        description: "Iltimos, barcha maydonlarni to'ldiring",
        variant: "destructive",
      });
    }
    setLoading(true);
    try {
      const res = await axios.post("/api/admin/2fa", { username, password });
      if (res.data.step === "setup") setSetup({ qr: res.data.qr, secret: res.data.secret });
      setCode("");
      setStep(res.data.step);
    } catch (error) {
      showError(axios.isAxiosError(error) ? error.response?.data?.error : undefined);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: the 6-digit Google Authenticator code
  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) {
      return toast({ title: "Xatolik", description: "6 xonali kodni kiriting", variant: "destructive" });
    }
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, username, password, code });
    setLoading(false);
    if (res?.ok) {
      router.push("/admin");
    } else {
      setCode("");
      showError(res?.error || undefined);
    }
  };

  const back = () => {
    setStep("password");
    setCode("");
    setSetup(null);
  };

  const codeInput = (
    <Input
      autoFocus
      inputMode="numeric"
      autoComplete="one-time-code"
      maxLength={6}
      placeholder="123456"
      value={code}
      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      className="h-12 text-center text-2xl font-semibold tracking-[0.5em]"
    />
  );

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className={step === "setup" ? "w-full max-w-[440px]" : "w-full max-w-[360px]"}>
        <CardHeader>
          <CardTitle>Admin Panel - Login</CardTitle>
          {step === "code" && (
            <CardDescription>Google Authenticator ilovasidagi 6 xonali kodni kiriting.</CardDescription>
          )}
          {step === "setup" && (
            <CardDescription>
              Ikki bosqichli himoya (2FA) majburiy. Uni bir marta sozlang — keyin har kirishda kod so‘raladi.
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {step === "password" && (
            <form onSubmit={handlePassword} className="space-y-4">
              <Input
                type="text"
                placeholder="Foydalanuvchi nomi"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Parol"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Davom etish
              </Button>
            </form>
          )}

          {step === "code" && (
            <form onSubmit={handleCode} className="space-y-4">
              <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                <ShieldCheck className="h-5 w-5 shrink-0" />
                <span>
                  Hisob: <strong>{username}</strong>
                </span>
              </div>
              {codeInput}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirish
              </Button>
              <button type="button" onClick={back} className="flex w-full items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4" /> Orqaga
              </button>
            </form>
          )}

          {step === "setup" && setup && (
            <form onSubmit={handleCode} className="space-y-4">
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                  <span>
                    1. Telefoningizga <strong>Google Authenticator</strong> ilovasini o‘rnating.
                  </span>
                </li>
                <li>2. Ilovada «+» → «QR kodni skanerlash» ni tanlang va quyidagi kodni skanerlang.</li>
              </ol>
              <div className="flex justify-center rounded-lg border bg-white p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={setup.qr} alt="Google Authenticator QR" width={200} height={200} />
              </div>
              <div className="rounded-lg bg-gray-50 p-3 text-center">
                <p className="text-xs text-gray-500">Skanerlab bo‘lmasa, ushbu kalitni qo‘lda kiriting:</p>
                <p className="mt-1 select-all break-all font-mono text-sm font-semibold tracking-wider text-gray-900">
                  {setup.secret}
                </p>
              </div>
              <p className="text-sm text-gray-700">3. Ilova ko‘rsatgan 6 xonali kodni kiriting:</p>
              {codeInput}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tasdiqlash va kirish
              </Button>
              <button type="button" onClick={back} className="flex w-full items-center justify-center gap-1 text-sm text-gray-500 hover:text-gray-800">
                <ArrowLeft className="h-4 w-4" /> Orqaga
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
