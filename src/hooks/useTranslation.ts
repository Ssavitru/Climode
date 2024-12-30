import { useCallback } from "react";
import { Language } from "@/types";
import translations from "@/translations";

type TranslationKey = keyof typeof translations.en;

export function useTranslation(language: Language) {
  const t = useCallback(
    (key: TranslationKey, params?: Record<string, string | number>) => {
      const translation =
        translations[language]?.[key] || translations.en[key] || key;

      if (params) {
        return Object.entries(params).reduce(
          (acc, [key, value]) => acc.replace(`{{${key}}}`, String(value)),
          translation,
        );
      }

      return translation;
    },
    [language],
  );

  return { t };
}
