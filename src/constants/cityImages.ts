interface CityImage {
  url: string;
  credit: {
    name: string;
    url: string;
  };
}

export const DEFAULT_IMAGE: CityImage = {
  url: "https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg",
  credit: {
    name: "Pixabay",
    url: "https://www.pexels.com/fr-fr/@pixabay/",
  },
};

export const CITY_IMAGES: Record<string, CityImage> = {
  paris: {
    url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop",
    credit: {
      name: "Chris Karidis",
      url: "https://unsplash.com/@chriskaridis",
    },
  },
  marseille: {
    url: "https://images.unsplash.com/photo-1600699267693-d6eef29ed1c0?q=80&w=2071&auto=format&fit=crop",
    credit: {
      name: "Jonathan Borba",
      url: "https://unsplash.com/@jonathanborba",
    },
  },
  lyon: {
    url: "https://images.unsplash.com/photo-1524484881053-0710d1995e70?q=80&w=2069&auto=format&fit=crop",
    credit: {
      name: "Rémi Müller",
      url: "https://unsplash.com/@remimuller",
    },
  },
  toulouse: {
    url: "https://images.pexels.com/photos/6194135/pexels-photo-6194135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    credit: {
      name: "Malik Skydsgaard",
      url: "https://www.pexels.com/@malikskydsgaard",
    },
  },
  nice: {
    url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop",
    credit: {
      name: "Anthony Delanoix",
      url: "https://unsplash.com/@anthonydelanoix",
    },
  },
  nantes: {
    url: "https://images.unsplash.com/photo-1589475654556-28c1d8c38096?q=80&w=2074&auto=format&fit=crop",
    credit: {
      name: "Thomas Millot",
      url: "https://unsplash.com/@tomlaudiophile",
    },
  },
  strasbourg: {
    url: "https://images.unsplash.com/photo-1577701122197-c9607038bd90?q=80&w=2072&auto=format&fit=crop",
    credit: {
      name: "Marcel Strauß",
      url: "https://unsplash.com/@martzzl",
    },
  },
  montpellier: {
    url: "https://images.unsplash.com/photo-1564505513631-5f1a0f92a025?q=80&w=2071&auto=format&fit=crop",
    credit: {
      name: "Henrique Ferreira",
      url: "https://unsplash.com/@rickpsd",
    },
  },
  bordeaux: {
    url: "https://images.unsplash.com/photo-1589923188900-85e36be4f125?q=80&w=2070&auto=format&fit=crop",
    credit: {
      name: "Yoann Boyer",
      url: "https://unsplash.com/@yoannboyer",
    },
  },
  lille: {
    url: "https://images.unsplash.com/photo-1617089398523-f12c6f3a2d4f?q=80&w=2069&auto=format&fit=crop",
    credit: {
      name: "CHUTTERSNAP",
      url: "https://unsplash.com/@chuttersnap",
    },
  },
} as const;
