import React, { useState } from 'react';
import { Crop, CropStatus } from '../types';
import { generateId, getWeekNumber, getYear, getDateRangeOfWeek } from '../utils';
import { useTranslation } from '../i18n';
import { Save, X, Calendar, MapPin, Scale } from 'lucide-react';

interface Props {
  onSave: (crop: Crop) => void;
  onCancel: () => void;
}

const CropForm: React.FC<Props> = ({ onSave, onCancel }) => {
  const { t, lang } = useTranslation();
  const currentWeek = getWeekNumber();
  const currentYear = getYear();

  const [formData, setFormData] = useState<Partial<Crop>>({
    name: '',
    variety: '',
    plantWeek: currentWeek,
    plantYear: currentYear,
    harvestWeek: currentWeek + 8, 
    harvestYear: currentYear,
    location: '',
    expectedYield: 0,
    unit: 'kg',
    status: CropStatus.PLANNED
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.plantWeek || !formData.harvestWeek) return;
    
    onSave({
      id: generateId(),
      ...formData as Crop
    });
  };

  const getWeekLabel = (w: number, y: number) => {
      if (!w || !y) return '';
      return getDateRangeOfWeek(w, y, lang === 'de' ? 'de-DE' : lang);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
           {t('newCrop')}
        </h2>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t('culture')}</label>
            <input 
              required
              className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="e.g. Karotten"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">{t('variety')}</label>
            <input 
              className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 font-medium"
              placeholder="e.g. Nantaise"
              value={formData.variety}
              onChange={e => setFormData({...formData, variety: e.target.value})}
            />
          </div>
        </div>

        {/* Section 2: Timing with Visual Helper */}
        <div className="bg-blue-50/80 rounded-xl p-5 border border-blue-200 space-y-4">
            <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2">
                <Calendar size={16} /> {t('dateRange')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Plant Date */}
                <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">{t('plantWeek')}</label>
                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">{t('plantYear')}</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-24 flex-shrink-0">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs pointer-events-none">KW</span>
                            <input 
                                type="number" min="1" max="53" required
                                className="w-full pl-9 pr-2 py-2.5 rounded-lg border-slate-300 border text-center font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                                value={formData.plantWeek}
                                onChange={e => setFormData({...formData, plantWeek: parseInt(e.target.value)})}
                            />
                        </div>
                        <select 
                             className="w-24 py-2.5 px-2 rounded-lg border-slate-300 border font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                             value={formData.plantYear}
                             onChange={e => setFormData({...formData, plantYear: parseInt(e.target.value)})}
                        >
                            {[currentYear - 1, currentYear, currentYear + 1].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mt-1.5 text-xs text-blue-700 font-medium bg-blue-100/50 px-2 py-1 rounded inline-block">
                        {getWeekLabel(formData.plantWeek || 0, formData.plantYear || currentYear)}
                    </div>
                </div>
                
                {/* Harvest Date */}
                <div>
                    <div className="flex justify-between mb-1">
                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">{t('harvestWeek')}</label>
                      <label className="block text-xs font-bold text-blue-800 uppercase tracking-wider">{t('harvestYear')}</label>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative w-24 flex-shrink-0">
                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-xs pointer-events-none">KW</span>
                            <input 
                                type="number" min="1" max="53" required
                                className="w-full pl-9 pr-2 py-2.5 rounded-lg border-slate-300 border text-center font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                                value={formData.harvestWeek}
                                onChange={e => setFormData({...formData, harvestWeek: parseInt(e.target.value)})}
                            />
                        </div>
                         <select 
                             className="w-24 py-2.5 px-2 rounded-lg border-slate-300 border font-bold text-slate-900 bg-white focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                             value={formData.harvestYear}
                             onChange={e => setFormData({...formData, harvestYear: parseInt(e.target.value)})}
                        >
                            {[currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                     <div className="mt-1.5 text-xs text-blue-700 font-medium bg-blue-100/50 px-2 py-1 rounded inline-block">
                        {getWeekLabel(formData.harvestWeek || 0, formData.harvestYear || currentYear)}
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
            <select 
              className="w-full rounded-lg border-slate-300 border bg-white p-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none shadow-sm"
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            >
              <option value="">-- Select --</option>
              <option value="field_1">{t('field')} 1</option>
              <option value="field_2">{t('field')} 2</option>
              <option value="gh_1">{t('greenhouse')} A</option>
              <option value="tunnel">{t('tunnel')}</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Scale size={16} /> {t('expectedYield')}
            </label>
            <input 
              type="number"
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
              <option value="kg">kg</option>
              <option value="units">Stück</option>
              <option value="bund">Bund</option>
            </select>
          </div>
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
            className="flex-1 py-3 px-4 rounded-xl bg-green-700 text-white font-bold hover:bg-green-800 shadow-lg shadow-green-700/20 transition-all active:scale-[0.98]"
          >
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CropForm;