"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useLocale } from "next-intl";
import { trackFormSubmit } from "@/lib/analytics";
import Turnstile, { TURNSTILE_ENABLED, spamMessage } from "@/components/Turnstile";

interface StartProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StartProjectModal({
  isOpen,
  onClose,
}: StartProjectModalProps) {
  const locale = useLocale();
  const isEn = locale === "en";
  const isRu = locale === "ru";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("WWTP EPC");
  const [capacity, setCapacity] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);

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

    try {
      const fullMessage = `[Project Type: ${projectType}] [Capacity: ${capacity || "N/A"}] \n\n${message}`;

      const res = await axios.post("/api/contact", {
        name,
        phone,
        email,
        message: fullMessage,
        locale,
        website_url: honeypot,
        cf_turnstile_token: captchaToken,
      });

      if (res.data?.success) {
        trackFormSubmit("start_a_project", {
          project_type: projectType,
          capacity,
        });

        toast({
          title: isEn
            ? "Project Request Submitted"
            : isRu
            ? "Заявка успешно отправлена"
            : "Loyiha so'rovi yuborildi",
          description: isEn
            ? "Our engineering team will review your specifications and contact you shortly."
            : isRu
            ? "Наши инженеры изучат проект и свяжутся с вами в ближайшее время."
            : "Muhandislarimiz siz bilan tez orada bog'lanishadi.",
        });

        setName("");
        setPhone("");
        setEmail("");
        setCapacity("");
        setMessage("");
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: isEn ? "Submission Failed" : isRu ? "Ошибка отправки" : "Xatolik",
          description: res.data?.error || "Please try again later.",
        });
      }
    } catch (error) {
      console.error("Start project submit error:", error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      toast({
        variant: "destructive",
        title: isEn ? "Error" : isRu ? "Ошибка" : "Xatolik",
        description: spamMessage(data?.code, locale) || data?.error || (isEn
          ? "Failed to submit project request. Please check your connection."
          : isRu
          ? "Не удалось отправить заявку. Попробуйте снова."
          : "Xabarni yuborib bo'lmadi. Qayta urinib ko'ring."),
      });
    } finally {
      setIsSubmitting(false);
      // Turnstile tokens are single-use: get a fresh one for the next attempt
      setCaptchaResetKey((k) => k + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto p-6 sm:p-8 bg-white rounded-lg shadow-lg border border-gray-200">
        <DialogHeader className="mb-4">
          <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase mb-1 block">
            {isEn ? "Engineering & EPC Partnership" : isRu ? "Инжиниринг и EPC-партнерство" : "EPC va muhandislik hamkorligi"}
          </span>
          <DialogTitle className="text-2xl font-bold text-gray-950">
            {isEn ? "Start a Project with MESMER" : isRu ? "Начать проект с MESMER" : "MESMER bilan loyiha boshlash"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            {isEn
              ? "Share your water treatment or municipal infrastructure scope. We deliver turnkey EPC execution under FIDIC standards."
              : isRu
              ? "Укажите параметры вашего объекта водоочистки. Мы выполняем контракты «под ключ» по стандартам FIDIC."
              : "Suv yoki oqova suv tozalash loyihangiz parametrlarini qoldiring. Biz FIDIC standartlarida to'liq kalit ostida bajaramiz."}
          </DialogDescription>
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sp-name" className="text-xs font-semibold text-gray-700">
                {isEn ? "Full Name / Company *" : isRu ? "ФИО / Организация *" : "F.I.SH / Tashkilot *"}
              </Label>
              <Input
                id="sp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isEn ? "e.g. John Doe" : isRu ? "Иван Иванов" : "Ismingiz"}
                required
                className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sp-phone" className="text-xs font-semibold text-gray-700">
                {isEn ? "Phone Number *" : isRu ? "Телефон *" : "Telefon raqam *"}
              </Label>
              <Input
                id="sp-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 (__) ___ __ __"
                required
                className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sp-email" className="text-xs font-semibold text-gray-700">
              {isEn ? "Corporate Email Address *" : isRu ? "Корпоративный Email *" : "Email pochta *"}
            </Label>
            <Input
              id="sp-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="inquiry@company.com"
              required
              className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="sp-type" className="text-xs font-semibold text-gray-700">
                {isEn ? "Project Category" : isRu ? "Категория проекта" : "Loyiha turi"}
              </Label>
              <select
                id="sp-type"
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
              >
                <option value="WWTP EPC">WWTP (Wastewater Treatment Plant)</option>
                <option value="WTP Construction">WTP (Water Treatment Plant)</option>
                <option value="Water Supply Infrastructure">Municipal Water Supply & Canals</option>
                <option value="Pumping Stations">Pumping Station (PS/B-PS)</option>
                <option value="O&M and Equipment">O&M & Equipment Procurement</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="sp-capacity" className="text-xs font-semibold text-gray-700">
                {isEn ? "Estimated Capacity" : isRu ? "Проектная мощность" : "Loyiha quvvati"}
              </Label>
              <Input
                id="sp-capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                placeholder="e.g. 50,000 m³/day"
                className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="sp-message" className="text-xs font-semibold text-gray-700">
              {isEn ? "Project Scope & Details" : isRu ? "Описание проекта и требования" : "Loyiha tavsifi va talablar"}
            </Label>
            <Textarea
              id="sp-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                isEn
                  ? "Describe project location, financing structure (e.g. ADB, EBRD, State Budget), and timeline..."
                  : isRu
                  ? "Укажите локацию, источник финансирования (АБР, ЕБРР и т.д.) и плановые сроки..."
                  : "Loyihaning joylashuvi, moliyalashtirish manbai va rejalashtirilgan muddatlarni ko'rsating..."
              }
              rows={3}
              className="rounded-lg border-gray-300 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
            />
          </div>

          <Turnstile
            onToken={setCaptchaToken}
            resetKey={captchaResetKey}
            locale={locale}
          />

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {isSubmitting
                ? isEn ? "Submitting Inquiry..." : isRu ? "Отправка заявки..." : "Yuborilmoqda..."
                : isEn ? "Submit Project Proposal" : isRu ? "Отправить заявку на проект" : "Loyiha arizasini yuborish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
