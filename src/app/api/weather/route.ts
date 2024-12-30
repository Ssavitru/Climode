import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5";

interface WeatherCondition {
  id: number;
  description: string;
  icon: string;
  clouds?: number;
  dt?: number;
  hour?: number;
}

interface ProcessedForecast {
  date: string;
  location: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  tempAvg: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  precipitation: number;
  rainVolume: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
  weather: {
    description: string;
    icon: string;
    name: string;
  };
}

// Map our app languages to OpenWeather supported languages
const languageMap: { [key: string]: string } = {
  en: "en",
  fr: "fr",
  es: "sp", // OpenWeather uses 'sp' for Spanish
  de: "de",
  it: "it",
  ar: "ar",
};

// Get weather condition name that matches Google Weather style
function getConditionName(id: number): string {
  // Thunderstorm conditions (200-299)
  if (id >= 200 && id < 300) {
    if (id <= 202) return "Thunderstorm";
    if (id <= 232) return "Severe Thunderstorm";
    return "Thunderstorm";
  }

  // Drizzle conditions (300-399)
  if (id >= 300 && id < 400) {
    if (id <= 302) return "Light Drizzle";
    if (id <= 321) return "Drizzle";
    return "Heavy Drizzle";
  }

  // Rain conditions (500-599)
  if (id >= 500 && id < 600) {
    if (id === 500) return "Light Rain";
    if (id === 501) return "Moderate Rain";
    if (id >= 502 && id <= 504) return "Heavy Rain";
    if (id === 511) return "Freezing Rain";
    if (id >= 520 && id <= 531) return "Shower Rain";
    return "Rain";
  }

  // Snow conditions (600-699)
  if (id >= 600 && id < 700) {
    if (id === 600) return "Light Snow";
    if (id === 601) return "Snow";
    if (id === 602) return "Heavy Snow";
    if (id >= 611 && id <= 616) return "Sleet";
    if (id >= 620 && id <= 622) return "Snow Shower";
    return "Snow";
  }

  // Atmosphere conditions (700-799)
  if (id >= 700 && id < 800) {
    if (id === 701) return "Mist";
    if (id === 711) return "Smoke";
    if (id === 721) return "Haze";
    if (id === 731 || id === 761) return "Dust";
    if (id === 741) return "Fog";
    if (id === 751) return "Sand";
    if (id === 762) return "Ash";
    if (id === 771) return "Squall";
    if (id === 781) return "Tornado";
    return "Hazy";
  }

  // Clear and clouds (800-899)
  if (id === 800) return "Clear";
  if (id === 801) return "Partly Cloudy";
  if (id === 802) return "Scattered Clouds";
  if (id === 803) return "Broken Clouds";
  if (id === 804) return "Overcast";

  return "Unknown";
}

// Calculate UV index based on time of day and weather conditions
function calculateUVIndex(
  hour: number,
  clouds: number,
  weatherId: number,
): number {
  // Base UV index based on time of day (peak at noon)
  const baseUV =
    hour === 12
      ? 10 // Peak at noon
      : hour === 11 || hour === 13
        ? 9
        : hour === 10 || hour === 14
          ? 8
          : hour === 9 || hour === 15
            ? 7
            : hour === 8 || hour === 16
              ? 5
              : hour === 7 || hour === 17
                ? 3
                : 1;

  // Adjust for clouds
  let uvIndex = baseUV * (1 - clouds / 100);

  // Weather condition adjustments
  const weatherFactors: { [key: string]: number } = {
    thunderstorm: 0.3,
    drizzle: 0.5,
    rain: 0.4,
    snow: 0.8,
    atmosphere: 0.6,
  };

  if (weatherId >= 200 && weatherId < 300)
    uvIndex *= weatherFactors.thunderstorm;
  else if (weatherId >= 300 && weatherId < 400)
    uvIndex *= weatherFactors.drizzle;
  else if (weatherId >= 500 && weatherId < 600) uvIndex *= weatherFactors.rain;
  else if (weatherId >= 600 && weatherId < 700) uvIndex *= weatherFactors.snow;
  else if (weatherId >= 700 && weatherId < 800)
    uvIndex *= weatherFactors.atmosphere;

  return Math.round(Math.min(Math.max(uvIndex, 0), 11));
}

// Predict weather for days beyond the 5-day forecast
function predictFutureWeather(
  lastForecast: ProcessedForecast,
  trend: number,
  days: number,
): ProcessedForecast {
  const date = new Date(lastForecast.date);
  date.setDate(date.getDate() + days);

  return {
    ...lastForecast,
    date: date.toISOString().split("T")[0],
    temperature:
      Math.round((lastForecast.temperature + trend * days) * 10) / 10,
    tempMin: Math.round((lastForecast.tempMin + trend * days) * 10) / 10,
    tempMax: Math.round((lastForecast.tempMax + trend * days) * 10) / 10,
    tempAvg: Math.round((lastForecast.tempAvg + trend * days) * 10) / 10,
    sunrise: lastForecast.sunrise + days * 24 * 60 * 60 * 1000,
    sunset: lastForecast.sunset + days * 24 * 60 * 60 * 1000,
  };
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const country = searchParams.get("country");
    const weekly = searchParams.get("weekly") === "true";
    const language = searchParams.get("language") || "en";
    const weatherLang = languageMap[language] || "en";

    if (!city) {
      return NextResponse.json({ error: "City is required" }, { status: 400 });
    }

    // Format location query with city and country if provided
    const locationQuery = country ? `${city},${country}` : city;

    // Get coordinates with country code for more accurate results
    const geocodingUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(locationQuery)}&limit=1&appid=${WEATHER_API_KEY}`;
    const geocodingResponse = await fetch(geocodingUrl, { cache: "no-store" });
    const geocodingData = await geocodingResponse.json();

    if (!geocodingData.length) {
      return NextResponse.json(
        { error: "Location not found" },
        { status: 404 },
      );
    }

    const { lat, lon } = geocodingData[0];

    // Get current weather and 5-day forecast in parallel with language parameter
    const [currentData, forecastData] = await Promise.all([
      fetch(
        `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=${weatherLang}`,
      ).then((res) => res.json()),
      fetch(
        `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=${weatherLang}`,
      ).then((res) => res.json()),
    ]);

    // Use local name if available, fallback to provided city name
    const cityName =
      geocodingData[0].local_names?.[weatherLang] ||
      geocodingData[0].local_names?.en ||
      city;
    const countryName = geocodingData[0].country;
    const locationString = `${cityName}, ${countryName}`;

    // Process current weather data
    const today = new Date().toISOString().split("T")[0];

    // Initialize current day data with current weather reading
    const todayReadings = {
      temps: [currentData.main.temp],
      dayTemps: [],
      dayConditions: [],
    };

    // Add forecast readings for today
    const todayForecasts = forecastData.list.filter(
      (item) => item.dt_txt.split(" ")[0] === today,
    );

    todayForecasts.forEach((item) => {
      const hour = new Date(item.dt * 1000).getHours();
      const isDaytime = hour >= 6 && hour <= 18;

      todayReadings.temps.push(item.main.temp);

      if (isDaytime) {
        todayReadings.dayTemps.push(item.main.temp);
      }
    });

    const currentProcessed = {
      date: today,
      location: locationString,
      temperature: currentData.main.temp,
      feelsLike: currentData.main.feels_like,
      tempMin: Math.min(currentData.main.temp, ...todayReadings.temps),
      tempMax: Math.max(currentData.main.temp, ...todayReadings.temps),
      tempAvg: currentData.main.temp,
      humidity: currentData.main.humidity,
      pressure: currentData.main.pressure,
      windSpeed: currentData.wind.speed * 3.6,
      precipitation: currentData.rain?.["1h"] ? 100 : 0,
      rainVolume: currentData.rain?.["1h"] || 0,
      uvIndex: calculateUVIndex(
        new Date(currentData.dt * 1000).getHours(),
        currentData.clouds.all,
        currentData.weather[0].id,
      ),
      sunrise: currentData.sys.sunrise * 1000,
      sunset: currentData.sys.sunset * 1000,
      weather: {
        description: currentData.weather[0].description,
        icon: currentData.weather[0].icon,
        name: getConditionName(currentData.weather[0].id),
      },
    };

    // Process forecast data
    const processedForecasts = forecastData.list.reduce(
      (acc: { [key: string]: any }, item: any) => {
        const date = item.dt_txt.split(" ")[0];
        // Skip today's data since we have current weather
        if (date === today) return acc;

        const hour = new Date(item.dt * 1000).getHours();
        const isDaytime = hour >= 6 && hour <= 18;

        if (!acc[date]) {
          acc[date] = {
            date,
            location: locationString,
            dayTemps: [],
            dayConditions: [],
            temps: [],
            humidities: [],
            pressures: [],
            windSpeeds: [],
            precipitations: [],
            rain: [],
            tempMin: item.main.temp,
            tempMax: item.main.temp,
          };
        }

        // Track all readings
        acc[date].temps.push(item.main.temp);
        acc[date].humidities.push(item.main.humidity);
        acc[date].pressures.push(item.main.pressure);
        acc[date].windSpeeds.push(item.wind.speed * 3.6);
        acc[date].precipitations.push(item.pop);
        acc[date].rain.push(item.rain?.["3h"] || 0);

        // Track daytime readings separately
        if (isDaytime) {
          acc[date].dayTemps.push(item.main.temp);
          acc[date].dayConditions.push({
            id: item.weather[0].id,
            description: item.weather[0].description,
            icon: item.weather[0].icon,
            clouds: item.clouds.all,
            hour,
          });
        }

        // Update min/max
        acc[date].tempMin = Math.min(acc[date].tempMin, item.main.temp);
        acc[date].tempMax = Math.max(acc[date].tempMax, item.main.temp);

        return acc;
      },
      {},
    );

    // Convert processed data to final format and ensure unique dates
    const forecasts: ProcessedForecast[] = Object.values(processedForecasts)
      .map((forecast: any) => {
        const dayTemp =
          forecast.dayTemps.length > 0
            ? forecast.dayTemps.reduce((a: number, b: number) => a + b, 0) /
              forecast.dayTemps.length
            : forecast.temps.reduce((a: number, b: number) => a + b, 0) /
              forecast.temps.length;

        // Get most common daytime condition
        const conditions = forecast.dayConditions.reduce(
          (acc: any, curr: any) => {
            const key = `${curr.id}-${curr.icon}`;
            acc[key] = acc[key] || { count: 0, condition: curr };
            acc[key].count++;
            return acc;
          },
          {},
        );

        const conditionValues = Object.values(conditions);
        const mostCommonCondition =
          conditionValues.length > 0
            ? conditionValues.reduce((a: any, b: any) =>
                a.count > b.count ? a : b,
              ).condition
            : {
                id: 801,
                description: "partly cloudy",
                icon: "02d",
                clouds: 20,
                hour: new Date().getHours(),
              };

        // Calculate UV index
        const uvIndices = forecast.dayConditions.map((condition: any) =>
          calculateUVIndex(condition.hour, condition.clouds, condition.id),
        );

        const avgUvIndex =
          uvIndices.length > 0
            ? Math.round(
                uvIndices.reduce((a: number, b: number) => a + b, 0) /
                  uvIndices.length,
              )
            : 0;

        // Calculate precipitation
        const maxPrecipChance = Math.min(
          100,
          Math.round(Math.max(...forecast.precipitations) * 100),
        );
        const totalRainVolume = forecast.rain.reduce(
          (a: number, b: number) => a + b,
          0,
        );

        return {
          date: forecast.date,
          location: forecast.location,
          temperature: dayTemp,
          feelsLike: dayTemp,
          tempMin: forecast.tempMin,
          tempMax: forecast.tempMax,
          tempAvg: dayTemp,
          humidity: Math.round(
            forecast.humidities.reduce((a: number, b: number) => a + b, 0) /
              forecast.humidities.length,
          ),
          pressure: Math.round(
            forecast.pressures.reduce((a: number, b: number) => a + b, 0) /
              forecast.pressures.length,
          ),
          windSpeed:
            forecast.windSpeeds.reduce((a: number, b: number) => a + b, 0) /
            forecast.windSpeeds.length,
          precipitation: maxPrecipChance,
          rainVolume: totalRainVolume,
          uvIndex: avgUvIndex,
          sunrise: currentData.sys.sunrise * 1000,
          sunset: currentData.sys.sunset * 1000,
          weather: {
            description: mostCommonCondition.description,
            icon: mostCommonCondition.icon.endsWith("n")
              ? mostCommonCondition.icon.replace("n", "d")
              : mostCommonCondition.icon,
            name: getConditionName(mostCommonCondition.id),
          },
        };
      })
      .filter((forecast) => forecast.date !== today); // Ensure we exclude today's data

    // Add 2 more days for weekly forecast
    if (weekly && forecasts.length >= 2) {
      const lastTwo = forecasts.slice(-2);
      const trend = lastTwo[1].temperature - lastTwo[0].temperature;

      forecasts.push(
        predictFutureWeather(lastTwo[1], trend, 1),
        predictFutureWeather(lastTwo[1], trend, 2),
      );
    }

    // Return in the format expected by the frontend
    const future = forecasts.filter((f) => f.date !== today);

    return NextResponse.json({
      current: currentProcessed,
      forecast: future,
    });
  } catch (error) {
    console.error("Weather API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 },
    );
  }
}
