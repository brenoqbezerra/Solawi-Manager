import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from './i18n';
import { Language } from './types';
import { Sprout, ChevronDown, Home } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  onGoHome?: () => void;
}

const Layout: React.FC<Props> = ({ children, onGoHome }) => {
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

  // Close dropdown when clicking outside
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
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-green-100 selection:text-green-900 flex flex-col">
      {/* Navbar with Color */}
      <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
             <div className="bg-white/10 p-1.5 md:p-2 rounded-lg backdrop-blur-sm border border-white/10">
               <Sprout className="text-green-100 w-5 h-5 md:w-6 md:h-6" />
             </div>
             <span className="font-bold text-lg md:text-xl tracking-tight text-white truncate flex items-center gap-1.5">
                Solawi<span className="text-green-200">Manager</span>
                <span className="text-xs font-normal border border-green-400/30 rounded px-1.5 py-0.5 bg-green-900/20 text-green-100">v2</span>
             </span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            
            {onGoHome && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm transition-all duration-200"
                title={t('backToLanding')}
              >
                <Home size={18} className="text-white" />
                <span className="hidden md:inline text-sm font-medium text-white">{t('backToLanding')}</span>
              </button>
            )}

            {/* Custom Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button 
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg pl-3 pr-2 py-1.5 backdrop-blur-sm transition-all duration-200"
                >
                    <span className="text-lg leading-none">{currentLang.flag}</span>
                    <span className="hidden md:inline text-sm font-medium text-white">{currentLang.label}</span>
                    <ChevronDown size={14} className={`text-green-100 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
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
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer - Left aligned on mobile to avoid FAB overlap */}
      <footer className="bg-green-100 border-t border-green-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-left md:text-center text-slate-500 text-sm flex flex-col items-start md:items-center gap-1">
            <p>{t('developedBy')} <a href="https://www.linkedin.com/in/brenoqbezerra/" target="_blank" rel="noreferrer" className="font-semibold text-slate-700 hover:text-green-700 underline">Breno Bezerra</a></p>
            <a href="mailto:bqbreno@gmail.com" className="hover:text-green-700 transition-colors font-medium text-slate-600">bqbreno@gmail.com</a>
        </div>
      </footer>
    </div>
  );
};

export default Layout;