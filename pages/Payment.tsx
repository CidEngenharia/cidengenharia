import React, { useEffect, useState } from 'react';
// Force redeploy - 2026-02-23
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderSummary {
  item: string;
  price: number;
  type: string;
  buyButtonId?: string;
  qrCode?: string;
}

type PaymentStatus = 'selection' | 'processing' | 'completed';

export const Payment: React.FC = () => {
  const location = useLocation();
  const [status, setStatus] = useState<PaymentStatus>('selection');
  const [order, setOrder] = useState<OrderSummary>({ item: 'Produto DyCard', price: 0, type: '' });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const itemType = params.get('type') || 'digital';

    const prices: Record<string, { label: string, val: number, buyButtonId: string, qrCode: string }> = {
      'digital': {
        label: 'DyCard Digital "Arquivo Digital"',
        val: 19.99,
        buyButtonId: 'buy_btn_1T3hEC3FKB6XMKTEYXxxbH8k',
        qrCode: '/stripe_qr_code_19.png'
      },
      'gps-keychain': {
        label: 'Chaveiro Físico GPS',
        val: 29.99,
        buyButtonId: 'buy_btn_1T3hMD3FKB6XMKTERIDEWqpR',
        qrCode: '/stripe_qr_code_29.png'
      },
      'keychain': {
        label: 'Chaveiro Físico NFC',
        val: 39.99,
        buyButtonId: 'buy_btn_1T3hTU3FKB6XMKTEkZtOy5uZ',
        qrCode: '/stripe_qr_code_39.png'
      },
      'card': {
        label: 'Cartão Físico NFC + QR',
        val: 49.99,
        buyButtonId: 'buy_btn_1T3heI3FKB6XMKTE6k5w3IVJ',
        qrCode: '/stripe_qr_code_49.png'
      },
      'generator_download': {
        label: 'Download de Documento IA',
        val: 9.99,
        buyButtonId: 'buy_btn_1T3hEC3FKB6XMKTEYXxxbH8k',
        qrCode: '/stripe_qr_code_19.png'
      }
    };

    const currentItem = params.get('item') === 'generator_download' ? 'generator_download' : itemType;
    const info = prices[currentItem] || prices['digital'];

    setOrder({
      item: info.label,
      price: info.val,
      type: currentItem,
      buyButtonId: info.buyButtonId,
      qrCode: info.qrCode
    });
  }, [location]);

  const handleStripeRedirect = () => {
    // Redireciona para o link direto se disponível no objeto info, 
    // ou reconstrói o link do Stripe se necessário.
    const productLinks: Record<string, string> = {
      '49.99': 'https://buy.stripe.com/14A14g5GD5Fae9YdOGf3a06',
      '39.99': 'https://buy.stripe.com/9B66oA8SP0kQc1Q6mef3a05',
      '29.99': 'https://buy.stripe.com/cNi9AMed97Nife29yqf3a04',
      '19.99': 'https://buy.stripe.com/fZu14g8SP7Ni6Hw6mef3a03'
    };

    const directLink = productLinks[order.price.toFixed(2)] || productLinks['49.99'];
    window.location.href = directLink;
  };

  const confirmPixPayment = () => {
    setStatus('processing');
    // Manual verification simulation
    setTimeout(() => {
      setStatus('completed');
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] flex flex-col items-center justify-center p-6 md:p-8 transition-colors duration-500 overflow-hidden relative">
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-slate-200 dark:border-slate-800 flex items-center px-8 justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-[100] transition-colors">
        <div className="flex items-center gap-4 text-sm">
          <Link to="/digital-card/order" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-lg">arrow_back</span>
            Voltar
          </Link>
          <span className="text-slate-300 dark:text-slate-700">|</span>
          <Link to="/" className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            <span className="material-icons-outlined text-lg">home</span>
            Início
          </Link>
        </div>
        <div className="text-[10px] font-black uppercase tracking-widest text-[#635BFF]">Checkout Seguro Stripe</div>
      </nav>
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
              <h2 className="text-3xl font-black font-display uppercase dark:text-white leading-none">Resumo do <br /><span className="text-primary-500">Investimento</span></h2>
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
          </div>
        </div>

        {/* Lado Direito: Interface de Pagamento Dinâmica */}
        <div className="bg-slate-900 dark:bg-slate-950 rounded-[3rem] p-10 border border-white/5 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="engineering-grid absolute inset-0 opacity-10"></div>

          <AnimatePresence mode="wait">
            {status === 'selection' && (
              <motion.div key="options" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 z-10">
                <div className="text-center mb-8">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Pagamento Seguro via Stripe</span>
                </div>

                <div className="flex flex-col items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10">
                  {/* @ts-ignore */}
                  <stripe-buy-button
                    key={order.buyButtonId}
                    buy-button-id={order.buyButtonId}
                    publishable-key="pk_live_51T17SS3FKB6XMKTEBZSjXN61qXREmQA7KOyZe6vtEeFgTClqhpV5zgOZ66NiFA7o3WpJ3Kl8PBVYVjWLN7gfvCRT00rtaMcEow"
                  >
                    {/* @ts-ignore */}
                  </stripe-buy-button>

                  {order.price > 19.99 && (
                    <div className="mt-4 flex flex-col items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="material-icons-outlined text-sm">qr_code_2</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#635BFF]">Ou escaneie para pagar</span>
                      </div>
                      <img src={order.qrCode || '/stripe_qr_code_49.png'} className="h-48 rounded-2xl shadow-2xl border border-white/10" alt="Stripe QR Code" />
                    </div>
                  )}
                </div>

                <div className="pt-6 text-center">
                  {/* Cancelar removido pois agora temos o nav no topo */}
                </div>
              </motion.div>
            )}

            {/* Removed status === 'pix_qr' block */}

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
    </div >
  );
};