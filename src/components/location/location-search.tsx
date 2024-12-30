import { useState, useEffect, useRef } from "react";
import { useAppTranslation } from "@/hooks/useAppTranslation";
import { LocationSuggestionItem } from "./location-suggestion-item";

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
  language: Language;
  defaultLocation?: string;
  isAutoLocating?: boolean;
}

interface LocationSuggestion {
  city: string;
  country: string;
  state?: string;
}

export function LocationSearch({
  onLocationSelect,
  language,
  defaultLocation,
  isAutoLocating = false,
}: LocationSearchProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isAutoDetected, setIsAutoDetected] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslation(language);
  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Set default location on mount
  useEffect(() => {
    if (defaultLocation) {
      setInputValue(defaultLocation);
    }
  }, [defaultLocation]);

  const handleLocationSelect = (suggestion: LocationSuggestion, isAuto = false) => {
    const location: Location = {
      name: suggestion.city,
      country: suggestion.country,
      state: suggestion.state,
    };
    setInputValue(
      `${suggestion.city}, ${suggestion.country}${suggestion.state ? `, ${suggestion.state}` : ""}`,
    );
    setIsOpen(false);
    setIsAutoDetected(isAuto);
    onLocationSelect(location);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleLocationSelect(suggestions[selectedIndex], false);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setIsOpen(true);

    if (value.length >= 3) {
      try {
        const response = await fetch(
          `/api/geocoding?query=${encodeURIComponent(value)}&lang=${language}`,
        );
        if (!response.ok) throw new Error("Failed to fetch suggestions");
        const data = await response.json();
        setSuggestions(data);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleCurrentLocation = async () => {
    if (!("geolocation" in navigator) || isAutoLocating) return;

    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            timeout: 5000,
            maximumAge: 0,
          });
        },
      );

      const { latitude, longitude } = position.coords;
      const response = await fetch(
        `/api/reverse-geocoding?lat=${latitude}&lon=${longitude}`,
      );

      if (!response.ok) {
        throw new Error("Failed to get location");
      }

      const data = await response.json();
      handleLocationSelect({
        city: data.name,
        country: data.country,
        state: data.state,
      }, true);
    } catch (error) {
      // Handle error silently
    } finally {
      setIsLoading(false);
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div ref={wrapperRef} className="relative w-full">
        <div className="flex gap-2">
          <div className="relative flex-1 shadow-xl backdrop-blur-xl rounded-2xl">
            <input
              type="text"
              value={inputValue}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsOpen(true)}
              placeholder={
                isAutoLocating ? t("location.detecting") : t("location.search")
              }
              className={`w-full px-4 py-2 bg-white/10 text-white rounded-2xl placeholder:text-white/50 outline-none ${
                suggestions.length > 0 && isOpen
                  ? "focus:outline-none"
                  : "focus:outline-none focus:ring-2 focus:ring-white/20"
              } transition-all ${isAutoLocating ? "opacity-50" : ""}`}
              disabled={isAutoLocating}
            />
          </div>
        </div>
        {isOpen && suggestions.length > 0 && (
          <ul className="absolute backdrop-blur-xl z-10 top-12 w-full bg-white/10 rounded-2xl max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <LocationSuggestionItem
                key={`${suggestion.city}-${suggestion.country}-${index}`}
                city={suggestion.city}
                country={suggestion.country}
                state={suggestion.state}
                language={language}
                isSelected={index === selectedIndex}
                onClick={() => handleLocationSelect(suggestion, false)}
              />
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={handleCurrentLocation}
        className="px-[14px] py-[10px] shadow-xl backdrop-blur-xl rounded-2xl bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-colors"
        disabled={isLoading || isAutoLocating}
      >
        {isLoading || isAutoLocating ? (
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <svg
            className={`h-5 w-5 ${isAutoDetected ? "fill-white stroke-none" : "fill-none stroke-current"}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
}
