import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLang } from '../lib/LangContext';

type Project = {
  image: string;
  title: string;
  type: string;
  desc: string;
  techs: string[];
  status: number;
  statusLabel: string;
  link: string;
};

const PortfolioCarousel = ({ projects }: { projects: Project[] }) => {
  const [activeProject, setActiveProject] = useState(0);
  const project = projects[activeProject];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveProject((current) => (current + 1) % projects.length);
    }, 6500);

    return () => window.clearInterval(timer);
  }, [projects.length]);

  const goToProject = (direction: number) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length);
  };

  return (
    <section className="max-w-6xl mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#06070a]/70 border border-slate-200/70 dark:border-white/10 shadow-2xl shadow-slate-900/10 dark:shadow-black/40"
      >
        <button
          type="button"
          aria-label="Projeto anterior"
          onClick={() => goToProject(-1)}
          className="absolute left-3 md:left-5 top-1/2 z-20 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-primary-500 hover:text-white transition-all active:scale-95"
        >
          <span className="material-icons-outlined text-xl">chevron_left</span>
        </button>

        <button
          type="button"
          aria-label="Próximo projeto"
          onClick={() => goToProject(1)}
          className="absolute right-3 md:right-5 top-1/2 z-20 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/90 dark:bg-slate-950/85 border border-slate-200 dark:border-white/10 shadow-xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-primary-500 hover:text-white transition-all active:scale-95"
        >
          <span className="material-icons-outlined text-xl">chevron_right</span>
        </button>

        <div className="grid lg:grid-cols-[1.12fr_0.88fr] min-h-[480px]">
          <div className="relative bg-slate-100 dark:bg-black/30 p-4 md:p-8 lg:p-10">
            <motion.a
              key={project.image}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="group block h-full min-h-[310px] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950 shadow-2xl"
            >
              <div className="h-10 flex items-center gap-2 px-4 bg-white/95 dark:bg-slate-900 border-b border-slate-200 dark:border-white/10">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#22c55e]"></span>
                <span className="ml-3 h-5 flex-1 max-w-64 rounded-full bg-slate-100 dark:bg-white/10"></span>
              </div>
              <div className="relative h-[330px] md:h-[420px] overflow-hidden">
                <img
                  src={project.image}
                  alt={`Print do projeto ${project.title}`}
                  className="w-full h-full object-cover object-top transition-transform duration-[1800ms] group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70"></div>
              </div>
            </motion.a>
          </div>

          <div className="relative p-7 md:p-10 lg:p-12 flex flex-col justify-between gap-8">
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <span className="bg-primary-500/10 text-primary-500 text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-[0.16em] border border-primary-500/20">
                  {project.type}
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-white/10"></div>
              </div>

              <div className="space-y-4">
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                  {project.desc}
                </p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary-500 dark:text-primary-400 text-sm font-medium hover:text-green-500 transition-colors"
                >
                  Ver projeto completo
                  <span className="material-icons-outlined text-base">arrow_forward</span>
                </a>
              </div>

              <div className="space-y-3">
                <span className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.22em]">
                  Tecnologias utilizadas
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.techs.map((tech) => (
                    <span
                      key={tech}
                      className="text-[#eab308] dark:text-[#facc15]/80 text-[10px] md:text-[11px] font-normal uppercase tracking-[0.12em]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-end gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Status do Projeto:
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${project.statusLabel === 'Concluído' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                      {project.statusLabel}
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white tracking-tighter">
                    {project.status}%
                  </span>
                </div>
                <div className="relative h-px w-full bg-slate-200 dark:bg-white/10">
                  <motion.div
                    key={`${project.title}-${project.status}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${project.status}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-[#38bdf8] to-[#22c55e]"
                  />
                  <motion.span
                    key={`${project.title}-marker`}
                    initial={{ left: 0 }}
                    animate={{ left: `${project.status}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-[#22c55e] shadow-sm dark:border-slate-950"
                  />
                </div>
              </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div className="flex items-center justify-center gap-2">
                {projects.map((item, index) => (
                  <button
                    key={item.title}
                    type="button"
                    aria-label={`Abrir projeto ${item.title}`}
                    onClick={() => setActiveProject(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${index === activeProject ? 'w-9 bg-primary-500' : 'w-2.5 bg-slate-300 dark:bg-white/20 hover:bg-primary-400'}`}
                  >
                    <motion.span
                      className="block h-full rounded-full bg-white/30"
                      initial={false}
                      animate={{ opacity: index === activeProject ? 1 : 0 }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export const Portfolio: React.FC = () => {
  const { t } = useLang();

  const projects: Project[] = [
    {
      image: '/Aicondo360.png',
      title: 'AICondo360',
      type: 'Software SaaS',
      desc: 'Inteligência que Transforma Condomínios em Família. A plataforma definitiva para gestão condominial moderna, automatizando tarefas e aumentando a segurança.',
      techs: ['Vite', 'React', 'TypeScript', 'Supabase', 'Stripe', 'Framer Motion', 'Vercel'],
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://ai-condo360.vercel.app/'
    },
    {
      image: '/CidEngenharia.png',
      title: 'CidEngenharia',
      type: 'Engenharia de Software & IA',
      desc: 'Sua Fábrica de Soluções Digitais Premium. Um ecossistema completo de engenharia web focado em sistemas inteligentes, design de alto impacto e automação de processos.',
      techs: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Gemini AI', 'Vercel'],
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://cidengenharia.vercel.app/'
    },
    {
      image: '/PetLocal.png',
      title: 'PetLocal',
      type: 'Ecossistema Digital',
      desc: 'O Hub de Serviços do seu amiguinho. Registro completo (RG + Certidão + Carteira de Vacina) com tecnologia QR Code vinculada ao perfil digital.',
      techs: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'QR Code', 'Vercel'],
      status: 100,
      statusLabel: 'Concluído',
      link: 'https://petlocal-animal.vercel.app/'
    },
    {
      image: '/EscolarGO.png',
      title: 'EscolarGO',
      type: 'Web System / App',
      desc: 'Segurança e Tranquilidade em cada Trajeto. Monitoramento de rotas e comunicação direta entre pais e motoristas com tecnologia de ponta.',
      techs: ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Google Maps API', 'Vercel'],
      status: 70,
      statusLabel: 'Em Andamento',
      link: 'https://escolargo.vercel.app/'
    }
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

      <PortfolioCarousel projects={projects} />

      {/* Bottom CTA Section */}
      <section className="max-w-4xl mx-auto px-8 mt-32">
        <div className="p-10 md:p-16 bg-slate-900 rounded-xl relative overflow-hidden group shadow-2xl border border-white/5">
           <div className="engineering-grid absolute inset-0 opacity-10"></div>
           <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] animate-pulse"></div>
           
           <div className="relative z-10 text-center space-y-6">
              <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight leading-none">
                Ideias transformadas em <br/><span className="text-primary-500 italic">Código Elite</span>
              </h2>
              <p className="text-slate-400 text-xs md:text-base max-w-lg mx-auto leading-relaxed font-light">
                Desenvolvemos sistemas customizados com a mais alta tecnologia e design premium. Vamos tirar sua ideia do papel?
              </p>
              <div className="flex justify-center pt-4">
                 <a href="https://wa.me/5571984184782" className="group flex items-center gap-3 px-10 py-4 bg-[#22c55e] text-white font-black rounded-xl uppercase tracking-widest text-[10px] shadow-2xl shadow-green-500/20 hover:bg-[#16a34a] hover:scale-105 transition-all active:scale-95">
                   Solicitar Orçamento
                   <svg className="h-4 w-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                     <path d="M16.02 3.2c-7.02 0-12.73 5.7-12.73 12.7 0 2.24.59 4.43 1.7 6.35L3.2 28.8l6.7-1.76a12.76 12.76 0 0 0 6.12 1.56c7.02 0 12.73-5.7 12.73-12.7S23.04 3.2 16.02 3.2Zm0 23.24c-1.92 0-3.8-.52-5.43-1.5l-.39-.23-3.97 1.04 1.06-3.86-.25-.4a10.47 10.47 0 0 1-1.6-5.58c0-5.81 4.74-10.54 10.58-10.54S26.6 10.1 26.6 15.9 21.86 26.44 16.02 26.44Zm5.8-7.89c-.32-.16-1.88-.92-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.19-.32-.02-.49.14-.65.15-.15.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
                   </svg>
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
