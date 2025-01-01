import { defaultLanguage, type Language } from "@/i18n";
import { LanguageWrapper } from "@/components/language-wrapper";
import { generateMetadata } from "./metadata";
import { viewport } from "./viewport";

interface Props {
  children: React.ReactNode;
  params: { lang: Language | Promise<Language> };
}

export { generateMetadata, viewport };

export default async function LocalizedLayout({
  children,
  params,
}: Props) {
  const resolvedParams = await params;
  const resolvedLang = resolvedParams.lang || defaultLanguage;

  return (
    <LanguageWrapper lang={resolvedLang}>
      <div data-lang={resolvedLang}>
        {children}
      </div>
    </LanguageWrapper>
  );
}
