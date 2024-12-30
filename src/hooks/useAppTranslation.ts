import { translations } from '@/i18n';

type Language = 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';

export function useAppTranslation(language: Language) {
  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return value || key;
  };

  return { t };
}
