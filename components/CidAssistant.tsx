
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";

export const CidAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Olá! Sou o assistente inteligente do Sidney Sales. Como posso ajudar na sua jornada de Engenharia Visual hoje?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat]);

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMsg = message;
    setMessage('');
    setChat(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Você é o CidAssistant, a IA oficial do Studio CidEngenharia 360°, liderado por Sidney Sales.
      Informações Importantes:
      - Sidney Sales é especialista em Engenharia Visual, Design Estratégico e IA.
      - Serviços principais: Cartão NFC DyCard (Físico e Digital), Chaveiros PET NFC, Impressão de Banners, Gestão de Branding, IA generativa.
      - Localização: Salvador, BA (atendimento global).
      - Tom de voz: Profissional, técnico, inovador e prestativo.
      - Objetivo: Tirar dúvidas e converter visitantes em clientes.
      
      Pergunta do usuário: ${userMsg}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setChat(prev => [...prev, { role: 'model', text: response.text || 'Desculpe, tive um lapso no processamento. Pode repetir?' }]);
    } catch (error) {
      setChat(prev => [...prev, { role: 'model', text: 'Estou com dificuldades de conexão no momento, mas Sidney pode te atender no WhatsApp!' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-[60] font-body">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-80 md:w-96 h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 bg-primary-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="material-icons-outlined text-xl">auto_awesome</span>
                </div>
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest leading-none">CidAssistant</h4>
                  <p className="text-[8px] opacity-80 uppercase font-bold mt-1 tracking-tighter">AI Powered Interface</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-slate-50 dark:bg-slate-950/50">
              {chat.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] font-medium leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary-500 text-white rounded-tr-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 dark:text-slate-200 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-75"></div>
                      <div className="w-1.5 h-1.5 bg-primary-500 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre o DyCard..."
                  className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-xs outline-none dark:text-white placeholder:text-slate-400"
                />
                <button 
                  onClick={handleSend}
                  className="w-11 h-11 bg-primary-500 text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all"
                >
                  <span className="material-icons-outlined text-sm">send</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
          isOpen ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 rotate-[360deg]' : 'bg-primary-500 text-white'
        }`}
      >
        <span className="material-icons-outlined text-3xl">
          {isOpen ? 'chat_bubble_outline' : 'auto_awesome'}
        </span>
      </motion.button>
    </div>
  );
};
