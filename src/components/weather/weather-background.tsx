"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Language } from "@/types";
import { BackgroundPhotoCredits } from "@/components/credits";
import Image from "next/image";

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
  language = "en",
}: WeatherBackgroundProps) {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [photographer, setPhotographer] = useState({ name: "", url: "" });
  const [oldImageUrl, setOldImageUrl] = useState<string>("");
  const [isOldImageVisible, setIsOldImageVisible] = useState(false);
  
  useEffect(() => {
    if (!city) return;

    async function fetchImage() {
      try {
        const cityName = city.split(",")[0];
        const response = await fetch(
          `/api/cityImage?city=${encodeURIComponent(cityName)}&country=${city.split(",")[1]}&lang=${language}`
        );
        
        if (!response.ok) throw new Error("Failed to fetch image");
        
        const data: ImageData = await response.json();
        
        // Save current image as old image before updating
        if (imageUrl) {
          setOldImageUrl(imageUrl);
          setIsOldImageVisible(true);
        }
        
        // Update with new image
        setImageUrl(data.url);
        setPhotographer({
          name: data.credit.name,
          url: data.credit.url,
        });
        
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    }

    fetchImage();
  }, [city, language]);

  return (
    <>
      <div className="fixed inset-0 w-full h-full">
        <div className="absolute inset-0 w-full h-full">
          {/* Old image that fades out */}
          {oldImageUrl && isOldImageVisible && (
            <Image
              src={oldImageUrl}
              alt={`Previous weather in ${city}`}
              onAnimationEnd={() => setIsOldImageVisible(false)}
              className={cn(
                "absolute contrast-100 brightness-75 opacity-animation-out z-10",
                className
              )}
              fill
              sizes="100vw"
              quality={75}
              priority
            />
          )
          }
          
          {/* New image that fades in */}
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={`Weather in ${city}`}
              className={cn(
                "absolute contrast-100 brightness-75 opacity-animation-in z-0",
                className
              )}
              fill
              sizes="100vw"
              quality={75}
              priority
            />
          )
          }
        </div>
      </div>
      {photographer.name && (
        <BackgroundPhotoCredits
          photographerName={photographer.name}
          photographerUrl={photographer.url}
          language={language}
        />
      )
      }
    </>
  );
}
