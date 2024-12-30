'use client';

import { useEffect, useState } from 'react';
import { Language } from '@/types';

interface FormattedCountryProps {
  countryCode: string;
  language: Language;
}

export function FormattedCountry({ countryCode, language }: FormattedCountryProps) {
  const [countryName, setCountryName] = useState(countryCode);

  useEffect(() => {
    try {
      const formatted = new Intl.DisplayNames([language], { type: 'region' }).of(countryCode);
      if (formatted) {
        setCountryName(formatted);
      }
    } catch (error) {
      console.error('Error formatting country name:', error);
    }
  }, [countryCode, language]);

  return <>{countryName}</>;
}
