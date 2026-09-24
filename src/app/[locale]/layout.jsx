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
import { getEntries, getSingleton } from "@/lib/cms/server";
import { SiteDataProvider } from "@/components/site/site-data";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://www.mesmer.uz"),
  title: {
    default: "MESMER - Water Treatment & Wastewater Infrastructure EPC Contractor Uzbekistan",
    template: "%s",
  },
  description:
    "MESMER is a premier water treatment company and wastewater treatment EPC contractor in Uzbekistan & Central Asia. Turnkey WWTP & WTP construction, ADB and EBRD water infrastructure projects.",
  keywords: [
    "water treatment company Uzbekistan",
    "wastewater treatment EPC contractor",
    "WWTP contractor Central Asia",
    "WTP construction Uzbekistan",
    "water infrastructure contractor Uzbekistan",
    "wastewater treatment plant EPC",
    "ADB water projects Uzbekistan",
    "EBRD water projects Uzbekistan",
    "WWTP EPC Central Asia",
    "construction company Uzbekistan",
    "engineering company Uzbekistan",
    "infrastructure development",
    "EPC contractor Uzbekistan",
    "water management",
    "wastewater treatment",
    "MESMER",
    "project management",
    "civil engineering",
    "MESMER Uzbekistan",
    "очистка воды Узбекистан",
    "водоочистные сооружения",
    "очистные сооружения канализации",
    "EPC подрядчик Узбекистан",
    "suv tozalash O'zbekiston",
    "oqova suv tozalash",
    "EPC pudratchi O'zbekiston",
  ],
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      ru: "/ru",
      uz: "/uz",
      "x-default": "/en",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "MESMER - Water Treatment Company & Wastewater EPC Contractor Uzbekistan",
    description:
      "Premier EPC contractor for wastewater treatment plants (WWTP), water treatment plants (WTP), and municipal water infrastructure across Uzbekistan and Central Asia.",
    images: [
      {
        url: "https://www.mesmer.uz/banner.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "MESMER Water Treatment and Infrastructure EPC Contractor",
      },
    ],
    url: "https://www.mesmer.uz",
    siteName: "MESMER",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MESMER - Water Treatment Company & Wastewater EPC Contractor Uzbekistan",
    description:
      "Turnkey WWTP & WTP construction, ADB and EBRD water infrastructure projects across Uzbekistan & Central Asia.",
    images: ["https://www.mesmer.uz/banner.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || "google6ff0295843c08bf6",
  },
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
  // Serialisable copy for the client-side navbar
  const menu = JSON.parse(JSON.stringify(await getEntries("menu")));
  const texts = JSON.parse(JSON.stringify(await getSingleton("site_texts")));

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
              gtag('config', 'G-5NRZXYKKXW', {
                page_path: window.location.pathname,
              });
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

        {/* Structured Data: JSON-LD for Water Treatment EPC General Contractor */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["Organization", "GeneralContractor"],
              name: "MESMER",
              alternateName: "MESMER Uzbekistan",
              legalName: "MESMER-EAST LLC",
              url: "https://www.mesmer.uz",
              logo: "https://www.mesmer.uz/blacklogo.svg",
              image: "https://www.mesmer.uz/banner.png",
              telephone: "+998555188870",
              email: "info@mesmer.uz",
              sameAs: [
                "https://www.linkedin.com/company/mesmer-llc/",
              ],
              description:
                "Leading water treatment company and wastewater treatment EPC contractor in Uzbekistan & Central Asia. Turnkey WWTP EPC, WTP construction, ADB and EBRD water infrastructure projects.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Shiroq street, 100, Almazar district",
                addressLocality: "Tashkent",
                postalCode: "100069",
                addressCountry: "UZ",
              },
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+998555188870",
                contactType: "customer service",
                areaServed: ["UZ", "KZ", "KG", "TJ"],
                availableLanguage: ["English", "Russian", "Uzbek"],
              },
              areaServed: [
                { "@type": "Country", name: "Uzbekistan" },
                { "@type": "Place", name: "Central Asia" },
              ],
              knowsAbout: [
                "water treatment company Uzbekistan",
                "wastewater treatment EPC contractor",
                "WWTP contractor Central Asia",
                "WTP construction Uzbekistan",
                "water infrastructure contractor Uzbekistan",
                "wastewater treatment plant EPC",
                "ADB water projects Uzbekistan",
                "EBRD water projects Uzbekistan",
                "WWTP EPC Central Asia",
              ],
            }),
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
          <SiteDataProvider value={{ menu, texts }}>
            <Provider>{children}</Provider>
          </SiteDataProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
