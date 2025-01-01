// Weather and clothing-related types and interfaces
export type WeatherParams = {
  temperature: number;
  windSpeed: number;
  rainProbability: number;
  humidity: number;
  uvIndex: number;
  hour: number;
  precipitation: number;
  tempFeelsLike: number;
};

export type TemperaturePreference = "cold" | "normal" | "warm";
export type PriorityLevel = "required" | "optional" | "optional";

export interface ClothingItem {
  type: string;
  priority: PriorityLevel;
  isOptional: boolean;
  description?: string;
}

// Priority order mapping for comparing priorities
const PRIORITY_ORDER: Record<PriorityLevel, number> = {
  required: 3,
  optional: 2,
  optional: 1,
} as const;

// Weather condition thresholds
const WEATHER_THRESHOLDS = {
  TEMPERATURE: {
    EXTREME_COLD: -10,
    VERY_COLD: 0,
    COLD: 10,
    MILD: 20,
    WARM: 25,
    HOT: 30,
    EXTREME_HOT: 35,
  },
  PRECIPITATION: {
    LIGHT: 2.5,
    MODERATE: 7,
    HEAVY: 15,
  },
  WIND: {
    BREEZY: 5,
    WINDY: 15,
    VERY_WINDY: 30,
    STORM: 45,
  },
  UV: {
    MODERATE: 3,
    HIGH: 6,
    EXTREME: 8,
  },
  HUMIDITY: {
    DRY: 30,
    COMFORTABLE: 50,
    HUMID: 70,
    VERY_HUMID: 85,
  },
  TIME: {
    EARLY_MORNING: 6,
    LATE_MORNING: 10,
    EARLY_EVENING: 17,
    NIGHT: 20,
  },
} as const;

// Temperature preference adjustments
const TEMPERATURE_ADJUSTMENTS: Record<TemperaturePreference, number> = {
  cold: -3,
  normal: 0,
  warm: 3,
};

// Clothing categories to prevent duplicates
const CLOTHING_CATEGORIES = {
  pants: ["insulatedPants", "warmPants", "regularPants", "lightPants", "shorts"],
  jacket: ["heavyCoat", "warmJacket", "lightJacket", "rainJacket", "lightRainJacket", "windbreaker"],
  shirt: ["thermalShirt", "thermalUnderwear", "longSleeveShirt", "lightLongSleeveShirt", "regularShirt", "tshirt"],
  sweater: ["heavySweater", "lightSweater"],
  hat: ["winterHat", "warmHat", "sunHat"],
  footwear: ["winterBoots", "rainBoots", "warmShoes", "regularShoes", "lightShoes"]
} as const;

// Clothing types and descriptions
export const CLOTHING_TYPES = {
  TOPS: ["tshirt", "longSleeveShirt", "moistureWickingShirt", "thermalShirt"],
  BOTTOMS: ["shorts", "regularPants", "warmPants", "thermalUnderwear"],
  OUTERWEAR: ["lightJacket", "warmJacket", "heavyCoat", "rainJacket", "lightRainJacket", "windbreaker"],
  MIDLAYER: ["lightSweater", "heavySweater"],
  ACCESSORIES: ["sunglasses", "sunHat", "warmHat", "gloves", "umbrella"],
  FOOTWEAR: ["regularShoes", "warmShoes", "rainBoots", "winterBoots"],
} as const;

export const CLOTHING_DESCRIPTIONS: Record<string, string> = {
  // Tops
  tshirt: "T-shirt léger et confortable pour les chaudes journées",
  longSleeveShirt: "Haut à manches longues respirant idéal pour les températures douces",
  moistureWickingShirt: "Haut technique qui évacue la transpiration, parfait pour l'humidité",
  thermalShirt: "Haut thermique pour les températures froides",
  
  // Bottoms
  shorts: "Short léger pour les journées chaudes",
  regularPants: "Pantalon confortable pour toutes les occasions",
  warmPants: "Pantalon chaud pour les températures basses",
  thermalUnderwear: "Sous-vêtement thermique pour les températures très froides",
  
  // Outerwear
  lightJacket: "Veste légère pour les températures douces",
  warmJacket: "Veste chaude pour les températures froides",
  heavyCoat: "Manteau épais pour les températures très froides",
  rainJacket: "Veste imperméable pour la pluie",
  lightRainJacket: "Veste légère imperméable pour la pluie légère",
  windbreaker: "Coupe-vent pour se protéger du vent",
  
  // Midlayer
  lightSweater: "Pull léger pour les températures douces",
  heavySweater: "Pull épais pour les températures froides",
  
  // Accessories
  sunglasses: "Lunettes de soleil pour la protection UV",
  sunHat: "Chapeau pour la protection solaire",
  warmHat: "Bonnet chaud pour les températures froides",
  gloves: "Gants pour protéger les mains du froid",
  umbrella: "Parapluie pour la protection contre la pluie",
  
  // Footwear
  regularShoes: "Chaussures confortables pour un usage quotidien",
  warmShoes: "Chaussures chaudes pour les températures froides",
  rainBoots: "Bottes imperméables pour la pluie",
  winterBoots: "Bottes d'hiver pour les températures très froides",
} as const;

// Weather condition evaluation class
class WeatherConditionEvaluator {
  private params: WeatherParams;
  private thresholds: typeof WEATHER_THRESHOLDS;

  constructor(params: WeatherParams) {
    this.params = params;
    this.thresholds = WEATHER_THRESHOLDS;
  }

  get temperatureConditions() {
    const { tempFeelsLike } = this.params;
    return {
      isExtremeCold: tempFeelsLike < this.thresholds.TEMPERATURE.EXTREME_COLD,
      isVeryCold: tempFeelsLike >= this.thresholds.TEMPERATURE.EXTREME_COLD && tempFeelsLike < this.thresholds.TEMPERATURE.VERY_COLD,
      isCold: tempFeelsLike >= this.thresholds.TEMPERATURE.VERY_COLD && tempFeelsLike < this.thresholds.TEMPERATURE.COLD,
      isMild: tempFeelsLike >= this.thresholds.TEMPERATURE.COLD && tempFeelsLike < this.thresholds.TEMPERATURE.MILD,
      isWarm: tempFeelsLike >= this.thresholds.TEMPERATURE.MILD && tempFeelsLike < this.thresholds.TEMPERATURE.WARM,
      isHot: tempFeelsLike >= this.thresholds.TEMPERATURE.WARM && tempFeelsLike < this.thresholds.TEMPERATURE.HOT,
      isExtremeHot: tempFeelsLike >= this.thresholds.TEMPERATURE.HOT,
    };
  }

  get precipitationConditions() {
    const { precipitation } = this.params;
    return {
      isHeavyRain: precipitation > this.thresholds.PRECIPITATION.HEAVY,
      isModerateRain: precipitation > this.thresholds.PRECIPITATION.MODERATE && precipitation <= this.thresholds.PRECIPITATION.HEAVY,
      isLightRain: precipitation > 0 && precipitation <= this.thresholds.PRECIPITATION.MODERATE,
      isAnyRain: precipitation > 0,
    };
  }

  get windConditions() {
    const { windSpeed } = this.params;
    return {
      isStorm: windSpeed > this.thresholds.WIND.STORM,
      isVeryWindy: windSpeed > this.thresholds.WIND.VERY_WINDY && windSpeed <= this.thresholds.WIND.STORM,
      isWindy: windSpeed > this.thresholds.WIND.WINDY && windSpeed <= this.thresholds.WIND.VERY_WINDY,
      isBreezy: windSpeed > this.thresholds.WIND.BREEZY && windSpeed <= this.thresholds.WIND.WINDY,
    };
  }

  get uvConditions() {
    const { uvIndex } = this.params;
    return {
      isExtremeUV: uvIndex >= this.thresholds.UV.EXTREME,
      isHighUV: uvIndex >= this.thresholds.UV.HIGH && uvIndex < this.thresholds.UV.EXTREME,
      isModerateUV: uvIndex >= this.thresholds.UV.MODERATE && uvIndex < this.thresholds.UV.HIGH,
    };
  }

  get humidityConditions() {
    const { humidity } = this.params;
    return {
      isDry: humidity < this.thresholds.HUMIDITY.DRY,
      isComfortable: humidity >= this.thresholds.HUMIDITY.DRY && humidity < this.thresholds.HUMIDITY.HUMID,
      isHumid: humidity >= this.thresholds.HUMIDITY.HUMID && humidity < this.thresholds.HUMIDITY.VERY_HUMID,
      isVeryHumid: humidity >= this.thresholds.HUMIDITY.VERY_HUMID,
    };
  }

  get timeOfDayConditions() {
    const { hour } = this.params;
    return {
      isEarlyMorning: hour >= this.thresholds.TIME.EARLY_MORNING && hour < this.thresholds.TIME.LATE_MORNING,
      isDay: hour >= this.thresholds.TIME.LATE_MORNING && hour < this.thresholds.TIME.EARLY_EVENING,
      isEarlyEvening: hour >= this.thresholds.TIME.EARLY_EVENING && hour < this.thresholds.TIME.NIGHT,
      isNight: hour >= this.thresholds.TIME.NIGHT || hour < this.thresholds.TIME.EARLY_MORNING,
    };
  }

  get isDaytime() {
    const { hour } = this.params;
    return hour >= this.thresholds.TIME.EARLY_MORNING && hour < this.thresholds.TIME.NIGHT;
  }
}

// Clothing recommendation class
class ClothingRecommender {
  private weather: WeatherConditionEvaluator;
  private recommendations: ClothingItem[] = [];

  constructor(weatherParams: WeatherParams) {
    this.weather = new WeatherConditionEvaluator(weatherParams);
  }

  private hasRequiredItemInCategory(category: keyof typeof CLOTHING_TYPES): boolean {
    const categoryItems = CLOTHING_TYPES[category];
    return this.recommendations.some(item => 
      categoryItems.includes(item.type as any) && item.priority === "required"
    );
  }

  private addItem(type: string, priority: PriorityLevel = "optional", isOptional: boolean = false): void {
    // Find which category this item belongs to
    const category = Object.entries(CLOTHING_TYPES).find(([_, items]) => 
      items.includes(type as any)
    )?.[0] as keyof typeof CLOTHING_TYPES | undefined;

    if (category && priority === "required" && this.hasRequiredItemInCategory(category)) {
      // If we already have a required item in this category, make this one optional instead
      priority = "optional";
    }

    // Don't add duplicate items
    if (!this.recommendations.some(item => item.type === type)) {
      this.recommendations.push({
        type,
        priority,
        isOptional,
        description: CLOTHING_DESCRIPTIONS[type],
      });
    }
  }

  private selectBaseLayer(): void {
    const { isExtremeCold, isVeryCold, isCold, isMild, isWarm, isHot } = this.weather.temperatureConditions;
    const { isHumid, isVeryHumid } = this.weather.humidityConditions;
    const { isEarlyMorning, isDay, isEarlyEvening } = this.weather.timeOfDayConditions;

    // Base layer selection based on temperature and humidity
    if (isExtremeCold || isVeryCold) {
      this.addItem("thermalUnderwear", "required");
      this.addItem("thermalShirt", "required");
    } else if (isCold) {
      this.addItem("thermalShirt", "required");
      if (isHumid || isVeryHumid) {
        this.addItem("moistureWickingShirt", "optional");
      }
    } else if (isMild) {
      if (isEarlyMorning || isEarlyEvening) {
        this.addItem("longSleeveShirt", "required");
        this.addItem("tshirt", "optional");
      } else if (isDay) {
        this.addItem("tshirt", "required");
      }
    } else if (isWarm || isHot) {
      if (isHumid || isVeryHumid) {
        this.addItem("moistureWickingShirt", "required");
      } else {
        this.addItem("tshirt", "required");
      }
    }
  }

  private selectMidLayer(): void {
    const { isExtremeCold, isVeryCold, isCold, isMild } = this.weather.temperatureConditions;
    const { isEarlyMorning, isDay, isEarlyEvening } = this.weather.timeOfDayConditions;

    if (isExtremeCold || isVeryCold) {
      this.addItem("heavySweater", "required");
    } else if (isCold) {
      this.addItem("lightSweater", "required");
    } else if (isMild) {
      if (isEarlyMorning || isEarlyEvening) {
        this.addItem("lightSweater", "optional");
      }
    }
  }

  private selectOuterLayer(): void {
    const { isExtremeCold, isVeryCold, isCold, isMild, isWarm, isHot } = this.weather.temperatureConditions;
    const { isWindy, isVeryWindy } = this.weather.windConditions;
    const { isRainy, isHeavyRain } = this.weather.precipitationConditions;
    const { isEarlyMorning, isDay, isEarlyEvening } = this.weather.timeOfDayConditions;

    // Prioritize weather protection
    if (isHeavyRain) {
      this.addItem("rainJacket", "required");
    } else if (isRainy) {
      this.addItem("lightRainJacket", "required");
    } else if (isVeryWindy) {
      if (isCold || isVeryCold) {
        this.addItem("warmJacket", "required");
      } else {
        this.addItem("windbreaker", "required");
      }
    } else {
      // Temperature-based outer layer
      if (isExtremeCold) {
        this.addItem("heavyCoat", "required");
      } else if (isVeryCold) {
        this.addItem("warmJacket", "required");
      } else if (isCold) {
        this.addItem("lightJacket", "required");
      } else if (isMild && (isEarlyMorning || isEarlyEvening)) {
        this.addItem("lightJacket", "optional");
      } else if (isWarm && !this.hasRequiredItemInCategory("OUTERWEAR")) {
        this.addItem("windbreaker", "optional");
      }
    }
  }

  private selectRainProtection(): void {
    const { isHeavyRain, isModerateRain, isLightRain } = this.weather.precipitationConditions;
    const { isWarm, isHot, isExtremeCold, isVeryCold, isCold } = this.weather.temperatureConditions;

    // Don't suggest umbrella in very cold or cold weather
    if (isExtremeCold || isVeryCold || isCold) {
      return;
    }

    if (isHeavyRain) {
      if (isWarm || isHot) {
        this.addItem("umbrella", "required");
      } else {
        this.addItem("umbrella", "optional");
      }
    } else if (isModerateRain) {
      if (isWarm || isHot) {
        this.addItem("umbrella", "required");
      } else {
        this.addItem("umbrella", "optional");
      }
    } else if (isLightRain) {
      this.addItem("umbrella", "optional");
    }
  }

  private selectWindProtection(): void {
    const { isWarm, isHot } = this.weather.temperatureConditions;
    const { isWindy, isVeryWindy } = this.weather.windConditions;
    const { isAnyRain } = this.weather.precipitationConditions;

    // Only add windbreaker for warm weather when no other outer layer is present
    if (isWarm && !isHot && !isAnyRain && !this.hasRequiredItemInCategory("OUTERWEAR")) {
      if (isVeryWindy) {
        this.addItem("windbreaker", "required");
      } else if (isWindy) {
        this.addItem("windbreaker", "optional");
      }
    }
  }

  private selectTops(): void {
    const { isExtremeCold, isVeryCold, isCold, isMild, isWarm, isHot, isExtremeHot } = this.weather.temperatureConditions;
    const { isHighUV, isExtremeUV } = this.weather.uvConditions;

    // Always require one type of shirt
    if (isExtremeCold) {
      this.addItem("thermalShirt", "required");
      this.addItem("longSleeveShirt", "required");
    } else if (isVeryCold) {
      this.addItem("thermalShirt", "required");
      this.addItem("longSleeveShirt", "optional");
    } else if (isCold) {
      this.addItem("longSleeveShirt", "required");
    } else if (isExtremeHot) {
      this.addItem("tshirt", "required");
    } else if (isHot || isWarm) {
      this.addItem("tshirt", "required");
      if (isHighUV) {
        this.addItem("lightLongSleeveShirt", "optional");
      }
    } else if (isMild) {
      this.addItem("lightLongSleeveShirt", "optional");
      this.addItem("tshirt", "optional");
    } else {
      this.addItem("longSleeveShirt", "required");
    }
  }

  private selectBottoms(): void {
    const { isExtremeCold, isVeryCold, isCold, isMild, isWarm, isHot, isExtremeHot } = this.weather.temperatureConditions;
    const { isHighUV, isExtremeUV } = this.weather.uvConditions;
    const { isStorm } = this.weather.windConditions;

    // Always require one type of bottom
    if (isExtremeCold || isStorm) {
      this.addItem("insulatedPants", "required");
    } else if (isVeryCold) {
      this.addItem("insulatedPants", "required");
    } else if (isCold) {
      this.addItem("warmPants", "required");
    } else if (isExtremeHot) {
      this.addItem("shorts", "required");
      if (isExtremeUV) {
        this.addItem("lightPants", "optional");
      }
    } else if (isHot) {
      this.addItem("shorts", "required");
      if (isHighUV) {
        this.addItem("lightPants", "optional");
      }
    } else if (isWarm) {
      this.addItem("lightPants", "required");
    } else if (isMild) {
      this.addItem("regularPants", "required");
    } else {
      this.addItem("regularPants", "required");
    }
  }

  private selectFootwear(): void {
    const { isHeavyRain, isModerateRain } = this.weather.precipitationConditions;
    const { isExtremeCold, isVeryCold, isCold, isHot } = this.weather.temperatureConditions;

    // Always require one type of footwear
    if (isHeavyRain || isModerateRain) {
      this.addItem("rainBoots", "required");
    } else if (isExtremeCold) {
      this.addItem("winterBoots", "required");
    } else if (isVeryCold) {
      this.addItem("winterBoots", "required");
    } else if (isCold) {
      this.addItem("warmShoes", "required");
    } else if (isHot) {
      this.addItem("lightShoes", "required");
    } else {
      this.addItem("regularShoes", "required");
    }
  }

  private selectAccessories(): void {
    const { isHighUV, isModerateUV } = this.weather.uvConditions;
    const { isExtremeCold, isVeryCold, isCold, isMild } = this.weather.temperatureConditions;
    const { isWindy } = this.weather.windConditions;
    const { isDry, isComfortable, isHumid, isVeryHumid } = this.weather.humidityConditions;

    // UV protection
    if (isHighUV) {
      this.addItem("sunglasses", "required");
      this.addItem("sunHat", "optional");
    } else if (isModerateUV) {
      this.addItem("sunglasses", "optional");
    }

    // Cold weather accessories
    if (isExtremeCold) {
      this.addItem("winterHat", "required");
      this.addItem("gloves", "required");
    } else if (isVeryCold) {
      this.addItem("winterHat", "required");
      this.addItem("gloves", "required");
    } else if (isCold) {
      this.addItem("warmHat", "required");
      this.addItem("gloves", "optional");
    } else if (isMild && isWindy) {
      this.addItem("warmHat", "optional");
      this.addItem("gloves", "optional");
    }

    // Humidity-based accessories
    if (isVeryHumid) {
      this.addItem("umbrella", "required");
    } else if (isHumid) {
      this.addItem("umbrella", "optional");
    }
  }

  public getRecommendations(): ClothingItem[] {
    // Order matters: outer layers should be checked after inner layers
    this.selectBaseLayer();
    this.selectTops();
    this.selectBottoms();
    this.selectMidLayer();
    this.selectOuterLayer();
    this.selectRainProtection();
    this.selectWindProtection();
    this.selectFootwear();
    this.selectAccessories();

    return this.recommendations;
  }
}

// Helper function to ensure essential clothing items
const ensureEssentialClothing = (recommendations: ClothingItem[]): void => {
  const hasRequiredPants = recommendations.some(item => 
    CLOTHING_CATEGORIES.pants.includes(item.type) && 
    item.priority === "required" && 
    !item.isOptional
  );

  const hasRequiredShirt = recommendations.some(item => 
    CLOTHING_CATEGORIES.shirt.includes(item.type) && 
    item.priority === "required" && 
    !item.isOptional
  );

  const hasRequiredFootwear = recommendations.some(item => 
    CLOTHING_CATEGORIES.footwear.includes(item.type) && 
    item.priority === "required" && 
    !item.isOptional
  );

  // If no required pants, upgrade the highest priority pants
  if (!hasRequiredPants) {
    const pantsItems = recommendations.filter(item => CLOTHING_CATEGORIES.pants.includes(item.type));
    if (pantsItems.length > 0) {
      const highestPriorityPants = pantsItems.reduce((prev, current) => 
        PRIORITY_ORDER[current.priority] > PRIORITY_ORDER[prev.priority] ? current : prev
      );
      highestPriorityPants.priority = "required";
      highestPriorityPants.isOptional = false;
      highestPriorityPants.description = highestPriorityPants.description?.replace(/optional|optional/i, 'required');
    }
  }

  // If no required shirt, upgrade the highest priority shirt
  if (!hasRequiredShirt) {
    const shirtItems = recommendations.filter(item => CLOTHING_CATEGORIES.shirt.includes(item.type));
    if (shirtItems.length > 0) {
      const highestPriorityShirt = shirtItems.reduce((prev, current) => 
        PRIORITY_ORDER[current.priority] > PRIORITY_ORDER[prev.priority] ? current : prev
      );
      highestPriorityShirt.priority = "required";
      highestPriorityShirt.isOptional = false;
      highestPriorityShirt.description = highestPriorityShirt.description?.replace(/optional|optional/i, 'required');
    }
  }

  // If no required footwear, upgrade the highest priority footwear
  if (!hasRequiredFootwear) {
    const footwearItems = recommendations.filter(item => CLOTHING_CATEGORIES.footwear.includes(item.type));
    if (footwearItems.length > 0) {
      const highestPriorityFootwear = footwearItems.reduce((prev, current) => 
        PRIORITY_ORDER[current.priority] > PRIORITY_ORDER[prev.priority] ? current : prev
      );
      highestPriorityFootwear.priority = "required";
      highestPriorityFootwear.isOptional = false;
      highestPriorityFootwear.description = highestPriorityFootwear.description?.replace(/optional|optional/i, 'required');
    }
  }
};

// Main function to get clothing recommendations
export const getClothingRecommendations = (
  params: WeatherParams,
  preference: TemperaturePreference
): ClothingItem[] => {
  // Adjust temperature based on user preference
  const adjustedParams = {
    ...params,
    tempFeelsLike: params.tempFeelsLike + TEMPERATURE_ADJUSTMENTS[preference],
  };

  const recommender = new ClothingRecommender(adjustedParams);
  const recommendations = recommender.getRecommendations();

  // Ensure essential clothing items are present
  ensureEssentialClothing(recommendations);

  return recommendations;
};

// Model image types and interfaces
interface ModelImageData {
  outfits: Array<{
    url: string;
    alt: string;
    photographer?: string;
    photographerUrl?: string;
  }>;
}

interface StyleConfig {
  style: string;
  searchTerms: string[];
}

// Helper function to determine style and search terms based on weather
const getStyleAndSearchTerms = (temperature: number, weatherName: string): StyleConfig => {
  const weatherLower = weatherName.toLowerCase();
  const baseConfig: StyleConfig = {
    style: "casual",
    searchTerms: [],
  };

  // Temperature-based terms
  if (temperature < 5) {
    baseConfig.searchTerms = ["winter outfit", "warm winter fashion"];
  } else if (temperature < 12) {
    baseConfig.searchTerms = ["cold weather outfit", "fall fashion"];
  } else if (temperature < 18) {
    baseConfig.searchTerms = ["spring outfit", "light jacket fashion"];
  } else if (temperature < 24) {
    baseConfig.searchTerms = ["spring fashion", "casual outfit"];
  } else if (temperature < 30) {
    baseConfig.searchTerms = ["summer outfit", "light summer fashion"];
  } else {
    baseConfig.searchTerms = ["summer outfit", "hot weather fashion"];
  }

  // Weather-specific adjustments
  if (weatherLower.includes("rain")) {
    baseConfig.searchTerms.push("rainy day fashion");
    baseConfig.style = "casual";
  } else if (weatherLower.includes("snow")) {
    baseConfig.searchTerms.push("snow day fashion");
    baseConfig.style = "casual";
  } else if (weatherLower.includes("wind")) {
    baseConfig.searchTerms.push("windy day fashion");
  }

  return baseConfig;
};

// Function to get model images
export const getModelImage = async (
  temperature: number,
  weatherName: string
): Promise<ModelImageData> => {
  const DEFAULT_IMAGE: ModelImageData = {
    outfits: [{
      url: "https://images.pexels.com/photos/2994400/pexels-photo-2994400.jpeg",
      alt: `Default ${temperature < 18 ? 'warm' : 'light'} outfit for ${weatherName} weather`,
      photographer: "Pexels",
      photographerUrl: "https://www.pexels.com"
    }]
  };

  try {
    const { style, searchTerms } = getStyleAndSearchTerms(temperature, weatherName);
    const response = await fetch(
      `/api/fashion?query=${encodeURIComponent(searchTerms.join(" "))}&style=${style}&count=5`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch fashion images');
    }

    const data = await response.json();
    
    if (data.outfits?.length > 0) {
      return {
        outfits: data.outfits.map((outfit: any) => ({
          url: outfit.url,
          alt: outfit.alt || `${style} outfit for ${temperature}°C ${weatherName} weather`,
          photographer: outfit.photographer,
          photographerUrl: outfit.photographerUrl
        }))
      };
    }

    return DEFAULT_IMAGE;
  } catch (error) {
    console.error('Error fetching fashion images:', error);
    return DEFAULT_IMAGE;
  }
};