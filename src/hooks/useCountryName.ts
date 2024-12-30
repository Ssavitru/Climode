import { useState, useEffect } from "react";
import { Language } from "@/types";

export function useCountryName(countryCode: string, language: Language) {
  const [countryName, setCountryName] = useState<string>("");

  useEffect(() => {
    const fetchCountryName = async () => {
      if (!countryCode) {
        setCountryName("");
        return;
      }

      try {
        const response = await fetch(
          `/api/country?code=${countryCode}&lang=${language}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch country name");
        }

        const data = await response.json();
        setCountryName(data.name || countryCode);
      } catch (error) {
        // Fallback to country code on error
        setCountryName(countryCode);
      }
    };

    fetchCountryName();
  }, [countryCode, language]);

  return countryName;
}
