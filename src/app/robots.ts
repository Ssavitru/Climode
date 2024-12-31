import { MetadataRoute } from "next";

const baseUrl = process.env.BASE_URL || "https://Climode.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/*"],
        disallow: [
          "/api/*",          // Protect API routes
          "/private/*",      // Protect private routes
          "/_next/*",        // Protect Next.js system files
          "/*.json",         // Protect JSON files
          "/*/api/*",        // Protect language-specific API routes
          "/*/private/*",    // Protect language-specific private routes
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/nogooglebot/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/nobingbot/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
