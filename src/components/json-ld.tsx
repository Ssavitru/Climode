"use client";

import { useEffect } from "react";

export function JsonLd() {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Clima",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Any",
      description:
        "Get personalized clothing recommendations based on real-time weather data.",
      featureList: [
        "Real-time weather data",
        "Personalized clothing recommendations",
        "Multiple language support",
        "Location-based suggestions",
        "Temperature preferences",
      ],
      screenshot: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/og-image.jpg`,
        caption: "Clima App Interface",
      },
      author: {
        "@type": "Organization",
        name: "Clima Team",
      },
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
