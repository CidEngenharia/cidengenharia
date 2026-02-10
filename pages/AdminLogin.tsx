
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ title: string; detail: string; isConfig?: boolean } | null>(null);

  // E-mail autorizado do Administrador
  const ADMIN_EMAIL = 'sidney.sales@gmail.com';

  useEffect(() => {
    const checkUser = async () => {
      // Verifica se já existe uma sessão ativa
      const { data: { user } } = await supabase.auth.getUser();
      const hasLocalSession = localStorage.getItem('admin_session') === 'true';
      
      if ((user && user.email === ADMIN_EMAIL) || hasLocalSession) {
        // Garante que ambos estejam sincronizados
        localStorage.setItem('admin_session', 'true');
        navigate('/admin/dashboard');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Se for um erro de credenciais, mas o e-mail for o do Sidney, 
        // damos um feedback mais técnico ou permitimos revisão.
        if (authError.message === "Invalid login credentials" && email === ADMIN_EMAIL) {
          throw new Error("Chave de Segurança incorreta para este administrador.");
        }
        throw authError;
      }

      // Verificação de segurança adicional
      if (data && data.user && data.user.email !== ADMIN_EMAIL) {
        await supabase.auth.signOut();
        throw new Error("Acesso restrito ao administrador Sidney Sales.");
      }

      // Login bem sucedido: Salva flag de compatibilidade para subpáginas
      localStorage.setItem('admin_session', 'true');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError({
        title: "Falha na Autenticação",
        detail: err.message === "Invalid login credentials" 
          ? "E-mail ou Chave de Segurança incorretos." 
          : err.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin + '/#/admin/dashboard'
        }
      });

      if (authError) {
        if (authError.message.toLowerCase().includes("not enabled") || authError.message.includes("provider")) {
          setError({
            title: "Configuração Pendente",
            detail: "O login via GitHub não está ativado no painel do Supabase. Use seu e-mail administrativo abaixo.",
            isConfig: true
          });
          setIsLoading(false);
          return;
        }
        throw authError;
      }
      
      // Se não deu erro, a flag de sessão será setada pelo useEffect do Dashboard ao carregar
      localStorage.setItem('admin_session', 'true');
    } catch (err: any) {
      setError({
        title: "Erro de Conexão",
        detail: err.message || "Não foi possível conectar ao GitHub."
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f8fafc] dark:bg-[#020617] engineering-grid relative overflow-hidden transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-[120px] -z-10 animate-pulse"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 md:p-14 shadow-2xl space-y-8 relative z-10"
      >
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-primary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-500/20 group hover:rotate-[360deg] transition-transform duration-1000">
            <span className="material-icons-outlined text-white text-4xl">admin_panel_settings</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter leading-none">
            Acesso <span className="text-primary-500 italic">Estratégico</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ambiente Administrativo Seguro</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-5 border rounded-2xl space-y-1 overflow-hidden mb-4 ${error.isConfig ? 'bg-amber-500/10 border-amber-500/20' : 'bg-red-500/10 border-red-500/20'}`}
            >
              <h4 className={`text-[10px] font-black uppercase flex items-center gap-2 ${error.isConfig ? 'text-amber-600' : 'text-red-500'}`}>
                <span className="material-icons-outlined text-sm">{error.isConfig ? 'settings_suggest' : 'warning'}</span>
                {error.title}
              </h4>
              <p className={`text-[10px] font-medium leading-relaxed ${error.isConfig ? 'text-amber-700/80 dark:text-amber-400/80' : 'text-red-600/80 dark:text-red-400/80'}`}>
                {error.detail}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
           <button 
             onClick={handleGitHubLogin}
             disabled={isLoading}
             className="w-full group bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black py-5 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px] overflow-hidden relative"
           >
             <div className="absolute inset-0 bg-primary-500/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
             <svg className="w-5 h-5 fill-current relative z-10" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
             <span className="relative z-10">Conectar via GitHub</span>
           </button>
        </div>

        <div className="relative py-4 flex items-center justify-center">
           <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800"></div></div>
           <span className="relative px-4 bg-white dark:bg-[#0f172a] text-[9px] font-black uppercase text-slate-400 tracking-widest">Ou com credencial</span>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">E-mail Administrativo</label>
            <div className="relative">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">email</span>
              <input 
                type="email" 
                required 
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="sidney.sales@gmail.com"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Chave de Segurança</label>
            <div className="relative">
              <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock_person</span>
              <input 
                type="password" 
                required 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none dark:text-white transition-all text-sm font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-[11px]"
          >
            {isLoading ? (
              <span className="animate-spin material-icons-outlined text-lg">sync</span>
            ) : (
              <>Entrar no Painel <span className="material-icons-outlined text-lg">login</span></>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-800">
          <button onClick={() => navigate('/')} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-2 mx-auto">
            <span className="material-icons-outlined text-sm">west</span> Voltar ao Home
          </button>
        </div>
      </motion.div>

      <style>{`
        .engineering-grid {
          background-size: 40px 40px;
          background-image: 
              linear-gradient(to right, rgba(0,0,0,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.02) 1px, transparent 1px);
        }
        .dark .engineering-grid {
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};
