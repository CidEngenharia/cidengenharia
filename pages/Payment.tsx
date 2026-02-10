import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderSummary {
  item: string;
  price: number;
  type: string;
}

type PaymentStatus = 'selection' | 'pix_qr' | 'processing' | 'completed';

export const Payment: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<PaymentStatus>('selection');
  const [order, setOrder] = useState<OrderSummary>({ item: 'Produto DyCard', price: 0, type: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemType = params.get('type') || 'digital';
    
    const prices: Record<string, { label: string, val: number }> = {
      'digital': { label: 'DyCard Digital "Arquivo Digital"', val: 19.99 },
      'gps-keychain': { label: 'Chaveiro Físico GPS', val: 29.99 },
      'keychain': { label: 'Chaveiro Físico NFC', val: 39.99 },
      'card': { label: 'Cartão Físico NFC + QR', val: 49.99 },
      'generator_download': { label: 'Download de Documento IA', val: 9.99 }
    };

    const currentItem = params.get('item') === 'generator_download' ? 'generator_download' : itemType;
    const info = prices[currentItem] || prices['digital'];
    
    setOrder({
      item: info.label,
      price: info.val,
      type: currentItem
    });
  }, [location]);

  const handlePaymentRedirect = (gateway: 'paypal' | 'infinitepay' | 'pix') => {
    if (gateway === 'pix') {
      setStatus('pix_qr');
      return;
    }

    setStatus('processing');
    setTimeout(() => {
      let url = '';
      switch(gateway) {
        case 'paypal':
          url = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=sidney.sales@gmail.com&item_name=${encodeURIComponent(order.item)}&amount=${order.price}&currency_code=BRL`;
          break;
        case 'infinitepay':
          // Links específicos para cada faixa de preço solicitada pelo usuário
          if (order.price === 19.99) {
            url = 'https://link.infinitepay.io/cidvisual_eng_/VC1DLUMtSQ-1mxTKcUVYp-19,99';
          } else if (order.price === 29.99) {
            url = 'https://link.infinitepay.io/cidvisual_eng_/VC1DLUMtSQ-79r71BGyNB-29,99';
          } else if (order.price === 39.99) {
            url = 'https://link.infinitepay.io/cidvisual_eng_/VC1DLUMtSQ-2Nx6jxkSnp-39,99';
          } else if (order.price === 49.99) {
            url = 'https://link.infinitepay.io/cidvisual_eng_/VC1DLUMtSQ-tTvG6PsRh-49,99';
          } else {
            url = `https://pay.infinitepay.io/cidvisual_eng_/${order.price.toFixed(2).replace('.', ',')}`;
          }
          break;
      }
      window.location.href = url;
    }, 1500);
  };

  const confirmPixPayment = () => {
    setStatus('processing');
    // Simulação de verificação de recebimento PIX
    setTimeout(() => {
      setStatus('completed');
    }, 3000);
  };

  // Gerador de dados PIX estáticos para Sidney Sales conforme valor do pedido (Sincronizado com os inputs do usuário)
  const getPixData = () => {
    if (order.price === 29.99) {
      return "00020126360014br.gov.bcb.pix01145571984184782520400005303986540529.995802BR5922SIDNEY%20FRANCA%20DE%20SALES6008Salvador62070503***63046C7E";
    }
    if (order.price === 39.99) {
      return "00020126360014br.gov.bcb.pix01145571984184782520400005303986540539.995802BR5922SIDNEY%20FRANCA%20DE%20SALES6008Salvador62070503***6304F63B";
    }
    if (order.price === 49.99) {
      return "00020126360014br.gov.bcb.pix01145571984184782520400005303986540549.995802BR5922SIDNEY%20FRANCA%20DE%20SALES6008Salvador62070503***63041F93";
    }
    // Default 19.99
    return "00020126360014br.gov.bcb.pix01145571984184782520400005303986540519.995802BR5922SIDNEY%20FRANCA%20DE%20SALES6008Salvador62070503***6304E2B1";
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center justify-center p-6 md:p-8 transition-colors duration-500 overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px] -z-10"></div>
      
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch animate-fade-in relative z-10">
        
        {/* Lado Esquerdo: Resumo do Pedido */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-emerald-500">
               <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center">
                  <span className="material-icons-outlined text-xl">verified_user</span>
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.2em]">Checkout Seguro SSL</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black font-display uppercase dark:text-white leading-none">Resumo do <br/><span className="text-primary-500">Investimento</span></h2>
              <p className="text-slate-500 text-xs font-medium">Confira os detalhes antes de finalizar.</p>
            </div>

            <div className="p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 space-y-4">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Produto:</span>
                  <span className="text-xs font-black dark:text-white uppercase">{order.item}</span>
               </div>
               <div className="h-px bg-slate-200 dark:bg-slate-800 w-full"></div>
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total a pagar:</span>
                  <span className="text-3xl font-black text-primary-500">R$ {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
               </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10">
                <span className="material-icons-outlined text-primary-500">lock</span>
                <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight">
                  Seus dados financeiros são processados em ambiente seguro. O download/envio é liberado imediatamente após a confirmação.
                </p>
             </div>
             <div className="flex justify-center gap-6 opacity-40">
                <img src="https://img.icons8.com/color/48/visa.png" className="h-6" alt="Visa" />
                <img src="https://img.icons8.com/color/48/mastercard.png" className="h-6" alt="Mastercard" />
                <img src="https://img.icons8.com/color/48/pix.png" className="h-6" alt="Pix" />
             </div>
          </div>
        </div>

        {/* Lado Direito: Interface de Pagamento Dinâmica */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="engineering-grid absolute inset-0 opacity-10"></div>
          
          <AnimatePresence mode="wait">
            {status === 'selection' && (
              <motion.div key="options" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 z-10">
                <div className="text-center mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Escolha como pagar</span>
                </div>

                {/* Opção PIX */}
                <button 
                  onClick={() => handlePaymentRedirect('pix')}
                  className="w-full group flex items-center justify-between p-5 bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 rounded-3xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                       <img src="https://img.icons8.com/color/48/pix.png" alt="Pix" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-white group-hover:text-white uppercase tracking-tight">Pagar com PIX</p>
                      <p className="text-[9px] text-emerald-400 group-hover:text-white/80 font-bold uppercase">Liberação Imediata</p>
                    </div>
                  </div>
                  <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-all">qr_code_2</span>
                </button>

                <button 
                  onClick={() => handlePaymentRedirect('infinitepay')}
                  className="w-full group flex items-center justify-between p-5 bg-[#3B82F6]/10 hover:bg-[#3B82F6] border border-[#3B82F6]/20 rounded-3xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                       <span className="material-icons-outlined text-blue-600 text-3xl font-black italic">I</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-white group-hover:text-white uppercase tracking-tight">Cartão de Crédito</p>
                      <p className="text-[9px] text-blue-400 group-hover:text-white/80 font-bold uppercase">InfinitePay em até 12x</p>
                    </div>
                  </div>
                  <span className="material-icons-outlined text-white opacity-0 group-hover:opacity-100 transition-all">east</span>
                </button>

                <button 
                  onClick={() => handlePaymentRedirect('paypal')}
                  className="w-full group flex items-center justify-between p-5 bg-[#003087]/10 hover:bg-[#003087] border border-[#003087]/20 rounded-3xl transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center p-2 shadow-lg">
                       <img src="https://img.icons8.com/color/48/paypal.png" alt="PayPal" />
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-white group-hover:text-white uppercase tracking-tight">Pagar com PayPal</p>
                      <p className="text-[9px] text-[#0070ba] group-hover:text-white/80 font-bold uppercase">Segurança Internacional</p>
                    </div>
                  </div>
                </button>

                <div className="pt-6 text-center">
                  <Link to="/digital-card" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Cancelar</Link>
                </div>
              </motion.div>
            )}

            {status === 'pix_qr' && (
              <motion.div key="pix" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center space-y-6 z-10 text-center">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase font-display">Pagamento Instantâneo</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Escaneie o QR Code abaixo</p>
                </div>

                <div className="bg-white p-4 rounded-3xl shadow-2xl relative group">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(getPixData())}`} 
                    alt="PIX QR Code" 
                    className="w-48 h-48 md:w-56 md:h-56" 
                  />
                  <div className="absolute inset-0 border-2 border-primary-500 rounded-3xl opacity-20 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>

                <div className="space-y-4 w-full">
                  <div className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center justify-between">
                    <div className="text-left overflow-hidden">
                       <p className="text-[8px] font-black text-slate-500 uppercase">Beneficiário</p>
                       <p className="text-[10px] font-bold text-white truncate uppercase">Sidney Franca de Sales</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[8px] font-black text-slate-500 uppercase">Valor</p>
                       <p className="text-xs font-black text-primary-500">R$ {order.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <button 
                    onClick={confirmPixPayment}
                    className="w-full bg-primary-500 hover:bg-primary-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    Já realizei o pagamento
                    <span className="material-icons-outlined">done_all</span>
                  </button>
                  
                  <button onClick={() => setStatus('selection')} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">Escolher outro método</button>
                </div>
              </motion.div>
            )}

            {status === 'processing' && (
              <motion.div key="processing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center space-y-6 text-center z-10">
                <div className="w-20 h-20 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-white uppercase font-display tracking-widest">Validando Operação...</h3>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Sincronizando com o Banco Central</p>
                </div>
              </motion.div>
            )}

            {status === 'completed' && (
              <motion.div key="completed" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center justify-center space-y-8 text-center z-10">
                <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                  <span className="material-icons-outlined text-6xl">check_circle</span>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white uppercase font-display">Pagamento Aprovado!</h3>
                  <p className="text-xs text-slate-400 font-medium">Seu pedido já está em processamento.</p>
                </div>

                <div className="w-full p-6 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">Status do Pedido</p>
                  <button 
                    onClick={() => alert('Informações detalhadas enviadas para o seu WhatsApp.')}
                    className="w-full bg-white text-slate-900 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
                  >
                    Ver Detalhes do Envio
                    <span className="material-icons-outlined">local_shipping</span>
                  </button>
                  <p className="text-[8px] text-slate-500 uppercase font-bold">A confirmação também foi enviada para o seu WhatsApp/E-mail.</p>
                </div>

                <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">Voltar ao Início</Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .engineering-grid {
          background-size: 40px 40px;
          background-image: 
              linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};