interface SearchTermMapping {
  [key: string]: {
    en: string[];
    fr: string[];
    es: string[];
    de: string[];
    it: string[];
    ar: string[];
    ru: string[];

  };
}

export const clothingSearchTerms: SearchTermMapping = {
  // Base layers
  thermalUnderwear: {
    en: ["thermal base layer fashion", "thermal wear winter", "thermal clothing"],
    fr: ["sous-vêtement thermique", "couche de base thermique", "vêtement thermique"],
    es: ["ropa interior térmica", "capa base térmica", "ropa térmica"],
    de: ["thermounterwäsche", "thermische basisschicht", "thermobekleidung"],
    it: ["intimo termico", "strato base termico", "abbigliamento termico"],
    ar: ["ملابس داخلية حرارية", "طبقة أساسية حرارية", "ملابس حرارية"],
    ru: ["модное термобельё", "термобельё для зимы", "термобельё"
]

  },
  longSleeveUndershirt: {
    en: ["base layer fashion", "undershirt style", "long sleeve undershirt"],
    fr: ["sous-vêtement manches longues", "t-shirt base", "sous-pull"],
    es: ["camiseta interior manga larga", "camiseta base", "ropa interior manga larga"],
    de: ["langarm unterhemd", "unterziehshirt", "langarm unterziehshirt"],
    it: ["maglia intima maniche lunghe", "sottomaglia", "maglia base manica lunga"],
    ar: ["قميص داخلي كم طويل", "طبقة أساسية", "قميص داخلي"],
    ru: ["модное базовое бельё", "стильная нательная футболка", "нательная футболка с длинным рукавом"]
  },

  // Upper body - Shirts
  thermalShirt: {
    en: ["thermal shirt fashion", "thermal top winter", "thermal long sleeve shirt"],
    fr: ["t-shirt thermique", "haut thermique hiver", "maillot thermique"],
    es: ["camiseta térmica", "top térmico invierno", "camisa térmica"],
    de: ["thermoshirt", "thermisches oberteil winter", "thermisches langarmshirt"],
    it: ["maglia termica", "top termico inverno", "camicia termica"],
    ar: ["قميص حراري", "ملابس شتوية حرارية", "قميص شتوي حراري"],
    ru: ["модная термофутболка", "термофутболка для зимы", "термофутболка с длинным рукавом"]

  },
  longSleeveShirt: {
    en: ["long sleeve shirt fashion", "button up shirt", "dress shirt"],
    fr: ["chemise manches longues", "chemise habillée", "chemise boutonnée"],
    es: ["camisa manga larga", "camisa vestir", "camisa formal"],
    de: ["langarmhemd", "businesshemd", "hemd"],
    it: ["camicia maniche lunghe", "camicia elegante", "camicia bottoni"],
    ar: ["قميص كم طويل", "قميص رسمي", "قميص بأزرار"],
    ru: ["модная рубашка с длинным рукавом", "рубашка на пуговицах", "классическая рубашка"]
  },
  regularShirt: {
    en: ["shirt fashion", "casual shirt", "button shirt"],
    fr: ["chemise décontractée", "chemise casual", "chemise"],
    es: ["camisa casual", "camisa", "camisa informal"],
    de: ["hemd casual", "freizeithemd", "hemd"],
    it: ["camicia casual", "camicia", "camicia bottoni"],
    ar: ["قميص عادي", "قميص كاجوال", "قميص"],
    ru: ["модная рубашка", "повседневная рубашка", "рубашка на пуговицах"]
  },
  tshirt: {
    en: ["t-shirt fashion", "casual tshirt", "basic tee"],
    fr: ["t-shirt", "tee-shirt", "maillot"],
    es: ["camiseta", "playera", "remera"],
    de: ["t-shirt", "shirt", "kurzarmshirt"],
    it: ["maglietta", "t-shirt", "maglia"],
    ar: ["تي شيرت", "قميص قصير", "قميص قطني"],
    ru: ["модная футболка", "повседневная футболка", "базовая футболка"]
  },

  // Upper body - Sweaters
  heavySweater: {
    en: ["winter sweater fashion", "knit sweater", "wool sweater"],
    fr: ["pull d'hiver", "pull en laine", "gros pull"],
    es: ["suéter invierno", "jersey lana", "suéter grueso"],
    de: ["winterpullover", "wollpullover", "strickpullover"],
    it: ["maglione invernale", "maglione lana", "pullover pesante"],
    ar: ["سترة شتوية", "سترة صوف", "كنزة شتوية"],
    ru: ["зимний свитер", "вязаный свитер", "шерстяной свитер"]
  },
  lightSweater: {
    en: ["cardigan fashion", "light sweater", "spring cardigan"],
    fr: ["cardigan léger", "pull léger", "gilet"],
    es: ["cárdigan ligero", "suéter ligero", "jersey primavera"],
    de: ["leichter cardigan", "leichter pullover", "frühlingspullover"],
    it: ["cardigan leggero", "maglione leggero", "pullover primavera"],
    ar: ["سترة خفيفة", "كارديجان", "سترة ربيعية"],
    ru: ["модный кардиган", "лёгкий свитер", "весенний кардиган"]
  },
  optionalSweater: {
    en: ["cardigan style", "casual sweater", "light knit"],
    fr: ["cardigan", "pull casual", "tricot léger"],
    es: ["cárdigan casual", "suéter casual", "jersey ligero"],
    de: ["cardigan", "freizeitpullover", "leichter strick"],
    it: ["cardigan casual", "maglione casual", "maglia leggera"],
    ar: ["كارديجان عادي", "سترة عادية", "سترة خفيفة"],
    ru: ["стильный кардиган", "повседневный свитер", "лёгкая вязаная кофта"]
  },

  // Upper body - Jackets
  heavyCoat: {
    en: ["winter coat fashion", "heavy coat", "wool coat"],
    fr: ["manteau d'hiver", "manteau lourd", "manteau laine"],
    es: ["abrigo invierno", "abrigo pesado", "abrigo lana"],
    de: ["wintermantel", "schwerer mantel", "wollmantel"],
    it: ["cappotto invernale", "cappotto pesante", "cappotto lana"],
    ar: ["معطف شتوي", "معطف ثقيل", "معطف صوف"],
    ru: ["модное зимнее пальто", "тёплое пальто", "шерстяное пальто"]
  },
  warmJacket: {
    en: ["winter jacket fashion", "warm jacket", "winter coat"],
    fr: ["veste d'hiver", "veste chaude", "manteau hiver"],
    es: ["chaqueta invierno", "chaqueta caliente", "abrigo invierno"],
    de: ["winterjacke", "warme jacke", "wintermantel"],
    it: ["giacca invernale", "giacca calda", "cappotto inverno"],
    ar: ["جاكيت شتوي", "جاكيت دافئ", "معطف شتوي"],
    ru: ["модная зимняя куртка", "тёплая куртка", "зимнее пальто"]
  },
  lightJacket: {
    en: ["spring jacket fashion", "light coat", "casual jacket"],
    fr: ["veste printemps", "manteau léger", "veste décontractée"],
    es: ["chaqueta primavera", "abrigo ligero", "chaqueta casual"],
    de: ["frühlingsjacke", "leichte jacke", "freizeitjacke"],
    it: ["giacca primavera", "cappotto leggero", "giacca casual"],
    ar: ["جاكيت ربيعي", "معطف خفيف", "جاكيت كاجوال"],
    ru: ["модная весенняя куртка", "лёгкое пальто", "повседневная куртка"]
  },
  rainJacket: {
    en: ["rain jacket fashion", "raincoat", "waterproof jacket"],
    fr: ["imperméable", "veste de pluie", "coupe-pluie"],
    es: ["impermeable", "chaqueta lluvia", "chubasquero"],
    de: ["regenjacke", "regenmantel", "wasserdichte jacke"],
    it: ["giacca pioggia", "impermeabile", "giacca impermeabile"],
    ar: ["جاكيت مطر", "معطف مطر", "جاكيت مضاد للماء"],
    ru: ["модная дождевик", "плащ", "водонепроницаемая куртка"]
  },
  lightRainJacket: {
    en: ["light rain jacket fashion", "packable rain jacket", "lightweight waterproof jacket"],
    fr: ["imperméable léger", "coupe-pluie léger", "k-way"],
    es: ["impermeable ligero", "chubasquero ligero", "chaqueta lluvia ligera"],
    de: ["leichte regenjacke", "packbare regenjacke", "leichter regenmantel"],
    it: ["giacca pioggia leggera", "k-way", "impermeabile leggero"],
    ar: ["جاكيت مطر خفيف", "معطف مطر خفيف", "واقي مطر خفيف"],
    ru: ["лёгкая дождевик", "компактная дождевик", "лёгкая водонепроницаемая куртка"]
  },
  windbreaker: {
    en: ["windbreaker fashion", "light jacket", "sport jacket"],
    fr: ["coupe-vent", "veste légère", "veste sport"],
    es: ["cortavientos", "chaqueta ligera", "chaqueta deporte"],
    de: ["windbreaker", "windjacke", "sportjacke"],
    it: ["giacca vento", "giacca leggera", "giacca sport"],
    ar: ["جاكيت رياح", "سترة خفيفة", "جاكيت رياضي"],
    ru: ["модная ветровка", "лёгкая куртка", "спортивная куртка"]
  },
  optionalJacket: {
    en: ["light jacket fashion", "casual coat", "spring jacket"],
    fr: ["veste légère", "manteau casual", "veste printemps"],
    es: ["chaqueta ligera", "abrigo casual", "chaqueta primavera"],
    de: ["leichte jacke", "freizeitmantel", "frühlingsjacke"],
    it: ["giacca leggera", "cappotto casual", "giacca primavera"],
    ar: ["جاكيت خفيف", "معطف كاجوال", "جاكيت ربيعي"],
    ru: ["модная лёгкая куртка", "повседневное пальто", "весенняя куртка"]
  },

  // Accessories
  winterHat: {
    en: ["winter hat fashion", "beanie", "warm hat"],
    fr: ["bonnet hiver", "bonnet chaud", "chapeau hiver"],
    es: ["gorro invierno", "gorro", "gorro caliente"],
    de: ["wintermütze", "beanie", "warme mütze"],
    it: ["cappello invernale", "berretto", "cappello caldo"],
    ar: ["قبعة شتوية", "قبعة دافئة", "طاقية"],
    ru: ["модная зимняя шапка", "шапка-бини", "тёплая шапка"]
  },
  sunHat: {
    en: ["sun hat fashion", "cap", "summer hat"],
    fr: ["chapeau soleil", "casquette", "bob"],
    es: ["sombrero sol", "gorra", "sombrero verano"],
    de: ["sonnenhut", "kappe", "sommerhut"],
    it: ["cappello sole", "cappellino", "cappello estate"],
    ar: ["قبعة شمس", "كاب", "قبعة صيفية"],
    ru: ["модная панама", "кепка", "летняя шляпа"]
  },
  gloves: {
    en: ["winter gloves fashion", "warm gloves", "thermal gloves"],
    fr: ["gants hiver", "gants chauds", "moufles"],
    es: ["guantes invierno", "guantes calientes", "guantes térmicos"],
    de: ["winterhandschuhe", "warme handschuhe", "thermohandschuhe"],
    it: ["guanti inverno", "guanti caldi", "guanti termici"],
    ar: ["قفازات شتوية", "قفازات دافئة", "قفازات حرارية"],
    ru: ["модные зимние перчатки", "тёплые перчатки", "термоперчатки"]
  },
  scarf: {
    en: ["winter scarf fashion", "warm scarf", "neck warmer"],
    fr: ["écharpe hiver", "écharpe chaude", "cache-cou"],
    es: ["bufanda invierno", "bufanda caliente", "cuello"],
    de: ["winterschal", "warmer schal", "halswärmer"],
    it: ["sciarpa inverno", "sciarpa calda", "scaldacollo"],
    ar: ["وشاح شتوي", "وشاح دافئ", "لفحة"],
    ru: ["модный зимний шарф", "тёплый шарф", "шейный утеплитель"]
  },
  sunglasses: {
    en: ["sunglasses fashion", "shades", "sun protection"],
    fr: ["lunettes soleil", "lunettes solaires", "protection solaire"],
    es: ["gafas sol", "lentes sol", "protección solar"],
    de: ["sonnenbrille", "sonnenschutz", "uv-schutz"],
    it: ["occhiali sole", "occhiali solari", "protezione solare"],
    ar: ["نظارات شمسية", "نظارات شمس", "حماية شمس"],
    ru: ["модные солнцезащитные очки", "очки от солнца", "защита от солнца"]
  },
  umbrella: {
    en: ["umbrella fashion", "rain protection", "parasol"],
    fr: ["parapluie", "protection pluie", "ombrelle"],
    es: ["paraguas", "protección lluvia", "sombrilla"],
    de: ["regenschirm", "regenschutz", "schirm"],
    it: ["ombrello", "protezione pioggia", "parasole"],
    ar: ["مظلة", "واقي مطر", "شمسية"],
    ru: ["модный зонт", "защита от дождя", "зонт от солнца"]
  },

  // Lower body
  insulatedPants: {
    en: ["insulated pants fashion", "thermal pants", "warm trousers"],
    fr: ["pantalon isolé", "pantalon thermique", "pantalon chaud"],
    es: ["pantalón aislante", "pantalón térmico", "pantalón caliente"],
    de: ["isolierte hose", "thermohose", "warme hose"],
    it: ["pantaloni isolati", "pantaloni termici", "pantaloni caldi"],
    ar: ["بنطلون معزول", "بنطلون حراري", "بنطلون دافئ"],
    ru: ["модные утеплённые штаны", "термоштаны", "тёплые брюки"]
  },
  warmPants: {
    en: ["warm pants fashion", "winter trousers", "cold weather pants"],
    fr: ["pantalon chaud", "pantalon hiver", "pantalon froid"],
    es: ["pantalón caliente", "pantalón invierno", "pantalón frío"],
    de: ["warme hose", "winterhose", "kaltwetterhose"],
    it: ["pantaloni caldi", "pantaloni inverno", "pantaloni freddo"],
    ar: ["بنطلون دافئ", "بنطلون شتوي", "بنطلون للبرد"],
    ru: ["модные тёплые штаны", "зимние брюки", "штаны для холода"]
  },
  lightPants: {
    en: ["light pants fashion", "summer trousers", "breathable pants"],
    fr: ["pantalon léger", "pantalon été", "pantalon respirant"],
    es: ["pantalón ligero", "pantalón verano", "pantalón transpirable"],
    de: ["leichte hose", "sommerhose", "atmungsaktive hose"],
    it: ["pantaloni leggeri", "pantaloni estate", "pantaloni traspiranti"],
    ar: ["بنطلون خفيف", "بنطلون صيفي", "بنطلون مريح"],
    ru: ["модные лёгкие штаны", "летние брюки", "дышащие штаны"]
  },
  regularPants: {
    en: ["regular pants fashion", "casual trousers", "everyday pants"],
    fr: ["pantalon régulier", "pantalon casual", "pantalon quotidien"],
    es: ["pantalón regular", "pantalón casual", "pantalón diario"],
    de: ["normale hose", "freizeithose", "alltagshose"],
    it: ["pantaloni regolari", "pantaloni casual", "pantaloni quotidiani"],
    ar: ["بنطلون عادي", "بنطلون كاجوال", "بنطلون يومي"],
    ru: ["модные обычные штаны", "повседневные брюки", "штаны на каждый день"]
  },
  shorts: {
    en: ["shorts fashion", "summer shorts", "casual shorts"],
    fr: ["short", "bermuda", "short été"],
    es: ["pantalón corto", "bermudas", "shorts verano"],
    de: ["shorts", "kurze hose", "sommershorts"],
    it: ["pantaloncini", "bermuda", "shorts estate"],
    ar: ["شورت", "برمودا", "شورت صيفي"],
    ru: ["модные шорты", "летние шорты", "повседневные шорты"]
  }
};

// Update the getSearchTerms function to handle multilingual search
export function getSearchTerms(descriptionKey: string, language: string = 'en'): string[] {
  const terms = clothingSearchTerms[descriptionKey];
  if (!terms) {
    return [];
  }
  return terms[language as keyof typeof terms] || terms.en; // Fallback to English if language not found
}
