
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const DyCardAccess: React.FC = () => {
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);
    // Simula uma validação de identidade digital
    setTimeout(() => {
      navigate('/digital-card');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-6 engineering-grid relative overflow-hidden transition-colors duration-500">
      {/* Luzes de Fundo Dinâmicas */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] animate-pulse delay-700"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="bg-white dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 transition-all duration-500">
          
          {/* Header de Acesso com Scanner Compacto */}
          <div className="text-center space-y-2">
            <div className="relative h-24 w-24 mx-auto mb-6 group">
              <div className="absolute -inset-2 bg-gradient-to-r from-secondary/50 to-primary-500/50 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative h-full w-full rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-slate-950/50">
                <span className={`material-icons-outlined text-4xl transition-all duration-500 ${isValidating ? 'text-secondary scale-110' : 'text-slate-400 dark:text-slate-600'}`}>
                  {isValidating ? 'verified_user' : 'fingerprint'}
                </span>
                {isValidating && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-secondary shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-[scan_1.5s_ease-in-out_infinite]"></div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase font-display">
              Portal <span className="text-secondary">DyCard</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Entre para acessar seus documentos</p>
          </div>

          {/* Formulário de Login */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-center mb-6">
               <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                 Entre com sua conta para criar o seu Dycard.
               </p>
            </div>

            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email</label>
              <div className="relative">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">alternate_email</span>
                <input 
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-sm transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Senha</label>
                <button type="button" className="text-[10px] font-bold text-secondary hover:underline uppercase tracking-wider">Esqueceu a senha?</button>
              </div>
              <div className="relative">
                <span className="material-icons-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">lock</span>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-secondary focus:border-transparent outline-none text-sm transition-all dark:text-white"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-secondary transition-colors"
                >
                  <span className="material-icons-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isValidating}
              className="w-full bg-secondary hover:bg-green-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-secondary/20 transition-all active:scale-95 flex items-center justify-center gap-3 group disabled:opacity-50 mt-4"
            >
              {isValidating ? (
                <>
                  <span className="animate-spin material-icons-outlined text-xl">sync</span>
                  Validando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="material-icons-outlined group-hover:translate-x-1 transition-transform">login</span>
                </>
              )}
            </button>
          </form>

          {/* Links Auxiliares */}
          <div className="space-y-4 pt-4 text-center border-t border-slate-100 dark:border-slate-800/50">
            <button className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-secondary transition-colors">
              Não tem uma conta? <span className="text-secondary underline underline-offset-4">Cadastre-se</span>
            </button>
            
            <div className="flex flex-col gap-3">
              <button className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-secondary transition-colors">
                <span className="material-icons-outlined text-sm">play_circle</span>
                Assista ao tutorial de acesso
              </button>
              <Link to="/" className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-primary-500 transition-colors">
                <span className="material-icons-outlined text-sm">home</span>
                Voltar para página inicial
              </Link>
            </div>
          </div>

          <div className="text-[9px] text-slate-400 dark:text-slate-600 font-bold uppercase tracking-[0.3em] text-center pt-2">
            CidVisual Engineering Studio &copy; 2025
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
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
