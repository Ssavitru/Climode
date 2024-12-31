import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type Language, defaultLanguage } from "@/i18n";

const LOCALES: Language[] = ['en', 'fr', 'es', 'de', 'it', 'ar'];

function getLocale(request: NextRequest): Language {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // @ts-ignore locales are readonly
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  
  try {
    const locale = matchLocale(languages, LOCALES, defaultLanguage);
    return locale as Language;
  } catch (e) {
    return defaultLanguage;
  }
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip if the request is for static files or API
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if the pathname starts with our supported locales
  const pathnameIsMissingLocale = LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Special handling for root path
  if (pathname === '/') {
    const locale = getLocale(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // Handle paths with locale
  const matchesLocale = LOCALES.some(locale => 
    pathname.startsWith(`/${locale}`) || pathname === `/${locale}`
  );

  // If path has locale but it's not valid, redirect to default
  if (!pathnameIsMissingLocale && !matchesLocale) {
    return NextResponse.redirect(new URL(`/${defaultLanguage}${pathname}`, request.url));
  }

  // If path is missing locale, add it
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|[\\w-]+\\.\\w+).*)',
  ],
};
