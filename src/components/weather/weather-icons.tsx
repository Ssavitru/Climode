"use client";

import { WiRaindrop, WiHumidity, WiDaySunny } from "react-icons/wi";
import { cn } from "@/lib/utils";

interface WeatherIconProps {
  value: number;
  className?: string;
}

export function RainIcon({ value, className }: WeatherIconProps) {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.max(0, Math.min(100, value)) * 0.45;
  return (
    <div className={cn("relative w-12 h-12", className)}>
      {/* Empty drop outline */}
      <WiRaindrop className="absolute inset-0 w-full h-full text-white/20 transition-opacity duration-300" />

      {/* Filled drop */}

      <div
        className="absolute inset-0 w-full h-full overflow-hidden transition-[clip-path] duration-300"
        style={{
          clipPath: `polygon(
            0 ${100}%, 
            100% ${100}%, 
            100% ${69 - normalizedValue}%, 
            0 ${69 - normalizedValue}%
          )`,
        }}
      >
        <WiRaindrop className="absolute inset-0 w-full h-full text-sky-200" />
      </div>
    </div>
  );
}

export function HumidityIcon({ value, className }: WeatherIconProps) {
  const opacity = 0.3 + (value / 100) * 0.7;
  const color = `rgba(186, 230, 253, ${opacity})`; // Light blue (sky-200) with dynamic opacity

  return (
    <WiHumidity
      className={cn("w-8 h-8 transition-colors duration-300", className)}
      style={{ color }}
    />
  );
}

export function UVIcon({ value, className }: WeatherIconProps) {
  // UV index typically ranges from 0 to 11+
  const normalizedValue = Math.min(value, 11) / 11;
  const opacity = 0.3 + normalizedValue * 0.7;
  const color = `rgba(250, 204, 21, ${opacity})`; // Bright yellow with dynamic opacity

  return (
    <WiDaySunny
      className={cn("w-8 h-8 transition-colors duration-300", className)}
      style={{ color }}
    />
  );
}
