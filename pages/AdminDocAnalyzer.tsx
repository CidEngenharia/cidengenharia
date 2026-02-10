import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
  };
  writeString(0, 'RIFF'); view.setUint32(4, 36 + pcmData.length, true); writeString(8, 'WAVE'); writeString(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true); writeString(36, 'data');
  view.setUint32(40, pcmData.length, true); new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));
  return new Blob([buffer], { type: 'audio/wav' });
}

export const AdminDocAnalyzer: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
  }, [navigate]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setFileBase64((reader.result as string).split(',')[1]);
      reader.readAsDataURL(selected);
    }
  };

  const analyzeContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !url) return;
    setIsAnalyzing(true);
    setSummary('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const parts: any[] = [{ text: `Aja como um Especialista em Resumos Técnicos. Analise e gere um resumo estruturado.` }];
      if (fileBase64) parts.push({ inlineData: { mimeType: file?.type || 'application/pdf', data: fileBase64 } });
      if (url) parts[0].text += ` Fonte: ${url}`;

      const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: [{ parts }] });
      setSummary(response.text || "Sem conteúdo");
    } catch (error) {
      alert("Erro na análise.");
    } finally { setIsAnalyzing(false); }
  };

  const convertToAudio = async () => {
    if (!summary) return;
    setIsSynthesizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: summary.slice(0, 1000) }] }],
        config: { responseModalities: [Modality.AUDIO], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } } }
      });
      const base64 = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64) {
        setAudioUrl(URL.createObjectURL(pcmToWav(decodeBase64(base64))));
      }
    } catch (error) { alert("Falha no áudio."); } finally { setIsSynthesizing(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid">
      <header className="max-w-6xl mx-auto mb-12 flex items-center gap-4">
        <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center shadow-lg"><span className="material-icons-outlined">arrow_back</span></Link>
        <h1 className="text-3xl font-black uppercase dark:text-white">Análise de <span className="text-cyan-500">Documentos</span></h1>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl space-y-8">
            <div onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center border-slate-200 dark:border-slate-800 cursor-pointer">
              <span className="material-icons-outlined text-3xl">{file ? "task_alt" : "upload_file"}</span>
              <p className="text-[10px] font-black uppercase mt-2">{file ? file.name : "Selecionar Documento"}</p>
              <input type="file" ref={fileInputRef} hidden onChange={handleFileSelect} />
            </div>
            <input type="url" placeholder="Ou Link..." value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none" />
            <button onClick={analyzeContent} disabled={isAnalyzing} className="w-full bg-cyan-600 text-white py-5 rounded-2xl font-black uppercase text-xs shadow-xl">{isAnalyzing ? "Analisando..." : "Gerar Resumo"}</button>
          </div>
        </div>
        <div className="lg:col-span-8">
          {summary ? (
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-xl p-10">
              <button onClick={convertToAudio} disabled={isSynthesizing} className="mb-6 flex items-center gap-2 text-[10px] font-black uppercase text-cyan-500">{isSynthesizing ? "Convertendo..." : "Ouvir Resumo"}</button>
              <div className="text-sm dark:text-slate-300 whitespace-pre-wrap">{summary}</div>
              {audioUrl && <audio controls src={audioUrl} className="w-full mt-8 accent-cyan-500" />}
            </div>
          ) : <div className="h-64 border-4 border-dashed rounded-[3rem] border-slate-200 dark:border-slate-800 flex items-center justify-center opacity-20"><span className="text-xl font-black uppercase">Aguardando...</span></div>}
        </div>
      </div>
    </div>
  );
};