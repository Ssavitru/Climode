"use client";

import { useState, useEffect } from "react";
import { Language } from "@/types";
import { getTranslation } from "@/i18n";
import { usePathname } from "next/navigation";

const DEFAULT_LANGUAGE: Language = "en";
const SUPPORTED_LANGUAGES: Language[] = ["en", "fr", "es", "de", "it", "ar", "ru" ];

export function useLanguage(): [Language, (lang: Language) => void] {
  const pathname = usePathname();
  const routeLang = pathname?.split('/')[1] as Language;
  const [language, setLanguage] = useState<Language>(
    SUPPORTED_LANGUAGES.includes(routeLang) ? routeLang : DEFAULT_LANGUAGE
  );
  const [isClient, setIsClient] = useState(false);
  
  // Update language when route changes
  useEffect(() => {
    if (routeLang && SUPPORTED_LANGUAGES.includes(routeLang)) {
      setLanguage(routeLang);
    }
  }, [routeLang]);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      setLanguage(storedLang);
    }
  }, []);

  const updateLanguage = (lang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(lang)) {
      setLanguage(lang);
    }
  };

  return [language, updateLanguage];
}
