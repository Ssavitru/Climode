import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_API_URL = "https://pixabay.com/api/";
const CACHE_DURATION = 24 * 60 * 60; // 24 hours in seconds

const DEFAULT_IMAGE = {
  url: "https://images.unsplash.com/photo-1523374228107-6e44bd2b524e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  alt: "Andre Benz",
  photographer: "Unsplash",
  photographerUrl: "https://unsplash.com/fr/@trapnation",
};
// Initialize Redis client outside the handler to avoid reconnection overhead
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  automaticDeserialization: false  // Disable automatic JSON parsing
});

// Memoize the fetch promises to prevent duplicate requests
const fetchCache = new Map();

async function fetchWithTimeout(url: string, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function GET(request: Request) {
  const startTime = Date.now();
  console.log('Request started');
  
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city")?.toLowerCase();
    const country = searchParams.get("country")?.toLowerCase();
    const lang = (searchParams.get("lang") || "en").toLowerCase();
    
    // Early return conditions
    if (!city || !PIXABAY_API_KEY) {
      return NextResponse.json(DEFAULT_IMAGE);
    }

    // Unified cache key
    const cacheKey = `cityImage:${city}_${country || ""}_${lang}`;
    
    // Check Redis cache with error handling and timeout
    try {
      const cachedData = await Promise.race([
        redis.get(cacheKey),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Redis timeout')), 3000)
        )
      ]);
      
      if (cachedData) {
        console.log(`Cache hit: ${Date.now() - startTime}ms`);
        return NextResponse.json(JSON.parse(cachedData as string));
      }
    } catch (error) {
      console.error("Redis error:", error);
      // Continue execution instead of failing
    }

    // Use the first successful strategy
    const searchQuery = country ? `${city} ${country}` : `${city} city`;
    const params = new URLSearchParams({
      key: PIXABAY_API_KEY,
      q: searchQuery,
      lang: lang,
      image_type: "photo",
      orientation: "horizontal",
      category: "cities",
      safesearch: "true",
      per_page: "3",
      min_width: "1920",
      order: "popular",
    });

    const cacheKey2 = params.toString();
    if (!fetchCache.has(cacheKey2)) {
      fetchCache.set(
        cacheKey2,
        fetchWithTimeout(`${PIXABAY_API_URL}?${params}`)
      );
    }

    const response = await fetchCache.get(cacheKey2);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    
    if (!data?.hits?.length) {
      console.log(`No results: ${Date.now() - startTime}ms`);
      return NextResponse.json(DEFAULT_IMAGE);
    }

    const imageData = {
      url: data.hits[0].largeImageURL,
      credit: {
        name: data.hits[0].user,
        url: `https://pixabay.com/users/${data.hits[0].user}-${data.hits[0].user_id}/`,
      },
    };

    // Async cache update without awaiting
    redis.set(cacheKey, JSON.stringify(imageData), { ex: CACHE_DURATION })
      .catch(error => console.error("Redis cache error:", error));

    console.log(`Success: ${Date.now() - startTime}ms`);
    return NextResponse.json(imageData);
    
  } catch (error) {
    console.error(`Error: ${Date.now() - startTime}ms`, error);
    return NextResponse.json(DEFAULT_IMAGE);
  }
}