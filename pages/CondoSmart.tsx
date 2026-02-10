
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

interface DesignElement {
  id: string;
  type: 'text' | 'logo';
  content?: string;
  imageUrl?: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  fontWeight?: string;
  align: 'left' | 'center' | 'right';
  width?: number;
}

interface SideData {
  elements: DesignElement[];
  bgClass: string;
  bgStyle: React.CSSProperties;
  customBgImage: string | null;
}

const fonts = ['Space Grotesk', 'Plus Jakarta Sans', 'Barlow Condensed', 'Roboto', 'Pinyon Script', 'Serif'];

const sophisticatedPalette = [
  '#ffffff', '#000000', '#fecaca', '#fde68a', '#d1fae5', '#bfdbfe', '#ddd6fe', '#fbcfe8',
  '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6',
  '#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777',
  '#991b1b', '#92400e', '#055f46', '#1e40af', '#5b21b6', '#9d174d',
  '#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'
];

const initialTemplates = {
  card: [
    { name: 'Modern Dark', bg: 'bg-slate-900', elements: [
      { id: '1', type: 'text', content: 'SEU NOME AQUI', x: 50, y: 35, fontSize: 18, fontFamily: 'Space Grotesk', color: '#10b981', fontWeight: '900', align: 'center' },
      { id: '2', type: 'text', content: 'Engenheiro Visual', x: 50, y: 55, fontSize: 10, fontFamily: 'Plus Jakarta Sans', color: '#94a3b8', fontWeight: '500', align: 'center' }
    ]},
    { name: 'Minimalist White', bg: 'bg-white', elements: [
      { id: '1', type: 'text', content: 'Nome da Empresa', x: 10, y: 15, fontSize: 14, fontFamily: 'Barlow Condensed', color: '#000', fontWeight: '800', align: 'left' },
      { id: '2', type: 'text', content: 'Design & Tecnologia', x: 10, y: 25, fontSize: 8, fontFamily: 'Plus Jakarta Sans', color: '#666', fontWeight: '400', align: 'left' }
    ]},
    { name: 'Eco Green', bg: 'bg-emerald-950', elements: [
      { id: '1', type: 'text', content: 'SUSTENTABILIDADE', x: 50, y: 45, fontSize: 16, fontFamily: 'Space Grotesk', color: '#d1fae5', fontWeight: '900', align: 'center' }
    ]},
    { name: 'Luxury Gold', bg: 'bg-[#1a1a1a]', elements: [
      { id: '1', type: 'text', content: 'EXECUTIVE', x: 50, y: 40, fontSize: 20, fontFamily: 'Serif', color: '#fbbf24', fontWeight: '400', align: 'center' }
    ]}
  ],
  invite: [
    { name: 'Royal Gold', bg: 'bg-amber-50', elements: [
      { id: '1', type: 'text', content: 'CONVITE ESPECIAL', x: 50, y: 20, fontSize: 24, fontFamily: 'Pinyon Script', color: '#b45309', fontWeight: '400', align: 'center' },
      { id: '2', type: 'text', content: 'Sua presença é essencial', x: 50, y: 40, fontSize: 12, fontFamily: 'Plus Jakarta Sans', color: '#78350f', fontWeight: '600', align: 'center' }
    ]},
    { name: 'Midnight Party', bg: 'bg-indigo-950', elements: [
      { id: '1', type: 'text', content: 'CELEBRAÇÃO', x: 50, y: 30, fontSize: 28, fontFamily: 'Barlow Condensed', color: '#fff', fontWeight: '900', align: 'center' }
    ]}
  ]
};

export const CondoSmart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'type' | 'text' | 'bg' | 'layers' | 'logo'>('type');
  const [designType, setDesignType] = useState<'card' | 'invite'>('card');
  const [currentSide, setCurrentSide] = useState<'front' | 'back'>('front');
  
  const [frontData, setFrontData] = useState<SideData>({
    elements: initialTemplates.card[0].elements as any,
    bgClass: initialTemplates.card[0].bg,
    bgStyle: {},
    customBgImage: null
  });

  const [backData, setBackData] = useState<SideData>({
    elements: [],
    bgClass: 'bg-white',
    bgStyle: {},
    customBgImage: null
  });

  const activeData = currentSide === 'front' ? frontData : backData;
  const setActiveData = currentSide === 'front' ? setFrontData : setBackData;

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAILoading, setIsAILoading] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const selectedElement = activeData.elements.find(e => e.id === selectedId);

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setActiveData(prev => ({
      ...prev,
      elements: prev.elements.map(e => e.id === id ? { ...e, ...updates } : e)
    }));
  };

  const addLayer = () => {
    const newId = Date.now().toString();
    const offsetCount = activeData.elements.length % 8;
    const isDark = activeData.bgClass.includes('900') || activeData.bgClass.includes('950') || activeData.bgClass.includes('black');
    
    const newElement: DesignElement = { 
      id: newId, 
      type: 'text', 
      content: 'Novo Texto', 
      x: 50, 
      y: 15 + (offsetCount * 10),
      fontSize: 16, 
      fontFamily: 'Plus Jakarta Sans', 
      color: isDark ? '#ffffff' : '#000000', 
      fontWeight: '500', 
      align: 'center' 
    };
    setActiveData(prev => ({ ...prev, elements: [...prev.elements, newElement] }));
    setSelectedId(newId);
    setActiveTab('text');
  };

  const addLogo = (url: string) => {
    const newId = 'logo-' + Date.now();
    const newElement: DesignElement = {
      id: newId,
      type: 'logo',
      imageUrl: url,
      x: 50,
      y: 50,
      width: 100,
      align: 'center'
    };
    setActiveData(prev => ({ ...prev, elements: [...prev.elements, newElement] }));
    setSelectedId(newId);
  };

  const setLogoPosition = (align: 'left' | 'center' | 'right') => {
    if (!selectedId || !selectedElement || selectedElement.type !== 'logo') return;
    let x = 50;
    if (align === 'left') x = 15;
    if (align === 'right') x = 85;
    updateElement(selectedId, { align, x });
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newElements = [...activeData.elements];
    const targetIndex = direction === 'up' ? index + 1 : index - 1;
    if (targetIndex >= 0 && targetIndex < newElements.length) {
      [newElements[index], newElements[targetIndex]] = [newElements[targetIndex], newElements[index]];
      setActiveData(prev => ({ ...prev, elements: newElements }));
    }
  };

  const deleteLayer = (id: string) => {
    setActiveData(prev => ({ ...prev, elements: prev.elements.filter(item => item.id !== id) }));
    if (selectedId === id) setSelectedId(null);
  };

  const handleBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        const result = event.target?.result as string;
        img.onload = () => {
          const isCard = designType === 'card';
          const ratio = img.width / img.height;
          const targetRatio = isCard ? (9 / 5) : (10 / 15);
          
          if (Math.abs(ratio - targetRatio) > 0.1) {
            alert(`A imagem precisa ser no tamanho específico do projeto escolhido.\n\nFormato esperado: ${isCard ? '9x5cm (Horizontal)' : '10x15cm (Vertical)'}.\n\nSua proporção: ${ratio.toFixed(2)}, Proporção desejada: ${targetRatio.toFixed(2)}`);
            if (bgInputRef.current) bgInputRef.current.value = '';
            return;
          }

          setActiveData(prev => ({
            ...prev,
            customBgImage: result,
            bgClass: '',
            bgStyle: { 
              backgroundImage: `url(${result})`, 
              backgroundSize: '100% 100%', 
              backgroundRepeat: 'no-repeat',
              backgroundColor: 'transparent'
            }
          }));
        };
        img.src = result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => addLogo(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAIContent = async () => {
    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Gere 3 frases curtas e profissionais para um ${designType === 'card' ? 'Cartão de Visita' : 'Convite de Evento Premium'}. Retorne apenas as frases separadas por ponto e vírgula.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const suggestions = (response.text || "").split(';').map(s => s.trim());
      if (selectedId && selectedElement?.type === 'text') {
        updateElement(selectedId, { content: suggestions[0] });
      } else {
        addLayer();
        setTimeout(() => {
           setActiveData(prev => {
             const last = prev.elements[prev.elements.length - 1];
             return { ...prev, elements: prev.elements.map(e => e.id === last.id ? {...e, content: suggestions[0]} : e) };
           });
        }, 50);
      }
    } catch (err) { console.error(err); } finally { setIsAILoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex flex-col">
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50 sticky top-0 shadow-sm">
        <div className="flex items-center gap-4">
          <Link to="/shop" className="text-slate-400 hover:text-primary-500 transition-colors">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <h1 className="text-lg font-black uppercase font-display dark:text-white flex items-center gap-2 tracking-tight">
            CondoSmart <span className="text-primary-500 italic">Studio</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 mr-4">
            <button 
              onClick={() => { setCurrentSide('front'); setSelectedId(null); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentSide === 'front' ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-sm' : 'text-slate-400'}`}
            >Frente</button>
            <button 
              onClick={() => { setCurrentSide('back'); setSelectedId(null); }}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentSide === 'back' ? 'bg-white dark:bg-slate-700 text-primary-500 shadow-sm' : 'text-slate-400'}`}
            >Verso</button>
          </div>
          <button 
            onClick={handleAIContent}
            disabled={isAILoading}
            className="hidden md:flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all border border-purple-500/20 disabled:opacity-50"
          >
            {isAILoading ? <span className="animate-spin material-icons-outlined text-sm">sync</span> : <span className="material-icons-outlined text-sm">auto_awesome</span>}
            IA Sugestão
          </button>
          <button onClick={() => alert("Salvando arte frente e verso...")} className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">
            <span className="material-icons-outlined text-sm">download</span>
            Baixar
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-16 md:w-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col items-center py-6 gap-6 z-40">
          {[
            { id: 'type', icon: 'grid_view', label: 'Templates' },
            { id: 'logo', icon: 'image', label: 'Logo' },
            { id: 'text', icon: 'title', label: 'Texto' },
            { id: 'bg', icon: 'palette', label: 'Fundo' },
            { id: 'layers', icon: 'layers', label: 'Layers' }
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTab(tool.id as any)}
              className={`flex flex-col items-center gap-1 group transition-all ${activeTab === tool.id ? 'text-primary-500' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${activeTab === tool.id ? 'bg-primary-500/10' : 'hover:bg-slate-100 dark:hover:bg-white/5'}`}>
                <span className="material-icons-outlined text-xl">{tool.icon}</span>
              </div>
              <span className="text-[8px] font-black uppercase tracking-tighter">{tool.label}</span>
            </button>
          ))}
        </aside>

        <AnimatePresence mode="wait">
          <motion.aside
            key={activeTab}
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-64 md:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 z-30 hidden lg:block overflow-y-auto custom-scrollbar"
          >
            {activeTab === 'type' && (
              <div className="space-y-8 animate-fade-in">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Formato & Estilo</h3>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setDesignType('card')} className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${designType === 'card' ? 'border-primary-500 bg-primary-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    <span className="material-icons-outlined text-2xl text-slate-400">credit_card</span>
                    <div><p className="text-[11px] font-black uppercase dark:text-white">Cartão de Visita</p><p className="text-[9px] text-slate-400 uppercase">9x5 cm</p></div>
                  </button>
                  <button onClick={() => setDesignType('invite')} className={`p-4 rounded-2xl border text-left flex items-center gap-4 transition-all ${designType === 'invite' ? 'border-primary-500 bg-primary-500/5' : 'border-slate-100 dark:border-slate-800'}`}>
                    <span className="material-icons-outlined text-2xl text-slate-400">mail</span>
                    <div><p className="text-[11px] font-black uppercase dark:text-white">Convite Premium</p><p className="text-[9px] text-slate-400 uppercase">10x15 cm</p></div>
                  </button>
                </div>

                <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                   <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-4">Modelos Sugeridos</h3>
                   <div className="grid grid-cols-2 gap-3">
                      {(designType === 'card' ? initialTemplates.card : initialTemplates.invite).map((t, idx) => (
                        <button key={idx} onClick={() => { setActiveData(prev => ({ ...prev, bgClass: t.bg, bgStyle: {}, customBgImage: null, elements: t.elements as any })); }} className="w-full aspect-[1.8/1] rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden group relative hover:border-primary-500 transition-all">
                           <div className={`w-full h-full ${t.bg}`}></div>
                           <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all">
                              <span className="text-[8px] font-black text-white uppercase tracking-widest">Usar</span>
                           </div>
                        </button>
                      ))}
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'logo' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Logomarca</h3>
                <div onClick={() => logoInputRef.current?.click()} className="aspect-square bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-all group overflow-hidden">
                  <span className="material-icons-outlined text-3xl text-slate-300 group-hover:text-primary-500 mb-2">add_photo_alternate</span>
                  <span className="text-[9px] font-black uppercase text-slate-400">Upload Logo</span>
                  <input type="file" ref={logoInputRef} hidden accept="image/*" onChange={handleLogoUpload} />
                </div>
                
                {selectedElement?.type === 'logo' && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Posicionamento</label>
                    <div className="grid grid-cols-3 gap-2">
                       <button onClick={() => setLogoPosition('left')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500/10 hover:text-primary-500 transition-all flex flex-col items-center gap-1">
                          <span className="material-icons-outlined text-sm">align_horizontal_left</span>
                          <span className="text-[8px] font-bold uppercase">Esquerda</span>
                       </button>
                       <button onClick={() => setLogoPosition('center')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500/10 hover:text-primary-500 transition-all flex flex-col items-center gap-1">
                          <span className="material-icons-outlined text-sm">align_horizontal_center</span>
                          <span className="text-[8px] font-bold uppercase">Centro</span>
                       </button>
                       <button onClick={() => setLogoPosition('right')} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-primary-500/10 hover:text-primary-500 transition-all flex flex-col items-center gap-1">
                          <span className="material-icons-outlined text-sm">align_horizontal_right</span>
                          <span className="text-[8px] font-bold uppercase">Direita</span>
                       </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tamanho (px)</label>
                      <input type="number" value={selectedElement.width} onChange={e => updateElement(selectedId!, { width: parseInt(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3 text-xs outline-none dark:text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'text' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Edição de Texto</h3>
                {!selectedId || selectedElement?.type !== 'text' ? (
                   <div className="text-center py-10 px-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                      <span className="material-icons-outlined text-3xl text-slate-300 mb-2">touch_app</span>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Selecione um texto no canvas</p>
                   </div>
                ) : (
                  <div className="space-y-6">
                    <textarea value={selectedElement?.content} onChange={(e) => updateElement(selectedId, { content: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-sm outline-none dark:text-white focus:ring-2 focus:ring-primary-500" rows={3} />
                    <div className="grid grid-cols-2 gap-4">
                       <select value={selectedElement?.fontFamily} onChange={(e) => updateElement(selectedId, { fontFamily: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs outline-none dark:text-white">
                          {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                       </select>
                       <input type="number" value={selectedElement?.fontSize} onChange={(e) => updateElement(selectedId, { fontSize: parseInt(e.target.value) })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-3 text-xs outline-none dark:text-white" />
                    </div>
                    <div className="space-y-2">
                      <input type="color" value={selectedElement?.color} onChange={(e) => updateElement(selectedId, { color: e.target.value })} className="w-full h-10 bg-transparent cursor-pointer rounded-xl overflow-hidden mb-2" />
                      <div className="grid grid-cols-6 gap-1">
                        {sophisticatedPalette.map(c => (
                          <button key={c} onClick={() => updateElement(selectedId!, { color: c })} className={`aspect-square rounded-sm border border-slate-200/20 ${selectedElement?.color === c ? 'ring-2 ring-primary-500 scale-110' : ''}`} style={{ backgroundColor: c }} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={addLayer} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Adicionar Texto</button>
              </div>
            )}

            {activeTab === 'bg' && (
              <div className="space-y-6 animate-fade-in">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Personalizar Fundo</h3>
                <div onClick={() => bgInputRef.current?.click()} className="aspect-video bg-slate-50 dark:bg-slate-950 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-all group overflow-hidden">
                  {activeData.customBgImage ? <img src={activeData.customBgImage} className="w-full h-full object-cover" /> : <><span className="material-icons-outlined text-2xl text-slate-300 group-hover:text-primary-500">add_photo_alternate</span><span className="text-[8px] font-black uppercase text-slate-400 mt-2 text-center px-4">Upload {designType === 'card' ? '9x5' : '10x15'}</span></>}
                  <input type="file" ref={bgInputRef} hidden accept="image/*" onChange={handleBgUpload} />
                </div>
                {activeData.customBgImage && <button onClick={() => setActiveData(prev => ({ ...prev, customBgImage: null, bgStyle: {}, bgClass: 'bg-white' }))} className="w-full text-[9px] font-black text-red-500 uppercase tracking-widest text-center">Remover Imagem</button>}
                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Paleta de Fundo</label>
                  <div className="grid grid-cols-6 gap-2">
                    {sophisticatedPalette.map(c => (
                      <button key={c} onClick={() => { setActiveData(prev => ({ ...prev, bgClass: '', bgStyle: { backgroundColor: c }, customBgImage: null })); }} className={`aspect-square rounded-lg border-2 transition-all ${activeData.bgStyle.backgroundColor === c ? 'border-primary-500 scale-110 shadow-lg' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'layers' && (
               <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black uppercase tracking-widest text-primary-500">Gerenciar Camadas</h3>
                    <button onClick={addLayer} className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"><span className="material-icons-outlined text-base">add</span></button>
                  </div>
                  <div className="space-y-3">
                     {[...activeData.elements].reverse().map((el, revIdx) => {
                       const actualIdx = activeData.elements.length - 1 - revIdx;
                       return (
                         <div key={el.id} onClick={() => setSelectedId(el.id)} className={`p-3 rounded-xl border flex items-center justify-between group cursor-pointer transition-all ${selectedId === el.id ? 'border-primary-500 bg-primary-500/5 shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50'}`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                               <div className="flex flex-col gap-0.5">
                                 <button onClick={(e) => { e.stopPropagation(); moveLayer(actualIdx, 'up'); }} disabled={actualIdx === activeData.elements.length - 1} className="text-slate-400 hover:text-primary-500 disabled:opacity-20 transition-colors"><span className="material-icons-outlined text-xs leading-none">expand_less</span></button>
                                 <button onClick={(e) => { e.stopPropagation(); moveLayer(actualIdx, 'down'); }} disabled={actualIdx === 0} className="text-slate-400 hover:text-primary-500 disabled:opacity-20 transition-colors"><span className="material-icons-outlined text-xs leading-none">expand_more</span></button>
                               </div>
                               <span className="text-[10px] font-bold truncate max-w-[100px] dark:text-white uppercase">{el.type === 'text' ? el.content : 'Logomarca'}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); deleteLayer(el.id); }} className="w-8 h-8 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-500/10 transition-all"><span className="material-icons-outlined text-sm">delete</span></button>
                         </div>
                       );
                     })}
                  </div>
               </div>
            )}
          </motion.aside>
        </AnimatePresence>

        <main className="flex-1 bg-slate-100 dark:bg-[#020617] p-8 md:p-16 flex flex-col items-center justify-center overflow-auto custom-scrollbar relative">
          <div className="absolute top-8 left-8 text-slate-400 dark:text-slate-600 flex items-center gap-2 pointer-events-none uppercase font-black text-[9px] tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
            Workspace CondoSmart - {currentSide === 'front' ? 'Frente' : 'Verso'}
          </div>

          <div 
            ref={canvasRef}
            className={`relative shadow-[0_40px_100px_rgba(0,0,0,0.25)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden group ${activeData.bgClass} ${designType === 'card' ? 'w-[340px] md:w-[600px] aspect-[1.8/1] rounded-lg' : 'w-[280px] md:w-[450px] aspect-[1/1.5] rounded-xl'}`}
            style={activeData.bgStyle}
          >
            <div className="absolute inset-0 engineering-grid opacity-5 pointer-events-none"></div>

            {activeData.elements.map((el, idx) => (
              <div
                key={el.id}
                onClick={(e) => { e.stopPropagation(); setSelectedId(el.id); }}
                className={`absolute cursor-move select-none p-1 transition-all ${selectedId === el.id ? 'ring-2 ring-primary-500 rounded' : 'hover:bg-primary-500/5'}`}
                style={{ 
                  left: `${el.x}%`, 
                  top: `${el.y}%`, 
                  transform: `translate(-${el.align === 'center' ? '50' : el.align === 'right' ? '100' : '0'}%, -50%)`,
                  fontSize: el.type === 'text' ? `${el.fontSize}px` : undefined,
                  fontFamily: el.type === 'text' ? el.fontFamily : undefined,
                  color: el.type === 'text' ? el.color : undefined,
                  fontWeight: el.type === 'text' ? el.fontWeight : undefined,
                  textAlign: el.align,
                  width: el.type === 'logo' ? `${el.width}px` : undefined,
                  zIndex: idx + 10
                }}
              >
                {el.type === 'text' ? el.content : <img src={el.imageUrl} alt="Logo" className="w-full h-auto pointer-events-none" />}
              </div>
            ))}

            <div className="absolute top-4 left-4 w-4 h-4 border-l border-t border-slate-300/30 opacity-50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-r border-t border-slate-300/30 opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-l border-b border-slate-300/30 opacity-50"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-r border-b border-slate-300/30 opacity-50"></div>
          </div>

          <div className="mt-12 flex items-center gap-6 bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-800 shadow-xl">
             <button onClick={() => setSelectedId(null)} className="text-slate-400 hover:text-red-500 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">deselect</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Deselecionar</span>
             </button>
             <div className="w-px h-4 bg-slate-200 dark:bg-slate-800"></div>
             <span className="text-[10px] font-black uppercase dark:text-white tracking-widest">Lado: {currentSide === 'front' ? 'Frente' : 'Verso'}</span>
          </div>
        </main>
      </div>

      <style>{`
        .engineering-grid {
          background-size: 20px 20px;
          background-image: 
              linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
        }
        .dark .engineering-grid {
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
        }
        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
