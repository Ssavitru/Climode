// app/api/cityImage/route.ts
import { NextResponse } from "next/server";
import { getRedis } from "@/lib/redis";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api/";
const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

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

// Default image for fallback
const DEFAULT_IMAGE = { url: "https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Andre Benz", photographer: "Unsplash", photographerUrl: "https://unsplash.com/fr/@trapnation", };

async function fetchPixabayImage(searchQuery: string, lang: string) {
  const params = new URLSearchParams({
    key: PIXABAY_API_KEY!,
    q: searchQuery,
    lang,
    image_type: "photo",
    orientation: "horizontal",
    category: "cities",
    safesearch: "true",
    per_page: "3",
    min_width: "1920",
    order: "popular",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`${PIXABAY_API_URL}?${params}`, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export async function GET(request: Request) {
  const startTime = Date.now();
  const requestId = Math.random().toString(36).substring(7);
  console.log(`${requestId} INFO Request started`);

  const redis = getRedis();

  try {
    // Parse request parameters
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.toLowerCase();
    const country = searchParams.get("country")?.toLowerCase();
    const lang = (searchParams.get("lang") || "en").toLowerCase();
    const searchLang = languageMap[lang] || "en";

    // Early return for missing parameters
    if (!city || !PIXABAY_API_KEY) {
      console.log(`${requestId} INFO Early return - missing parameters`);
      return NextResponse.json(DEFAULT_IMAGE);
    }

    const cacheKey = `cityImage:${city}_${country || ""}_${lang}`;
    
    // Try Redis cache if available
    if (redis) {
      try {
        const cachedData = await Promise.race([
          redis.get(cacheKey),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Redis timeout')), 2000)
          )
        ]);

        if (cachedData) {
          console.log(`${requestId} INFO Cache hit: ${Date.now() - startTime}ms`);
          // Handle both string and object cases
          const parsedData = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
          return NextResponse.json(parsedData);
        }
      } catch (error) {
        console.error(`${requestId} ERROR Redis error:`, error);
        // Continue execution without cache
      }
    }

    // Try different search strategies
    const searchStrategies = [
      country ? `${city} ${country}` : `${city} city`,
      `${city} cityscape`,
      `${city} downtown`,
      city
    ];

    let data = null;
    let error = null;

    for (const searchQuery of searchStrategies) {
      try {
        console.log(`${requestId} INFO Trying search: ${searchQuery}`);
        data = await fetchPixabayImage(searchQuery, searchLang);
        
        if (data?.hits?.length > 0) {
          break;
        }
      } catch (err) {
        error = err;
        console.error(`${requestId} ERROR Search failed for: ${searchQuery}`, err);
        continue;
      }
    }

    if (!data?.hits?.length) {
      console.log(`${requestId} INFO No results found: ${Date.now() - startTime}ms`);
      if (error) {
        console.error(`${requestId} ERROR Last error:`, error);
      }
      // Store default image in cache
      if (redis) {
        redis.set(cacheKey, JSON.stringify(DEFAULT_IMAGE), { ex: CACHE_DURATION })
          .catch(error => console.error(`${requestId} ERROR Redis cache error:`, error));
      }
      return NextResponse.json(DEFAULT_IMAGE);
    }

    // Sort by likes and get the best image
    const bestImage = data.hits.sort((a: any, b: any) => b.likes - a.likes)[0];

    const imageData = {
      url: bestImage.largeImageURL,
      credit: {
        name: bestImage.user,
        url: `https://pixabay.com/users/${bestImage.user}-${bestImage.user_id}/`,
      },
    };

    // Store in cache if Redis is available
    if (redis) {
      redis.set(cacheKey, JSON.stringify(imageData), { ex: CACHE_DURATION })
        .catch(error => console.error(`${requestId} ERROR Redis cache error:`, error));
    }

    console.log(`${requestId} INFO Success: ${Date.now() - startTime}ms`);
    return NextResponse.json(imageData);

  } catch (error) {
    console.error(`${requestId} ERROR`, error);
    return NextResponse.json(DEFAULT_IMAGE);
  }
}