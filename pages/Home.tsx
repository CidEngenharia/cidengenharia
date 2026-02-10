import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Icon360 = () => (
  <div className="relative inline-flex items-center justify-center align-middle">
    <svg 
      viewBox="0 0 100 100" 
      className="w-16 sm:w-20 md:w-24 h-auto drop-shadow-xl"
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="brandGradientHome" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#34d399" />
        </linearGradient>
      </defs>
      <path d="M50,15 C62,15 62,85 50,85 C38,85 38,15 50,15" stroke="url(#brandGradientHome)" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
      <path d="M15,50 C15,38 85,38 85,50 C85,62 15,62 15,50" stroke="url(#brandGradientHome)" strokeWidth="2.5" strokeLinecap="round" />
      <text x="50" y="56" textAnchor="middle" className="font-black" fontSize="24" style={{ fill: 'url(#brandGradientHome)', fontFamily: 'Space Grotesk, sans-serif' }}>360</text>
      <circle cx="74" cy="42" r="3" stroke="url(#brandGradientHome)" strokeWidth="1.5" />
    </svg>
  </div>
);

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselItems = [
    { 
      url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200', 
      title: 'Networking Inteligente', 
      description: 'Ecossistema DyCard: Cartão Digital, NFC e QR Code. Segurança e conexão instantânea para o seu networking profissional.',
      category: 'INOVAÇÃO' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1200', 
      title: 'Identidade Visual & IA', 
      description: 'Transformação de branding utilizando engenharia visual aplicada e inteligência artificial generativa de última geração.',
      category: 'DESIGN' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200', 
      title: 'Engenharia de Dados', 
      description: 'Visualização complexa e dashboards estratégicos para tomada de decisão baseada em métricas de alta fidelidade.',
      category: 'TECNOLOGIA' 
    },
    { 
      url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200', 
      title: 'Studio de Criação', 
      description: 'Espaço físico e digital dedicado à manufatura técnica de peças em fibra, metal e soluções em comunicação visual premium.',
      category: 'PRODUÇÃO' 
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % carouselItems.length), 6000);
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 font-body">
      <div className="absolute top-0 right-0 w-full max-w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px] -z-10"></div>

      <section className="flex flex-col items-center lg:items-end justify-center px-6 md:px-24 py-20 md:py-32 text-center lg:text-right min-h-[85vh] max-w-7xl mx-auto relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-primary-500 mb-10 shadow-sm"
        >
          Studio de Engenharia Visual Premium
        </motion.div>

        <div className="flex flex-col items-center lg:items-end mb-10">
          <div className="flex flex-col sm:flex-row items-center gap-6 md:gap-10 mb-4">
            <Icon360 />
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter leading-none font-display text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#34d399] transition-all duration-500">
              CidEngenharia
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-primary-500/50"></div>
            <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm tracking-[0.2em] font-medium uppercase">
              Observando todos os aspectos da engenharia
            </p>
          </div>
        </div>

        <p className="text-lg md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl font-light leading-relaxed mb-12">
          A união perfeita entre precisão técnica e visão estratégica para o seu negócio.
        </p>

        <div className="flex flex-wrap justify-center lg:justify-end gap-4">
          <Link to="/services" className="px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]">
            Nossas Soluções
          </Link>
          <Link to="/portfolio" className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black rounded-2xl shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-white/5 uppercase tracking-widest text-[10px]">
            Ver Portfólio
          </Link>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="px-6 md:px-24 pb-32 max-w-7xl mx-auto">
        <div className="relative w-full h-[400px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group">
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <img src={carouselItems[currentSlide].url} className="w-full h-full object-cover" alt={carouselItems[currentSlide].title} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-12 left-12 right-12 text-left">
                <span className="text-[10px] font-black bg-primary-500 text-white px-4 py-1.5 rounded-full tracking-widest mb-4 inline-block uppercase">
                  {carouselItems[currentSlide].category}
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase font-display tracking-tight mb-2">
                  {carouselItems[currentSlide].title}
                </h2>
                <p className="text-slate-300 text-sm md:text-lg max-w-xl font-medium">
                  {carouselItems[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 right-12 flex gap-2">
            {carouselItems.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-primary-500' : 'w-2 bg-white/40'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};