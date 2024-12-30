import { WeatherData } from "@/types";

// Utility function to get UV index based on weather condition
export function getUVIndex(weatherId: number): number {
  if (weatherId >= 800) return weatherId === 800 ? 8 : 5; // Clear or partly cloudy
  if (weatherId >= 700) return 3; // Atmosphere conditions
  return 1; // Precipitation or other conditions
}

// Format temperature for display
export function formatTemperature(temp: number, unit: "C" | "F" = "C"): number {
  return unit === "C" ? Math.round(temp) : Math.round((temp * 9) / 5 + 32);
}

// Get weather description
export function getWeatherDescription(weather: WeatherData): string {
  const conditions = [];

  if (weather.precipitation > 50) {
    conditions.push("heavy rain");
  } else if (weather.precipitation > 20) {
    conditions.push("rain");
  } else if (weather.precipitation > 0) {
    conditions.push("light rain");
  }

  if (weather.windSpeed > 30) {
    conditions.push("strong winds");
  } else if (weather.windSpeed > 15) {
    conditions.push("breezy");
  }

  if (conditions.length === 0) {
    return weather.weather.description;
  }

  return conditions.join(" with ");
}

// Format time for display
export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Get pressure system description
export function getPressureSystem(pressure: number): string {
  return pressure > 1013 ? "High" : "Low";
}

// Get wind description
export function getWindDescription(speed: number): string {
  if (speed > 30) return "Strong";
  if (speed > 15) return "Moderate";
  return "Light";
}
