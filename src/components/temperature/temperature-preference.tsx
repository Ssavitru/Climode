'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { FaSnowflake, FaRegSmile, FaSun } from 'react-icons/fa';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface TemperaturePreferenceProps {
  onChange?: (preference: 'cold' | 'normal' | 'warm') => void;
  language?: 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';
}

export function TemperaturePreference({ onChange, language = 'en' }: TemperaturePreferenceProps) {
  const [preference, setPreference] = useState<'cold' | 'normal' | 'warm'>('normal');
  const { t } = useAppTranslation(language);

  const handlePreferenceChange = (newPreference: 'cold' | 'normal' | 'warm') => {
    setPreference(newPreference);
    localStorage.setItem('temperaturePreference', newPreference);
    if (onChange) {
      onChange(newPreference);
    }
  };

  useEffect(() => {
    const savedPreference = localStorage.getItem('temperaturePreference') as 'cold' | 'normal' | 'warm';
    if (savedPreference) {
      setPreference(savedPreference);
      if (onChange) {
        onChange(savedPreference);
      }
    } else {
      // Initialize with normal preference
      if (onChange) {
        onChange('normal');
      }
    }
  }, [onChange]);

  const options = [
    { value: 'cold', icon: FaSnowflake, label: t('app.temperaturePreferences.COLD_SENSITIVE') },
    { value: 'normal', icon: FaRegSmile, label: t('app.temperaturePreferences.NORMAL') },
    { value: 'warm', icon: FaSun, label: t('app.temperaturePreferences.COLD_RESISTANT') }
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map(({ value, icon: Icon, label }, index) => (
          <button
            key={value}
            onClick={() => handlePreferenceChange(value as 'cold' | 'normal' | 'warm')}
            className={`flex shadow-xl items-center gap-2 px-4 py-3 rounded-xl transition-all justify-center ${
              index === 2 ? 'col-span-2 sm:col-span-1' : ''
            } ${
              preference === value
                ? 'bg-white/20 text-white'
                : 'text-white/60 bg-white/5 hover:text-white hover:bg-white/10'
            }`}
            >
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
