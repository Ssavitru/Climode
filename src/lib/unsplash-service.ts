import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '',
});

export async function getUnsplashImage(query: string): Promise<string> {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      perPage: 30,
      orientation: 'portrait',
      orderBy: 'relevant',
      contentFilter: 'high',
      color: 'white',
      collections: ['8362253', '3694365', '1449809'], // Fashion collections
    });

    if (result.errors) {
      console.error('Error fetching Unsplash image:', result.errors);
      return '';
    }

    // Get a random image from the results to add variety
    const photos = result.response?.results || [];
    if (photos.length === 0) return '';
    
    const randomIndex = Math.floor(Math.random() * Math.min(photos.length, 10));
    return photos[randomIndex]?.urls?.regular || '';
  } catch (error) {
    console.error('Error fetching Unsplash image:', error);
    return '';
  }
}
