import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export const VirtualEngineer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Engenheiro Virtual Online. Sistemas carregados. Como posso auxiliar seu projeto técnico hoje?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      text: input, 
      timestamp: new Date().toLocaleTimeString() 
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Aja como o Engenheiro Virtual Sênior do Studio CidEngenharia 360°, liderado por Sidney Sales.
      Seu objetivo é fornecer consultoria técnica de alto nível sobre:
      - Design industrial e engenharia visual.
      - Aplicação de tecnologias NFC e QR Code (DyCard).
      - Manufatura técnica (fibra, metal, acrílico).
      - Branding estratégico e IA generativa.
      
      Contexto: O studio preza pela perfeição técnica ("Observando todos os aspectos da engenharia").
      Seja profissional, analítico, criativo e direto. Use termos técnicos quando apropriado.
      
      Pergunta do cliente: ${input}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const modelMessage: Message = {
        role: 'model',
        text: response.text || 'Processamento interrompido. Reiniciando núcleo de lógica...',
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Erro de conexão no barramento neural. Sidney Sales está disponível para atendimento via WhatsApp no ícone ao lado.', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-6 md:p-12 lg:p-20 transition-colors duration-500 font-body relative overflow-hidden flex flex-col">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <header className="max-w-6xl mx-auto w-full mb-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[9px] font-black uppercase tracking-[0.2em] text-primary-500">
            CidEngenharia Neural Core v1.0
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter leading-none">
            Engenheiro <span className="text-primary-500 italic">Virtual</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consultoria Técnica Inteligente & Visão 360°</p>
        </div>

        <div className="flex gap-4">
           <div className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Processador Ativo</span>
           </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto w-full flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 overflow-hidden">
        
        {/* Painel Lateral de Métricas */}
        <div className="lg:col-span-3 hidden lg:flex flex-col gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-xl space-y-6">
             <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-3">Sistemas de Diagnóstico</h4>
             
             {[
               { label: 'Integridade Visual', value: '99.8%' },
               { label: 'Precisão de Cálculo', value: '100%' },
               { label: 'Resposta Neural', value: '< 2.4s' },
               { label: 'CidCloud Sync', value: 'Online' }
             ].map((m, i) => (
               <div key={i} className="space-y-1">
                 <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{m.label}</p>
                 <p className="text-sm font-black dark:text-white text-primary-500">{m.value}</p>
               </div>
             ))}

             <div className="pt-4">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                   <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    className="h-full bg-primary-500"
                   />
                </div>
                <p className="text-[8px] font-black text-slate-400 uppercase mt-2">Capacidade de Renderização</p>
             </div>
          </div>

          <div className="bg-primary-500 p-6 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
             <div className="engineering-grid absolute inset-0 opacity-10"></div>
             <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-80">Insight Técnico</p>
             <p className="text-[11px] font-medium leading-relaxed italic">"A engenharia não é apenas sobre o que funciona, mas sobre a beleza da precisão em todos os ângulos."</p>
          </div>
        </div>

        {/* Console Central de Chat */}
        <div className="lg:col-span-9 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden relative">
          <div className="engineering-grid absolute inset-0 opacity-5 pointer-events-none"></div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 custom-scrollbar relative z-10">
            {messages.map((msg, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className={`max-w-[85%] p-5 md:p-6 rounded-[2rem] text-xs md:text-sm leading-relaxed shadow-sm transition-all ${
                  msg.role === 'user' 
                    ? 'bg-primary-500 text-white rounded-tr-none' 
                    : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
                <span className="text-[8px] font-black uppercase text-slate-400 mt-2 px-2 tracking-widest">
                  {msg.role === 'model' ? 'ENGINEER_PROMPT' : 'USER_DATA'} — {msg.timestamp}
                </span>
              </motion.div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-3 text-primary-500">
                <span className="material-icons-outlined animate-spin">sync</span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Processando Vetores de Solução...</span>
              </div>
            )}
          </div>

          <div className="p-6 md:p-8 bg-slate-50/50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 relative z-20">
            <form onSubmit={handleSend} className="flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ex: Qual o melhor material para uma fachada de alta durabilidade?"
                className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 outline-none dark:text-white text-sm focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-14 h-14 md:w-16 md:h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                <span className="material-icons-outlined text-2xl">rocket_launch</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(16,185,129,0.2); border-radius: 20px; }
        .engineering-grid {
          background-size: 30px 30px;
          background-image: 
              linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
        }
        .dark .engineering-grid {
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};