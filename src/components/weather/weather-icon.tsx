'use client';

import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiDust,
  WiFog,
  WiDayCloudy,
  WiNightClear,
  WiNightCloudy,
} from 'react-icons/wi';

interface WeatherIconProps {
  condition: string;
  className?: string;
  isNight?: boolean;
}

export function WeatherIcon({ condition = 'clear', className = "w-8 h-8", isNight = false }: WeatherIconProps) {
  const getIcon = () => {
    const lowerCondition = (condition || '').toLowerCase();
    
    // Map OpenWeatherMap icon codes to conditions
    const iconToCondition: { [key: string]: string } = {
      '01d': 'clear',
      '01n': 'clear',
      '02d': 'few clouds',
      '02n': 'few clouds',
      '03d': 'clouds',
      '03n': 'clouds',
      '04d': 'clouds',
      '04n': 'clouds',
      '09d': 'rain',
      '09n': 'rain',
      '10d': 'rain',
      '10n': 'rain',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'mist',
      '50n': 'mist'
    };

    const mappedCondition = iconToCondition[lowerCondition] || lowerCondition;
    
    switch (mappedCondition) {
      case 'clear':
        return isNight ? WiNightClear : WiDaySunny;
      case 'few clouds':
      case 'scattered clouds':
        return isNight ? WiNightCloudy : WiDayCloudy;
      case 'clouds':
      case 'broken clouds':
      case 'overcast clouds':
        return WiCloudy;
      case 'rain':
      case 'light rain':
      case 'moderate rain':
      case 'heavy rain':
      case 'shower rain':
        return WiRain;
      case 'thunderstorm':
        return WiThunderstorm;
      case 'snow':
        return WiSnow;
      case 'mist':
      case 'fog':
      case 'haze':
        return WiFog;
      case 'dust':
      case 'sand':
      case 'ash':
        return WiDust;
      default:
        return WiDaySunny;
    }
  };

  const Icon = getIcon();
  return <Icon className={className} />;
}
