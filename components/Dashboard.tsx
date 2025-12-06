import React, { useState, useEffect, useRef } from 'react';
import { Crop, CropStatus } from '../types';
import { storageService } from '../services/storageService';
import { getWeekNumber, getYear, getStatusColor } from '../utils';
import WeatherWidget from './WeatherWidget';
import CropForm from './CropForm';
import { useTranslation } from '../i18n';
import { 
  Plus, Tractor, Trash2, Search, RotateCcw, X, Check, Calendar, TrendingUp, ChevronDown, Pencil
} from 'lucide-react';
import { 
  ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';

const Dashboard: React.FC = () => {
  const { t, lang } = useTranslation();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  
  // UI States
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [filter, setFilter] = useState('');
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);
  
  // Chart Year Filter State
  const currentYear = getYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const yearDropdownRef = useRef<HTMLDivElement>(null);
  
  // Harvest Modal State
  const [harvestModalCrop, setHarvestModalCrop] = useState<Crop | null>(null);
  const [harvestAmount, setHarvestAmount] = useState<string>(''); // String to handle empty state
  
  const [geo, setGeo] = useState({ lat: 52.52, lon: 13.405 }); // Default Berlin

  // Seed data & Geo
  useEffect(() => {
    const loaded = storageService.seedInitialData();
    setCrops(loaded);
    setIsMounted(true);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setGeo({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            },
            (err) => {
                console.warn("Location access denied or error:", err);
            }
        );
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
            setIsYearDropdownOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSaveCrop = (newCrop: Crop) => {
    const updated = storageService.saveCrop(newCrop);
    setCrops(updated);
    setShowForm(false);
    setEditingCrop(null);
    setSelectedRowId(null);
  };

  const handleEdit = (crop: Crop, e: React.MouseEvent) => {
      e.stopPropagation();
      setEditingCrop(crop);
      setShowForm(true);
  };

  const handleRowClick = (id: string) => {
      setSelectedRowId(id === selectedRowId ? null : id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if(window.confirm(t('deleteConfirm'))) {
      const updated = storageService.deleteCrop(id);
      setCrops(updated);
      if (selectedRowId === id) setSelectedRowId(null);
    }
  };

  const openHarvestModal = (crop: Crop, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setHarvestModalCrop(crop);
      // Default to expected yield for quick "full harvest"
      setHarvestAmount(crop.expectedYield.toString());
  };

  const confirmHarvest = () => {
      if (!harvestModalCrop) return;
      
      const amount = parseFloat(harvestAmount);
      if (isNaN(amount) || amount < 0) return;

      let updatedCrop = { ...harvestModalCrop };
      const currentExpected = updatedCrop.expectedYield || 0;

      // Logic: If user harvested >= expected, assume DONE.
      // If user harvested < expected, assume PARTIAL and update remainder.
      
      if (amount >= currentExpected) {
          updatedCrop.status = CropStatus.HARVESTED;
          updatedCrop.actualYield = amount;
          updatedCrop.expectedYield = 0; // Cleared
      } else {
          // Partial
          updatedCrop.status = CropStatus.ACTIVE; // Remains active
          updatedCrop.expectedYield = parseFloat((currentExpected - amount).toFixed(1));
          // We could track total harvested in a separate field in future, 
          // for now we just reduce the expected yield pile.
      }

      updatedCrop.harvestedAt = new Date().toISOString();

      const updated = storageService.saveCrop(updatedCrop);
      setCrops(updated);
      setHarvestModalCrop(null);
      setHarvestAmount('');
  };

  const handleResetAll = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(window.confirm(t('resetConfirm'))) {
          storageService.clearAll();
          setCrops([]);
      }
  };

  const currentWeek = getWeekNumber();
  
  // Calculate unique years for filter
  const availableYears = Array.from(new Set([
      currentYear, 
      ...crops.map(c => c.harvestYear), 
      ...crops.map(c => c.plantYear)
  ])).sort((a, b) => b - a); // Descending

  // KPIS Logic
  const activeCrops = crops.filter(c => c.status !== CropStatus.ARCHIVED && c.status !== CropStatus.HARVESTED);
  
  // 1. Total Active
  const totalActiveCount = activeCrops.length;
  
  // 2. Due This Week
  const dueThisWeekCount = activeCrops.filter(c => {
      const color = getStatusColor(c.plantWeek, c.harvestWeek, c.harvestYear, currentWeek, currentYear, c.status);
      return color === 'yellow';
  }).length;

  // 3. Overdue
  const overdueCount = activeCrops.filter(c => {
      const color = getStatusColor(c.plantWeek, c.harvestWeek, c.harvestYear, currentWeek, currentYear, c.status);
      return color === 'red';
  }).length;

  // 4. Harvested
  const harvestedCount = crops.filter(c => c.status === CropStatus.HARVESTED).length;

  // Chart Data Filtering
  const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(selectedYear, i, 1);
      return date.toLocaleDateString(lang === 'de' ? 'de-DE' : lang, { month: 'short' });
  });

  const chartData = months.map((monthName, index) => {
      // Logic: Filter by Harvest Year and Month
      const relevantCrops = crops.filter(c => {
          if (c.harvestYear !== selectedYear) return false;
          // Calculate month of harvest (approx based on week or date)
          let monthOfHarvest = 0;
          if (c.harvestDateIso) {
              monthOfHarvest = new Date(c.harvestDateIso).getMonth();
          } else {
              monthOfHarvest = Math.floor((c.harvestWeek - 1) / 4.33);
          }
          return monthOfHarvest === index;
      });

      const planned = relevantCrops.length; // All crops planned for this month
      const realized = relevantCrops.filter(c => c.status === CropStatus.HARVESTED).length; // Actual harvests

      return { name: monthName, planned, realized };
  });

  // Table Filtering
  const filteredCrops = crops.filter(c => 
    c.status !== CropStatus.ARCHIVED && 
    (c.name.toLowerCase().includes(filter.toLowerCase()) || 
    c.variety.toLowerCase().includes(filter.toLowerCase()) || 
    c.location.toLowerCase().includes(filter.toLowerCase()))
  ).sort((a,b) => {
      // Priority sort: Overdue -> This Week -> Active -> Harvested -> Future
      const getColor = (crop: Crop) => getStatusColor(crop.plantWeek, crop.harvestWeek, crop.harvestYear, currentWeek, currentYear, crop.status);
      const colorA = getColor(a);
      const colorB = getColor(b);
      
      const colorOrder = { 'red': 0, 'yellow': 1, 'green': 2, 'blue': 3, 'gray': 4 };
      
      // @ts-ignore
      if (colorOrder[colorA] !== colorOrder[colorB]) {
          // @ts-ignore
          return colorOrder[colorA] - colorOrder[colorB];
      }
      
      return a.harvestWeek - b.harvestWeek;
  });

  const getMonthNameFromIso = (iso?: string) => {
      if (!iso) return '-';
      return new Date(iso).toLocaleDateString(lang === 'de' ? 'de-DE' : lang, { month: 'short' });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 pb-32 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t('dashboard')}</h1>
          <p className="text-slate-500 font-medium mt-1">KW {currentWeek} • {currentYear}</p>
        </div>
        
        {/* Quick Stats Cards - Centered Text */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
             
             {/* 1. Active Total */}
             <div className={`h-32 w-full p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center gap-2 ${totalActiveCount > 0 ? 'bg-green-50 border-green-200' : 'bg-white border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${totalActiveCount > 0 ? 'text-green-600' : 'text-slate-400'}`}>{t('inProgress')}</span>
                <span className={`text-3xl font-bold ${totalActiveCount > 0 ? 'text-green-700' : 'text-slate-700'}`}>{totalActiveCount}</span>
             </div>

             {/* 2. Due This Week */}
             <div className={`h-32 w-full p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center gap-2 ${dueThisWeekCount > 0 ? 'bg-amber-50 border-amber-200' : 'bg-white border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${dueThisWeekCount > 0 ? 'text-amber-600' : 'text-slate-400'}`}>{t('harvestThisWeek')}</span>
                <span className={`text-3xl font-bold ${dueThisWeekCount > 0 ? 'text-amber-700' : 'text-slate-700'}`}>{dueThisWeekCount}</span>
             </div>
             
             {/* 3. Overdue */}
             <div className={`h-32 w-full p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center gap-2 ${overdueCount > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'}`}>
                <span className={`text-xs font-bold uppercase tracking-wider ${overdueCount > 0 ? 'text-red-600' : 'text-slate-400'}`}>{t('harvestOverdue')}</span>
                <span className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-600' : 'text-slate-700'}`}>{overdueCount}</span>
             </div>
             
             {/* 4. Harvested */}
             <div className={`h-32 w-full p-4 rounded-xl border shadow-sm flex flex-col justify-center items-center text-center gap-2 ${harvestedCount > 0 ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200'}`}>
                 <span className={`text-xs font-bold uppercase tracking-wider ${harvestedCount > 0 ? 'text-blue-600' : 'text-slate-400'}`}>{t('harvested')}</span>
                 <span className={`text-3xl font-bold ${harvestedCount > 0 ? 'text-blue-700' : 'text-slate-700'}`}>
                     {harvestedCount}
                 </span>
             </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        
        <WeatherWidget geo={geo} />
        
        {/* Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm" style={{ minHeight: '300px' }}>
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp size={18} className="text-slate-400"/>
                    <span className="hidden md:inline">{t('chartTitle')}</span>
                    <span className="md:hidden">{t('planned')} vs {t('realized')}</span>
                </h3>
                
                {/* Modern Year Filter Dropdown */}
                <div className="relative" ref={yearDropdownRef}>
                    <button 
                        onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                        className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 transition-all text-sm font-semibold text-slate-600"
                    >
                        <Calendar size={14} className="text-slate-400"/>
                        {selectedYear}
                        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isYearDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isYearDropdownOpen && (
                        <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20 animate-in fade-in zoom-in-95 duration-100">
                            <ul className="py-1">
                                {availableYears.map((year) => (
                                    <li key={year}>
                                        <button 
                                            onClick={() => {
                                                setSelectedYear(year);
                                                setIsYearDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors
                                                ${selectedYear === year ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700'}
                                            `}
                                        >
                                            {year}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Chart Container */}
            <div className="w-full h-48 md:h-64" style={{ minHeight: '192px' }}>
                {isMounted ? (
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{fontSize: 10, fill: '#94a3b8'}} tickLine={false} axisLine={false} interval={0} />
                            <YAxis hide={true} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="planned" name={t('planned')} fill="#93c5fd" radius={[4, 4, 4, 4]} barSize={20} />
                            <Line type="monotone" dataKey="realized" name={t('realized')} stroke="#15803d" strokeWidth={3} dot={{r: 4, fill: '#15803d', strokeWidth: 2, stroke: '#fff'}} />
                        </ComposedChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-xl">
                        <span className="text-slate-400 text-sm">Loading Chart...</span>
                    </div>
                )}
            </div>
        </div>

        {/* List & Controls */}
        <div className="space-y-6">
          
           {/* Search & Filter */}
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
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('culture')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('plantMonth')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('harvestMonth')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('status')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('location')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider border-r border-slate-100">{t('harvestWeek')}</th>
                    <th className="p-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCrops.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center text-slate-400">
                         <div className="flex flex-col items-center justify-center gap-3 w-full">
                            <Tractor size={48} className="opacity-20" />
                            <span>{t('noCrops')}</span>
                         </div>
                      </td>
                    </tr>
                  )}
                  {filteredCrops.map(crop => {
                    const statusColor = getStatusColor(crop.plantWeek, crop.harvestWeek, crop.harvestYear, currentWeek, currentYear, crop.status);
                    const isSelected = selectedRowId === crop.id;

                    const statusLabels: Record<string, string> = {
                       red: t('harvestOverdue'),
                       yellow: t('harvestDue'),
                       green: t('growing'),
                       blue: t('harvested'),
                       gray: t('planned')
                    };
                    const badgeColorClasses: Record<string, string> = {
                      red: 'bg-red-50 text-red-700 border-red-200 ring-red-500/20',
                      yellow: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20',
                      green: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20',
                      gray: 'bg-slate-100 text-slate-600 border-slate-200',
                      blue: 'bg-blue-50 text-blue-700 border-blue-200'
                    };

                    // Row Highlight Logic (Background only, no side border)
                    let rowClasses = "transition-colors group cursor-pointer border-b border-slate-50 last:border-0 ";
                    
                    if (isSelected) {
                        rowClasses += "bg-slate-100 ";
                    } else if (statusColor === 'red') {
                        rowClasses += "bg-red-50 hover:bg-red-100 ";
                    } else if (statusColor === 'yellow') {
                        rowClasses += "bg-amber-50 hover:bg-amber-100 ";
                    } else {
                        rowClasses += "hover:bg-slate-50/80 ";
                    }
                    
                    const unitLabel = t(`unit_${crop.unit}` as any) || crop.unit;

                    return (
                      <tr key={crop.id} className={rowClasses} onClick={() => handleRowClick(crop.id)}>
                        <td className="p-4 border-r border-slate-50/50 text-center">
                          <div className={`font-semibold ${crop.status === CropStatus.HARVESTED ? 'text-slate-400 line-through' : 'text-slate-800'}`}>{crop.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{crop.variety}</div>
                          {crop.notes && <div className="text-[10px] text-slate-400 mt-1 italic max-w-[150px] truncate mx-auto">{crop.notes}</div>}
                        </td>
                        <td className="p-4 text-sm text-slate-600 border-r border-slate-50/50 text-center">
                            {getMonthNameFromIso(crop.plantDateIso)}
                        </td>
                         <td className="p-4 text-sm text-slate-600 border-r border-slate-50/50 text-center">
                            {getMonthNameFromIso(crop.harvestDateIso)}
                        </td>
                        <td className="p-4 text-center border-r border-slate-50/50">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ring-1 ring-inset ${badgeColorClasses[statusColor]}`}>
                            {statusLabels[statusColor] || statusLabels['green']}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-medium border-r border-slate-50/50 text-center">
                          {crop.location}
                        </td>
                        <td className="p-4 text-sm text-slate-600 font-mono border-r border-slate-50/50 text-center">
                          KW {crop.harvestWeek} <span className="text-xs text-slate-400">({crop.harvestYear})</span>
                          <span className="text-xs text-slate-400 block font-sans">{crop.expectedYield} {unitLabel}</span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                             {/* Harvest Button */}
                            {crop.status !== CropStatus.HARVESTED && (
                                <button 
                                    className="p-2 text-green-700 bg-white/50 hover:bg-green-100 rounded-lg transition-all border border-green-200" 
                                    title={t('harvest')}
                                    onClick={(e) => openHarvestModal(crop, e)}
                                >
                                    <Tractor size={18} />
                                </button>
                            )}
                            
                            {/* Edit Button (New) */}
                             <button 
                              className="p-2 text-blue-600 bg-white/50 hover:bg-blue-100 rounded-lg transition-all border border-blue-200"
                              title={t('edit')}
                              onClick={(e) => handleEdit(crop, e)}
                            >
                              <Pencil size={18} />
                            </button>

                            {/* Delete Button */}
                            <button 
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-100/50 rounded-lg transition-all"
                              title={t('delete')}
                              onClick={(e) => handleDelete(crop.id, e)}
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
        </div>
      </div>

      {/* FAB */}
      <button 
        onClick={() => { setEditingCrop(null); setShowForm(true); }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 bg-green-700 hover:bg-green-800 text-white rounded-2xl py-4 px-6 shadow-xl shadow-green-900/20 transition-transform hover:scale-105 active:scale-95 flex items-center gap-3 z-40"
      >
        <Plus size={24} />
        <span className="font-bold text-lg pr-1 hidden md:inline">{t('newCrop')}</span>
      </button>

      {/* Forms & Modals */}
      {showForm && (
        <CropForm 
            initialData={editingCrop} 
            onSave={handleSaveCrop} 
            onCancel={() => { setShowForm(false); setEditingCrop(null); }} 
        />
      )}

      {/* Harvest Modal Overlay - Simplified */}
      {harvestModalCrop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="bg-green-700 p-4 flex justify-between items-center text-white">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        <Tractor size={20} /> {t('harvest')}
                    </h3>
                    <button onClick={() => setHarvestModalCrop(null)} className="hover:bg-white/20 p-1 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    <p className="text-slate-600 mb-6 font-medium text-center">
                        {harvestModalCrop.name}
                    </p>
                    
                    <div className="mb-6 relative">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 text-center">
                            {t('quantity')} ({t(`unit_${harvestModalCrop.unit}` as any) || harvestModalCrop.unit})
                        </label>
                        <input 
                            type="number" 
                            className="w-full text-4xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-green-500 outline-none py-2 bg-transparent text-center"
                            autoFocus
                            placeholder="0"
                            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
                            value={harvestAmount}
                            onChange={(e) => setHarvestAmount(e.target.value)}
                        />
                        <div className="mt-2 text-xs text-slate-400 text-center">
                             {t('remainingAmount')}: <strong>{harvestModalCrop.expectedYield}</strong>
                        </div>
                    </div>

                    <button 
                        onClick={confirmHarvest}
                        disabled={!harvestAmount}
                        className="w-full py-3 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-green-900/20"
                    >
                        <Check size={18} /> {t('confirm')}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;