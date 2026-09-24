"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Globe, FileText } from "lucide-react";

import { trackContactClick, trackDownload } from "@/lib/analytics";
import { PROJECT_CATEGORIES, t as cmsText } from "@/lib/cms/definitions";
import { useSiteData } from "@/components/site/site-data";

const EXTRA_LINKS = {
  expertise: { en: "Expertise", ru: "Экспертиза", uz: "Ekspertiza" },
  group: { en: "MESMER Group", ru: "Группа MESMER", uz: "MESMER Group" },
} as const;

type Locale = "uz" | "ru" | "en";

const LOCALES: Locale[] = ["uz", "ru", "en"];

const Footer = () => {
  const [constants, setConstants] = useState({
    email: "info@mesmer.uz",
    location: "Tashkent, Almazar district, Shiroq street, 100. ZIP 100069",
    address: {} as Partial<Record<Locale, string>> | undefined,
    profile_pdf: "" as string | undefined,
    footer_bg: "" as string | undefined,
  });

  const t = useTranslations("footer");
  const { texts } = useSiteData();
  const navbarLang = useTranslations("navbar");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchConstants = async () => {
      try {
        const res = await axios.get("/api/consts");
        if (res.data?.data?.constant) {
          setConstants((prev) => ({ ...prev, ...res.data.data.constant }));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchConstants();
  }, []);

  const changeLanguage = (lang: string) => {
    const parts = pathname.split("/");
    parts[1] = lang;
    router.push(parts.join("/") || `/${lang}`);
  };

  const companyLinks = [
    { href: `/${locale}`, label: t("home") },
    { href: `/${locale}/about`, label: navbarLang("about") },
    { href: `/${locale}/expertise`, label: EXTRA_LINKS.expertise[locale] },
    { href: `/${locale}/group`, label: EXTRA_LINKS.group[locale] },
    { href: `/${locale}/career`, label: navbarLang("career") },
    { href: `/${locale}/news`, label: navbarLang("news") },
    { href: `/${locale}/contact`, label: navbarLang("contacts") },
  ];

  const headingClass =
    "text-sm font-light uppercase leading-[22px] text-white/70";
  const linkClass =
    "text-base font-medium leading-6 tracking-[-0.01em] text-white transition-opacity hover:opacity-70";

  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Background photo fading to black */}
      <div className="absolute inset-0" aria-hidden="true">
        {constants.footer_bg ? (
          <Image
            src={constants.footer_bg}
            alt=""
            fill
            sizes="100vw"
            className="object-cover object-center"
          />
        ) : (
          // Default photo is zoomed toward the plant to hide the empty sky
          <Image
            src="/banner.jpg"
            alt=""
            fill
            sizes="100vw"
            className="origin-[50%_90%] scale-[1.6] object-cover object-[50%_80%] md:scale-[1.4]"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.9)_85%)]" />
      </div>

      <div className="relative flex flex-col gap-12 px-6 pt-16 md:pt-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Logo, language & tagline */}
          <div className="flex flex-col gap-5 lg:w-[323px] lg:shrink-0">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`} aria-label="MESMER">
                <Image
                  src="/logo_footer.svg"
                  alt="Mesmer Logo"
                  width={214}
                  height={32}
                  className="h-8 w-auto"
                />
              </Link>
              <label className="relative flex items-center gap-2 text-sm text-white">
                <Globe className="h-[18px] w-[18px]" strokeWidth={1.5} />
                <span>{locale.toUpperCase()}</span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
                <span className="sr-only">{t("language")}</span>
                <select
                  value={locale}
                  onChange={(e) => changeLanguage(e.target.value)}
                  className="absolute inset-0 cursor-pointer opacity-0"
                >
                  {LOCALES.map((l) => (
                    <option key={l} value={l} className="text-black">
                      {l.toUpperCase()}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <p className="text-lg leading-[1.2] text-white/70">{cmsText(texts?.footer_tagline, locale) || t("tagline")}</p>
          </div>

          {/* Columns */}
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-3">
            <div className="flex flex-col gap-2.5">
              <p className={headingClass}>{t("address")}</p>
              <p className="text-base font-medium leading-6 tracking-[-0.01em] text-white/70">
                {constants.address?.[locale] || constants.location}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className={headingClass}>{t("company")}</p>
              <nav className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex flex-col gap-2.5">
              <p className={headingClass}>{t("projects")}</p>
              <nav className="flex flex-col gap-2">
                {PROJECT_CATEGORIES.map((category) => (
                  <Link
                    key={category.value}
                    href={`/${locale}/projects?category=${category.value}`}
                    className={linkClass}
                  >
                    {category[locale]}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col-reverse gap-2 py-2.5 text-xs font-medium leading-4 text-white/55 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} MESMER-EAST LLC</p>
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <a
              href={constants.profile_pdf || "/MESMER%20RULES.pdf"}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackDownload("MESMER Company Profile & Rules")}
              className="inline-flex items-center gap-1.5 transition-colors hover:text-white underline decoration-white/30 underline-offset-4"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>{t("profile")}</span>
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={`mailto:${constants.email}`}
              onClick={() => trackContactClick("email", constants.email)}
              className="transition-colors hover:text-white"
            >
              {constants.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
