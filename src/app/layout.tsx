"use client";

import "./globals.css";
import { Geologica, Newsreader } from "next/font/google";
import { LanguageProvider } from "@/contexts/language-context";
import { PhotoCreditsProvider } from "@/contexts/photo-credits-context";
import { JsonLd } from "@/components/json-ld";
import { PWARegister } from "@/components/pwa-register";

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
  return (
    <html lang="en">
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
      </head>
      <body className={`${geologica.variable} ${newsreader.variable}`}>
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
