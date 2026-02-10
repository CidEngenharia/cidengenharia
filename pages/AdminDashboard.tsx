
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({ clients: 0, balance: 0, transactions: 0 });

  const ADMIN_EMAIL = 'sidney.sales@gmail.com';

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const hasLocalSession = localStorage.getItem('admin_session') === 'true';

      if ((user && user.email === ADMIN_EMAIL) || hasLocalSession) {
        setIsAdmin(true);
        localStorage.setItem('admin_session', 'true');
        fetchQuickStats();
      } else {
        navigate('/admin');
      }
    };
    checkSession();
  }, [navigate]);

  const fetchQuickStats = async () => {
    try {
      const { count: clientsCount } = await supabase.from('clients').select('*', { count: 'exact', head: true });
      const { data: trans } = await supabase.from('transactions').select('value, type');
      
      const balance = trans?.reduce((acc, t) => t.type === 'income' ? acc + t.value : acc - t.value, 0) || 0;
      
      setStats({
        clients: clientsCount || 0,
        balance: balance,
        transactions: trans?.length || 0
      });
    } catch (e) {
      console.error("Erro ao carregar estatísticas rápidas");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  if (!isAdmin) return null;

  const tools = [
    {
      title: 'Controle Financeiro 360',
      desc: 'Gestão completa de entradas, saídas e balanço líquido sincronizado via Supabase.',
      icon: 'payments',
      path: '/admin/finance',
      color: 'from-emerald-500 to-teal-600',
      tag: 'FINANÇAS'
    },
    {
      title: 'Gerenciar Clientes',
      desc: 'Faça o upload de logos e gerencie as marcas exibidas na página pública de clientes.',
      icon: 'business_center',
      path: '/admin/clients',
      color: 'from-pink-500 to-rose-600',
      tag: 'MARCAS'
    },
    {
      title: 'Calculadora de Precificação',
      desc: 'Calcule orçamentos de impressão de banners e adesivos por m² com precisão técnica.',
      icon: 'calculate',
      path: '/admin/pricing',
      color: 'from-blue-400 to-cyan-500',
      tag: 'ORÇAMENTOS'
    },
    {
      title: 'Scaner Inteligente',
      desc: 'Varredura profunda na web para localizar arquivos específicos (PDF, Word, MP3) via IA.',
      icon: 'radar',
      path: '/admin/smart-scanner',
      color: 'from-yellow-500 to-orange-600',
      tag: 'WEB SCAN'
    },
    {
      title: 'Análise de Documentos',
      desc: 'Resuma PDFs, documentos Word ou links da web com síntese de voz automática.',
      icon: 'description',
      path: '/admin/doc-analyzer',
      color: 'from-cyan-500 to-blue-600',
      tag: 'RESUMIDOR'
    },
    {
      title: 'Criação de Áudio IA',
      desc: 'Narração profissional com controle de entonação e clonagem de voz por referência.',
      icon: 'record_voice_over',
      path: '/admin/audio-ai',
      color: 'from-orange-500 to-red-600',
      tag: 'VOICE AI'
    },
    {
      title: 'Creator MusicAI',
      desc: 'Gere prompts musicais técnicos e composições de áudio via Inteligência Artificial.',
      icon: 'library_music',
      path: '/admin/music-ai',
      color: 'from-purple-500 to-pink-600',
      tag: 'MUSIC AI'
    },
    {
      title: 'Content Kit Extractor',
      desc: 'Extraia paletas de cores, fontes e CSS de qualquer site através de crawling.',
      icon: 'architecture',
      path: '/admin/content-kit',
      color: 'from-blue-500 to-indigo-600',
      tag: 'CRAWLING'
    },
    {
      title: 'Technical Prompt Analyzer',
      desc: 'Analise Imagens, Vídeos e Arquivos para criar prompts técnicos perfeitos para IA.',
      icon: 'psychology_alt',
      path: '/admin/prompt-analyzer',
      color: 'from-emerald-500 to-teal-600',
      tag: 'VISION AI'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid">
      <header className="max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-[9px] font-black uppercase tracking-widest text-primary-500">
            Painel de Controle v4.5 - Sidney Sales
          </div>
          <h1 className="text-4xl md:text-5xl font-black uppercase font-display dark:text-white tracking-tighter">
            Gerenciamento <span className="text-primary-500">Sistêmico</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            Bem-vindo de volta, Sidney. Suas ferramentas de engenharia estão prontas.
          </p>
        </div>
        
        <div className="flex gap-4">
          <Link to="/" className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all">
            Visualizar Site
          </Link>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all"
          >
            Encerrar Sessão
          </button>
        </div>
      </header>

      {/* Quick Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-primary-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 relative z-10">Balanço do Mês</p>
            <h3 className="text-3xl font-black text-primary-500 relative z-10">R$ {stats.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-blue-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 relative z-10">Clientes Ativos</p>
            <h3 className="text-3xl font-black text-blue-500 relative z-10">{stats.clients} Marcas</h3>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-purple-500/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2 relative z-10">Operações Realizadas</p>
            <h3 className="text-3xl font-black text-purple-500 relative z-10">{stats.transactions} Docs</h3>
         </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {tools.map((tool, idx) => (
          <motion.div key={idx} whileHover={{ y: -5 }}>
            <Link 
              to={tool.path}
              className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 shadow-xl hover:shadow-2xl transition-all overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${tool.color} opacity-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700`}></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} text-white flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform`}>
                  <span className="material-icons-outlined text-2xl">{tool.icon}</span>
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500">
                  {tool.tag}
                </span>
              </div>

              <h3 className="text-xl font-black uppercase font-display dark:text-white mb-4 group-hover:text-primary-500 transition-colors leading-tight relative z-10">
                {tool.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-8 flex-1 relative z-10">
                {tool.desc}
              </p>
              
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary-500 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
                Abrir Sistema
                <span className="material-icons-outlined text-sm group-hover:translate-x-2 transition-transform">east</span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
