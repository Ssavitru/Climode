import { type Language } from "@/i18n";
import { LanguageWrapper } from "@/components/language-wrapper";
import { generateMetadata } from "./metadata";

interface Props {
  children: React.ReactNode;
  params: { lang: Language };
}

export { generateMetadata };

export default function LocalizedLayout({
  children,
  params: { lang },
}: Props) {
  return (
    <LanguageWrapper lang={lang}>
      <div data-lang={lang}>
        {children}
      </div>
    </LanguageWrapper>
  );
}
