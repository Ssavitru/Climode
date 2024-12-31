import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");
    const limit = searchParams.get("limit") || "5";

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 },
      );
    }

    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=${limit}&appid=${WEATHER_API_KEY}`;
    const response = await fetch(geocodingUrl);
    const data = await response.json();

    // Format the response to only include necessary data
    const locations = data.map((item: any) => ({
      city: item.name,
      country: item.country,
      state: item.state,
      lat: item.lat,
      lon: item.lon,
      local_names: item.local_names,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Error in geocoding API:", error);
    return NextResponse.json(
      { error: "Failed to fetch locations" },
      { status: 500 },
    );
  }
}
