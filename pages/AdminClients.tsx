
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface Client {
  id: string;
  name: string;
  industry: string;
  logo_url: string;
  created_at: string;
}

export const AdminClients: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<{title: string, detail: string} | null>(null);
  
  const [formData, setFormData] = useState({ name: '', industry: '' });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const ADMIN_EMAIL = 'sidney.sales@gmail.com';

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const hasLocalSession = localStorage.getItem('admin_session') === 'true';
        
        if ((!user || user.email !== ADMIN_EMAIL) && !hasLocalSession) {
          console.warn("Acesso negado: Redirecionando para login.");
          navigate('/admin');
          return;
        }
        await fetchClients();
      } catch (err) {
        console.error("Erro na verificação de acesso:", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setClients(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar clientes do banco:', err.message);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    console.log("Iniciando processo de integração de marca...");

    if (!photoFile) {
        alert("Erro: Você precisa selecionar um logotipo antes de integrar.");
        return;
    }
    
    setIsUploading(true);
    setErrorMessage(null);
    
    try {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // 1. Upload para o Storage (Bucket: cid-assets)
      const { error: uploadError } = await supabase.storage
        .from('cid-assets')
        .upload(filePath, photoFile);

      if (uploadError) {
          console.error("Falha no Storage:", uploadError);
          throw new Error(`Erro no Storage: ${uploadError.message}. Verifique se o bucket 'cid-assets' é público.`);
      }

      // 2. Pegar URL Pública
      const { data: urlData } = supabase.storage
        .from('cid-assets')
        .getPublicUrl(filePath);

      // 3. Inserir no Banco de Dados
      const { error: insertError } = await supabase
        .from('clients')
        .insert([{ 
          name: formData.name, 
          industry: formData.industry, 
          logo_url: urlData.publicUrl 
        }]);

      if (insertError) {
          console.error("Falha no Database:", insertError);
          throw new Error(`Erro na Tabela: ${insertError.message}. Verifique se a tabela 'clients' existe.`);
      }

      // Sucesso
      setFormData({ name: '', industry: '' });
      setPhotoFile(null);
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await fetchClients();
      alert("Marca integrada com sucesso ao portfólio!");
    } catch (err: any) {
      setErrorMessage({
        title: "Falha na Ação",
        detail: err.message || "Erro desconhecido na comunicação com Supabase."
      });
    } finally {
      setIsUploading(false);
    }
  };

  const deleteClient = async (id: string, logoUrl: string) => {
    if (!confirm("Excluir esta marca permanentemente?")) return;
    try {
      const { error: dbError } = await supabase.from('clients').delete().eq('id', id);
      if (dbError) throw dbError;

      // Limpeza opcional do storage
      if (logoUrl.includes('logos/')) {
        const path = `logos/${logoUrl.split('logos/')[1]}`;
        await supabase.storage.from('cid-assets').remove([path]);
      }
      setClients(clients.filter(c => c.id !== id));
    } catch (err: any) {
      alert("Erro ao excluir: " + err.message);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#020617]">
      <div className="flex flex-col items-center gap-4">
        <span className="material-icons-outlined animate-spin text-5xl text-primary-500">sync</span>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando Database...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] p-8 md:p-16 engineering-grid transition-colors duration-500 relative">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center gap-4">
          <Link to="/admin/dashboard" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-center text-slate-500 hover:text-primary-500 transition-all shadow-lg group">
            <span className="material-icons-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          </Link>
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase dark:text-white font-display tracking-tighter">
              Gerenciar <span className="text-primary-500 italic">Clientes</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brand Assets & Database Sync</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl sticky top-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-primary-500 text-center">Registrar Nova Marca</h4>
              
              <div 
                onClick={() => !isUploading && fileInputRef.current?.click()} 
                className={`aspect-square border-2 border-dashed rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group ${photoPreview ? 'border-primary-500 bg-primary-500/5' : 'border-slate-200 dark:border-slate-800 hover:border-primary-500'}`}
              >
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-contain p-8 animate-fade-in" alt="Preview" />
                ) : (
                  <div className="text-center space-y-2">
                    <span className="material-icons-outlined text-4xl text-slate-300 group-hover:text-primary-500 transition-colors">add_photo_alternate</span>
                    <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Logotipo (PNG/JPG)</p>
                  </div>
                )}
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handlePhotoSelect} />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Nome da Empresa</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white text-sm font-bold focus:ring-2 focus:ring-primary-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 ml-1">Segmento / Indústria</label>
                  <input type="text" required value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-5 py-4 outline-none dark:text-white text-sm focus:ring-2 focus:ring-primary-500" />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isUploading} 
                className="w-full py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 uppercase text-[10px] tracking-widest disabled:opacity-50 active:scale-95"
              >
                {isUploading ? (
                    <>
                        <span className="animate-spin material-icons-outlined text-sm">sync</span>
                        Enviando...
                    </>
                ) : (
                    <>
                        <span className="material-icons-outlined text-sm">cloud_upload</span> 
                        Integrar Marca
                    </>
                )}
              </button>

              {errorMessage && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl animate-shake">
                  <p className="text-[9px] font-black text-red-500 uppercase">{errorMessage.title}</p>
                  <p className="text-[8px] text-red-600/80 dark:text-red-400/80 leading-tight mt-1">{errorMessage.detail}</p>
                </div>
              )}
            </form>
          </motion.div>
        </div>

        <div className="lg:col-span-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {clients.length === 0 ? (
                <div className="col-span-full py-32 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 opacity-50">
                  <span className="material-icons-outlined text-6xl text-slate-300 mb-4">business</span>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nenhuma marca no banco de dados</p>
                </div>
              ) : (
                clients.map(client => (
                  <motion.div 
                    key={client.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl group relative overflow-hidden flex flex-col items-center text-center gap-6 hover:border-primary-500/30 transition-all duration-500"
                  >
                    <div className="w-24 h-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-4 shadow-inner">
                      <img src={client.logo_url} className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={client.name} />
                    </div>
                    <div className="space-y-1 w-full px-2">
                      <h5 className="text-[12px] font-black uppercase dark:text-white truncate tracking-tighter">{client.name}</h5>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.2em]">{client.industry}</p>
                    </div>
                    <button 
                      onClick={() => deleteClient(client.id, client.logo_url)}
                      className="absolute top-4 right-4 w-9 h-9 bg-red-500/10 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center hover:bg-red-500 hover:text-white shadow-lg"
                    >
                      <span className="material-icons-outlined text-sm">delete_forever</span>
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
