import { NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const PEXELS_API_URL = "https://api.pexels.com/v1/search";

// Default fallback images for different styles
const DEFAULT_IMAGES = {
  casual: [
    {
      url: "https://images.pexels.com/photos/2994400/pexels-photo-2994400.jpeg",
      alt: "Casual outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
    {
      url: "https://images.pexels.com/photos/2773977/pexels-photo-2773977.jpeg",
      alt: "Casual style outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
  ],
  formal: [
    {
      url: "https://images.pexels.com/photos/937481/pexels-photo-937481.jpeg",
      alt: "Formal outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
    {
      url: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg",
      alt: "Formal style outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
  ],
  sport: [
    {
      url: "https://images.pexels.com/photos/2294354/pexels-photo-2294354.jpeg",
      alt: "Sport outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
    {
      url: "https://images.pexels.com/photos/3768722/pexels-photo-3768722.jpeg",
      alt: "Sport style outfit",
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com",
    },
  ],
};

// Cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour
const RATE_LIMIT_RESET = 1000 * 60; // 1 minute

// Rate limiting implementation
let lastRequestTime = 0;
let requestsInWindow = 0;
const MAX_REQUESTS_PER_WINDOW = 30;
const RATE_LIMIT_WINDOW = 1000 * 60; // 1 minute

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

async function fetchWithRetry(
  url: string,
  options = {},
  maxRetries = 3,
): Promise<Response> {
  let lastError: Error | null = null;

  for (let i = 0; i < maxRetries; i++) {
    try {
      // Check rate limiting
      const now = Date.now();
      if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
        requestsInWindow = 0;
        lastRequestTime = now;
      }

      if (requestsInWindow >= MAX_REQUESTS_PER_WINDOW) {
        const waitTime = RATE_LIMIT_WINDOW - (now - lastRequestTime);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        requestsInWindow = 0;
        lastRequestTime = Date.now();
      }

      requestsInWindow++;
      const response = await fetch(url, options);

      if (response.status === 429) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (response.ok) {
        return response;
      }

      if (response.status >= 400) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }
  }

  throw lastError || new Error(`Failed after ${maxRetries} attempts`);
}

async function getFashionImages(query: string, style: string, count: number) {
  const cacheKey = `${query}-${style}-${count}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const searchQuery = style === "any" ? query : `${query} ${style} style outfit person`;
    const params = new URLSearchParams({
      query: searchQuery,
      per_page: "30",
      orientation: "portrait",
      size: "large",
      locale: "en-US",
    });

    const response = await fetchWithRetry(
      `${PEXELS_API_URL}?${params.toString()}`,
      {
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      },
    );

    const data = await response.json();

    if (!data.photos || data.photos.length === 0) {
      throw new Error("No photos found");
    }

    // Filter out photos that don't contain people or are likely not fashion-related
    const filteredPhotos = data.photos.filter((photo: any) => {
      const description = photo.alt?.toLowerCase() || "";
      const isLikelyFashion = 
        description.includes("person") || 
        description.includes("outfit") || 
        description.includes("fashion") ||
        description.includes("wear") ||
        description.includes("style");
      return isLikelyFashion;
    });

    if (filteredPhotos.length === 0) {
      throw new Error("No suitable fashion photos found");
    }

    const selectedPhotos = shuffleArray(filteredPhotos)
      .slice(0, count)
      .map((photo: any) => ({
        url: photo.src.large,
        alt: `${style === "any" ? "" : style + " "}outfit for ${query} weather`,
        photographer: photo.photographer,
        photographerUrl: photo.photographer_url,
      }));

    // Cache the successful result
    cache.set(cacheKey, {
      data: { outfits: selectedPhotos },
      timestamp: Date.now(),
    });

    return { outfits: selectedPhotos };
  } catch (error) {
    console.error("Error fetching fashion images:", error);
    // Return fallback images based on style
    const fallbackImages =
      style === "any"
        ? [
            ...DEFAULT_IMAGES.casual,
            ...DEFAULT_IMAGES.formal,
            ...DEFAULT_IMAGES.sport,
          ]
        : DEFAULT_IMAGES[style as keyof typeof DEFAULT_IMAGES] ||
          DEFAULT_IMAGES.casual;

    return {
      outfits: shuffleArray(fallbackImages).slice(0, count),
    };
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const style = searchParams.get("style") || "any";
  const count = Math.min(parseInt(searchParams.get("count") || "3", 10), 10); // Limit max count to 10

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 },
    );
  }

  if (!PEXELS_API_KEY) {
    console.error("Pexels API key is not configured");
    return NextResponse.json(
      { error: "API configuration error" },
      { status: 500 },
    );
  }

  try {
    const result = await getFashionImages(query, style, count);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error processing request:", error);
    // Return fallback images even in case of error
    const fallbackImages =
      style === "any"
        ? [
            ...DEFAULT_IMAGES.casual,
            ...DEFAULT_IMAGES.formal,
            ...DEFAULT_IMAGES.sport,
          ]
        : DEFAULT_IMAGES[style as keyof typeof DEFAULT_IMAGES] ||
          DEFAULT_IMAGES.casual;

    return NextResponse.json({
      outfits: shuffleArray(fallbackImages).slice(0, count),
    });
  }
}
