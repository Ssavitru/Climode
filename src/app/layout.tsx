'use client';

import './globals.css';
import { Geologica, Newsreader } from 'next/font/google';
import { LanguageProvider, useLanguage } from '@/contexts/language-context';
import { PhotoCreditsProvider } from '@/contexts/photo-credits-context';
import { getTranslation } from '@/i18n';
import { JsonLd } from '@/components/json-ld';
import { PWARegister } from '@/components/pwa-register';

const geologica = Geologica({ 
  subsets: ['latin'],
  variable: '--font-geologica',
});

const newsreader = Newsreader({ 
  subsets: ['latin'],
  variable: '--font-newsreader',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geologica.variable} ${newsreader.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DressSmart" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="DressSmart" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        
        <JsonLd />
        <PWARegister />
      </head>
      <body className={geologica.className}>
        <PhotoCreditsProvider>
        <LanguageProvider>
          <LanguageUpdater>
            {children}
          </LanguageUpdater>
          </LanguageProvider>
        </PhotoCreditsProvider>
      </body>
    </html>
  );
}

function LanguageUpdater({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();
  
  // Update html lang attribute when language changes
  if (typeof document !== 'undefined') {
    document.documentElement.lang = language;
    document.title = `DressSmart - ${getTranslation(language).app.slogan}`;
  }
  
  return children;
}
