import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Language } from '../types';
import { Sprout, ChevronDown, CheckCircle, Sun, Calendar, Layout as LayoutIcon, Globe, Heart } from 'lucide-react';

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
                        href="https://github.com/bqbreno/solawi-manager-v2" // Placeholder link or real if available
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold text-lg py-4 px-8 rounded-xl border border-slate-200 shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                        {t('lp_cta_github')}
                    </a>
                </div>

                {/* Simulated Dashboard UI (CSS populated) - Replacing the "Blank" dashboard */}
                <div className="relative w-full max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                        {/* Fake Header */}
                        <div className="h-12 bg-white border-b border-slate-100 flex items-center px-6 gap-4">
                            <div className="w-20 h-4 bg-slate-100 rounded animate-pulse"></div>
                            <div className="flex-1"></div>
                            <div className="w-8 h-8 bg-green-100 rounded-full"></div>
                        </div>
                        
                        <div className="p-6 bg-slate-50/50 space-y-6">
                            {/* KPI Row */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">12</div>
                                    <div className="h-2 w-24 bg-slate-100 rounded"></div>
                                </div>
                                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">3</div>
                                    <div className="h-2 w-24 bg-amber-200/50 rounded"></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">85</div>
                                    <div className="h-2 w-24 bg-slate-100 rounded"></div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Simulated Chart */}
                                <div className="col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm h-64 flex flex-col justify-end gap-2">
                                     <div className="flex items-end justify-between gap-2 h-40">
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[40%]"></div>
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[60%]"></div>
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[30%]"></div>
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[80%]"></div>
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[50%]"></div>
                                        <div className="w-full bg-blue-200 rounded-t-sm h-[90%]"></div>
                                     </div>
                                     <div className="w-full h-1 bg-slate-100 mt-2"></div>
                                </div>
                                
                                {/* Simulated List */}
                                <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="flex items-center gap-3 p-2 border-b border-slate-50 last:border-0">
                                            <div className="w-8 h-8 bg-slate-100 rounded-full"></div>
                                            <div className="flex-1 space-y-1">
                                                <div className="h-2 w-20 bg-slate-100 rounded"></div>
                                                <div className="h-2 w-12 bg-slate-50 rounded"></div>
                                            </div>
                                        </div>
                                    ))}
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
                        { icon: LayoutIcon, text: t('lp_feat_dashboard') },
                        { icon: Calendar, text: t('lp_feat_kw') },
                        { icon: CheckCircle, text: t('lp_feat_harvest') },
                        { icon: Sun, text: t('lp_feat_weather') },
                        { icon: Globe, text: t('lp_feat_responsive') },
                        { icon: Globe, text: t('lp_global_reach') },
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
                    {t('developedBy')} <a href="mailto:bqbreno@gmail.com" className="hover:text-green-700 underline">Breno Bezerra</a>
                </p>
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