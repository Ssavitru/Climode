"use client";

import { cn } from "@/lib/utils";
import { translations, type Language } from "@/i18n";
import { useState, useRef, useEffect } from "react";
import { IoMdCheckmark } from "react-icons/io";
import Flags from "react-world-flags"

interface LanguageSelectorProps {
  value: Language;
  onChange: (language: Language) => void;
  className?: string;
}

// Map languages to country codes for flags
const languageToCountry: Record<Language, string> = {
  en: "GB",
  fr: "FR",
  es: "ES",
  de: "DE",
  it: "IT",
  ar: "SA",
  ru: "RU",
};

export function LanguageSelector({
  value,
  onChange,
  className,
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentTranslations = translations[value];
  const [isExpanded, setIsExpanded] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages: Language[] = ["en", "fr", "es", "de", "it", "ar", "ru"];

  return (
    <div
      className={cn("relative", className)}
      ref={dropdownRef}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => !isOpen && setIsExpanded(false)}
    >
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setIsExpanded(!isOpen);
        }}
        className={cn(
          `flex items-center justify-center ${isExpanded ? "gap-2" : "gap-0"} backdrop-blur-md py-2 rounded-2xl bg-white/10 hover:bg-white/10 outline-none focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300`,
          isExpanded ? "px-4" : "px-4",
        )}
        dir={value === "ar" ? "rtl" : "ltr"}
      >
        <Flags
          code={languageToCountry[value]}
          
          className="w-5 h-5 rounded"
          height="20"
          style={{ width: "20px", height: "15px" }}
        />
        <span
          className={cn(
            "overflow-hidden transition-all duration-300 whitespace-nowrap translate-y-[1px]",
            isExpanded ? "max-w-[100px] opacity-100" : "max-w-0 opacity-0",
          )}
        >
          {currentTranslations.app.languages[value]}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl z-50 border border-white/10"
          dir={value === "ar" ? "rtl" : "ltr"}
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => {
                  onChange(lang);
                  setIsOpen(false);
                  setIsExpanded(false);
                }}
                className={cn(
                  "w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-white/10 transition-colors duration-200",
                  value === lang ? "text-white bg-white/10" : "text-white/70",
                )}
              >
                <Flags
                  code={languageToCountry[lang]}
                  
                  className="w-5 h-5 rounded"
                  style={{ width: "20px", height: "15px" }}
                />
                <span className="flex-1">
                  {translations[value].app.languages[lang]}
                </span>
                {value === lang && (
                  <IoMdCheckmark className="w-5 h-5 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
