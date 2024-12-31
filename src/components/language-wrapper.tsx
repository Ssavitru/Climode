"use client";

import { type Language } from "@/i18n";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  lang: Language;
}

export function LanguageWrapper({ children, lang }: Props) {
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return <>{children}</>;
}
