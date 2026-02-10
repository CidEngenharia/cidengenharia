import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Icon360 = () => (
  <div className="relative inline-flex items-center justify-center">
    <svg viewBox="0 0 100 100" className="w-20 h-20 md:w-28 md:h-28 drop-shadow-xl" fill="none">
      <defs>
        <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="45" stroke="url(#portfolioGradient)" strokeWidth="0.5" strokeDasharray="5 5" opacity="0.3" />
      <text x="50" y="55" textAnchor="middle" className="font-black" fontSize="24" style={{ fill: 'url(#portfolioGradient)', fontFamily: 'Space Grotesk' }}>360</text>
    </svg>
  </div>
);

export const Portfolio: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const portfolioSlides = [
    {
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      title: 'Ecossistema DyCard NFC',
      category: 'ENGENHARIA VISUAL',
      desc: 'Integração de hardware NFC com interfaces digitais de alta fidelidade.'
    },
    {
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200',
      title: 'Branding Estratégico IA',
      category: 'DESIGN & TECH',
      desc: 'Desenvolvimento de identidade visual utilizando processamento neural.'
    },
    {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
      title: 'Dashboards Industriais',
      category: 'VISUALIZAÇÃO DE DADOS',
      desc: 'Sistemas complexos de monitoramento com foco em UX/UI técnico.'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % portfolioSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [portfolioSlides.length]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-32 transition-colors duration-500 font-body">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto px-8 pt-16 pb-10 flex flex-col items-center text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Icon360 />
        </motion.div>
        <div className="space-y-1">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tight leading-none">
            Portfólio <span className="text-primary-500 italic">CidEngenharia</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs max-w-2xl mx-auto font-black uppercase tracking-[0.4em]">
            Engenharia visual e soluções inteligentes
          </p>
        </div>
      </header>

      {/* Main Project Carousel */}
      <section className="max-w-6xl mx-auto px-6 mb-20">
        <div className="relative h-[350px] md:h-[550px] rounded-[2.5rem] overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/5">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <img 
                src={portfolioSlides[currentSlide].url} 
                className="w-full h-full object-cover" 
                alt={portfolioSlides[currentSlide].title} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>
              
              <div className="absolute bottom-10 left-8 md:left-12 right-8 text-left">
                <span className="text-[9px] font-black bg-primary-500 text-white px-3 py-1 rounded-full tracking-widest mb-3 inline-block uppercase">
                  {portfolioSlides[currentSlide].category}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight mb-2">
                  {portfolioSlides[currentSlide].title}
                </h2>
                <p className="text-slate-300 text-xs md:text-base max-w-lg font-medium leading-relaxed">
                  {portfolioSlides[currentSlide].desc}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-10 right-10 flex gap-2 z-20">
            {portfolioSlides.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-primary-500' : 'w-2 bg-white/40'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Video Section - Now matching exactly the carousel size and constraints */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-8 gap-4 text-center md:text-left">
           <div className="space-y-1">
              <h3 className="text-xl md:text-3xl font-black text-slate-900 dark:text-white uppercase font-display">
                Engenharia em <span className="text-primary-500">Movimento</span>
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[9px] uppercase tracking-widest font-bold">
                Assista nossos processos e resultados técnicos
              </p>
           </div>
           <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mx-6 hidden md:block"></div>
           <div className="flex items-center gap-2 opacity-40">
             <span className="material-icons-outlined text-3xl text-primary-500">play_circle</span>
           </div>
        </div>

        <div className="relative h-[350px] md:h-[550px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-200 dark:border-white/10 group bg-slate-900">
          <div className="absolute inset-0 bg-primary-500/5 animate-pulse group-hover:opacity-0 transition-opacity pointer-events-none z-0"></div>
          <iframe 
            className="w-full h-full relative z-10"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
            title="Apresentação CidEngenharia"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-8">
        <div className="p-10 md:p-16 bg-slate-900 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl border border-white/5">
           <div className="engineering-grid absolute inset-0 opacity-10"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] animate-pulse"></div>
           
           <div className="relative z-10 text-center space-y-6">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight leading-none">
                Sua marca, nossa <br/><span className="text-primary-500 italic">Engenharia Visual</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-base max-w-lg mx-auto leading-relaxed font-light">
                Desenvolvemos projetos originais que unem a precisão técnica ao design de impacto. Vamos conversar?
              </p>
              <div className="flex justify-center pt-4">
                 <a href="https://wa.me/5571984184782" className="group flex items-center gap-3 px-10 py-4 bg-primary-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all active:scale-95">
                   Falar com Sidney Sales
                   <span className="material-icons-outlined text-sm group-hover:rotate-12 transition-transform">bolt</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

      <style>{`
        .engineering-grid {
          background-size: 30px 30px;
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};