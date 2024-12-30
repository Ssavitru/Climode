import { NextResponse } from 'next/server';

// In-memory cache for country translations
const countryCache: { [key: string]: any } = {};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('code');
    const language = searchParams.get('language') || 'en';

    if (!countryCode) {
      return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
    }

    // Check cache first
    if (countryCache[countryCode]) {
      return NextResponse.json({ name: countryCache[countryCode][language] || countryCache[countryCode]['en'] || countryCode });
    }

    // Fetch from REST Countries API
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    
    if (!response.ok) {
      return NextResponse.json({ name: countryCode });
    }

    const [data] = await response.json();
    
    // Map the translations to our supported languages
    countryCache[countryCode] = {
      en: data.name?.common || countryCode,
      fr: data.translations?.fra?.common,
      es: data.translations?.spa?.common,
      de: data.translations?.deu?.common,
      it: data.translations?.ita?.common,
      ar: data.translations?.ara?.common
    };

    const translatedName = countryCache[countryCode][language] || 
                          countryCache[countryCode]['en'] || 
                          countryCode;

    return NextResponse.json({ name: translatedName });

  } catch (error) {
    console.error('Error fetching country translation:', error);
    return NextResponse.json({ name: countryCode });
  }
}
