import { translations, type Language } from "@/i18n";

// Types
export type ClothingType =
  | "hat"
  | "jacket"
  | "sweater"
  | "shirt"
  | "pants"
  | "shorts"
  | "shoes"
  | "umbrella"
  | "sunglasses"
  | "scarf"
  | "gloves";

interface WeatherConditions {
  temperature: number;
  isRaining: boolean;
  windSpeed: number;
  humidity: number;
  unit?: "C" | "F";
  uv?: number; // UV index (0-11+)
}

interface ClothingRecommendation {
  type: ClothingType;
  description: string;
  priority: "high" | "medium" | "low";
  isOptional: boolean;
}

// Utility functions
function getStoredLanguage(): Language {
  if (typeof window === "undefined") return "en";

  const savedLanguage = localStorage.getItem("preferredLanguage") as Language;
  if (savedLanguage) return savedLanguage;

  const browserLang = navigator.language.split("-")[0];
  if (["en", "fr", "es", "de", "it", "ar"].includes(browserLang)) {
    return browserLang as Language;
  }

  return "en";
}

function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

// Core recommendation logic
function getWeatherCategory(
  temp: number,
  windSpeed: number,
  humidity: number,
  uv?: number,
) {
  return {
    isFreezing: temp <= 0,
    isVeryCold: temp > 0 && temp <= 5,
    isCold: temp > 5 && temp <= 12,
    isMild: temp > 12 && temp <= 20,
    isWarm: temp > 20 && temp <= 25,
    isHot: temp > 25 && temp <= 30,
    isVeryHot: temp > 30,
    isWindy: windSpeed > 20,
    isVeryWindy: windSpeed > 30,
    isHumid: humidity > 70,
    // If UV is undefined, use temperature as fallback
    isHighUV: uv !== undefined ? uv >= 6 : temp >= 25,
    isLowUV: uv !== undefined ? uv >= 3 && uv < 6 : temp >= 22 && temp < 25,
  };
}

function getClothingDescription(
  type: ClothingType,
  weather: ReturnType<typeof getWeatherCategory>,
  isRaining: boolean,
  language: Language,
): string {
  const t = translations[language];
  if (!t) return "";

  const getDescription = (key: string) => t.weather.descriptions[key] || "";

  switch (type) {
    case "hat":
      if (weather.isFreezing) return getDescription("winterHat");
      if (weather.isVeryCold) return getDescription("warmHat");
      if (weather.isHot || weather.isVeryHot) return getDescription("sunHat");
      if (weather.isCold) return getDescription("generalHat");
      return getDescription("optionalHat");

    case "jacket":
      if (weather.isFreezing) return getDescription("heavyCoat");
      if (weather.isVeryCold) return getDescription("warmJacket");
      if (weather.isCold) return getDescription("lightJacket");
      if (isRaining && !weather.isHot && !weather.isVeryHot)
        return getDescription("rainJacket");
      if (weather.isWindy && !weather.isHot && !weather.isVeryHot)
        return getDescription("windbreaker");
      return getDescription("optionalJacket");

    case "sweater":
      if (weather.isVeryCold) return getDescription("heavySweater");
      if (weather.isCold) return getDescription("lightSweater");
      return getDescription("optionalSweater");

    case "shirt":
      if (weather.isVeryCold) return getDescription("thermalShirt");
      if (weather.isCold) return getDescription("longSleeveShirt");
      if (weather.isHot) return getDescription("tshirt");
      return getDescription("regularShirt");

    case "pants":
      if (weather.isFreezing) return getDescription("insulatedPants");
      if (weather.isVeryCold) return getDescription("warmPants");
      if (weather.isVeryHot) return getDescription("lightPants");
      return getDescription("regularPants");

    case "shorts":
      if (weather.isHot || weather.isVeryHot)
        return getDescription("lightShorts");
      if (weather.isWarm) return getDescription("regularShorts");
      return getDescription("optionalShorts");

    case "shoes":
      if (weather.isFreezing || weather.isVeryCold)
        return getDescription("winterBoots");
      if (isRaining) return getDescription("waterproofShoes");
      if (weather.isHot) return getDescription("lightShoes");
      return getDescription("regularShoes");

    case "umbrella":
      if (isRaining) return getDescription("rainUmbrella");
      return getDescription("optionalUmbrella");

    case "sunglasses":
      if (weather.isHighUV && !isRaining)
        return getDescription("sunSunglasses");
      if (weather.isLowUV && !isRaining)
        return getDescription("optionalSunglasses");
      return getDescription("optionalSunglasses");

    case "scarf":
      if (weather.isFreezing) return getDescription("warmScarf");
      if (weather.isVeryCold) return getDescription("coldScarf");
      if (weather.isWindy) return getDescription("windScarf");
      return getDescription("optionalScarf");

    case "gloves":
      if (weather.isFreezing) return getDescription("warmGloves");
      if (weather.isVeryCold) return getDescription("coldGloves");
      if (weather.isWindy) return getDescription("windGloves");
      return getDescription("optionalGloves");
  }
}

// Main recommendation function
export function getClothingRecommendations(
  weather: WeatherConditions,
  preference: "cold" | "normal" | "warm" = "normal",
): ClothingRecommendation[] {
  // Convert temperature if needed and adjust for preference
  let temp =
    weather.unit === "F"
      ? fahrenheitToCelsius(weather.temperature)
      : weather.temperature;

  // Adjust temperature perception based on preference
  // Cold preference: You feel colder, so we increase the actual temperature needed
  // Warm preference: You feel warmer, so we decrease the actual temperature needed
  if (preference === "cold") {
    temp = temp - 4; // You need +4°C more to feel the same
  } else if (preference === "warm") {
    temp = temp + 4; // You need -4°C less to feel the same
  }

  const weatherCategory = getWeatherCategory(
    temp,
    weather.windSpeed,
    weather.humidity,
    weather.uv,
  );
  const language = getStoredLanguage();
  const recommendations: ClothingRecommendation[] = [];

  function addRecommendation(
    type: ClothingType,
    priority: "high" | "medium" | "low",
  ) {
    const description = getClothingDescription(
      type,
      weatherCategory,
      weather.isRaining,
      language,
    );
    const isOptional = description.toLowerCase().includes("optional");
    recommendations.push({ type, description, priority, isOptional });
  }

  // Essential clothing based on temperature
  if (weatherCategory.isFreezing || weatherCategory.isVeryCold) {
    addRecommendation("jacket", "high");
    addRecommendation("sweater", "high");
    addRecommendation("pants", "high");
    addRecommendation("shirt", "high");
    addRecommendation("shoes", "high");

    if (preference === "warm" || weatherCategory.isFreezing) {
      addRecommendation("hat", "high");
      addRecommendation("gloves", "high");
      addRecommendation("scarf", "high");
    } else {
      addRecommendation("hat", "medium");
      addRecommendation("gloves", "medium");
      addRecommendation("scarf", "medium");
    }
  } else if (weatherCategory.isCold) {
    addRecommendation("jacket", preference === "warm" ? "high" : "medium");
    addRecommendation("sweater", preference === "warm" ? "high" : "medium");
    addRecommendation("pants", "high");
    addRecommendation("shirt", "high");
    addRecommendation("shoes", "high");

    if (preference === "warm") {
      addRecommendation("scarf", "medium");
      addRecommendation("gloves", "medium");
    }
  } else if (weatherCategory.isMild) {
    addRecommendation("shirt", "high");
    addRecommendation("pants", "high");
    addRecommendation("shoes", "high");

    if (preference === "warm") {
      addRecommendation("jacket", "medium");
      // Only add sweater if not too warm
      if (
        !weatherCategory.isWarm &&
        !weatherCategory.isHot &&
        !weatherCategory.isVeryHot
      ) {
        addRecommendation("sweater", "medium");
      }
    }
  } else if (
    weatherCategory.isWarm ||
    weatherCategory.isHot ||
    weatherCategory.isVeryHot
  ) {
    addRecommendation("shirt", "high");
    // Don't add sweaters in warm/hot weather
    // For very hot weather or humid conditions
    if (
      weatherCategory.isVeryHot ||
      (weatherCategory.isHot && weatherCategory.isHumid)
    ) {
      addRecommendation("shorts", "high");
      if (!recommendations.find((r) => r.type === "pants")) {
        addRecommendation("pants", "low");
      }
    } else {
      // For warm weather
      if (preference === "cold") {
        addRecommendation("shorts", "high");
        if (!recommendations.find((r) => r.type === "pants")) {
          addRecommendation("pants", "low");
        }
      } else {
        if (!recommendations.find((r) => r.type === "pants")) {
          addRecommendation("pants", "high");
        }
        addRecommendation("shorts", "low");
      }
    }
    addRecommendation("shoes", "high");
  }

  if (weatherCategory.isHighUV && !weather.isRaining) {
    addRecommendation("sunglasses", "high");
  } else if (weatherCategory.isLowUV && !weather.isRaining) {
    addRecommendation("sunglasses", "low");
  }

  // Weather-specific items
  if (weather.isRaining) {
    addRecommendation("umbrella", "high");
    // Only add a rain jacket if it's not hot
    if (
      !recommendations.find((r) => r.type === "jacket") &&
      !weatherCategory.isHot &&
      !weatherCategory.isVeryHot
    ) {
      addRecommendation("jacket", preference === "warm" ? "high" : "medium");
    }
  }

  if (
    weatherCategory.isVeryWindy &&
    !recommendations.find((r) => r.type === "jacket") &&
    !weatherCategory.isHot &&
    !weatherCategory.isVeryHot
  ) {
    addRecommendation("jacket", preference === "warm" ? "high" : "medium");
  } else if (
    weatherCategory.isWindy &&
    !recommendations.find((r) => r.type === "jacket") &&
    !weatherCategory.isHot &&
    !weatherCategory.isVeryHot
  ) {
    addRecommendation("jacket", preference === "warm" ? "medium" : "low");
  }

  // Adjust for humidity
  if (
    weatherCategory.isHumid &&
    (weatherCategory.isWarm || weatherCategory.isHot)
  ) {
    const pants = recommendations.find((r) => r.type === "pants");
    // Only switch to shorts if user doesn't prefer cold
    if (
      pants &&
      !recommendations.find((r) => r.type === "shorts") &&
      preference !== "cold"
    ) {
      recommendations.splice(recommendations.indexOf(pants), 1);
      addRecommendation("shorts", "high");
    }
  }

  return recommendations;
}

// Get appropriate model image based on weather
export async function getModelImage(
  temperature: number,
  weatherName: string,
  windSpeed?: number,
): Promise<{ outfits: Array<{ url: string; alt: string }> }> {
  // Construct search query based on weather conditions
  let query = "";
  let style = "any";
  const weather = (weatherName || "").toLowerCase();

  // Weather condition checks
  const isRaining = weather.includes("rain") || weather.includes("drizzle");
  const isSnowing = weather.includes("snow");
  const isStormy = weather.includes("thunderstorm");
  const isFoggy =
    weather.includes("mist") ||
    weather.includes("fog") ||
    weather.includes("haze");
  const isCloudy = weather.includes("cloud");
  const isClear =
    weather.includes("clear") ||
    (!isRaining && !isSnowing && !isStormy && !isFoggy && !isCloudy);
  const isWindy = windSpeed && windSpeed > 20;
  const isVeryWindy = windSpeed && windSpeed > 30;

  // Time of day (assuming weatherName might include 'night' or 'n' suffix)
  const isNight = weather.includes("night") || weather.endsWith("n");

  // Style selection based on time of day
  const getStyle = (options: string[], formalPreference = 0.5) => {
    if (isNight) {
      return Math.random() < 0.7 ? "formal" : "smart casual";
    }
    return options[Math.floor(Math.random() * options.length)];
  };

  // Default to clear if no weather condition is matched
  const effectiveWeather = weatherName || "clear";

  if (temperature <= 0) {
    // Freezing: Heavy winter clothing with accessories
    if (isSnowing) {
      query = "winter snow outfit model warm coat scarf hat gloves boots";
    } else if (isRaining || isStormy) {
      query = "winter rain outfit model waterproof coat scarf hat gloves boots";
    } else {
      query = "winter outfit cold model scarf hat gloves coat boots";
    }
    if (isVeryWindy) query += " windproof";
    style = getStyle(["casual", "sport"]);
  } else if (temperature <= 5) {
    // Very cold: Warm winter clothing
    if (isRaining || isSnowing) {
      query = "winter rain outfit model warm waterproof coat scarf boots";
    } else {
      query = "winter outfit model warm coat scarf boots";
    }
    if (isVeryWindy) query += " windproof";
    style = getStyle(["casual", "formal"]);
  } else if (temperature <= 12) {
    // Cold: Light winter clothing
    if (isRaining || isStormy) {
      query = "autumn rain outfit model waterproof coat boots";
    } else if (isFoggy || isCloudy) {
      query = "autumn foggy weather outfit model light coat";
    } else {
      query = "autumn outfit model light jacket";
    }
    if (isWindy) query += " windbreaker";
    style = getStyle(["casual", "formal"]);
  } else if (temperature <= 20) {
    // Mild: Light layers
    if (isRaining) {
      query = "spring rain outfit model light raincoat";
    } else if (isCloudy || isFoggy) {
      query = "spring cloudy outfit model light jacket";
    } else if (isClear) {
      query = "spring sunny outfit model casual light layers";
    } else {
      query = "spring outfit model light layers";
    }
    if (isWindy) query += " windbreaker";
    style = getStyle(["casual", "formal", "smart casual"]);
  } else if (temperature <= 25) {
    // Warm: Summer clothing with optional layers
    if (isRaining) {
      query = "summer light rain outfit model";
    } else if (isCloudy) {
      query = "summer cloudy weather outfit model light";
    } else {
      query =
        "summer outfit model casual light" + (isClear ? " sunglasses" : "");
    }
    if (isWindy) query += " light jacket";
    style = getStyle(["casual", "sport", "smart casual"]);
  } else if (temperature <= 30) {
    // Hot: Light summer clothing
    if (isRaining) {
      query = "summer rain outfit model light clothes";
    } else if (isClear) {
      query = "summer hot weather outfit model shorts sunglasses hat";
    } else {
      query =
        "summer hot outfit model shorts light" +
        (isCloudy ? "" : " sunglasses");
    }
    if (isWindy && !isRaining) query += " light cover";
    style = getStyle(["casual", "sport"]);
  } else {
    // Very hot: Minimal summer clothing
    if (isRaining) {
      query = "summer rain very hot outfit model light clothes";
    } else {
      query =
        "summer very hot weather outfit model minimal light" +
        (isClear ? " sunglasses hat" : "");
    }
    if (isWindy && !isRaining) query += " light cover";
    style = getStyle(["casual"]);
  }

  // Add weather protection accessories
  if (isStormy) {
    query = query
      .replace("rain", "storm")
      .replace("raincoat", "waterproof coat");
  }

  // Add descriptive weather conditions to alt text
  let weatherDesc = effectiveWeather;
  if (isWindy) weatherDesc += " and windy";
  if (isVeryWindy) weatherDesc = weatherDesc.replace("windy", "very windy");

  try {
    const response = await fetch(
      `/api/fashion?query=${encodeURIComponent(query)}&style=${style}&count=10`,
    );
    const data = await response.json();

    if (data.outfits && data.outfits.length > 0) {
      return {
        outfits: data.outfits.map((outfit) => ({
          ...outfit,
          alt: `Person wearing ${style} outfit for ${temperature}°C ${weatherDesc} weather`,
        })),
      };
    }

    // Fallback image if no results
    return {
      outfits: [
        {
          url: "https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg",
          alt: `Person wearing ${style} outfit for ${temperature}°C ${weatherDesc} weather`,
        },
      ],
    };
  } catch (error) {
    console.error("Error fetching model image:", error);
    // Fallback image on error
    return {
      outfits: [
        {
          url: "https://images.pexels.com/photos/2887766/pexels-photo-2887766.jpeg",
          alt: "Person wearing casual outfit",
        },
      ],
    };
  }
}
