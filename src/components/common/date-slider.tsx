"use client";

import {  useState, useEffect, useMemo, useRef } from "react";
import { translations, type Language } from "@/i18n";
import { motion } from "framer-motion";

interface DateSliderProps {
  onDateChange: (date: Date) => void;
  selectedDate?: Date;
  language: Language;
}

const NewYearBadge = ({ date }: { date: number }) => {
  return (
    <div className="badge-container ml-1">
      <div >
    
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ 
          scale: [0.8, 1.1, 1],
          opacity: 1,
        }}
        transition={{ 
          duration: 0.8,
          delay: 0.2,
          ease: [0.23, 1, 0.32, 1],
        }}
        className="inline-flex items-center justify-baseline px-2 py-0.5 -top-px rounded-full gradient-animation text-xs font-semibold text-black shadow-lg border border-yellow-200/30 relative z-10"
      >
        <span className="translate-y-px">
          {date}
        </span>
      </motion.div>
    </div> 
    </div>
  );
};

export function DateSlider({ onDateChange, language }: DateSliderProps) {
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentTranslations = translations[language];

  const dates = useMemo(() => {
    const result = [];
    const today = new Date();

    // Generate 7 days
    for (let i = 0; i < 6; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      result.push(date);
    }
    return result;
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    // Show left shadow if we've scrolled right
    setShowLeftShadow(scrollLeft > 0);

    // Show right shadow if we haven't reached the end
    setShowRightShadow(Math.ceil(scrollLeft + clientWidth) < scrollWidth);
  };

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll);
      // Initial check
      handleScroll();
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleDateSelect = (date: Date) => {
    onDateChange(date);
    setSelectedDate(date);
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const formatDay = (date: Date) => {
    const days = [
      "sun",
      "mon",
      "tue",
      "wed",
      "thu",
      "fri",
      "sat",
    ] as const;
    const dayIndex = date.getDay();
    return currentTranslations.date.weekdays.long[
      days[dayIndex] as keyof typeof currentTranslations.date.weekdays.long
    ];
  };

  const formatMonth = (date: Date) => {
    const months = [
      "jan",
      "feb",
      "mar",
      "apr",
      "may",
      "jun",
      "jul",
      "aug",
      "sep",
      "oct",
      "nov",
      "dec",
    ] as const;
    const monthIndex = date.getMonth();
    return currentTranslations.date.months.long[
      months[monthIndex] as keyof typeof currentTranslations.date.months.long
    ];
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.toDateString() === date2.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return isSameDay(date, today);
  };
  return (
    <div className="relative w-full overflow-hidden glass-card rounded-3xl">
      <div
        ref={scrollRef}
        className="flex md:grid md:grid-cols-6 gap-2 p-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateSelect(date)}
            className={`flex-shrink-0 w-[calc(100%/4-0.5rem)] md:w-auto flex flex-col shadow-xl items-center justify-center p-2 rounded-xl transition-colors snap-center ${
              isSameDay(date, selectedDate)
                ? "bg-white/20 text-white"
                : "hover:bg-white/10 text-white/80"
            }`}
            dir={language === "ar" ? "rtl" : "ltr"}
          >
            <span className="text-xs font-medium font-display">
              {formatDay(date)}
            </span>
            <span className="text-lg font-bold">{formatDate(date)}</span>
            {date.getDate() === 1 && date.getMonth() === 0 ? (
              <>
                <span className="text-xs font-display">
                  {formatMonth(date)}
                  {isLoaded && (
                    <NewYearBadge date={date.getFullYear()} />
                  )}
                </span>
              </>
            ) : isToday(date) ? (
              <span className="text-xs text-white/80 font-display">
                {currentTranslations.date.today}
              </span>
            ) : (
              <>
                <span className="text-xs font-display">
                  {formatMonth(date)}
                </span>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Gradient indicators for scroll */}
      {showLeftShadow && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/20 to-transparent pointer-events-none md:hidden" />
      )}
      {showRightShadow && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/20 to-transparent pointer-events-none md:hidden" />
      )}
    </div>
  );
}
