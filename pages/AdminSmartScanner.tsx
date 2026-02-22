import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ScanResult {
  title: string;
  url: string;
  ext: string;
  source: string;
  snippet: string;
}

// Fix: Make uri and title optional to match @google/genai SDK internal types
interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export const AdminSmartScanner: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fileName, setFileName] = useState('');
  const [extension, setExtension] = useState('.pdf');
  const [imageRef, setImageRef] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState<ScanResult[]>([]);
  const [sources, setSources] = useState<GroundingChunk[]>([]);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
  }, [navigate]);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImageRef(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageRef(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName && !imageRef) return;
    
    setIsScanning(true);
    setResults([]);
    setSources([]);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Aja como um motor de busca especializado. Localize arquivos reais do tipo "${extension}" na web que correspondam a: "${fileName}". ${imageRef ? 'Considere também o contexto visual da imagem de referência enviada para refinar a busca.' : ''} Gere exatamente 10 links diretos e seguros para download. Retorne EXCLUSIVAMENTE um JSON no formato: { "files": [ { "title": "string", "url": "string", "ext": "string", "source": "string", "snippet": "string" } ] }`;

      const parts: any[] = [{ text: prompt }];
      if (imageRef) {
        parts.push({ 
          inlineData: { 
            mimeType: 'image/jpeg', 
            data: imageRef.split(',')[1] 
          } 
        });
      }

      const res = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: [{ parts }],
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              files: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    url: { type: Type.STRING },
                    ext: { type: Type.STRING },
                    source: { type: Type.STRING },
                    snippet: { type: Type.STRING }
                  },
                  required: ["title", "url", "ext", "source", "snippet"]
                }
              }
            },
            required: ["files"]
          }
        }
      });

      const text = res.text;
      if (!text) throw new Error("IA retornou resposta vazia");
      
      const data = JSON.parse(text);
      setResults(data.files || []);
      
      const groundingChunks = res.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (groundingChunks) {
        // Fix: Casting groundingChunks to any[] to avoid strict type collision with local interface
        setSources(groundingChunks as any[]);
      }

    } catch (err) {
      console.error(err);
      alert("Erro na varredura técnica. Verifique sua conexão ou tente termos de busca mais específicos.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid relative overflow-hidden transition-colors">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] -z-10 animate-pulse"></div>

      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-yellow-500 transition-all shadow-lg group">
            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter">
              Scanner <span className="text-yellow-500 italic">Inteligente</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Web Asset Discovery Engine</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative overflow-hidden group/form"
          >
            <div className="engineering-grid absolute inset-0 opacity-5"></div>
            
            <div className="relative z-10 space-y-4 text-center">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block text-left ml-1">Referência Visual</label>
              
              <div 
                onClick={() => !imageRef && fileInputRef.current?.click()}
                className={`relative mx-auto w-32 h-32 rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center group ${imageRef ? 'border-yellow-500 cursor-default' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 cursor-pointer hover:border-yellow-500/50'}`}
              >
                {imageRef && isScanning && <div className="scan-animation"></div>}
                {imageRef ? (
                  <div className="relative w-full h-full group/thumb">
                    <img src={imageRef} className="w-full h-full object-cover transition-transform duration-500 group-hover/thumb:scale-110" alt="Referência" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button type="button" onClick={() => setIsZoomed(true)} className="w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all">
                         <span className="material-icons-outlined text-sm">zoom_in</span>
                       </button>
                       <button type="button" onClick={removeImage} className="w-8 h-8 bg-red-500/80 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all">
                         <span className="material-icons-outlined text-sm">delete</span>
                       </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="material-icons-outlined text-2xl text-slate-300 group-hover:text-yellow-500 transition-colors">add_photo_alternate</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400 mt-1">Anexar</span>
                  </>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImage} />
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição</label>
                  <input 
                    type="text" 
                    required={!imageRef}
                    placeholder="Nome do arquivo..." 
                    value={fileName} 
                    onChange={e => setFileName(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white focus:ring-2 focus:ring-yellow-500 transition-all font-medium" 
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Extensão</label>
                  <select 
                    value={extension} 
                    onChange={e => setExtension(e.target.value)} 
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white focus:ring-2 focus:ring-yellow-500 transition-all font-bold"
                  >
                    <option value=".pdf">PDF</option>
                    <option value=".docx">DOCX</option>
                    <option value=".xlsx">XLSX</option>
                    <option value=".pptx">PPTX</option>
                    <option value=".mp3">MP3</option>
                    <option value=".zip">ZIP/RAR</option>
                  </select>
                </div>
              </div>

              <button 
                disabled={isScanning} 
                onClick={handleScan}
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-yellow-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isScanning ? (
                  <>
                    <span className="animate-spin material-icons-outlined text-sm">sync</span>
                    Varredura Ativa...
                  </>
                ) : (
                  <>
                    Iniciar Escaneamento
                    <span className="material-icons-outlined text-sm">radar</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {sources.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-yellow-500 mb-6 flex items-center gap-2">
                <span className="material-icons-outlined text-sm">verified</span>
                Fontes Detectadas
              </h3>
              <div className="space-y-3">
                {sources.map((source, idx) => source.web && (
                  <a key={idx} href={source.web.uri} target="_blank" rel="noopener noreferrer" className="block p-3 bg-yellow-500/5 hover:bg-yellow-500/10 rounded-xl border border-yellow-500/10 text-[10px] font-bold text-yellow-600 dark:text-yellow-400 transition-all truncate">
                    <span className="material-icons-outlined text-[10px] mr-2">link</span>
                    {source.web.title || source.web.uri}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        <div className="lg:col-span-8">
          <AnimatePresence mode="popLayout">
            {results.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-4 mb-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">explore</span>
                    {results.length} Arquivos Encontrados
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {results.map((file, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 shadow-xl group hover:border-yellow-500 transition-all overflow-hidden relative"
                    >
                      <div className="engineering-grid absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity"></div>
                      <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-yellow-500 rounded-2xl flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                        <span className="material-icons-outlined text-3xl">
                          {file.ext.includes('pdf') ? 'picture_as_pdf' : 
                           file.ext.includes('mp3') ? 'audio_file' : 'description'}
                        </span>
                      </div>
                      <div className="flex-1 overflow-hidden space-y-1 text-center md:text-left">
                         <h4 className="font-bold dark:text-white truncate">{file.title}</h4>
                         <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{file.source}</p>
                         <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 italic leading-relaxed">"{file.snippet}"</p>
                      </div>
                      <a href={file.url} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-slate-900 transition-all shrink-0">Baixar</a>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : !isScanning && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full min-h-[400px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4"
              >
                <span className="material-icons-outlined text-7xl opacity-10">radar</span>
                <p className="font-black uppercase tracking-widest text-sm">Aguardando Parâmetros</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isZoomed && imageRef && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl" onClick={() => setIsZoomed(false)}></div>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-2xl w-full aspect-square bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl p-4"
            >
              <img src={imageRef} className="w-full h-full object-contain rounded-2xl" alt="Zoom" />
              <button 
                onClick={() => setIsZoomed(false)}
                className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};