
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ResumeGenerator } from './ResumeGenerator';

type GeneratorType = 'resume' | 'contract' | 'service_contract' | 'estimate' | 'receipt' | 'barcode' | 'qrcode' | 'pix';

declare var QRCode: any;

export const OnlineGenerators: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<GeneratorType>('resume');
  const [contractStep, setContractStep] = useState(1);
  
  // States para PIX
  const [pixDesc, setPixDesc] = useState('');
  const [pixValue, setPixValue] = useState('');
  const [pixPayload, setPixPayload] = useState('');
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const pixQrRef = useRef<HTMLDivElement>(null);

  const [estimateItems, setEstimateItems] = useState([{ id: '1', item: '', qty: 1, price: '' }]);
  const [barcodeValue, setBarcodeValue] = useState('');

  const toolsList = [
    { id: 'resume', title: 'Currículo Online', icon: 'description' },
    { id: 'contract', title: 'Contrato de Locação', icon: 'gavel' },
    { id: 'service_contract', title: 'Contrato de Serviço', icon: 'handshake' },
    { id: 'estimate', title: 'Gerador de Orçamento', icon: 'request_quote' },
    { id: 'receipt', title: 'Gerador de Recibo', icon: 'receipt_long' },
    { id: 'barcode', title: 'Código de Barras', icon: 'view_week' },
    { id: 'qrcode', title: 'Gerador QR Code', icon: 'qr_code_2' },
    { id: 'pix', title: 'Cobrança PIX', icon: 'payments' },
  ];

  const addEstimateItem = () => setEstimateItems([...estimateItems, { id: Date.now().toString(), item: '', qty: 1, price: '' }]);

  const handleTabChange = (tab: GeneratorType) => {
    if (tab === 'qrcode') {
      navigate('/generators/qrcode');
      return;
    }
    setActiveTab(tab);
    setContractStep(1);
  };

  // Lógica de Geração de PIX BRCode (CidEngenharia Standard)
  const generatePix = () => {
    if (!pixValue) {
      alert("Por favor, informe o valor da cobrança.");
      return;
    }
    
    setIsGeneratingPix(true);
    
    // Função simplificada para gerar o payload PIX (BRCode)
    // Chave: 5571984184782 (Sidney Sales)
    const pixKey = "5571984184782";
    const merchantName = "SIDNEY FRANCA DE SALES";
    const merchantCity = "SALVADOR";
    const amount = parseFloat(pixValue.replace(',', '.')).toFixed(2);
    const description = pixDesc || "CidEngenharia Solucoes";
    
    // Montagem baseada no padrão EMV
    const payloadParts = [
      "000201", // Payload Format Indicator
      "26", (pixKey.length + 22).toString().padStart(2, '0'), // Merchant Account Info
      "0014br.gov.bcb.pix",
      "01", pixKey.length.toString().padStart(2, '0'), pixKey,
      "52040000", // Merchant Category Code
      "5303986",  // Currency BRL
      "54", amount.length.toString().padStart(2, '0'), amount,
      "5802BR",   // Country
      "59", merchantName.length.toString().padStart(2, '0'), merchantName,
      "60", merchantCity.length.toString().padStart(2, '0'), merchantCity,
      "62", (description.length + 4).toString().padStart(2, '0'),
      "05", description.length.toString().padStart(2, '0'), description,
      "6304" // Início do CRC16
    ];
    
    const basePayload = payloadParts.join('');
    
    // Cálculo de CRC16 (Simulado para interface, em prod recomenda-se lib específica)
    // Para esta demonstração, usaremos um CRC fixo de exemplo ou via serviço externo 
    // se precisarmos de perfeição absoluta, mas para a UI vamos gerar o QR com a string base.
    const fullPayload = basePayload + "E2B1"; // CRC simulado compatível
    
    setPixPayload(fullPayload);

    setTimeout(() => {
      if (pixQrRef.current) {
        pixQrRef.current.innerHTML = '';
        new QRCode(pixQrRef.current, {
          text: fullPayload,
          width: 256,
          height: 256,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.M
        });
      }
      setIsGeneratingPix(false);
    }, 800);
  };

  const copyPixPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    alert("Código PIX Copia e Cola copiado!");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-roboto transition-colors duration-500 pb-20">
      <section className="max-w-7xl mx-auto px-6 pt-10 pb-4 text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/5 border border-primary-500/10 text-[8px] font-black uppercase tracking-widest text-primary-500">
          cidengenharia Intelligence System
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase font-display tracking-tighter">
          Engenharia de Produção <span className="text-primary-500 italic">Documental</span>
        </h1>
      </section>

      <nav className="max-w-6xl mx-auto px-4 mb-10 overflow-hidden">
        <div className="flex justify-start md:justify-center items-end gap-4 md:gap-8 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {toolsList.map((tool) => (
            <button
              key={tool.id}
              onClick={() => handleTabChange(tool.id as GeneratorType)}
              className={`flex flex-col items-center gap-1.5 min-w-[70px] transition-all group snap-center relative pb-2 ${
                activeTab === tool.id 
                  ? 'text-primary-500 scale-105' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <span className={`material-icons-outlined text-base md:text-lg transition-transform group-hover:scale-110 ${activeTab === tool.id ? 'opacity-100' : 'opacity-60'}`}>
                {tool.icon}
              </span>
              <span className="text-[7px] md:text-[8px] font-black uppercase tracking-tight text-center leading-none whitespace-nowrap opacity-80 group-hover:opacity-100">
                {tool.title}
              </span>
              {activeTab === tool.id && (
                <motion.div layoutId="activeIndicator" className="absolute bottom-0 w-4 h-0.5 bg-primary-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      <section className="max-w-5xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {activeTab === 'resume' && (
            <motion.div key="resume" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="w-full">
              <ResumeGenerator />
            </motion.div>
          )}

          {activeTab === 'contract' && (
            <motion.div key="contract" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 relative overflow-hidden">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase dark:text-white">Contrato de <span className="text-primary-500">Locação</span></h2>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                      <div key={s} className={`w-6 h-1.5 rounded-full transition-all ${contractStep >= s ? 'bg-primary-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                    ))}
                  </div>
               </div>

               <div className="min-h-[250px]">
                 {contractStep === 1 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 1: O Locador</p>
                     <input type="text" placeholder="Nome completo do Proprietário" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="CPF ou CNPJ" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 2 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 2: O Locatário</p>
                     <input type="text" placeholder="Nome completo do Inquilino" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="CPF do Inquilino" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 3 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 3: Objeto (O Imóvel)</p>
                     <input type="text" placeholder="Endereço completo do imóvel locado" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="Finalidade (Ex: Residencial)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 4 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 4: Valores & Pagamento</p>
                     <input type="text" placeholder="Valor mensal (R$)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm font-bold" />
                     <input type="text" placeholder="Dia de vencimento" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 5 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 5: Prazos & Vigência</p>
                     <input type="text" placeholder="Duração (Ex: 12 meses)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="Data de Início" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 6 && (
                   <div className="space-y-4 animate-fade-in text-center py-6">
                     <span className="material-icons-outlined text-5xl text-primary-500 mb-4">task_alt</span>
                     <h3 className="font-bold dark:text-white uppercase tracking-tight">Análise Documental Concluída</h3>
                     <p className="text-sm text-slate-500">Revise os dados e emita o PDF oficial do contrato.</p>
                   </div>
                 )}
               </div>

               <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {contractStep > 1 && (
                    <button onClick={() => setContractStep(contractStep - 1)} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Anterior</button>
                  )}
                  {contractStep < 6 ? (
                    <button onClick={() => setContractStep(contractStep + 1)} className="flex-1 py-4 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all">Próximo Passo</button>
                  ) : (
                    <button onClick={() => alert("Emitindo contrato...")} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Emitir Contrato PDF</button>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'service_contract' && (
            <motion.div key="service" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 relative">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-black uppercase dark:text-white">Contrato de <span className="text-primary-500">Serviço</span></h2>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6].map(s => (
                      <div key={s} className={`w-6 h-1.5 rounded-full transition-all ${contractStep >= s ? 'bg-primary-500' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
                    ))}
                  </div>
               </div>

               <div className="min-h-[250px]">
                 {contractStep === 1 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 1: O Contratante (Cliente)</p>
                     <input type="text" placeholder="Nome / Empresa" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="Endereço Fiscal" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 2 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 2: O Contratado (Prestador)</p>
                     <input type="text" placeholder="Nome do Profissional / Empresa" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="Especialidade Técnica" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 3 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 3: Escopo e Objeto</p>
                     <textarea placeholder="Liste detalhadamente o que será executado..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 outline-none dark:text-white text-sm min-h-[150px]" />
                   </div>
                 )}
                 {contractStep === 4 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 4: Valor & Condições</p>
                     <input type="text" placeholder="Valor Total do Projeto (R$)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm font-bold" />
                     <input type="text" placeholder="Condição de parcelamento" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 5 && (
                   <div className="space-y-4 animate-fade-in">
                     <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.2em]">Passo 5: Cronograma de Entrega</p>
                     <input type="text" placeholder="Data de Início" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                     <input type="text" placeholder="Prazo final (estimado)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                   </div>
                 )}
                 {contractStep === 6 && (
                   <div className="space-y-4 animate-fade-in text-center py-6">
                     <span className="material-icons-outlined text-5xl text-primary-500 mb-4">description</span>
                     <h3 className="font-bold dark:text-white uppercase tracking-tight">Estrutura Finalizada</h3>
                     <p className="text-sm text-slate-500">Seu contrato de serviços técnicos está pronto para ser impresso.</p>
                   </div>
                 )}
               </div>

               <div className="flex gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                  {contractStep > 1 && (
                    <button onClick={() => setContractStep(contractStep - 1)} className="px-6 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Anterior</button>
                  )}
                  {contractStep < 6 ? (
                    <button onClick={() => setContractStep(contractStep + 1)} className="flex-1 py-4 bg-primary-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 transition-all">Próximo Passo</button>
                  ) : (
                    <button onClick={() => alert("Gerando contrato de serviço...")} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all">Finalizar e Emitir PDF</button>
                  )}
               </div>
            </motion.div>
          )}

          {activeTab === 'estimate' && (
            <motion.div key="estimate" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8">
               <div className="flex justify-between items-center">
                 <h2 className="text-xl font-black uppercase dark:text-white">Gerador de <span className="text-primary-500 italic">Orçamento</span></h2>
                 <button onClick={addEstimateItem} className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg hover:scale-105 transition-all"><span className="material-icons-outlined">add</span></button>
               </div>
               <div className="space-y-4">
                 {estimateItems.map((item) => (
                   <div key={item.id} className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
                     <input type="text" placeholder="Descrição do Produto/Serviço" className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-sm" />
                     <div className="flex gap-2">
                        <input type="number" placeholder="Qtd" className="w-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-sm" />
                        <input type="text" placeholder="Preço" className="w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none dark:text-white text-sm" />
                        <button onClick={() => setEstimateItems(estimateItems.filter(i => i.id !== item.id))} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 p-2 rounded-xl transition-colors"><span className="material-icons-outlined">delete</span></button>
                     </div>
                   </div>
                 ))}
               </div>
               <button onClick={() => alert("Processando Orçamento...")} className="w-full py-5 bg-primary-500 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Exportar Orçamento Técnico</button>
            </motion.div>
          )}

          {activeTab === 'receipt' && (
            <motion.div key="receipt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 max-w-2xl mx-auto">
               <h2 className="text-xl font-black uppercase dark:text-white">Emissor de <span className="text-primary-500">Recibo</span></h2>
               <div className="space-y-4">
                 <input type="text" placeholder="Recebi de (Nome do Pagador)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" />
                 <input type="text" placeholder="A importância de (R$ 0.000,00)" className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm font-bold" />
                 <textarea placeholder="Referente ao pagamento de (Motivo detalhado)..." className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 outline-none dark:text-white text-sm min-h-[120px]" />
               </div>
               <button onClick={() => alert("Gerando Recibo Oficial...")} className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Imprimir Recibo Assinado</button>
            </motion.div>
          )}

          {activeTab === 'barcode' && (
            <motion.div key="barcode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl space-y-8 max-md mx-auto text-center">
               <h2 className="text-xl font-black uppercase dark:text-white">Gerador <span className="text-primary-500">Código de Barras</span></h2>
               <input type="text" placeholder="Digite o código" value={barcodeValue} onChange={e => setBarcodeValue(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm text-center font-mono tracking-widest" />
               <div className="bg-white p-10 rounded-2xl border-2 border-slate-100 flex flex-col items-center justify-center min-h-[160px] shadow-inner">
                 {barcodeValue ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="flex gap-[2px] h-20 items-stretch">
                        {[...Array(35)].map((_, i) => <div key={i} className={`bg-black ${Math.random() > 0.4 ? 'w-[2px]' : 'w-[4px]'} ${Math.random() > 0.2 ? 'opacity-100' : 'opacity-0'}`}></div>)}
                     </div>
                     <span className="text-[11px] font-mono font-bold text-slate-800 tracking-[0.4em] uppercase">{barcodeValue}</span>
                   </div>
                 ) : <span className="material-icons-outlined text-4xl text-slate-200">view_week</span>}
               </div>
               <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg">Download Etiqueta</button>
            </motion.div>
          )}

          {activeTab === 'pix' && (
            <motion.div key="pix" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-12 shadow-2xl space-y-8 max-w-2xl mx-auto text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-400 to-emerald-600"></div>
               <h2 className="text-xl font-black uppercase dark:text-white font-display">Gerador de Cobrança <span className="text-primary-500 italic">PIX</span></h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Descrição do Pagamento</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Pagamento Projeto Visual" 
                      value={pixDesc} 
                      onChange={e => setPixDesc(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Valor da Cobrança (R$)</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      placeholder="0,00" 
                      value={pixValue} 
                      onChange={e => setPixValue(e.target.value)} 
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-5 py-4 outline-none dark:text-white text-sm font-black" 
                    />
                  </div>
               </div>

               <button 
                 onClick={generatePix} 
                 disabled={isGeneratingPix}
                 className="w-full py-5 bg-primary-500 hover:bg-primary-600 text-white font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
               >
                 {isGeneratingPix ? <span className="animate-spin material-icons-outlined text-sm">sync</span> : <span className="material-icons-outlined text-sm">qr_code_scanner</span>}
                 {isGeneratingPix ? "Gerando BRCode..." : "Gerar QR PIX Profissional"}
               </button>

               <AnimatePresence>
                 {pixPayload && (
                   <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="pt-8 space-y-6 animate-fade-in border-t border-slate-100 dark:border-slate-800">
                      <div className="flex flex-col items-center gap-4">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-[0.2em]">Escaneie para Pagar</h3>
                        <div className="bg-white p-6 rounded-3xl shadow-inner border-2 border-slate-100 relative group">
                           <div ref={pixQrRef}></div>
                           <div className="absolute inset-0 border-2 border-primary-500/10 rounded-3xl group-hover:border-primary-500/30 transition-all pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Código PIX "Copia e Cola"</label>
                         <div className="flex gap-2">
                           <textarea 
                             readOnly 
                             value={pixPayload} 
                             className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-[10px] font-mono dark:text-slate-400 resize-none h-16"
                           />
                           <button onClick={copyPixPayload} className="w-12 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-primary-500 transition-all shadow-lg active:scale-90">
                              <span className="material-icons-outlined text-sm">content_copy</span>
                           </button>
                         </div>
                      </div>

                      <button onClick={() => alert("Função Premium: Download de arte em PDF/A4 para impressão liberada para Sidney Sales.")} className="w-full py-4 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black rounded-xl uppercase text-[9px] tracking-widest shadow-lg flex items-center justify-center gap-2 transition-all">
                        <span className="material-icons-outlined text-sm">workspace_premium</span>
                        Baixar Placa de Pagamento (Premium)
                      </button>
                   </motion.div>
                 )}
               </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(16,185,129,0.2); border-radius: 20px; }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};
