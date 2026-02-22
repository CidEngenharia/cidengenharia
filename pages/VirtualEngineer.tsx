import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Link } from 'react-router-dom';
import './VirtualEngineer.css';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

// Named Export explicitly to match the import in App.tsx
export const VirtualEngineer: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Kernel carregado. Sou a extensão digital de Sidney Sales. Como posso auxiliar seu projeto de Engenharia Visual hoje?', timestamp: new Date().toLocaleTimeString() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Carregar biblioteca de animação dinamicamente para efeitos de terminal
    const scriptId = 'anime-js-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js';
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg, timestamp: new Date().toLocaleTimeString() }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é o Engenheiro Virtual do Studio CidEngenharia 360°.
      Aja como a consciência digital de Sidney Sales. Sua fala é precisa, visionária e tecnológica.
      Especialidades: NFC (DyCard), Banners, Lonas, IA Generativa, Branding e Engenharia Visual.
      Mantenha um tom profissional mas inovador. Use emojis técnicos (📐, 🚀, 🛠️, 🧬).
      
      Mensagem do Cliente: ${userMsg}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
      });

      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response.text || 'Erro de processamento no núcleo. Reiniciando interface...', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Não foi possível estabelecer conexão com o core neural. Verifique sua rede e tente novamente.', 
        timestamp: new Date().toLocaleTimeString() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ve-page min-h-screen bg-slate-950 text-slate-100 selection:bg-primary-500/30 overflow-x-hidden font-mono">
      <div className="engineering-grid-bg"></div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        
        {/* Entity Status Header */}
        <section className="flex flex-col md:flex-row items-center gap-16 mb-24">
          <div className="flex-1 space-y-8">
             <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary-500 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
               <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_#10b981]"></span>
               Visual Engineering AI: Active
             </div>
             
             <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] mb-6">
                <span className="block text-slate-500 text-sm tracking-[0.6em] mb-4">SYSTEM_ID</span>
                <span className="bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#34d399] bg-clip-text text-transparent">Virtual_Engineer</span>
             </h1>

             <p className="text-lg text-slate-400 max-w-xl leading-relaxed font-light">
                Processando inovação visual e hardware inteligente em tempo real. A extensão tecnológica do Studio CidEngenharia ao seu serviço.
             </p>

             <div className="flex flex-wrap gap-4 pt-4">
                <button onClick={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-primary-500/30 active:scale-95">
                   Abrir Terminal SSH
                </button>
                <Link to="/" className="px-8 py-4 border border-slate-700 hover:bg-slate-800 text-slate-400 font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
                   Sair do Sistema
                </Link>
             </div>
          </div>

          <div className="w-full md:w-1/3 grid grid-cols-1 gap-6">
             {[
               { label: 'Neural Core', icon: 'psychology', percent: '99' },
               { label: 'Graphic Engine', icon: 'auto_awesome', percent: '95' },
               { label: 'NFC Protocols', icon: 'contactless', percent: '92' },
               { label: 'Print Logic', icon: 'print', percent: '90' }
             ].map((skill, idx) => (
               <div key={idx} className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl group hover:border-primary-500/30 transition-all">
                  <div className="flex justify-between items-center mb-3">
                     <div className="flex items-center gap-3">
                        <span className="material-icons-outlined text-primary-500 group-hover:rotate-12 transition-transform">{skill.icon}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{skill.label}</span>
                     </div>
                     <span className="text-[10px] text-primary-500">{skill.percent}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.percent}%` }}
                        transition={{ duration: 1.5, delay: idx * 0.2 }}
                        className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 shadow-[0_0_10px_#10b981]"
                     />
                  </div>
               </div>
             ))}
          </div>
        </section>

        {/* Interactive Terminal Interface */}
        <section className="space-y-12">
           <div className="flex items-center gap-6">
              <span className="text-primary-500 font-black text-2xl">01</span>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Terminal_V4.exe</h2>
              <div className="h-px flex-1 bg-slate-800"></div>
           </div>

           <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden flex flex-col h-[650px] shadow-[0_50px_100px_rgba(0,0,0,0.4)] relative">
              <div className="h-14 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                       <div className="w-3 h-3 rounded-full bg-amber-500/20"></div>
                       <div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.3em]">cid_neural_interface.bash</span>
                 </div>
                 <div className="flex items-center gap-6 text-slate-500 text-[10px] font-bold">
                    <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LATENCY: 24ms</span>
                    <span>ENCRYPTION: AES-256</span>
                 </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 md:p-12 space-y-8 custom-scrollbar bg-[radial-gradient(circle_at_50%_50%,_rgba(16,185,129,0.02),_transparent)]">
                 {messages.map((msg, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                       <div className={`max-w-[80%] p-6 rounded-3xl text-sm leading-relaxed ${
                         msg.role === 'user' 
                           ? 'bg-primary-500 text-white rounded-tr-none' 
                           : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-none shadow-xl'
                       }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                       </div>
                       <div className="mt-3 flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-slate-600">
                          <span>{msg.timestamp}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                          <span className={msg.role === 'user' ? 'text-slate-500' : 'text-primary-500'}>{msg.role === 'user' ? 'CLIENT_INPUT' : 'CORE_RESPONSE'}</span>
                       </div>
                    </motion.div>
                 ))}
                 {isLoading && (
                    <div className="flex flex-col items-start">
                       <div className="bg-slate-800 border border-slate-700 p-6 rounded-3xl rounded-tl-none">
                          <div className="flex gap-2">
                             <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce"></div>
                             <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-100"></div>
                             <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce delay-200"></div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              <form onSubmit={handleSend} className="p-8 bg-slate-950 border-t border-slate-800">
                 <div className="relative group">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-500 font-black text-lg transition-transform group-focus-within:translate-x-1">></span>
                    <input 
                      type="text" 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      placeholder="Insira sua diretiva ou consulta técnica..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pl-12 pr-24 py-5 outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/5 text-sm transition-all text-slate-100"
                    />
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 shadow-xl shadow-primary-500/20 active:scale-95"
                    >
                      Process
                    </button>
                 </div>
                 <div className="mt-4 flex justify-between items-center text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-2">
                    <span>Press ENTER to broadcast directive</span>
                    <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></span> Live Link: Secured</span>
                 </div>
              </form>
           </div>
        </section>

        {/* Footer info */}
        <footer className="mt-40 pt-20 border-t border-slate-900 text-center space-y-6">
           <div className="text-slate-700 text-[10px] tracking-[0.5em] uppercase font-bold">
              CidEngenharia 360° | Artificial Consciousness Extension
           </div>
           <p className="text-[8px] text-slate-800 uppercase font-black tracking-widest">
              Liderado por Sidney Sales em Salvador, BA. Atendimento Global via Protocolo IP.
           </p>
        </footer>

      </main>

      <style>{`
        .ve-page .engineering-grid-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: linear-gradient(var(--primary) 1px, transparent 1px), linear-gradient(90deg, var(--primary) 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.03;
          pointer-events: none;
        }
        .ve-page .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .ve-page .custom-scrollbar::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default VirtualEngineer;