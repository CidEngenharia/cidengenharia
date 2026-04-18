
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LangContext } from './lib/LangContext';
import { translations, Lang } from './lib/i18n';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { Portfolio } from './pages/Portfolio';
import { Shop } from './pages/Shop';
import { Customers } from './pages/Customers';
import { DigitalCard } from './pages/DigitalCard';
import { DigitalCardOrder } from './pages/DigitalCardOrder';
import { OnlineGenerators } from './pages/OnlineGenerators';
import { QRCodeGenerator } from './pages/QRCodeGenerator';
import { CondoSmart } from './pages/CondoSmart';
import { Services } from './pages/Services';
import { Payment } from './pages/Payment';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminContentKit } from './pages/AdminContentKit';
import { AdminMusicAI } from './pages/AdminMusicAI';
import { AdminPromptAnalyzer } from './pages/AdminPromptAnalyzer';
import { AdminAudioAI } from './pages/AdminAudioAI';
import { AdminDocAnalyzer } from './pages/AdminDocAnalyzer';
import { AdminSmartScanner } from './pages/AdminSmartScanner';
import { AdminPricing } from './pages/AdminPricing';
import { AdminFinance } from './pages/AdminFinance';
import { AdminClients } from './pages/AdminClients';
import { AdminBrandKit } from './pages/AdminBrandKit';
import { ThemeToggle } from './components/ThemeToggle';

const PageWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
    className="w-full min-h-screen"
  >
    {children}
  </motion.div>
);

const App: React.FC = () => {
  const [isDark, setIsDark] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [lang, setLang] = useState<'PT' | 'EN' | 'ES'>('PT');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isAdminPage = location.pathname.startsWith('/admin');
  const isSpecialPage =
    location.pathname === '/digital-card/order' ||
    location.pathname === '/payment' ||
    location.pathname === '/generators/resume' ||
    location.pathname === '/generators/qrcode' ||
    location.pathname === '/condosmart' ||
    location.pathname.startsWith('/admin/');

  const showSidebar = !isAdminPage && !isSpecialPage;

  return (
    <LangContext.Provider value={{ lang, t: translations[lang] }}>
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#06070a] transition-colors duration-300">
      {showSidebar && (
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      )}

      <main
        className={`flex-1 transition-all duration-500 ${showSidebar
          ? (isSidebarOpen ? 'ml-64' : 'ml-20')
          : 'w-full'
          }`}
      >
        <div className="fixed top-5 right-6 z-[40] flex items-center gap-3">
          {/* Social Icons */}
          {!isAdminPage && (
            <div className="hidden xl:flex items-center gap-5 mr-8">
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mr-2">Conectar</span>
              <div className="flex items-center gap-5">
                <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E4405F] transition-all transform hover:scale-125">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m8.4 1.5a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
                </a>
                <a href="https://linkedin.com/in/sidneysales" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0A66C2] transition-all transform hover:scale-125">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
                </a>
                <a href="https://youtube.com/@cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#FF0000] transition-all transform hover:scale-125">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" /></svg>
                </a>
              </div>
            </div>
          )}

          {/* Language Selector */}
          {!isAdminPage && (
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="h-10 flex items-center gap-1.5 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all active:scale-95 text-xs font-bold"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                {lang}
                <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                  {(['PT', 'EN', 'ES'] as const).map((l) => (
                    <button
                      key={l}
                      onClick={() => { setLang(l); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold transition-colors ${
                        lang === l
                          ? 'bg-primary-500/10 text-primary-500'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span className="text-base">{l === 'PT' ? '🇧🇷' : l === 'EN' ? '🇺🇸' : '🇪🇸'}</span>
                      {l === 'PT' ? 'Português' : l === 'EN' ? 'English' : 'Español'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Admin Button */}
          {!isAdminPage && (
            <Link
              to="/admin"
              className="h-10 flex items-center gap-2 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all active:scale-95"
            >
              <span className="material-icons-outlined text-base">lock</span>
              <span className="text-[10px] font-black tracking-widest uppercase">Admin</span>
            </Link>
          )}

          {/* Theme Toggle */}
          <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
        </div>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/generators" element={<PageWrapper><OnlineGenerators /></PageWrapper>} />
            <Route path="/generators/qrcode" element={<PageWrapper><QRCodeGenerator /></PageWrapper>} />
            <Route path="/condosmart" element={<PageWrapper><CondoSmart /></PageWrapper>} />
            <Route path="/quote" element={<PageWrapper><Quote /></PageWrapper>} />
            <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
            <Route path="/customers" element={<PageWrapper><Customers /></PageWrapper>} />
            <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="/digital-card" element={<PageWrapper><DigitalCard /></PageWrapper>} />
            <Route path="/digital-card/order" element={<PageWrapper><DigitalCardOrder /></PageWrapper>} />
            <Route path="/payment" element={<PageWrapper><Payment /></PageWrapper>} />

            <Route path="/admin" element={<PageWrapper><AdminLogin /></PageWrapper>} />
            <Route path="/admin/dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
            <Route path="/admin/content-kit" element={<PageWrapper><AdminContentKit /></PageWrapper>} />
            <Route path="/admin/music-ai" element={<PageWrapper><AdminMusicAI /></PageWrapper>} />
            <Route path="/admin/prompt-analyzer" element={<PageWrapper><AdminPromptAnalyzer /></PageWrapper>} />
            <Route path="/admin/audio-ai" element={<PageWrapper><AdminAudioAI /></PageWrapper>} />
            <Route path="/admin/doc-analyzer" element={<PageWrapper><AdminDocAnalyzer /></PageWrapper>} />
            <Route path="/admin/smart-scanner" element={<PageWrapper><AdminSmartScanner /></PageWrapper>} />
            <Route path="/admin/pricing" element={<PageWrapper><AdminPricing /></PageWrapper>} />
            <Route path="/admin/finance" element={<PageWrapper><AdminFinance /></PageWrapper>} />
            <Route path="/admin/clients" element={<PageWrapper><AdminClients /></PageWrapper>} />
            <Route path="/admin/brand-kit" element={<PageWrapper><AdminBrandKit /></PageWrapper>} />
          </Routes>
        </AnimatePresence>

        {/* Global Footer */}
        {!isAdminPage && (
          <footer className="py-8 px-6 text-center border-t border-white/5 opacity-60">
            <p className="text-[9px] md:text-xs font-medium tracking-widest text-violet-400 drop-shadow-[0_0_8px_rgba(167,139,250,0.2)] lowercase">
              { "{ cidengenharia desenvolvimento ia - sidney sales }" }
            </p>
          </footer>
        )}
      </main>

      {!isAdminPage && (
        <a
          href="https://wa.me/5571984184782"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[60] w-16 h-16 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-95 group"
        >
          <svg className="w-8 h-8 fill-current drop-shadow-md" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
      )}
    </div>
    </LangContext.Provider>
  );
};

export default App;
