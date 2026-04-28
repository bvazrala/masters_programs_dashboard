// Open-Meteo historical archive API — no key required
// Fetches 2024 daily sunshine duration + mean temperature for a lat/lon point

export async function fetchClimateData(lat, lon) {
  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.set('latitude', lat.toFixed(4));
  url.searchParams.set('longitude', lon.toFixed(4));
  url.searchParams.set('start_date', '2024-01-01');
  url.searchParams.set('end_date', '2024-12-31');
  url.searchParams.set('daily', 'sunshine_duration,temperature_2m_mean');
  url.searchParams.set('timezone', 'UTC');

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
  const data = await res.json();

  const sunDurations = data.daily?.sunshine_duration ?? [];
  const temps = data.daily?.temperature_2m_mean ?? [];

  const annualSunHrs = Math.round(sunDurations.reduce((s, v) => s + (v ?? 0), 0) / 3600);
  const validTemps = temps.filter(t => t != null);
  const avgTempC = validTemps.length
    ? +(validTemps.reduce((s, t) => s + t, 0) / validTemps.length).toFixed(1)
    : null;

  return { annualSunHrs, avgTempC, weatherFit: computeWeatherFit(annualSunHrs, avgTempC) };
}

// Score 1–10 for preferred climate: overcast midday, visible sun at dawn/dusk, cool temps.
// Ideal is ~1900–2400 hrs/year (marine-layer / temperate maritime pattern).
// Penalises both relentlessly sunny (>2800 hrs) and genuinely bleak (<1400 hrs).
function computeWeatherFit(sunHrs, avgTempC) {
  const idealSun = 2100;
  const spread   = 850; // hrs from ideal before score bottoms out
  const sunScore = Math.max(1, 10 - (Math.abs(sunHrs - idealSun) / spread) * 9);

  // Cool comfort zone 10–16 °C; extra penalty for heat above 22 °C
  const tempScore = avgTempC != null
    ? Math.max(1, 10 - Math.abs(avgTempC - 13) * 0.6 - Math.max(0, avgTempC - 22) * 0.5)
    : 5;

  return Math.min(10, Math.max(1, Math.round(sunScore * 0.6 + tempScore * 0.4)));
}
