import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const ApostilaForm = () => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Salva os dados no navegador do usuário
    localStorage.setItem('user_data', JSON.stringify(formData));
    navigate(`/terminal-hacker-pro?name=${encodeURIComponent(formData.nome)}`);
  };

  const bgBubbles = [
    { size: 'w-[45%] h-[45%]', pos: 'top-[-15%] right-[-10%]', color: 'rgba(109,40,217,0.4)', delay: 0, duration: 8 },
    { size: 'w-[40%] h-[40%]', pos: 'bottom-[-5%] left-[-5%]', color: 'rgba(37,99,235,0.3)', delay: 2, duration: 12 },
    { size: 'w-[25%] h-[25%]', pos: 'top-[30%] left-[5%]', color: 'rgba(139,92,246,0.35)', delay: 1, duration: 10 },
    { size: 'w-[30%] h-[30%]', pos: 'bottom-[30%] right-[10%]', color: 'rgba(79,70,229,0.3)', delay: 3, duration: 15 },
    { size: 'w-[20%] h-[20%]', pos: 'top-[45%] right-[25%]', color: 'rgba(99,102,241,0.25)', delay: 5, duration: 18 },
    { size: 'w-[22%] h-[22%]', pos: 'bottom-[45%] left-[15%]', color: 'rgba(167,139,250,0.35)', delay: 4, duration: 14 },
    { size: 'w-[28%] h-[28%]', pos: 'top-[15%] left-[35%]', color: 'rgba(30,58,138,0.4)', delay: 6, duration: 20 },
  ];

  return (
    <div className="min-h-screen bg-[#080a12] flex items-start justify-center p-6 pt-32 md:pt-48 relative overflow-hidden">
      
      {/* NAVEGAÇÃO / VOLTAR */}
      <nav className="absolute top-0 left-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white hover:text-emerald-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-emerald-500/50 group-hover:bg-emerald-500/10 transition-all">
              <span className="material-icons-outlined text-xl text-white">arrow_back</span>
            </div>
          </Link>
        </div>
      </nav>

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

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-sm w-full bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl relative z-10"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">
            Adquirir Apostila Grátis
          </h2>
          <p className="text-slate-400 text-xs">
            Preencha seus dados para receber o acesso.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 ml-1">Nome Completo</label>
            <input 
              required
              type="text"
              value={formData.nome}
              onChange={e => setFormData({...formData, nome: e.target.value})}
              placeholder="Ex: Sidney Sales"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 ml-1">E-mail</label>
            <input 
              required
              type="email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="exemplo@email.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1 ml-1">WhatsApp</label>
            <input 
              required
              type="tel"
              value={formData.whatsapp}
              onChange={e => setFormData({...formData, whatsapp: e.target.value})}
              placeholder="(00) 00000-0000"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/50 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest text-[10px] mt-2"
          >
            Acessar Apostila
          </button>
        </form>
      </motion.div>
    </div>
  );
};
