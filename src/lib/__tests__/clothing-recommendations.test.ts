import { ClothingRecommender, Weather, WeatherConditions } from '../clothing-recommendations';

describe('ClothingRecommender', () => {
  const createWeather = (conditions: Partial<WeatherConditions>): Weather => ({
    temperature: conditions.temperature || 20,
    feelsLike: conditions.feelsLike || conditions.temperature || 20,
    minTemperature: conditions.minTemperature || conditions.temperature || 20,
    maxTemperature: conditions.maxTemperature || conditions.temperature || 20,
    windSpeed: conditions.windSpeed || 0,
    precipitation: conditions.precipitation || 0,
    humidity: conditions.humidity || 50,
    uvIndex: conditions.uvIndex || 0,
    isDay: conditions.isDay !== undefined ? conditions.isDay : true,
    weatherCode: conditions.weatherCode || 0,
  });

  describe('Temperature preference adjustments', () => {
    it('should adjust recommendations for cold-sensitive people', () => {
      const weather = createWeather({ temperature: 18 });
      const recommender = new ClothingRecommender(weather, 'cold');
      const items = recommender.getRecommendations();
      
      // Une personne frileuse à 18°C devrait avoir des recommandations comme si il faisait 15°C
      expect(items.some(i => i.type === 'lightSweater' || i.type === 'lightJacket')).toBeTruthy();
    });

    it('should adjust recommendations for warm-resistant people', () => {
      const weather = createWeather({ temperature: 15 });
      const recommender = new ClothingRecommender(weather, 'warm');
      const items = recommender.getRecommendations();
      
      // Une personne résistante au froid à 15°C devrait avoir des recommandations comme si il faisait 18°C
      expect(items.every(i => i.type !== 'heavyCoat')).toBeTruthy();
    });
  });

  describe('UV protection', () => {
    it('should recommend sun protection for high UV', () => {
      const weather = createWeather({ temperature: 25, uvIndex: 8 });
      const recommender = new ClothingRecommender(weather, 'normal');
      const items = recommender.getRecommendations();

      const hasUVProtection = items.some(i => 
        i.type === 'sunglasses' && i.priority === 'required' ||
        i.type === 'sunHat' && ['required', 'suggested'].includes(i.priority)
      );
      expect(hasUVProtection).toBeTruthy();
    });
  });

  describe('Wind protection', () => {
    it('should recommend appropriate wind protection based on temperature', () => {
      // Test pour temps doux et venteux
      const mildWindyWeather = createWeather({ 
        temperature: 18, 
        windSpeed: 29 
      });
      const mildRecommender = new ClothingRecommender(mildWindyWeather, 'normal');
      const mildItems = mildRecommender.getRecommendations();

      // Vérifier qu'on ne recommande pas à la fois un coupe-vent et une veste
      const outerLayers = mildItems.filter(i => 
        ['windbreaker', 'lightJacket', 'warmJacket', 'heavyCoat'].includes(i.type)
      );
      expect(outerLayers.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Layer consistency', () => {
    it('should not recommend conflicting layers', () => {
      const weather = createWeather({ 
        temperature: 18, 
        uvIndex: 6,
        windSpeed: 29 
      });
      const recommender = new ClothingRecommender(weather, 'normal');
      const items = recommender.getRecommendations();

      // Si t-shirt est nécessaire, manches longues ne devrait pas être nécessaire
      const tshirt = items.find(i => i.type === 'tshirt');
      const longSleeve = items.find(i => i.type === 'longSleeveShirt');
      
      if (tshirt?.priority === 'required') {
        expect(longSleeve?.priority).not.toBe('required');
      }

      // Ne pas avoir plusieurs couches externes avec priorité required
      const requiredOuterLayers = items.filter(i => 
        ['windbreaker', 'lightJacket', 'warmJacket', 'heavyCoat'].includes(i.type) &&
        i.priority === 'required'
      );
      expect(requiredOuterLayers.length).toBeLessThanOrEqual(1);
    });
  });

  describe('Extreme weather cases', () => {
    it('should handle very cold weather', () => {
      const weather = createWeather({ 
        temperature: -5,
        windSpeed: 20
      });
      const recommender = new ClothingRecommender(weather, 'normal');
      const items = recommender.getRecommendations();

      expect(items.some(i => i.type === 'heavyCoat' && i.priority === 'required')).toBeTruthy();
      expect(items.some(i => i.type === 'thermalUnderwear')).toBeTruthy();
    });

    it('should handle very hot weather', () => {
      const weather = createWeather({ 
        temperature: 35,
        uvIndex: 9
      });
      const recommender = new ClothingRecommender(weather, 'normal');
      const items = recommender.getRecommendations();

      expect(items.some(i => i.type === 'sunHat' && i.priority === 'required')).toBeTruthy();
      expect(items.some(i => i.type === 'sunglasses' && i.priority === 'required')).toBeTruthy();
      expect(items.every(i => i.type !== 'heavyCoat')).toBeTruthy();
    });
  });
});
