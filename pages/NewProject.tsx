
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    org: 'CidEngenharia Studio',
    region: 'South America (Sao Paulo)',
    tier: 'pro',
    stack: 'react-ui'
  });

  const handleCreate = () => {
    setLoading(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  const stacks = [
    { id: 'react-ui', name: 'React UI Kit', icon: 'widgets', desc: 'Interfaces modernas com Tailwind & Framer' },
    { id: 'three-3d', name: 'Engine 3D', icon: 'view_in_ar', desc: 'Visualizações imersivas com Three.js' },
    { id: 'ai-gen', name: 'AI Gen Layer', icon: 'psychology', desc: 'Integração nativa com Gemini & LLMs' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] text-slate-900 dark:text-slate-100 font-body">
      {/* Top Nav / Breadcrumbs */}
      <nav className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between bg-white dark:bg-[#09090b]">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1">
            <span className="material-icons-outlined text-lg">home</span>
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="text-slate-500">{formData.org}</span>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-medium">Criar novo projeto</span>
        </div>
        <button onClick={() => navigate(-1)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">
          <span className="material-icons-outlined">close</span>
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-12">
          <header>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Novo Projeto Visual</h1>
            <p className="text-slate-500 dark:text-slate-400">Configure as bases para a sua nova experiência digital de engenharia.</p>
          </header>

          {/* Section: Project Info */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="material-icons-outlined text-primary-500">settings</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Configurações Gerais</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Nome do Projeto</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="ex: Plataforma Horizon"
                  className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase text-slate-500">Organização</label>
                <select className="w-full bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2 outline-none">
                  <option>CidEngenharia Studio</option>
                  <option>Personal Workspace</option>
                </select>
              </div>
            </div>
          </section>

          {/* Section: Engine Selection */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="material-icons-outlined text-primary-500">layers</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Engine Visual & Stack</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stacks.map(s => (
                <button 
                  key={s.id}
                  onClick={() => setFormData({...formData, stack: s.id})}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    formData.stack === s.id 
                    ? 'border-primary-500 bg-primary-500/5 ring-1 ring-primary-500' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <span className={`material-icons-outlined mb-3 ${formData.stack === s.id ? 'text-primary-500' : 'text-slate-400'}`}>
                    {s.icon}
                  </span>
                  <div className="font-bold text-sm mb-1">{s.name}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{s.desc}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Infrastructure */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="material-icons-outlined text-primary-500">public</span>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Infraestrutura de Render</h2>
            </div>
            
            <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm">Região de Deployment</div>
                  <div className="text-xs text-slate-500 italic">Otimize a latência para os seus usuários finais</div>
                </div>
                <select className="bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-md px-3 py-1.5 text-sm outline-none">
                  <option>South America (Sao Paulo)</option>
                  <option>US East (N. Virginia)</option>
                  <option>Europe (Frankfurt)</option>
                </select>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Summary */}
        <div className="lg:w-80 space-y-6">
          <div className="sticky top-24 bg-white dark:bg-[#09090b] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-white/5">
              <h3 className="font-bold text-sm">Resumo do Projeto</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Nome:</span>
                <span className="font-mono text-primary-500">{formData.name || 'Sem nome'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Stack:</span>
                <span className="text-slate-900 dark:text-slate-300 font-medium">
                  {stacks.find(s => s.id === formData.stack)?.name}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Plano:</span>
                <span className="bg-primary-500/10 text-primary-500 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase">Pro Tier</span>
              </div>
              
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-xl font-bold">R$ 450</span>
                    <span className="text-xs text-slate-500 ml-1">/mês</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={handleCreate}
                disabled={!formData.name || loading}
                className="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20"
              >
                {loading ? (
                  <>
                    <span className="animate-spin material-icons-outlined text-sm">refresh</span>
                    Provisionando...
                  </>
                ) : (
                  <>
                    Criar Projeto
                    <span className="material-icons-outlined text-sm">rocket_launch</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="px-6 py-4 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-slate-800">
               <div className="flex gap-2 items-center text-[10px] text-slate-400">
                  <span className="material-icons-outlined text-xs">info</span>
                  Provisionamento imediato após confirmação.
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
