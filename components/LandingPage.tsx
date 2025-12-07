import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Language } from '../types';
import { Sprout, ChevronDown, CheckCircle, Sun, Calendar, Layout as LayoutIcon, Globe, Heart, Tractor, MapPin, Cloud, Smartphone, MessageCircle, Eye, Plus, Menu, TrendingUp } from 'lucide-react';

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

                {/* CSS ART: Farm Scene with Phone */}
                <div className="relative w-full max-w-4xl mx-auto h-[500px] md:h-[600px] bg-sky-300 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-200/50 mt-4 group">
                    
                    {/* Sky Elements */}
                    <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.6)] animate-pulse"></div>
                    <div className="absolute top-20 left-20 text-white/80 opacity-90 animate-[bounce_4s_infinite]"><Cloud size={80} fill="currentColor" /></div>
                    <div className="absolute top-32 right-1/3 text-white/60 opacity-70 animate-[pulse_5s_infinite]"><Cloud size={56} fill="currentColor" /></div>

                    {/* Hills Background */}
                    <div className="absolute bottom-[-100px] left-[-20%] w-[140%] h-[350px] bg-green-300 rounded-[100%] shadow-lg"></div>
                    <div className="absolute bottom-[-120px] right-[-10%] w-[120%] h-[300px] bg-green-400 rounded-[100%] shadow-md"></div>
                    <div className="absolute bottom-[-80px] left-0 w-full h-[200px] bg-green-600 rounded-[50%] flex items-start justify-center pt-8 shadow-inner"></div>

                    {/* The Phone (Centered) */}
                    <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 z-10 scale-[0.7] md:scale-90 origin-bottom">
                        <div className="relative w-[280px] md:w-[300px] h-[580px] bg-slate-900 rounded-[3rem] border-8 border-slate-900 shadow-2xl overflow-hidden ring-4 ring-slate-900/20">
                            
                            {/* Screen Content - pointer-events-none prevents scrolling issues on mobile */}
                            <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden flex flex-col relative pointer-events-none select-none">
                                
                                {/* Status Bar area */}
                                <div className="h-7 bg-slate-900 w-full absolute top-0 z-20 flex justify-center pointer-events-none">
                                    <div className="w-24 h-5 bg-black rounded-b-xl"></div>
                                </div>

                                {/* App Header */}
                                <div className="pt-9 pb-3 px-4 bg-gradient-to-r from-green-800 to-green-700 text-white flex justify-between items-center shrink-0 shadow-sm z-10">
                                    <div className="flex items-center gap-1.5">
                                        <div className="bg-white/10 p-1 rounded backdrop-blur-sm"><Sprout size={16} className="text-green-100"/></div>
                                        <span className="font-bold text-sm tracking-tight">Solawi<span className="text-green-200">Manager</span> <span className="text-[9px] font-normal border border-green-400/30 rounded px-1 bg-green-900/20 text-green-100">v2</span></span>
                                    </div>
                                    <Menu size={18} className="text-white opacity-80" />
                                </div>

                                {/* App Content - Overflow Hidden (Static Preview) */}
                                <div className="flex-1 p-3 space-y-3 bg-slate-50 overflow-hidden flex flex-col">
                                    
                                    {/* Weather Widget */}
                                    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-3 text-white shadow-md relative overflow-hidden shrink-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-1 text-[10px] opacity-90"><MapPin size={10}/> Berlin</div>
                                                <div className="text-3xl font-bold mt-1">22°</div>
                                            </div>
                                            <Sun className="text-yellow-300" size={24} />
                                        </div>
                                        {/* Mini Forecast Row */}
                                        <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
                                            {[0, 1, 2, 3, 4].map((i) => (
                                                <div key={i} className="flex flex-col items-center">
                                                    <span className="text-[8px] opacity-80">
                                                        {new Date(Date.now() + i * 86400000).toLocaleDateString(lang === 'de' ? 'de-DE' : lang, {weekday:'narrow'})}
                                                    </span>
                                                    <div className="h-1 w-1 rounded-full bg-white/50 my-0.5"></div>
                                                    <span className="text-[9px] font-bold">{22 - i}°</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Analytical Chart (Bars only) */}
                                    <div className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm shrink-0">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                                                <TrendingUp size={10} className="text-slate-400"/> {t('chartTitle')}
                                            </div>
                                            <div className="text-[9px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-medium">2026</div>
                                        </div>
                                        
                                        {/* Matches original dashboard color (blue-300 = #93c5fd) */}
                                        <div className="relative h-20 w-full flex items-end gap-1">
                                            {[40, 65, 45, 80, 55, 70, 60, 50, 75, 60, 45, 80].map((h, i) => (
                                                <div key={i} className="flex-1 bg-blue-300 rounded-t-[1px]" style={{height: `${h}%`}}></div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Task List (Table Preview) - Optimized Layout */}
                                    <div className="flex-1 space-y-1.5 overflow-hidden relative p-1">
                                        <div className="flex justify-between items-end mb-1 px-1">
                                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('activeCrops')}</div>
                                            {/* Removed week number text */}
                                        </div>
                                        {[
                                            { n: t('mock_pumpkin'), s: 'growing', c: 'bg-emerald-500', b: 'bg-emerald-50 text-emerald-700 border-emerald-200', i: '42' },
                                            { n: t('mock_lettuce'), s: 'harvestDue', c: 'bg-amber-500', b: 'bg-amber-50 text-amber-700 border-amber-200', i: '38' },
                                            { n: 'Tomaten', s: 'harvestOverdue', c: 'bg-red-500', b: 'bg-red-50 text-red-700 border-red-200', i: '35' },
                                            { n: 'Zucchini', s: 'growing', c: 'bg-emerald-500', b: 'bg-emerald-50 text-emerald-700 border-emerald-200', i: '45' },
                                        ].map((item, i) => (
                                            <div key={i} className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                                    {/* Status Dot */}
                                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.c}`}></div>
                                                    
                                                    {/* Name */}
                                                    <span className="font-bold text-[10px] text-slate-700 truncate">{item.n}</span>
                                                    
                                                    {/* Status Badge */}
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-md ${item.b} border font-medium truncate`}>
                                                        {t(item.s as any)}
                                                    </span>
                                                </div>
                                                
                                                {/* Week */}
                                                <div className="text-right">
                                                    <div className="font-mono text-[9px] text-slate-400 font-bold bg-slate-50 px-1 rounded">{t('weekAbbr')} {item.i}</div>
                                                </div>
                                            </div>
                                        ))}
                                        {/* Fade out effect at bottom */}
                                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none"></div>
                                    </div>
                                </div>
                                
                                {/* FAB */}
                                <div className="absolute bottom-5 right-5 bg-green-700 p-3 rounded-2xl shadow-xl text-white shadow-green-900/20">
                                    <Plus size={20} />
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