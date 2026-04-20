import React from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../lib/LangContext';


const ProjectCard = ({ image, title, type, desc, techs, status, statusLabel, link }: { image: string, title: string, type: string, desc: string, techs: string, status: number, statusLabel: string, link: string }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-[#06070a]/60 backdrop-blur-3xl rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-xl group flex flex-col md:flex-row"
  >
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden block cursor-pointer"
    >
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
        <span className="material-icons-outlined text-white text-4xl">open_in_new</span>
      </div>
    </a>
    
    <div className="flex-1 p-8 md:p-10 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary-500/10 text-primary-500 text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-[0.2em] border border-primary-500/20">
            {type}
          </span>
          <div className="h-px flex-1 bg-slate-200 dark:bg-white/5"></div>
        </div>
        
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
          {title}
        </h3>
        
        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">
          {desc}
        </p>

        <p className="text-[#eab308] dark:text-[#eab308]/60 text-[9px] font-bold uppercase tracking-[0.15em] opacity-80 pt-1">
          {techs}
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Estado do Projeto:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${statusLabel === 'Concluído' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
              {statusLabel}
            </span>
          </div>
          <span className="text-xs font-black text-slate-900 dark:text-white tracking-tighter">{status}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: `${status}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-[#ef4444] via-[#eab308] to-[#22c55e]"
          />
        </div>
      </div>
    </div>
  </motion.div>
);

export const Portfolio: React.FC = () => {
  const { t } = useLang();

  const projects = [
    {
      title: 'AICondo360',
      type: 'Software SaaS',
      desc: 'Inteligência que Transforma Condomínios em Família. A plataforma definitiva para gestão condominial moderna, automatizando tarefas e aumentando a segurança.',
      techs: 'Vite, React, TypeScript, Supabase, Stripe, Framer Motion, Vercel',
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://ai-condo360.vercel.app/'
    },
    {
      title: 'CidEngenharia',
      type: 'Engenharia de Software & IA',
      desc: 'Sua Fábrica de Soluções Digitais Premium. Um ecossistema completo de engenharia web focado em sistemas inteligentes, design de alto impacto e automação de processos.',
      techs: 'Vite, React, TypeScript, Tailwind CSS, Framer Motion, Gemini AI, Vercel',
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://cidengenharia.vercel.app/'
    },
    {
      title: 'PetLocal',
      type: 'Ecossistema Digital',
      desc: 'O Hub de Serviços do seu amiguinho. Registro completo (RG + Certidão + Carteira de Vacina) com tecnologia QR Code vinculada ao perfil digital.',
      techs: 'Vite, React, TypeScript, Tailwind CSS, QR Code Generator, Vercel',
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://petlocal-animal.vercel.app/'
    },
    {
      title: 'EscolarGO',
      type: 'Web System / App',
      desc: 'Segurança e Tranquilidade em cada Trajeto. Monitoramento de rotas e comunicação direta entre pais e motoristas com tecnologia de ponta.',
      techs: 'Vite, React, TypeScript, Tailwind CSS, Google Maps API, Vercel',
      status: 70,
      statusLabel: 'Em Andamento',
      link: 'https://escolargo.vercel.app/'
    }
  ];

  // Actual images from public folder
  const actualProjectImages = [
    '/Aicondo360.png',
    '/CidEngenharia.png',
    '/PetLocal.png',
    '/EscolarGO.png'
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-32 transition-colors duration-500 font-body">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto px-8 pt-36 md:pt-48 pb-16 flex flex-col items-center text-center space-y-4">
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="relative group cursor-pointer">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <img 
                src="/favicon.png" 
                alt="IA Icon" 
                className="w-6 h-6 md:w-8 md:h-8 object-contain relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" 
              />
            </div>
            <h1 className="text-3xl md:text-5xl font-black uppercase font-display tracking-tight leading-none">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#1e293b,#9ca3af,#a855f7,#22c55e)] dark:bg-[linear-gradient(to_right,#ffffff,#9ca3af,#a855f7,#22c55e)]">
                Portfólio de Sistemas Web
              </span>
            </h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] md:text-xs max-w-2xl mx-auto font-black uppercase tracking-[0.4em]">
            Engenharia de precisão e interfaces de alto impacto
          </p>
        </div>
      </header>

      {/* Projects List */}
      <section className="max-w-6xl mx-auto px-6 space-y-8">
        {projects.map((project, idx) => (
          <ProjectCard 
            key={project.title}
            {...project}
            image={actualProjectImages[idx]}
          />
        ))}
      </section>

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-8 mt-32">
        <div className="p-10 md:p-16 bg-slate-900 rounded-[3rem] md:rounded-[4rem] relative overflow-hidden group shadow-2xl border border-white/5">
           <div className="engineering-grid absolute inset-0 opacity-10"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] animate-pulse"></div>
           
           <div className="relative z-10 text-center space-y-6">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight leading-none">
                Sua visão transformada em <br/><span className="text-primary-500 italic">Código de Elite</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-base max-w-lg mx-auto leading-relaxed font-light">
                Desenvolvemos sistemas customizados com a mais alta tecnologia e design premium. Vamos tirar sua ideia do papel?
              </p>
              <div className="flex justify-center pt-4">
                 <a href="https://wa.me/5571984184782" className="group flex items-center gap-3 px-10 py-4 bg-primary-500 text-white font-black rounded-2xl uppercase tracking-widest text-[10px] shadow-2xl shadow-primary-500/20 hover:scale-105 transition-all active:scale-95">
                   Iniciar Projeto Premium
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