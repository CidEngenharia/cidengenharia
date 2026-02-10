
import React from 'react';

const MetricCard: React.FC<{ title: string; value: string; subValue?: string; subColor?: string; icon?: string }> = ({ title, value, subValue, subColor, icon }) => (
  <div className="bg-white dark:bg-slate-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col justify-between min-h-[140px] shadow-sm">
    <div className="flex justify-between items-start">
      <span className="text-slate-500 dark:text-slate-400 text-sm font-semibold">{title}</span>
      {icon && <span className="material-icons-outlined text-slate-400">{icon}</span>}
    </div>
    <div className="mt-2">
      <div className="flex items-center gap-2">
        <h3 className="text-3xl font-bold dark:text-white">{value}</h3>
        {subValue && (
          <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${subColor || 'bg-slate-100 text-slate-500'}`}>
            {subValue}
          </span>
        )}
      </div>
    </div>
  </div>
);

const ChartLabel: React.FC<{ label: string; color: string; position: string }> = ({ label, color, position }) => (
  <div className={`absolute top-0 transform -translate-x-1/2 flex flex-col items-center gap-2 z-10`} style={{ left: position }}>
    <div className={`px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-lg whitespace-nowrap`} style={{ backgroundColor: color }}>
      {label}
    </div>
    <div className="w-px h-64 bg-slate-200 dark:bg-slate-800 border-dashed border-l opacity-50"></div>
  </div>
);

export const MarketAnalysis: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Main Chart Area */}
        <div className="flex-1 space-y-8">
          <div className="bg-white dark:bg-slate-900/50 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 relative shadow-sm min-h-[500px]">
            <div className="flex justify-between items-center mb-12">
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs font-bold text-slate-500">Volume de Vendas</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span className="text-xs font-bold text-slate-500">Receita Média</span>
                 </div>
              </div>
              <div className="flex gap-2">
                 {['7D', '30D', '90D', '1Y'].map(t => (
                    <button key={t} className={`px-3 py-1 rounded-lg text-[10px] font-bold ${t === '90D' ? 'bg-primary-500 text-white' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                      {t}
                    </button>
                 ))}
              </div>
            </div>

            {/* Chart SVG Representation */}
            <div className="relative h-64 w-full mt-10">
              {/* Grid Lines */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="absolute w-full h-px bg-slate-100 dark:bg-slate-800/50" style={{ bottom: `${i * 25}%` }}>
                  <span className="absolute -left-16 transform -translate-y-1/2 text-[10px] text-slate-400 font-medium">R$ {1.8 + i * 0.2} bi</span>
                  <span className="absolute -right-16 transform -translate-y-1/2 text-[10px] text-slate-400 font-medium">{8 + i} mi</span>
                </div>
              ))}

              {/* Sazonalidade Labels */}
              <ChartLabel label="Dia dos Pais" color="#ec4899" position="15%" />
              <ChartLabel label="Independência do Brasil" color="#3b82f6" position="35%" />
              <ChartLabel label="Halloween" color="#f97316" position="75%" />
              <ChartLabel label="Nossa Sra Aparecida" color="#6366f1" position="55%" />

              {/* Lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                {/* Purple Line */}
                <path 
                  d="M0 160 Q 150 170, 300 155 T 600 150 T 900 130" 
                  fill="none" 
                  stroke="#a855f7" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                {/* Blue Line */}
                <path 
                  d="M0 190 L 150 120 L 300 190 L 450 80 L 600 110 L 750 30 L 900 10" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="4" 
                  strokeLinecap="round"
                />
              </svg>

              {/* Bottom Month Labels */}
              <div className="absolute -bottom-12 w-full flex justify-between px-10">
                {['Ago', 'Set', 'Out', 'Nov'].map(m => (
                  <span key={m} className="text-sm font-bold text-slate-400">{m}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Metric Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard 
              title="Receita" 
              value="R$ 2,5 bi" 
              subValue="↑ 20%" 
              subColor="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
            />
            <MetricCard 
              title="Monopolização" 
              value="6,6%" 
              subValue="Baixo" 
              subColor="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            />
            <MetricCard 
              title="Pico de sazonalidade" 
              value="Maio" 
            />
          </div>
        </div>

        {/* Opportunity Sidebar */}
        <div className="lg:w-[320px]">
          <div className="bg-[#f0fdf4] dark:bg-emerald-950/20 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 shadow-xl h-full sticky top-8">
            <span className="text-emerald-700/60 dark:text-emerald-400/60 text-sm font-bold uppercase tracking-wider mb-2 block">Oportunidade</span>
            <h2 className="text-5xl font-black text-emerald-900 dark:text-emerald-200 mb-8 font-display">Alta</h2>
            
            <ul className="space-y-6">
              {[
                { label: '13,1% vendedores com medalhas', color: 'bg-emerald-500' },
                { label: 'R$ 6,8 mil receita por vendedor', color: 'bg-emerald-500' },
                { label: '6,4% variação de receita', color: 'bg-emerald-500' },
                { label: '20% de monopolização', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${item.color}`}></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-12 p-6 rounded-2xl bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-emerald-100/50 dark:border-emerald-900/50">
               <p className="text-xs text-emerald-800/70 dark:text-emerald-400/70 leading-relaxed italic">
                 "O mercado apresenta baixa concentração e alta fragmentação de nichos, indicando momento ideal para expansão de estoque nos setores de Presentes."
               </p>
            </div>
            
            <button className="w-full mt-8 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center gap-2">
               Baixar Relatório Completo
               <span className="material-icons-outlined text-sm">download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
