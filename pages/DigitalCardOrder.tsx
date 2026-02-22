import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

type OrderStep = 'personal' | 'social' | 'delivery' | 'preview';

interface SocialNetwork {
  id: string;
  name: string;
  baseUrl: string;
  icon: string;
  color: string;
}

const socialNetworks: SocialNetwork[] = [
  { id: 'instagram', name: 'Instagram', baseUrl: 'https://instagram.com/', icon: 'camera_alt', color: '#E4405F' },
  { id: 'facebook', name: 'Facebook', baseUrl: 'https://facebook.com/', icon: 'facebook', color: '#1877F2' },
  { id: 'youtube', name: 'YouTube', baseUrl: 'https://youtube.com/', icon: 'play_circle', color: '#FF0000' },
  { id: 'linkedin', name: 'LinkedIn', baseUrl: 'https://linkedin.com/', icon: 'work', color: '#0A66C2' },
  { id: 'tiktok', name: 'TikTok', baseUrl: 'https://tiktok.com/', icon: 'music_note', color: '#C084FC' },
  { id: 'x', name: 'X (Twitter)', baseUrl: 'https://x.com/', icon: 'close', color: '#C084FC' },
];

const sophisticatedPalette = [
  '#fecaca', '#fde68a', '#d1fae5', '#bfdbfe', '#ddd6fe', '#fbcfe8',
  '#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6',
  '#dc2626', '#d97706', '#059669', '#2563eb', '#7c3aed', '#db2777',
  '#991b1b', '#92400e', '#055f46', '#1e40af', '#5b21b6', '#9d174d',
  '#450a0a', '#451a03', '#064e3b', '#1e3a8a', '#2e1065', '#500724',
  '#0f172a', '#1e293b', '#334155', '#475569', '#64748b', '#94a3b8'
];

export const DigitalCardOrder: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const petPhotoInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<OrderStep>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productType, setProductType] = useState('digital');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  // Sincronizado com os preços da página principal e checkout
  const prices: Record<string, number> = {
    'digital': 19.99,
    'gps-keychain': 29.99,
    'keychain': 39.99,
    'card': 49.99
  };

  const [formData, setFormData] = useState({
    name: '',
    petName: '',
    profession: '',
    bio: '',
    whatsapp: '',
    petPhoto: null as string | null,
    petPhotoName: '',
    backgroundImage: null as string | null,
    backgroundImageName: '',
    cardColor: '#1e40af',
    links: [] as { type: string; url: string }[],
    deliveryType: 'shipping' as 'shipping' | 'pickup',
    address: '',
    city: '',
    zip: ''
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type') || 'digital';
    setProductType(type);
  }, [location]);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'personal') setStep('social');
    else if (step === 'social') {
      if (productType === 'digital') setStep('preview');
      else setStep('delivery');
    }
    else if (step === 'delivery') setStep('preview');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'backgroundImage' | 'petPhoto') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          [field]: reader.result as string,
          [`${field}Name`]: file.name
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateShipping = () => {
    if (formData.zip.length < 8) return;
    setIsCalculatingShipping(true);
    setTimeout(() => {
      const mockFee = Math.floor(Math.random() * (35 - 15 + 1)) + 15 + 0.90;
      setShippingFee(mockFee);
      setIsCalculatingShipping(false);
    }, 1500);
  };

  const handleAddSocialLink = (networkId: string) => {
    const network = socialNetworks.find(n => n.id === networkId);
    if (network && formData.links.length < 10) {
      setFormData({
        ...formData,
        links: [...formData.links, { type: networkId, url: network.baseUrl }]
      });
    }
  };

  const handleRemoveLink = (index: number) => {
    const newLinks = [...formData.links];
    newLinks.splice(index, 1);
    setFormData({ ...formData, links: newLinks });
  };

  const handleLinkChange = (index: number, value: string) => {
    const newLinks = [...formData.links];
    newLinks[index].url = value;
    setFormData({ ...formData, links: newLinks });
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/payment?type=${productType}`);
    }, 2000);
  };

  const renderProgress = () => {
    const steps = ['Estilo', 'Social', productType !== 'digital' ? 'Entrega' : null, 'Final'].filter(Boolean);
    const currentIndex = ['personal', 'social', 'delivery', 'preview'].indexOf(step);

    return (
      <div className="flex items-center justify-center gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
        {steps.map((s, i) => (
          <React.Fragment key={i}>
            <div className={`flex items-center gap-2 whitespace-nowrap ${i <= currentIndex ? 'text-secondary' : 'text-slate-400'}`}>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${i <= currentIndex ? 'border-secondary bg-secondary text-white' : 'border-slate-300'}`}>
                {i + 1}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">{s}</span>
            </div>
            {i < steps.length - 1 && <div className={`w-8 h-px ${i < currentIndex ? 'bg-secondary' : 'bg-slate-200 dark:bg-slate-800'}`}></div>}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Cálculo do total garantindo que productType mapeie corretamente para o preço
  const currentProductPrice = prices[productType] || 0;
  const totalOrderValue = currentProductPrice + (formData.deliveryType === 'shipping' ? shippingFee : 0);

  const whatsappQrUrl = formData.whatsapp
    ? `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent('https://wa.me/' + formData.whatsapp.replace(/\D/g, ''))}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent('https://wa.me/5571984184782')}`;

  const CardPrototype = ({ side }: { side: 'front' | 'back' }) => (
    <div className="relative group shrink-0 transition-transform duration-500 hover:rotate-1">
      <div
        className="relative w-72 h-44 md:w-80 md:h-48 rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden transition-all duration-700"
        style={{
          backgroundColor: formData.backgroundImage ? '#000' : formData.cardColor,
          backgroundImage: formData.backgroundImage ? `url(${formData.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {formData.backgroundImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>}

        {side === 'front' ? (
          <div className="relative z-10 p-6 flex flex-col h-full justify-between">
            <div className="flex justify-between items-start">
              {productType !== 'digital' && <span className="material-icons-outlined text-white/80 text-3xl">contactless</span>}
              <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center ml-auto">
                {formData.petPhoto ? (
                  <img src={formData.petPhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-icons-outlined text-white/40">person</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-lg">
                {formData.name || 'SEU NOME AQUI'}
              </h4>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] drop-shadow-lg">
                {formData.profession || 'CARGO / PROFISSÃO'}
              </p>

              {/* Redes Sociais na Frente */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {formData.links.map((link, idx) => {
                  const net = socialNetworks.find(n => n.id === link.type);
                  return net ? (
                    <div key={idx} className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/10">
                      <span className="material-icons-outlined text-[10px] text-white">{net.icon}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="relative z-10 p-4 flex flex-col h-full items-center justify-center text-center">
            <div className="mb-1 space-y-0">
              <h5 className="text-white text-sm font-black tracking-[0.2em] uppercase leading-tight drop-shadow-lg">DYCARD</h5>
              <p className="text-secondary text-[8px] font-black tracking-[0.1em] uppercase leading-none">@cidengenharia</p>
            </div>

            <div className="bg-white p-1.5 rounded-lg shadow-2xl my-2 flex items-center justify-center">
              <img src={whatsappQrUrl} alt="QR Code" className="w-16 h-16 md:w-20 md:h-20 object-contain" />
            </div>

            <p className="text-[8px] font-black text-white/80 uppercase tracking-[0.1em] drop-shadow-lg leading-tight">Seu Networking inteligente</p>
          </div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
        {side === 'front' ? 'Frente' : 'Verso'}
      </div>
    </div>
  );

  const KeychainPrototype = ({ side }: { side: 'front' | 'back' }) => (
    <div className="relative group shrink-0 transition-transform duration-500 hover:rotate-2">
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-[3px] border-slate-300 dark:border-slate-600 shadow-md"></div>
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[2px] border-slate-400 dark:border-slate-500 z-10 bg-white/5 backdrop-blur-sm"></div>

      <div
        className="relative w-48 h-64 md:w-64 md:h-80 rounded-b-[4.5rem] rounded-t-[3rem] shadow-2xl border-2 border-white/20 flex flex-col items-center overflow-hidden transition-all duration-700"
        style={{
          backgroundColor: formData.backgroundImage ? '#000' : formData.cardColor,
          backgroundImage: formData.backgroundImage ? `url(${formData.backgroundImage})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {formData.backgroundImage && <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>}
        <div className="absolute top-4 md:top-6 w-6 h-3 md:w-8 md:h-4 bg-slate-950/40 rounded-full shadow-inner"></div>

        <div className="mt-8 md:mt-12 text-center text-white px-3 z-10 flex flex-col items-center justify-center min-h-[50px]">
          <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.2em] text-secondary/80 mb-0.5 drop-shadow-lg">
            {side === 'front' ? 'NOME DO PET' : 'NOME DO TUTOR'}
          </span>
          <h4 className="text-xs md:text-sm font-black uppercase tracking-tight leading-tight drop-shadow-lg text-center px-4">
            {side === 'front' ? (formData.petName || 'AQUI') : (formData.name || 'AQUI')}
          </h4>
        </div>

        <div className="w-36 h-36 md:w-52 md:h-52 rounded-full border-4 border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.3)] flex items-center justify-center bg-white/10 backdrop-blur-md overflow-hidden z-10 mt-4 md:mt-6 transition-all group-hover:scale-105">
          {side === 'front' ? (
            formData.petPhoto ? (
              <img src={formData.petPhoto} alt="Pet" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-white/50">
                <span className="material-icons-outlined text-5xl md:text-7xl">pets</span>
              </div>
            )
          ) : (
            <div className="w-full h-full bg-white flex items-center justify-center p-4">
              <img src={whatsappQrUrl} alt="QR Code" className="w-full h-full object-contain" />
            </div>
          )}
        </div>

        <div className="mt-auto mb-6 md:mb-8 text-white/30 z-10">
          <span className="material-icons-outlined text-lg">contactless</span>
        </div>

        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none"></div>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full shadow-xl text-[8px] font-black uppercase tracking-widest whitespace-nowrap">
        {side === 'front' ? 'Frente' : 'Verso'}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#09090b] font-body text-slate-900 dark:text-slate-100 pb-20 relative transition-colors duration-500">
      <nav className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between bg-white dark:bg-[#09090b] sticky top-0 z-50 transition-colors">
        <div className="flex items-center gap-3 text-sm">
          <Link to="/digital-card" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-lg">arrow_back</span>
            Voltar
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link to="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-lg">home</span>
            Início
          </Link>
          <span className="text-slate-300 dark:text-slate-700">/</span>
          <span className="font-medium text-secondary uppercase tracking-tighter">
            DyCard {productType.includes('keychain') ? 'PET' : (productType === 'digital' ? 'Arquivo Digital' : 'Físico')}
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {renderProgress()}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden transition-colors">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-secondary transition-all duration-1000 ease-out"
              style={{ width: `${((['personal', 'social', 'delivery', 'preview'].indexOf(step) + 1) / (productType === 'digital' ? 3 : 4)) * 100}%` }}
            ></div>
          </div>

          <form onSubmit={handleNext} className="space-y-10">
            {step === 'personal' && (
              <div className="space-y-8 animate-fade-in">
                <header>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">
                    {productType.includes('keychain') ? 'Estilo & Identidade PET' : 'Estilo & Identidade'}
                  </h2>
                  <p className="text-slate-500 text-sm">Configure o visual e as informações base.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {productType.includes('keychain') ? 'Foto do Pet' : 'Foto de Perfil'}
                    </label>
                    <div
                      onClick={() => petPhotoInputRef.current?.click()}
                      className={`aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group ${formData.petPhoto ? 'border-secondary bg-secondary/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'}`}
                    >
                      {formData.petPhoto ? (
                        <div className="flex flex-col items-center gap-2 px-4 text-center z-10 animate-fade-in">
                          <span className="material-icons-outlined text-5xl text-secondary">task_alt</span>
                          <span className="text-[10px] font-black uppercase text-secondary truncate max-w-full">
                            {formData.petPhotoName || 'Arquivo selecionado'}
                          </span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, petPhoto: null, petPhotoName: '' }) }} className="mt-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500">Remover</button>
                        </div>
                      ) : (
                        <>
                          <span className="material-icons-outlined text-4xl mb-2 text-slate-300 group-hover:text-secondary">add_a_photo</span>
                          <span className="text-[10px] font-black uppercase text-slate-400">Upload Foto</span>
                        </>
                      )}
                      <input type="file" ref={petPhotoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'petPhoto')} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Imagem de Fundo (Verso/Base)</label>
                    <div
                      onClick={() => backgroundInputRef.current?.click()}
                      className={`aspect-square rounded-3xl border-2 border-dashed transition-all cursor-pointer overflow-hidden flex flex-col items-center justify-center relative group ${formData.backgroundImage ? 'border-secondary bg-secondary/5' : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50'}`}
                    >
                      {formData.backgroundImage ? (
                        <div className="flex flex-col items-center gap-2 px-4 text-center z-10 animate-fade-in">
                          <span className="material-icons-outlined text-5xl text-secondary">wallpaper</span>
                          <span className="text-[10px] font-black uppercase text-secondary truncate max-w-full">
                            {formData.backgroundImageName || 'Fundo selecionado'}
                          </span>
                          <button type="button" onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, backgroundImage: null, backgroundImageName: '' }) }} className="mt-2 text-[8px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500">Remover</button>
                        </div>
                      ) : (
                        <>
                          <span className="material-icons-outlined text-4xl mb-2 relative z-10 text-slate-300 group-hover:text-secondary">wallpaper</span>
                          <span className="text-[10px] font-black uppercase relative z-10 text-slate-400">Upload Fundo</span>
                        </>
                      )}
                      <input type="file" ref={backgroundInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'backgroundImage')} />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Cor Base</label>
                  <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x">
                    {sophisticatedPalette.map((color, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({ ...formData, cardColor: color, backgroundImage: null, backgroundImageName: '' })}
                        className={`min-w-[48px] h-12 rounded-xl border-2 transition-all snap-start ${formData.cardColor === color && !formData.backgroundImage ? 'border-secondary scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {productType.includes('keychain') ? 'Nome do Tutor' : 'Nome Completo'}
                    </label>
                    <input type="text" required placeholder="Ex: João Silva" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      {productType.includes('keychain') ? 'Nome do Pet' : 'Cargo / Profissão'}
                    </label>
                    <input type="text" required placeholder={productType.includes('keychain') ? "Ex: Rex" : "Ex: Engenheiro"} value={productType.includes('keychain') ? formData.petName : formData.profession} onChange={e => setFormData(productType.includes('keychain') ? { ...formData, petName: e.target.value } : { ...formData, profession: e.target.value })} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                  </div>
                </div>
              </div>
            )}

            {step === 'social' && (
              <div className="space-y-8 animate-fade-in">
                <header>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">Conexões Inteligentes</h2>
                  <p className="text-slate-500 text-sm">Adicione seus links e redes sociais.</p>
                </header>

                <div className="space-y-8">
                  <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-icons-outlined text-secondary">whatsapp</span>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">WhatsApp de Contato</label>
                    </div>
                    <input type="tel" placeholder="+55 (71) 00000-0000" value={formData.whatsapp} onChange={e => setFormData({ ...formData, whatsapp: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                  </div>

                  <div className="space-y-6">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 block">Outros Canais:</label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {socialNetworks.map(net => (
                        <button key={net.id} type="button" onClick={() => handleAddSocialLink(net.id)} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-secondary transition-all">
                          <span className="material-icons-outlined text-2xl" style={{ color: net.color }}>{net.icon}</span>
                          <span className="text-[8px] font-black uppercase tracking-tighter text-slate-500">{net.name}</span>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      {formData.links.map((link, idx) => {
                        const network = socialNetworks.find(n => n.id === link.type);
                        return (
                          <div key={idx} className="flex gap-3 items-center group">
                            <div className="w-14 h-14 flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
                              <span className="material-icons-outlined text-2xl" style={{ color: network?.color }}>{network?.icon}</span>
                            </div>
                            <input type="url" value={link.url} onChange={(e) => handleLinkChange(idx, e.target.value)} className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white text-sm" />
                            <button type="button" onClick={() => handleRemoveLink(idx)} className="w-14 h-14 flex items-center justify-center bg-red-500/5 text-red-500 rounded-2xl border border-red-500/10 hover:bg-red-500 hover:text-white transition-all">
                              <span className="material-icons-outlined text-xl">close</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 'delivery' && (
              <div className="space-y-8 animate-fade-in">
                <header>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">Entrega</h2>
                  <p className="text-slate-500 text-sm">Como deseja receber seu DyCard.</p>
                </header>

                <div className="grid grid-cols-2 gap-6">
                  <button type="button" onClick={() => setFormData({ ...formData, deliveryType: 'shipping' })} className={`p-8 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all ${formData.deliveryType === 'shipping' ? 'border-secondary bg-secondary/5 ring-1 ring-secondary shadow-xl' : 'border-slate-100 dark:border-slate-800'}`}>
                    <span className="material-icons-outlined text-4xl">local_shipping</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Via Correios</span>
                  </button>
                  <button type="button" onClick={() => setFormData({ ...formData, deliveryType: 'pickup' })} className={`p-8 rounded-[2.5rem] border flex flex-col items-center gap-4 transition-all ${formData.deliveryType === 'pickup' ? 'border-secondary bg-secondary/5 ring-1 ring-secondary shadow-xl' : 'border-slate-100 dark:border-slate-800'}`}>
                    <span className="material-icons-outlined text-4xl">storefront</span>
                    <span className="text-[10px] font-black uppercase tracking-widest">Retirada no Studio</span>
                  </button>
                </div>

                {formData.deliveryType === 'pickup' ? (
                  <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-fade-in text-center space-y-6">
                    <span className="material-icons-outlined text-4xl text-secondary">location_on</span>
                    <div className="space-y-2">
                      <h4 className="font-bold dark:text-white uppercase tracking-tight">Studio CidEngenharia</h4>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">Retirada disponível em nosso studio físico de criação e engenharia visual.</p>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex flex-col items-center gap-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Localização do Studio</p>
                      <a
                        href="https://maps.app.goo.gl/dvEcXm5aLRgFEzH19"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-secondary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg shadow-secondary/20"
                      >
                        Abrir no Google Maps
                        <span className="material-icons-outlined text-sm">map</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 animate-fade-in bg-slate-50 dark:bg-slate-950 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
                    <input type="text" required placeholder="Endereço de Entrega Completo" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <input type="text" required placeholder="CEP" maxLength={8} value={formData.zip} onChange={e => setFormData({ ...formData, zip: e.target.value })} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                        <button type="button" onClick={calculateShipping} className="text-[9px] font-black uppercase text-secondary">Calcular Frete</button>
                      </div>
                      <input type="text" required placeholder="Cidade / Estado" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none focus:ring-1 focus:ring-secondary dark:text-white" />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 'preview' && (
              <div className="space-y-10 animate-fade-in">
                <header className="text-center">
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">Resumo da Ordem</h2>
                  <p className="text-slate-500 text-sm">Visualização do {productType.includes('keychain') ? 'Chaveiro PET' : 'Cartão'} (Frente e Verso)</p>
                </header>

                <div className="flex flex-row flex-wrap justify-center items-center gap-10 md:gap-16 py-10 overflow-visible">
                  {productType.includes('keychain') ? (
                    <>
                      <KeychainPrototype side="front" />
                      <KeychainPrototype side="back" />
                    </>
                  ) : (
                    <>
                      <CardPrototype side="front" />
                      <CardPrototype side="back" />
                    </>
                  )}
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 flex justify-between items-end shadow-inner">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-secondary">Total do Pedido</span>
                  <span className="text-3xl font-black text-slate-900 dark:text-white">R$ {totalOrderValue.toFixed(2).replace('.', ',')}</span>
                </div>

                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isSubmitting}
                  className="w-full font-black py-6 rounded-[2.5rem] shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm bg-secondary hover:bg-green-700 text-white shadow-secondary/20"
                >
                  {isSubmitting ? 'Redirecionando...' : 'Concluir e Pagar'}
                  {!isSubmitting && <span className="material-icons-outlined">payments</span>}
                </button>
              </div>
            )}

            <div className="pt-8 flex items-center justify-between gap-4">
              {step !== 'preview' && step !== 'personal' && (
                <button type="button" onClick={() => {
                  if (step === 'social') setStep('personal');
                  else if (step === 'delivery') setStep('social');
                }} className="px-10 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500 font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
                  Voltar
                </button>
              )}
              {step !== 'preview' && (
                <button type="submit" className="ml-auto px-12 py-5 font-black rounded-2xl shadow-xl transition-all active:scale-95 flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] bg-secondary text-white shadow-secondary/20">
                  Próximo Passo
                  <span className="material-icons-outlined text-sm">arrow_forward</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};