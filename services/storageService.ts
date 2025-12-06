import { Crop, CropStatus } from '../types';
import { getWeekNumber, getDateFromWeek } from '../utils';

const KEY = 'solawi_crops_v2';

// Helper to generate dynamic dates relative to today
const getRelativeDate = (weekOffset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + (weekOffset * 7));
    return {
        date: d,
        iso: d.toISOString().split('T')[0],
        week: getWeekNumber(d),
        year: d.getFullYear()
    };
};

const now = getRelativeDate(0); // This week
const past = getRelativeDate(-2); // 2 weeks ago
const future2025 = { year: 2025 };
const future2026 = { year: 2026 };

const MOCK_DATA: Crop[] = [
  // --- DINÂMICOS (PARA TESTAR ALERTAS VISUAIS) ---
  {
      id: 'dynamic-due-now', name: 'Rucola', variety: 'Speedy', location: 'Tunnel 2',
      expectedYield: 40, unit: 'kg', status: CropStatus.ACTIVE,
      plantWeek: now.week - 6, plantYear: now.year, 
      harvestWeek: now.week, harvestYear: now.year, // CAI NA SEMANA ATUAL (AMARELO)
      plantDateIso: getRelativeDate(-6).iso, harvestDateIso: now.iso,
      notes: "Colheita urgente esta semana!"
  },
  {
      id: 'dynamic-overdue', name: 'Spinat', variety: 'Matador', location: 'Feld 3',
      expectedYield: 60, unit: 'kg', status: CropStatus.ACTIVE,
      plantWeek: past.week - 8, plantYear: past.year,
      harvestWeek: past.week, harvestYear: past.year, // CAI NO PASSADO (VERMELHO)
      plantDateIso: getRelativeDate(-10).iso, harvestDateIso: past.iso,
      notes: "Atenção: Já deveria ter sido colhido."
  },

  // --- HISTÓRICO 2024 ---
  {
    id: 'mock-1', name: 'Feldsalat', variety: 'Vit', location: 'Gewächshaus A',
    expectedYield: 50, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 45, plantYear: 2023, harvestWeek: 5, harvestYear: 2024,
    plantDateIso: '2023-11-06', harvestDateIso: '2024-01-29', actualYield: 52, harvestedAt: '2024-01-30'
  },
  {
    id: 'mock-3', name: 'Radieschen', variety: 'Sora', location: 'Feld 1',
    expectedYield: 200, unit: 'bund', status: CropStatus.HARVESTED,
    plantWeek: 10, plantYear: 2024, harvestWeek: 16, harvestYear: 2024,
    plantDateIso: '2024-03-04', harvestDateIso: '2024-04-15', actualYield: 195, harvestedAt: '2024-04-16'
  },
  {
    id: 'mock-7', name: 'Tomaten', variety: 'Harzfeuer', location: 'Gewächshaus B',
    expectedYield: 300, unit: 'kg', status: CropStatus.HARVESTED,
    plantWeek: 16, plantYear: 2024, harvestWeek: 30, harvestYear: 2024,
    plantDateIso: '2024-04-15', harvestDateIso: '2024-07-22', actualYield: 310, harvestedAt: '2024-07-25'
  },

  // --- FUTURO 2025 ---
  {
    id: 'future-2025-1', name: 'Frühkartoffeln', variety: 'Annabelle', location: 'Acker Süd',
    expectedYield: 800, unit: 'kg', status: CropStatus.PLANNED,
    plantWeek: 12, plantYear: 2025, harvestWeek: 26, harvestYear: 2025,
    plantDateIso: '2025-03-17', harvestDateIso: '2025-06-23'
  },
  {
    id: 'future-2025-2', name: 'Kürbis', variety: 'Butternut', location: 'Feld 5',
    expectedYield: 350, unit: 'units', status: CropStatus.PLANNED,
    plantWeek: 20, plantYear: 2025, harvestWeek: 40, harvestYear: 2025,
    plantDateIso: '2025-05-12', harvestDateIso: '2025-09-29'
  },
  {
    id: 'future-2025-3', name: 'Grünkohl', variety: 'Lerchenzunge', location: 'Beet 8',
    expectedYield: 150, unit: 'kg', status: CropStatus.PLANNED,
    plantWeek: 25, plantYear: 2025, harvestWeek: 48, harvestYear: 2025,
    plantDateIso: '2025-06-16', harvestDateIso: '2025-11-24'
  },

  // --- FUTURO 2026 ---
  {
    id: 'future-2026-1', name: 'Spargel', variety: 'Gijnlim', location: 'Spargelfeld',
    expectedYield: 500, unit: 'kg', status: CropStatus.PLANNED,
    plantWeek: 15, plantYear: 2026, harvestWeek: 18, harvestYear: 2026,
    plantDateIso: '2026-04-06', harvestDateIso: '2026-04-27'
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