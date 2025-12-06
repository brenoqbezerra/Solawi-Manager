import { Crop, CropStatus } from '../types';
import { getWeekNumber, getDateFromWeek } from '../utils';

const KEY = 'solawi_crops_v2';

const MOCK_DATA: Crop[] = [
  // JANEIRO / FEVEREIRO (Inverno/Início)
  {
    id: 'mock-1', name: 'Feldsalat', variety: 'Vit', location: 'Gewächshaus A',
    expectedYield: 50, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 45, plantYear: 2023, harvestWeek: 5, harvestYear: 2024,
    plantDateIso: '2023-11-06', harvestDateIso: '2024-01-29', actualYield: 52, harvestedAt: '2024-01-30'
  },
  {
    id: 'mock-2', name: 'Winterpostelein', variety: 'Glanz', location: 'Tunnel 1',
    expectedYield: 30, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 48, plantYear: 2023, harvestWeek: 8, harvestYear: 2024,
    plantDateIso: '2023-11-27', harvestDateIso: '2024-02-19', actualYield: 28, harvestedAt: '2024-02-20'
  },
  // MARÇO / ABRIL (Primavera)
  {
    id: 'mock-3', name: 'Radieschen', variety: 'Sora', location: 'Feld 1',
    expectedYield: 200, unit: 'bund', status: CropStatus.HARVESTED,
    plantWeek: 10, plantYear: 2024, harvestWeek: 16, harvestYear: 2024,
    plantDateIso: '2024-03-04', harvestDateIso: '2024-04-15', actualYield: 195, harvestedAt: '2024-04-16'
  },
  {
    id: 'mock-4', name: 'Spinat', variety: 'Matador', location: 'Feld 2',
    expectedYield: 80, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 11, plantYear: 2024, harvestWeek: 18, harvestYear: 2024,
    plantDateIso: '2024-03-11', harvestDateIso: '2024-04-29', actualYield: 85, harvestedAt: '2024-04-30'
  },
  // MAIO / JUNHO
  {
    id: 'mock-5', name: 'Kohlrabi', variety: 'Superschmelz', location: 'Feld 3',
    expectedYield: 150, unit: 'units', status: CropStatus.HARVESTED,
    plantWeek: 14, plantYear: 2024, harvestWeek: 22, harvestYear: 2024,
    plantDateIso: '2024-04-01', harvestDateIso: '2024-05-27', actualYield: 148, harvestedAt: '2024-05-28'
  },
  {
    id: 'mock-6', name: 'Erdbeeren', variety: 'Senga Sengana', location: 'Beet 5',
    expectedYield: 60, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 36, plantYear: 2023, harvestWeek: 24, harvestYear: 2024,
    plantDateIso: '2023-09-04', harvestDateIso: '2024-06-10', actualYield: 55, harvestedAt: '2024-06-12'
  },
  // JULHO / AGOSTO (Verão)
  {
    id: 'mock-7', name: 'Tomaten', variety: 'Harzfeuer', location: 'Gewächshaus B',
    expectedYield: 300, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 16, plantYear: 2024, harvestWeek: 30, harvestYear: 2024,
    plantDateIso: '2024-04-15', harvestDateIso: '2024-07-22', actualYield: 310, harvestedAt: '2024-07-25'
  },
  {
    id: 'mock-8', name: 'Zucchini', variety: 'Diamant', location: 'Feld 4',
    expectedYield: 120, unit: 'units', status: CropStatus.HARVESTED,
    plantWeek: 20, plantYear: 2024, harvestWeek: 32, harvestYear: 2024,
    plantDateIso: '2024-05-13', harvestDateIso: '2024-08-05', actualYield: 115, harvestedAt: '2024-08-06'
  },
  // SETEMBRO / OUTUBRO (Outono)
  {
    id: 'mock-9', name: 'Kartoffeln', variety: 'Belana', location: 'Acker West',
    expectedYield: 1000, unit: 'kg', status: CropStatus.ACTIVE,
    plantWeek: 15, plantYear: 2024, harvestWeek: 38, harvestYear: 2024,
    plantDateIso: '2024-04-08', harvestDateIso: '2024-09-16'
  },
  {
    id: 'mock-10', name: 'Kürbis', variety: 'Hokkaido', location: 'Acker Ost',
    expectedYield: 400, unit: 'units', status: CropStatus.PLANNED,
    plantWeek: 21, plantYear: 2024, harvestWeek: 42, harvestYear: 2024,
    plantDateIso: '2024-05-20', harvestDateIso: '2024-10-14'
  },
  // NOVEMBRO / DEZEMBRO
  {
    id: 'mock-11', name: 'Grünkohl', variety: 'Winterbor', location: 'Feld 6',
    expectedYield: 250, unit: 'kg', status: CropStatus.PLANNED,
    plantWeek: 26, plantYear: 2024, harvestWeek: 46, harvestYear: 2024,
    plantDateIso: '2024-06-24', harvestDateIso: '2024-11-11'
  },
  {
    id: 'mock-12', name: 'Rosenkohl', variety: 'Groninger', location: 'Feld 6',
    expectedYield: 180, unit: 'kg', status: CropStatus.PLANNED,
    plantWeek: 18, plantYear: 2024, harvestWeek: 50, harvestYear: 2024,
    plantDateIso: '2024-04-29', harvestDateIso: '2024-12-09'
  },
  // EXTRAS PARA ENCHER GRÁFICO
  {
    id: 'mock-13', name: 'Salat', variety: 'Lollo Rosso', location: 'Beet 1',
    expectedYield: 50, unit: 'units', status: CropStatus.HARVESTED,
    plantWeek: 12, plantYear: 2024, harvestWeek: 20, harvestYear: 2024, // Maio
    plantDateIso: '2024-03-18', harvestDateIso: '2024-05-13', actualYield: 50, harvestedAt: '2024-05-14'
  },
   {
    id: 'mock-14', name: 'Gurken', variety: 'Marketmore', location: 'Gewächshaus A',
    expectedYield: 200, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 18, plantYear: 2024, harvestWeek: 28, harvestYear: 2024, // Julho
    plantDateIso: '2024-04-29', harvestDateIso: '2024-07-08', actualYield: 180, harvestedAt: '2024-07-10'
  }
];

export const storageService = {
  getCrops: (): Crop[] => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load crops", e);
      return [];
    }
  },

  saveCrop: (crop: Crop): Crop[] => {
    const crops = storageService.getCrops();
    const existingIndex = crops.findIndex(c => c.id === crop.id);
    
    let newCrops;
    if (existingIndex >= 0) {
      newCrops = [...crops];
      newCrops[existingIndex] = crop;
    } else {
      newCrops = [crop, ...crops];
    }
    
    localStorage.setItem(KEY, JSON.stringify(newCrops));
    return newCrops;
  },

  deleteCrop: (id: string): Crop[] => {
    const crops = storageService.getCrops().filter(c => c.id !== id);
    localStorage.setItem(KEY, JSON.stringify(crops));
    return crops;
  },

  clearAll: () => {
      localStorage.removeItem(KEY);
  },

  seedInitialData: (): Crop[] => {
      const existing = storageService.getCrops();
      if (existing.length === 0) {
          localStorage.setItem(KEY, JSON.stringify(MOCK_DATA));
          return MOCK_DATA;
      }
      return existing;
  }
};