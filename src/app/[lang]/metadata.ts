import { Metadata } from "next";
import { getDictionary, defaultLanguage } from "@/i18n";
import { Language } from "@/types";

const baseUrl = process.env.BASE_URL || "https://climode.app";

type GenerateMetadataProps = {
  params: { lang: Language };
};

export async function generateMetadata({
  params: { lang = defaultLanguage },
}: GenerateMetadataProps): Promise<Metadata> {
  const dict = await getDictionary(lang);

  const title = dict.metadata.title;
  const description = dict.metadata.description;

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
      template: `%s | ${dict.metadata.siteName}`,
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
    openGraph: {
      type: "website",
      title,
      description,
      url: baseUrl,
      siteName: dict.metadata.siteName,
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: lang,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.png"],
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
    icons: {
      icon: [
        { url: "/favicon.ico" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-touch-icon.png" },
      ],
    },
    manifest: "/manifest.json",
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
    applicationName: dict.metadata.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    themeColor: "#ffffff",
    category: "lifestyle",
  };
}
