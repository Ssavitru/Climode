"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { WiThermometer, WiRefresh } from "react-icons/wi";
import { FaFan } from "react-icons/fa";
import { translations, type Language } from "@/i18n";
import { getClothingRecommendations } from "@/lib/clothing-recommendations";
import { useWeather } from "@/hooks/useWeather";
import { useLanguage } from "@/hooks/useLanguage";

// Common components
import {
  AnimatedValue,
  DateSlider,
  LanguageSelector,
  ModelImage,
  OutfitList,
  TimeAgo,
} from "@/components/common";

// Location components
import { LocationSearch } from "@/components/location";
import { FormattedCountry } from "@/components/location/formatted-country";

// Temperature components
import {
  TemperaturePreference,
  TemperatureValue,
  TemperatureToggle,
  TemperatureUnit,
} from "@/components/temperature";

// Weather components
import {
  WeatherIcon,
  WeatherBackground,
  SecondaryWeatherData,
  RainIcon,
  HumidityIcon,
  UVIcon,
} from "@/components/weather";

import Image from "next/image";
import { AuthorWidget } from "@/components/credits";
import cn from "classnames";

export default function Home() {
  const [language, updateLanguage] = useLanguage();
  const searchParams = useSearchParams();

  const formatLocationString = (
    name: string,
    countryCode: string,
    lang: string,
  ) => {
    try {
      const countryName = new Intl.DisplayNames([lang], { type: "region" }).of(
        countryCode,
      );
      return `${name}, ${countryName}`;
    } catch (error) {
      return `${name}, ${countryCode}`;
    }
  };

  const [location, setLocation] = useState<{
    name: string;
    country: string;
  } | null>(null);
  const [locationString, setLocationString] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [tempUnit, setTempUnit] = useState<"C" | "F">("C");
  const [tempPreference, setTempPreference] = useState<
    "cold" | "normal" | "hot"
  >("normal");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentOutfitIndex, setCurrentOutfitIndex] = useState(0);
  const [isAutoLocating, setIsAutoLocating] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const currentTranslations = translations[language] || translations.en;

  // Use the weather hook with city and country
  const weatherLocation = useMemo(
    () =>
      location ? { city: location.name, country: location.country } : null,
    [location?.name, location?.country],
  );

  const { currentWeather, weatherData, error, isLoading, refetch } = useWeather(
    weatherLocation,
    true,
    language,
  );
  const NUMBER_OF_OUTFITS = 10;

  // Load saved location on mount
  useEffect(() => {
    const loadSavedLocation = () => {
      const saved = localStorage.getItem("lastLocation");
      if (saved) {
        try {
          const savedLocation = JSON.parse(saved);
          setLocation(savedLocation);
          const formatted = formatLocationString(
            savedLocation.name,
            savedLocation.country,
            language,
          );
          setLocationString(formatted);
        } catch (error) {
          console.error("Error parsing saved location:", error);
        }
      }
      const timeoutId = setTimeout(() => {
        setIsInitialLoad(false);
      }, 50);
      return () => clearTimeout(timeoutId);
    };

    loadSavedLocation();
  }, [language]);

  useEffect(() => {
    const storedLanguage = localStorage.getItem("language");
    if (storedLanguage) {
      updateLanguage(storedLanguage as Language);
    }
  }, [updateLanguage]);

  // Save location to localStorage whenever it changes
  useEffect(() => {
    if (location) {
      localStorage.setItem("lastLocation", JSON.stringify(location));
      const formatted = formatLocationString(
        location.name,
        location.country,
        language,
      );
      setLocationString(formatted);
    }
  }, [location, language]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (params.has("city") && params.has("country")) {
      const newLocation = {
        name: params.get("city") || "",
        country: params.get("country") || "",
        state: params.get("state") || undefined,
      };
      setLocation(newLocation);
      // Update locationString with localized country name
      if (newLocation.country) {
        const countryName = formatLocationString(
          newLocation.name,
          newLocation.country,
          language,
        );
        setLocationString(`${newLocation.name}, ${countryName}`);
      }
    }
  }, [searchParams, language]); // Add language as dependency

  const handleLanguageChange = (newLanguage: Language) => {
    updateLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event("languageChange"));
  };

  const handleLocationSelect = (newLocation: {
    name: string;
    country: string;
  }) => {
    setIsAutoLocating(false); // Ensure we stop auto-locating
    setLocation(newLocation);
    const countryName = formatLocationString(
      newLocation.name,
      newLocation.country,
      language,
    );
    setLocationString(`${newLocation.name}, ${countryName}`);
    setLastUpdated(new Date());
  };

  const handleRefresh = () => {
    refetch();
    setLastUpdated(new Date());
  };

  const handleRetry = () => {
    setLocationString(locationString);
  };

  // Get the weather data for the selected date
  const selectedWeather = useMemo(() => {
    if (isLoading || !weatherData) return currentWeather;

    const today = new Date().toDateString();
    const selectedDateString = selectedDate.toDateString();

    // If selected date is today, use current weather
    if (selectedDateString === today) {
      return currentWeather;
    }

    // Otherwise look for the date in forecast data
    const found = weatherData.find(
      (data) => new Date(data.date).toDateString() === selectedDateString
    );

    return found || currentWeather;
  }, [weatherData, currentWeather, selectedDate, isLoading]);

  // Add function to get question mark with proper spacing
  const getQuestionMark = (lang: string) => {
    switch (lang) {
      case "fr":
        return " ?"; // French uses space before question mark
      case "ar":
        return "؟"; // Arabic question mark, no space needed
      case "es":
        return "?"; // Spanish question mark at start and end
      default:
        return "?"; // No space for other languages
    }
  };

  // Add function to format the date text with proper RTL/LTR handling
  const formatDateQuestion = (lang: string, dateText: string) => {
    switch (lang) {
      case "ar":
        // For Arabic, we want the question mark at the end but the date before the "في"
        return `${currentTranslations.app?.whatToWear} ${dateText}${getQuestionMark(lang)}`;
      case "es":
        // For Spanish, we want the question mark at both start and end
        return `${currentTranslations.app?.whatToWear} ${dateText}${getQuestionMark(lang)}`;
      default:
        return `${currentTranslations.app?.whatToWear} ${dateText}${getQuestionMark(lang)}`;
    }
  };

  const getDateText = (date: Date) => {
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return currentTranslations.date.today.toLowerCase();
    } else if (
      date.toDateString() ===
      new Date(today.setDate(today.getDate() + 1)).toDateString()
    ) {
      return currentTranslations.date.tomorrow.toLowerCase();
    } else {
      return date
        .toLocaleDateString(language, { weekday: "long" })
        .toLowerCase();
    }
  };

  const getWindStyle = (speed: number) => {
    if (speed === 0) return {};

    // Calculate animation duration based on wind speed
    // Faster wind = shorter duration (faster spin)
    const duration = Math.max(0.5, 5 - speed / 10);

    return {
      animation: `spin ${duration}s linear infinite`,
    };
  };

  const formattedLocation = {
    name: selectedWeather?.location?.split(", ")[0] || "",
    countryCode: selectedWeather?.location?.split(", ")[1] || "",
  };

  return (
    <main className="relative min-h-screen">
      {/* Language Selector */}
      <div className="absolute top-4 right-4 z-50 mr-4">
        <LanguageSelector value={language} onChange={handleLanguageChange} />
      </div>

      {/* Background */}
      {locationString && (
        <WeatherBackground city={locationString} language={language} />
      )}

      {/* Content */}
      <div className="relative z-10 min-h-screen px-0 md:px-4 py-12 sm:p-8">
        <div className="max-w-[1024px] mx-auto w-full">
          <div
            dir="ltr"
            className="flex flex-col xl:flex-row xl:justify-between xl:items-end gap-4 mb-8 px-4"
          >
            <div className="w-full xl:w-1/2 ">
              <div className="flex items-start justify-start">
                <Image
                  src="/logo.png"
                  alt="Logo"
                  className="-translate-y-[6px] mr-1"
                  width={50}
                  height={50}
                />
                <h1 className="text-4xl font-bold text-white sm:text-left">
                  <span className="text-white font-display">Clima</span>

                  <AuthorWidget language={language} />
                </h1>
              </div>
            </div>

            <div className="w-full xl:w-1/2 p-4 px-0 space-y-6 z-50 rounded-xl">
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-se">
                  <div className="flex-1">
                    <LocationSearch
                      onLocationSelect={handleLocationSelect}
                      isAutoLocating={isAutoLocating}
                      defaultLocation={locationString}
                      language={language}
                    />
                  </div>
                  <button
                    onClick={handleRefresh}
                    className="ml-2 shadow-xl backdrop-blur-xl rounded-2xl hover:bg-white/30 text-white bg-white/10 px-1"
                    aria-label={currentTranslations?.app?.refresh}
                  >
                    <WiRefresh className={cn("w-10 h-10", {
                      "fill-current": location?.isAutoDetected,
                      "stroke-current": !location?.isAutoDetected
                    })} />
                  </button>

                </div>
              </div>
            </div>
          </div>
          <main className="flex-1 px-4 pb-8">
            <div className="mt-4">
              <DateSlider onDateChange={setSelectedDate} language={language} />
            </div>

            {isLoading || isAutoLocating || isInitialLoad ? (
              <div className="space-y-8 mt-8">
                <div className="glass-card p-6 rounded-3xl pt-8">
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    {/* Location and Time */}
                    <div className="flex flex-col items-center mb-4">
                      <div className="h-8 w-48 bg-white/10 rounded-lg animate-pulse" />
                      <div className="h-4 w-32 bg-white/10 rounded-lg mt-2 animate-pulse" />
                    </div>

                    {/* Weather Display */}
                    <div className={`flex justify-center items-center gap-4`}>
                      <div className="w-16 h-16 bg-white/10 rounded-full animate-pulse" />
                      <div className="flex flex-col items-center">
                        <div className="h-16 w-32 bg-white/10 rounded-lg animate-pulse" />
                      </div>
                    </div>

                    {/* Weather Details */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex flex-col items-center gap-2"
                        >
                          <div className="h-8 w-8 bg-white/10 rounded-lg animate-pulse" />
                          <div className="h-4 w-16 bg-white/10 rounded-lg animate-pulse" />
                        </div>
                      ))}
                    </div>

                    <div className="w-full h-px bg-white/10 " />

                    {/* Temperature Preference */}
                    <div>
                      <div className="h-7 w-32 bg-white/10 rounded-lg animate-pulse mx-auto mb-4" />

                      <div className="grid grid-cols-3 justify-center gap-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="h-10 w-full bg-white/10 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="w-full h-px bg-white/10" />

                    {/* Clothing Items */}
                    <div>
                      <div className="h-7 w-64 bg-white/10 rounded-lg animate-pulse mx-auto mb-4" />
                      <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 2 }).map((_, index) => (
                          <div
                            key={index}
                            className="h-[600px] w-full bg-white/10 rounded-xl animate-pulse"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : !selectedWeather && !isLoading && !isInitialLoad ? (
              <div className="text-center py-12 glass-card rounded-3xl mt-8">
                <p className="text-white/80 animate-pulse text-lg">
                  {currentTranslations?.app?.noLocation}
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-12 glass-card rounded-3xl mt-8">
                <div className="flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-white/80">
                      {currentTranslations?.app?.error}
                    </p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="px-8 py-2  bg-white/10 hover:bg-white/20 text-white/80 transition-colors rounded-xl"
                  >
                    {currentTranslations?.app?.retry}
                  </button>
                </div>
              </div>
            ) : selectedWeather ? (
              <div className="space-y-8 mt-8">
                <div className="glass-card p-6 rounded-3xl pt-8">
                  <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                    {/* Left Column */}
                    <div dir={"ltr"}>
                      {/* Temperature Display */}
                      {locationString && (
                        <div className="flex flex-col items-center mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-medium text-white font-display">
                              {formattedLocation.name}
                              {formattedLocation.countryCode && (
                                <>
                                  ,{" "}
                                  <FormattedCountry
                                    countryCode={formattedLocation.countryCode}
                                    language={language}
                                  />
                                </>
                              )}
                            </span>
                          </div>
                          <TimeAgo
                            date={lastUpdated}
                            className="text-sm text-white/60 mt-0"
                            language={language}
                          />
                        </div>
                      )}
                      <div
                        className={`${language === "ar" ? "flex-row-reverse" : "flex-row"}`}
                      >
                        <motion.div
                          layout
                          className="flex justify-center items-center"
                        >
                          <motion.div layout>
                            <WeatherIcon
                              condition={
                                selectedWeather?.weather?.icon || "01d"
                              }
                              className="w-16 h-16 -translate-y-1 -translate-x-2"
                              isNight={
                                selectedWeather?.weather?.icon?.endsWith("n") ||
                                false
                              }
                            />
                          </motion.div>
                          <motion.div layout className="flex flex-col">
                            <motion.div layout className="flex gap-[8px]">
                              <TemperatureValue
                                value={Math.round(
                                  tempUnit === "C"
                                    ? selectedWeather.temperature
                                    : (selectedWeather.temperature * 9) / 5 +
                                        32,
                                )}
                                className="text-7xl font-bold"
                                language={language}
                              />
                              <motion.div
                                layout
                                className="flex gap-2 -translate-x-2"
                              >
                                <motion.span
                                  layout
                                  className="text-2xl font-bold -translate-y-2 translate-x-1"
                                >
                                  °
                                </motion.span>
                                <TemperatureToggle
                                  onChange={setTempUnit}
                                  language={language}
                                />
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      </div>
                      <motion.div
                        layout
                        className=" text-sm text-white/80 text-center -mt-2 mb-2 grid-cols-1 font-display"
                        transition={{ duration: 0.2 }}
                      >
                        {
                          currentTranslations?.weather.descriptions[
                            selectedWeather?.weather?.description
                              .replace(" ", "")
                              .toLowerCase()
                          ]
                        }
                      </motion.div>
                      <div className="text-sm text-white/60 text-center mt-1">
                        {currentTranslations?.weather.feelsLike}{" "}
                        <AnimatedValue
                          value={Math.round(
                            tempUnit === "C"
                              ? selectedWeather.feelsLike
                              : (selectedWeather.feelsLike * 9) / 5 + 32,
                          )}
                        />
                        °{tempUnit}
                      </div>

                      {/* Secondary Weather Data */}
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.min}
                          icon={
                            <WiThermometer className="w-8 h-8 text-blue-300" />
                          }
                          value={
                            <AnimatedValue
                              value={
                                tempUnit === "C"
                                  ? selectedWeather.tempMin
                                  : (selectedWeather.tempMin * 9) / 5 + 32
                              }
                              unit={`°${tempUnit}`}
                            />
                          }
                        />
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.max}
                          icon={
                            <WiThermometer className="w-8 h-8 text-red-300" />
                          }
                          value={
                            <AnimatedValue
                              value={
                                tempUnit === "C"
                                  ? selectedWeather.tempMax
                                  : (selectedWeather.tempMax * 9) / 5 + 32
                              }
                              unit={`°${tempUnit}`}
                            />
                          }
                        />
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.wind}
                          icon={
                            <FaFan
                              className="w-6 h-6 text-white transition-all"
                              style={getWindStyle(selectedWeather.windSpeed)}
                            />
                          }
                          value={
                            <AnimatedValue
                              value={selectedWeather.windSpeed}
                              unit={` ${currentTranslations?.weather.windSpeed}`}
                              language={language}
                            />
                          }
                        />
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.rain}
                          icon={
                            <RainIcon value={selectedWeather.precipitation} />
                          }
                          value={
                            <AnimatedValue
                              value={selectedWeather.precipitation}
                              unit="%"
                            />
                          }
                        />
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.humidity}
                          icon={
                            <HumidityIcon value={selectedWeather.humidity} />
                          }
                          value={
                            <AnimatedValue
                              value={selectedWeather.humidity}
                              unit="%"
                            />
                          }
                        />
                        <SecondaryWeatherData
                          label={currentTranslations?.weather.uvIndex}
                          icon={<UVIcon value={selectedWeather.uvIndex} />}
                          value={
                            <AnimatedValue value={selectedWeather.uvIndex} />
                          }
                        />
                      </div>
                    </div>
                    {/* Right Column */}
                    <div>
                      {/* Secondary Weather Data */}

                      <div className="w-full h-px bg-white/10 my-4" />
                      <h3 className="text-lg font-semibold text-white mb-4 text-center font-display">
                        {currentTranslations?.app?.temperaturePreference}
                      </h3>

                      <div className="mb-4">
                        <TemperaturePreference
                          onChange={setTempPreference}
                          language={language}
                        />
                      </div>

                      <div className="w-full h-px bg-white/10 my-4" />
                      <h3 className="text-lg font-semibold text-white mb-4 text-center font-display">
                        {formatDateQuestion(
                          language,
                          getDateText(selectedDate),
                        )}
                      </h3>

                      <div className="grid grid-cols-4 gap-4 items-start">
                        {/* Model Image Section - 1/4 on mobile, 2/4 on desktop */}
                        <div className="col-span-4 sm:col-span-2 h-fit">
                          <div
                            id="model-image"
                            className="h-[400px] sm:h-[600px] w-full relative rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg"
                          >
                            {selectedWeather && (
                              <ModelImage
                                temperature={selectedWeather.temperature}
                                weatherName={selectedWeather.weather.name}
                                onIndexChange={setCurrentOutfitIndex}
                                currentIndex={currentOutfitIndex}
                                language={language}
                              />
                            )}
                          </div>
                        </div>

                        {/* Recommendations List Section - 3/4 on mobile, 2/4 on desktop */}
                        <div className="col-span-4 sm:col-span-2 h-fit p-6 rounded-2xl bg-white/5 backdrop-blur-lg">
                          {isLoading ? (
                            <div className="h-full rounded animate-pulse" />
                          ) : selectedWeather ? (
                            <div className="space-y-4">
                              <OutfitList
                                items={getClothingRecommendations(
                                  {
                                    temperature: selectedWeather.temperature,
                                    windSpeed: selectedWeather.windSpeed,
                                    humidity: selectedWeather.humidity,
                                    isRaining:
                                      selectedWeather.precipitation > 60,
                                    unit: tempUnit,
                                    uv:
                                      selectedWeather.uvIndex ??
                                      (selectedWeather.temperature >= 25
                                        ? 3
                                        : 1),
                                  },
                                  tempPreference,
                                )}
                                language={language}
                              />
                            </div>
                          ) : null}
                        </div>
                      </div>

                      {/* Pagination Indicators */}
                      <div className="flex justify-center gap-2 mt-6">
                        {Array.from({ length: NUMBER_OF_OUTFITS }).map(
                          (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentOutfitIndex(index)}
                              className={`w-2 h-2 rounded-full transition-all hover:bg-white hover:animate-pulse ${
                                index === currentOutfitIndex
                                  ? "bg-white w-6"
                                  : "bg-white/50"
                              }`}
                              aria-label={`Go to outfit ${index + 1}`}
                            />
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !isLoading &&
              error && (
                <div className="text-center py-12 glass-card rounded-3xl mt-6">
                  <p className="text-white/80">
                    {currentTranslations?.app?.error}
                  </p>
                  <button
                    onClick={handleRetry}
                    className="px-8 py-2 mt-4  bg-white/10 hover:bg-white/20 text-white/80 transition-colors rounded-xl"
                  >
                    {currentTranslations?.app?.retry}
                  </button>
                </div>
              )
            )}
          </main>
        </div>
      </div>
    </main>
  );
}
