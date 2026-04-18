
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../lib/LangContext';

const AntigravityCursor = () => (
  <div className="relative inline-flex items-center justify-center h-full" style={{ width: '14px' }}>
    {/* Outer glow halo — pulses continuously */}
    <motion.div
      className="absolute rounded-full pointer-events-none"
      animate={{ opacity: [0.3, 0.75, 0.3], scaleX: [1, 2, 1], scaleY: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        inset: '-4px -8px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.2) 60%, transparent 100%)',
        filter: 'blur(8px)',
      }}
    />
    {/* Cursor bar — blinks like a real text caret */}
    <motion.svg
      viewBox="0 0 8 56"
      className="relative h-full w-auto"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        times: [0, 0.45, 0.5, 0.95],
        ease: 'linear',
      }}
    >
      <defs>
        <linearGradient id="cursorRainbow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="30%"  stopColor="#22c55e" />
          <stop offset="60%"  stopColor="#eab308" />
          <stop offset="82%"  stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="cursorGlow" x="-100%" y="-5%" width="300%" height="110%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="1.5" y="1" width="5" height="54" rx="2.5" ry="2.5"
        fill="url(#cursorRainbow)"
        filter="url(#cursorGlow)"
      />
      <rect x="2.2" y="2" width="1.8" height="24" rx="1"
        fill="white" opacity="0.28"
      />
    </motion.svg>
  </div>
);


const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let timeout: any;
    let currentIndex = 0;
    
    const startTimeout = setTimeout(() => {
      const type = () => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
          timeout = setTimeout(type, 100);
        }
      };
      type();
    }, delay * 1000);
    
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay]);
  
  return (
    <span className="text-slate-700 dark:text-white transition-colors duration-500">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[0.9em] bg-violet-400 ml-1 align-bottom"
      />
    </span>
  );
};

const Stats = () => {
  const stats = [
    { number: "20x", text: "Resultados mais rápidos do que com o desenvolvimento convencional.", gradient: "from-[#4f46e5] to-[#7c3aed]" },
    { number: "+80", text: "Horas de economia de trabalhos manuais.", gradient: "from-[#ec4899] to-[#db2777]" },
    { number: "10x", text: "Mais produtos testados diariamente", gradient: "from-[#0ea5e9] to-[#2563eb]" },
    { number: "-R$", text: "Economize +R$ em custos com desenvolvimento. Tire a idéia do papel.", gradient: "from-[#10b981] to-[#059669]" },
  ];

  return (
    <div className="mb-20">
      <motion.p 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#fbbf24] mb-8 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]"
      >
        Seus projetos com...
      </motion.p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-1"
          >
            <span className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${stat.gradient} tracking-tighter drop-shadow-sm`}>
              {stat.number}
            </span>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight max-w-[200px] opacity-80">
              {stat.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const DraftForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    projectName: '',
    budget: '',
    layoutIdeas: '',
    details: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Olá Sidney! Gostaria de fazer um rascunho de projeto:%0A%0A` +
      `*Nome:* ${formData.name}%0A` +
      `*WhatsApp:* ${formData.whatsapp}%0A` +
      `*Projeto:* ${formData.projectName}%0A` +
      `*Orçamento:* ${formData.budget}%0A` +
      `*Ideias de Layout:* ${formData.layoutIdeas}%0A` +
      `*Detalhes:* ${formData.details}`;
    
    window.open(`https://wa.me/5571984184782?text=${message}`, '_blank');
    setSubmitted(true);
  };

  return (
    <section className="py-24 px-6 md:px-24 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-[#fbbf24] uppercase tracking-tighter mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-colors duration-500">
          Vamos fazer um rascunho?
        </h2>
        <div className="w-24 h-1 bg-slate-400 dark:bg-[#fbbf24] mx-auto rounded-full opacity-50 transition-colors duration-500"></div>
      </div>

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl"
          >
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Qual seu nome?</label>
              <input 
                required
                type="text" 
                placeholder="Seu nome completo"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Qual seu WhatsApp?</label>
              <input 
                required
                type="tel" 
                placeholder="(00) 00000-0000"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.whatsapp}
                onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Qual nome do seu projeto?</label>
              <input 
                required
                type="text" 
                placeholder="Ex: App de Delivery"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.projectName}
                onChange={e => setFormData({...formData, projectName: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Até quanto deseja gastar?</label>
              <input 
                required
                type="text" 
                placeholder="Seu orçamento estimado"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.budget}
                onChange={e => setFormData({...formData, budget: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Já tem alguma ideia do layout?</label>
              <input 
                type="text" 
                placeholder="Cores, referências, estilo..."
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                value={formData.layoutIdeas}
                onChange={e => setFormData({...formData, layoutIdeas: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#fbbf24] ml-2">Descreva detalhes do projeto</label>
              <textarea 
                required
                rows={4}
                placeholder="Conte-nos um pouco mais sobre sua ideia..."
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/5 rounded-2xl px-6 py-4 text-slate-900 dark:text-white focus:outline-none focus:border-[#fbbf24]/50 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                value={formData.details}
                onChange={e => setFormData({...formData, details: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit"
                className="w-full py-5 bg-[#fbbf24] hover:bg-[#f59e0b] text-slate-950 font-black rounded-2xl uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_15px_30px_rgba(251,191,36,0.2)] flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                Enviar Rascunho
              </button>
            </div>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500/10 border border-emerald-500/20 p-12 rounded-[2.5rem] text-center backdrop-blur-xl"
          >
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter">Mensagem enviada com sucesso!</h3>
            <p className="text-emerald-400 font-medium">Em breve entraremos em contato.</p>
            <button 
              onClick={() => setSubmitted(false)}
              className="mt-8 text-white/40 hover:text-white underline text-xs font-bold uppercase tracking-widest"
            >
              Enviar outro rascunho
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLang();

  // Enhanced Background bubbles configuration - more visible
  const bgBubbles = [
    { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(109,40,217,0.4)', delay: 0, duration: 8 },
    { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(37,99,235,0.3)', delay: 2, duration: 12 },
    { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(139,92,246,0.35)', delay: 1, duration: 10 },
    { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(79,70,229,0.3)', delay: 3, duration: 15 },
    { size: 'w-[20%] h-[20%]', pos: 'top-[45%] right-[25%]', color: 'rgba(99,102,241,0.25)', delay: 5, duration: 18 },
    { size: 'w-[22%] h-[22%]', pos: 'bottom-[45%] left-[15%]', color: 'rgba(167,139,250,0.35)', delay: 4, duration: 14 },
    { size: 'w-[28%] h-[28%]', pos: 'top-[15%] left-[35%]', color: 'rgba(30,58,138,0.4)', delay: 6, duration: 20 },
  ];

  const carouselItems = [
    ...t.carouselTitles.map((title, i) => ({
      url: [
        '/carousel_networking.jpg',
        '/carousel_identity.png',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        '/branding.png'
      ][i],
      title,
      description: t.carouselDescs[i],
      category: t.carouselCategories[i],
      type: 'image'
    })),
    {
      url: '/assistente_ia_.mp4',
      title: 'Automação de processos',
      description: 'Integração de assistentes inteligentes para otimização de fluxos e atendimento em alta performance.',
      category: 'INTELIGÊNCIA ARTIFICIAL',
      type: 'video'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 7000); // Slightly longer for better reading
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#080a12] transition-colors duration-500 font-body">

      {/* ===== ANIMATED BACKGROUND - Scattered Bubbles ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {bgBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.4, 0.8, 0.4],
              x: [0, Math.sin(i * 15) * 60, 0],
              y: [0, Math.cos(i * 15) * 40, 0]
            }}
            transition={{ 
              duration: bubble.duration, 
              repeat: Infinity, 
              ease: 'easeInOut', 
              delay: bubble.delay 
            }}
            className={`absolute ${bubble.size} ${bubble.pos} rounded-full`}
            style={{
              background: `radial-gradient(circle, ${bubble.color} 0%, transparent 85%)`,
              filter: 'blur(70px)',
              mixBlendMode: 'plus-lighter'
            }}
          />
        ))}
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="flex flex-col items-center lg:items-start justify-center px-6 md:px-24 py-20 md:py-32 min-h-[85vh] max-w-7xl mx-auto relative z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {t.badge}
        </motion.div>

        {/* Logo + Brand Name + Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col xl:flex-row items-center xl:items-baseline gap-x-2 mb-4 text-center xl:text-left"
        >
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-5xl font-black tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#6366f1] pb-1">
            {t.brand}
          </h2>
          <div className="text-5xl sm:text-6xl md:text-7xl lg:text-5xl font-normal tracking-tighter leading-none mt-2 xl:mt-0">
             <TypewriterText text=", e ai vamos codar?" delay={1} />
          </div>
        </motion.div>

        {/* MAIN HERO TEXT — "Fábrica Dev" destaque como "O ouro da IA" no au4.ai */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
            <span className="text-[#fbbf24] drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              {t.heroTitle}
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-bold leading-relaxed mb-10"
        >
          {t.heroDesc}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mb-14"
        >
          <Link
            to="/services"
            className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-black rounded-xl shadow-lg shadow-violet-600/30 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px]"
          >
            {t.ctaSolutions}
          </Link>
          <Link
            to="/portfolio"
            className="px-8 py-4 bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-black rounded-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px] backdrop-blur-sm"
          >
            {t.ctaPortfolio}
          </Link>
        </motion.div>
      </section>

      {/* ===== CAROUSEL SECTION ===== */}
      <section className="px-6 md:px-24 pb-16 max-w-7xl mx-auto relative z-10">
        {/* Stats Section added above Carousel */}
        <Stats />

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group border border-white/5">
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {carouselItems[currentSlide].type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-105 group-hover:scale-110"
                >
                  <source src={carouselItems[currentSlide].url} type="video/mp4" />
                </video>
              ) : (
                <img src={carouselItems[currentSlide].url} className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-105 group-hover:scale-110" alt={carouselItems[currentSlide].title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

              <div className="absolute bottom-12 left-12 right-12 text-left">
                <span className="text-[10px] font-black bg-violet-600 text-white px-4 py-1.5 rounded-full tracking-widest mb-4 inline-block uppercase">
                  {carouselItems[currentSlide].category}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight mb-2 drop-shadow-lg">
                  {carouselItems[currentSlide].title}
                </h2>
                <p className="text-white/80 text-xs md:text-base max-w-xl font-normal drop-shadow-md">
                  {carouselItems[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-20 pointer-events-none">
            <button 
              onClick={prevSlide}
              className="flex items-center justify-center text-[#fbbf24] transition-all pointer-events-auto active:scale-95 opacity-0 md:opacity-100 group-hover:scale-125"
            >
              <span className="material-icons-outlined text-4xl">chevron_left</span>
            </button>
            <button 
              onClick={nextSlide}
              className="flex items-center justify-center text-[#fbbf24] transition-all pointer-events-auto active:scale-95 opacity-0 md:opacity-100 group-hover:scale-125"
            >
              <span className="material-icons-outlined text-4xl">chevron_right</span>
            </button>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-[#fbbf24]' : 'w-2 bg-white/40'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DRAFT FORM SECTION ===== */}
      <DraftForm />
      
      <div className="pb-24"></div>
    </div>
  );
};
