import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const bgBubbles = [
  { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(109,40,217,0.4)', delay: 0, duration: 8 },
  { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(139,92,246,0.3)', delay: 2, duration: 12 },
  { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(167,139,250,0.35)', delay: 1, duration: 10 },
  { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(124,58,237,0.3)', delay: 3, duration: 15 },
  { size: 'w-[20%] h-[20%]', pos: 'top-[50%] right-[20%]', color: 'rgba(99,102,241,0.25)', delay: 5, duration: 18 },
];

interface ServiceDetail {
  id: string;
  title: string;
  price?: string;
  unit?: string;
  icon: string;
  imageUrl?: string;
  desc: string;
  features: string[];
  fullDesc: string;
  color: string;
  isStartingPrice?: boolean;
}

interface Categoria {
  titulo: string;
  icone: string;
  servicos: ServiceDetail[];
}

const categorias: Categoria[] = [
  {
    titulo: 'Gráfica & Cópias',
    icone: '🖨️',
    servicos: [
      {
        id: 'copia-pb',
        title: 'Cópia Preto e Branco',
        icon: 'print',
        imageUrl: '/cidvisual-grafica-pb.png',
        desc: 'Impressão monocromática de alta qualidade para documentos e materiais.',
        features: ['Impressão rápida', 'Papel sulfite 75g/90g', 'Alta definição', 'Ideal para apostilas'],
        fullDesc: 'Impressão monocromática de alta precisão ideal para apostilas, relatórios, trabalhos acadêmicos e documentos gerais. Garantia de leitura nítida e alta velocidade de entrega.',
        color: 'bg-violet-600'
      },
      {
        id: 'copia-color',
        title: 'Cópia Colorida / Análise',
        icon: 'print',
        imageUrl: '/cidvisual-grafica-colorida.png',
        desc: 'Impressão colorida fiel com análise de qualidade incluída.',
        features: ['Fidelidade de cores', 'Papel offset e couchê', 'Análise de contraste', 'Ideal para apresentações'],
        fullDesc: 'Impressão colorida de alta fidelidade com análise prévia de contraste e resolução. Perfeita para apresentações corporativas, portfólios, cartazes e materiais ricos em imagens.',
        color: 'bg-violet-600'
      },
      {
        id: 'xerox',
        title: 'Xerox',
        icon: 'content_copy',
        imageUrl: '/cidvisual-grafica-xerox.png',
        desc: 'Reprodução rápida de documentos com tecnologia de última geração.',
        features: ['Cópia instantânea', 'Vidro plano para livros', 'Frente e verso automático', 'Redução e ampliação'],
        fullDesc: 'Serviço rápido de fotocópia de documentos, livros, certidões e contratos. Equipamentos modernos que preservam a legibilidade do documento original com máxima fidelidade.',
        color: 'bg-violet-600'
      },
      {
        id: 'flyer-print',
        title: 'Panfletos Impressos',
        price: '99,90',
        unit: '500 unid',
        icon: 'auto_awesome_motion',
        imageUrl: '/cidvisual-grafica-panfletos.png',
        isStartingPrice: true,
        desc: 'Material promocional em papel couchê premium para distribuição e prospecção ativa.',
        features: ['Papel Couchê 115g/150g', 'Cores Vibrantes (4x0 ou 4x4)', 'Tamanhos 10x15cm / 15x21cm', 'Cortes Precisos'],
        fullDesc: 'Os panfletos são ferramentas essenciais para marketing local e prospecção ativa. Oferecemos impressão offset e digital com acabamento premium, garantindo que sua mensagem chegue ao cliente com o máximo de impacto visual e profissionalismo.',
        color: 'bg-rose-600'
      }
    ],
  },
  {
    titulo: 'Produtos Personalizados',
    icone: '🎁',
    servicos: [
      {
        id: 'canecas',
        title: 'Canecas Personalizadas',
        icon: 'local_cafe',
        imageUrl: '/cidvisual-produto-caneca.png',
        desc: 'Canecas com sua arte, logo ou foto em alta resolução.',
        features: ['Porcelana premium', 'Resistente a micro-ondas', 'Sublimação HD', 'Caixinha inclusa'],
        fullDesc: 'Canecas de porcelana de alta qualidade personalizadas por sublimação. Perfeitas para presentes, brindes corporativos e uso diário. Resistentes ao calor e lavagens frequentes.',
        color: 'bg-violet-600'
      },
      {
        id: 'camisetas',
        title: 'Camisetas',
        icon: 'checkroom',
        imageUrl: '/cidvisual-produto-camiseta.png',
        desc: 'Estampas personalizadas em diversos modelos e tamanhos.',
        features: ['Algodão ou Poliéster', 'Sublimação ou Silk', 'Cores duráveis', 'Costura reforçada'],
        fullDesc: 'Camisetas personalizadas com estampas de alta definição. Oferecemos tecidos confortáveis e técnicas de estamparia modernas que resistem a lavagens sem rachar ou desbotar.',
        color: 'bg-violet-600'
      },
      {
        id: 'porta-retratos',
        title: 'Porta-Retratos',
        icon: 'filter_b&w',
        imageUrl: '/cidvisual-produto-porta-retrato.png',
        desc: 'Molduras e porta-retratos com impressão personalizada.',
        features: ['Tamanhos variados', 'Madeira ou acrílico', 'Foto inclusa', 'Acabamento elegante'],
        fullDesc: 'Molduras de alto padrão com fotos impressas em papel fotográfico de alta durabilidade. Uma forma elegante de preservar momentos ou presentear pessoas especiais.',
        color: 'bg-violet-600'
      },
      {
        id: 'garrafas-squize',
        title: 'Garrafas Squize',
        icon: 'sports_bar',
        imageUrl: '/cidvisual-produto-squeeze.png',
        desc: 'Garrafas esportivas com personalização completa.',
        features: ['Alumínio ou inox', 'Bico antivazamento', 'Sublimação colorida', 'Mantém a temperatura'],
        fullDesc: 'Squeeze esportivo personalizado, ideal para academias, escritórios e brindes corporativos. Material resistente e personalização de alta durabilidade.',
        color: 'bg-violet-600'
      },
    ],
  },
  {
    titulo: 'Comunicação Visual',
    icone: '📢',
    servicos: [
      {
        id: 'banner-print',
        title: 'Confecção de Banner',
        price: '55,00',
        unit: 'unid',
        icon: 'branding_watermark',
        imageUrl: '/cidvisual-comunicacao-banner.png',
        isStartingPrice: true,
        desc: 'Impressão em lona de alta resistência com acabamento profissional para fachadas e eventos.',
        features: ['Lona 440g Brilho/Fosca', 'Acabamento com Bastão e Corda', 'Resistente a Sol e Chuva', 'Impressão HD Digital'],
        fullDesc: 'Nossa impressão de banners utiliza tecnologia de grandes formatos com tintas eco-solventes de alta durabilidade. Ideal para comunicação externa e eventos, garantindo cores vivas e fidelidade visual em escalas monumentais.',
        color: 'bg-blue-500'
      },
      {
        id: 'visual-comm',
        title: 'Backdrop Personalizado',
        price: '50,00/h',
        icon: 'visibility',
        imageUrl: '/cidvisual-comunicacao-backdrop.png',
        desc: 'Painéis personalizados para eventos, fotos, ativações de marca e cenários promocionais.',
        features: ['Acabamento com ilhós', 'Estrutura sob medida', 'Impressão em lona HD', 'Ideal para eventos'],
        fullDesc: 'Backdrops personalizados para eventos, recepções, lançamentos e ações promocionais. Produzimos painéis com impressão em alta definição, acabamento reforçado e leitura visual profissional para destacar sua marca em fotos e ambientes.',
        color: 'bg-rose-500'
      },
      {
        id: 'faixa',
        title: 'Faixa',
        icon: 'width_full',
        imageUrl: '/cidvisual-comunicacao-faixa.png',
        desc: 'Faixas em múltiplos tamanhos para eventos, comércios e promoções.',
        features: ['Lona reforçada', 'Acabamento com ilhós', 'Cores vibrantes', 'Tamanhos sob medida'],
        fullDesc: 'Faixas em lona para divulgação rápida de promoções, inaugurações, eventos e avisos. Fácil instalação e alta visibilidade para atrair clientes.',
        color: 'bg-violet-600'
      },
      {
        id: 'cavalete',
        title: 'Cavalete',
        icon: 'art_track',
        imageUrl: '/cidvisual-comunicacao-cavalete.png',
        desc: 'Cavaletes personalizados para pontos de venda e eventos.',
        features: ['Estrutura de madeira/metal', 'Dupla face', 'Lona de alta resistência', 'Fácil transporte'],
        fullDesc: 'Cavalete promocional dupla face, ideal para calçadas, sinalização de entrada e direcionamento de fluxo de clientes. Estrutura estável e lona impermeável.',
        color: 'bg-violet-600'
      }
    ],
  },
  {
    titulo: 'Aplicação & Plotagem',
    icone: '✂️',
    servicos: [
      {
        id: 'adesivos-vinil',
        title: 'Adesivos Vinil',
        icon: 'sticky_note_2',
        imageUrl: '/cidvisual-plotagem-adesivos.png',
        desc: 'Adesivos de alta durabilidade para carros, vidros, paredes e produtos.',
        features: ['Vinil impermeável', 'Corte especial', 'Resistente a UV', 'Acabamento personalizado'],
        fullDesc: 'Adesivos de vinil com recorte eletrônico personalizados para rótulos, brindes, embalagens, carros, fachadas e superfícies diversas. Produção com alta definição, resistência à água e acabamento limpo.',
        color: 'bg-violet-600'
      },
      {
        id: 'plotagem',
        title: 'Plotagem',
        icon: 'layers',
        imageUrl: '/cidvisual-plotagem-veiculos.png',
        desc: 'Plotagem para veículos, fachadas, vitrines e comunicação externa personalizada.',
        features: ['Recorte de precisão', 'Vinil fosco ou brilho', 'Aplicação técnica', 'Alta durabilidade'],
        fullDesc: 'Serviço de plotagem de recorte ou impressão para veículos, frotas, fachadas, vitrines e decoração de ambientes. Aplicação com máxima precisão para destacar marcas e sinalizações com acabamento profissional.',
        color: 'bg-violet-600'
      },
      {
        id: 'plotagem-geladeiras',
        title: 'Plotagem em Geladeiras',
        icon: 'design_services',
        imageUrl: '/cidvisual-plotagem-geladeiras.png',
        desc: 'Renovação visual de geladeiras com vinil adesivo colorido, fosco ou brilhante.',
        features: ['Vinil decorativo', 'Cores variadas', 'Aplicação sob medida', 'Acabamento renovado'],
        fullDesc: 'Plotagem em geladeiras para renovar, personalizar ou padronizar equipamentos comerciais e residenciais. Utilizamos vinil de alta aderência com acabamento colorido, fosco ou brilhante para transformar o visual da peça.',
        color: 'bg-teal-500'
      },
      {
        id: 'plotagem-vidros',
        title: 'Plotagem em Vidros',
        icon: 'window',
        imageUrl: '/cidvisual-plotagem-vidros.png',
        desc: 'Aplicação em portas, divisórias e vitrines com comunicação visual sob medida.',
        features: ['Vinil jateado ou impresso', 'Instalação alinhada', 'Privacidade visual', 'Ideal para empresas'],
        fullDesc: 'Plotagem em vidros para portas, vitrines, divisórias e fachadas. A solução pode reforçar a identidade da marca, criar privacidade e transformar áreas envidraçadas em pontos de comunicação visual com acabamento profissional.',
        color: 'bg-sky-500'
      }
    ],
  },
];

const BannerConfigurator: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    formato: '50x70cm',
    orientacao: 'Vertical',
    material: 'Lona 380gr , brilhante',
    acabamento: 'Bastão de madeira com ponteira plástica e cordão',
    quantidade: '1',
    hasArt: true,
    fileName: ''
  });

  const fileRef = useRef<HTMLInputElement>(null);

  const formats = [
    '50x70cm', '60x90cm', '60x145cm', '80x120cm', '80x145cm', 
    '90x120cm (ABNT Acadêmico)', '90x145cm', '90x180cm', '90x250cm', 
    '90x300cm', '140x200cm', '140x250cm', '140x300cm'
  ];

  const handleSend = () => {
    const message = `Olá! Gostaria de um orçamento para Confecção de Banner:
*Formato:* ${formData.formato}
*Orientação:* ${formData.orientacao}
*Material:* ${formData.material}
*Arte:* ${formData.hasArt ? `Tenho arte (${formData.fileName || 'Arquivo selecionado'})` : 'Não tenho arte'}
*Acabamento:* ${formData.acabamento}
*Quantidade:* ${formData.quantidade} unid.
    `;
    window.open(`https://wa.me/5571984184782?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in text-left">
      <div className="space-y-2">
        <h2 className="text-2xl font-black uppercase font-display dark:text-white">Confecção de Banner</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
          Selecione o Formato, Material e Quantidade solicitada. <br/>
          Configure agora de acordo com sua necessidade, escolha as opções disponíveis e a quantidade desejada, em seguida é só enviar que retornaremos um orçamento personalizado.
        </p>
        <div className="flex items-center gap-2 text-emerald-500 font-bold text-[10px] uppercase tracking-widest bg-emerald-500/10 w-fit px-3 py-1 rounded-full border border-emerald-500/20">
          <span className="material-icons-outlined text-xs">schedule</span>
          Prazo de produção: de 1 a 3 dias úteis + frete ou deslocamento
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Formato</label>
            <select 
              value={formData.formato} 
              onChange={e => setFormData({...formData, formato: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Orientação</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setFormData({...formData, orientacao: 'Vertical'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.orientacao === 'Vertical' ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}
              >
                Vertical
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, orientacao: 'Horizontal'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.orientacao === 'Horizontal' ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}
              >
                Horizontal
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Material</label>
          <input 
            type="text" readOnly value={formData.material}
            className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none text-slate-500 text-xs font-bold"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Arte e Design de Cores</label>
          <div className="flex flex-col gap-3">
             <div className="flex items-center gap-4">
                <button 
                  onClick={() => fileRef.current?.click()}
                  disabled={!formData.hasArt}
                  className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 px-4 transition-all ${formData.hasArt ? 'border-violet-500/50 bg-violet-500/5 text-violet-500 hover:bg-violet-500/10' : 'border-slate-200 dark:border-slate-800 text-slate-300 opacity-50 cursor-not-allowed'}`}
                >
                  <span className="material-icons-outlined">cloud_upload</span>
                  <span className="text-xs font-bold uppercase">{formData.fileName || 'Enviar Arte'}</span>
                </button>
                <input 
                  type="file" ref={fileRef} hidden 
                  onChange={e => setFormData({...formData, fileName: e.target.files?.[0]?.name || ''})}
                />
             </div>
             <label className="flex items-center gap-2 cursor-pointer group w-fit">
                <input 
                  type="checkbox" checked={!formData.hasArt} 
                  onChange={e => setFormData({...formData, hasArt: !e.target.checked, fileName: ''})}
                  className="rounded border-slate-300 dark:border-slate-800 text-violet-500 focus:ring-violet-500 bg-transparent w-4 h-4" 
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-violet-500 transition-colors">Não tenho arte (Solicitar criação)</span>
             </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Acabamento</label>
            <select 
              value={formData.acabamento} 
              onChange={e => setFormData({...formData, acabamento: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              <option>Bastão de madeira com ponteira plástica e cordão</option>
              <option>Moldura de madeira</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Quantidade</label>
            <select 
              value={formData.quantidade} 
              onChange={e => setFormData({...formData, quantidade: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
            >
              {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Unidade{i > 0 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
         <button 
           onClick={handleSend}
           className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-violet-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
         >
           Enviar Orçamento Personalizado
           <span className="material-icons-outlined text-sm">send</span>
         </button>
         <button 
           onClick={onClose}
           className="px-6 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
         >
           Cancelar
         </button>
      </div>
    </div>
  );
};
const ServiceCard: React.FC<{
  service: ServiceDetail;
  categoryTitle: string;
  isActive: boolean;
  onSelect: () => void;
  onShowDetails: () => void;
}> = ({ service, categoryTitle, isActive, onSelect, onShowDetails }) => {
  const isCompactCategory = categoryTitle === 'Gráfica & Cópias' || categoryTitle === 'Produtos Personalizados' || categoryTitle === 'Comunicação Visual' || categoryTitle === 'Aplicação & Plotagem';

  return (
    <div 
      onClick={onSelect}
      className={`relative grid grid-cols-1 md:grid-cols-[0.92fr_1.08fr] overflow-hidden ${isCompactCategory ? 'min-h-[260px]' : 'min-h-[330px]'} rounded-[1.6rem] transition-all duration-500 hover:shadow-2xl h-full cursor-pointer group bg-[#f8f0dc] border ${
      isActive ? 'border-orange-500 ring-2 ring-orange-500/25 z-10 shadow-xl shadow-orange-500/10' : 'border-white/80 hover:border-orange-300'
    }`}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top left, rgba(249,115,22,0.14) 0%, transparent 65%)' }} />

      <div className={`relative ${isCompactCategory ? 'min-h-[170px] p-4' : 'min-h-[220px] p-6'} md:min-h-full flex flex-col justify-center bg-[#fff7e7]`}>
        {!isCompactCategory && (
          <div className="flex items-center justify-between gap-3">
            <span className="text-[10px] font-black uppercase tracking-[0.16em] text-orange-600">
              {categoryTitle}
            </span>
            {service.price && (
              <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
                {service.isStartingPrice ? 'A partir' : 'Valor'} R$ {service.price}
              </span>
            )}
          </div>
        )}

        {isCompactCategory && service.price && (
          <div className="absolute left-4 top-4 z-10">
            <span className="rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
              {service.isStartingPrice ? 'A partir' : 'Valor'} R$ {service.price}
            </span>
          </div>
        )}

        <div className={`relative mx-auto ${isCompactCategory ? 'my-0 h-36 w-40 md:h-40 md:w-44' : 'my-4 h-40 w-44 md:h-48 md:w-52'}`}>
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
              <div className="absolute inset-4 rotate-[-8deg] rounded-[1.2rem] border-2 border-orange-500/80"></div>
              <div className="absolute inset-0 rounded-[2rem] bg-white/80 shadow-xl shadow-orange-900/10"></div>
              <div className={`absolute inset-6 ${service.color} rounded-[1.4rem] opacity-95 shadow-lg shadow-orange-900/20`}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="material-icons-outlined text-[4.2rem] text-white drop-shadow-md">{service.icon}</span>
              </div>
            </>
          )}
        </div>

        {!isCompactCategory && (
          <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.16em] text-orange-500">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
            Modelo do serviço
          </div>
        )}
      </div>

      <div className={`relative z-10 flex flex-col ${isCompactCategory ? 'p-5 md:p-6' : 'p-6 md:p-7'}`}>
        <div className="flex-1">
          <h3 className={`${isCompactCategory ? 'text-xl' : 'text-2xl'} font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors`}>{service.title}</h3>
          <p className={`${isCompactCategory ? 'mt-3 text-xs' : 'mt-4 text-sm'} font-medium text-slate-600 leading-relaxed`}>
            {service.desc}
          </p>

          <ul className={`${isCompactCategory ? 'mt-4 gap-2' : 'mt-6 gap-3'} grid grid-cols-1`}>
            {service.features.slice(0, isCompactCategory ? 3 : 4).map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-xs font-bold text-slate-700">
                <span className="material-icons-outlined text-[#10b981] text-lg mt-[-2px]">check</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {!isCompactCategory && (
          <button 
            onClick={(e) => { e.stopPropagation(); onShowDetails(); }}
            className="mt-7 w-full py-3.5 bg-slate-950 hover:bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 flex items-center justify-center gap-3 relative z-10"
          >
            Ver Detalhes
            <span className="material-icons-outlined text-sm">arrow_forward</span>
          </button>
        )}
      </div>
    </div>
  );
};

export const CidVisual: React.FC = () => {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState<ServiceDetail | null>(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number>(0);
  const [activeServiceId, setActiveServiceId] = useState<string | null>(categorias[0]?.servicos[0]?.id || null);

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
            className="inline-flex items-center gap-2 text-slate-400 hover:text-violet-400 text-xs tracking-wide transition-all mb-12 group"
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-[10px] uppercase tracking-widest text-violet-400 mb-6 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            Identidade Visual & Gráfica
          </div>

          <div className="flex items-center gap-4 mb-4 justify-center md:justify-start">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-3xl"
            >
              🎨
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-6xl tracking-tight leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-purple-400">Cid</span>
                <span className="text-white">Visual</span>
              </h1>
              <div className="h-0.5 mt-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 w-24" />
            </div>
          </div>

          <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed mx-auto md:mx-0">
            Soluções completas em comunicação visual, gráfica e produtos personalizados.
            Transformamos sua identidade em materiais de impacto real.
          </p>
        </motion.div>

        {/* SELETOR DE CATEGORIAS (TABS) */}
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
                  ? 'bg-violet-600 border-violet-600 text-white shadow-lg shadow-violet-600/30'
                  : 'bg-white/[0.03] border-violet-500/10 text-slate-400 hover:border-violet-500/30 hover:text-slate-200'
              }`}
            >
              <span>{cat.icone}</span>
              <span>{cat.titulo}</span>
            </button>
          ))}
        </div>

        {/* SERVIÇOS DA ABA */}
        <div className="mb-6 flex flex-col gap-2 text-center md:text-left">
          <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-400">
            {categorias[activeCategoryIndex].icone} Aba {activeCategoryIndex + 1}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white">
            {categorias[activeCategoryIndex].titulo}
          </h2>
          {categorias[activeCategoryIndex].titulo !== 'Gráfica & Cópias' && categorias[activeCategoryIndex].titulo !== 'Produtos Personalizados' && (
            <p className="text-sm text-slate-400 max-w-2xl">
              Escolha um modelo e veja a descrição do serviço ao lado, separados por categoria.
            </p>
          )}
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
                categoryTitle={categorias[activeCategoryIndex].titulo}
                isActive={activeServiceId === s.id}
                onSelect={() => setActiveServiceId(s.id)}
                onShowDetails={() => setShowDetailModal(s)}
              />
            </motion.div>
          ))}
        </div>

        {/* CTA CONTATO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-14 text-center"
        >
          <p className="text-slate-400 text-sm mb-5">Precisa de um orçamento? Entre em contato agora!</p>
          <a
            href="https://wa.me/5571984184782?text=Olá! Gostaria de um orçamento para serviços do CidVisual."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-violet-700 hover:bg-violet-600 text-white text-sm tracking-wide rounded-xl shadow-lg shadow-violet-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Solicitar Orçamento
          </a>
        </motion.div>

        {/* Rodapé */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-14 text-center text-[10px] tracking-widest text-slate-600 lowercase"
        >
          {'{ cidvisual — identidade visual & gráfica }'}
        </motion.p>
      </div>

      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowDetailModal(null)}></div>
          
          <div className={`relative bg-white dark:bg-slate-900 w-full rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 transition-all duration-500 ${showDetailModal.id === 'banner-print' ? 'max-w-4xl' : 'max-w-2xl'}`}>
             <div className="md:w-5/12 hidden md:block relative bg-slate-50 dark:bg-[#020617] border-r border-slate-100 dark:border-white/5">
                <div className={`absolute top-0 right-0 w-32 h-32 ${showDetailModal.color} opacity-10 blur-[80px]`}></div>
                <div className="absolute inset-0 engineering-grid opacity-5"></div>
                <div className="relative h-full flex flex-col justify-center items-center p-12 text-center space-y-6">
                   {showDetailModal.imageUrl ? (
                     <img
                       src={showDetailModal.imageUrl}
                       alt={showDetailModal.title}
                       className="h-44 w-full rounded-[2rem] object-cover shadow-xl border border-slate-100 dark:border-white/10"
                     />
                   ) : (
                     <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border border-slate-100 dark:border-white/10">
                       <span className="material-icons-outlined text-5xl text-violet-500">{showDetailModal.icon}</span>
                     </div>
                   )}
                   <div>
                     <h2 className="text-3xl font-bold dark:text-white leading-tight">{showDetailModal.title}</h2>
                     <p className="text-violet-500/80 text-[10px] font-black uppercase tracking-widest mt-2">Especificação Técnica</p>
                   </div>
                </div>
             </div>
             
             <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
                {showDetailModal.id === 'banner-print' ? (
                  <BannerConfigurator onClose={() => setShowDetailModal(null)} />
                ) : (
                  <>
                    <div>
                       <div className="flex justify-between items-start mb-8">
                         <div className="space-y-1">
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">Detalhes do Serviço</span>
                           <h3 className="text-2xl font-bold dark:text-white">Sobre este Projeto</h3>
                         </div>
                         <button onClick={() => setShowDetailModal(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                           <span className="material-icons-outlined">close</span>
                         </button>
                       </div>
                       
                       <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-10 text-left">
                         {showDetailModal.fullDesc}
                       </p>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10 text-left">
                         {showDetailModal.features.map((f, i) => (
                           <div key={i} className="flex items-start gap-3">
                             <span className="material-icons-outlined text-[#10b981] text-lg mt-0.5">check</span>
                             <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{f}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                    
                    <div className="flex gap-4">
                       <Link 
                         to="/quote" 
                         className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center shadow-lg shadow-violet-600/20 transition-all active:scale-95"
                       >
                         Solicitar Orçamento
                       </Link>
                       <a 
                         href={`https://wa.me/5571984184782?text=Tenho%20interesse%20no%20servi%C3%A7o%20${encodeURIComponent(showDetailModal.title)}`}
                         target="_blank"
                         className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-900 dark:text-white hover:bg-slate-200 transition-all"
                       >
                         <span className="material-icons-outlined">chat</span>
                       </a>
                    </div>
                  </>
                )}
             </div>
          </div>
        </div>
      )}

      <style>{`
        .engineering-grid {
          background-size: 20px 20px;
          background-image: 
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        }
        .dark .engineering-grid {
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
