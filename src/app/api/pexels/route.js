export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city');

  if (!city) {
    return new Response(JSON.stringify({ error: 'City parameter is required' }), { status: 400 });
  }

  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(city)}&per_page=1`, {
      headers: {
        Authorization: process.env.PEXELS_API_KEY,
      },
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Failed to fetch from Pexels' }), { status: response.status });
    }

    const data = await response.json();
    const photoUrl = data.photos?.[0]?.src?.original || null;

    return new Response(JSON.stringify({ photoUrl }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
