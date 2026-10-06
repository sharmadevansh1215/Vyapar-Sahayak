import { WeatherContext } from '../types';
import { districtCoordinates } from '../data/locations';

const weatherCodeDescriptions: Record<number, string> = {
  0: 'Clear sky ☀️',
  1: 'Mainly clear 🌤️',
  2: 'Partly cloudy ⛅',
  3: 'Overcast ☁️',
  45: 'Foggy 🌫️',
  48: 'Depositing rime fog 🌫️',
  51: 'Light drizzle 🌦️',
  53: 'Moderate drizzle 🌧️',
  55: 'Dense drizzle 🌧️',
  61: 'Slight rain 🌧️',
  63: 'Moderate rain 🌧️',
  65: 'Heavy rain ⛈️',
  71: 'Slight snowfall ❄️',
  73: 'Moderate snowfall ❄️',
  75: 'Heavy snowfall ❄️',
  80: 'Slight rain showers 🌦️',
  81: 'Moderate rain showers 🌧️',
  82: 'Violent rain showers ⛈️',
  95: 'Thunderstorm ⚡',
};

export async function fetchDistrictWeather(
  districtName: string,
  stateName?: string
): Promise<WeatherContext | null> {
  const coords = districtCoordinates[districtName] || { lat: 25.3176, lng: 82.9739 }; // Default Varanasi coords
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Weather API error: ${res.status}`);
    }
    const data = await res.json();
    const current = data.current;
    if (!current) return null;

    const weatherCode = current.weather_code ?? 0;
    const temp = Math.round(current.temperature_2m ?? 28);
    const humidity = Math.round(current.relative_humidity_2m ?? 65);
    const windSpeed = Math.round(current.wind_speed_10m ?? 8);
    const condition = weatherCodeDescriptions[weatherCode] || 'Pleasant weather';

    // Formulate agricultural/enterprise seasonal summary
    let seasonalImpact = '';
    if (temp > 35) {
      seasonalImpact = 'High summer temperatures — require adequate ventilation/cooling for livestock & perishables.';
    } else if (temp < 15) {
      seasonalImpact = 'Cooler winter climate — favorable for dairy yield & cold-pressed oil shelf-life.';
    } else if (humidity > 75) {
      seasonalImpact = 'Monsoon/high humidity — ensure moisture-proof raw material storage and fungal protection.';
    } else {
      seasonalImpact = 'Favorable micro-climate — optimum operating conditions for rural production and logistics.';
    }

    return {
      temperature: temp,
      humidity,
      weatherCode,
      condition,
      windSpeed,
      seasonalImpact,
    };
  } catch (err) {
    console.warn('Weather fetch error:', err);
    return {
      temperature: 28,
      humidity: 62,
      weatherCode: 1,
      condition: 'Sunny / Mild 🌤️',
      windSpeed: 10,
      seasonalImpact: 'Normal seasonal climate in this agro-climatic zone.',
    };
  }
}
