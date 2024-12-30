import { useCountryName } from '@/hooks/useCountryName';

interface LocationDisplayProps {
  city?: string;
  country?: string;
  className?: string;
}

export function LocationDisplay({ city, country, className = '' }: LocationDisplayProps) {
  const translatedCountry = useCountryName(country || '', 'en');
  
  if (!city || !country) return null;

  return (
    <div className={className}>
      <span>{city}, </span>
      <span>{translatedCountry || country}</span>
    </div>
  );
}
