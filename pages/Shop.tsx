
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AppCard: React.FC<{
  title: string;
  desc: string;
  icon: string;
  path: string;
  color: string;
  tag?: string;
  isComingSoon?: boolean;
}> = ({ title, desc, icon, path, color, tag, isComingSoon }) => (
  <Link 
    to={isComingSoon ? '#' : path}
    className={`group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-3xl p-6 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 flex flex-col items-center text-center ${isComingSoon ? 'opacity-60 cursor-default grayscale-[0.5]' : ''}`}
  >
    {/* Icon Container - Odoo Inspired */}
    <div className={`w-16 h-16 rounded-[1.25rem] bg-gradient-to-br ${color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-105 transition-transform duration-300`}>
      <span className="material-icons-outlined text-3xl">{icon}</span>
    </div>

    <div className="space-y-1">
      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors">
        {title}
      </h3>
      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight line-clamp-2 px-2">
        {desc}
      </p>
    </div>

    {tag && (
      <div className="absolute top-3 right-3">
        <span className="text-[7px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
          {tag}
        </span>
      </div>
    )}
    
    {isComingSoon && (
      <div className="mt-3">
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Em breve</span>
      </div>
    )}
  </Link>
);

export const Shop: React.FC = () => {
  const apps = [
    {
      title: "DyCard Digital",
      desc: "Networking inteligente com NFC e QR Code.",
      icon: "qr_code_2",
      path: "/digital-card",
      color: "from-indigo-500 to-purple-600",
      tag: "CORE"
    },
    {
      title: "CondoSmart",
      desc: "Editor premium de artes gráficas e convites.",
      icon: "auto_fix_high",
      path: "/condosmart",
      color: "from-rose-500 to-pink-600",
      tag: "DESIGN"
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <header className="max-w-7xl mx-auto mb-16 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-500">
          CidEngenharia Ecosystem v3.0
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter leading-none">
          Nossos <span className="text-primary-500 italic">Aplicativos</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Nossa suíte de ferramentas exclusivas para potencializar sua presença visual e produtividade técnica.
        </p>
      </header>

      {/* App Grid - Centered for fewer items */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-8 justify-center">
        {apps.map((app, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <AppCard {...app} />
          </motion.div>
        ))}
      </div>

      {/* Custom Request CTA */}
      <section className="max-w-4xl mx-auto mt-24 text-center">
        <div className="p-10 md:p-14 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/60 rounded-[3rem] shadow-xl relative overflow-hidden group">
           <div className="engineering-grid absolute inset-0 opacity-10"></div>
           <div className="relative z-10 space-y-6">
              <h2 className="text-xl md:text-2xl font-black uppercase dark:text-white font-display">Sua ideia pode ser o próximo App</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-lg mx-auto leading-relaxed">
                Desenvolvemos soluções modulares personalizadas para automatizar os desafios únicos do seu negócio.
              </p>
              <div className="flex items-center justify-center pt-2">
                 <a 
                   href="https://wa.me/5571984184782" 
                   className="px-10 py-4 bg-primary-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-lg shadow-primary-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                 >
                   Falar com Engenheiro de Software
                   <span className="material-icons-outlined text-sm">bolt</span>
                 </a>
              </div>
           </div>
        </div>
      </section>

      <style>{`
        .engineering-grid {
          background-size: 30px 30px;
          background-image: 
              linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
        }
        .dark .engineering-grid {
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};
