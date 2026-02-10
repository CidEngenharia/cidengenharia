import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

export const Quote: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    services: [] as string[],
    budget: '',
    message: '',
    fileName: ''
  });

  // Sincronizado exatamente com Services.tsx
  const servicesList = [
    { id: 'nfc-card', label: 'Cartão NFC / Digital PDF', desc: 'Networking com tecnologia NFC' },
    { id: 'nfc-keychain', label: 'Chaveiro NFC / QRCODE', desc: 'Identificação inteligente e segura' },
    { id: 'banner-print', label: 'Impressão de Banner', desc: 'Sinalização em grandes formatos' },
    { id: 'flyer-print', label: 'Impressão de Panfletos', desc: 'Material promocional em escala' },
    { id: 'corp-support', label: 'Suporte Corporativo', desc: 'Consultoria e manutenção técnica' },
    { id: 'fiber-metal', label: 'Peças em Fibra & Metal', desc: 'Manufatura técnica personalizada' },
    { id: 'custom-products', label: 'Produtos Personalizados', desc: 'Brindes premium e kits corporativos' },
    { id: 'visual-comm', label: 'Comunicação Visual Premium', desc: 'Branding, logos e sinalização em alta definição' },
    { id: 'part-custom', label: 'Customização de Peças', desc: 'Engenharia visual aplicada' },
    { id: 'gps-button', label: 'Botão Localizador GPS', desc: 'Segurança e rastreio inteligente' },
    { id: 'ai-prompts', label: 'Prompts IA', desc: 'Otimização de fluxos com engenharia de comandos' },
    { id: 'custom-doc', label: 'Geração de documento personalizado', desc: 'Documentos técnicos sob medida' }
  ];

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(s => s !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, fileName: file.name }));
    }
  };

  const handleAIGenerate = async () => {
    if (formData.services.length === 0) {
      alert("Por favor, selecione ao menos um serviço para que a IA possa te auxiliar.");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const selectedLabels = servicesList
        .filter(s => formData.services.includes(s.id))
        .map(s => s.label)
        .join(', ');

      const prompt = `Você é um engenheiro visual sênior do CidVisual Studio. 
      Um cliente quer solicitar um orçamento para os seguintes serviços: ${selectedLabels}.
      Escreva uma descrição técnica, profissional e inspiradora (em português) em um único parágrafo curto que o cliente possa usar para descrever a visão do projeto dele. 
      Se houver serviços de "Fibra & Metal", mencione a durabilidade e o rigor técnico. Se houver "NFC", mencione a inovação na conexão.
      Se houver "Banner" ou "Panfletos", mencione o alto impacto visual e qualidade de impressão.
      Retorne APENAS o texto sugerido, sem introduções.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const generatedText = response.text || '';
      setFormData(prev => ({ ...prev, message: generatedText.trim() }));
    } catch (error) {
      console.error("Erro ao gerar texto com IA:", error);
      alert("Houve um problema ao conectar com o Assistente IA. Verifique sua conexão e tente novamente.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const selectedServicesNames = servicesList
      .filter(s => formData.services.includes(s.id))
      .map(s => s.label)
      .join(', ');

    const emailBody = `
Solicitação de Orçamento - CidVisual Studio
-------------------------------------------
Nome: ${formData.name}
Email: ${formData.email}
WhatsApp: ${formData.phone}
Empresa: ${formData.company || 'N/A'}
Serviços: ${selectedServicesNames}
Ideia do Projeto: ${formData.message}
Arquivo Anexo: ${formData.fileName || 'Nenhum'}
-------------------------------------------
    `;

    const mailtoUrl = `mailto:sidney.sales@gmail.com?subject=Orçamento: ${formData.name}&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      const waMessage = `Olá Sidney! Meu nome é ${formData.name}. Acabei de enviar um orçamento pelo site para: ${selectedServicesNames}. Meu WhatsApp para contato é ${formData.phone}.`;
      const waUrl = `https://wa.me/5571984184782?text=${encodeURIComponent(waMessage)}`;
      window.open(waUrl, '_blank');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 lg:py-16">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800">
        
        {/* Lado Esquerdo - Info: Fundo bg-slate-900 (igual sidebar) no dia, bg-slate-950 na noite */}
        <div className="lg:w-5/12 bg-slate-900 dark:bg-slate-950 relative flex flex-col justify-between p-12 text-white engineering-grid overflow-hidden transition-colors duration-500">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-primary-500/20">
              <span className="material-icons-outlined">engineering</span>
            </div>
            <h2 className="text-4xl font-black mb-6 font-display leading-tight uppercase tracking-tighter">
              Engenharia Visual de <span className="text-primary-500 italic">Alta Performance</span>.
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed mb-8">
              Preencha os detalhes e nossa equipe (apoiada por IA) analisará a viabilidade técnica do seu projeto em tempo recorde.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            <div className="h-px w-full bg-slate-800"></div>
            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-slate-500">
              <span className="text-primary-500">●</span> Salvador, BA
              <span className="text-primary-500">●</span> Atendimento Global
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-80"></div>
        </div>

        {/* Lado Direito - Form */}
        <div className="lg:w-7/12 p-8 md:p-12">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">Nome Completo</label>
                <input 
                  type="text" required value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">E-mail Profissional</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="seu@contato.com"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">WhatsApp / Telefone</label>
                <input 
                  type="tel" required value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">Empresa (Opcional)</label>
                <input 
                  type="text" value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="Nome da sua marca ou empresa"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Serviços de Interesse</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map(service => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceToggle(service.id)}
                    className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all group ${
                      formData.services.includes(service.id)
                        ? 'bg-primary-500 border-primary-500 text-white shadow-lg shadow-primary-500/20'
                        : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-primary-500/50'
                    }`}
                  >
                    <span className={`text-[11px] font-black uppercase mb-1 ${formData.services.includes(service.id) ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {service.label}
                    </span>
                    <span className={`text-[9px] font-medium leading-tight ${formData.services.includes(service.id) ? 'text-white/80' : 'text-slate-500'}`}>
                      {service.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Fale-me sobre a ideia de seu Projeto</label>
              <textarea 
                rows={5} required value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full rounded-[2rem] border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white p-6 focus:border-primary-500 outline-none text-sm font-medium transition-all"
                placeholder="Qual o seu desafio hoje? Seja detalhista..."
              ></textarea>
              
              {/* Botões de Ação Abaixo do Textarea */}
              <div className="flex flex-wrap items-center gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                
                <button 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                >
                  <span className="material-icons-outlined text-lg">attach_file</span>
                  {formData.fileName ? formData.fileName : 'Anexar Referência'}
                </button>

                <button 
                  type="button"
                  onClick={handleAIGenerate}
                  disabled={isGeneratingAI}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${
                    isGeneratingAI 
                      ? 'bg-purple-100 text-purple-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isGeneratingAI ? (
                    <span className="material-icons-outlined animate-spin text-lg">sync</span>
                  ) : (
                    <span className="material-icons-outlined text-lg">auto_awesome</span>
                  )}
                  {isGeneratingAI ? 'IA Analisando...' : 'Suporte Assistente IA'}
                </button>
              </div>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1">
                * O Assistente IA ajuda a redigir seu projeto baseado nos serviços marcados acima.
              </p>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-primary-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[11px]"
            >
              {isSubmitting ? 'Processando Engenharia...' : 'Enviar Solicitação de Projeto'}
              <span className="material-icons-outlined">send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};