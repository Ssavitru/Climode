import { useLanguage } from "@/contexts/language-context";
import { getTranslation } from "@/i18n";
import Head from "next/head";

export function MetaTags() {
  const { language } = useLanguage();
  const translations = getTranslation(language);

  return (
    <Head>
      <meta name="apple-mobile-web-app-title" content={translations.app.title} />
      <meta name="application-name" content={translations.app.title} />
      <title>{`${translations.app.title} - ${translations.app.slogan}`}</title>
    </Head>
  );
}
