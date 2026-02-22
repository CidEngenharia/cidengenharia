
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

  const socialLinks = {
    whatsapp: () => window.open('https://wa.me/5571984184782', '_blank'),
    instagram: () => window.open('https://instagram.com/cidengenharia', '_blank'),
    facebook: () => window.open('https://facebook.com/cididentidadevisual', '_blank'),
    linkedin: () => window.open('https://linkedin.com/in/sidneysales', '_blank'),
    youtube: () => window.open('https://youtube.com/@cidengenharia', '_blank'),
    x: () => window.open('https://x.com/cidengenharia', '_blank'),
  };

  const carouselItems = [
    {
      url: '/carousel_networking.jpg',
      title: 'Networking Inteligente',
      description: 'Ecossistema DyCard: Cartão Digital, NFC e QR Code. Segurança e conexão instantânea para o seu networking profissional.',
      category: 'INOVAÇÃO'
    },
    {
      url: '/carousel_identity.png',
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

        <div className="flex flex-wrap justify-center lg:justify-end gap-4 mb-16">
          <Link to="/services" className="px-10 py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl shadow-xl shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[10px]">
            Nossas Soluções
          </Link>
          <Link to="/portfolio" className="px-10 py-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-black rounded-2xl shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-white/5 uppercase tracking-widest text-[10px]">
            Ver Portfólio
          </Link>
        </div>

        {/* Social Icons Section - Mirroring Services Page */}
        <div className="flex flex-col items-center lg:items-end gap-6 py-2">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Nossas Redes Sociais</span>
          <div className="flex flex-wrap items-center justify-center lg:justify-end gap-8 md:gap-10">
            <button onClick={socialLinks.whatsapp} title="WhatsApp" className="text-slate-400 hover:text-[#25D366] transition-all transform hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
            </button>
            <button onClick={socialLinks.instagram} title="Instagram" className="text-slate-400 hover:text-[#E4405F] transition-all transform hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m8.4 1.5a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
            </button>
            <button onClick={socialLinks.facebook} title="Facebook" className="text-slate-400 hover:text-[#1877F2] transition-all transform hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54V9.82c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19V8.6h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" /></svg>
            </button>
            <button onClick={socialLinks.linkedin} title="LinkedIn" className="text-slate-400 hover:text-[#0A66C2] transition-all transform hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
            </button>
            <button onClick={socialLinks.youtube} title="YouTube" className="text-slate-400 hover:text-[#FF0000] transition-all transform hover:scale-125">
              <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" /></svg>
            </button>
            <button onClick={socialLinks.x} title="X" className="text-slate-400 hover:text-black dark:hover:text-white transition-all transform hover:scale-125">
              <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </button>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <section className="px-6 md:px-24 pb-32 max-w-7xl mx-auto">
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[600px] rounded-[3rem] overflow-hidden shadow-2xl group border border-slate-200 dark:border-white/10">
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
