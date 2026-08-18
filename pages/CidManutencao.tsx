import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bgBubbles = [
  { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(16,185,129,0.35)', delay: 0, duration: 8 },
  { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(5,150,105,0.3)', delay: 2, duration: 12 },
  { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(52,211,153,0.3)', delay: 1, duration: 10 },
  { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(20,184,166,0.25)', delay: 3, duration: 15 },
  { size: 'w-[20%] h-[20%]', pos: 'top-[50%] right-[20%]', color: 'rgba(6,182,212,0.2)', delay: 5, duration: 18 },
];

interface ServiceDetail {
  id: string;
  title: string;
  icon: string;
  imageUrl?: string;
  desc: string;
  features: string[];
  fullDesc: string;
  color: string;
}

interface Categoria {
  titulo: string;
  icone: string;
  servicos: ServiceDetail[];
}

const categorias: Categoria[] = [
  {
    titulo: 'Manutenção de Computadores',
    icone: '💻',
    servicos: [
      {
        id: 'manutencao-pcs',
        title: 'Manutenção em PCs',
        icon: 'computer',
        imageUrl: '/cidmanutencao-pcs.png',
        desc: 'Diagnóstico completo, limpeza, formatação e otimização de desktops e notebooks.',
        features: ['Diagnóstico completo', 'Limpeza interna', 'Formatação e backup', 'Otimização de desempenho'],
        fullDesc: 'Diagnóstico completo, limpeza interna, formatação e otimização de desktops e notebooks. Mantemos seu equipamento funcionando com rapidez e confiabilidade.',
        color: 'bg-emerald-600',
      },
      {
        id: 'hardware',
        title: 'Hardware',
        icon: 'memory',
        imageUrl: '/cidmanutencao-hardware.png',
        desc: 'Troca de peças, upgrade de memória, SSD, placa de vídeo e fontes de alimentação.',
        features: ['Upgrade de memória RAM', 'Instalação de SSD', 'Troca de placa de vídeo', 'Substituição de fontes'],
        fullDesc: 'Troca de peças, upgrade de memória, SSD, placa de vídeo e fontes de alimentação. Orçamento transparente com peças de qualidade e garantia nos serviços.',
        color: 'bg-emerald-600',
      },
      {
        id: 'software',
        title: 'Software',
        icon: 'settings',
        imageUrl: '/cidmanutencao-software.png',
        desc: 'Instalação de sistemas operacionais, drivers, programas e remoção de vírus e malwares.',
        features: ['Instalação de PC e Notebooks com Windows 07/10/11', 'Atualização de drivers', 'Remoção de vírus', 'Configuração de programas'],
        fullDesc: 'Instalação de sistemas operacionais, drivers, programas e remoção de vírus e malwares. Seu computador seguro e pronto para uso no menor tempo possível.',
        color: 'bg-emerald-600',
      },
      {
        id: 'manutencao-eletronicos',
        title: 'Manutenção em Eletrônicos',
        icon: 'electrical_services',
        imageUrl: '/cidmanutencao-eletronicos.png',
        desc: 'Manutenção em placas eletrônicas e periféricos, substituição de componentes e diagnósticos.',
        features: ['Manutenção em placas eletrônicas', 'Manutenção em periféricos', 'Substituição de componentes', 'Diagnósticos técnicos'],
        fullDesc: 'Manutenção em placas eletrônicas e periféricos, substituição de componentes e diagnósticos completos. Serviço técnico especializado para garantir o pleno funcionamento dos seus equipamentos eletrônicos.',
        color: 'bg-emerald-600',
      },
    ],
  },
  {
    titulo: 'Cópias de Chaves',
    icone: '🔑',
    servicos: [
      {
        id: 'chaves-comuns',
        title: 'Chaves Comuns',
        icon: 'key',
        imageUrl: '/cidmanutencao-chaves-comuns.png',
        desc: 'Reprodução de chaves residenciais, comerciais e de veículos com precisão e rapidez.',
        features: ['Chaves residenciais', 'Chaves comerciais', 'Chaves de veículos', 'Atendimento rápido'],
        fullDesc: 'Reprodução de chaves residenciais, comerciais e de veículos com precisão e rapidez. Serviço ágil para quando você mais precisa.',
        color: 'bg-teal-600',
      },
      {
        id: 'chaves-especiais',
        title: 'Chaves Especiais',
        icon: 'vpn_key',
        imageUrl: '/cidmanutencao-chaves-especiais.png',
        desc: 'Chaves codificadas e de segurança — consulte disponibilidade para seu modelo.',
        features: ['Chaves codificadas', 'Chaves de segurança', 'Consulta por modelo', 'Alta precisão'],
        fullDesc: 'Chaves codificadas e de segurança — consulte disponibilidade para seu modelo. Atendimento especializado para chaves que exigem maior cuidado técnico.',
        color: 'bg-teal-600',
      },
    ],
  },
  {
    titulo: 'Oficina & Reparos',
    icone: '🔧',
    servicos: [
      {
        id: 'soldagem',
        title: 'Soldagem Metálicas',
        icon: 'construction',
        imageUrl: '/cidmanutencao-soldagem.png',
        desc: 'Soldagem e reparos em estruturas metálicas, grades, portões e peças diversas.',
        features: ['Soldagem MIG/MA', 'Reparo de grades', 'Peças sob medida', 'Acabamento profissional'],
        fullDesc: 'Soldagem e reparos em estruturas metálicas, grades, portões e peças diversas. Soluções duráveis com acabamento de qualidade.',
        color: 'bg-emerald-600',
      },
      {
        id: 'moveis-pallet',
        title: 'Móveis em Pallet',
        icon: 'weekend',
        imageUrl: '/cidmanutencao-moveis-pallet.png',
        desc: 'Projetos e execução de móveis, estruturas e decoração utilizando paletes de madeira.',
        features: ['Projetos personalizados', 'Móveis rústicos', 'Decoração criativa', 'Execução completa'],
        fullDesc: 'Projetos e execução de móveis, estruturas e decoração utilizando paletes de madeira. Peças únicas com visual moderno e sustentável.',
        color: 'bg-emerald-600',
      },
      {
        id: 'pecas-resinas',
        title: 'Peças em Resinas',
        icon: 'category',
        imageUrl: '/cidmanutencao-pecas-resinas.png',
        desc: 'Fabricação de peças em resina para acabamentos, decoração e uso funcional.',
        features: ['Moldes personalizados', 'Alta durabilidade', 'Acabamento refinado', 'Peças sob medida'],
        fullDesc: 'Fabricação de peças em resina para acabamentos, decoração e uso funcional. Produção com precisão e acabamento de alto padrão.',
        color: 'bg-emerald-600',
      },
      {
        id: 'fibra-vidro',
        title: 'Recuperação Fibra de Vidro',
        icon: 'handyman',
        imageUrl: '/cidmanutencao-fibra-vidro.png',
        desc: 'Recuperação e reparo de peças em fibra de vidro danificadas ou desgastadas.',
        features: ['Reparo estrutural', 'Laminagem', 'Acabamento liso', 'Restauração completa'],
        fullDesc: 'Recuperação e reparo de peças em fibra de vidro danificadas ou desgastadas. Restauramos a integridade e aparência original das peças.',
        color: 'bg-emerald-600',
      },
    ],
  },
];

const ServiceCard: React.FC<{
  service: ServiceDetail;
  isActive: boolean;
  onSelect: () => void;
}> = ({ service, isActive, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`relative grid grid-cols-1 md:grid-cols-[0.92fr_1.08fr] overflow-hidden min-h-[260px] rounded-[1.6rem] transition-all duration-500 hover:shadow-2xl h-full cursor-pointer group bg-[#f8f0dc] border ${
        isActive ? 'border-orange-500 ring-2 ring-orange-500/25 z-10 shadow-xl shadow-orange-500/10' : 'border-white/80 hover:border-orange-300'
      }`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(249,115,22,0.14) 0%, transparent 65%)' }}
      />

      <div className="relative min-h-[170px] p-4 md:min-h-full flex flex-col justify-center bg-[#fff7e7]">
        <div className="relative mx-auto my-0 h-36 w-40 md:h-40 md:w-44">
          {service.imageUrl ? (
            <>
              <div className="absolute inset-2 rotate-[-4deg] rounded-[1.2rem] border-2 border-orange-500/80"></div>
              <img
                src={service.imageUrl}
                alt={service.title}
                className="relative h-full w-full rounded-[1.4rem] object-cover shadow-xl shadow-orange-900/15"
              />
            </>
          ) : (
            <>
              <div className="absolute inset-2 rotate-[-4deg] rounded-[1.2rem] border-2 border-orange-500/80"></div>
              <div className="absolute inset-4 rotate-[-8deg] rounded-[1.2rem] border-2 border-orange-500/80"></div>
              <div className="absolute inset-0 rounded-[2rem] bg-white/80 shadow-xl shadow-orange-900/10"></div>
              <div className={`absolute inset-6 ${service.color} rounded-[1.4rem] opacity-95 shadow-lg shadow-orange-900/20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons-outlined text-[4.2rem] text-white drop-shadow-md">{service.icon}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="relative z-10 flex flex-col p-5 md:p-6">
        <div className="flex-1">
          <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">{service.title}</h3>
          <p className="mt-3 text-xs font-medium text-slate-600 leading-relaxed">{service.desc}</p>

          <ul className="mt-4 gap-2 grid grid-cols-1">
            {service.features.slice(0, 3).map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700">
                <span className="material-icons-outlined text-[#10b981] text-lg mt-[-2px]">check</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const CidManutencao: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(categorias[0]?.servicos[0]?.id || null);

  return (
    <div className="relative min-h-screen bg-[#080a12] overflow-hidden font-sans">

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

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 py-8 pt-10">

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

        <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
          {categorias.map((cat, index) => (
            <button
              key={index}
              onClick={() => {
                setActiveCategoryIndex(index);
                if (cat.servicos.length > 0) {
                  setActiveServiceId(cat.servicos[0].id);
                }
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${
                activeCategoryIndex === index
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                  : 'bg-white/[0.03] border-emerald-500/10 text-slate-400 hover:border-emerald-500/30 hover:text-slate-200'
              }`}
            >
              <span>{cat.icone}</span>
              <span>{cat.titulo}</span>
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-2 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400">
            {categorias[activeCategoryIndex].icone} Aba {activeCategoryIndex + 1}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {categorias[activeCategoryIndex].titulo}
          </h2>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {categorias[activeCategoryIndex].servicos.map((s, si) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + si * 0.08, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ServiceCard
                service={s}
                isActive={activeServiceId === s.id}
                onSelect={() => setActiveServiceId(s.id)}
              />
            </motion.div>
          ))}
        </div>

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
