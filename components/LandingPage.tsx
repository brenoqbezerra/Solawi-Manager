import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Language } from '../types';
import { Sprout, ChevronDown, CheckCircle, Sun, Calendar, Layout as LayoutIcon, Globe, Heart, Tractor, Pencil, Trash2, MapPin, Cloud, CloudRain, TrendingUp, Wind, Smartphone, MessageCircle, Eye } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  const { lang, setLang, t } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' }
  ];

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-green-100 selection:text-green-900 flex flex-col">
      
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="bg-green-100 p-2 rounded-lg text-green-700">
               <Sprout size={24} />
             </div>
             <span className="font-bold text-xl tracking-tight text-slate-900">Solawi<span className="text-green-600">Manager</span> <span className="text-xs text-slate-400 font-normal border border-slate-200 rounded px-1 ml-1">v2</span></span>
          </div>

          <div className="flex items-center gap-4">
             {/* Language Dropdown */}
             <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg pl-3 pr-2 py-1.5 transition-all"
                >
                    <span className="text-lg leading-none">{currentLang.flag}</span>
                    <span className="hidden md:inline text-sm font-medium text-slate-600">{currentLang.label}</span>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                    <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                        <ul className="py-1">
                            {languages.map((l) => (
                                <li key={l.code}>
                                    <button 
                                        onClick={() => {
                                            setLang(l.code as Language);
                                            setIsLangOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 hover:bg-slate-50 transition-colors
                                            ${lang === l.code ? 'bg-green-50 text-green-700 font-semibold' : 'text-slate-700'}
                                        `}
                                    >
                                        <span className="text-lg">{l.flag}</span>
                                        {l.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            
            <button 
                onClick={onStart}
                className="hidden md:flex bg-green-700 hover:bg-green-800 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition-colors"
            >
                {t('lp_cta_start')}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        
        {/* Hero Section */}
        <section className="relative pt-20 pb-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-100/40 via-slate-50 to-slate-50"></div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-6 border border-green-100">
                    <Globe size={12} /> {t('lp_global_reach').split('—')[0]}
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6 max-w-4xl">
                    {t('lp_hero_title')}
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 leading-relaxed">
                    {t('lp_hero_subtitle')}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full justify-center mb-16">
                    <button 
                        onClick={onStart}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl shadow-green-900/10 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                    >
                        <LayoutIcon size={20} />
                        {t('lp_cta_start')}
                    </button>
                    <a 
                        href="https://github.com/brenoqbezerra/Solawi-Manager" 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg py-4 px-8 rounded-xl border border-slate-200 shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {t('lp_cta_github')}
                    </a>
                </div>

                {/* Simulated Dashboard UI - Realistic Preview */}
                <div className="relative w-full max-w-5xl mx-auto">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden text-left transform md:rotate-1 hover:rotate-0 transition-transform duration-500">
                        {/* Fake Header */}
                        <div className="h-14 bg-gradient-to-r from-green-800 to-green-700 flex items-center px-4 md:px-6 justify-between">
                            <div className="flex items-center gap-2">
                                <div className="bg-white/10 p-1.5 rounded-lg">
                                    <Sprout size={20} className="text-green-100" />
                                </div>
                                <span className="text-white font-bold tracking-tight">Solawi<span className="text-green-200">Manager</span> <span className="text-xs font-normal border border-green-400/30 rounded px-1.5 py-0.5 bg-green-900/20 text-green-100">v2</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="hidden md:flex bg-white/10 px-3 py-1 rounded text-xs text-white items-center gap-2">
                                    <span>{currentLang.flag} {currentLang.label}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-4 md:p-6 bg-slate-50 space-y-4 md:space-y-6">
                            
                            {/* Simulated Weather Widget - Replicates Real System */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-4 md:p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-end gap-4 relative overflow-hidden">
                                {/* Left Side: Current */}
                                <div className="flex flex-row md:flex-col justify-between items-center md:items-start w-full md:w-auto z-10">
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-1 opacity-90 text-sm">
                                            <MapPin size={14} /> Berlin
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl md:text-6xl font-bold tracking-tighter">18°</span>
                                            <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                                                <Sun className="text-yellow-400 w-8 h-8 md:w-10 md:h-10" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs md:text-sm text-blue-100 bg-white/10 px-2 py-1 rounded-lg mt-0 md:mt-2">
                                        <Wind className="w-3.5 h-3.5" />
                                        <span>12 km/h</span>
                                    </div>
                                </div>
                                
                                {/* Right Side: Forecast (Scrollable on Mobile) */}
                                <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide z-10">
                                    <div className="flex gap-2 min-w-max">
                                        {[
                                            { d: t('today'), tH: '18°', tL: '10°', i: Sun, c: 'text-yellow-400', today: true },
                                            { d: '+1', tH: '20°', tL: '12°', i: Cloud, c: 'text-blue-100', today: false },
                                            { d: '+2', tH: '19°', tL: '11°', i: CloudRain, c: 'text-blue-300', today: false },
                                            { d: '+3', tH: '22°', tL: '14°', i: Sun, c: 'text-yellow-400', today: false },
                                            { d: '+4', tH: '21°', tL: '13°', i: Cloud, c: 'text-slate-300', today: false }
                                        ].map((day, idx) => (
                                            <div key={idx} className={`flex flex-col items-center justify-between bg-white/10 border ${day.today ? 'border-yellow-400/50 bg-white/20' : 'border-white/5'} rounded-lg p-2 backdrop-blur-sm h-32 w-16 md:w-20 flex-shrink-0`}>
                                                <span className="text-[10px] md:text-xs font-semibold uppercase opacity-90">{day.d}</span>
                                                <day.i size={24} className={`my-1 ${day.c}`} />
                                                <div className="flex flex-col items-center w-full gap-0.5">
                                                    <span className="text-xs md:text-sm font-bold">{day.tH}</span>
                                                    <div className="w-full h-[1px] bg-white/20 my-0.5 block"></div>
                                                    <span className="text-[10px] opacity-75">{day.tL}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                             {/* Simulated Chart (Planned vs Realized) */}
                            <div className="bg-white rounded-xl border border-slate-200 p-4 md:p-6" style={{ minHeight: '300px' }}>
                                <div className="flex justify-between items-center mb-6">
                                     <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <TrendingUp size={18} className="text-slate-400"/>
                                        {t('chartTitle')}
                                     </h3>
                                     <div className="bg-slate-50 border px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-600 flex items-center gap-2">
                                        <Calendar size={14} className="text-slate-400"/> 2026
                                     </div>
                                </div>
                                <div className="relative h-48 w-full flex items-end justify-between gap-1 md:gap-2 px-2 overflow-hidden">
                                    {/* Grid Lines */}
                                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-30">
                                        <div className="border-t border-slate-200 w-full h-full"></div>
                                        <div className="border-t border-slate-200 w-full h-full"></div>
                                        <div className="border-t border-slate-200 w-full h-full"></div>
                                    </div>

                                    {[
                                        { p: 40 }, { p: 60 }, { p: 30 }, 
                                        { p: 80 }, { p: 50 }, { p: 70 }, 
                                        { p: 90 }, { p: 60 }, { p: 40 }, 
                                        { p: 20 }, { p: 10 }, { p: 5 }
                                    ].map((val, i) => {
                                        // Dynamic Month Name based on Language
                                        const monthName = new Date(2024, i, 1).toLocaleString(lang === 'de' ? 'de-DE' : lang, { month: 'short' });
                                        return (
                                            <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
                                                {/* Bar Container */}
                                                <div className="relative w-full h-full flex items-end">
                                                    {/* Bar (Planned) */}
                                                    <div className="w-full bg-blue-300 rounded-t-sm transition-all duration-500 hover:opacity-80 mx-auto" style={{ height: `${val.p}%` }}></div>
                                                </div>
                                                
                                                {/* Month Label - Properly Aligned Below */}
                                                <div className="text-[8px] md:text-[10px] text-slate-400 uppercase font-bold text-center mt-2 truncate w-full overflow-hidden">
                                                    {monthName}
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* KPI Row */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                <div className="bg-green-50 p-3 md:p-4 rounded-xl border border-green-200/60 flex flex-col items-center justify-center gap-1 h-32">
                                    <span className="text-[10px] font-bold text-green-600 uppercase text-center">{t('inProgress')}</span>
                                    <span className="text-3xl font-bold text-green-700">12</span>
                                </div>
                                <div className="bg-amber-50 p-3 md:p-4 rounded-xl border border-amber-200/60 flex flex-col items-center justify-center gap-1 h-32">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase text-center">{t('harvestThisWeek')}</span>
                                    <span className="text-3xl font-bold text-amber-700">3</span>
                                </div>
                                <div className="bg-red-50 p-3 md:p-4 rounded-xl border border-red-200/60 flex flex-col items-center justify-center gap-1 h-32">
                                    <span className="text-[10px] font-bold text-red-600 uppercase text-center">{t('harvestOverdue')}</span>
                                    <span className="text-3xl font-bold text-red-700">1</span>
                                </div>
                                <div className="bg-blue-50 p-3 md:p-4 rounded-xl border border-blue-200/60 flex flex-col items-center justify-center gap-1 h-32">
                                    <span className="text-[10px] font-bold text-blue-600 uppercase text-center">{t('harvested')}</span>
                                    <span className="text-3xl font-bold text-blue-700">45</span>
                                </div>
                            </div>

                            {/* Fake Table */}
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100 text-xs text-slate-500 uppercase font-bold text-center">
                                            <tr>
                                                <th className="px-4 py-3 text-left">{t('culture')}</th>
                                                <th className="px-4 py-3">{t('status')}</th>
                                                <th className="px-4 py-3 hidden md:table-cell">{t('location')}</th>
                                                <th className="px-4 py-3">{t('harvestWeek')}</th>
                                                <th className="px-4 py-3">{t('actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {/* Row 1: Active */}
                                            <tr className="hover:bg-slate-50/50">
                                                <td className="px-4 py-3 text-center border-r border-slate-50/50">
                                                    <div className="font-semibold text-slate-800 text-left">{t('mock_pumpkin')}</div>
                                                    <div className="text-xs text-slate-500 text-left">Hokkaido</div>
                                                </td>
                                                <td className="px-4 py-3 text-center border-r border-slate-50/50">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-200 ring-1 ring-green-500/20 whitespace-normal min-w-[90px] inline-block">{t('growing')}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center hidden md:table-cell text-slate-500 border-r border-slate-50/50">{t('field')} 2</td>
                                                <td className="px-4 py-3 text-center font-mono text-slate-600 border-r border-slate-50/50">
                                                    KW 42 <span className="text-xs text-slate-400 block font-sans">150 kg</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2 opacity-50">
                                                        <div className="p-1.5 bg-slate-100 rounded"><Tractor size={14}/></div>
                                                        <div className="p-1.5 bg-slate-100 rounded"><Pencil size={14}/></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Row 2: Warning */}
                                            <tr className="bg-amber-50 hover:bg-amber-100">
                                                <td className="px-4 py-3 text-center border-r border-slate-50/50">
                                                    <div className="font-semibold text-slate-800 text-left">{t('mock_lettuce')}</div>
                                                    <div className="text-xs text-slate-500 text-left">Lollo Rosso</div>
                                                </td>
                                                <td className="px-4 py-3 text-center border-r border-slate-50/50">
                                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 ring-1 ring-amber-500/20 whitespace-normal min-w-[90px] inline-block">{t('harvestDue')}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center hidden md:table-cell text-slate-500 border-r border-slate-50/50">{t('tunnel')} 1</td>
                                                <td className="px-4 py-3 text-center font-mono text-slate-600 border-r border-slate-50/50">
                                                    KW 38 <span className="text-xs text-slate-400 block font-sans">80 {t('unit_units')}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-2 opacity-50">
                                                        <div className="p-1.5 bg-slate-100 rounded"><Tractor size={14}/></div>
                                                        <div className="p-1.5 bg-slate-100 rounded"><Pencil size={14}/></div>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Story Section - Emotional/Ethical Core */}
        <section className="py-20 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-serif md:text-4xl font-bold text-slate-900 mb-6 italic">
                        „{t('lp_story_title')}“
                    </h2>
                    <div className="w-24 h-1 bg-green-600 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-12 text-lg text-slate-700 leading-relaxed">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 md:w-1/2">
                            <p className="mb-4 font-medium text-slate-900">📍 Wandelgrund, Dresden</p>
                            <p>{t('lp_story_wandel')}</p>
                        </div>
                        <div className="md:w-1/2 md:mt-12">
                             <p className="italic text-slate-500 border-l-4 border-green-200 pl-4">
                                {t('lp_story_wirgarten')}
                             </p>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-3xl p-8 md:p-12 text-center">
                        <p className="font-medium text-green-900 mb-4">{t('lp_story_mvp')}</p>
                        <div className="flex justify-center items-center gap-3 text-sm text-green-700 opacity-80 mt-4">
                           <Heart size={16} fill="currentColor" />
                           <span>{t('developedBy')} <a href="https://www.linkedin.com/in/brenoqbezerra/" target="_blank" rel="noreferrer" className="underline hover:text-green-900">Breno Bezerra</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Features List */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        { icon: Eye, text: t('lp_feat_dashboard') },
                        { icon: CheckCircle, text: t('lp_feat_harvest') },
                        { icon: Calendar, text: t('lp_feat_kw') },
                        { icon: Sun, text: t('lp_feat_weather') },
                        { icon: Smartphone, text: t('lp_feat_responsive') },
                        { icon: MessageCircle, text: t('lp_feat_lang') },
                    ].map((feat, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-green-100 p-2 rounded-lg text-green-700 shrink-0">
                                <feat.icon size={20} />
                            </div>
                            <p className="font-medium text-slate-700">{feat.text}</p>
                        </div>
                    ))}
                 </div>
                 
                 <div className="mt-16 text-center">
                    <button 
                        onClick={onStart}
                        className="bg-green-700 hover:bg-green-800 text-white font-bold text-lg py-4 px-12 rounded-full shadow-xl transition-all hover:scale-105 active:scale-95"
                    >
                        {t('lp_start_now')}
                    </button>
                 </div>
            </div>
        </section>

      </main>

      {/* Landing Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <span className="font-bold text-slate-900">Solawi<span className="text-green-600">Manager</span></span>
                <p className="text-sm text-slate-500 mt-1">
                    {t('developedBy')} <a href="https://www.linkedin.com/in/brenoqbezerra/" target="_blank" rel="noreferrer" className="hover:text-green-700 underline font-medium">Breno Bezerra</a>
                </p>
                <a href="mailto:bqbreno@gmail.com" className="text-xs text-slate-400 hover:text-green-600 mt-0.5 block">bqbreno@gmail.com</a>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-6 text-sm text-slate-500">
                <span className="font-medium text-slate-900">{t('lp_footer_links')}</span>
                <a href="https://wandelgrund.org/" target="_blank" rel="noreferrer" className="hover:text-green-700 transition-colors">Wandelgrund</a>
                <a href="https://www.wirgarten.com/" target="_blank" rel="noreferrer" className="hover:text-green-700 transition-colors">WirGarten</a>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;