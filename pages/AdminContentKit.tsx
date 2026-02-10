import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';

interface ExtractionResult {
  layout: { structure: string; components: string[]; ux_patterns: string; };
  code: { frameworks: string[]; meta_tags: { name: string; content: string }[]; scripts: string[]; };
  css: { variables: { property: string; value: string }[]; libraries: string[]; snippets: string; };
  security: { login_fields: string[]; auth_methods: string; vulnerabilities_notes: string; detected_endpoints: string[]; };
  brand: { logoUrl: string; primary_colors: string[]; };
}

interface GroundingChunk {
  web?: { uri: string; title: string; };
}

export const AdminContentKit: React.FC = () => {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ExtractionResult | null>(null);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [activeTab, setActiveTab] = useState<'layout' | 'code' | 'css' | 'security'>('layout');

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
  }, [navigate]);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    setIsAnalyzing(true);
    setResult(null);
    setSources([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Aja como um Engenheiro de Software Sênior e Especialista em Segurança. Realize um Deep Crawl e Engenharia Reversa no site: "${url}". Extraia Layout, Código, CSS e Security. Retorne em JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              layout: { type: Type.OBJECT, properties: { structure: { type: Type.STRING }, components: { type: Type.ARRAY, items: { type: Type.STRING } }, ux_patterns: { type: Type.STRING } } },
              code: { type: Type.OBJECT, properties: { frameworks: { type: Type.ARRAY, items: { type: Type.STRING } }, meta_tags: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, content: { type: Type.STRING } } } }, scripts: { type: Type.ARRAY, items: { type: Type.STRING } } } },
              css: { type: Type.OBJECT, properties: { variables: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { property: { type: Type.STRING }, value: { type: Type.STRING } } } }, libraries: { type: Type.ARRAY, items: { type: Type.STRING } }, snippets: { type: Type.STRING } } },
              security: { type: Type.OBJECT, properties: { login_fields: { type: Type.ARRAY, items: { type: Type.STRING } }, auth_methods: { type: Type.STRING }, vulnerabilities_notes: { type: Type.STRING }, detected_endpoints: { type: Type.ARRAY, items: { type: Type.STRING } } } },
              brand: { type: Type.OBJECT, properties: { logoUrl: { type: Type.STRING }, primary_colors: { type: Type.ARRAY, items: { type: Type.STRING } } } }
            }
          }
        }
      });

      const text = response.text;
      if (!text) throw new Error("Vazio");
      const data = JSON.parse(text);
      setResult(data);
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) setSources(groundingChunks);
    } catch (error) {
      console.error(error);
      alert("Falha na extração de dados técnicos.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary-500 transition-all shadow-lg group">
            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter">
              Content Kit <span className="text-primary-500 italic">Extractor</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deep Crawler & Reverse Engineering</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <form onSubmit={handleAnalyze} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[3rem] shadow-2xl flex flex-col md:flex-row gap-4 relative overflow-hidden group">
          <div className="engineering-grid absolute inset-0 opacity-5"></div>
          <div className="flex-1 relative z-10">
            <span className="material-icons-outlined absolute left-6 top-1/2 -translate-y-1/2 text-slate-400">language</span>
            <input type="url" required placeholder="https://exemplo-alvo.com" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-16 pr-6 py-5 outline-none dark:text-white focus:ring-2 focus:ring-primary-500 transition-all font-medium" />
          </div>
          <button disabled={isAnalyzing} className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
            {isAnalyzing ? "Extraindo..." : "Iniciar Extração"}
          </button>
        </form>

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['layout', 'code', 'css', 'security'].map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab as any)} className={`px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border transition-all ${activeTab === tab ? 'bg-primary-500 border-primary-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}>{tab}</button>
                ))}
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl min-h-[400px]">
                <pre className="text-xs text-slate-600 dark:text-slate-400 overflow-auto">{JSON.stringify(result[activeTab], null, 2)}</pre>
              </div>
            </div>
            <div className="lg:col-span-4 space-y-8">
              {sources.length > 0 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
                  <h3 className="text-xs font-black uppercase text-primary-500 mb-6">Fontes</h3>
                  <div className="space-y-3">
                    {sources.map((s, i) => s.web && <a key={i} href={s.web.uri} target="_blank" className="block p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] truncate">{s.web.title || s.web.uri}</a>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};