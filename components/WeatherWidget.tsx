import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService';
import { WeatherData, GeoLocation } from '../types';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, MapPin, ArrowDown, ArrowUp } from 'lucide-react';
import { useTranslation } from '../i18n';

interface Props {
  geo: GeoLocation;
}

const getWeatherIcon = (code: number, className: string = "w-8 h-8") => {
  if (code <= 1) return <Sun className={`${className} text-yellow-400`} />;
  if (code <= 3) return <Cloud className={`${className} text-blue-100`} />;
  if (code <= 67) return <CloudRain className={`${className} text-blue-300`} />;
  if (code <= 77) return <CloudSnow className={`${className} text-cyan-200`} />;
  if (code > 90) return <CloudLightning className={`${className} text-purple-400`} />;
  return <Cloud className={`${className} text-slate-300`} />;
};

const WeatherWidget: React.FC<Props> = ({ geo }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const { t, lang } = useTranslation();

  useEffect(() => {
    fetchWeather(geo.lat, geo.lon).then(setWeather);
  }, [geo]);

  if (!weather) return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 h-52 animate-pulse flex items-center justify-center">
      <span className="text-slate-400">{t('loading')}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white shadow-lg overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10 relative">
        
        {/* Current Weather */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-2 mb-2 opacity-90">
             <MapPin className="w-4 h-4" />
             <h3 className="font-medium text-sm md:text-base">{weather.city || t('field')}</h3>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl md:text-6xl font-bold tracking-tighter">{Math.round(weather.temperature)}°</span>
            <div className="bg-white/10 p-3 rounded-xl backdrop-blur-md border border-white/10">
              {getWeatherIcon(weather.weatherCode, "w-10 h-10")}
            </div>
          </div>
          <div className="flex items-center gap-3 mt-3 text-sm text-blue-100">
            <div className="flex items-center gap-1">
                <Wind className="w-4 h-4" />
                <span>{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>
        
        {/* 7 Day Forecast - Horizontal Scroll on Mobile, Grid on Desktop */}
        <div className="w-full overflow-x-auto pb-2 scrollbar-hide">
            <div className="flex md:justify-end gap-2 min-w-max">
            {weather.dailyForecast.time.slice(0, 7).map((dateStr, i) => {
                const date = new Date(dateStr);
                const dayName = date.toLocaleDateString(lang === 'de' ? 'de-DE' : lang, { weekday: 'short' });
                const isToday = i === 0;
                
                return (
                <div key={i} className={`flex flex-col items-center justify-between bg-white/10 border ${isToday ? 'border-yellow-400/50 bg-white/20' : 'border-white/5'} rounded-lg p-2 backdrop-blur-sm w-[4.5rem] h-32`}>
                    <span className="text-xs font-semibold uppercase opacity-90">{isToday ? t('today') : dayName}</span>
                    <div className="my-1 scale-90">
                        {getWeatherIcon(weather.dailyForecast.weatherCode[i], "w-8 h-8")}
                    </div>
                    <div className="flex flex-col items-center w-full gap-0.5">
                        <span className="text-sm font-bold">{Math.round(weather.dailyForecast.temperatureMax[i])}°</span>
                        <div className="w-full h-[1px] bg-white/20 my-0.5"></div>
                        <span className="text-xs opacity-75">{Math.round(weather.dailyForecast.temperatureMin[i])}°</span>
                    </div>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;