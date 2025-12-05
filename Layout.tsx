import React from 'react';
import { useTranslation } from './i18n';
import { Language } from './types';
import { Sprout, Globe } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ children }) => {
  const { lang, setLang } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-green-100 selection:text-green-900">
      {/* Navbar with Color */}
      <header className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/10">
               <Sprout className="text-green-100 w-6 h-6" />
             </div>
             <span className="font-bold text-xl tracking-tight text-white">Solawi<span className="text-green-200">Manager</span></span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 backdrop-blur-sm hover:bg-white/20 transition-colors cursor-pointer group">
              <Globe className="w-4 h-4 text-green-100 group-hover:text-white" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent outline-none text-green-50 font-medium text-sm cursor-pointer appearance-none pr-4"
                style={{backgroundImage: 'none'}}
              >
                <option value="de" className="text-slate-900">Deutsch</option>
                <option value="en" className="text-slate-900">English</option>
                <option value="es" className="text-slate-900">Español</option>
                <option value="fr" className="text-slate-900">Français</option>
                <option value="pt" className="text-slate-900">Português</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;