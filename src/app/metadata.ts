import type { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || "https://Clima.vercel.app";

export function generateMetadata({
  params,
}: {
  params: { lang?: string };
}): Metadata {
  const lang = params.lang || "en";

  return {
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: "/",
      languages: {
        "en-US": "/en",
        "fr-FR": "/fr",
        "es-ES": "/es",
      },
    },
    title: {
      default: "Clima - Your Personal Weather-Based Stylist",
      template: "%s | Clima",
    },
    description:
      "Get personalized clothing recommendations based on real-time weather data. Clima helps you dress appropriately for any weather condition, anywhere in the world.",
    keywords: [
      "weather clothing",
      "outfit recommendations",
      "weather-based fashion",
      "what to wear",
      "dress for weather",
      "clothing assistant",
    ],
    authors: [{ name: "Clima Team" }],
    creator: "Clima",
    publisher: "Clima",
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
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
      userScalable: false,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    },
    openGraph: {
      type: "website",
      locale: lang,
      url: baseUrl,
      siteName: "Clima",
      title: "Clima - Your Personal Weather-Based Stylist",
      description:
        "Get personalized clothing recommendations based on real-time weather data. Never be underdressed or overdressed again!",
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Clima - Weather-based clothing recommendations",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Clima - Your Personal Weather-Based Stylist",
      description:
        "Get personalized clothing recommendations based on real-time weather data.",
      images: [`${baseUrl}/og-image.jpg`],
      creator: "@Clima",
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
      other: {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    },
    manifest: "/manifest.json",
    other: {
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      "apple-mobile-web-app-title": "Clima",
      "format-detection": "telephone=no",
    },
  };
}
