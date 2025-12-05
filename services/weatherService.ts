import { WeatherData } from '../types';

const CACHE_KEY = 'solawi_weather_cache';
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  const cached = localStorage.getItem(CACHE_KEY);
  if (cached) {
    const { timestamp, data, coords } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION && 
        Math.abs(coords.lat - lat) < 0.1 && 
        Math.abs(coords.lon - lon) < 0.1) {
      return data;
    }
  }

  try {
    // 1. Get Forecast
    const forecastResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto&forecast_days=8`
    );
    const forecastJson = await forecastResponse.json();

    // 2. Get City Name (Reverse Geocoding)
    let city = "Unknown Location";
    try {
        const geoResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=de`);
        const geoJson = await geoResponse.json();
        city = geoJson.city || geoJson.locality || "Feld";
    } catch(e) {
        console.warn("Could not fetch city name");
    }
    
    const weatherData: WeatherData = {
      city: city,
      temperature: forecastJson.current_weather.temperature,
      weatherCode: forecastJson.current_weather.weathercode,
      windSpeed: forecastJson.current_weather.windspeed,
      isDay: forecastJson.current_weather.is_day,
      dailyForecast: {
        time: forecastJson.daily.time,
        temperatureMax: forecastJson.daily.temperature_2m_max,
        temperatureMin: forecastJson.daily.temperature_2m_min,
        weatherCode: forecastJson.daily.weathercode
      }
    };

    localStorage.setItem(CACHE_KEY, JSON.stringify({
      timestamp: Date.now(),
      data: weatherData,
      coords: { lat, lon }
    }));

    return weatherData;
  } catch (error) {
    console.error("Weather fetch failed", error);
    return null;
  }
};