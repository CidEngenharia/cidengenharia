
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality } from "@google/genai";
import { useNavigate, Link } from 'react-router-dom';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function pcmToWavContainer(pcmData: Uint8Array, sampleRate: number = 24000): Blob {
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

interface IntonationOption {
  id: string;
  label: string;
  icon: string;
  instruction: string;
}

const intonations: IntonationOption[] = [
  { id: 'alegre', label: 'Alegre', icon: 'sentiment_very_satisfied', instruction: 'com empolgação e alegria' },
  { id: 'triste', label: 'Triste', icon: 'sentiment_very_dissatisfied', instruction: 'com tom melancólico e triste' },
  { id: 'sussurro', label: 'Sussurrando', icon: 'record_voice_over', instruction: 'sussurrando bem baixo' },
  { id: 'jovem', label: 'Jovem', icon: 'face', instruction: 'com tom jovem e enérgico' },
  { id: 'velho', label: 'Velho', icon: 'elderly', instruction: 'com voz cansada de uma pessoa idosa' },
  { id: 'grave', label: 'Voz Grave', icon: 'graphic_eq', instruction: 'com tom de voz muito profundo e grave' },
  { id: 'delicada', label: 'Voz Delicada', icon: 'auto_awesome', instruction: 'com voz suave, fina e delicada' },
  { id: 'robotizado', label: 'Robotizado', icon: 'smart_toy', instruction: 'como um robô, sem emoção e processado' },
];

export const AdminAudioAI: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [prompt, setPrompt] = useState('');
  const [selectedIntonation, setSelectedIntonation] = useState<IntonationOption>(intonations[0]);
  const [gender, setGender] = useState<'Masculino' | 'Feminino'>('Masculino');
  
  const [voiceRefBase64, setVoiceRefBase64] = useState<string | null>(null);
  const [voiceRefFile, setVoiceRefFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem('admin_session')) navigate('/admin');
    return () => { if (audioUrl) URL.revokeObjectURL(audioUrl); };
  }, [navigate, audioUrl]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVoiceRefFile(file);
        setVoiceRefBase64((reader.result as string).split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const generate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;
    setIsGenerating(true);
    setAudioUrl(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Mapeamento Inteligente de Vozes
      let voiceName = 'Zephyr'; // Padrão Masculino
      if (gender === 'Feminino') {
        voiceName = selectedIntonation.id === 'delicada' ? 'Kore' : 'Puck';
      } else {
        if (selectedIntonation.id === 'velho') voiceName = 'Charon';
        if (selectedIntonation.id === 'grave') voiceName = 'Fenrir';
      }

      // Prompt para a IA com a instrução de estilo
      const styledPrompt = `Diga ${selectedIntonation.instruction}: ${prompt}`;

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: styledPrompt }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { 
            voiceConfig: { 
              prebuiltVoiceConfig: { voiceName: voiceName } 
            } 
          },
        },
      });

      const data = res.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (data) {
        const pcmBytes = decodeBase64(data);
        const wavBlob = pcmToWavContainer(pcmBytes, 24000);
        setAudioUrl(URL.createObjectURL(wavBlob));
      }
    } catch (err) {
      console.error(err);
      alert("Erro na geração de áudio. Verifique a conexão.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid transition-colors duration-500">
      <header className="max-w-6xl mx-auto mb-12 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-orange-500 transition-all shadow-lg">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter">
              Laboratório de <span className="text-orange-500 italic">Voz IA</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Speech Synthesis</p>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        {/* Configurações de Voz */}
        <div className="lg:col-span-5 space-y-8">
          <form onSubmit={generate} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-8 relative overflow-hidden">
            <div className="engineering-grid absolute inset-0 opacity-5"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Seleção de Gênero */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Gênero da Voz</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['Masculino', 'Feminino'] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${gender === g ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-orange-500/50'}`}
                    >
                      <span className="material-icons-outlined text-base mb-1 block">{g === 'Masculino' ? 'male' : 'female'}</span>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seleção de Entonação */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Entonação & Estilo</label>
                <div className="grid grid-cols-4 gap-2">
                  {intonations.map(opt => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedIntonation(opt)}
                      title={opt.label}
                      className={`aspect-square rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${selectedIntonation.id === opt.id ? 'bg-orange-500 border-orange-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-orange-500/50'}`}
                    >
                      <span className="material-icons-outlined text-xl">{opt.icon}</span>
                      <span className="text-[8px] font-bold uppercase truncate w-full px-1 text-center">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Texto */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Script para Narração</label>
                <textarea 
                  required 
                  rows={4} 
                  placeholder="O que a IA deve falar?" 
                  value={prompt} 
                  onChange={e => setPrompt(e.target.value)} 
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white focus:ring-2 focus:ring-orange-500 transition-all text-sm leading-relaxed" 
                />
              </div>

              <button 
                disabled={isGenerating || !prompt} 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-orange-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin material-icons-outlined">sync</span>
                    Sintetizando Voz...
                  </>
                ) : (
                  <>
                    Gerar Áudio Profissional
                    <span className="material-icons-outlined">volume_up</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview e Player */}
        <div className="lg:col-span-7">
          {audioUrl ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-10 animate-fade-in relative overflow-hidden">
              <div className="engineering-grid absolute inset-0 opacity-5"></div>
              
              <div className="relative z-10 space-y-6">
                <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-orange-500/5">
                  <span className="material-icons-outlined text-5xl animate-pulse">graphic_eq</span>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-black uppercase dark:text-white tracking-tight">Voz Processada</h2>
                  <div className="flex items-center justify-center gap-2 text-slate-400">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{gender}</span>
                    <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{selectedIntonation.label}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <audio controls src={audioUrl} className="w-full h-10 accent-orange-500"></audio>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a 
                    href={audioUrl} 
                    download={`voz-ia-${selectedIntonation.id}.wav`} 
                    className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl"
                  >
                    Baixar Narração (WAV)
                    <span className="material-icons-outlined">download</span>
                  </a>
                  <button 
                    onClick={() => setAudioUrl(null)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Nova Versão
                    <span className="material-icons-outlined">refresh</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 dark:text-slate-700 space-y-6">
              <span className="material-icons-outlined text-8xl opacity-10">mic</span>
              <div className="text-center">
                <p className="font-black uppercase tracking-widest text-sm">Pronto para Gravar</p>
                <p className="text-[10px] mt-2 opacity-50 max-w-xs leading-relaxed">
                  Selecione o perfil da voz, a entonação desejada e insira seu texto para começar a produção.
                </p>
              </div>
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
      `}</style>
    </div>
  );
};
