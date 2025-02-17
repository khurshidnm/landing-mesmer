import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "./provider";
import { Toaster } from "@/components/ui/toaster";

// next-intl
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title:
    "MESMER - One of the Leading Construction & Engineering Company in Uzbekistan",
  description:
    "MESMER is one of Uzbekistan's top construction and engineering companies, specializing in infrastructure, water management, and EPC projects. With 20+ years of expertise, we deliver innovative and sustainable solutions. Contact us today!",
  keywords: [
    "construction company Uzbekistan",
    "engineering company Uzbekistan",
    "infrastructure development",
    "EPC contractor Uzbekistan",
    "water management",
    "wastewater treatment",
    "MESMER",
    "project management",
    "sustainable construction",
    "road construction Uzbekistan",
    "building company",
    "civil engineering",
    "MESMER Uzbekistan",
    "international construction",
    "smart cities Uzbekistan",
    "energy infrastructure Uzbekistan",
    "строительная компания Узбекистан",
    "проектирование зданий",
    "инженерные проекты Узбекистан",
    "строительство дорог",
    "управление проектами",
    "очистка воды",
    "водоснабжение",
    "мелиорация",
    "строительство объектов",
    "энергетическая инфраструктура",
    "мосты и дороги",
    "строительство заводов",
    "строительство жилых комплексов",
    "MESMER Tashkent",
    "экологически чистые технологии",
    "инновационные строительные решения",
    "инвестиции в строительство",
    "qurilish kompaniyasi O'zbekiston",
    "muhandislik loyihalari",
    "infratuzilma rivojlantirish",
    "EPC pudratchi O'zbekiston",
    "suv ta'minoti",
    "oqova suv tozalash",
    "MESMER Uzbekistan",
    "loyiha boshqaruvi",
    "barqaror qurilish",
    "yo‘l qurilishi",
    "ko‘prik qurilishi",
    "zavod qurilishi",
    "turar-joy qurilishi",
    "Toshkent qurilish kompaniyasi",
    "ekologik toza texnologiyalar",
    "innovatsion qurilish yechimlari",
    "O‘zbekistonda investitsiyalar",
  ],
  robots: "index, follow",
  openGraph: {
    title:
      "MESMER - One of the Leading Construction & Engineering Company in Uzbekistan",
    description:
      "Discover innovative construction and engineering solutions with MESMER, a top EPC contractor in Uzbekistan specializing in sustainable infrastructure projects.",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "MESMER Banner",
      },
    ],
    url: "https://www.mesmer.uz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MESMER - Top Construction Company in Uzbekistan",
    description:
      "Industry-leading construction and engineering solutions in Uzbekistan. Specializing in infrastructure, water management, and sustainable development.",
    images: ["/banner.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default async function LocaleLayout({ children, params }) {
  const resolvedParams = await params; // Await the params object
  const { locale } = resolvedParams;

  // Ensure the incoming `locale` is valid
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Fetch messages for the locale
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning={true}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Toaster />
          <Provider>{children}</Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
