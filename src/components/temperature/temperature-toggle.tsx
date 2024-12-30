'use client';

import { useEffect, useState } from 'react';

interface TemperatureToggleProps {
  onChange: (unit: 'C' | 'F') => void;
}

export function TemperatureToggle({ onChange }: TemperatureToggleProps) {
  const [unit, setUnit] = useState<'C' | 'F'>('C');

  useEffect(() => {
    const savedUnit = localStorage.getItem('temperatureUnit') as 'C' | 'F';
    if (savedUnit) {
      setUnit(savedUnit);
      onChange(savedUnit);
    }
  }, [onChange]);

  const toggleUnit = () => {
    const newUnit = unit === 'C' ? 'F' : 'C';
    setUnit(newUnit);
    localStorage.setItem('temperatureUnit', newUnit);
    onChange(newUnit);
  };

  return (
    <button
      onClick={toggleUnit}
      className="text-4xl font-bold text-white/60 hover:text-white transition-colors ml-2 hover:cursor-pointer relative -top-[18px] right-2 font-display"
    >
      {unit}
    </button>
  );
}
