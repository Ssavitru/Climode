"use client";

import { cn } from "@/lib/utils";
import { ClothingType } from "@/lib/clothing-recommendations";
import { useEffect, useState } from "react";
import { getSearchTerms } from "@/lib/clothing-search-terms";
import { getUnsplashImage } from '@/lib/unsplash-service';
import { 
  GiTShirt, 
  GiMonclerJacket, 
  GiArmoredPants,
  GiRunningShoe,
  GiWinterGloves,
  GiSunglasses,
  GiUmbrella,
  GiWinterHat,
  GiShorts,
  GiCape
} from "react-icons/gi";

import {
  FaHatCowboy
} from "react-icons/fa";

import { translations } from '@/i18n';

export function getStoredLanguage() {
  if (typeof window === 'undefined') return 'en';
  
  const savedLanguage = localStorage.getItem('preferredLanguage') as 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';
  if (savedLanguage) return savedLanguage;
  
  const browserLang = navigator.language.split('-')[0];
  if (['en', 'fr', 'es', 'de', 'it', 'ar'].includes(browserLang)) {
    return browserLang as 'en' | 'fr' | 'es' | 'de' | 'it' | 'ar';
  }
  
  return 'en';
}

interface ClothingItemProps {
  type: ClothingType;
  description: { content: string; descriptionKey: string };
  priority: 'high' | 'medium' | 'low';
  className?: string;
}

const getClothingIcon = (type: ClothingType, description: { content: string; descriptionKey: string } = { content: '', descriptionKey: '' }) => {
  const icons: Record<ClothingType, React.ComponentType> = {
    hat: description.content.toLowerCase().includes('cap') ? FaHatCowboy : GiWinterHat,
    jacket: GiMonclerJacket,
    sweater: GiTShirt,
    shirt: GiTShirt,
    pants: GiArmoredPants,
    shorts: GiShorts,
    shoes: GiRunningShoe,
    umbrella: GiUmbrella,
    sunglasses: GiSunglasses,
    scarf: GiWinterHat,
    gloves: GiWinterGloves,
  };

  return icons[type] || GiTShirt;
};

const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
  switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

function getPriorityLabel(priority: 'high' | 'medium' | 'low'): string {
  const language = getStoredLanguage();
  return translations[language]?.clothing?.labels?.[priority as keyof typeof translations[typeof language]['clothing']['labels']] || priority;
}

export function ClothingItem({ type, description, priority, className }: ClothingItemProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const language = getStoredLanguage();
  const Icon = getClothingIcon(type, description);
  const priorityLabel = getPriorityLabel(priority);
  const translatedType = translations[language]?.clothing?.[type] || type;

  useEffect(() => {
    async function loadImage() {
      try {
        setLoading(true);
        const searchTerms = getSearchTerms(description.descriptionKey);
        const url = await getUnsplashImage(searchTerms);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading image:', error);
      } finally {
        setLoading(false);
      }
    }

    loadImage();
  }, [description.content]);

  return (
    <div className="relative group">
      {/* Badge positioned above the card */}
      <div className="absolute -top-0 right-0 z-20" style={{
        borderBottomRightRadius: '0.75rem',
        borderBottomLeftRadius: '0.75rem'
      }}>
        <div className={cn("flex items-center gap-2 text-xs text-white capitalize backdrop-blur-sm bg-white/10 px-2 py-1 rounded-bottom-left-xl")} style={{ borderTopRightRadius: '0.75rem', borderBottomLeftRadius: '0.75rem' }}>
          {priorityLabel}
          <div className={cn("w-3 h-3 rounded-full", getPriorityColor(priority))} />
        </div>
      </div>

      {/* Card content */}
      <div className={cn("w-full group/card", className)}>
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative h-48 rounded-xl shadow-xl flex flex-col justify-between p-4 bg-cover bg-center transition-all duration-300 hover:shadow-xl",
          )}
          style={{ 
            backgroundImage: imageUrl ? `url(${imageUrl})` : 'linear-gradient(to bottom right, rgb(91, 33, 182), rgb(103, 232, 249))'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 group-hover/card:from-black/90 group-hover/card:to-black/30 transition-all duration-300" />
          
          {/* Icon */}
          <div className="relative z-10 flex justify-between items-start relative -top-4 -left-4">
            <div className="bg-white/10 p-1 px-2 backdrop-blur-sm" style={{ borderTopLeftRadius: '0.75rem', borderBottomRightRadius: '0.75rem' }}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-lg font-semibold text-white capitalize">
              {translatedType}
            </h3>
            <p className="text-sm text-gray-200">
              {description.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClothingItemSkeleton() {
  return (
    <div className="w-full">
      <div className="h-48 rounded-xl shadow-xl bg-white/5 animate-pulse">
        <div className="h-full w-full flex flex-col justify-between p-4">
          <div className="flex justify-between items-start">
            <div className="w-10 h-10 bg-white/10 rounded-xl backdrop-blur-sm" />
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 bg-white/10 rounded-xl" />
              <div className="w-3 h-3 rounded-full bg-white/10" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-7 w-24 bg-white/10 rounded" />
            <div className="h-5 w-full bg-white/10 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
