
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';

// Helper para decodificar base64 manualmente conforme diretrizes
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper para converter PCM bruto (24kHz, 16-bit, Mono) para um Blob WAV reproduzível
function pcmToWav(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
  const buffer = new ArrayBuffer(44 + pcmData.length);
  const view = new DataView(buffer);
  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + pcmData.length, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, 'data');
  view.setUint32(40, pcmData.length, true);
  new Uint8Array(buffer, 44).set(new Uint8Array(pcmData));
  return new Blob([buffer], { type: 'audio/wav' });
}

const GENRES = [
  "Cyberpunk", "Lo-fi", "Cinematográfica", "Rock Pop", "Rock Metal", 
  "Apocalíptico", "Épico", "Samba", "Pop", "Trap"
];

const MOODS = [
  "Nostálgico", "Agitado", "Melancólico", "Energético", "Sombrio", 
  "Relaxante", "Inspirador", "Tenso", "Heróico", "Misterioso",
  "Futurista", "Eufórico", "Calmo", "Agressivo"
];

export const AdminMusicAI: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [lyrics, setLyrics] = useState('');
  const [bpm, setBpm] = useState('120');
  const [themeInput, setThemeInput] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAssistantLoading, setIsAssistantLoading] = useState(false);
  const [technicalPrompt, setTechnicalPrompt] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const [showGenreMenu, setShowGenreMenu] = useState(false);
  const [showMoodMenu, setShowMoodMenu] = useState(false);

  // Refs para fechar menus ao clicar fora
  const genreRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
    
    const handleClickOutside = (event: MouseEvent) => {
      if (genreRef.current && !genreRef.current.contains(event.target as Node)) setShowGenreMenu(false);
      if (moodRef.current && !moodRef.current.contains(event.target as Node)) setShowMoodMenu(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [navigate, audioUrl]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]);
  };

  const toggleMood = (mood: string) => {
    setSelectedMoods(prev => prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]);
  };

  const handleAssistant = async () => {
    if (!themeInput) {
      alert("Descreva o tema ou a vibe do seu projeto para o assistente IA!");
      return;
    }
    setIsAssistantLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Aja como um produtor musical e engenheiro de som. Com base no tema: "${themeInput}", recomende:
      1. Gêneros compatíveis (escolha pelo menos 1 da lista: ${GENRES.join(', ')}).
      2. Moods/Vibes compatíveis (escolha pelo menos 1 da lista: ${MOODS.join(', ')}).
      3. Uma sugestão de letra ou descrição conceitual de 2 linhas.
      4. Um BPM ideal.
      Retorne estritamente em JSON: {"genres": [], "moods": [], "lyrics": "", "bpm": ""}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text || '{}');
      setSelectedGenres(data.genres || []);
      setSelectedMoods(data.moods || []);
      setLyrics(data.lyrics || '');
      setBpm(data.bpm || '120');
    } catch (err) {
      console.error(err);
      alert("O assistente falhou em gerar sugestões. Tente novamente.");
    } finally {
      setIsAssistantLoading(false);
    }
  };

  const generateMusicKit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedGenres.length === 0 || selectedMoods.length === 0) {
      alert("Por favor, selecione ao menos um gênero e um mood.");
      return;
    }
    setIsGenerating(true);
    setTechnicalPrompt('');
    if (audioUrl) { URL.revokeObjectURL(audioUrl); setAudioUrl(null); }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Geração do Prompt Técnico via Gemini Pro
      const promptText = `Atue como um Engenheiro de Áudio e Produtor de Elite. 
      Crie uma Especificação Técnica de Produção Musical (Prompt de 300 palavras) com estas bases:
      - Gêneros Selecionados: ${selectedGenres.join(' + ')}
      - Vibe: ${selectedMoods.join(', ')}
      - BPM: ${bpm}
      - Letras/Contexto: ${lyrics}
      
      Detalhe a instrumentação, camadas de sintetizadores, efeitos de mixagem (reverb, delay, compressão), ambiência e estrutura rítmica. O texto deve ser pronto para ser colado em geradores como Suno ou Udio para resultados profissionais.`;
      
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: promptText,
      });
      setTechnicalPrompt(textResponse.text || '');

      // Simulação de Áudio de Preview (TTS com estilo)
      const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Esta é uma amostra da produção musical estilo ${selectedGenres.join(' e ')}. Atmosfera ${selectedMoods.join(' e ')}. ${lyrics}` }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
        },
      });

      const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        const pcmBytes = decodeBase64(base64Audio);
        const wavBlob = pcmToWav(pcmBytes, 24000);
        setAudioUrl(URL.createObjectURL(wavBlob));
      }
    } catch (error: any) {
      console.error(error);
      alert("Falha na produção musical assistida.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid relative">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-purple-500 transition-all shadow-lg">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter">
              Creator <span className="text-purple-500 italic">MusicAI</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Advanced Neural Music Engine</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Painel de Configuração */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Assistente de Criação Guiada */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl text-white relative overflow-hidden group">
            <div className="absolute inset-0 engineering-grid opacity-20"></div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <span className="material-icons-outlined text-white animate-pulse">auto_awesome</span>
                <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Criação Guiada por IA</h3>
              </div>
              <p className="text-[10px] opacity-80 leading-relaxed font-medium">Descreva o tema do seu projeto e deixe a IA configurar os gêneros e moods ideais.</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ex: Uma viagem espacial nostálgica..." 
                  value={themeInput}
                  onChange={e => setThemeInput(e.target.value)}
                  className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs outline-none focus:bg-white/20 transition-all placeholder:text-white/40 font-medium"
                />
                <button 
                  onClick={handleAssistant}
                  disabled={isAssistantLoading}
                  className="w-10 h-10 bg-white text-purple-600 rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                >
                  {isAssistantLoading ? (
                    <span className="animate-spin material-icons-outlined text-sm">sync</span>
                  ) : (
                    <span className="material-icons-outlined text-sm">auto_fix_high</span>
                  )}
                </button>
              </div>
            </div>
          </div>

          <form onSubmit={generateMusicKit} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6 relative">
            
            {/* Gênero Musical - Multi Select */}
            <div className="space-y-3 relative" ref={genreRef}>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gênero Musical (Múltiplo)</label>
              <div 
                onClick={() => setShowGenreMenu(!showGenreMenu)}
                className={`w-full bg-slate-50 dark:bg-slate-950 border transition-all rounded-2xl px-5 py-4 cursor-pointer flex items-center justify-between group ${showGenreMenu ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {selectedGenres.length > 0 ? selectedGenres.map(g => (
                    <span key={g} className="bg-purple-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      {g}
                      <span className="material-icons-outlined text-[10px]" onClick={(e) => { e.stopPropagation(); toggleGenre(g); }}>close</span>
                    </span>
                  )) : <span className="text-xs text-slate-400">Selecione os gêneros...</span>}
                </div>
                <span className={`material-icons-outlined text-slate-400 transition-transform ${showGenreMenu ? 'rotate-180 text-purple-500' : ''}`}>expand_more</span>
              </div>
              
              {showGenreMenu && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-3 grid grid-cols-2 gap-2 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                  {GENRES.map(g => (
                    <button 
                      key={g} type="button" onClick={() => toggleGenre(g)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedGenres.includes(g) ? 'bg-purple-500 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                      <span className="material-icons-outlined text-xs">{selectedGenres.includes(g) ? 'check_box' : 'check_box_outline_blank'}</span>
                      {g}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mood / Vibe - Multi Select */}
            <div className="space-y-3 relative" ref={moodRef}>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mood / Vibe (Múltiplo)</label>
              <div 
                onClick={() => setShowMoodMenu(!showMoodMenu)}
                className={`w-full bg-slate-50 dark:bg-slate-950 border transition-all rounded-2xl px-5 py-4 cursor-pointer flex items-center justify-between group ${showMoodMenu ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <div className="flex flex-wrap gap-1.5">
                  {selectedMoods.length > 0 ? selectedMoods.map(m => (
                    <span key={m} className="bg-indigo-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase flex items-center gap-1">
                      {m}
                      <span className="material-icons-outlined text-[10px]" onClick={(e) => { e.stopPropagation(); toggleMood(m); }}>close</span>
                    </span>
                  )) : <span className="text-xs text-slate-400">Selecione a vibe...</span>}
                </div>
                <span className={`material-icons-outlined text-slate-400 transition-transform ${showMoodMenu ? 'rotate-180 text-indigo-500' : ''}`}>expand_more</span>
              </div>
              
              {showMoodMenu && (
                <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 p-3 grid grid-cols-2 gap-2 animate-fade-in max-h-60 overflow-y-auto custom-scrollbar">
                  {MOODS.map(m => (
                    <button 
                      key={m} type="button" onClick={() => toggleMood(m)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all ${selectedMoods.includes(m) ? 'bg-indigo-500 text-white shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500'}`}
                    >
                      <span className="material-icons-outlined text-xs">{selectedMoods.includes(m) ? 'check_box' : 'check_box_outline_blank'}</span>
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">BPM</label>
                <input type="number" value={bpm} onChange={e => setBpm(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Letra / Contexto</label>
                <input type="text" placeholder="Assunto..." value={lyrics} onChange={e => setLyrics(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white" />
              </div>
            </div>

            <button 
              disabled={isGenerating} 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-purple-500/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin material-icons-outlined text-sm">sync</span>
                  Gerando Produção...
                </>
              ) : (
                <>
                  Gerar Produção Musical
                  <span className="material-icons-outlined text-sm">settings_voice</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Display de Resultado */}
        <div className="lg:col-span-7 space-y-6">
          {technicalPrompt ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-2xl animate-fade-in space-y-8 h-full flex flex-col">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6">
                 <div>
                   <h2 className="text-xl font-black uppercase dark:text-white font-display">Relatório Técnico</h2>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">AI Guided Production Specification</p>
                 </div>
                 <button onClick={() => { navigator.clipboard.writeText(technicalPrompt); }} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-purple-500 transition-all">
                    <span className="material-icons-outlined text-sm">content_copy</span>
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4">
                 <pre className="text-slate-600 dark:text-slate-400 font-mono text-xs leading-relaxed whitespace-pre-wrap">
                    <code>{technicalPrompt}</code>
                 </pre>
              </div>

              {audioUrl && (
                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                   <div className="flex items-center gap-3 text-purple-500">
                      <span className="material-icons-outlined text-sm">graphic_eq</span>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">Amostra de Áudio (Preview)</h4>
                   </div>
                   <audio controls src={audioUrl} className="w-full h-10 accent-purple-500"></audio>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3.5rem] flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-4">
              <span className="material-icons-outlined text-7xl opacity-10">music_note</span>
              <p className="font-black uppercase tracking-widest text-sm">Aguardando Parâmetros de Áudio</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a855f7; border-radius: 10px; }
      `}</style>
    </div>
  );
};
