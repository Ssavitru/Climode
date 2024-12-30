'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { translations, type Language } from '@/i18n';

interface DateSliderProps {
  onDateChange: (date: Date) => void;
  language?: Language;
}

export function DateSlider({ onDateChange, language = 'en' }: DateSliderProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const currentTranslations = translations[language];

  const dates = useMemo(() => {
    const result = [];
    const today = new Date();
    
    // Generate 7 days
    for (let i = 0; i < 7; i++) {
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
      scrollElement.addEventListener('scroll', handleScroll);
      // Initial check
      handleScroll();
    }
    
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateChange(date);
  };

  const formatDate = (date: Date) => {
    return date.getDate().toString();
  };

  const formatDay = (date: Date) => {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
    const dayIndex = date.getDay();
    return currentTranslations.date.weekdays.short[days[dayIndex] as keyof typeof currentTranslations.date.weekdays.short];
  };

  const formatMonth = (date: Date) => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as const;
    const monthIndex = date.getMonth();
    return currentTranslations.date.months.short[months[monthIndex] as keyof typeof currentTranslations.date.months.short];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="relative w-full overflow-hidden glass-card rounded-3xl">
      <div 
        ref={scrollRef}
        className="flex md:grid md:grid-cols-7 gap-2 p-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
      >
        {dates.map((date) => (
          <button
            key={date.toISOString()}
            onClick={() => handleDateSelect(date)}
            className={`flex-shrink-0 w-[calc(100%/4-0.5rem)] md:w-auto flex flex-col shadow-xl items-center justify-center p-2 rounded-xl transition-colors snap-center ${
              date.toDateString() === selectedDate.toDateString()
                ? 'bg-white/20 text-white'
                : 'hover:bg-white/10 text-white/80'
            }`}
            dir={language === 'ar' ? 'rtl' : 'ltr'}
          >
            <span className="text-xs font-medium font-display">{formatDay(date)}</span>
            <span className="text-lg font-bold">{formatDate(date)}</span>
            {!isToday(date) ? <span className="text-xs font-display">{formatMonth(date)}</span> : (
              <span className="text-xs text-white/60 font-display">{currentTranslations.date.today}</span>
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
