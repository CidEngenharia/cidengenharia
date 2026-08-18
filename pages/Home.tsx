import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLang } from '../lib/LangContext';

const AntigravityCursor = () => (
  <div className="relative inline-flex items-center justify-center h-full" style={{ width: '14px' }}>
    {/* Outer glow halo — pulses continuously */}
    <motion.div
      className="absolute rounded-full pointer-events-none"
      animate={{ opacity: [0.3, 0.75, 0.3], scaleX: [1, 2, 1], scaleY: [1, 1.15, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        inset: '-4px -8px',
        background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.5) 0%, rgba(59,130,246,0.2) 60%, transparent 100%)',
        filter: 'blur(8px)',
      }}
    />
    {/* Cursor bar — blinks like a real text caret */}
    <motion.svg
      viewBox="0 0 8 56"
      className="relative h-full w-auto"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{
        duration: 1.1,
        repeat: Infinity,
        times: [0, 0.45, 0.5, 0.95],
        ease: 'linear',
      }}
    >
      <defs>
        <linearGradient id="cursorRainbow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%"   stopColor="#3b82f6" />
          <stop offset="30%"  stopColor="#22c55e" />
          <stop offset="60%"  stopColor="#eab308" />
          <stop offset="82%"  stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
        <filter id="cursorGlow" x="-100%" y="-5%" width="300%" height="110%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <rect x="1.5" y="1" width="5" height="54" rx="2.5" ry="2.5"
        fill="url(#cursorRainbow)"
        filter="url(#cursorGlow)"
      />
      <rect x="2.2" y="2" width="1.8" height="24" rx="1"
        fill="white" opacity="0.28"
      />
    </motion.svg>
  </div>
);


const TypewriterText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayText, setDisplayText] = useState("");
  
  useEffect(() => {
    let timeout: any;
    let currentIndex = 0;
    
    const startTimeout = setTimeout(() => {
      const type = () => {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
          timeout = setTimeout(type, 100);
        }
      };
      type();
    }, delay * 1000);
    
    return () => {
      clearTimeout(startTimeout);
      clearTimeout(timeout);
    };
  }, [text, delay]);
  
  return (
    <span className="text-slate-700 dark:text-white transition-colors duration-500">
      {displayText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        className="inline-block w-[3px] h-[0.9em] bg-violet-400 ml-1 align-bottom"
      />
    </span>
  );
};

const Stats = () => {
  const stats = [
    { number: "20x", text: "Resultados mais rápidos do que com o desenvolvimento convencional.", gradient: "from-[#4f46e5] to-[#7c3aed]" },
    { number: "+80", text: "Horas de economia de trabalhos manuais.", gradient: "from-[#ec4899] to-[#db2777]" },
    { number: "10x", text: "Mais produtos testados diariamente", gradient: "from-[#0ea5e9] to-[#2563eb]" },
    { number: "-R$", text: "Economize +R$ em custos com desenvolvimento. Tire a idéia do papel.", gradient: "from-[#10b981] to-[#059669]" },
  ];

  return (
    <div className="mb-20">
      <motion.p 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-[#fbbf24] mb-8 drop-shadow-[0_0_15px_rgba(251,191,36,0.2)]"
      >
        Seus projetos com...
      </motion.p>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col gap-1"
          >
            <span className={`text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br ${stat.gradient} tracking-tighter drop-shadow-sm`}>
              {stat.number}
            </span>
            <p className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-tight max-w-[200px] opacity-80">
              {stat.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const TypewriterMessage = ({ text, onTyping }: { text: string; onTyping?: () => void }) => {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.substring(0, i + 1));
      i++;
      if (onTyping) onTyping();
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, [text]);
  return <span className="whitespace-pre-wrap leading-relaxed inline align-middle">{displayed}</span>;
};

const DraftForm = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [messages, setMessages] = useState<{text: string, type: 'bot' | 'user', isFinalNode?: boolean, animated?: boolean, time: string}[]>([]);
  const [hasSent, setHasSent] = useState(false);
  const [inputError, setInputError] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  interface FlowItem {
    key: string;
    question: string;
    validate?: (val: string) => boolean | string;
    options?: string[];
    condition?: (answers: any) => boolean;
    isFinal?: boolean;
  }

  const flow: FlowItem[] = [
    { key: "nome", question: "Qual seu nome?" },
    { 
      key: "whatsapp", 
      question: "Qual seu WhatsApp com DDD?", 
      validate: (val: string) => val.replace(/\D/g, '').length >= 10 || "Por favor, insira um número válido com DDD."
    },
    { 
      key: "tipo", 
      question: "Qual projeto você quer informações?",
      options: ["Sistemas Web", "Briefing e Branding", "Outros"]
    },

    // WEB
    { key: "orcamentoWeb", question: "Até quanto deseja gastar nesse projeto?", condition: (a: any) => a.tipo?.toLowerCase().includes("web") },
    { key: "nomeProjeto", question: "Qual o nome do seu projeto? (ex: App Delivery, SaaS, Gestão de Condomínios)", condition: (a: any) => a.tipo?.toLowerCase().includes("web") },

    // BRANDING
    { key: "produto", question: "Qual produto quer orçamento? (Camisetas, canecas, banner, adesivos, etc)", condition: (a: any) => !a.tipo?.toLowerCase().includes("web") },
    { key: "quantidade", question: "Qual a quantidade?", condition: (a: any) => !a.tipo?.toLowerCase().includes("web") },
    { key: "logo", question: "Já tem logomarca? Se não, descreva sua ideia!", condition: (a: any) => !a.tipo?.toLowerCase().includes("web") },
    { key: "orcamentoBranding", question: "Até quanto deseja investir?", condition: (a: any) => !a.tipo?.toLowerCase().includes("web") },

    // FINAL
    { key: "final", question: "Tudo pronto! Clique no botão ao lado para enviar seu briefing pelo WhatsApp.", isFinal: true }
  ];

  const getNextStep = (currentStep: number, currentAnswers: any) => {
    let next = currentStep;
    while (next < flow.length) {
      if (!flow[next].condition || flow[next].condition(currentAnswers)) {
        return next;
      }
      next++;
    }
    return next;
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      const nextStepIndex = getNextStep(0, answers);
      setTimeout(() => {
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setMessages([{ text: flow[nextStepIndex].question, type: 'bot', animated: true, time }]);
        setStep(nextStepIndex);
        setIsTyping(false);
      }, 1500);
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, inputError]);

  const handleNext = (overrideValue?: string) => {
    const val = (overrideValue ?? inputValue).trim();
    if (!val || isTyping) return;

    const currentFlowItem = flow[step];
    
    if (currentFlowItem.validate) {
      const result = currentFlowItem.validate(val);
      if (typeof result === 'string') {
        setInputError(result);
        return;
      }
    }
    
    setInputError('');
    
    const updatedAnswers = { ...answers, [currentFlowItem.key]: val };
    
    // Mark previous messages as not animated
    const oldMessages = messages.map(m => ({ ...m, animated: false }));
    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const newMessages = [...oldMessages, { text: val, type: 'user' as const, animated: false, time }];
    
    setAnswers(updatedAnswers);
    setMessages(newMessages);
    setInputValue('');
    
    const nextStepIndex = getNextStep(step + 1, updatedAnswers);
    
    if (nextStepIndex < flow.length) {
      setIsTyping(true);
      setTimeout(() => {
        const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        setMessages(prev => [
          ...prev.map(m => ({...m, animated: false})), 
          { text: flow[nextStepIndex].question, type: 'bot', isFinalNode: flow[nextStepIndex].isFinal, animated: true, time }
        ]);
        setStep(nextStepIndex);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleSendWhatsApp = () => {
    if (hasSent) return;
    let text = "📋 *Novo Rascunho de Projeto*%0A%0A";
    
    flow.forEach(item => {
      if (item.key !== 'final' && answers[item.key]) {
        let label = item.key.charAt(0).toUpperCase() + item.key.slice(1);
        text += `*${label}:* ${answers[item.key]}%0A`;
      }
    });

    window.open(`https://wa.me/5571984184782?text=${text}`, '_blank');
    
    setHasSent(true);
    setIsTyping(true);
    setTimeout(() => {
      const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev.map(m => ({...m, animated: false})), 
        { text: "Seu rascunho foi enviado com sucesso! Em breve entraremos em contato para alinharmos os detalhes.", type: 'bot', animated: true, time }
      ]);
      setIsTyping(false);
    }, 1500);
  };

  const currentFlowItem = flow[step] || { key: '', question: '' };
  const isFinalStep = currentFlowItem.isFinal;

  return (
    <section className="py-24 px-6 md:px-24 max-w-4xl mx-auto relative z-10">
      <div className="text-center mb-12">
        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/20 to-indigo-600/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img 
              src="/favicon.png" 
              alt="IA Icon" 
              className="w-5 h-5 md:w-6 md:h-6 object-contain relative transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6" 
            />
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#fbbf24] tracking-tight mb-4 md:mb-0 drop-shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-colors duration-500 whitespace-nowrap overflow-hidden text-ellipsis px-2">
            Vamos fazer um rascunho do seu projeto?
          </h2>
        </div>
        <div className="w-24 h-1 bg-[#fbbf24] mx-auto rounded-full opacity-50 transition-colors duration-500 mt-4"></div>
      </div>

      <div id="chat" className="w-full max-w-[700px] mx-auto bg-slate-200 p-[20px] rounded-[15px] border border-white/10 shadow-2xl flex flex-col relative overflow-hidden">
        
        {/* Messages List Area */}
        <div id="messages" ref={messagesContainerRef} className="flex-1 h-[450px] overflow-y-auto space-y-2 pb-4 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-[15px] pt-[8px] pb-[16px] my-[4px] rounded-[12px] max-w-[80%] text-sm font-medium shadow-md relative ${
                msg.type === 'user' 
                  ? 'bg-[#dcf8c6] text-black ml-auto rounded-tr-sm' 
                  : 'bg-white text-black text-left rounded-tl-sm'
              }`}>
                {msg.animated ? (
                  <TypewriterMessage text={msg.text} onTyping={scrollToBottom} />
                ) : (
                  <span className="whitespace-pre-wrap leading-relaxed inline align-middle">{msg.text}</span>
                )}
                <span className="absolute bottom-[2px] right-[8px] text-[10px] text-gray-500 font-normal flex items-center gap-0.5">
                  {msg.time}
                  {msg.type === 'user' && (
                    <svg className="w-3 h-3 text-[#53bdeb]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.3 5.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4l3.3 3.3 7.3-7.3zM22.3 5.3a1 1 0 0 1 1.4 1.4l-8 8a1 1 0 0 1-1.4 0l-2-2a1 1 0 1 1 1.4-1.4l1.3 1.3 7.3-7.3z"/>
                    </svg>
                  )}
                </span>
                
                {msg.isFinalNode && !hasSent && (
                  <span className="inline-block ml-2 align-middle">
                    <button 
                      onClick={handleSendWhatsApp}
                      className="w-8 h-8 md:w-9 md:h-9 bg-[#25D366] hover:bg-[#1da851] text-white rounded-full transition-all hover:scale-110 active:scale-95 shadow-lg shadow-[#25D366]/20 flex items-center justify-center flex-shrink-0"
                      title="Enviar pelo WhatsApp"
                    >
                      <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    </button>
                  </span>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-[15px] py-[10px] my-[8px] rounded-[12px] rounded-tl-sm max-w-[80%] shadow-md">
                <span id="typing" className="flex items-center gap-2 h-4 text-gray-500 font-normal italic text-xs">
                  O assistente está digitando...
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Text Input Area & Options */}
        {!isFinalStep && (
          <div className="mt-2 flex flex-col gap-3 relative z-10 w-full shrink-0">
            {/* Options Chips */}
            {currentFlowItem.options && !isTyping && (
              <div className="flex flex-wrap gap-2 justify-end mb-2">
                {currentFlowItem.options.map((opt: string) => (
                  <button
                    key={opt}
                    onClick={() => handleNext(opt)}
                    className="px-4 py-1.5 rounded-full bg-white border-2 border-[#25D366] text-[#005c4b] text-sm font-bold shadow-sm hover:bg-[#dcf8c6] transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
            
            {inputError && (
              <div className="text-red-500 font-medium text-xs px-2 text-right animate-pulse">{inputError}</div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="flex gap-2">
              <input
                type={currentFlowItem.key === 'whatsapp' ? 'tel' : 'text'}
                value={inputValue}
                onChange={e => {
                  if (currentFlowItem.key === 'whatsapp') {
                    setInputValue(e.target.value.replace(/[^0-9()\s+-]/g, ''));
                  } else {
                    setInputValue(e.target.value);
                  }
                  setInputError('');
                }}
                placeholder="Digite sua resposta..."
                disabled={isTyping}
                className="flex-1 bg-white border border-gray-300 shadow-sm rounded-full px-5 py-3 text-black text-sm focus:outline-none focus:border-[#25D366] placeholder:text-gray-400 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 rounded-full bg-[#25D366] hover:bg-[#1da851] flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-md"
              >
                <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled down
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-24 right-5 w-11 h-11 rounded-full bg-slate-800 text-white shadow-xl hover:bg-slate-700 hover:scale-110 active:scale-95 transition-all z-50 flex items-center justify-center border-2 border-white/10"
          aria-label="Voltar ao topo"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export const Home: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { t } = useLang();

  // Enhanced Background bubbles configuration - more visible
  const bgBubbles = [
    { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(109,40,217,0.4)', delay: 0, duration: 8 },
    { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(37,99,235,0.3)', delay: 2, duration: 12 },
    { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(139,92,246,0.35)', delay: 1, duration: 10 },
    { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(79,70,229,0.3)', delay: 3, duration: 15 },
    { size: 'w-[20%] h-[20%]', pos: 'top-[45%] right-[25%]', color: 'rgba(99,102,241,0.25)', delay: 5, duration: 18 },
    { size: 'w-[22%] h-[22%]', pos: 'bottom-[45%] left-[15%]', color: 'rgba(167,139,250,0.35)', delay: 4, duration: 14 },
    { size: 'w-[28%] h-[28%]', pos: 'top-[15%] left-[35%]', color: 'rgba(30,58,138,0.4)', delay: 6, duration: 20 },
  ];

  const carouselItems = [
    ...t.carouselTitles.map((title, i) => ({
      url: [
        '/carousel_networking.jpg',
        '/carousel_identity.png',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1200',
        '/branding.png'
      ][i],
      title,
      description: t.carouselDescs[i],
      category: t.carouselCategories[i],
      type: 'image'
    })),
    {
      url: '/assistente_ia_.mp4',
      title: 'Automação de processos',
      description: 'Integração de assistentes inteligentes para otimização de fluxos e atendimento em alta performance.',
      category: 'INTELIGÊNCIA ARTIFICIAL',
      type: 'video'
    }
  ];

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
    }, 7000); // Slightly longer for better reading
    return () => clearInterval(timer);
  }, [carouselItems.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  return (
    <div className="relative overflow-hidden min-h-screen bg-slate-50 dark:bg-[#080a12] transition-colors duration-500 font-body">

      {/* ===== ANIMATED BACKGROUND - Scattered Bubbles ===== */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {bgBubbles.map((bubble, i) => (
          <motion.div
            key={i}
            animate={{ 
              scale: [1, 1.3, 1], 
              opacity: [0.4, 0.8, 0.4],
              x: [0, Math.sin(i * 15) * 60, 0],
              y: [0, Math.cos(i * 15) * 40, 0]
            }}
            transition={{ 
              duration: bubble.duration, 
              repeat: Infinity, 
              ease: 'easeInOut', 
              delay: bubble.delay 
            }}
            className={`absolute ${bubble.size} ${bubble.pos} rounded-full`}
            style={{
              background: `radial-gradient(circle, ${bubble.color} 0%, transparent 85%)`,
              filter: 'blur(70px)',
              mixBlendMode: 'plus-lighter'
            }}
          />
        ))}
      </div>

      {/* ===== HERO SECTION ===== */}
      <section className="flex flex-col items-start justify-center px-6 md:px-24 py-20 md:py-32 min-h-[85vh] max-w-7xl mx-auto relative z-10">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-slate-300 mb-8 backdrop-blur-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          {t.badge}
        </motion.div>

        {/* Logo + Brand Name + Typewriter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col xl:flex-row items-start xl:items-baseline gap-x-2 mb-4 text-left w-full"
        >
          <h2 className="text-xl sm:text-2xl md:text-3xl tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#7c3aed] via-[#a78bfa] to-[#6366f1] pb-1">
            {t.brand}
          </h2>
          <div className="text-xl sm:text-2xl md:text-3xl font-normal tracking-tight leading-none mt-2 xl:mt-0 text-slate-300">
             <TypewriterText text=" O que vamos desenvolver hoje?" delay={1} />
          </div>
        </motion.div>

        {/* MAIN HERO TEXT — "Fábrica Dev" destaque como "O ouro da IA" no au4.ai */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight text-left">
            <span className="text-[#fbbf24] drop-shadow-[0_0_30px_rgba(251,191,36,0.4)]">
              {t.heroTitle}
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-base md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl font-bold leading-relaxed mb-10 text-left"
        >
          {t.heroDesc}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap gap-4 mb-14"
        >
          <Link
            to="/services"
            className="px-8 py-4 bg-violet-900 hover:bg-violet-800 text-white font-black rounded-xl shadow-lg shadow-violet-900/30 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px]"
          >
            {t.ctaSolutions}
          </Link>
          <Link
            to="/portfolio"
            className="px-8 py-4 bg-slate-200/50 dark:bg-white/5 hover:bg-slate-200/80 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white font-black rounded-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px] backdrop-blur-sm"
          >
            {t.ctaPortfolio}
          </Link>
          <Link
            to="/free-guide"
            className="px-8 py-4 bg-[#006241] hover:bg-[#004a31] text-white font-black rounded-xl shadow-lg shadow-[#006241]/30 transition-all hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px]"
          >
            Apostila Grátis
          </Link>
        </motion.div>
      </section>

      {/* ===== CAROUSEL SECTION ===== */}
      <section className="px-6 md:px-24 pb-16 max-w-7xl mx-auto relative z-10">
        {/* Stats Section added above Carousel */}
        <Stats />

        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[600px] rounded-[2rem] overflow-hidden shadow-2xl group border border-white/5">
          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: -50, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 w-full h-full"
            >
              {carouselItems[currentSlide].type === 'video' ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-105 group-hover:scale-110"
                >
                  <source src={carouselItems[currentSlide].url} type="video/mp4" />
                </video>
              ) : (
                <img src={carouselItems[currentSlide].url} className="w-full h-full object-cover transition-transform duration-[10s] ease-linear scale-105 group-hover:scale-110" alt={carouselItems[currentSlide].title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

              <div className="absolute bottom-12 left-12 right-12 text-left">
                <span className="text-[10px] font-black bg-violet-600 text-white px-4 py-1.5 rounded-full tracking-widest mb-4 inline-block uppercase">
                  {carouselItems[currentSlide].category}
                </span>
                <h2 className="text-2xl md:text-4xl font-black text-white uppercase font-display tracking-tight mb-2 drop-shadow-lg">
                  {carouselItems[currentSlide].title}
                </h2>
                <p className="text-white/80 text-xs md:text-base max-w-xl font-normal drop-shadow-md">
                  {carouselItems[currentSlide].description}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute bottom-12 left-12 right-12 flex items-center justify-between z-20 pointer-events-none">
            <button 
              onClick={prevSlide}
              className="flex items-center justify-center text-[#fbbf24] transition-all pointer-events-auto active:scale-95 opacity-0 md:opacity-100 group-hover:scale-125"
            >
              <span className="material-icons-outlined text-4xl">chevron_left</span>
            </button>
            <button 
              onClick={nextSlide}
              className="flex items-center justify-center text-[#fbbf24] transition-all pointer-events-auto active:scale-95 opacity-0 md:opacity-100 group-hover:scale-125"
            >
              <span className="material-icons-outlined text-4xl">chevron_right</span>
            </button>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {carouselItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === i ? 'w-8 bg-[#fbbf24]' : 'w-2 bg-white/40'}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DRAFT FORM SECTION ===== */}
      <DraftForm />
      
      <ScrollToTopButton />
      <div className="pb-24"></div>
    </div>
  );
};
