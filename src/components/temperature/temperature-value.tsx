'use client';

import { motion, animate, useMotionValue, AnimatePresence, LayoutGroup } from 'framer-motion';
import { useEffect } from 'react';

interface TemperatureValueProps {
  value: number;
  className?: string;
  language?: string;
}

const Digit = ({ value }: { value: number }) => {
  const y = useMotionValue(0);

  useEffect(() => {
    animate(y, - value * 72, {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1]
    });
  }, [value, y]);

  return (
    <div className="relative h-[72px] w-[0.6em] overflow-hidden transition-all">
      <motion.div style={{ y }} className="absolute w-full font-display">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <div 
            key={n} 
            className="h-[1em] w-full flex items-center justify-center"
          >
            {n}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export function TemperatureValue({ value, className = '', language = 'en' }: TemperatureValueProps) {
  const isRTL = language === 'ar';
  const digits = Math.abs(Math.round(value)).toString().padStart(2, '0');

  return (
    <LayoutGroup>
      <motion.div 
        layout
        className={`text-6xl font-semibold flex items ${className}`}
      >
        <AnimatePresence mode="wait">
          {value < 0 && (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -10, width: 0 }}
              animate={{ opacity: 1, x: 0, width: "auto" }}
              exit={{ opacity: 0, x: -10, width: 0 }}
              transition={{ 
                duration: 0.2,
                opacity: { duration: 0.1 },
                width: { duration: 0.2 }
              }}
              className="font-display -mt-4 overflow-hidden"
            >
              -
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div layout className="flex">
          {digits.split('').map((d, i) => (
            <Digit key={i} value={parseInt(d)} />
          ))}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
