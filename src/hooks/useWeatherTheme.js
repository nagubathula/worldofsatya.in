"use client";

import { useState, useEffect } from "react";

export const THEMES = {
  DAY_CLEAR: "DAY_CLEAR",
  DAY_CLOUDY: "DAY_CLOUDY",
  SUNSET: "SUNSET",
  NIGHT_CLEAR: "NIGHT_CLEAR",
  NIGHT_CLOUDY: "NIGHT_CLOUDY",
  RAIN: "RAIN",
};

// Human-readable label for an Open-Meteo WMO weather code
function describeWeather(code) {
  if (code >= 95) return "Stormy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 51) return "Rainy";
  if (code >= 45) return "Foggy";
  if (code === 3) return "Overcast";
  if (code === 2) return "Cloudy";
  if (code === 1) return "Mostly clear";
  return "Clear skies";
}

const THEME_CACHE_KEY = "weather-theme";

export default function useWeatherTheme() {
  const [theme, setTheme] = useState(THEMES.DAY_CLOUDY); // Default fallback
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(null);
  const [condition, setCondition] = useState(null);

  useEffect(() => {
    // Restore the last known theme immediately to avoid a flash of the
    // wrong sky while the weather API responds
    try {
      const cached = localStorage.getItem(THEME_CACHE_KEY);
      if (cached && THEMES[cached]) setTheme(cached);
    } catch (e) {}

    const fetchWeather = async () => {
      try {
        // 1. Get location silently with fallback to San Francisco
        let latitude = 37.7749;
        let longitude = -122.4194;

        try {
          const locationRes = await fetch("https://ipapi.co/json/");
          if (locationRes.ok) {
            const locationData = await locationRes.json();
            if (locationData.latitude && locationData.longitude) {
              latitude = locationData.latitude;
              longitude = locationData.longitude;
              if (locationData.city) setCity(locationData.city);
            }
          }
        } catch (locationError) {
          // Silently fallback if adblockers block the request or API rate limits
        }

        // 2. Get weather
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=is_day,weather_code&daily=sunrise,sunset&timezone=auto`
        );
        if (!weatherRes.ok) throw new Error("Weather fetch failed");
        const weatherData = await weatherRes.json();

        const isDay = weatherData.current.is_day === 1;
        const code = weatherData.current.weather_code;
        
        // Parse sunset/sunrise to see if we are in golden hour
        const now = new Date();
        const sunset = new Date(weatherData.daily.sunset[0]);
        const sunrise = new Date(weatherData.daily.sunrise[0]);
        
        // Within 1 hour before/after sunset or sunrise
        const isSunset = Math.abs(now - sunset) < 60 * 60 * 1000 || Math.abs(now - sunrise) < 60 * 60 * 1000;

        let selectedTheme = THEMES.DAY_CLEAR;

        if (code >= 50) {
          // Rain / Snow / Drizzle / Thunderstorm
          selectedTheme = THEMES.RAIN;
        } else if (isSunset) {
          selectedTheme = THEMES.SUNSET;
        } else if (isDay) {
          if (code >= 2 && code <= 48) {
            selectedTheme = THEMES.DAY_CLOUDY;
          } else {
            selectedTheme = THEMES.DAY_CLEAR;
          }
        } else {
          // Night
          if (code >= 2 && code <= 48) {
            selectedTheme = THEMES.NIGHT_CLOUDY;
          } else {
            selectedTheme = THEMES.NIGHT_CLEAR;
          }
        }

        setTheme(selectedTheme);
        setCondition(describeWeather(code));
        try {
          localStorage.setItem(THEME_CACHE_KEY, selectedTheme);
        } catch (e) {}
      } catch (error) {
        // console.error("Error fetching weather/theme:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
    
    // Refresh every 30 mins
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { theme, loading, city, condition };
}
