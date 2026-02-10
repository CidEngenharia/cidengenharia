import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Experience {
  id: string; role: string; company: string; period: string; description: string;
}

interface SocialLink {
  id: string; type: 'instagram' | 'youtube' | 'facebook' | 'linkedin' | 'x'; url: string;
}

type Tier = 'basic' | 'premium';

const SOCIAL_CONFIG = [
  { id: 'instagram', icon: 'camera_alt', label: 'Instagram', color: 'text-pink-500' },
  { id: 'youtube', icon: 'play_circle', label: 'Youtube', color: 'text-red-500' },
  { id: 'facebook', icon: 'facebook', label: 'Facebook', color: 'text-blue-600' },
  { id: 'linkedin', icon: 'work', label: 'Linkedin', color: 'text-blue-700' },
  { id: 'x', icon: 'close', label: 'Twitter X', color: 'text-slate-800 dark:text-white' },
];

export const ResumeGenerator: React.FC = () => {
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [tier, setTier] = useState<Tier>('premium');
  const [activeSection, setActiveSection] = useState('personal');
  const [isAILoading, setIsAILoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    name: '', surname: '', role: '', email: '', phone: '', city: '', summary: '',
    photo: null as string | null,
    skills: [] as string[],
    experiences: [] as Experience[],
    socials: [] as SocialLink[]
  });

  const addExperience = () => setFormData(p => ({ ...p, experiences: [...p.experiences, { id: Date.now().toString(), role: '', company: '', period: '', description: '' }] }));
  const addSkill = () => { if(skillInput.trim()) { setFormData(p => ({ ...p, skills: [...p.skills, skillInput.trim()] })); setSkillInput(''); } };
  const addSocial = (type: any) => {
    if (formData.socials.find(s => s.type === type)) return;
    setFormData(p => ({ ...p, socials: [...p.socials, { id: Date.now().toString(), type, url: '' }] }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, photo: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleCheckout = (type: string) => {
    navigate(`/payment?item=generator_download&type=${type}`);
  };

  const generateAI = async () => {
    if (!formData.role) return alert("Por favor, preencha seu cargo para a IA analisar.");
    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Gere um resumo profissional técnico de alto impacto para um ${formData.role} com foco nestas competências: ${formData.skills.join(', ')}. Seja conciso e profissional em português.`;
      const res = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setFormData(p => ({ ...p, summary: res.text || '' }));
    } catch (err) { console.error(err); } finally { setIsAILoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto font-roboto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row transition-all duration-500 min-h-[600px]">
        
        <aside className="w-full md:w-52 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4">
          <nav className="space-y-1">
            {[
              { id: 'personal', title: 'Identidade', icon: 'person' },
              { id: 'experience', title: 'Carreira', icon: 'work' },
              { id: 'skills', title: 'Competências', icon: 'psychology' },
              { id: 'social', title: 'Redes Sociais', icon: 'share' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${activeSection === s.id ? 'border-primary-500 bg-primary-500/5 text-primary-500 shadow-sm' : 'border-transparent text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}
              >
                <span className="material-icons-outlined text-base">{s.icon}</span>
                <span className="text-[8px] font-black uppercase tracking-widest">{s.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 md:p-12 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeSection === 'personal' && (
              <motion.section key="pers" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-black uppercase dark:text-white tracking-widest">Dados de <span className="text-primary-500">Identidade</span></h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div onClick={() => photoInputRef.current?.click()} className="md:col-span-2 w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-950 hover:border-primary-500 transition-all">
                    {formData.photo ? <img src={formData.photo} className="w-full h-full object-cover" /> : <span className="material-icons-outlined text-slate-300">add_a_photo</span>}
                    <input type="file" ref={photoInputRef} hidden accept="image/*" onChange={handlePhotoUpload} />
                  </div>
                  <input type="text" placeholder="Nome" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm" />
                  <input type="text" placeholder="Sobrenome" value={formData.surname} onChange={e => setFormData({...formData, surname: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm" />
                  <input type="text" placeholder="Título Profissional" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="md:col-span-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm font-bold" />
                  <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm" />
                  <input type="text" placeholder="WhatsApp / Telefone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm" />
                  <input type="text" placeholder="Cidade / Estado" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="md:col-span-2 w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-3.5 outline-none dark:text-white text-sm" />
                </div>
                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                     <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Resumo Profissional</label>
                     <button onClick={generateAI} disabled={isAILoading} className="flex items-center gap-1 text-[8px] font-black uppercase text-primary-500 hover:underline">
                       {isAILoading ? <span className="animate-spin material-icons-outlined text-xs">sync</span> : <span className="material-icons-outlined text-xs">auto_awesome</span>}
                       Gerar com IA
                     </button>
                   </div>
                   <textarea value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 outline-none dark:text-white text-xs min-h-[140px] leading-relaxed" placeholder="Descreva sua trajetória técnica..." />
                </div>
              </motion.section>
            )}

            {activeSection === 'experience' && (
              <motion.section key="exp" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-black uppercase dark:text-white tracking-widest">Trajetória <span className="text-primary-500">Profissional</span></h2>
                  <button onClick={addExperience} className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"><span className="material-icons-outlined">add</span></button>
                </div>
                <div className="space-y-4">
                  {formData.experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-4 group relative">
                       <button onClick={() => setFormData(p => ({ ...p, experiences: p.experiences.filter(e => e.id !== exp.id) }))} className="absolute top-4 right-4 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><span className="material-icons-outlined text-sm">delete</span></button>
                       <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Cargo" value={exp.role} onChange={e => { const n = [...formData.experiences]; n[idx].role = e.target.value; setFormData({...formData, experiences: n}); }} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none dark:text-white text-xs font-bold" />
                          <input type="text" placeholder="Empresa" value={exp.company} onChange={e => { const n = [...formData.experiences]; n[idx].company = e.target.value; setFormData({...formData, experiences: n}); }} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none dark:text-white text-xs" />
                       </div>
                       <input type="text" placeholder="Período (Ex: 2020 - Atual)" value={exp.period} onChange={e => { const n = [...formData.experiences]; n[idx].period = e.target.value; setFormData({...formData, experiences: n}); }} className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl px-4 py-2.5 outline-none dark:text-white text-[10px] uppercase font-bold" />
                       <textarea placeholder="Principais entregas técnicas..." value={exp.description} onChange={e => { const n = [...formData.experiences]; n[idx].description = e.target.value; setFormData({...formData, experiences: n}); }} className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-4 outline-none dark:text-white text-[10px] leading-relaxed" rows={3} />
                    </div>
                  ))}
                  {formData.experiences.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[2.5rem] text-slate-300 font-black uppercase text-[10px] tracking-widest">Nenhuma experiência registrada</div>
                  )}
                </div>
              </motion.section>
            )}

            {activeSection === 'skills' && (
              <motion.section key="sk" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-xl font-black uppercase dark:text-white tracking-widest">Stack <span className="text-primary-500">Técnica</span></h2>
                <div className="flex gap-2">
                   <input 
                    type="text" 
                    value={skillInput} 
                    onChange={e => setSkillInput(e.target.value)} 
                    onKeyPress={e => e.key === 'Enter' && addSkill()} 
                    placeholder="Ex: Engenharia Visual, React, CAD..." 
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" 
                   />
                   <button onClick={addSkill} className="px-8 bg-primary-500 text-white rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">Adicionar</button>
                </div>
                <div className="flex flex-wrap gap-2 pt-4">
                   {formData.skills.map(s => (
                     <span key={s} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase flex items-center gap-3 group">
                       {s} 
                       <span onClick={() => setFormData(p => ({ ...p, skills: p.skills.filter(i => i !== s) }))} className="material-icons-outlined text-xs cursor-pointer text-slate-300 hover:text-red-500 transition-colors">close</span>
                     </span>
                   ))}
                   {formData.skills.length === 0 && (
                     <div className="w-full text-center py-10 text-slate-300 font-black uppercase text-[10px] tracking-widest">Adicione suas habilidades em destaque</div>
                   )}
                </div>
              </motion.section>
            )}

            {activeSection === 'social' && (
              <motion.section key="soc" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-xl font-black uppercase dark:text-white tracking-widest">Conexões <span className="text-primary-500">Sociais</span></h2>
                <div className="flex flex-wrap gap-3 p-8 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] justify-center shadow-inner">
                  {SOCIAL_CONFIG.map(cfg => (
                    <button key={cfg.id} onClick={() => addSocial(cfg.id)} className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:border-primary-500 transition-all group">
                      <span className={`material-icons-outlined text-2xl ${cfg.color}`}>{cfg.icon}</span>
                    </button>
                  ))}
                </div>
                <div className="space-y-4">
                  {formData.socials.map((link, i) => {
                    const cfg = SOCIAL_CONFIG.find(c => c.id === link.type)!;
                    return (
                      <div key={link.id} className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl animate-fade-in group shadow-sm">
                        <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 shadow-inner">
                           <span className={`material-icons-outlined text-xl ${cfg.color}`}>{cfg.icon}</span>
                        </div>
                        <div className="flex-1 space-y-1">
                           <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">{cfg.label}</p>
                           <input 
                            type="text" placeholder={`URL do seu ${cfg.label}`} value={link.url} 
                            onChange={e => { const n = [...formData.socials]; n[i].url = e.target.value; setFormData({...formData, socials: n}); }}
                            className="w-full bg-transparent outline-none dark:text-white text-xs font-bold"
                          />
                        </div>
                        <button onClick={() => setFormData(p => ({ ...p, socials: p.socials.filter(s => s.id !== link.id) }))} className="text-slate-300 hover:text-red-500 p-2 transition-all">
                          <span className="material-icons-outlined">delete</span>
                        </button>
                      </div>
                    );
                  })}
                  {formData.socials.length === 0 && (
                    <div className="text-center py-10 text-slate-300 font-black uppercase text-[10px] tracking-widest">Selecione ícones acima para adicionar links</div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>

          <div className="mt-12 pt-10 border-t border-slate-100 dark:border-slate-800 space-y-4">
             <button 
                onClick={() => setShowPreviewModal(true)}
                className="w-full h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.01] transition-all group"
             >
                <span className="material-icons-outlined group-hover:rotate-12 transition-transform">visibility</span>
                Visualizar Currículo Premium
             </button>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showPreviewModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center p-4 md:p-12 bg-slate-950/95 backdrop-blur-2xl overflow-y-auto">
             <div className="min-h-full w-full flex flex-col items-center py-10">
                <div className="w-full max-w-4xl flex justify-between items-center mb-10 px-6">
                   <h3 className="text-xl font-black text-white uppercase tracking-widest">Engine de <span className="text-primary-500 italic">Visualização</span></h3>
                   <button onClick={() => setShowPreviewModal(false)} className="w-12 h-12 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-500 transition-all"><span className="material-icons-outlined">close</span></button>
                </div>

                <div className="origin-top scale-[0.6] sm:scale-[0.8] lg:scale-100 shadow-[0_60px_150px_rgba(0,0,0,0.9)] rounded-sm overflow-hidden mb-32 border border-white/5 bg-white">
                  <div className="bg-white text-slate-900 w-[595px] min-h-[842px] p-16 flex flex-col relative">
                    <div className="flex justify-between items-start mb-14">
                      <div className="flex-1 space-y-2">
                        <h1 className="text-3xl font-black uppercase tracking-tighter leading-none border-l-8 border-primary-500 pl-4">{formData.name || 'NOME'} {formData.surname || 'COMPLETO'}</h1>
                        <p className="text-sm font-bold text-primary-500 uppercase tracking-[0.2em] pl-4">{formData.role || 'ESPECIALISTA EM ENGENHARIA'}</p>
                        <div className="pt-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest space-y-1 pl-4">
                           <p className="flex items-center gap-2"><span className="material-icons-outlined text-[12px]">email</span> {formData.email || 'contato@dominio.com'}</p>
                           <p className="flex items-center gap-2"><span className="material-icons-outlined text-[12px]">phone</span> {formData.phone || '(00) 00000-0000'}</p>
                           <p className="flex items-center gap-2"><span className="material-icons-outlined text-[12px]">location_on</span> {formData.city || 'CIDADE, ESTADO'}</p>
                        </div>
                      </div>
                      {formData.photo && (
                        <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-slate-50 shadow-xl shrink-0">
                          <img src={formData.photo} className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col gap-10">
                      <section className="space-y-3">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 border-b border-slate-100 pb-1">Perfil Profissional</h4>
                         <p className="text-[11px] leading-relaxed text-slate-600 italic whitespace-pre-wrap">{formData.summary || 'Aguardando biografia técnica...'}</p>
                      </section>

                      <section className="space-y-6">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 border-b border-slate-100 pb-1">Experiência Profissional</h4>
                         <div className="space-y-6">
                            {formData.experiences.length > 0 ? formData.experiences.map(exp => (
                              <div key={exp.id} className="space-y-1">
                                 <div className="flex justify-between items-baseline">
                                   <h5 className="text-[11px] font-black uppercase">{exp.role}</h5>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase">{exp.period}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-500 uppercase">{exp.company}</p>
                                 <p className="text-[10px] text-slate-500 leading-relaxed mt-1">{exp.description}</p>
                              </div>
                            )) : <p className="text-[10px] text-slate-300 italic">Adicione suas experiências na aba carreira.</p>}
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 border-b border-slate-100 pb-1">Competências Chave</h4>
                         <div className="flex flex-wrap gap-2">
                            {formData.skills.map(s => (
                              <span key={s} className="px-2.5 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-600 tracking-tighter">{s}</span>
                            ))}
                         </div>
                      </section>

                      <section className="space-y-4">
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 border-b border-slate-100 pb-1">Networking Digital</h4>
                         <div className="grid grid-cols-2 gap-3">
                            {formData.socials.map(s => (
                              <div key={s.id} className="text-[9px] flex items-center gap-2">
                                <span className="font-black uppercase text-primary-500">{s.type}:</span>
                                <span className="text-slate-400 truncate block font-medium lowercase italic">{s.url}</span>
                              </div>
                            ))}
                         </div>
                      </section>
                    </div>

                    <div className="absolute bottom-8 right-16 opacity-10 flex items-center gap-2 grayscale pointer-events-none">
                       <span className="text-[8px] font-black uppercase tracking-[0.4em]">Gerado via CidEngenharia 360°</span>
                    </div>
                  </div>
                </div>

                <div className="fixed bottom-10 flex flex-wrap justify-center gap-4 z-[110] px-4 w-full max-w-5xl">
                   <button onClick={() => window.print()} className="px-10 py-5 bg-emerald-500 text-white rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center gap-3 hover:scale-105 transition-all">
                      <span className="material-icons-outlined text-base">print</span>
                      Imprimir Folha
                   </button>
                   <button onClick={() => handleCheckout('pdf')} className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 border border-white/10 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-2xl">
                      <span className="material-icons-outlined text-base">picture_as_pdf</span>
                      Gerar PDF
                   </button>
                   <button onClick={() => handleCheckout('word')} className="px-10 py-5 bg-blue-600 text-white border border-white/10 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 transition-all flex items-center gap-3 shadow-2xl">
                      <span className="material-icons-outlined text-base">description</span>
                      Gerar Word
                   </button>
                   <button onClick={() => setShowPreviewModal(false)} className="px-10 py-5 bg-white/10 text-white border border-white/20 rounded-[2.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-white/20 transition-all backdrop-blur-md">
                      Voltar ao Editor
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};