import React, { useState, useEffect } from 'react';
import { Crop, CropStatus } from '../types';
import { storageService } from '../services/storageService';
import { getWeekNumber, getYear, getStatusColor } from '../utils';
import WeatherWidget from './WeatherWidget';
import CropForm from './CropForm';
import { useTranslation } from '../i18n';
import { 
  Plus, Tractor, Trash2, Search, RotateCcw, X, Check
} from 'lucide-react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, YAxis } from 'recharts';

const Dashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('');
  
  // Harvest Modal State
  const [harvestModalCrop, setHarvestModalCrop] = useState<Crop | null>(null);
  const [harvestAmount, setHarvestAmount] = useState<number>(0);
  
  const [geo] = useState({ lat: 52.52, lon: 13.405 }); 

  useEffect(() => {
    setCrops(storageService.getCrops());
  }, []);

  const handleSaveCrop = (newCrop: Crop) => {
    const updated = storageService.saveCrop(newCrop);
    setCrops(updated);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    if(confirm(t('resetConfirm'))) {
      const updated = storageService.deleteCrop(id);
      setCrops(updated);
    }
  };

  const openHarvestModal = (crop: Crop) => {
      setHarvestModalCrop(crop);
      setHarvestAmount(crop.expectedYield);
  };

  const confirmHarvest = (type: 'FULL' | 'PARTIAL') => {
      if (!harvestModalCrop) return;

      let updatedCrop = { ...harvestModalCrop };

      if (type === 'FULL') {
          updatedCrop.status = CropStatus.HARVESTED;
          updatedCrop.actualYield = harvestAmount; // Simplification
      } else {
          // Partial: Reduce expected yield, keep active
          updatedCrop.expectedYield = Math.max(0, updatedCrop.expectedYield - harvestAmount);
          // In a real app we would log a separate harvest event
      }

      const updated = storageService.saveCrop(updatedCrop);
      setCrops(updated);
      setHarvestModalCrop(null);
      setHarvestAmount(0);
  };

  const handleResetAll = () => {
      if(confirm(t('resetConfirm'))) {
          localStorage.removeItem('solawi_crops_v2');
          setCrops([]);
      }
  };

  const currentWeek = getWeekNumber();
  const currentYear = getYear();

  // Stats Logic
  const activeCrops = crops.filter(c => c.status !== CropStatus.ARCHIVED && c.status !== CropStatus.HARVESTED);
  
  // Calculate overdue
  const overdueCount = activeCrops.filter(c => getStatusColor(c.plantWeek, c.harvestWeek, c.harvestYear, currentWeek, currentYear, c.status) === 'red').length;
  
  // Calculate In Progress (Due soon or Active)
  const inProgressCount = activeCrops.length;

  // Chart Data
  const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(currentYear, i, 1);
      return date.toLocaleDateString(lang === 'de' ? 'de-DE' : lang, { month: 'short' });
  });

  const chartData = months.map((monthName, index) => {
      const count = crops.filter(c => {
          const monthOfHarvest = Math.floor((c.harvestWeek - 1) / 4.33); 
          return monthOfHarvest === index && c.status !== CropStatus.ARCHIVED;
      }).length;
      return { name: monthName, count };
  });

  const filteredCrops = crops.filter(c => 
    c.status !== CropStatus.ARCHIVED && 
    (c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.variety.toLowerCase().includes(filter.toLowerCase()))
  ).sort((a,b) => {
      if (a.status === CropStatus.HARVESTED && b.status !== CropStatus.HARVESTED) return 1;
      if (a.status !== CropStatus.HARVESTED && b.status === CropStatus.HARVESTED) return -1;
      return a.harvestWeek - b.harvestWeek;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 pb-32 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('dashboard')}</h1>
          <p className="text-slate-500 font-medium mt-1">KW {currentWeek} • {currentYear}</p>
        </div>
        
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 w-full md:w-auto">
             <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between min-w-[110px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('inProgress')}</span>
                <span className="text-2xl font-bold text-blue-600 mt-2">{inProgressCount}</span>
             </div>
             
             <div className={`p-4 rounded-xl border shadow-sm flex flex-col justify-between min-w-[110px] ${overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${overdueCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>{t('harvestOverdue')}</span>
                <span className={`text-2xl font-bold mt-2 ${overdueCount > 0 ? 'text-red-600' : 'text-slate-700'}`}>{overdueCount}</span>
             </div>
             
             <div className="hidden md:flex bg-green-50 p-4 rounded-xl border border-green-200 shadow-sm flex-col justify-between min-w-[110px]">
                 <span className="text-xs font-bold text-green-600 uppercase tracking-wider">{t('harvested')}</span>
                 <span className="text-2xl font-bold text-green-700 mt-2">
                     {crops.filter(c => c.status === CropStatus.HARVESTED).length}
                 </span>
             </div>
        </div>
      </div>

      {/* Main Layout - 2 Columns on Desktop to match Tablet feel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (1/3): Weather & Chart */}
        <div className="space-y-6 lg:col-span-1">
          <WeatherWidget geo={geo} />
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6">{t('plannedHarvests')}</h3>
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} interval={0} />
                  <YAxis hide={true} /> 
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    formatter={(value: number) => [value, t('quantity')]}
                  />
                  <Bar dataKey="count" radius={[4, 4, 4, 4]} barSize={20}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.count > 0 ? '#15803d' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column (2/3): List & Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {showForm ? (
            <CropForm onSave={handleSaveCrop} onCancel={() => setShowForm(false)} />
          ) : (
            <>
               {/* Controls */}
              <div className="flex gap-4">
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5 group-focus-within:text-green-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder={`${t('activeCrops')}...`} 
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                  />
                </div>
                {/* Mobile Add Button is Fixed, Desktop is here too if needed, but we use FAB */}
              </div>

              {/* Table / List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                      <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('culture')}</th>
                        <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{t('status')}</th>
                        <th className="p-4 hidden sm:table-cell text-xs font-bold text-slate-500 uppercase tracking-wider">{t('location')}</th>
                        <th className="p-4 hidden md:table-cell text-xs font-bold text-slate-500 uppercase tracking-wider">{t('harvestWeek')}</th>
                        <th className="p-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredCrops.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-2">
                             <Tractor size={48} className="opacity-20" />
                             <span>{t('noCrops')}</span>
                          </td>
                        </tr>
                      )}
                      {filteredCrops.map(crop => {
                        const statusColor = getStatusColor(crop.plantWeek, crop.harvestWeek, crop.harvestYear, currentWeek, currentYear, crop.status);
                        
                        const statusLabels: Record<string, string> = {
                           red: t('harvestOverdue'),
                           yellow: t('harvestSoon'),
                           green: t('harvestDue'),
                           gray: t('growing'),
                           blue: t('harvested')
                        };
                        const colorClasses: Record<string, string> = {
                          red: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',
                          yellow: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
                          green: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
                          gray: 'bg-slate-100 text-slate-600 border-slate-200',
                          blue: 'bg-blue-50 text-blue-700 border-blue-200'
                        };

                        return (
                          <tr key={crop.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="p-4">
                              <div className={`font-semibold ${crop.status === CropStatus.HARVESTED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{crop.name}</div>
                              <div className="text-xs text-slate-500 font-medium">{crop.variety}</div>
                              <div className="text-xs text-slate-400 sm:hidden mt-1 font-mono">KW {crop.harvestWeek}</div>
                            </td>
                            <td className="p-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ring-1 ring-inset ${colorClasses[statusColor]}`}>
                                {statusLabels[statusColor]}
                              </span>
                            </td>
                            <td className="p-4 hidden sm:table-cell text-sm text-slate-600 font-medium">
                              {crop.location}
                            </td>
                            <td className="p-4 hidden md:table-cell text-sm text-slate-600 font-mono">
                              KW {crop.harvestWeek} <span className="text-xs text-slate-400">({crop.harvestYear})</span>
                              <span className="text-xs text-slate-400 block font-sans">{crop.expectedYield} {crop.unit}</span>
                            </td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                {crop.status !== CropStatus.HARVESTED && (
                                    <button 
                                        className="p-2 text-green-700 bg-green-50 rounded-lg hover:bg-green-100 hover:shadow-sm transition-all border border-green-200" 
                                        title={t('harvest')}
                                        onClick={() => openHarvestModal(crop)}
                                    >
                                        <Tractor size={18} />
                                    </button>
                                )}
                                <button 
                                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                  onClick={() => handleDelete(crop.id)}
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Reset Data Footer */}
               <div className="flex justify-center mt-12 pt-8">
                  <button onClick={handleResetAll} className="flex items-center gap-2 text-xs text-slate-400 hover:text-red-500 transition-colors">
                      <RotateCcw size={12} />
                      {t('resetData')}
                  </button>
               </div>
            </>
          )}
        </div>
      </div>

      {/* FAB for Desktop & Mobile */}
      {!showForm && !harvestModalCrop && (
        <button 
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-green-700 hover:bg-green-800 text-white rounded-2xl py-4 px-6 shadow-xl shadow-green-900/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 z-40"
        >
          <Plus size={24} />
          <span className="font-bold text-lg pr-1 hidden md:inline">{t('newCrop')}</span>
        </button>
      )}

      {/* Harvest Modal Overlay */}
      {harvestModalCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="bg-green-700 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Tractor size={20} /> {t('harvestActionTitle')}
                    </h3>
                    <button onClick={() => setHarvestModalCrop(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-4">
                        {t('harvestActionDesc')} <strong>{harvestModalCrop.name}</strong>
                    </p>
                    
                    <div className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t('amountHarvested')} ({harvestModalCrop.unit})</label>
                        <input 
                            type="number" 
                            className="w-full text-3xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-green-500 outline-none py-2 bg-transparent"
                            autoFocus
                            value={harvestAmount}
                            onChange={(e) => setHarvestAmount(parseFloat(e.target.value))}
                        />
                        <div className="flex justify-between text-xs text-slate-400 mt-2">
                             <span>{t('remainingAmount')}: {Math.max(0, harvestModalCrop.expectedYield - harvestAmount)} {harvestModalCrop.unit}</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                         <button 
                            onClick={() => confirmHarvest('FULL')}
                            className="w-full py-3 bg-green-700 hover:bg-green-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            <Check size={18} /> {t('harvestFull')}
                        </button>
                        <button 
                            onClick={() => confirmHarvest('PARTIAL')}
                            className="w-full py-3 bg-white border-2 border-green-700 text-green-700 hover:bg-green-50 font-bold rounded-xl transition-colors"
                        >
                             {t('harvestPartial')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;