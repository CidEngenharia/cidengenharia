import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';

export const AdminPromptAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [resultPrompt, setResultPrompt] = useState('');

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setFilePreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!filePreview) return;
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = "Analise esta imagem detalhadamente e crie um prompt técnico avançado para modelos de IA generativa (Stable Diffusion, Midjourney, Flux). Detalhe luz, lente, composição e texturas.";
      const res = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: file?.type || 'image/jpeg', data: filePreview.split(',')[1] } }] }]
      });
      setResultPrompt(res.text || "Sem prompt");
    } catch (e) { alert("Erro na análise."); } finally { setIsAnalyzing(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16">
      <header className="max-w-6xl mx-auto mb-12 flex items-center gap-4">
        <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border rounded-2xl flex items-center justify-center shadow-lg"><span className="material-icons-outlined">arrow_back</span></Link>
        <h1 className="text-3xl font-black uppercase dark:text-white">Technical <span className="text-emerald-500">Analyzer</span></h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div onClick={() => fileInputRef.current?.click()} className="aspect-square bg-slate-50 dark:bg-slate-950 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer overflow-hidden group">
              {filePreview ? <img src={filePreview} className="w-full h-full object-cover" /> : <span className="material-icons-outlined text-4xl text-slate-300">add_photo_alternate</span>}
              <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} />
            </div>
            <button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl">{isAnalyzing ? "Analisando..." : "Gerar Prompt"}</button>
          </div>
        </div>
        <div className="lg:col-span-8">
          {resultPrompt ? (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border shadow-xl">
               <pre className="text-sm whitespace-pre-wrap dark:text-slate-300 font-mono leading-relaxed">{resultPrompt}</pre>
               <button onClick={() => navigator.clipboard.writeText(resultPrompt)} className="mt-6 px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all">Copiar Prompt</button>
            </div>
          ) : <div className="h-64 border-4 border-dashed rounded-[3rem] border-slate-200 dark:border-slate-800 flex items-center justify-center opacity-20 font-black uppercase">Referência Visual Necessária</div>}
        </div>
      </div>
    </div>
  );
};