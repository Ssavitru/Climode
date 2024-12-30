'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Language } from '@/types';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { BackgroundPhotoCredits } from '@/components/credits';
import { CrossfadeImage } from '@/components/ui/crossfade-image';

interface WeatherBackgroundProps {
  city: string;
  className?: string;
  language?: Language;
}

interface ImageData {
  url: string;
  credit: {
    name: string;
    url: string;
  };
  isDefault?: boolean;
}

export function WeatherBackground({
  city,
  className,
  language = 'en'
}: WeatherBackgroundProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [photographer, setPhotographer] = useState({ name: '', url: '' });
  const { t } = useAppTranslation(language);

  useEffect(() => {
    if (!city) return;
    
    async function fetchImage() {
      try {
        const cityName = city.split(',')[0];
        console.log('Fetching image for:', cityName, 'in language:', language);
        
        const response = await fetch(`/api/cityImage?city=${encodeURIComponent(cityName)}&lang=${language}`);
        if (!response.ok) throw new Error('Failed to fetch image');
        
        const data: ImageData = await response.json();
        setImageUrl(data.url);
        setPhotographer({
          name: data.credit.name,
          url: data.credit.url
        });
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    }

    fetchImage();
  }, [city, language]);

  return (
    <>
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          <CrossfadeImage
            src={imageUrl}
            alt={`Weather in ${city}`}
            duration={3000}
            timingFunction="ease-in-out"
            containerClass={cn(
              'w-full h-full contrast-100 brightness-75',
              className
            )}
          />
        </div>
      </div>
      {photographer.name && (
        <BackgroundPhotoCredits
          photographerName={photographer.name}
          photographerUrl={photographer.url}
          language={language}
        />
      )}
    </>
  );
}