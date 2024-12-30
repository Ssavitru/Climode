'use client';

import { useState, useEffect } from 'react';

type TemperatureUnit = 'C' | 'F';

interface TemperatureUnitProps {
  onChange?: (unit: TemperatureUnit) => void;
  language?: string;
}

export function TemperatureUnit({ onChange, language = 'en' }: TemperatureUnitProps) {
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const isRTL = language === 'ar';

  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit') as TemperatureUnit;
    if (savedUnit) {
      setUnit(savedUnit);
      onChange?.(savedUnit);
    }
  }, [onChange]);

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('temperatureUnit', newUnit);
    onChange?.(newUnit);
  };

  const getUnitText = () => {
    if (isRTL) {
      return unit === 'C' ? 'مئوية' : 'فهرنهايت';
    }
    return unit === 'C' ? 'Celsius' : 'Fahrenheit';
  };

  return (
    <button className="flex items-center gap-2" onClick={toggleUnit}>
      <span htmlFor="temperature-unit" className={`text-sm font-medium text-white/80 ${isRTL ? 'text-right' : 'text-left'}`}>
        {getUnitText()}
      </span>
    </button>
  );
}
