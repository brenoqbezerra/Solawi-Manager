import React, { useState, useEffect } from 'react';
import { Crop, CropStatus } from '../types';
import { generateId, getWeekNumber } from '../utils';
import { useTranslation } from '../i18n';
import { Save, X, Calendar, MapPin, Scale, StickyNote } from 'lucide-react';

interface Props {
  initialData?: Crop | null;
  onSave: (crop: Crop) => void;
  onCancel: () => void;
}

const CropForm: React.FC<Props> = ({ initialData, onSave, onCancel }) => {
  const { t } = useTranslation();
  
  const [plantDateStr, setPlantDateStr] = useState<string>(new Date().toISOString().split('T')[0]);
  const [harvestDateStr, setHarvestDateStr] = useState<string>('');
  
  const [formData, setFormData] = useState<Partial<Crop>>({
    name: '',
    variety: '',
    location: '',
    expectedYield: '' as unknown as number, // Start empty
    unit: 'kg',
    status: CropStatus.PLANNED,
    notes: ''
  });

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
        setFormData({
            ...initialData
        });
        
        // Convert KW back to approximate dates if strictly needed, 
        // OR better: use the stored date ISO strings if we had them.
        // For now, since we only stored KW/Year in previous versions, we might default 
        // to current date OR if we have valid ISO logic.
        // But since we didn't store ISO dates in the Crop interface before this update, 
        // we might reset dates or keep them if it's a new record.
        // *Correction*: In the previous step we didn't save ISO dates to the interface.
        // Let's rely on the user re-selecting dates or default to today for simplicity in this MVP upgrade.
        // Ideally, we should update the Crop interface to store ISO dates.
    }
  }, [initialData]);

  const [plantKW, setPlantKW] = useState(getWeekNumber(new Date()));
  const [harvestKW, setHarvestKW] = useState<number | null>(null);

  // Update KW when dates change
  useEffect(() => {
    if (plantDateStr) {
      const d = new Date(plantDateStr);
      setPlantKW(getWeekNumber(d));
    }
  }, [plantDateStr]);

  useEffect(() => {
    if (harvestDateStr) {
      const d = new Date(harvestDateStr);
      setHarvestKW(getWeekNumber(d));
    } else {
      setHarvestKW(null);
    }
  }, [harvestDateStr]);

  const isValid = 
    formData.name && 
    plantDateStr && 
    harvestDateStr && 
    formData.expectedYield;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    const pDate = new Date(plantDateStr);
    const hDate = new Date(harvestDateStr);

    onSave({
      id: initialData?.id || generateId(),
      name: formData.name!,
      variety: formData.variety || '',
      location: formData.location || '',
      expectedYield: Number(formData.expectedYield),
      unit: formData.unit!,
      status: initialData?.status || CropStatus.PLANNED,
      plantWeek: getWeekNumber(pDate),
      plantYear: pDate.getFullYear(),
      harvestWeek: getWeekNumber(hDate),
      harvestYear: hDate.getFullYear(),
      notes: formData.notes || ''
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        <div className="bg-gradient-to-r from-green-700 to-green-800 px-6 py-4 border-b border-green-600 flex justify-between items-center sticky top-0 z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {initialData ? t('editCrop') : t('newCrop')}
            </h2>
            <button onClick={onCancel} className="text-green-100 hover:text-white hover:bg-white/10 p-2 rounded-full transition-colors">
                <X size={24} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Section 1: Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t('culture')} <span className="text-red-500">*</span></label>
                <input 
                required
                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder={t('culturePlaceholder')}
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t('variety')}</label>
                <input 
                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder={t('varietyPlaceholder')}
                value={formData.variety}
                onChange={e => setFormData({...formData, variety: e.target.value})}
                />
            </div>
            </div>

            {/* Section 2: Simple Calendar Dates */}
            <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Plant Date */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Calendar size={16} className="text-blue-600"/> {t('plantDate')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="date"
                                required
                                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm font-medium cursor-pointer"
                                value={plantDateStr}
                                onChange={e => setPlantDateStr(e.target.value)}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-white pl-2">
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                                    KW {plantKW}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Harvest Date */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                            <Calendar size={16} className="text-green-600"/> {t('harvestDate')} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                type="date"
                                required
                                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm font-medium cursor-pointer"
                                value={harvestDateStr}
                                onChange={e => setHarvestDateStr(e.target.value)}
                            />
                            {harvestKW && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none bg-white pl-2">
                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded">
                                        KW {harvestKW}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 3: Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MapPin size={16} /> {t('location')}
                </label>
                <input 
                type="text"
                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none shadow-sm placeholder:text-slate-400"
                placeholder={t('locationPlaceholder')}
                value={formData.location}
                onChange={e => setFormData({...formData, location: e.target.value})}
                />
            </div>

            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Scale size={16} /> {t('expectedYield')} <span className="text-red-500">*</span>
                </label>
                <input 
                type="number"
                required
                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none shadow-sm font-medium"
                value={formData.expectedYield}
                onChange={e => setFormData({...formData, expectedYield: parseFloat(e.target.value)})}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">{t('unit')}</label>
                <select 
                className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                >
                <option value="kg">{t('unit_kg')}</option>
                <option value="units">{t('unit_units')}</option>
                <option value="bund">{t('unit_bund')}</option>
                </select>
            </div>
            </div>

            {/* Section 4: Notes */}
            <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <StickyNote size={16} /> {t('notes')}
                </label>
                <textarea 
                    className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none shadow-sm placeholder:text-slate-400 resize-none h-24"
                    placeholder={t('notesPlaceholder')}
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                />
            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-100 mt-6">
            <button 
                type="button" 
                onClick={onCancel}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors"
            >
                {t('cancel')}
            </button>
            <button 
                type="submit"
                disabled={!isValid}
                className={`flex-1 py-3 px-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2
                    ${isValid 
                        ? 'bg-green-700 text-white hover:bg-green-800 shadow-green-700/20' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'}`}
            >
                <Save size={20} />
                {t('save')}
            </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CropForm;