import { Metadata } from "next";
import { getDictionary, defaultLanguage } from "@/i18n";
import { Language } from "@/types";

const baseUrl = process.env.BASE_URL || "https://climode.app";

type Props = {
  params: { lang: Language };
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { params } = props;
  const response = await params;
  const lang = response.lang || defaultLanguage;
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
        'ru': '/ru',
        'x-default': '/',
      },
    },
    title: {
      default: title,
      template: `%s | ${dict.metadata.siteName}`,
    },
    description,
    keywords: [
      // English
      "weather clothing", "outfit recommendations", "weather-based fashion", "what to wear", "dress for weather", "clothing assistant",
      "fashion ai", "weather outfit planner", "smart wardrobe", "daily outfit generator",
      "fashion", "outfits", "clothing", "wardrobe", "style", "weather", "clothes", "dress", "wear", "attire",
      "apparel", "looks", "trends", "fashion", "seasonal", "temperature", "climate", "forecast", "recommendations",
      // French
      "vêtements météo", "tenue du jour", "mode selon météo", "quoi porter", "assistant vestimentaire", "mode intelligente",
      "mode", "vetements", "tenue", "meteo", "habits", "style", "garde-robe", "tendances", "saison",
      // Spanish
      "ropa según clima", "outfit del día", "moda según tiempo", "qué ponerme", "asistente de moda", "armario inteligente",
      "moda", "ropa", "clima", "vestimenta", "estilo", "tiempo", "armario", "temporada", "tendencias",
      // German
      "wetterkleidung", "outfit empfehlungen", "wetterbasierte mode", "was anziehen", "kleidungsassistent", "intelligente garderobe",
      "mode", "kleidung", "wetter", "stil", "garderobe", "trends", "saison", "outfit", "kleid",
      // Italian
      "abbigliamento meteo", "outfit del giorno", "moda secondo tempo", "cosa indossare", "assistente moda", "guardaroba intelligente",
      "moda", "vestiti", "tempo", "stile", "guardaroba", "tendenze", "stagione", "abbigliamento", "vestire",
      // Arabic
      "ملابس الطقس", "توصيات الملابس", "أزياء حسب الطقس", "ماذا ألبس", "مساعد الملابس", "خزانة ملابس ذكية",
      "موضة", "ملابس", "طقس", "أزياء", "ستايل", "فاشون", "خزانة", "موسم", "لبس",
      // Русский
      "погодный гардероб", "образ на сегодня", "мода по погоде", "что надеть", "модный ассистент", "умный гардероб",
      "мода", "одежда", "погода", "стиль", "гардероб", "тенденции", "сезон", "наряд", "одеваться",
      // Trending Terms
      "AI fashion", "sustainable fashion", "smart clothing", "eco-friendly outfits", "minimalist wardrobe",
      "capsule wardrobe", "weather-smart fashion", "climate-adaptive clothing", "outfit inspiration", "style assistant",
      // Single Word Trending
      "AI", "sustainable", "smart", "eco", "minimal", "capsule", "trendy", "stylish", "fashionable", "chic",
      "aesthetic", "minimalist", "sustainable", "trendsetter", "influencer", "streetwear", "casual", "formal",
      "seasonal", "winter", "summer", "spring", "autumn", "fall", "rain", "sun", "cold", "hot", "warm", "cool",
      "layering", "accessories", "shoes", "boots", "coats", "jackets", "sweaters", "dresses", "pants", "shirts"
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
    applicationName: dict.metadata.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    category: "lifestyle",
  };
}
