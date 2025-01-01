interface SearchTermMapping {
  [key: string]: string[];
}

export const clothingSearchTerms: SearchTermMapping = {
  // Base layers
  thermalUnderwear: [
    "thermal base layer fashion",
    "thermal wear winter",
    "thermal clothing",
  ],
  longSleeveUndershirt: [
    "base layer fashion",
    "undershirt style",
    "long sleeve undershirt",
  ],

  // Upper body - Shirts
  thermalShirt: ["thermal shirt fashion", "thermal top winter", "thermal wear"],
  longSleeveShirt: [
    "long sleeve shirt fashion",
    "button up shirt",
    "dress shirt",
  ],
  regularShirt: ["shirt fashion", "casual shirt", "button shirt"],
  tshirt: ["t-shirt fashion", "casual tshirt", "basic tee"],

  // Upper body - Sweaters
  heavySweater: ["winter sweater fashion", "knit sweater", "wool sweater"],
  lightSweater: ["cardigan fashion", "light sweater", "spring cardigan"],
  optionalSweater: ["cardigan style", "casual sweater", "light knit"],

  // Upper body - Jackets
  heavyCoat: ["winter coat fashion", "heavy coat", "wool coat"],
  warmJacket: ["winter jacket fashion", "warm jacket", "winter coat"],
  lightJacket: ["spring jacket fashion", "light coat", "casual jacket"],
  rainJacket: ["rain jacket fashion", "raincoat", "waterproof jacket"],
  windbreaker: ["windbreaker fashion", "light jacket", "sport jacket"],
  optionalJacket: ["light jacket fashion", "casual coat", "spring jacket"],

  // Lower body
  insulatedPants: ["winter pants fashion", "warm trousers", "insulated pants"],
  warmPants: ["winter trousers fashion", "warm pants", "winter pants"],
  regularPants: ["trousers fashion", "pants style", "casual pants"],
  lightPants: ["summer pants fashion", "light trousers", "casual pants"],
  shorts: ["shorts fashion", "summer shorts", "casual shorts"],

  // Accessories - Head
  winterHat: ["beanie fashion", "winter hat", "wool beanie"],
  warmHat: ["winter hat fashion", "beanie style", "warm hat"],
  sunHat: ["sun hat fashion", "summer hat", "straw hat"],
  generalHat: ["hat fashion", "casual hat", "cap style"],

  // Accessories - Neck
  warmScarf: ["winter scarf fashion", "wool scarf", "neck scarf"],
  lightScarf: ["spring scarf fashion", "light scarf", "neck accessory"],

  // Accessories - Hands
  gloves: ["winter gloves fashion", "leather gloves", "wool gloves"],

  // Accessories - Rain
  rainUmbrella: ["umbrella fashion", "rain umbrella", "fashion umbrella"],

  // Accessories - Sun
  sunglasses: ["sunglasses fashion", "eyewear style", "summer sunglasses"],

  // Footwear
  winterBoots: ["winter boots fashion", "snow boots", "leather boots"],
  rainBoots: ["rain boots fashion", "waterproof boots", "rubber boots"],
  warmShoes: ["warm shoes fashion", "winter shoes", "thermal footwear"],
  regularShoes: ["shoes fashion", "casual shoes", "sneakers style"],
  lightShoes: ["summer shoes fashion", "light footwear", "casual sneakers"],
};

export function getSearchTerms(descriptionKey: string): string {
  const searchTerms = clothingSearchTerms[descriptionKey];

  if (!searchTerms) {
    const baseQuery = descriptionKey.replace(/([A-Z])/g, " $1").toLowerCase();
    return baseQuery + " fashion";
  }

  // Randomly select one of the variations
  return searchTerms[Math.floor(Math.random() * searchTerms.length)];
}
