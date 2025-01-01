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
export type PriorityLevel = "required" | "suggested" | "optional";

export interface ClothingItem {
  type: string;
  priority: PriorityLevel;
  isOptional: boolean;
  description?: string;
}

// Priority order mapping for comparing priorities
const PRIORITY_ORDER: Record<PriorityLevel, number> = {
  required: 3,
  suggested: 2,
  optional: 1,
} as const;

// Weather condition thresholds
const WEATHER_THRESHOLDS = {
  TEMPERATURE: {
    VERY_COLD: 0,
    COLD: 10,
    MILD: 20,
    WARM: 25,
    HOT: 30,
  },
  PRECIPITATION: {
    LIGHT: 2.5,
    MODERATE: 7,
  },
  WIND: {
    BREEZY: 5,
    WINDY: 15,
    VERY_WINDY: 30,
  },
  UV: {
    MODERATE: 3,
    HIGH: 6,
  },
  TIME: {
    DAY_START: 6,
    DAY_END: 20,
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
  jacket: ["heavyCoat", "warmJacket", "lightJacket", "rainJacket", "windbreaker"],
  shirt: ["thermalUnderwear", "longSleeveShirt", "regularShirt", "tshirt"],
  sweater: ["heavySweater", "lightSweater"],
  hat: ["winterHat", "warmHat", "sunHat"],
  footwear: ["winterBoots", "rainBoots", "warmShoes", "regularShoes", "lightShoes"]
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
      isVeryCold: tempFeelsLike < this.thresholds.TEMPERATURE.VERY_COLD,
      isCold: tempFeelsLike >= this.thresholds.TEMPERATURE.VERY_COLD && tempFeelsLike < this.thresholds.TEMPERATURE.COLD,
      isMild: tempFeelsLike >= this.thresholds.TEMPERATURE.COLD && tempFeelsLike < this.thresholds.TEMPERATURE.MILD,
      isWarm: tempFeelsLike >= this.thresholds.TEMPERATURE.MILD && tempFeelsLike < this.thresholds.TEMPERATURE.WARM,
      isHot: tempFeelsLike >= this.thresholds.TEMPERATURE.HOT,
    };
  }

  get precipitationConditions() {
    const { precipitation } = this.params;
    return {
      isHeavyRain: precipitation > this.thresholds.PRECIPITATION.MODERATE,
      isModerateRain: precipitation > this.thresholds.PRECIPITATION.LIGHT && precipitation <= this.thresholds.PRECIPITATION.MODERATE,
      isLightRain: precipitation > 0 && precipitation <= this.thresholds.PRECIPITATION.LIGHT,
      isAnyRain: precipitation > 0,
    };
  }

  get windConditions() {
    const { windSpeed } = this.params;
    return {
      isVeryWindy: windSpeed > this.thresholds.WIND.VERY_WINDY,
      isWindy: windSpeed > this.thresholds.WIND.WINDY && windSpeed <= this.thresholds.WIND.VERY_WINDY,
      isBreezy: windSpeed > this.thresholds.WIND.BREEZY && windSpeed <= this.thresholds.WIND.WINDY,
    };
  }

  get uvConditions() {
    const { uvIndex } = this.params;
    return {
      isHighUV: uvIndex >= this.thresholds.UV.HIGH,
      isModerateUV: uvIndex >= this.thresholds.UV.MODERATE && uvIndex < this.thresholds.UV.HIGH,
    };
  }

  get isDaytime() {
    const { hour } = this.params;
    return hour >= this.thresholds.TIME.DAY_START && hour < this.thresholds.TIME.DAY_END;
  }
}

// Clothing recommendation class
class ClothingRecommender {
  private weather: WeatherConditionEvaluator;
  private recommendations: ClothingItem[] = [];

  constructor(weatherParams: WeatherParams) {
    this.weather = new WeatherConditionEvaluator(weatherParams);
  }

  private hasItemInCategory(itemType: string): boolean {
    for (const [category, items] of Object.entries(CLOTHING_CATEGORIES)) {
      if (items.includes(itemType)) {
        return this.recommendations.some(item => 
          items.includes(item.type) && 
          item.priority === "required"
        );
      }
    }
    return false;
  }

  private addItem(type: string, priority: PriorityLevel = "suggested", isOptional: boolean = false): void {
    // Check if we already have a required item in this category
    if (this.hasItemInCategory(type)) {
      // If trying to add another item in the same category, make it optional
      priority = "optional";
      isOptional = true;
    }

    this.recommendations.push({
      type,
      priority,
      isOptional,
      description: type,
    });
  }

  private selectBaseLayer(): void {
    const { isVeryCold, isCold } = this.weather.temperatureConditions;
    if (isVeryCold) {
      this.addItem("thermalUnderwear", "required");
    } else if (isCold) {
      this.addItem("thermalUnderwear", "suggested");
    }
  }

  private selectMidLayer(): void {
    const { isVeryCold, isCold, isMild, isWarm, isHot } = this.weather.temperatureConditions;
    const { isWindy } = this.weather.windConditions;
    
    // Only add mid layer if we don't have a heavier outer layer
    if (isVeryCold) {
      this.addItem("heavySweater", "required");
    } else if (isCold) {
      if (!isWindy) {
        this.addItem("heavySweater", "required");
      } else {
        this.addItem("lightSweater", "suggested");
      }
    } else if (isMild && !isWarm && !isHot) {
      this.addItem("lightSweater", "suggested");
    }
  }

  private selectOuterLayer(): void {
    const { isVeryCold, isCold, isMild, isWarm, isHot } = this.weather.temperatureConditions;
    const { isWindy, isVeryWindy } = this.weather.windConditions;
    const { isAnyRain, isHeavyRain, isModerateRain } = this.weather.precipitationConditions;

    // Handle rain protection first
    if (isHeavyRain || isModerateRain) {
      if (isVeryCold || isCold) {
        this.addItem("heavyCoat", "required");
      } else if (!isHot) {
        this.addItem("rainJacket", "required");
      }
      return;
    }

    // Handle temperature-based protection
    if (isVeryCold) {
      this.addItem("heavyCoat", "required");
    } else if (isCold) {
      if (isVeryWindy || isWindy) {
        this.addItem("warmJacket", "required");
      } else {
        this.addItem("warmJacket", "suggested");
      }
    } else if (isMild && !isWarm && !isHot) {
      if (isVeryWindy) {
        this.addItem("windbreaker", "required");
      } else if (isWindy) {
        this.addItem("windbreaker", "suggested");
      } else {
        this.addItem("lightJacket", "optional");
      }
    }
  }

  private selectRainProtection(): void {
    const { isHeavyRain, isModerateRain, isLightRain } = this.weather.precipitationConditions;
    const { isWarm, isHot, isVeryCold, isCold } = this.weather.temperatureConditions;

    // Don't suggest umbrella in very cold or cold weather
    if (isVeryCold || isCold) {
      return;
    }

    if (isHeavyRain) {
      if (isWarm || isHot) {
        this.addItem("umbrella", "required");
      } else {
        this.addItem("umbrella", "suggested");
      }
    } else if (isModerateRain) {
      if (isWarm || isHot) {
        this.addItem("umbrella", "required");
      } else {
        this.addItem("umbrella", "suggested");
      }
    } else if (isLightRain) {
      this.addItem("umbrella", "suggested");
    }
  }

  private selectWindProtection(): void {
    const { isVeryWindy, isWindy } = this.weather.windConditions;
    const { isWarm, isHot, isMild } = this.weather.temperatureConditions;
    const { isAnyRain } = this.weather.precipitationConditions;

    // Only add windbreaker for warm weather when no other outer layer is present
    if (isWarm && !isHot && !isAnyRain && !this.hasItemInCategory("jacket")) {
      if (isVeryWindy) {
        this.addItem("windbreaker", "required");
      } else if (isWindy) {
        this.addItem("windbreaker", "suggested");
      }
    }
  }

  private selectTops(): void {
    const { isHot, isWarm, isMild, isCold } = this.weather.temperatureConditions;

    // Always require one type of shirt
    if (isHot || isWarm) {
      this.addItem("tshirt", "required");
      // Suggest a long sleeve shirt for sun protection
      if (this.weather.uvConditions.isHighUV) {
        this.addItem("longSleeveShirt", "optional");
      }
    } else {
      this.addItem("longSleeveShirt", "required");
    }
  }

  private selectBottoms(): void {
    const { isHot, isWarm, isMild, isCold, isVeryCold } = this.weather.temperatureConditions;
    const { isHighUV } = this.weather.uvConditions;

    // Always require one type of bottom
    if (isHot) {
      this.addItem("shorts", "required");
      if (isHighUV) {
        this.addItem("lightPants", "suggested"); // For sun protection
      }
    } else if (isWarm) {
      this.addItem("lightPants", "required");
    } else if (isMild) {
      this.addItem("regularPants", "required");
    } else if (isCold) {
      this.addItem("warmPants", "required");
    } else if (isVeryCold) {
      this.addItem("insulatedPants", "required");
    } else {
      this.addItem("regularPants", "required");
    }
  }

  private selectFootwear(): void {
    const { isHeavyRain, isModerateRain } = this.weather.precipitationConditions;
    const { isVeryCold, isCold, isHot } = this.weather.temperatureConditions;

    // Always require one type of footwear
    if (isHeavyRain || isModerateRain) {
      this.addItem("rainBoots", "required");
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
    const { isVeryCold, isCold, isMild } = this.weather.temperatureConditions;
    const { isWindy } = this.weather.windConditions;

    // UV protection
    if (isHighUV) {
      this.addItem("sunglasses", "required");
      this.addItem("sunHat", "suggested");
    } else if (isModerateUV) {
      this.addItem("sunglasses", "optional");
    }

    // Cold weather accessories
    if (isVeryCold) {
      this.addItem("winterHat", "required");
      this.addItem("gloves", "required");
    } else if (isCold) {
      this.addItem("warmHat", "required");
      this.addItem("gloves", "suggested");
    } else if (isMild && isWindy) {
      this.addItem("warmHat", "suggested");
      this.addItem("gloves", "optional");
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
      highestPriorityPants.description = highestPriorityPants.description?.replace(/optional|suggested/i, 'required');
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
      highestPriorityShirt.description = highestPriorityShirt.description?.replace(/optional|suggested/i, 'required');
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
      highestPriorityFootwear.description = highestPriorityFootwear.description?.replace(/optional|suggested/i, 'required');
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