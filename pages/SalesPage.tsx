import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function SalesPage() {
  const [searchParams] = useSearchParams();
  const [userName, setUserName] = useState<string | null>(searchParams.get('name'));

  useEffect(() => {
    // Se não houver nome na URL, tenta buscar no localStorage
    if (!userName) {
      const savedData = localStorage.getItem('user_data');
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.nome) {
            setUserName(parsed.nome);
          }
        } catch (e) {
          console.error("Erro ao ler localStorage:", e);
        }
      }
    }
  }, [userName]);
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
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-yellow-500/30 relative overflow-hidden">
      
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

      {/* NAVEGAÇÃO / VOLTAR */}
      <nav className="fixed top-0 left-0 w-full z-50 p-6">
        <div className="max-w-7xl mx-auto flex items-center">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-white hover:text-yellow-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-yellow-500/50 group-hover:bg-yellow-500/10 transition-all">
              <span className="material-icons-outlined text-xl text-white">arrow_back</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* HERO SECTION - SOPHISTICATED */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-20 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl pt-20 md:pt-32"
        >
          {userName && (
            <span className="text-violet-400 font-bold text-lg mb-4 block">
              Olá {userName}, tudo bem?
            </span>
          )}
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-yellow-500/80 mb-6 block">
            A revolução do seu workflow
          </span>
          
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-black mb-8 tracking-tighter leading-none text-yellow-500 drop-shadow-[0_0_50px_rgba(234,179,8,0.2)]">
            Terminal <br className="md:hidden" /> Hacker Pro
          </h1>
          
          <div className="mt-4 mb-10">
            <p className="text-base md:text-xl text-white/60 font-light leading-relaxed max-w-2xl mx-auto">
              Domine o <span className="text-white font-bold">Bash</span>, acelere seus projetos e <br className="hidden md:block" />
              programe como um verdadeiro <span className="text-yellow-500 font-bold">profissional</span>.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <motion.button 
              onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-10 py-4 rounded-2xl shadow-[0_20px_40px_rgba(234,179,8,0.2)] transition-all uppercase tracking-widest text-[10px]"
            >
              Quero aprender agora
            </motion.button>

            <motion.a 
              href="/Dev Hakcer.pdf"
              download="Dev Hacker - Apostila.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#A855F7] hover:bg-[#9333EA] text-white font-black px-10 py-4 rounded-2xl shadow-[0_20px_40px_rgba(168,85,247,0.2)] transition-all uppercase tracking-widest text-[10px] inline-flex items-center justify-center cursor-pointer"
            >
              Baixar Apostila
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* PROBLEMA - SOPHISTICATED GRID */}
      <section className="px-6 py-20 relative z-10 border-y border-white/5 bg-[#080808]/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-yellow-500 font-black text-[10px] uppercase tracking-widest mb-4 block">O Cenário Atual</span>
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight leading-tight">
              Você está usando o <span className="text-white/40 italic font-light">terminal errado</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed mb-6">
              A maioria dos desenvolvedores perde horas preciosas porque não domina as ferramentas fundamentais. Copiar comandos sem entender o fluxo gera bugs e atrasa entregas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.05, borderColor: 'rgba(234,179,8,0.5)', backgroundColor: 'rgba(234,179,8,0.05)' }}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm transition-all duration-300 cursor-pointer"
            >
              <div className="text-yellow-500 mb-4 font-black text-xl">01</div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Comandos Cegos</h3>
              <p className="text-[9px] text-white/40 leading-relaxed uppercase">Copiar do Stack Overflow sem saber o que acontece.</p>
            </motion.div>
            <motion.div 
              whileHover={{ scale: 1.05, borderColor: 'rgba(124,58,237,0.5)', backgroundColor: 'rgba(124,58,237,0.05)' }}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl mt-6 transition-all duration-300 cursor-pointer"
            >
              <div className="text-violet-500 mb-4 font-black text-xl">02</div>
              <h3 className="font-bold text-xs uppercase tracking-widest mb-2">Lentidão Git</h3>
              <p className="text-[9px] text-white/40 leading-relaxed uppercase">Medo de quebrar o repositório em cada merge.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOLUÇÃO - FEATURES */}
      <section className="px-6 py-20 bg-black/40 relative overflow-hidden border-b border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter">A Solução Definitiva</h2>
            <p className="text-white/40 text-base">O Terminal Hacker Pro te ensina na prática o que a faculdade ignora.</p>
          </div>

          <div className="grid md:grid-cols-1 gap-4">
            {[
              { title: "Dominar comandos essenciais", desc: "A base de tudo, do LS ao RM -RF com segurança.", icon: "terminal" },
              { title: "Criar projetos Node.js do zero", desc: "Configure ambientes profissionais em segundos.", icon: "code" },
              { title: "Usar Git como profissional", desc: "Commits, branches e merges sem suar frio.", icon: "account_tree" },
              { title: "Automatizar tarefas no terminal", desc: "Scripts que trabalham por você enquanto você dorme.", icon: "auto_fix_high" },
              { title: "Trabalhar como dev full stack", desc: "A agilidade que o mercado sênior exige.", icon: "rocket_launch" }
            ].map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="flex items-center gap-6 p-5 bg-white/5 border border-white/10 rounded-2xl transition-all cursor-default group"
              >
                <div className="w-10 h-10 bg-yellow-500/10 rounded-xl flex items-center justify-center text-yellow-500 group-hover:bg-yellow-500 group-hover:text-black transition-all">
                  <span className="material-icons-outlined text-lg">{item.icon}</span>
                </div>
                <div>
                  <h4 className="font-black text-[10px] uppercase tracking-widest text-white mb-1">{item.title}</h4>
                  <p className="text-[9px] text-white/40 uppercase tracking-wider">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA - CALL TO ACTION */}
      <section id="offer" className="px-6 py-20 text-center relative overflow-hidden">
        <div className="max-w-2xl mx-auto relative z-10">
          <span className="px-6 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-black uppercase tracking-[0.3em] mb-6 inline-block">
            Últimas vagas com desconto
          </span>
          <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter leading-none">Oferta de Lançamento</h2>
          <p className="text-white/40 text-lg font-light mb-10">
            Acesso vitalício ao guia completo + atualizações futuras.
          </p>
          
          <div className="mb-10 relative inline-block">
            <span className="text-white/20 text-lg line-through absolute -top-8 left-1/2 -translate-x-1/2 font-bold">R$ 197,00</span>
            <div className="text-6xl md:text-7xl font-black text-yellow-500 tracking-tighter">R$ 59,99</div>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-black font-black px-12 py-5 rounded-2xl shadow-white/10 transition-all uppercase tracking-widest text-[10px]"
            >
              Adquirir Agora
            </motion.button>
            <p className="text-[9px] text-white/30 uppercase tracking-[0.3em] font-bold">Pagamento único • Acesso imediato</p>
          </div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-12 text-center border-t border-white/5 relative z-10">
        <div className="opacity-20 flex flex-col items-center gap-4">
          <img src="/devlops.png" className="h-6 w-auto grayscale" alt="Logo" />
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white">
            © Terminal Hacker Pro 
          </p>
        </div>
      </footer>
    </div>
  );
}
