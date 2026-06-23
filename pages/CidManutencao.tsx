import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


const bgBubbles = [
  { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(16,185,129,0.35)', delay: 0, duration: 8 },
  { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(5,150,105,0.3)', delay: 2, duration: 12 },
  { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(52,211,153,0.3)', delay: 1, duration: 10 },
  { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(20,184,166,0.25)', delay: 3, duration: 15 },
  { size: 'w-[20%] h-[20%]', pos: 'top-[50%] right-[20%]', color: 'rgba(6,182,212,0.2)', delay: 5, duration: 18 },
];

const categorias = [
  {
    titulo: 'Manutenção de Computadores',
    icone: '💻',
    servicos: [
      {
        nome: 'Manutenção em PCs',
        desc: 'Diagnóstico completo, limpeza, formatação e otimização de desktops e notebooks',
      },
      {
        nome: 'Hardware',
        desc: 'Troca de peças, upgrade de memória, SSD, placa de vídeo e fontes de alimentação',
      },
      {
        nome: 'Software',
        desc: 'Instalação de sistemas operacionais, drivers, programas e remoção de vírus e malwares',
      },
    ],
  },
  {
    titulo: 'Cópias de Chaves',
    icone: '🔑',
    servicos: [
      {
        nome: 'Chaves Comuns (Cópias)',
        desc: 'Reprodução de chaves residenciais, comerciais e de veículos com precisão e rapidez',
      },
      {
        nome: 'Chaves Especiais',
        desc: 'Chaves codificadas e de segurança — consulte disponibilidade para seu modelo',
      },
    ],
  },
  {
    titulo: 'Serviços para Imóveis',
    icone: '🏠',
    servicos: [
      {
        nome: 'Imóveis em Pallete',
        desc: 'Projetos e execução de móveis, estruturas e decoração utilizando paletes de madeira',
      },
      {
        nome: 'Serviços Gerais',
        desc: 'Pequenos reparos, instalações e manutenção preventiva para residências e escritórios',
      },
    ],
  },
];

export const CidManutencao: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#080a12] overflow-hidden font-sans">

      {/* BACKGROUND BALÕES */}
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

      {/* CONTEÚDO */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-8 pt-10">

        {/* Botão voltar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 text-xs tracking-wide transition-all mb-12 group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
            </svg>
            Voltar
          </button>
        </motion.div>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="mb-16 text-center md:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] uppercase tracking-widest text-emerald-400 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Suporte Técnico & Manutenção
          </div>

          <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl"
            >
              🔧
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-6xl tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-400">Cid</span>
                <span className="text-white">Manutenção</span>
              </h1>
              <div className="h-0.5 mt-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 w-24" />
            </div>
          </div>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed mx-auto md:mx-0">
            Suporte técnico especializado em hardware, software e muito mais.
            Soluções rápidas e confiáveis para manter seu equipamento funcionando perfeitamente.
          </p>
        </motion.div>

        {/* CARDS DE CATEGORIAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categorias.map((cat, ci) => (
            <motion.div
              key={ci}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + ci * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative group rounded-2xl border border-emerald-500/20 bg-white/[0.03] backdrop-blur-md p-6 overflow-hidden hover:border-emerald-500/40 transition-all duration-300"
            >
              {/* Glow hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at top left, rgba(16,185,129,0.15) 0%, transparent 70%)' }}
              />

              {/* Cabeçalho da categoria */}
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{cat.icone}</span>
                <h2 className="text-emerald-300 text-sm tracking-wide">{cat.titulo}</h2>
              </div>

              {/* Lista de serviços */}
              <div className="space-y-4">
                {cat.servicos.map((s, si) => (
                  <motion.div
                    key={si}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + ci * 0.15 + si * 0.08 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0" />
                    <div>
                      <p className="text-slate-200 text-sm leading-snug">{s.nome}</p>
                      <p className="text-slate-500 text-xs mt-0.5 leading-relaxed">{s.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* DESTAQUE — Por que escolher a CidManutenção */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 md:p-8"
        >
          <h3 className="text-emerald-400 text-sm tracking-wide mb-5">Por que escolher a CidManutenção?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icone: '⚡', titulo: 'Atendimento Rápido', desc: 'Diagnóstico e solução no menor tempo possível' },
              { icone: '🛡️', titulo: 'Garantia nos Serviços', desc: 'Todos os nossos serviços contam com garantia' },
              { icone: '💰', titulo: 'Preço Justo', desc: 'Orçamento transparente sem surpresas na hora do pagamento' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xl">{item.icone}</span>
                <div>
                  <p className="text-slate-200 text-sm">{item.titulo}</p>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA CONTATO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-400 text-sm mb-5">Equipamento com problema? Fale conosco agora!</p>
          <a
            href="https://wa.me/5571984184782?text=Olá! Preciso de suporte técnico da CidManutenção."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-700 hover:bg-emerald-600 text-white text-sm tracking-wide rounded-xl shadow-lg shadow-emerald-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Solicitar Atendimento
          </a>
        </motion.div>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-14 text-center text-[10px] tracking-widest text-slate-600 lowercase"
        >
          {'{ cidmanutenção — suporte técnico & manutenção }'}
        </motion.p>
      </div>
    </div>
  );
};
