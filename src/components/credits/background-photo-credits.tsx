'use client';

import { FaCameraRetro } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { translations, type Language } from '@/i18n';

interface BackgroundPhotoCreditsProps {
  photographerName?: string;
  photographerUrl?: string;
  language?: Language;
}

export function BackgroundPhotoCredits({
  photographerName,
  photographerUrl,
  language = 'en',
}: BackgroundPhotoCreditsProps) {
  const t = translations[language].ModelImage;
  const isDefault = !photographerName;

  const content = (
    <div className="flex items-center justify-center gap-2 text-white/80">
      <FaCameraRetro className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-xs">
        {t.photoBy} {photographerName} {' '}
        {isDefault && t.defaultImage} {' '}
        {'• '}
        {t.providedByPixabay}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className="absolute bottom-0 left-0 z-[100] px-4 py-2 backdrop-blur bg-black/20 rounded-tr-xl hover:bg-black/50 transition-colors"
    >
      {photographerUrl ? (
        <a
          href={photographerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white transition-colors"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}
