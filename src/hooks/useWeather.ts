import { useState, useEffect, useCallback } from 'react';
import { WeatherData } from '@/types';

interface WeatherError {
  message: string;
  code?: number;
}

interface Location {
  city: string;
  country: string;
}

export function useWeather(location: Location | null, autoFetch = true, language = 'en') {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!location?.city) {
      setCurrentWeather(null);
      setWeatherData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        city: location.city,
        ...(location.country && { country: location.country }),
        lang: language
      }).toString();

      const response = await fetch(`/api/weather?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      setCurrentWeather(data.current);
      setWeatherData(data.forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setCurrentWeather(null);
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, [location?.city, location?.country, language]);

  useEffect(() => {
    if (autoFetch) {
      fetchWeather();
    }
  }, [fetchWeather, autoFetch]);

  return {
    currentWeather,
    weatherData,
    error,
    isLoading,
    refetch: fetchWeather
  };
}