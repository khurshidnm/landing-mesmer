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
import { useTranslations } from "next-intl";

interface JobApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
}

const BOT_TOKEN = "7049223832:AAH0qBWpoDVAWiCbMxH92HTNcC3JQ2zbHS4";
const CHAT_ID = -1002471201680;

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

  const t = useTranslations("career")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t("message.loading.title"),
      description: t("message.loading.description"),
      variant: "default",
    });
    // Handle form submission logic here
    console.log({ name, phone, email, message, file });
    // onClose();
    try {
      const text = `<b>📨 Новая заявка!</b>\n\n<b>Отклик на вакансию: </b>: ${jobTitle}\n\n👤 Имя: ${name}\n\n<b>📞 Телефон:</b> ${phone}\n\n<b>📧 Email:</b> ${email}\n\n<b>💬 Сообщение:</b> ${message}`;
      const formData = new FormData();
      formData.append("chat_id", CHAT_ID.toString());
      formData.append("caption", text);
      formData.append("parse_mode", "HTML");
      if (file) {
        formData.append("document", file);
      }
      const res = await axios.post(
        `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
        formData
      );
      if (res.data.ok) {
        toast({
          variant: "default",
          title: t("message.success.title"),
          description: t("message.success.description"),
        });
        onClose();
      }
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Xato",
          description: error.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: t("message.error.title"),
          description: t("message.error.description"),
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[380px] md:max-w-[425px] h-auto min-h-[400px]">
        <DialogHeader>
          <DialogTitle>{t("modal.title")}: {jobTitle}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <DialogFooter>
            <Button type="submit" className="bg-blue-600">
            {t("modal.send")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
