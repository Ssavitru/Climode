import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type Language, defaultLanguage } from "@/i18n";
import { withRateLimit } from "./middleware/rate-limit";

const LOCALES: Language[] = ['en', 'fr', 'es', 'de', 'it', 'ar'];

function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  return matchLocale(languages, LOCALES, defaultLanguage);
}

export async function middleware(request: NextRequest) {
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

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  
  // Redirect now
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/` and static files
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|.*\\..*).*)"],
};
