"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getModelImage } from "@/lib/clothing-recommendations";
import { translations, type Language } from "@/i18n";
import { FaCaretLeft, FaCaretRight } from "react-icons/fa";
import { PhotoCredits } from "@/components/credits";

interface ModelImageProps {
  temperature: number;
  weatherName: string;
  currentIndex: number;
  onIndexChange?: (index: number) => void;
  language?: Language;
}

export function ModelImage({
  temperature,
  weatherName,
  currentIndex = 0,
  onIndexChange,
  language = "en",
}: ModelImageProps) {
  const [outfits, setOutfits] = useState<
    { url: string; alt: string; photographer?: string }[]
  >([]);
  const [imageLoading, setImageLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = translations[language].ModelImage;

  useEffect(() => {
    const loadOutfits = async () => {
      try {
        const data = await getModelImage(temperature, weatherName);
        if (data.outfits && data.outfits.length > 0) {
          setOutfits(data.outfits);
          onIndexChange?.(0);
        } else {
          setError(t.noImagesAvailable);
        }
      } catch (error) {
        console.error("Error loading model images:", error);
        setError(t.failedToLoad);
      }
    };
    loadOutfits();
  }, [temperature, weatherName, onIndexChange, t]);

  useEffect(() => {
    setImageLoading(true);
  }, [outfits, currentIndex]);

  const handlePrevious = () => {
    if (onIndexChange) {
      onIndexChange((prev) => (prev - 1 + outfits.length) % outfits.length);
    }
  };

  const handleNext = () => {
    if (onIndexChange) {
      onIndexChange((prev) => (prev + 1) % outfits.length);
    }
  };

  const handleImageError = () => {
    setImageLoading(true);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  if (error || !outfits.length) {
    return (
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-center gap-2 text-white/60">
          <span className="text-lg">😔</span>
          <p>{error || t.failedToLoad}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 text-sm bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
          >
            {t.tryAgain}
          </button>
        </div>
      </div>
    );
  }

  const safeIndex = Math.max(0, Math.min(currentIndex, outfits.length - 1));
  const currentOutfit = outfits[safeIndex];

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Navigation - Left */}
      <button
        onClick={handlePrevious}
        className="absolute left-0 top-1/2 -translate-y-1/2 h-16 z-20 px-4 backdrop-blur bg-black/50 hover:bg-black/70 text-white rounded-r-xl transition-colors flex items-center"
        aria-label="Previous outfit"
      >
        <FaCaretLeft className="w-6 h-6" />
      </button>

      <AnimatePresence mode="wait">
        {outfits.length > 0 && safeIndex < outfits.length && (
          <motion.div
            key={safeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={currentOutfit.url}
              alt={currentOutfit.alt}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoading ? "opacity-0" : "opacity-100"
              }`}
              style={{ objectPosition: "50% 50%" }}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />

            {imageLoading && (
              <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-white/10 backdrop-blur-sm">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
                <p className="text-white text-sm">{t.findingOutfit}</p>
              </div>
            )}

            {/* Photo Credits */}
            <PhotoCredits
              photographerName={currentOutfit.photographer}
              language={language}
              photographerUrl={currentOutfit.photographerUrl}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation - Right */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 h-16 z-20 px-4 backdrop-blur bg-black/50 hover:bg-black/70 text-white rounded-l-xl transition-colors flex items-center"
        aria-label="Next outfit"
      >
        <FaCaretRight className="w-6 h-6" />
      </button>
    </div>
  );
}
