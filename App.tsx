import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Quote } from './pages/Quote';
import { Portfolio } from './pages/Portfolio';
import { Shop } from './pages/Shop';
import { Customers } from './pages/Customers';
import { DigitalCard } from './pages/DigitalCard';
import { DigitalCardOrder } from './pages/DigitalCardOrder';
import { OnlineGenerators } from './pages/OnlineGenerators';
import { ResumeGenerator } from './pages/ResumeGenerator';
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
import { VirtualEngineer } from './pages/VirtualEngineer';
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
  const location = useLocation();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const isSpecialPage = 
    location.pathname === '/digital-card/order' ||
    location.pathname === '/payment' ||
    location.pathname === '/admin' ||
    location.pathname === '/generators/resume' ||
    location.pathname === '/condosmart' ||
    location.pathname.startsWith('/admin/');

  const showSidebar = !location.pathname.startsWith('/admin') && !isSpecialPage;

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-300">
      {showSidebar && <Sidebar />}
      
      <main className={`flex-1 transition-all duration-500 ${showSidebar ? 'ml-20' : 'w-full'}`}>
        <div className="fixed top-6 right-8 z-[40]">
           <ThemeToggle isDark={isDark} toggle={() => setIsDark(!isDark)} />
        </div>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/services" element={<PageWrapper><Services /></PageWrapper>} />
            <Route path="/generators" element={<PageWrapper><OnlineGenerators /></PageWrapper>} />
            <Route path="/generators/resume" element={<PageWrapper><ResumeGenerator /></PageWrapper>} />
            <Route path="/condosmart" element={<PageWrapper><CondoSmart /></PageWrapper>} />
            <Route path="/quote" element={<PageWrapper><Quote /></PageWrapper>} />
            <Route path="/portfolio" element={<PageWrapper><Portfolio /></PageWrapper>} />
            <Route path="/customers" element={<PageWrapper><Customers /></PageWrapper>} />
            <Route path="/shop" element={<PageWrapper><Shop /></PageWrapper>} />
            <Route path="/digital-card" element={<PageWrapper><DigitalCard /></PageWrapper>} />
            <Route path="/digital-card/order" element={<PageWrapper><DigitalCardOrder /></PageWrapper>} />
            <Route path="/payment" element={<PageWrapper><Payment /></PageWrapper>} />
            <Route path="/virtual-engineer" element={<PageWrapper><VirtualEngineer /></PageWrapper>} />
            
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
      </main>

      {!location.pathname.startsWith('/admin') && (
        <a 
          href="https://wa.me/5571984184782" 
          target="_blank" 
          rel="noopener noreferrer"
          className="fixed bottom-8 right-8 z-[60] w-16 h-16 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-[0_20px_50px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-95 group"
        >
          <svg className="w-8 h-8 fill-current drop-shadow-md" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

export default App;