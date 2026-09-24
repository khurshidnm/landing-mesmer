"use client";

import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, FileText, FileUp, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { trackFormSubmit } from "@/lib/analytics";
import { ALL_COUNTRIES, getCountryByName } from "@/lib/countries";
import Turnstile, { TURNSTILE_ENABLED, spamMessage } from "@/components/Turnstile";
import { t as cmsText } from "@/lib/cms/definitions";
import { useSiteData } from "@/components/site/site-data";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".jpg",
  ".jpeg",
  ".png",
];

/** B2B project inquiry form, used on /contact and /start-a-project. */
export default function ProjectInquiryForm() {
  const t = useTranslations("contact");
  const locale = useLocale() as "en" | "ru" | "uz";
  // Headings from Website Content → Footer & Contact, falling back to the translation files
  const { texts } = useSiteData();
  const txt = (value: Parameters<typeof cmsText>[0], fallback: string) => cmsText(value, locale) || fallback;
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [country, setCountry] = useState("Uzbekistan");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [selectedDialCode, setSelectedDialCode] = useState("+998");
  const previousDialCodeRef = useRef("+998");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "EPC Turnkey Contract",
  ]);

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    const found = getCountryByName(newCountryName);
    const newDialCode = found ? found.dialCode : "";
    const prevDial = previousDialCodeRef.current;

    setSelectedDialCode(newDialCode);

    // If phone is empty, or only contains the previous country's dial code, prefill with new suggestion
    const trimmedPhone = phone.trim();
    if (!trimmedPhone || trimmedPhone === prevDial.trim()) {
      setPhone(newDialCode ? `${newDialCode} ` : "");
    }
    previousDialCodeRef.current = newDialCode;
  };
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaResetKey, setCaptchaResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Marketing UTM tracking state
  const [utm, setUtm] = useState({
    source: "",
    medium: "",
    campaign: "",
    term: "",
    content: "",
    referrer: "",
  });

  useEffect(() => {
    // Capture UTM tags from the URL for lead attribution
    setUtm({
      source: searchParams.get("utm_source") || "",
      medium: searchParams.get("utm_medium") || "",
      campaign: searchParams.get("utm_campaign") || "",
      term: searchParams.get("utm_term") || "",
      content: searchParams.get("utm_content") || "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, [searchParams]);

  const INQUIRY_TYPE_KEYS = [
    { key: "epc", label: t("form.types.epc") },
    { key: "wwtp", label: t("form.types.wwtp") },
    { key: "wtp", label: t("form.types.wtp") },
    { key: "water_supply", label: t("form.types.water_supply") },
    { key: "equipment", label: t("form.types.equipment") },
    { key: "om", label: t("form.types.om") },
    { key: "partnership", label: t("form.types.partnership") },
    { key: "tender", label: t("form.types.tender") },
  ];

  const toggleInquiryType = (typeLabel: string) => {
    setSelectedTypes((prev) =>
      prev.includes(typeLabel)
        ? prev.filter((item) => item !== typeLabel)
        : [...prev, typeLabel]
    );
  };

  const handleFileChange = (newFile: File | null) => {
    if (!newFile) {
      setFile(null);
      return;
    }

    if (newFile.size > MAX_FILE_SIZE) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10 MB.",
        variant: "destructive",
      });
      return;
    }

    const ext = "." + newFile.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      toast({
        title: "Unsupported file format",
        description:
          "Please upload PDF, DOC, DOCX, XLS, XLSX, JPG, or PNG files.",
        variant: "destructive",
      });
      return;
    }

    setFile(newFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTypes.length === 0) {
      toast({
        title: "Selection required",
        description: "Please select at least one inquiry type.",
        variant: "destructive",
      });
      return;
    }

    if (TURNSTILE_ENABLED && !captchaToken) {
      toast({
        title: spamMessage("captcha_required", locale) || "",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("company", company);
      formData.append("country", country);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("message", message);
      formData.append("locale", locale);
      formData.append("website_url", honeypot); // Honeypot field
      formData.append("cf_turnstile_token", captchaToken);

      selectedTypes.forEach((type) => {
        formData.append("inquiryTypes", type);
      });

      if (file) {
        formData.append("file", file);
      }

      // Append UTM metrics
      Object.entries(utm).forEach(([k, v]) => {
        if (v) formData.append(`utm_${k}`, v);
      });

      const res = await axios.post("/api/contact", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        trackFormSubmit("b2b_start_project_contact", {
          company,
          country,
          inquiry_types: selectedTypes.join(", "),
        });

        toast({
          title: txt(texts?.form_success_title, t("form.success_title")),
          description: txt(texts?.form_success_text, t("form.success_desc")),
        });

        // Reset form
        setName("");
        setCompany("");
        setEmail("");
        setCountry("Uzbekistan");
        setPhone("+998 ");
        setSelectedDialCode("+998");
        previousDialCodeRef.current = "+998";
        setMessage("");
        setFile(null);
        setSelectedTypes(["EPC Turnkey Contract"]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        toast({
          title: "Submission Error",
          description: res.data?.error || "Could not submit inquiry.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      const data = axios.isAxiosError(error) ? error.response?.data : undefined;
      toast({
        title: data ? "Submission Error" : "Network Error",
        description:
          spamMessage(data?.code, locale) ||
          data?.error ||
          "Failed to submit inquiry. Please check your network connection.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      // Turnstile tokens are single-use: get a fresh one for the next attempt
      setCaptchaResetKey((k) => k + 1);
    }
  };

  return (
    <>
        <div className="mb-8">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-600 mb-1.5 block">
            {txt(
              texts?.form_eyebrow,
              locale === "ru"
                ? "Заявка на проект и сотрудничество"
                : locale === "uz"
                ? "Loyiha va hamkorlik murojaati"
                : "Project Inquiry & Cooperation"
            )}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-950 tracking-tight mb-2">
            {txt(texts?.form_title, t("form.title"))}
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {txt(texts?.form_subtitle, t("form.subtitle"))}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Anti-spam Honeypot Field */}
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

          {/* 1. Inquiry Types */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
              {t("form.types_title")}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {INQUIRY_TYPE_KEYS.map((item) => {
                const isChecked = selectedTypes.includes(item.label);
                return (
                  <button
                    type="button"
                    key={item.key}
                    onClick={() => toggleInquiryType(item.label)}
                    className={`px-3.5 py-3 rounded-lg border text-xs sm:text-sm font-semibold flex items-center justify-between text-left transition-all ${
                      isChecked
                        ? "bg-blue-50 border-blue-600 text-blue-900"
                        : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span>{item.label}</span>
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 transition-opacity ${
                        isChecked
                          ? "text-blue-600 opacity-100"
                          : "text-gray-300 opacity-30"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Client Details: Name & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {t("form.name")}
              </label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "ru" ? "Иван Иванов" : locale === "uz" ? "Ismingiz" : "e.g. Alexander Weber"}
                className="h-11 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {t("form.company")}
              </label>
              <Input
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={locale === "ru" ? "Название организации" : locale === "uz" ? "Tashkilot nomi" : "e.g. Global Utilities Ltd."}
                className="h-11 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* 3. Country & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {t("form.country")}
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              >
                {ALL_COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                {t("form.phone")}
              </label>
              <Input
                required
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={
                  selectedDialCode
                    ? `${selectedDialCode} 123 456 789`
                    : "+1 555 123 4567"
                }
                className="h-11 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
              />
              <p className="text-[11px] text-gray-400">
                {t("form.phone_hint")}
              </p>
            </div>
          </div>

          {/* 4. Corporate Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              {t("form.email")}
            </label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contact@company.com"
              className="h-11 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
            />
          </div>

          {/* 5. Message / Scope */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-gray-700">
              {t("form.message")}
            </label>
            <Textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                locale === "ru"
                  ? "Укажите параметры объекта, локацию, проектную мощность (напр. 50 000 м³/сут) и структуру финансирования (АБР, ЕБРР, госбюджет и т.д.)..."
                  : locale === "uz"
                  ? "Inshoot parametrlari, joylashuvi, rejalashtirilgan quvvati (masalan, 50 000 m³/kun) va moliyalashtirish manbasini ko'rsating..."
                  : "Please describe project scope, location, expected capacity (e.g. 50,000 m³/day), and financing format (ADB, EBRD, State Budget, etc.)..."
              }
              className="rounded-lg border-gray-300 bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none transition-colors"
            />
          </div>

          {/* 6. File Attachment Drop-Zone */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-gray-700">
              {t("form.file_label")}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragActive(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleFileChange(e.dataTransfer.files[0]);
                }
              }}
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all cursor-pointer ${
                dragActive
                  ? "border-blue-600 bg-blue-50/50"
                  : "border-gray-300 hover:border-blue-600 bg-gray-50/50"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              {file ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 text-left">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-6 h-6 text-blue-600 shrink-0" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-blue-950 truncate">
                        {file.name}
                      </p>
                      <p className="text-[11px] text-blue-600">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFileChange(null);
                      if (fileInputRef.current)
                        fileInputRef.current.value = "";
                    }}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-md transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <FileUp className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-gray-700">
                    {t("form.file_drop")}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    Max file size: 10 MB (.pdf, .doc, .xlsx, .dwg)
                  </p>
                </div>
              )}
            </div>
          </div>

          <Turnstile
            onToken={setCaptchaToken}
            resetKey={captchaResetKey}
            locale={locale}
          />

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow-none transition-colors disabled:opacity-50"
            >
              {isSubmitting ? t("form.sending") : t("form.send")}
            </Button>
          </div>
        </form>
    </>
  );
}
