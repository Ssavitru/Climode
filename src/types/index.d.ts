export interface WeatherData {
  date: string;
  location: string;
  temperature: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  tempAvg: number;
  windSpeed: number;
  humidity: number;
  pressure: number;
  visibility: number;
  precipitation: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
  weather: {
    description: string;
    icon: string;
  };
}

export interface Recommendation {
  name: string;
  icon: string;
}
