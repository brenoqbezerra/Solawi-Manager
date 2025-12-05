export enum CropStatus {
  PLANNED = 'PLANNED',
  ACTIVE = 'ACTIVE',
  HARVESTED = 'HARVESTED',
  ARCHIVED = 'ARCHIVED'
}

export interface Crop {
  id: string;
  name: string; // Kultur (e.g., Karotten)
  variety: string; // Sorte (e.g., Nantaise)
  plantWeek: number; // KW
  plantYear: number;
  harvestWeek: number; // KW
  harvestYear: number;
  location: string; // Standort
  expectedYield: number; // Menge in kg/units
  unit: string; // kg, bund, stück
  status: CropStatus;
  notes?: string;
  imageUrl?: string;
  harvestedAt?: string; // ISO date
  actualYield?: number;
}

export interface WeatherData {
  city?: string; // Added city
  temperature: number;
  weatherCode: number;
  windSpeed: number;
  isDay: number;
  dailyForecast: {
    time: string[];
    temperatureMax: number[];
    temperatureMin: number[];
    weatherCode: number[];
  };
}

export interface GeoLocation {
  lat: number;
  lon: number;
  city?: string;
}

export type Language = 'de' | 'en' | 'es' | 'fr' | 'pt';