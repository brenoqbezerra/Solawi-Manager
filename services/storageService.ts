import { Crop, CropStatus } from '../types';

const KEY = 'solawi_crops_v2';

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
  }
};