export type Language = "en" | "fr" | "es" | "de" | "it" | "ar";

export interface Location {
  name: string;
  country: string;
  isAutoDetected?: boolean;
}

export type TemperaturePreference = "cold" | "normal" | "warm";

export interface ClothingItem {
  type: string;
  importance: "essential" | "recommended" | "optional";
}

export type WeatherCondition = 
  | "clearsky"
  | "fewclouds"
  | "scatteredclouds"
  | "brokenclouds"
  | "overcastclouds"
  | "lightrain"
  | "moderaterain"
  | "heaverain"
  | "thunderstorm"
  | "snow"
  | "mist"
  | "fog";
