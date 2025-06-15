import { MetadataRoute } from "next";
import { type Language } from "@/i18n";

const languages: Language[] = ['en', 'fr', 'es', 'de', 'it', 'ar', 'ru'];
const baseUrl = process.env.BASE_URL || "https://Climode.vercel.app";

// Pages that should be available in all languages
const pages = [
  { path: "", priority: 1 },
  { path: "about", priority: 0.8 },
  { path: "privacy", priority: 0.5 },
  { path: "terms", priority: 0.5 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Add entries for all pages in all languages
  for (const lang of languages) {
    for (const page of pages) {
      const path = page.path ? `/${lang}/${page.path}` : `/${lang}`;
      entries.push({
        url: `${baseUrl}${path}`,
        lastModified: currentDate,
        changeFrequency: page.priority === 1 ? "daily" : "monthly",
        priority: page.priority,
      });
    }
  }

  // Add the root URL that redirects to default language
  entries.push({
    url: baseUrl,
    lastModified: currentDate,
    changeFrequency: "daily",
    priority: 1,
  });

  return entries;
}
