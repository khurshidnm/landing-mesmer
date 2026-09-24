"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useLocale, useTranslations } from "next-intl";

import { trackFormSubmit } from "@/lib/analytics";
import Turnstile, { TURNSTILE_ENABLED, spamMessage } from "@/components/Turnstile";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

export function JobApplicationModal({
  isOpen,
  onClose,
  jobTitle,
}: JobApplicationModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

  const t = useTranslations("career");
  const locale = useLocale();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (TURNSTILE_ENABLED && !captchaToken) {
      toast({
        variant: "destructive",
        title: spamMessage("captcha_required", locale) || "",
      });
      return;
    }

    setIsSubmitting(true);
    toast({
      title: t("message.loading.title"),
      description: t("message.loading.description"),
      variant: "default",
    });

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("email", email);
      formData.append("message", message);
      formData.append("jobTitle", jobTitle);
      formData.append("website_url", honeypot);
      formData.append("cf_turnstile_token", captchaToken);
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.post("/api/apply", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        trackFormSubmit("job_application", { job_title: jobTitle });
        toast({
          variant: "default",
          title: t("message.success.title"),
          description: t("message.success.description"),
        });
        setName("");
        setPhone("");
        setEmail("");
        setMessage("");
        setFile(null);
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: t("message.error.title"),
          description: res.data?.error || t("message.error.description"),
        });
      }
    } catch (error) {
      console.error(error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      toast({
        variant: "destructive",
        title: t("message.error.title"),
        description:
          spamMessage(data?.code, locale) ||
          data?.error ||
          t("message.error.description"),
      });
    } finally {
      setIsSubmitting(false);
      // Turnstile tokens are single-use: get a fresh one for the next attempt
      setCaptchaResetKey((k) => k + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[380px] md:max-w-[425px] h-auto min-h-[400px]">
        <DialogHeader>
          <DialogTitle>{t("modal.title")}: {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anti-spam honeypot: hidden from people, filled in by bots */}
          <input
            type="text"
            name="website_url"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <div>
            <Label htmlFor="name">{t("modal.name")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">{t("modal.phone")}</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">{t("modal.email")}</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="cv">{t("modal.file")} (CV)</Label>
            <Input
              id="cv"
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              accept=".pdf,.doc,.docx"
            />
          </div>
          <div>
            <Label htmlFor="message">{t("modal.message")}</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <Turnstile
            onToken={setCaptchaToken}
            resetKey={captchaResetKey}
            locale={locale}
          />
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600">
            {isSubmitting ? "..." : t("modal.send")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
