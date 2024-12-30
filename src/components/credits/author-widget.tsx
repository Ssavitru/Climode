"use client";

import Link from "next/link";
import { translations, type Language } from "@/i18n";

interface AuthorWidgetProps {
  language?: Language;
}

export function AuthorWidget({ language = "en" }: AuthorWidgetProps) {
  const t = translations[language];

  return (
    <div className="flex flex-col lg:flex-row items-start font-normal justify-start rounded-lg gap-0 lg:gap-1 text-xs text-white/80">
      <p className="text-center lg:text-left font-display mb-1 lg:mb-0">
        {t.app.slogan}
      </p>
      <div className="h-px w-10 bg-white/20 lg:mx-2 mb-1 lg:mb-0 lg:h-4 lg:w-px" />
      <p className="text-start lg:text-left mt-1 lg:mt-0">
        {language === "ar" && (
          <Link
            href="https://ilyesabd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors font-body"
          >
            Ilyes Abd-Lillah
          </Link>
        )}
        <span className="font-display"> {t.app.createdBy} </span>
        {language !== "ar" && (
          <Link
            href="https://ilyesabd.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-white/80 transition-colors"
          >
            Ilyes Abd-Lillah
          </Link>
        )}
      </p>
    </div>
  );
}
