import React, { useEffect, useState } from 'react';
import { fetchWeather } from '../services/weatherService';
import { WeatherData, GeoLocation } from '../types';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, CloudLightning, MapPin } from 'lucide-react';
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
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 h-40 animate-pulse flex items-center justify-center">
      <span className="text-slate-400 text-sm">{t('loading')}</span>
    </div>
  );

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl shadow-lg overflow-hidden relative text-white">
      {/* Container - Compact on mobile (p-4), normal on desktop */}
      <div className="p-4 md:p-6 flex flex-col md:flex-row justify-between md:items-end gap-4 md:gap-6 z-10 relative">
        
        {/* Current Weather - Left Side */}
        <div className="flex flex-row md:flex-col justify-between items-center md:items-start w-full md:w-auto">
          <div>
            <div className="flex items-center gap-1.5 mb-1 opacity-90">
               <MapPin className="w-3.5 h-3.5" />
               <h3 className="font-medium text-sm truncate max-w-[150px]">{weather.city || t('field')}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl md:text-6xl font-bold tracking-tighter">{Math.round(weather.temperature)}°</span>
              <div className="hidden md:block bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                {getWeatherIcon(weather.weatherCode, "w-10 h-10")}
              </div>
              {/* Mobile Icon */}
              <div className="md:hidden block">
                 {getWeatherIcon(weather.weatherCode, "w-8 h-8")}
              </div>
            </div>
          </div>
          
          {/* Wind Info - Compact */}
          <div className="flex items-center gap-1 text-xs md:text-sm text-blue-100 bg-white/10 px-2 py-1 rounded-lg mt-0 md:mt-2">
              <Wind className="w-3.5 h-3.5" />
              <span>{weather.windSpeed} km/h</span>
          </div>
        </div>
        
        {/* Forecast - Scroll Horizontal for Mobile, Grid for Desktop */}
        <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex md:grid md:grid-cols-7 gap-2 min-w-max md:min-w-0">
            {weather.dailyForecast.time.slice(0, 7).map((dateStr, i) => {
                const date = new Date(dateStr);
                const dayName = date.toLocaleDateString(lang === 'de' ? 'de-DE' : lang, { weekday: 'short' });
                const isToday = i === 0;
                
                return (
                <div key={i} className={`flex flex-col items-center justify-between bg-white/10 border ${isToday ? 'border-yellow-400/50 bg-white/20' : 'border-white/5'} rounded-lg p-1.5 backdrop-blur-sm h-20 w-[4.5rem] md:h-32 flex-shrink-0 transition-all`}>
                    <span className="text-[10px] md:text-xs font-semibold uppercase opacity-90">{isToday ? t('today') : dayName}</span>
                    <div className="my-0.5 md:my-1 transform scale-75 md:scale-90">
                        {getWeatherIcon(weather.dailyForecast.weatherCode[i], "w-8 h-8")}
                    </div>
                    <div className="flex flex-col items-center w-full gap-0 md:gap-0.5">
                        <span className="text-xs md:text-sm font-bold">{Math.round(weather.dailyForecast.temperatureMax[i])}°</span>
                        <div className="w-full h-[1px] bg-white/20 my-0.5 hidden md:block"></div>
                        <span className="text-[10px] md:text-xs opacity-75">{Math.round(weather.dailyForecast.temperatureMin[i])}°</span>
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