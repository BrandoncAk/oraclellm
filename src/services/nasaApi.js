const NASA_API_KEY = '3Gctu9DIxNC7PH7Hu1r9XwmKLpZXQtJEshJzK1BU';
const NASA_BASE = 'https://api.nasa.gov';

export async function getAstronomyPictureOfDay(date = null) {
  try {
    const params = new URLSearchParams({ api_key: NASA_API_KEY });
    if (date) params.append('date', date);

    const res = await fetch(`${NASA_BASE}/planetary/apod?${params}`);
    if (!res.ok) throw new Error(`NASA API error: ${res.status}`);
    const data = await res.json();

    return {
      title: data.title,
      explanation: data.explanation,
      url: data.url,
      hdurl: data.hdurl || data.url,
      date: data.date,
      media_type: data.media_type,
      copyright: data.copyright || 'NASA',
    };
  } catch (error) {
    console.error('Error fetching APOD:', error);
    throw error;
  }
}

export async function getNearEarthAsteroids() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const params = new URLSearchParams({
      start_date: today,
      end_date: today,
      api_key: NASA_API_KEY,
    });

    const res = await fetch(`${NASA_BASE}/neo/rest/v1/feed?${params}`);
    if (!res.ok) throw new Error(`NASA NEO API error: ${res.status}`);
    const data = await res.json();

    const asteroids = data.near_earth_objects[today] || [];
    return asteroids.slice(0, 5).map((a) => ({
      name: a.name,
      diameter_meters: Math.round(
        (a.estimated_diameter.meters.estimated_diameter_min +
          a.estimated_diameter.meters.estimated_diameter_max) /
          2
      ),
      velocity_kmh: Math.round(
        parseFloat(a.close_approach_data[0]?.relative_velocity?.kilometers_per_hour || 0)
      ),
      miss_distance_km: Math.round(
        parseFloat(a.close_approach_data[0]?.miss_distance?.kilometers || 0)
      ),
      is_potentially_hazardous: a.is_potentially_hazardous_asteroid,
    }));
  } catch (error) {
    console.error('Error fetching NEO:', error);
    throw error;
  }
}
