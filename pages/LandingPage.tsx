import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LangContext } from '../lib/LangContext';
import { TopBar } from '../components/TopBar';

const MotionLink = motion(Link);

// Balões flutuantes — idênticos ao Home.tsx
const bgBubbles = [
  { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(109,40,217,0.4)', delay: 0, duration: 8 },
  { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(37,99,235,0.3)', delay: 2, duration: 12 },
  { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(139,92,246,0.35)', delay: 1, duration: 10 },
  { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(79,70,229,0.3)', delay: 3, duration: 15 },
  { size: 'w-[20%] h-[20%]', pos: 'top-[45%] right-[25%]', color: 'rgba(99,102,241,0.25)', delay: 5, duration: 18 },
  { size: 'w-[22%] h-[22%]', pos: 'bottom-[45%] left-[15%]', color: 'rgba(167,139,250,0.35)', delay: 4, duration: 14 },
  { size: 'w-[28%] h-[28%]', pos: 'top-[15%] left-[35%]', color: 'rgba(30,58,138,0.4)', delay: 6, duration: 20 },
];

const galaxyStars = Array.from({ length: 120 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: `${1 + (i % 3) * 0.45}px`,
  delay: `${(i * 0.19) % 7}s`,
  duration: `${4 + (i % 7) * 0.8}s`,
  opacity: 0.22 + ((i % 6) * 0.08),
}));

const portais = [
  {
    id: 'cidvisual',
    nome: 'CidVisual',
    href: '/cidvisual',
    icone: '🎨',
    cor: 'from-violet-600 to-purple-700',
    corBorda: 'border-violet-500/40',
    corGlow: 'rgba(139,92,246,0.35)',
    corTexto: 'text-violet-300',
    corBg: 'bg-violet-500/10',
    servicos: [
      'Gráfica',
      'Cópia P&B e Colorida / Análise',
      'Xerox',
      'Produtos Personalizados',
      'Canecas · Camisetas',
      'Porta-Retratos · Garrafas Squize',
      'Banner · Faixa · Cavalete',
      'Adesivos Vinil',
      'Plotagem',
    ],
  },
  {
    id: 'cidengenharia',
    nome: 'CidDesenvolvimento',
    href: '/cidengenharia',
    icone: '∞',
    cor: 'from-yellow-500 to-amber-600',
    corBorda: 'border-yellow-500/40',
    corGlow: 'rgba(251,191,36,0.3)',
    corTexto: 'text-yellow-300',
    corBg: 'bg-yellow-500/10',
    servicos: [
      'Criação de Sites',
      'Aluguel de sites',
      'Criação de Landepages',
      'Criação e Edição Videos',
      'Prompts em IA',
      'Desenvolvimento de Sistemas Web',
      'Criação e Edição de Imagens',
    ],
  },
  {
    id: 'cidmanutencao',
    nome: 'CidManutenção',
    href: '/cidmanutencao',
    icone: '🔧',
    cor: 'from-emerald-500 to-teal-600',
    corBorda: 'border-emerald-500/40',
    corGlow: 'rgba(16,185,129,0.3)',
    corTexto: 'text-emerald-300',
    corBg: 'bg-emerald-500/10',
    servicos: [
      'Manutenção em PCs',
      'Hardware e Software',
      'Cópias de Chaves',
      'Soldagem metálicas',
      'Móveis em pallet',
      'Peças em Resinas',
      'Recuperação de peças fibra de vidro',
    ],
  },
];

interface LandingPageProps {
  isDark: boolean;
  onToggleDark: () => void;
  lang: 'PT' | 'EN' | 'ES';
  onChangeLang: (l: 'PT' | 'EN' | 'ES') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ isDark, onToggleDark, lang, onChangeLang }) => {
  const { t } = useContext(LangContext);

  return (
    <div className="relative min-h-screen bg-[#080a12] overflow-hidden font-sans">

      {/* ===== BACKGROUND BALÕES FLUTUANTES ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {bgBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.4, 0.8, 0.4],
              x: [0, Math.sin(i * 15) * 60, 0],
              y: [0, Math.cos(i * 15) * 40, 0],
            }}
            transition={{ duration: bubble.duration, repeat: Infinity, ease: 'easeInOut', delay: bubble.delay }}
            className={`absolute ${bubble.size} ${bubble.pos} rounded-full`}
            style={{
              background: `radial-gradient(circle, ${bubble.color} 0%, transparent 85%)`,
              filter: 'blur(70px)',
              mixBlendMode: 'plus-lighter',
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        <div className="galaxy-band" />
        {galaxyStars.map((star, i) => (
          <span
            key={i}
            className="galaxy-star"
            style={{
              left: star.left,
              top: star.top,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      {/* ===== BARRA SUPERIOR ===== */}
      <div className="sticky top-5 z-40 w-full pointer-events-none mb-[-60px]">
        <TopBar
          isDark={isDark}
          onToggleDark={onToggleDark}
          lang={lang}
          onChangeLang={onChangeLang}
        />
      </div>

      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-24 pb-16">

        {/* Hub central — CidServiços */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mb-4"
        >
          {/* Badge topo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-slate-300 mb-6 backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            {t.landingBadge}
          </motion.div>

          {/* Título CidServiços */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            {/* Glow atrás do título */}
            <div
              className="absolute inset-0 rounded-full blur-3xl opacity-40"
              style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.6) 0%, transparent 70%)' }}
            />
            <h1 className="relative text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none text-center">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-300 via-white to-indigo-300">
                {t.landingTitlePrefix}{" "}
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-500">
                {t.landingTitleAccent}
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-yellow-400 text-2xl md:text-3xl font-bold mt-4 text-center max-w-xl"
          >
            {t.landingSubtitle}
          </motion.p>
        </motion.div>

        {/* Linha vertical conectora central (do hub para os cards) */}
        <motion.div
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4, ease: 'easeOut' }}
          style={{ transformOrigin: 'top' }}
          className="w-px h-10 bg-gradient-to-b from-violet-500/60 to-transparent mb-0"
        />

        {/* Linha horizontal e pontos de ramificação */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' }}
          style={{ transformOrigin: 'center' }}
          className="service-constellation w-full max-w-4xl px-8 flex items-center justify-between relative"
        >
          {/* Linha horizontal */}
          <div className="absolute left-[12%] right-[12%] top-1/2 h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />

          {/* Estrelas nos extremos + centro */}
          {[0, 1, 2].map((i) => (
            <div key={i} className="relative flex items-center justify-center" style={{ width: '33.33%' }}>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="service-star z-10"
                style={{ animationDelay: `${i * 1.15}s` }}
              >
                ✦
              </motion.div>
            </div>
          ))}
        </motion.div>

        {/* Linhas verticais para cada card */}
        <div className="w-full max-w-4xl px-8 flex justify-between">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex justify-center" style={{ width: '33.33%' }}>
              <motion.div
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{ delay: 1.0 + i * 0.1, duration: 0.3, ease: 'easeOut' }}
                style={{ transformOrigin: 'top' }}
                className="w-px h-6 bg-gradient-to-b from-violet-500/60 to-transparent"
              />
            </div>
          ))}
        </div>

        {/* ===== CARDS DOS PORTAIS ===== */}
        <div className="w-full max-w-5xl px-4 grid grid-cols-1 md:grid-cols-3 gap-5">
          {portais.map((portal, i) => (
            <MotionLink
              key={portal.id}
              to={portal.href}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 + i * 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`portal-card relative group rounded-2xl border ${portal.corBorda} bg-white/[0.03] backdrop-blur-md p-6 cursor-pointer overflow-hidden transition-all duration-300`}
              style={{ textDecoration: 'none' }}
            >
              {/* Glow no hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at center, ${portal.corGlow} 0%, transparent 70%)` }}
              />

              {/* Topo do card — ícone + nome */}
              <div className="relative z-10 flex items-center gap-3 mb-5">
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 1.3 + i * 0.2, type: 'spring', stiffness: 200 }}
                  className={`w-12 h-12 rounded-xl ${portal.corBg} flex items-center justify-center text-2xl border ${portal.corBorda} overflow-hidden p-1.5`}
                >
                  {portal.icone.startsWith('/') ? (
                    <img src={portal.icone} className="w-full h-full object-contain" alt={portal.nome} />
                  ) : portal.icone === '∞' ? (
                    <span className="text-4xl font-light leading-none text-yellow-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)]">
                      {portal.icone}
                    </span>
                  ) : (
                    portal.icone
                  )}
                </motion.div>
                <div>
                  <h2 className={`text-lg leading-tight font-bold ${portal.corTexto}`}>
                    {t.portalNames[i]}
                  </h2>
                  <div className={`h-0.5 mt-1 rounded-full bg-gradient-to-r ${portal.cor} opacity-60`} style={{ width: '60%' }} />
                </div>
              </div>

              {/* Lista de serviços */}
              <ul className="relative z-10 space-y-2">
                {t.portalServices[i].map((servico, si) => (
                  <motion.li
                    key={si}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + i * 0.2 + si * 0.06 }}
                    className="flex items-start gap-2 text-slate-400 text-xs leading-snug"
                  >
                    <span className={`mt-0.5 w-1 h-1 rounded-full flex-shrink-0 bg-gradient-to-br ${portal.cor}`} />
                    {servico}
                  </motion.li>
                ))}
              </ul>

              {/* Botão de acesso */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8 + i * 0.2 }}
                className={`relative z-10 mt-6 flex items-center gap-2 ${portal.corTexto} text-xs group-hover:gap-3 transition-all`}
              >
                <span>{t.accessLabel} {t.portalNames[i]}</span>
                <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.div>
            </MotionLink>
          ))}
        </div>

        {/* Rodapé da Landing */}
      </div>

      {/* Botão WhatsApp */}
      <a
        href="https://wa.me/5571984184782"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-5 z-[60] w-12 h-12 flex items-center justify-center bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.3)] transition-all hover:scale-110 active:scale-95"
      >
        <svg className="w-6 h-6 fill-current drop-shadow-md" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
};
