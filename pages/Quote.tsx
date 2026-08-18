/// <reference types="vite/client" />
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

  // Sincronizado com o card CidDesenvolvimento em LandingPage.tsx
  const servicesList = [
    { id: 'sites', label: 'Criação de Sites', desc: 'Sites profissionais com design responsivo' },
    { id: 'site-rental', label: 'Aluguel de sites', desc: 'Presença digital por assinatura' },
    { id: 'landing-pages', label: 'Criação de Landepages', desc: 'Páginas de conversão e campanhas' },
    { id: 'videos', label: 'Criação e Edição Videos', desc: 'Conteúdo audiovisual para marcas' },
    { id: 'ai-prompts', label: 'Prompts em IA', desc: 'Estratégia e automações com inteligência artificial' },
    { id: 'web-systems', label: 'Desenvolvimento de Sistemas Web', desc: 'Sistemas sob medida para operações digitais' },
    { id: 'images', label: 'Criação e Edição de Imagens', desc: 'Peças visuais, mockups e tratamento de imagem' }
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
      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });
      const selectedLabels = servicesList
        .filter(s => formData.services.includes(s.id))
        .map(s => s.label)
        .join(', ');

      const prompt = `Você é um engenheiro de software sênior do CidDesenvolvimento. 
      Um cliente quer solicitar um orçamento para os seguintes serviços: ${selectedLabels}.
      Escreva uma descrição técnica, profissional e inspiradora (em português) em um único parágrafo curto que o cliente possa usar para descrever a visão do projeto dele. 
      Se houver serviços de sites, landing pages ou sistemas web, mencione performance, usabilidade e conversão.
      Se houver prompts em IA, mencione automação e ganho de produtividade.
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
    <div className="max-w-6xl mx-auto px-4 pb-8 pt-36 md:pt-48 lg:pb-16">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800">

        {/* Lado Esquerdo - Info: Fundo bg-slate-900 (igual sidebar) no dia, bg-slate-950 na noite */}
        <div className="lg:w-5/12 bg-slate-900 dark:bg-slate-950 relative flex flex-col justify-between p-12 text-white engineering-grid overflow-hidden transition-colors duration-500">
          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 font-display leading-tight uppercase tracking-tighter">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#1e293b,#9ca3af,#a855f7,#22c55e)] dark:bg-[linear-gradient(to_right,#ffffff,#9ca3af,#a855f7,#22c55e)]">
                Desenvolvimento de Alta Performance.
              </span>
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
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="Como devemos te chamar?"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">E-mail Profissional</label>
                <input
                  type="email" required value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="seu@contato.com"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">WhatsApp / Telefone</label>
                <input
                  type="tel" required value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full border-b-2 border-slate-100 dark:border-slate-800 bg-transparent py-3 focus:border-primary-500 outline-none transition-all text-slate-900 dark:text-white font-medium"
                  placeholder="+55 (00) 00000-0000"
                />
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-focus-within:text-primary-500 transition-colors">Empresa (Opcional)</label>
                <input
                  type="text" value={formData.company}
                  onChange={e => setFormData({ ...formData, company: e.target.value })}
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
                    className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all group ${formData.services.includes(service.id)
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
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-xl border-2 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 text-slate-900 dark:text-white p-6 focus:border-primary-500 outline-none text-sm font-medium transition-all"
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
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl ${isGeneratingAI
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
              className="w-full sm:w-auto sm:px-7 bg-[#22c55e] hover:bg-[#16a34a] text-white font-black py-3.5 rounded-xl shadow-2xl shadow-green-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.16em] text-[10px]"
            >
              {isSubmitting ? 'Processando Engenharia...' : 'Enviar detalhes para Orçamento'}
              <svg className="h-4 w-4" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.02 3.2c-7.02 0-12.73 5.7-12.73 12.7 0 2.24.59 4.43 1.7 6.35L3.2 28.8l6.7-1.76a12.76 12.76 0 0 0 6.12 1.56c7.02 0 12.73-5.7 12.73-12.7S23.04 3.2 16.02 3.2Zm0 23.24c-1.92 0-3.8-.52-5.43-1.5l-.39-.23-3.97 1.04 1.06-3.86-.25-.4a10.47 10.47 0 0 1-1.6-5.58c0-5.81 4.74-10.54 10.58-10.54S26.6 10.1 26.6 15.9 21.86 26.44 16.02 26.44Zm5.8-7.89c-.32-.16-1.88-.92-2.17-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.88-1.77-2.2-.19-.32-.02-.49.14-.65.15-.15.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.71-1.71-.98-2.34-.26-.62-.52-.53-.71-.54h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.21 2 .13.61-.09 1.88-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.13-.29-.21-.61-.37Z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
