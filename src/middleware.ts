import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type Language, defaultLanguage } from "@/i18n";
import { withRateLimit } from "./middleware/rate-limit";

const LOCALES: Language[] & string[] = ['en', 'fr', 'es', 'de', 'it', 'ar', 'ru'] as const;

function getLocale(request: NextRequest): string {
  try {
    const negotiatorHeaders: Record<string, string> = {};
    request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

    // Get the preferred languages from the request
    const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
    
    // If languages array is empty, return default language
    if (!languages.length) {
      return defaultLanguage;
    }

    return matchLocale(languages, LOCALES, defaultLanguage);
  } catch (error) {
    // If anything goes wrong, safely fall back to default language
    return defaultLanguage;
  }
}

export async function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;

    // Skip if the request is for static files or API
    if (
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.includes('.')
    ) {
      if (pathname.startsWith('/api')) {
        return withRateLimit(request, async (req) => {
          return NextResponse.next();
        });
      }
      return NextResponse.next();
    }

    // Check if there is any supported locale in the pathname
    const pathnameLocale = LOCALES.find(
      (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    if (pathnameLocale) return NextResponse.next();

    // Get locale with error handling
    const locale = getLocale(request);
    
    // Ensure we have a valid locale before redirecting
    const safeLocale = LOCALES.includes(locale) ? locale : defaultLanguage;
    
    // Construct the new URL carefully
    request.nextUrl.pathname = `/${safeLocale}${pathname === '/' ? '' : pathname}`;
    
    // Redirect now
    return NextResponse.redirect(request.nextUrl);
  } catch (error) {
    // If anything fails, redirect to default language
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLanguage}${request.nextUrl.pathname}`;
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\..*).*)"],
};