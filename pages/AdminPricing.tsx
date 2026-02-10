
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export const AdminPricing: React.FC = () => {
  const navigate = useNavigate();
  
  const [width, setWidth] = useState<number>(2.5);
  const [height, setHeight] = useState<number>(1.2);
  const [rate, setRate] = useState<number>(35);

  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_session') === 'true';
    if (!isAdmin) navigate('/admin');
  }, [navigate]);

  // Cálculos computados diretamente no render para evitar lags
  const area = width * height;
  const total = area * rate;

  const quickSizes = [
    { label: 'Banner P', w: 0.6, h: 0.4 },
    { label: 'Banner M', w: 1.0, h: 1.0 },
    { label: 'Banner G', w: 2.0, h: 1.0 },
    { label: 'A4 Folha', w: 0.21, h: 0.297 },
    { label: 'Fachada XL', w: 2.5, h: 1.2 },
    { label: 'Outdoor', w: 9.0, h: 3.0 },
  ];

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid relative transition-colors duration-500">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary-500 transition-all shadow-lg group">
            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter leading-none">
              Calculadora de <span className="text-primary-500 italic">Precificação</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Orçamentos por Área Métrica (m²)</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-5 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden"
          >
            <div className="engineering-grid absolute inset-0 opacity-5"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor do m² (R$)</label>
                <div className="relative group">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">R$</span>
                  <input 
                    type="number" 
                    value={rate}
                    onChange={(e) => setRate(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-14 pr-6 py-5 outline-none focus:ring-2 focus:ring-primary-500 text-3xl font-black dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Largura (m)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={width}
                    onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-primary-500 text-xl font-bold dark:text-white transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Altura (m)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    value={height}
                    onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none focus:ring-2 focus:ring-primary-500 text-xl font-bold dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Atalhos de Formato</label>
                <div className="grid grid-cols-3 gap-2">
                  {quickSizes.map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setWidth(size.w); setHeight(size.h); }}
                      className="px-3 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl text-[9px] font-black uppercase tracking-tighter hover:bg-primary-500 hover:text-white transition-all border border-transparent hover:shadow-lg flex flex-col items-center gap-1 group"
                    >
                      <span className="text-slate-500 group-hover:text-white/60">{size.label}</span>
                      <span className="font-medium opacity-50">{size.w}x{size.h}m</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="bg-primary-500/10 border border-primary-500/20 p-8 rounded-[3rem] space-y-4">
             <div className="flex items-center gap-3 text-primary-500">
                <span className="material-icons-outlined">engineering</span>
                <h4 className="text-[10px] font-black uppercase tracking-widest">Dimensionamento Ativo</h4>
             </div>
             <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Cálculo em tempo real: <span className="font-black text-primary-500">{width}m</span> x <span className="font-black text-primary-500">{height}m</span> = <span className="font-black text-primary-500">{area.toFixed(2)}m²</span>. 
             </p>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[4rem] p-12 shadow-2xl flex flex-col h-full overflow-hidden relative group"
          >
            <div className="engineering-grid absolute inset-0 opacity-10"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-primary-500 mb-10 text-center">Simulação Proporcional</h3>
                
                <div className="flex items-center justify-center p-12 bg-slate-50 dark:bg-slate-950/50 rounded-[3.5rem] border border-dashed border-slate-200 dark:border-slate-800 min-h-[400px] relative">
                   <div 
                    className="bg-primary-500/15 border-2 border-primary-500 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.3)] flex items-center justify-center relative transition-all duration-700 ease-in-out"
                    style={{ 
                      width: `${Math.min(100, (width / Math.max(width, height)) * 100)}%`,
                      aspectRatio: `${width} / ${height}`,
                      maxHeight: '100%',
                      maxWidth: '100%'
                    }}
                   >
                     <div className="scan-animation"></div>
                     <div className="flex flex-col items-center gap-1">
                        <span className="material-icons-outlined text-primary-500 text-3xl opacity-50">crop_free</span>
                        <span className="text-[12px] font-black text-primary-500 uppercase tracking-[0.2em] opacity-80 whitespace-nowrap">
                          {width} x {height}m
                        </span>
                     </div>
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 border-t border-slate-100 dark:border-slate-800 pt-12">
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Metragem Quadrada</span>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <h4 className="text-6xl font-black dark:text-white tracking-tighter leading-none">{area.toFixed(2).replace('.', ',')}</h4>
                    <span className="text-sm font-black text-slate-400 uppercase">m²</span>
                  </div>
                </div>
                <div className="space-y-2 text-center md:text-left">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500">Valor Estimado</span>
                  <div className="flex items-baseline justify-center md:justify-start gap-2">
                    <h4 className="text-6xl font-black text-primary-500 tracking-tighter leading-none">{formatCurrency(total)}</h4>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-10 right-10">
                <button 
                  onClick={() => { 
                    const text = `📐 Orçamento CidEngenharia:\nItem: Impressão Lona/Adesivo\nDimensões: ${width}x${height}m\nÁrea: ${area.toFixed(2)}m²\nValor m²: R$ ${rate}\nTotal: ${formatCurrency(total)}`;
                    navigator.clipboard.writeText(text);
                    alert('Orçamento técnico copiado com sucesso!'); 
                  }}
                  className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-500 hover:text-primary-500 transition-all shadow-xl active:scale-95 group/btn"
                >
                  <span className="material-icons-outlined text-2xl group-hover/btn:rotate-12 transition-transform">content_copy</span>
                </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
