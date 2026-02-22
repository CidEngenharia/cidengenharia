import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useNavigate } from 'react-router-dom';

interface BrandKitData {
  colors: { hex: string; name: string }[];
  fonts: string[];
  css: string;
  logoUrl: string;
}

// Fix: Make uri and title optional to match @google/genai SDK internal types
interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export const AdminBrandKit: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<BrandKitData | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);

  // Proteção de rota simplificada
  useEffect(() => {
    const session = localStorage.getItem('admin_session');
    if (!session) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    setIsAnalyzing(true);
    setResult(null);
    setSources([]);

    try {
      // Criação da instância dentro da função para garantir o estado mais recente da chave
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Você é um engenheiro de software sênior especializado em Web Scraping, Brand Kits e Design Systems.
      Sua tarefa é analisar o site: "${url}".
      
      Ação Requerida:
      1. Use a ferramenta de busca para encontrar informações visuais autênticas sobre este site/marca.
      2. Identifique a paleta de cores principal (hex), as fontes tipográficas utilizadas (font-family) e localize o link direto para o logo oficial.
      3. Gere um trecho de CSS representativo que defina as variáveis de cor e fontes detectadas.
      
      Retorne um JSON estritamente no seguinte formato:
      {
        "colors": [{"hex": "#FFFFFF", "name": "Nome da Cor"}],
        "fonts": ["Font Name 1", "Font Name 2"],
        "css": "/* CSS code here */",
        "logoUrl": "URL_DO_LOGO"
      }`;

      // Usando gemini-3-pro-preview para tarefas complexas de raciocínio e extração
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              colors: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    hex: { type: Type.STRING },
                    name: { type: Type.STRING }
                  },
                  required: ["hex", "name"]
                }
              },
              fonts: { type: Type.ARRAY, items: { type: Type.STRING } },
              css: { type: Type.STRING },
              logoUrl: { type: Type.STRING }
            },
            required: ["colors", "fonts", "css", "logoUrl"]
          }
        }
      });

      // Extração segura dos dados e metadados de grounding
      const text = response.text;
      if (!text) throw new Error("A IA retornou uma resposta vazia.");
      
      const data = JSON.parse(text);
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;

      setResult(data);
      if (groundingChunks) {
        // Fix: Casting groundingChunks to any or ensuring compatibility with local interface
        setSources(groundingChunks as any[]);
      }
    } catch (error: any) {
      console.error("Erro na análise Brand Kit:", error);
      alert(`Erro na extração: ${error.message || 'Houve um erro inesperado. Verifique a URL e tente novamente.'}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_session');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-body transition-colors duration-500 pb-20">
      <header className="max-w-7xl mx-auto px-8 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[10px] font-black uppercase tracking-widest text-primary-500">
            Cidengenharia Intelligence Admin
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter leading-none">
            Brand <span className="text-primary-500 italic">Kit</span> Extractor
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Analise e extraia ativos visuais de qualquer site utilizando IA, crawling simulado e Google Search Grounding.
          </p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-slate-50 transition-all">
            Home
          </button>
          <button onClick={handleLogout} className="px-6 py-3 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all">
            Logout
          </button>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-8 space-y-12">
        {/* Input Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
          <div className="engineering-grid absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"></div>
          <form onSubmit={handleAnalyze} className="relative z-10 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative w-full">
              <span className="material-icons-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">language</span>
              <input 
                type="url" 
                required 
                placeholder="https://exemplo.com.br"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full pl-16 pr-8 py-6 bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 rounded-3xl outline-none focus:ring-2 focus:ring-primary-500 text-lg dark:text-white transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isAnalyzing}
              className="w-full md:w-auto px-12 py-6 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-3xl shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-xs disabled:opacity-50"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin material-icons-outlined">sync</span>
                  Crawling Site...
                </>
              ) : (
                <>
                  Analisar Marca
                  <span className="material-icons-outlined">search</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Area */}
        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Logo, Fonts and Sources */}
            <div className="lg:col-span-4 space-y-8">
              {/* Logo Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm">image</span>
                  Logo Identificado
                </h3>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl p-10 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-800 gap-6">
                  <div className="h-24 w-full flex items-center justify-center">
                    <img 
                      src={result.logoUrl} 
                      alt="Logo extraído" 
                      className="max-h-full max-w-full object-contain" 
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/400x400?text=${new URL(url).hostname}`;
                      }} 
                    />
                  </div>
                  <a href={result.logoUrl} target="_blank" rel="noopener noreferrer" className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                    Abrir Link do Logo
                    <span className="material-icons-outlined text-sm">open_in_new</span>
                  </a>
                </div>
              </div>

              {/* Fonts Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm">text_fields</span>
                  Tipografia Detectada
                </h3>
                <div className="space-y-4">
                  {result.fonts.length > 0 ? result.fonts.map((font, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 group hover:border-primary-500 transition-colors">
                      <p className="text-sm font-bold dark:text-white" style={{ fontFamily: font }}>{font}</p>
                      <p className="text-[9px] text-slate-400 mt-1 uppercase tracking-widest font-black">Detected Font Family</p>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 italic">Nenhuma fonte específica detectada.</p>
                  )}
                </div>
              </div>

              {/* Sources Card (Grounding) */}
              {sources.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">verified</span>
                    Fontes da IA (Grounding)
                  </h3>
                  <div className="space-y-3">
                    {sources.map((source, idx) => source.web && (
                      <a key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-primary-500/5 hover:bg-primary-500/10 rounded-xl border border-primary-500/10 text-[10px] font-bold text-primary-600 dark:text-primary-400 transition-all truncate">
                        <span className="material-icons-outlined text-[10px] mr-2">link</span>
                        {source.web.title || source.web.uri}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Colors and CSS */}
            <div className="lg:col-span-8 space-y-8">
              {/* Colors Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 mb-6 flex items-center gap-2">
                  <span className="material-icons-outlined text-sm">palette</span>
                  Paleta de Cores
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {result.colors.map((color, idx) => (
                    <div key={idx} className="group relative">
                      <div className="h-24 rounded-2xl shadow-inner mb-3 border border-slate-100 dark:border-slate-800 transition-transform group-hover:scale-[1.02]" style={{ backgroundColor: color.hex }}></div>
                      <p className="text-[10px] font-black uppercase dark:text-white truncate">{color.name}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{color.hex}</p>
                      <button 
                        onClick={() => { navigator.clipboard.writeText(color.hex); }}
                        className="absolute top-2 right-2 p-1.5 bg-black/40 backdrop-blur-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
                        title="Copiar HEX"
                      >
                        <span className="material-icons-outlined text-white text-xs">content_copy</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* CSS Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xs font-black uppercase tracking-widest text-primary-500 flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">code</span>
                    Estrutura CSS Proposta
                  </h3>
                  <button onClick={() => { navigator.clipboard.writeText(result.css); }} className="text-[10px] font-black uppercase text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-2">
                    Copiar CSS
                    <span className="material-icons-outlined text-sm">content_copy</span>
                  </button>
                </div>
                <div className="bg-slate-950 rounded-2xl p-6 overflow-x-auto custom-scrollbar border border-slate-800">
                  <pre className="text-emerald-400 font-mono text-xs leading-relaxed">
                    <code>{result.css}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
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