import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api/";
const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Default image for fallback - high quality city landscape
const DEFAULT_IMAGE = {
  url: "https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_1280.jpg",
  credit: {
    name: "Pixabay",
    url: "https://pixabay.com",
  },
};

// Language mapping for better search results
const languageMap: { [key: string]: string } = {
  fr: "fr",
  en: "en",
  es: "es",
  de: "de",
  it: "it",
  pt: "pt",
  ru: "ru",
  ja: "ja",
  ko: "ko",
  ar: "en", // fallback to English for Arabic
};

export async function GET(request: Request) {
  // Add cache control headers
  const response = new NextResponse();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const lang = (searchParams.get("lang") || "en").toLowerCase();
    const searchLang = languageMap[lang] || "en";

    if (!city) {
      console.log("No city provided");
      return NextResponse.json(DEFAULT_IMAGE, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    if (!PIXABAY_API_KEY) {
      console.error("PIXABAY_API_KEY is not configured");
      return NextResponse.json(DEFAULT_IMAGE, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Check Redis cache first
    const cacheKey = `cityImage:${city.toLowerCase()}_${country?.toLowerCase() || ""}_${lang}`;
    try {
      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log("Returning cached image for:", city, country);
        return NextResponse.json(cachedData, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    } catch (error) {
      console.error("Error accessing Redis:", error);
    }

    // Try different search strategies
    const searchStrategies = [
      // Strategy 1: City and country
      {
        q: country ? `${city} ${country}` : city,
        lang: searchLang,
      },
      // Strategy 2: City name with type
      {
        q: searchLang === "fr" ? `${city} ville` : `${city} city`,
        lang: searchLang,
      },
      // Strategy 3: Just city name
      {
        q: city,
        lang: searchLang,
      },
      // Strategy 4: English fallback with country
      {
        q: country ? `${city} ${country}` : `${city} city`,
        lang: "en",
      },
    ];

    let data = null;
    let response = null;

    for (const strategy of searchStrategies) {
      const params = new URLSearchParams({
        key: PIXABAY_API_KEY,
        q: strategy.q,
        lang: strategy.lang,
        image_type: "photo",
        orientation: "horizontal",
        category: "cities",
        safesearch: "true",
        per_page: "3",
        min_width: "1920",
        order: "popular",
      });

      try {
        console.log(
          "Trying search with:",
          strategy.q,
          "in language:",
          strategy.lang,
        );
        response = await fetch(`${PIXABAY_API_URL}?${params}`);

        if (!response.ok) {
          console.error("Pixabay API error:", response.status);
          continue;
        }

        data = await response.json();
        console.log(`Found ${data.hits?.length} results`);

        if (data.hits?.length > 0) {
          // Sort by likes and get the most liked image
          data.hits.sort((a: any, b: any) => b.likes - a.likes);
          break;
        }
      } catch (error) {
        console.error("Error fetching from Pixabay:", error);
        continue;
      }
    }

    // If no results found with any strategy, return default image
    if (!data?.hits?.length) {
      console.log("No results found for:", city, country);
      return NextResponse.json(DEFAULT_IMAGE, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Get the most liked image (first one after sorting)
    const bestImage = data.hits[0];

    if (!bestImage?.largeImageURL) {
      console.error("Invalid image data from Pixabay");
      return NextResponse.json(DEFAULT_IMAGE, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    const imageData = {
      url: bestImage.largeImageURL,
      credit: {
        name: bestImage.user,
        url: `https://pixabay.com/users/${bestImage.user}-${bestImage.user_id}/`,
      },
    };

    // Cache the result in Redis
    try {
      await redis.set(cacheKey, imageData, { ex: CACHE_DURATION });
      console.log("Cached image in Redis for:", city, country);
    } catch (error) {
      console.error("Error caching in Redis:", error);
    }

    return NextResponse.json(imageData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error("Error in cityImage API:", error);
    return NextResponse.json(DEFAULT_IMAGE, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
