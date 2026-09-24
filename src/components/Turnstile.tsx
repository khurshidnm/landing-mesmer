"use client";

import { useEffect, useRef } from "react";

// Cloudflare Turnstile widget. Renders nothing unless
// NEXT_PUBLIC_TURNSTILE_SITE_KEY is set, so forms keep working without keys.

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

export const TURNSTILE_ENABLED = Boolean(SITE_KEY);

type Locale = "en" | "ru" | "uz";

interface TurnstileApi {
  render: (el: HTMLElement, options: Record<string, unknown>) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Failed to load Turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

interface TurnstileProps {
  /** Called with a fresh token, or "" when the token expires or errors. */
  onToken: (token: string) => void;
  /** Change this number to reset the widget (tokens are single-use). */
  resetKey?: number;
  locale?: string;
  className?: string;
}

export default function Turnstile({ onToken, resetKey = 0, locale, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  onTokenRef.current = onToken;

  useEffect(() => {
    if (!SITE_KEY) return;
    let cancelled = false;

    loadScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme: "light",
          size: "flexible",
          language: locale === "uz" ? "uz" : locale === "ru" ? "ru" : "en",
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => onTokenRef.current(""),
        });
      })
      .catch((error) => console.error(error));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
    };
  }, [locale]);

  useEffect(() => {
    if (resetKey && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onTokenRef.current("");
    }
  }, [resetKey]);

  if (!SITE_KEY) return null;
  return <div ref={containerRef} className={className} />;
}

const MESSAGES: Record<string, Record<Locale, string>> = {
  captcha_required: {
    en: "Please confirm you are not a robot.",
    ru: "Пожалуйста, подтвердите, что вы не робот.",
    uz: "Iltimos, robot emasligingizni tasdiqlang.",
  },
  captcha_failed: {
    en: "Security check failed. Please try again.",
    ru: "Проверка безопасности не пройдена. Попробуйте ещё раз.",
    uz: "Xavfsizlik tekshiruvidan o‘tilmadi. Qayta urinib ko‘ring.",
  },
  rate_limited: {
    en: "Too many submissions. Please wait a few minutes and try again.",
    ru: "Слишком много заявок. Подождите несколько минут и попробуйте снова.",
    uz: "Juda ko‘p so‘rov yuborildi. Bir necha daqiqadan so‘ng qayta urinib ko‘ring.",
  },
};

/** Localized text for anti-spam error codes returned by the form APIs. */
export function spamMessage(code: string | undefined, locale: string): string | null {
  const entry = code ? MESSAGES[code] : undefined;
  if (!entry) return null;
  return entry[(locale as Locale) in entry ? (locale as Locale) : "en"];
}
