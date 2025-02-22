import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { Provider } from "./provider";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script"; // Import the Script component

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
        url: "https://mesmer.uz/banner.png",
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
      <head>
        {/* Google Analytics Script */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-5NRZXYKKXW"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-5NRZXYKKXW');
            `,
          }}
        />

        {/* Yandex Metrika Script */}
        <Script
          id="yandex-metrika"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

              ym(100012016, "init", {
                   clickmap:true,
                   trackLinks:true,
                   accurateTrackBounce:true
              });
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Yandex Metrika Noscript Fallback */}
        <noscript>
          <div>
            <img
              src="https://mc.yandex.ru/watch/100012016"
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>

        <NextIntlClientProvider messages={messages}>
          <Toaster />
          <Provider>{children}</Provider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
