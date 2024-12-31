"use client";

import "./globals.css";
import { Geologica, Newsreader } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { PhotoCreditsProvider } from "@/contexts/photo-credits-context";
import { JsonLd } from "@/components/json-ld";
import { PWARegister } from "@/components/pwa-register";
import { GoogleAnalytics } from "@/components/google-analytics";
import { usePathname } from "next/navigation";
import { defaultLanguage } from "@/i18n";

const geologica = Geologica({
  subsets: ["latin"],
  variable: "--font-geologica",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || defaultLanguage;
  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={lang} dir={dir} className={`${geologica.variable} ${newsreader.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="apple-mobile-web-app-title" content="Climode" />
        <meta name="application-name" content="Climode" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <GoogleAnalytics />
      </head>
      <body className={`${geologica.className}`}>
        {/* Google Tag Manager (noscript) */}
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MWS5XFXR"
height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe></noscript>
        {/* End Google Tag Manager (noscript) */}
        <LanguageProvider>
          <PhotoCreditsProvider>
            {children}
            <JsonLd />
            <PWARegister />
          </PhotoCreditsProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
