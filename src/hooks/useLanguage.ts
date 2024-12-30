"use client";

import { useState, useEffect } from "react";
import { Language } from "@/types";

const DEFAULT_LANGUAGE: Language = "en";
const SUPPORTED_LANGUAGES: Language[] = ["en", "fr", "es", "de", "it", "ar"];

export function useLanguage(): [Language, (lang: Language) => void] {
  const [language, setLanguage] = useState<Language>("en");
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedLang = localStorage.getItem("language") as Language;
    if (storedLang && SUPPORTED_LANGUAGES.includes(storedLang)) {
      setLanguage(storedLang);
    } else {
      const browserLang = navigator.language.split("-")[0] as Language;
      setLanguage(
        SUPPORTED_LANGUAGES.includes(browserLang)
          ? browserLang
          : DEFAULT_LANGUAGE,
      );
    }
  }, []);

  const updateLanguage = (newLang: Language) => {
    if (SUPPORTED_LANGUAGES.includes(newLang)) {
      setLanguage(newLang);
      if (isClient) {
        localStorage.setItem("language", newLang);
        document.documentElement.lang = newLang;
        document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      }
    }
  };

  return [isClient ? language : DEFAULT_LANGUAGE, updateLanguage];
}
