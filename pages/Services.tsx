import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

interface ServiceDetail {
  id: string;
  title: string;
  price: string;
  unit?: string;
  icon: string;
  desc: string;
  features: string[];
  fullDesc: string;
  color: string;
  isStartingPrice?: boolean;
}

const servicesData: ServiceDetail[] = [
  {
    id: 'nfc-card',
    title: 'Cartão NFC / QRCODE',
    price: '49,90',
    icon: 'credit_card',
    desc: 'O futuro do networking. Cartão físico com tecnologia de aproximação e versão digital interativa.',
    features: ['Chip NFC NTAG 213, 215', 'Link de Perfil Bio-Link', 'QR Code', 'Design exclusivo'],
    fullDesc: 'Nossa solução de Cartão NFC combina a elegância do design físico com a praticidade do digital. Ao aproximar o cartão de um smartphone, seu perfil profissional abre instantaneamente. Inclui uma versão em QR CODE para compartilhamento rápido.',
    color: 'bg-indigo-600'
  },
  {
    id: 'nfc-keychain',
    title: 'Chaveiro NFC / QRCODE',
    price: '39,90',
    icon: 'token',
    desc: 'Identificação inteligente para PETs ou chaves. Segurança e tecnologia em um só lugar.',
    features: ['Resistente à água', 'Perfis editáveis', 'Leitura universal', 'Acabamento premium'],
    fullDesc: 'Ideal para identificação de animais de estimação ou chaves importantes. O chaveiro contém um chip NFC e um QR Code gravado a laser, permitindo que qualquer pessoa acesse informações de contato ou saúde com um toque.',
    color: 'bg-emerald-500'
  },
  {
    id: 'banner-print',
    title: 'Confecção de Banner',
    price: '55,00',
    unit: 'unid',
    icon: 'branding_watermark',
    isStartingPrice: true,
    desc: 'Impressão em lona de alta resistência com acabamento profissional para fachadas e eventos.',
    features: ['Lona 440g Brilho/Fosca', 'Acabamento com Bastão e Corda', 'Resistente a Sol e Chuva', 'Impressão HD Digital'],
    fullDesc: 'Nossa impressão de banners utiliza tecnologia de grandes formatos com tintas eco-solventes de alta durabilidade. Ideal para comunicação externa e eventos, garantindo cores vivas e fidelidade visual em escalas monumentais.',
    color: 'bg-blue-500'
  },
  {
    id: 'flyer-print',
    title: 'Panfletos Impressos',
    price: '99,90',
    unit: '500 unid',
    icon: 'auto_awesome_motion',
    isStartingPrice: true,
    desc: 'Material promocional em papel couchê premium para distribuição e prospecção ativa.',
    features: ['Papel Couchê 115g/150g', 'Cores Vibrantes (4x0 ou 4x4)', 'Tamanhos 10x15cm / 15x21cm', 'Cortes Precisos'],
    fullDesc: 'Os panfletos são ferramentas essenciais para marketing local e prospecção ativa. Oferecemos impressão offset e digital com acabamento premium, garantindo que sua mensagem chegue ao cliente com o máximo de impacto visual e profissionalismo.',
    color: 'bg-rose-600'
  },
  {
    id: 'online-generators',
    title: 'Gerador On-line',
    price: '9,99',
    icon: 'auto_stories',
    isStartingPrice: true,
    desc: 'Documentos profissionais (Recibos, Orçamentos, Contratos) gerados instantaneamente via IA.',
    features: ['Recibos & Orçamentos', 'Contratos Estruturados', 'Preview em Tempo Real', 'Download em PDF'],
    fullDesc: 'Nossa plataforma de Geradores On-line utiliza inteligência artificial para redigir documentos administrativos complexos com precisão. Economize tempo e garanta que seus documentos tenham um tom profissional e polido, prontos para impressão ou envio digital.',
    color: 'bg-emerald-400'
  },
  {
    id: 'custom-docs-service',
    title: 'Documentos Personalizados',
    price: 'Sob Consulta',
    icon: 'description',
    desc: 'Geração de documentos técnicos e jurídicos sob medida para sua necessidade específica.',
    features: ['Redação Profissional', 'Formatação Premium', 'Validação Técnica', 'Entrega em Word/PDF'],
    fullDesc: 'Desenvolvemos documentos personalizados que vão além do padrão. Seja um manual de instruções complexo, um contrato de prestação de serviços específico ou relatórios técnicos de engenharia, garantimos clareza e autoridade visual.',
    color: 'bg-indigo-500'
  },
  {
    id: 'corp-support',
    title: 'Suporte Corporativo',
    price: 'Sob Consulta',
    icon: 'support_agent',
    desc: 'Atendimento técnico especializado para empresas que buscam alta disponibilidade e consultoria contínua.',
    features: ['Atendimento prioritário', 'Consultoria mensal', 'Treinamento de equipe', 'Manutenção de ativos'],
    fullDesc: 'Nosso serviço de Suporte Corporativo é desenhado para marcas que não podem parar. Oferecemos monitoramento de identidade visual, manutenção de ativos digitais e suporte técnico prioritário para garantir que sua operação visual e tecnológica funcione sem interrupções e com o máximo de performance.',
    color: 'bg-blue-800'
  },
  {
    id: 'web-systems',
    title: 'Desenvolvimento de Sistemas Web',
    price: 'Sob Consulta',
    icon: 'devices',
    desc: 'Saas, CRM, Sistemas de Gestão, Sistemas de Controle',
    features: ['SaaS de Performance', 'CRM Inteligente', 'Sistemas de Gestão', 'Sistemas de Controle'],
    fullDesc: 'Desenvolvemos sistemas web modernos e escaláveis utilizando as tecnologias mais avançadas do mercado. De plataformas SaaS complexas a sistemas de gestão internos (CRM/ERP), entregamos soluções que otimizam processos e impulsionam o crescimento tecnológico do seu negócio.',
    color: 'bg-primary-600'
  },
  {
    id: 'custom-products',
    title: 'Produtos Personalizados',
    price: 'Sob Consulta',
    icon: 'card_giftcard',
    desc: 'Brindes e itens corporativos premium com a cara da sua marca.',
    features: ['Kits corporativos', 'Impressão UV', 'Gravação a Laser', 'Materiais nobres'],
    fullDesc: 'Transformamos objetos comuns em peças de desejo. De canetas a moletons, utilizamos técnicas avançadas de personalização para garantir que sua marca seja lembrada com qualidade e sofisticação.',
    color: 'bg-amber-500'
  },
  {
    id: 'visual-comm',
    title: 'Comunicação Visual Premium',
    price: '50,00/h',
    icon: 'visibility',
    desc: 'Branding, logotipos e estrutura visual para sua empresa em alta definição.',
    features: ['Criação de Logos', 'Manual da Marca', 'Social Media Design', 'Sinalização'],
    fullDesc: 'Engenharia visual aplicada ao branding. Criamos identidades que comunicam autoridade e profissionalismo, desde a paleta de cores até a sinalização física do seu estabelecimento.',
    color: 'bg-rose-500'
  },
  {
    id: 'vinil-resinado',
    title: 'Adesivos em Vinil & Resinados',
    price: '35,00 (3 unid)',
    icon: 'design_services',
    isStartingPrice: true,
    desc: 'Adesivos em Vinil e Adesivo personalizado Resinado de alta durabilidade e acabamento premium.',
    features: ['Adesivos Automotivos', 'Personalização para Empresas', 'Recorte Eletrônico', 'Consultar Condições'],
    fullDesc: 'Trabalhamos com adesivagem técnica de alta performance. O adesivo em vinil oferece versatilidade para sinalização externa e interna, enquanto o acabamento resinado proporciona um efeito 3D sofisticado, alta proteção contra raios UV e durabilidade extrema, sendo ideal para identificação de marcas em frotas ou equipamentos premium.',
    color: 'bg-teal-500'
   },
   {
    id: 'ai-prompts',
    title: 'Prompts IA',
    price: '59,90',
    icon: 'psychology',
    desc: 'Engenharia de prompts para maximizar resultados com LLMs.',
    features: ['Prompts Otimizados', 'Contexto Profundo', 'Templates de IA', 'Consultoria'],
    fullDesc: 'Domine as IAs generativas com comandos estruturados. Desenvolvemos bibliotecas de prompts específicos para o seu nicho, garantindo respostas de alta qualidade e precisão técnica.',
    color: 'bg-purple-600'
  }
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
    <div className="space-y-6 animate-fade-in">
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
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold"
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
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.orientacao === 'Vertical' ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}
              >
                Vertical
              </button>
              <button 
                type="button"
                onClick={() => setFormData({...formData, orientacao: 'Horizontal'})}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.orientacao === 'Horizontal' ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'}`}
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
                  className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 px-4 transition-all ${formData.hasArt ? 'border-primary-500/50 bg-primary-500/5 text-primary-500 hover:bg-primary-500/10' : 'border-slate-200 dark:border-slate-800 text-slate-300 opacity-50 cursor-not-allowed'}`}
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
                  className="rounded border-slate-300 dark:border-slate-800 text-primary-500 focus:ring-primary-500 bg-transparent w-4 h-4" 
                />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary-500 transition-colors">Não tenho arte (Solicitar criação)</span>
             </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Acabamento</label>
            <select 
              value={formData.acabamento} 
              onChange={e => setFormData({...formData, acabamento: e.target.value})}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold"
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
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-xs font-bold"
            >
              {[...Array(10)].map((_, i) => <option key={i+1} value={i+1}>{i+1} Unidade{i > 0 ? 's' : ''}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
         <button 
           onClick={handleSend}
           className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
         >
           Enviar Orçamento Personalizado
           <span className="material-icons-outlined">send</span>
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
  isActive: boolean;
  onSelect: () => void;
  onShowDetails: () => void;
}> = ({ service, isActive, onSelect, onShowDetails }) => {
  return (
    <div 
      onClick={onSelect}
      className={`relative flex flex-col p-6 bg-white dark:bg-[#111827] border rounded-2xl transition-all duration-500 hover:shadow-2xl h-full cursor-pointer group ${
      isActive ? 'border-primary-500 ring-1 ring-primary-500/20 z-10' : 'border-slate-200 dark:border-white/5'
    }`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-800/80 flex items-center justify-center shadow-sm border border-slate-200 dark:border-white/5 flex-shrink-0 transition-transform group-hover:scale-110">
          <span className="material-icons-outlined text-xl text-primary-500/80 dark:text-primary-400">{service.icon}</span>
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold dark:text-white leading-tight group-hover:text-primary-500 transition-colors">{service.title}</h3>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
            {service.desc.split('.')[0]}.
          </p>
        </div>
      </div>

      <div className="mb-8 flex-1">
        <ul className="space-y-3">
          {service.features.slice(0, 4).map((feature, i) => (
            <li key={i} className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="material-icons-outlined text-[#10b981] text-lg">check</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); onShowDetails(); }}
        className="w-full py-3.5 bg-slate-900 dark:bg-[#1f2937] hover:bg-slate-800 dark:hover:bg-[#374151] text-white rounded-xl font-bold text-xs transition-all active:scale-95 flex items-center justify-center gap-3 border border-white/5"
      >
        Explorar {service.title}
        <span className="material-icons-outlined text-sm">arrow_forward</span>
      </button>
    </div>
  );
};

export const Services: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>('nfc-card');
  const [showDetailModal, setShowDetailModal] = useState<ServiceDetail | null>(null);

  // Links Sociais Reais Atualizados
  const socialLinks = {
    whatsapp: () => window.open('https://wa.me/5571984184782', '_blank'),
    instagram: () => window.open('https://instagram.com/cidengenharia', '_blank'),
    facebook: () => window.open('https://facebook.com/cididentidadevisual', '_blank'),
    linkedin: () => window.open('https://linkedin.com/in/sidneysales', '_blank'),
    youtube: () => window.open('https://youtube.com/@cidengenharia', '_blank'),
    x: () => window.open('https://x.com/cidengenharia', '_blank'),
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] pb-32 relative">
      <section className="max-w-7xl mx-auto px-8 pt-36 md:pt-48 text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-500 mb-4">
          CidVisual Studio
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase font-display leading-none">
          Soluções em <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-emerald-400 italic">Engenharia 360°</span>
        </h1>
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Transforme dados em experiências visuais que inspiram confiança e aceleram decisões. 
            Escolha o serviço ideal para impulsionar seu networking e sua marca.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map(service => (
            <ServiceCard 
              key={service.id}
              service={service}
              isActive={activeId === service.id}
              onSelect={() => setActiveId(service.id)}
              onShowDetails={() => setShowDetailModal(service)}
            />
          ))}
        </div>
      </section>

      {showDetailModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setShowDetailModal(null)}></div>
          
          <div className={`relative bg-white dark:bg-slate-900 w-full rounded-[3rem] overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10 transition-all duration-500 ${showDetailModal.id === 'banner-print' ? 'max-w-4xl' : 'max-w-2xl'}`}>
             <div className="md:w-5/12 hidden md:block relative bg-slate-50 dark:bg-[#020617] border-r border-slate-100 dark:border-white/5">
                <div className={`absolute top-0 right-0 w-32 h-32 ${showDetailModal.color} opacity-10 blur-[80px]`}></div>
                <div className="absolute inset-0 engineering-grid opacity-5"></div>
                <div className="relative h-full flex flex-col justify-center items-center p-12 text-center space-y-6">
                   <div className="w-24 h-24 rounded-3xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-xl border border-slate-100 dark:border-white/10">
                     <span className="material-icons-outlined text-5xl text-primary-500">{showDetailModal.icon}</span>
                   </div>
                   <div>
                     <h2 className="text-3xl font-bold dark:text-white leading-tight">{showDetailModal.title}</h2>
                     <p className="text-primary-500/80 text-[10px] font-black uppercase tracking-widest mt-2">Especificação Técnica</p>
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
                           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Detalhes do Serviço</span>
                           <h3 className="text-2xl font-bold dark:text-white">Sobre este Projeto</h3>
                         </div>
                         <button onClick={() => setShowDetailModal(null)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-red-500 transition-colors">
                           <span className="material-icons-outlined">close</span>
                         </button>
                       </div>
                       
                       <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-10">
                         {showDetailModal.fullDesc}
                       </p>
                       
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-10">
                         {showDetailModal.features.map((f, i) => (
                           <div key={i} className="flex items-start gap-3">
                             <span className="material-icons-outlined text-[#10b981] text-lg mt-0.5">check</span>
                             <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{f}</span>
                           </div>
                         ))}
                       </div>
                    </div>
                   
                   <div className="flex gap-4">
                      {showDetailModal.id === 'online-generators' ? (
                        <Link 
                          to="/generators" 
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                        >
                          Acessar Gerador
                        </Link>
                      ) : (
                        <Link 
                          to="/quote" 
                          className="flex-1 bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs text-center shadow-lg shadow-primary-500/20 transition-all active:scale-95"
                        >
                          Solicitar Orçamento
                        </Link>
                      )}
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

      <section className="max-w-7xl mx-auto px-8 mt-32 grid md:grid-cols-2 gap-8">
         <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white engineering-grid relative overflow-hidden group">
            <div className="relative z-10">
               <span className="material-icons-outlined text-4xl mb-4 text-primary-500">auto_awesome</span>
               <h3 className="text-2xl font-bold mb-2 uppercase font-display tracking-tight">Potencialize com IA</h3>
               <p className="text-slate-400 text-sm mb-6 max-w-sm">Nossas soluções agora contam com integração nativa de Inteligência Artificial para acelerar processos criativos e técnicos.</p>
               <Link to="/generators" className="flex items-center gap-2 font-bold text-primary-500 hover:text-white transition-colors group">
                  Explorar Geradores
                  <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">bolt</span>
               </Link>
            </div>
         </div>

         <div className="bg-primary-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
            <div className="relative z-10">
               <span className="material-icons-outlined text-4xl mb-4 text-white">contact_page</span>
               <h3 className="text-2xl font-bold mb-2 uppercase font-display tracking-tight">DyCard Premium</h3>
               <p className="text-primary-100 text-sm mb-6 max-w-sm">O Cartão NFC é apenas o começo. Descubra como o ecossistema DyCard pode revolucionar seu networking.</p>
               <Link to="/digital-card" className="flex items-center gap-2 font-bold text-white hover:underline transition-colors group">
                  Ver Modelos
                  <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
               </Link>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
         </div>
      </section>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </div>
  );
};
