import { Language } from "@/types";

interface LocationSuggestionItemProps {
  city: string;
  country: string;
  state?: string;
  language: Language;
  onClick: () => void;
  isSelected?: boolean;
}

export function LocationSuggestionItem({
  city,
  country,
  state,
  language,
  onClick,
  isSelected = false,
}: LocationSuggestionItemProps) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  };

  // Use Intl.DisplayNames to get localized country name
  const countryName =
    country &&
    new Intl.DisplayNames([language], { type: "region" }).of(country);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`px-4 py-2 cursor-pointer rounded-md transition-colors ${
        isSelected ? "bg-white/20" : "hover:bg-white/10"
      }`}
    >
      <span className="font-medium">{city}</span>
      {countryName && <span className="text-gray-300">, {countryName}</span>}
    </div>
  );
}
