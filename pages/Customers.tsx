
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

const ClientLogo: React.FC<{ name: string; industry: string; icon: string; logoUrl?: string }> = ({ name, industry, icon, logoUrl }) => (
  <motion.div 
    whileHover={{ y: -8, scale: 1.02 }}
    className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex flex-col items-center text-center gap-6 group h-full transition-all duration-500 hover:border-primary-500/20"
  >
    <div className="w-full aspect-square rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-primary-500/5">
       {logoUrl ? (
         <img 
           src={logoUrl} 
           alt={`Logo ${name}`} 
           className="w-full h-full object-contain p-6 filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-100 group-hover:scale-110"
           onError={(e) => {
             (e.target as HTMLImageElement).src = "https://placehold.co/200x200?text=LOGO";
           }}
         />
       ) : (
         <span className="material-icons-outlined text-5xl text-slate-300 group-hover:text-primary-500 transition-colors">{icon}</span>
       )}
    </div>
    <div className="space-y-1 w-full overflow-hidden px-1">
      <h3 className="text-[13px] font-bold uppercase tracking-tighter text-slate-900 dark:text-white leading-tight truncate">{name}</h3>
      <p className="text-[9px] font-normal text-slate-400 uppercase tracking-[0.2em] leading-relaxed line-clamp-2 min-h-[2.5em] flex items-center justify-center">
        {industry}
      </p>
    </div>
  </motion.div>
);

interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  photo_url?: string;
  created_at: string;
}

const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Carlos Oliveira', role: 'CEO CMTur', text: 'O sistema de cartões NFC da CidEngenharia mudou nossa forma de fazer networking em eventos de turismo.', created_at: new Date().toISOString() },
  { id: '2', name: 'Ana Souza', role: 'Gerente TriHair', text: 'Excelente suporte e ferramentas de automação documental incríveis.', created_at: new Date().toISOString() }
];

const FALLBACK_CLIENTS = [
  { name: "CMTur", industry: "Turismo & Viagens", icon: "explore", logoUrl: "https://images.unsplash.com/photo-1599305090598-fe179d501227?w=200&h=200&fit=crop&q=80" },
  { name: "Águia Transportes", industry: "Logística & Cargas", icon: "local_shipping", logoUrl: "https://images.unsplash.com/photo-1543286386-713bdd548da4?w=200&h=200&fit=crop&q=80" },
  { name: "TriHair Industria", industry: "Cosméticos & Indústria", icon: "precision_manufacturing", logoUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop&q=80" }
];

export const Customers: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({ name: '', role: '', text: '' });
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: tData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      setTestimonials(tData && tData.length > 0 ? tData : FALLBACK_TESTIMONIALS);

      const { data: cData } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      
      // Mapeia os dados do Supabase ou usa o Fallback caso o banco esteja vazio
      if (cData && cData.length > 0) {
        setClients(cData.map(c => ({ 
          name: c.name, 
          industry: c.industry, 
          icon: 'business', 
          logoUrl: c.logo_url 
        })));
      } else {
        setClients(FALLBACK_CLIENTS);
      }
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setTestimonials(FALLBACK_TESTIMONIALS);
      setClients(FALLBACK_CLIENTS);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let photoUrl = '';
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('cid-assets')
          .upload(filePath, photoFile);
          
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('cid-assets').getPublicUrl(filePath);
        photoUrl = urlData.publicUrl;
      }
      await supabase.from('testimonials').insert([{ name: formData.name, role: formData.role, text: formData.text, photo_url: photoUrl }]);
      setFormData({ name: '', role: '', text: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
      alert("Depoimento enviado!");
      fetchData();
    } catch (err: any) {
      alert("Erro ao enviar: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 lg:p-24 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <header className="max-w-5xl mx-auto text-center space-y-6 mb-24">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
          Portfolio de Marcas
        </div>
        <h1 className="text-4xl md:text-7xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter leading-none">
          Parceiros de <span className="text-primary-500 italic">Negócio</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xl mx-auto">Empresas que confiam na CidEngenharia para suas soluções de identidade e tecnologia.</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-40">
        <AnimatePresence mode="popLayout">
          {clients.map((client, idx) => (
            <motion.div 
              key={`${client.name}-${idx}`} 
              initial={{ opacity: 0, y: 30 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: idx * 0.05 }}
            >
              <ClientLogo {...client} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter">
              A Voz de quem <span className="text-primary-500">Constrói</span> conosco
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Histórias reais de transformação digital e visual.</p>
          </div>

          <div className="space-y-8 max-h-[700px] overflow-y-auto custom-scrollbar pr-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50"><span className="material-icons-outlined animate-spin text-4xl mb-2">sync</span><p className="text-[10px] font-black uppercase tracking-widest">Consultando Nuvem...</p></div>
            ) : (
              <AnimatePresence mode="popLayout">
                {testimonials.map((t) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl relative group">
                    <span className="material-icons-outlined absolute top-8 right-10 text-primary-500/10 text-7xl select-none">format_quote</span>
                    <div className="flex items-center gap-5 mb-8">
                      <div className="w-16 h-16 rounded-2xl border-2 border-primary-500/20 overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-lg">
                        {t.photo_url ? <img src={t.photo_url} className="w-full h-full object-cover" /> : <span className="material-icons-outlined text-slate-400 text-2xl">person</span>}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white uppercase text-base tracking-tight">{t.name}</h4>
                        <p className="text-[10px] font-normal text-primary-500 uppercase tracking-widest">{t.role}</p>
                      </div>
                    </div>
                    <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed italic font-light">"{t.text}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="sticky top-24">
          <div className="bg-slate-900 dark:bg-slate-950 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden flex flex-col justify-center border border-white/5">
            <div className="engineering-grid absolute inset-0 opacity-10 pointer-events-none"></div>
            <div className="relative z-10 space-y-10">
              <div className="space-y-2 text-center">
                 <h3 className="text-2xl font-black text-white uppercase font-display tracking-tight">Conte sua História</h3>
                 <p className="text-slate-500 text-xs uppercase tracking-widest">Sua marca em destaque</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Seu Nome Completo" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                  <input type="text" required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} placeholder="Seu Cargo / Empresa" className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all" />
                </div>
                <textarea required rows={5} value={formData.text} onChange={e => setFormData({...formData, text: e.target.value})} placeholder="Descreva sua experiência com nosso Studio..." className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-6 py-5 text-white text-sm resize-none outline-none focus:ring-2 focus:ring-primary-500 transition-all"></textarea>
                
                <div className="flex flex-col gap-6">
                  <div onClick={() => fileInputRef.current?.click()} className={`flex-1 border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all hover:bg-white/5 ${photoPreview ? 'border-primary-500 bg-primary-500/5' : 'border-white/10'}`}>
                    {photoPreview ? <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary-500 shadow-xl"><img src={photoPreview} className="w-full h-full object-cover" /></div> : <><span className="material-icons-outlined text-3xl text-white/20">add_a_photo</span><span className="text-[10px] font-bold uppercase text-white/40 tracking-widest">Foto de Perfil</span></>}
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full h-20 bg-primary-500 text-white font-black rounded-[2rem] uppercase text-xs tracking-[0.2em] shadow-2xl shadow-primary-500/30 disabled:opacity-50 transition-all active:scale-95 hover:bg-primary-600">
                    {isSubmitting ? 'Sincronizando...' : 'Publicar Depoimento'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
