import React, { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LangContext } from '../lib/LangContext';
import { TopBar } from '../components/TopBar';

const MotionLink = motion(Link);

// Ícone SVG de Pasta Fechada (Amarela no formato da referência)
const FolderClosedIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6.5C3 5.39543 3.89543 4.5 5 4.5H9.4C9.93 4.5 10.44 4.71 10.81 5.09L12.2 6.5H19C20.1046 6.5 21 7.39543 21 8.5V17.5C21 18.6046 20.1046 19.5 19 19.5H5C3.89543 19.5 3 18.6046 3 17.5V6.5Z"
      fill="#F59E0B"
    />
    <rect x="3" y="8" width="18" height="11.5" rx="2" fill="#FBBF24" />
  </svg>
);

// Ícone SVG de Pasta Aberta (Amarela no formato da referência)
const FolderOpenIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3 6.5C3 5.39543 3.89543 4.5 5 4.5H9.4C9.93 4.5 10.44 4.71 10.81 5.09L12.2 6.5H19C20.1046 6.5 21 7.39543 21 8.5V15.5H3V6.5Z"
      fill="#D97706"
    />
    <rect x="4" y="8.5" width="16" height="7.5" rx="1" fill="#F59E0B" opacity="0.65" />
    <path
      d="M2.5 10.5H21.5L19.4 19.2C19.2 20 18.4 20.5 17.5 20.5H4.5C3.6 20.5 2.8 20 2.6 19.2L2.5 10.5Z"
      fill="#FBBF24"
    />
  </svg>
);

// Balões flutuantes de fundo
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

interface TreeLeaf {
  nome: string;
}

interface TreeCategory {
  id: string;
  titulo: string;
  itens: TreeLeaf[];
}

interface TreePortal {
  id: string;
  nome: string;
  href: string;
  icone: string;
  corTexto: string;
  corBorda: string;
  corBg: string;
  corGlow: string;
  categorias: TreeCategory[];
}

const treeData: TreePortal[] = [
  {
    id: 'cidengenharia',
    nome: 'CidDesenvolvimento',
    href: '/cidengenharia',
    icone: '∞',
    corTexto: 'text-yellow-400',
    corBorda: 'border-yellow-500/30',
    corBg: 'bg-yellow-500/10',
    corGlow: 'rgba(251,191,36,0.25)',
    categorias: [
      {
        id: 'web-landing',
        titulo: 'Sites & Landing',
        itens: [
          { nome: 'Criação de Sites' },
          { nome: 'Aluguel de sites' },
          { nome: 'Criação de Landpages' },
        ],
      },
      {
        id: 'sistemas',
        titulo: 'Sistemas Web',
        itens: [
          { nome: 'Desenvolvimento de Sistemas Web' },
          { nome: 'Prompts em IA' },
        ],
      },
      {
        id: 'midia-ia',
        titulo: 'Criação & Edição',
        itens: [
          { nome: 'Criação e Edição Videos' },
          { nome: 'Criação e Edição de Imagens' },
        ],
      },
    ],
  },
  {
    id: 'cidvisual',
    nome: 'CidVisual',
    href: '/cidvisual',
    icone: '🎨',
    corTexto: 'text-violet-300',
    corBorda: 'border-violet-500/30',
    corBg: 'bg-violet-500/10',
    corGlow: 'rgba(139,92,246,0.25)',
    categorias: [
      {
        id: 'grafica',
        titulo: 'Gráfica & Cópias',
        itens: [
          { nome: 'Gráfica' },
          { nome: 'Cópia P&B e Colorida / Análise' },
          { nome: 'Xerox' },
        ],
      },
      {
        id: 'personalizados',
        titulo: 'Personalizados',
        itens: [
          { nome: 'Canecas · Camisetas' },
          { nome: 'Porta-Retratos · Garrafas Squize' },
        ],
      },
      {
        id: 'comunicacao',
        titulo: 'Comunicação & Plotagem',
        itens: [
          { nome: 'Banner · Faixa · Cavalete' },
          { nome: 'Adesivos Vinil' },
          { nome: 'Plotagem' },
        ],
      },
    ],
  },
  {
    id: 'cidmanutencao',
    nome: 'CidManutenção',
    href: '/cidmanutencao',
    icone: '🔧',
    corTexto: 'text-emerald-400',
    corBorda: 'border-emerald-500/30',
    corBg: 'bg-emerald-500/10',
    corGlow: 'rgba(16,185,129,0.25)',
    categorias: [
      {
        id: 'informatica',
        titulo: 'Informática',
        itens: [
          { nome: 'Manutenção em PCs' },
          { nome: 'Hardware e Software' },
        ],
      },
      {
        id: 'chaves',
        titulo: 'Chaves',
        itens: [
          { nome: 'Cópias de Chaves' },
        ],
      },
      {
        id: 'oficina',
        titulo: 'Oficina & Estruturas',
        itens: [
          { nome: 'Soldagem metálicas' },
          { nome: 'Móveis em pallet' },
          { nome: 'Peças em Resinas' },
          { nome: 'Recuperação de peças fibra de vidro' },
        ],
      },
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
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');

  const toggleCategory = (catId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleOrcamentoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let texto = 'Olá! Gostaria de um orçamento personalizado.';
    const extras: string[] = [];
    if (nome.trim()) extras.push(`Nome: ${nome.trim()}`);
    if (telefone.trim()) extras.push(`Telefone: ${telefone.trim()}`);
    if (extras.length > 0) {
      texto += `\n\n${extras.join('\n')}`;
    }
    const url = `https://wa.me/5571993291947?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative min-h-screen bg-[#080a12] overflow-x-hidden font-sans selection:bg-violet-500/30 selection:text-white">

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

      {/* ===== ESTRELAS ===== */}
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
      <div className="w-full pt-4 pb-2 z-40 relative">
        <TopBar
          isDark={isDark}
          onToggleDark={onToggleDark}
          lang={lang}
          onChangeLang={onChangeLang}
        />
      </div>

      {/* ===== ÁRVORE HIERÁRQUICA DE SERVIÇOS ===== */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-8 pb-20 max-w-[1200px] mx-auto">

        {/* NÓ RAIZ — HUB DE SERVIÇOS */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center text-center relative z-20"
        >
          {/* Badge de código </> */}
          <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/15 flex items-center justify-center text-lg font-mono text-violet-300 shadow-[0_0_20px_rgba(139,92,246,0.2)] backdrop-blur-md mb-2">
            {'</>'}
          </div>

          <h1 className="text-3xl md:text-5xl tracking-tight leading-none text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-200 via-white to-indigo-200">
              {t.landingTitlePrefix || 'Hub de'}{' '}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-violet-400 to-purple-500">
              {t.landingTitleAccent || 'Serviços'}
            </span>
          </h1>

          <p className="text-yellow-400 text-base md:text-xl mt-2 font-normal text-center">
            {t.landingSubtitle || 'Escolha o serviço que você precisa'}
          </p>
        </motion.div>

        {/* TRONCO PRINCIPAL: LINHA VERTICAL DESCENDO DA RAIZ */}
        <div className="w-px h-6 bg-white/30 my-0 relative z-10" />

        {/* ESTRUTURA DA ÁRVORE (CONEXÕES ORTOGONAIS PRECISAS) */}
        <div className="w-full relative z-10 max-w-[1060px] mx-auto">

          {/* CONECTORES ORTOGONAIS PARA OS 3 PORTAIS (DESKTOP) */}
          <div className="hidden lg:grid grid-cols-3 w-full h-6 relative">
            {/* Ramo Esquerda: Linha de 50% até 100% + Linha vertical descendo em 50% */}
            <div className="relative w-full h-full">
              <div className="absolute top-0 right-0 left-1/2 h-px bg-white/30" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
            </div>

            {/* Ramo Centro: Linha de 0% até 100% + Linha vertical descendo em 50% */}
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 right-0 h-px bg-white/30" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
            </div>

            {/* Ramo Direita: Linha de 0% até 50% + Linha vertical descendo em 50% */}
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-0 right-1/2 h-px bg-white/30" />
              <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/30" />
            </div>
          </div>

          {/* GRID DOS 3 PORTAIS E SUAS SUBPASTAS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-0 w-full pt-0">
            {treeData.map((portal, portalIndex) => (
              <div key={portal.id} className="flex flex-col items-center px-2">

                {/* NÓ MESTRE DO PORTAL */}
                <MotionLink
                  to={portal.href}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + portalIndex * 0.15, duration: 0.5 }}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`inline-flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${portal.corBorda} bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-md shadow-lg cursor-pointer group transition-all duration-300 z-20 w-[240px]`}
                  style={{ textDecoration: 'none' }}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none flex items-center justify-center">
                      {portal.icone === '∞' ? (
                        <span className="text-xl font-light leading-none text-yellow-300">∞</span>
                      ) : (
                        portal.icone
                      )}
                    </span>
                    <span className={`text-sm font-bold tracking-tight ${portal.corTexto}`}>
                      {t.portalNames?.[portalIndex] || portal.nome}
                    </span>
                  </div>

                  <span className={`material-icons-outlined text-base ${portal.corTexto} opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all`}>
                    arrow_forward
                  </span>
                </MotionLink>

                {/* LINHA VERTICAL SAINDO DO CENTRO DO CARD MESTRE */}
                <div className="w-px h-5 bg-white/20 my-0 relative z-10" />

                {/* CONECTORES ORTOGONAIS DAS SUBPASTAS (DESKTOP/TABLET) */}
                <div className="w-full relative">
                  <div className="hidden sm:grid grid-cols-3 w-full h-4 relative">
                    {/* Subpasta 0 (Esquerda) */}
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 right-0 left-1/2 h-px bg-white/20" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                    </div>

                    {/* Subpasta 1 (Centro) */}
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 left-0 right-0 h-px bg-white/20" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                    </div>

                    {/* Subpasta 2 (Direita) */}
                    <div className="relative w-full h-full">
                      <div className="absolute top-0 left-0 right-1/2 h-px bg-white/20" />
                      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20" />
                    </div>
                  </div>

                  {/* GRID DAS 3 SUBPASTAS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 w-full">
                    {portal.categorias.map((cat) => {
                      const isOpen = hoveredCategory === cat.id || !!openCategories[cat.id];

                      return (
                        <div
                          key={cat.id}
                          onMouseEnter={() => setHoveredCategory(cat.id)}
                          onMouseLeave={() => setHoveredCategory(null)}
                          className="flex flex-col items-center text-center relative group"
                        >

                          {/* BOTÃO DA SUBPASTA (CENTRALIZADO COM A LINHA VERTICAL) */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-all duration-200 hover:bg-white/[0.05] active:scale-95 cursor-pointer w-full ${
                              isOpen ? portal.corTexto : 'text-slate-300 hover:text-white'
                            }`}
                            title={isOpen ? 'Pasta aberta' : 'Passe o mouse para abrir pasta'}
                          >
                            <motion.span
                              className="flex-shrink-0 mb-1"
                              animate={isOpen ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                            >
                              {isOpen ? (
                                <FolderOpenIcon className="w-5 h-5 drop-shadow-[0_2px_8px_rgba(251,191,36,0.45)]" />
                              ) : (
                                <FolderClosedIcon className="w-5 h-5 transition-transform" />
                              )}
                            </motion.span>

                            <span className={`text-[11px] font-medium tracking-tight leading-tight select-none text-center transition-colors ${
                              isOpen ? 'text-white' : 'text-slate-300 group-hover:text-white'
                            }`}>
                              {cat.titulo}
                            </span>
                          </button>

                          {/* LISTA DE SERVIÇOS (ABRE NO HOVER OU AO CLICAR) */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0, y: -4 }}
                                animate={{ opacity: 1, height: 'auto', y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -4 }}
                                transition={{ duration: 0.22, ease: 'easeOut' }}
                                className="w-full flex flex-col items-start pl-2 py-1.5 mt-1 space-y-1 overflow-hidden"
                              >
                                {cat.itens.map((item, itemIndex) => (
                                  <motion.div
                                    key={itemIndex}
                                    initial={{ opacity: 0, x: -6 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: itemIndex * 0.03, duration: 0.15 }}
                                    className="flex items-center gap-1.5 py-0.5 text-left transition-colors duration-150 group/item"
                                  >
                                    <span className={`w-1.5 h-1.5 rounded-full ${portal.corBg} border ${portal.corBorda} flex-shrink-0 group-hover/item:scale-125 transition-transform`} />
                                    <span className="text-[10px] text-slate-300 font-normal leading-tight hover:text-white transition-colors">
                                      {item.nome}
                                    </span>
                                  </motion.div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* SEÇÃO SOLICITE UM ORÇAMENTO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-24 sm:mt-28 w-full max-w-lg mx-auto flex flex-col items-center text-center relative z-20 px-2"
        >
          <div className="inline-flex items-center gap-2 mb-3.5">
            <span className="w-2 h-2 rounded-full bg-lime-400 shadow-[0_0_8px_#a3e635] animate-pulse" />
            <h3 className="text-xs uppercase tracking-widest text-yellow-400 font-normal">
              Solicite um orçamento
            </h3>
          </div>

          <form
            onSubmit={handleOrcamentoSubmit}
            className="w-full flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-md shadow-lg"
          >
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              className="w-full sm:flex-1 px-3 py-2 text-xs bg-transparent border-0 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 rounded-lg"
            />
            <div className="hidden sm:block w-px h-5 bg-white/10" />
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="Telefone / WhatsApp"
              className="w-full sm:flex-1 px-3 py-2 text-xs bg-transparent border-0 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 rounded-lg"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg transition-all flex items-center justify-center gap-1 text-xs active:scale-95 shadow-md group cursor-pointer"
              title="Enviar solicitação via WhatsApp"
            >
              <span>Enviar</span>
              <span className="material-icons-outlined text-sm group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </button>
          </form>
        </motion.div>

      </div>

      {/* Botão WhatsApp Flutuante */}
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
