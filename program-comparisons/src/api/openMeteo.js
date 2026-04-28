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

// Score 1–10 calibrated to user's warm/sunny SoCal preference.
// Sunshine is the primary driver; temperature adds a mild modifier.
function computeWeatherFit(sunHrs, avgTempC) {
  // 1500 hrs → ~1, 3300 hrs → ~10 (linear)
  const sunScore = Math.min(10, Math.max(1, (sunHrs - 1500) / 200 + 1));
  // Ideal ~18 °C; cold hurts more than mild warmth
  const tempScore = avgTempC != null
    ? Math.min(10, Math.max(1, 10 - Math.abs(avgTempC - 18) * 0.55))
    : 5;
  return Math.min(10, Math.max(1, Math.round(sunScore * 0.7 + tempScore * 0.3)));
}
