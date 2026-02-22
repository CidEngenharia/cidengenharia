
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type QRType = 'link' | 'whatsapp' | 'instagram' | 'text' | 'wifi';

declare var QRCode: any;

export const QRCodeGenerator: React.FC = () => {
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null);
  const [activeType, setActiveType] = useState<QRType>('link');
  
  // States para os dados
  const [url, setUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [waMessage, setWaMessage] = useState('');
  const [instaUser, setInstaUser] = useState('');
  const [plainText, setPlainText] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiSec, setWifiSec] = useState('WPA');

  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    // Limpar QR Code anterior ao trocar de tipo
    if (qrRef.current) qrRef.current.innerHTML = '';
    setHasGenerated(false);
  }, [activeType]);

  const generateQR = () => {
    if (!qrRef.current) return;
    qrRef.current.innerHTML = '';

    let textToEncode = '';

    switch (activeType) {
      case 'link':
        textToEncode = url.startsWith('http') ? url : `https://${url}`;
        break;
      case 'whatsapp':
        const cleanPhone = phone.replace(/\D/g, '');
        textToEncode = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waMessage)}`;
        break;
      case 'instagram':
        textToEncode = `https://instagram.com/${instaUser.replace('@', '')}`;
        break;
      case 'text':
        textToEncode = plainText;
        break;
      case 'wifi':
        textToEncode = `WIFI:S:${wifiSsid};T:${wifiSec};P:${wifiPass};;`;
        break;
    }

    if (!textToEncode.trim()) {
      alert("Por favor, insira os dados necessários.");
      return;
    }

    try {
      new QRCode(qrRef.current, {
        text: textToEncode,
        width: 256,
        height: 256,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      setHasGenerated(true);
    } catch (e) {
      console.error("Erro ao gerar QR Code:", e);
    }
  };

  const downloadQR = () => {
    const img = qrRef.current?.querySelector('img');
    if (img) {
      const link = document.createElement('a');
      link.download = `qrcode-cidengenharia-${activeType}.png`;
      link.href = img.src;
      link.click();
    }
  };

  const tabs = [
    { id: 'link', icon: 'language', label: 'Link / URL' },
    { id: 'whatsapp', icon: 'chat', label: 'WhatsApp' },
    { id: 'instagram', icon: 'camera_alt', label: 'Instagram' },
    { id: 'wifi', icon: 'wifi', label: 'Wi-Fi' },
    { id: 'text', icon: 'notes', label: 'Texto Livre' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-body transition-colors duration-500 pb-20">
      <nav className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between bg-white dark:bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link to="/generators" className="text-slate-400 hover:text-primary-500 transition-colors">
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800"></div>
          <h1 className="text-lg font-black uppercase font-display dark:text-white flex items-center gap-2 tracking-tight">
            Gerador <span className="text-primary-500 italic">QR Code</span>
          </h1>
        </div>
        <div className="px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-[9px] font-black uppercase text-primary-500 tracking-widest hidden md:block">
          CidEngenharia Neural Core
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Painel de Controle */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveType(tab.id as QRType)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${activeType === tab.id ? 'bg-primary-500 border-primary-500 text-white shadow-lg' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-400 hover:border-primary-500/50'}`}
              >
                <span className="material-icons-outlined text-sm">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 md:p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
            <AnimatePresence mode="wait">
              {activeType === 'link' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="link" className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">URL de Destino</label>
                  <input 
                    type="text" 
                    placeholder="https://seu-site.com" 
                    value={url} 
                    onChange={e => setUrl(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white font-medium focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-[9px] text-slate-400 uppercase font-bold italic">* Use links completos para melhor precisão.</p>
                </motion.div>
              )}

              {activeType === 'whatsapp' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="wa" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Número (com DDD)</label>
                       <input 
                        type="tel" 
                        placeholder="71984184782" 
                        value={phone} 
                        onChange={e => setPhone(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Mensagem Inicial</label>
                       <input 
                        type="text" 
                        placeholder="Olá, Sidney!" 
                        value={waMessage} 
                        onChange={e => setWaMessage(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeType === 'instagram' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="insta" className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Usuário Instagram</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold">@</span>
                    <input 
                      type="text" 
                      placeholder="cidengenharia" 
                      value={instaUser} 
                      onChange={e => setInstaUser(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-6 py-5 outline-none dark:text-white font-bold"
                    />
                  </div>
                </motion.div>
              )}

              {activeType === 'wifi' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="wifi" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome da Rede (SSID)</label>
                       <input 
                        type="text" 
                        placeholder="Rede_CidEngenharia" 
                        value={wifiSsid} 
                        onChange={e => setWifiSsid(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Senha da Rede</label>
                       <input 
                        type="password" 
                        placeholder="********" 
                        value={wifiPass} 
                        onChange={e => setWifiPass(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Criptografia</label>
                    <select 
                      value={wifiSec} 
                      onChange={e => setWifiSec(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 outline-none dark:text-white text-xs font-black uppercase"
                    >
                      <option value="WPA">WPA/WPA2 (Padrão)</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">Sem Senha</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {activeType === 'text' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="text" className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Conteúdo de Texto</label>
                  <textarea 
                    rows={4} 
                    placeholder="Digite o texto ou anotação..." 
                    value={plainText} 
                    onChange={e => setPlainText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 outline-none dark:text-white text-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              onClick={generateQR}
              className="w-full py-6 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl uppercase tracking-widest text-[11px] shadow-2xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              Gerar QR Code Profissional
              <span className="material-icons-outlined text-sm">auto_fix_high</span>
            </button>
          </div>
        </div>

        {/* Display do Resultado */}
        <div className="lg:col-span-5 flex flex-col items-center">
           <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-[4rem] shadow-2xl flex flex-col items-center text-center space-y-8 w-full max-w-sm">
              <div className="space-y-2">
                 <h3 className="text-xl font-black uppercase dark:text-white font-display">Pré-visualização</h3>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Escaneie para testar</p>
              </div>

              <div className="p-6 bg-white rounded-[2.5rem] shadow-inner border border-slate-100 flex items-center justify-center relative group min-h-[304px] w-full">
                 <div ref={qrRef} className="z-10 animate-fade-in"></div>
                 {!hasGenerated && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-200">
                      <span className="material-icons-outlined text-7xl mb-2 opacity-20">qr_code_scanner</span>
                      <p className="text-[9px] font-black uppercase opacity-40">Aguardando dados...</p>
                   </div>
                 )}
                 {hasGenerated && <div className="absolute inset-0 border-2 border-primary-500/10 rounded-[2.5rem] pointer-events-none group-hover:border-primary-500/30 transition-all"></div>}
              </div>

              {hasGenerated && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-3">
                  <button 
                    onClick={downloadQR}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    Baixar PNG de Alta Resolução
                    <span className="material-icons-outlined text-sm">download</span>
                  </button>
                  <p className="text-[8px] text-slate-400 font-bold uppercase">Formatado para impressão em 300DPI</p>
                </motion.div>
              )}
           </div>
           
           <div className="mt-8 p-6 bg-primary-500/5 border border-primary-500/10 rounded-3xl max-w-sm text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Os QR Codes gerados são estáticos e vitalícios. Para QR Codes dinâmicos com métricas de acesso, conheça os planos <strong>DyCard Corporate</strong>.
              </p>
           </div>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; scale: 0.95; } to { opacity: 1; scale: 1; } }
        canvas { max-width: 100% !important; height: auto !important; }
        img { max-width: 100% !important; height: auto !important; }
      `}</style>
    </div>
  );
};
