'use client';

import { useState, useEffect } from 'react';

interface CrossfadeImageProps {
  src: string;
  alt?: string;
  duration?: number;
  timingFunction?: string;
  delay?: number;
  style?: React.CSSProperties;
  containerClass?: string;
}

export function CrossfadeImage({
  src,
  alt = '',
  duration = 4000,
  timingFunction = 'ease',
  delay = 0,
  style = {},
  containerClass = ''
}: CrossfadeImageProps) {
  const [images, setImages] = useState<Array<{ src: string; opacity: number }>>([
    { src: '', opacity: 0 },
    { src: '', opacity: 0 }
  ]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!src) return;

    const nextIndex = (activeIndex + 1) % 2;

    // Update the new image first
    setImages(prev => {
      const next = [...prev];
      next[nextIndex] = { src, opacity: 0 };
      return next;
    });

    // Start transition in the next frame
    requestAnimationFrame(() => {
      setImages(prev => {
        const next = [...prev];
        // Fade in new image
        next[nextIndex] = { ...next[nextIndex], opacity: 1 };
        // Fade out old image
        next[activeIndex] = { ...next[activeIndex], opacity: 0 };
        return next;
      });
      setActiveIndex(nextIndex);
    });
  }, [src]);

  const commonStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    ...style,
  };

  return (
    <div 
      className={containerClass} 
      style={{ 
        position: 'relative', 
        width: '100%', 
        height: '100%',
      }}
    >
      {/* Render both images */}
      {images.map((image, index) => (
        image.src ? (
          <img
            key={index}
            src={image.src}
            alt={index === activeIndex ? alt : ''}
            style={{
              ...commonStyles,
              opacity: image.opacity,
              transition: `opacity ${duration}ms ${timingFunction}`,
              zIndex: index === activeIndex ? 2 : 1,
            }}
          />
        ) : null
      ))}
    </div>
  );
}
