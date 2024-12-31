"use client";

import { type Language } from "@/i18n";
import { use } from "react";

interface Props {
  children: React.ReactNode;
  params: Promise<{
    lang: Language;
  }>;
}

export default function LocalizedLayout({
  children,
  params,
}: Props) {
  const { lang } = use(params);
  
  return (
    <div data-lang={lang}>
      {children}
    </div>
  );
}
