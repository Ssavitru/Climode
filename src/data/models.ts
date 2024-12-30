interface ModelOutfit {
  url: string;
  alt: string;
  style: 'casual' | 'formal' | 'sport';
  weather: 'cold' | 'mild' | 'warm' | 'hot';
}

export const modelOutfits: ModelOutfit[] = [
  // Tenues pour temps froid
  {
    url: '/images/models/winter-casual-1.jpg',
    alt: 'Tenue d\'hiver décontractée avec manteau gris',
    style: 'casual',
    weather: 'cold'
  },
  {
    url: '/images/models/winter-formal-1.jpg',
    alt: 'Tenue d\'hiver formelle avec manteau noir',
    style: 'formal',
    weather: 'cold'
  },
  {
    url: '/images/models/winter-sport-1.jpg',
    alt: 'Tenue de sport d\'hiver',
    style: 'sport',
    weather: 'cold'
  },
  
  // Tenues pour temps doux
  {
    url: '/images/models/spring-casual-1.jpg',
    alt: 'Tenue de mi-saison décontractée',
    style: 'casual',
    weather: 'mild'
  },
  {
    url: '/images/models/spring-formal-1.jpg',
    alt: 'Tenue de mi-saison formelle',
    style: 'formal',
    weather: 'mild'
  },
  {
    url: '/images/models/spring-sport-1.jpg',
    alt: 'Tenue de sport de mi-saison',
    style: 'sport',
    weather: 'mild'
  },

  // Tenues pour temps chaud
  {
    url: '/images/models/summer-casual-1.jpg',
    alt: 'Tenue d\'été décontractée',
    style: 'casual',
    weather: 'warm'
  },
  {
    url: '/images/models/summer-formal-1.jpg',
    alt: 'Tenue d\'été formelle',
    style: 'formal',
    weather: 'warm'
  },
  {
    url: '/images/models/summer-sport-1.jpg',
    alt: 'Tenue de sport d\'été',
    style: 'sport',
    weather: 'warm'
  },

  // Tenues pour temps très chaud
  {
    url: '/images/models/hot-casual-1.jpg',
    alt: 'Tenue légère décontractée',
    style: 'casual',
    weather: 'hot'
  },
  {
    url: '/images/models/hot-formal-1.jpg',
    alt: 'Tenue légère formelle',
    style: 'formal',
    weather: 'hot'
  },
  {
    url: '/images/models/hot-sport-1.jpg',
    alt: 'Tenue de sport légère',
    style: 'sport',
    weather: 'hot'
  }
];

export function getWeatherCategory(temperature: number): 'cold' | 'mild' | 'warm' | 'hot' {
  if (temperature < 10) return 'cold';
  if (temperature < 20) return 'mild';
  if (temperature < 28) return 'warm';
  return 'hot';
}

export function getRandomOutfits(temperature: number, count: number = 3): ModelOutfit[] {
  const weatherCategory = getWeatherCategory(temperature);
  
  // Filtrer les tenues pour la météo actuelle
  const suitableOutfits = modelOutfits.filter(outfit => outfit.weather === weatherCategory);
  
  // Si pas assez de tenues, prendre aussi celles de la météo la plus proche
  if (suitableOutfits.length < count) {
    const nearbyWeather = weatherCategory === 'cold' ? 'mild' 
      : weatherCategory === 'hot' ? 'warm'
      : weatherCategory === 'mild' ? 'cold'
      : 'mild';
    
    const nearbyOutfits = modelOutfits.filter(outfit => outfit.weather === nearbyWeather);
    suitableOutfits.push(...nearbyOutfits);
  }
  
  // Mélanger les tenues et en prendre le nombre demandé
  return suitableOutfits
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}
