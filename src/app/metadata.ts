import type { Metadata } from "next";
import { getDictionary, type Language, defaultLanguage } from "@/i18n";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://Climode.vercel.app";

export async function generateMetadata({
  params,
}: {
  params: { lang?: Language };
}): Promise<Metadata> {
  const lang = (params.lang || defaultLanguage) as Language;
  const dict = await getDictionary(lang);

  const title = dict.metadata.title || "Cliode - Your Personal Weather-Based Stylist";
  const description = dict.metadata.description || "Get personalized clothing recommendations based on real-time weather data. Climode helps you dress appropriately for any weather condition, anywhere in the world.";

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        'en': '/en',
        'fr': '/fr',
        'es': '/es',
        'de': '/de',
        'it': '/it',
        'ar': '/ar',
        'x-default': '/',
      },
    },
    title: {
      default: title,
      template: `%s | ${dict.metadata.siteName || 'Climode'}`,
    },
    description,
    keywords: [
      "weather clothing",
      "outfit recommendations",
      "weather-based fashion",
      "what to wear",
      "dress for weather",
      "clothing assistant",
    ],
    authors: [{ name: "Climode Team" }],
    creator: "Climode",
    publisher: "Climode",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    themeColor: "#ffffff",
    openGraph: {
      type: 'website',
      locale: lang,
      alternateLocale: ['en', 'fr', 'es', 'de', 'it', 'ar'] as Language[],
      url: baseUrl,
      siteName: dict.metadata.siteName || 'Climode',
      title,
      description,
      images: [
        {
          url: `${baseUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@Climode',
      images: [`${baseUrl}/twitter-image.jpg`],
    },
  };
}
