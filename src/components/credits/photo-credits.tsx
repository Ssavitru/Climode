'use client';

import { FaCameraRetro } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { translations, type Language } from '@/i18n';

interface PhotoCreditsProps {
  photographerName?: string;
  photographerUrl?: string;
  language?: Language;
  type?: 'model' | 'background';
}

export function PhotoCredits({
  photographerName,
  photographerUrl,
  language = 'en',
  type = 'model'
}: PhotoCreditsProps) {
  const t = translations[language].ModelImage;
  const isDefault = !photographerName;

  const content = (
    <div className="flex items-center justify-center gap-2 text-white/80">
      <FaCameraRetro className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1 text-xs">
        {t.photoBy} {photographerName} {' '}
        {isDefault && t.defaultImage} {' '}
        {'• '}
        {t.providedByPexels}
      </span>
    </div>
  );

  const containerClass = "fixed rounded-tl-xl bottom-0 right-0 z-[100] px-4 py-2 backdrop-blur-sm bg-black/20 hover:bg-black/50 transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={containerClass}
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
