
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard: React.FC<{
  title: string;
  price: string;
  desc: string;
  icon: string;
  type: string;
  features: (string | { text: string; color: string })[];
  color: string;
  btnColor?: string;
  btnLabel?: string;
  btnIcon?: string;
}> = ({ title, price, desc, icon, type, features, color, btnColor, btnLabel = "Gerar Agora", btnIcon = "rocket_launch" }) => (
  <div className="relative group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full overflow-hidden">
    <div className={`absolute -top-10 -right-10 w-32 h-32 ${color} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
    
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-secondary/20 ${color}`}>
        <span className="material-icons-outlined text-3xl">{icon}</span>
      </div>

      <h3 className="text-xl font-black mb-1 font-display uppercase tracking-tight leading-tight min-h-[50px]">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
        {desc}
      </p>

      <div className="mb-8">
        <div className="text-3xl font-black text-secondary tracking-tight">R$ {price}</div>
        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mt-1">Pagamento Único</div>
      </div>

      <ul className="space-y-3 mb-10 flex-1">
        {features.map((f, i) => (
          <li key={i} className={`flex items-center gap-2 text-xs font-medium ${typeof f === 'string' ? 'text-slate-600 dark:text-slate-400' : f.color}`}>
            <span className={`material-icons-outlined text-base ${typeof f === 'string' ? 'text-secondary' : 'opacity-70'}`}>check_circle</span>
            {typeof f === 'string' ? f : f.text}
          </li>
        ))}
      </ul>

      <Link 
        to={`/digital-card/order?type=${type}`} 
        className={`w-full py-4 rounded-2xl font-black text-center transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl ${
          btnColor ? btnColor : (color === 'bg-secondary' ? 'bg-secondary hover:bg-green-700 text-white shadow-secondary/20' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900')
        }`}
      >
        {btnLabel}
        <span className="material-icons-outlined text-sm">{btnIcon}</span>
      </Link>
    </div>
  </div>
);

const FAQItem: React.FC<{ question: string; answer: React.ReactNode }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/50 mb-4 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
      >
        <span className="font-bold text-slate-900 dark:text-white">{question}</span>
        <span className={`material-icons-outlined transition-all duration-300 text-2xl text-secondary font-black ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          {isOpen ? 'remove' : 'add'}
        </span>
      </button>
      <div className={`px-6 transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] py-6 opacity-100' : 'max-h-0 py-0 opacity-0 overflow-hidden'}`}>
        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-4">
          {answer}
        </div>
      </div>
    </div>
  );
};

export const DigitalCard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] font-body pb-20 overflow-hidden relative">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-20 flex flex-col lg:flex-row items-center gap-16 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10"></div>
        
        <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-[10px] font-black uppercase tracking-widest text-secondary mb-6">
              Networking do Futuro
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 font-display leading-[0.95] uppercase text-slate-900 dark:text-white">
              Conheça o <span className="text-secondary">DyCard</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto lg:ml-0">
              O cartão de visita inteligente que revoluciona a forma de fazer networking, o chaveiro com os dados do seu PET, Tecnologias NFC e QRCODE que conecta instantaneamente seus contatos e seu perfil digital. 
              <span className="block mt-4 text-primary-500 italic font-medium">
                ("Pare de gastar com cartões impressos que depois vão para o lixo")
              </span>
            </p>
          </div>
        </div>

        {/* Visual Product Showcase - Cards Side by Side (Clean Layout) */}
        <div className="lg:w-1/2 relative flex flex-row items-center justify-center gap-6 lg:gap-8 py-10 w-full overflow-visible">
          
          {/* Main Card View */}
          <div className="relative z-20 flex-1 max-w-[280px] md:max-w-[340px] aspect-[1.6/1] bg-slate-900 rounded-[1.5rem] shadow-2xl border border-white/10 overflow-hidden transition-all duration-700 p-6 md:p-8 flex flex-col justify-between group">
             <div className="engineering-grid absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"></div>
             
             {/* Card Top */}
             <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                   <span className="material-icons-outlined text-secondary text-2xl md:text-3xl">contactless</span>
                   <span className="text-[7px] md:text-[9px] font-bold text-secondary uppercase tracking-widest">NFC Ready</span>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-1.5 md:p-2 rounded-xl border border-white/10 group-hover:rotate-12 transition-transform">
                   <span className="material-icons-outlined text-white/80 text-xl md:text-2xl">qr_code_2</span>
                </div>
             </div>

             {/* Card Bottom */}
             <div className="relative z-10">
                <h4 className="text-lg md:text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1 drop-shadow-lg">Seu Nome Aqui</h4>
                <div className="flex items-center gap-2">
                   <div className="h-px w-6 md:w-8 bg-secondary"></div>
                   <p className="text-[7px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Identidade Visual Inteligente</p>
                </div>
             </div>
          </div>

          {/* Realistic Keychain View - Side by Side (Teardrop Shape) */}
          <div className="relative z-30 group shrink-0">
             {/* Realistic Ring and Connector */}
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-[3px] border-slate-300 dark:border-slate-600 shadow-md"></div>
             <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-[2px] border-slate-400 dark:border-slate-500 z-10 bg-white/5 backdrop-blur-sm"></div>
             
             {/* Teardrop Tag Body - Blue RFID Reference */}
             <div className="relative w-24 h-32 md:w-32 md:h-44 bg-[#1e40af] dark:bg-blue-700 rounded-b-[2.5rem] rounded-t-[1.5rem] md:rounded-b-[3.5rem] md:rounded-t-[2.5rem] shadow-2xl border-2 border-white/20 flex flex-col items-center justify-center overflow-hidden transition-transform duration-500 hover:rotate-6">
                
                {/* Hole cutout for the ring */}
                <div className="absolute top-5 md:top-6 w-5 h-3 md:w-6 md:h-4 bg-slate-950/30 rounded-full shadow-inner"></div>

                {/* Circular detail like the reference */}
                <div className="absolute top-14 md:top-20 w-16 h-16 md:w-24 md:h-24 rounded-full border-2 border-black/10 shadow-inner flex items-center justify-center bg-blue-600/30">
                    <div className="flex flex-col items-center">
                        <span className="material-icons-outlined text-white/90 text-2xl md:text-3xl">pets</span>
                        <div className="text-[6px] md:text-[8px] font-black uppercase text-white/60 tracking-tighter mt-1">DyCard PET</div>
                    </div>
                </div>

                {/* Bottom detail / Branding */}
                <div className="absolute bottom-4 md:bottom-6 flex flex-col items-center opacity-50">
                    <span className="material-icons-outlined text-white text-[10px] md:text-xs">contactless</span>
                </div>
                
                {/* Glossy Overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none"></div>
             </div>

             {/* Badge for PET */}
             <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-xl border border-slate-200 dark:border-slate-700 text-[8px] font-black uppercase tracking-widest text-secondary whitespace-nowrap">
                Aproximou, Conectou
             </div>
          </div>

          {/* Background decoration */}
          <div className="absolute -z-10 w-full h-full bg-primary-500/5 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Product Selection Grid */}
      <section className="max-w-[1440px] mx-auto px-8 py-24 border-t border-slate-100 dark:border-slate-800/50">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-slate-900 dark:text-white">Escolha seu modelo</h2>
          <p className="text-slate-500 text-sm">Soluções digitais e físicas para você ou seu negócio</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            title="DyCard Digital"
            price="19,99"
            type="digital"
            desc="Sua identidade digital completa e editável arquivo digital acessível para compartilhamento ou QR Code. Arquivo disponível para download após confirmação de pagamento."
            icon="smartphone"
            color="bg-slate-500"
            features={[
              'Link de Perfil Personalizado',
              'Gestão de Redes Sociais',
              'QR Code de Alta Resolução',
              'Edição de Dados Ilimitada',
              'Compartilhamento Imediato'
            ]}
          />
          <ProductCard 
            title="DyCard Chaveiro Físico rastreador GPS"
            price="29,99"
            type="gps-keychain"
            desc="Rastreio de objetos, do seu pet, curto alcance. Não configurável, apenas rastreamento."
            icon="gps_fixed"
            color="bg-blue-600"
            btnLabel="Comprar Agora"
            btnIcon="payments"
            btnColor="bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20"
            features={[
              'Chaveiro Físico com GPS',
              'Ideal para Identificação PET',
              'Ideal para Identificação de objetos',
              'Resistente à Água',
              'Perfil Digital Integrado',
              'Entrega ou Retirada',
              { text: 'Consultar prazo de entrega', color: 'text-red-500 font-bold' }
            ]}
          />
          <ProductCard 
            title="DyCard Chaveiro Físico NFC"
            price="39,99"
            type="keychain"
            desc="Compartilhe seus dados, ou do seu Dog onde vc estiver. O acessório inteligente que conecta você ao mundo."
            icon="token"
            color="bg-secondary"
            features={[
              'Chaveiro Físico com NFC',
              'Ideal para Identificação PET',
              'Resistente à Água',
              'Perfil Digital Integrado',
              'Entrega ou Retirada'
            ]}
          />
          <ProductCard 
            title="DyCard Cartão Físico NFC e QRcode"
            price="49,99"
            type="card"
            desc="O clássico cartão de visita reinventado. Acabamento premium com tecnologia de aproximação."
            icon="credit_card"
            color="bg-purple-600"
            btnColor="bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
            features={[
              'Cartão PVC Premium',
              'Tecnologia NFC Ativa',
              'Impressão em Alta Definição',
              'Perfil Digital Vitalício',
              'Opção de envio ou retirada em até 72hs'
            ]}
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-3xl mx-auto px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black mb-4 font-display text-secondary uppercase">Dúvidas Frequentes</h2>
        </div>
        
        <div className="space-y-2">
          <FAQItem 
            question="O cartão é recarregável ou tem mensalidade?" 
            answer={<p>Não! O Cartão DyCard Fisico tem um pagamento único. Uma vez adquirido, seus dados sociais, e seu perfil digital ficam armazenados no seu cartão e ele é vitalício e você não paga mensalidades para manter seus dados ativos. <br/><br/>No caso do cartão DyCard Digital, você apenas terá o cartão em version impressa em formato Pdf ou Png para usá-lo apenas digitalmente.</p>} 
          />
          <FAQItem 
            question="Como funciona a retirada pessoalmente?" 
            answer={<p>Após finalizar o cadastro e a confirmação do pagamento, você receberá o endereço do nosso Studio para retirada. O produto tem um prazo máximo de 72h úteis, porém costuma ficar pronto em até 48h úteis para itens físicos. <br/><br/>Em formato digital fica pronto na mesma hora após a confirmação do pagamento.</p>} 
          />
          <FAQItem 
            question="O chaveiro PET realmente funciona?" 
            answer={<p>Sim! É a forma mais moderna de proteger seu melhor amigo. Quem encontrar seu pet perdido só precisa aproximar o celular do chaveiro para ver seu telefone, endereço e informações importantes que você cadastrou no ato da geração do chaveiro , importante, colocar informações atualizadas no cadastro.</p>} 
          />
          <FAQItem 
            question="Posso fazer a aquisição dos três Cartão DyCard Digital, cartão físico e chaveiro?" 
            answer={<p>Sim, pode, desde que sejam cadastradas as informações separadamente, pois serão processados separados pelo nosso sistema.</p>} 
          />
          <FAQItem 
            question="O que é NFC e qual modelo é mais adequado para sua aplicação?" 
            answer={
              <div className="space-y-6">
                <p>NFC é uma tecnologia de transferência sem fio de curto alcance. No mercado existem chips como <strong>NTAG213, NTAG215 ou NTAG216</strong>. Descubra qual é o chip ideal para seu projeto!</p>
                <p>Os chips da série NTAG21x da NXP são a referência em tecnologia NFC. But qual escolher? A resposta está no equilíbrio entre memória, custo e aplicação.</p>
                
                <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
                  <h4 className="font-black uppercase text-secondary text-xs mb-3 flex items-center gap-2">
                    <span className="material-icons-outlined text-sm">speed</span>
                    Comparação em 5 segundos:
                  </h4>
                  <ul className="space-y-3">
                    <li><strong className="text-secondary">• NTAG213:</strong> Econômico e eficiente. Ideal para campanhas de marketing, URLs curtas e aplicações simples.</li>
                    <li><strong className="text-secondary">• NTAG215:</strong> O favorito dos gamers! Compatível com Amiibo, perfeito para V-Cards e dados médios.</li>
                    <li><strong className="text-secondary">• NTAG216:</strong> Máxima capacidade de armazenamento. Se você precisa guardar mais informações, como cartões de visita completos, este é o chip certo.</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <h4 className="font-black uppercase text-secondary text-xs mb-3">Por que escolher NTAG?</h4>
                    <ul className="space-y-1 text-xs">
                      <li className="flex items-center gap-2"><span className="material-icons-outlined text-[10px]">done</span> Compatibilidade universal com NFC</li>
                      <li className="flex items-center gap-2"><span className="material-icons-outlined text-[10px]">done</span> Segurança avançada (senha 32-bit)</li>
                      <li className="flex items-center gap-2"><span className="material-icons-outlined text-[10px]">done</span> Alta durabilidade: 100k ciclos</li>
                      <li className="flex items-center gap-2"><span className="material-icons-outlined text-[10px]">done</span> Retenção de dados por 10 anos</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-black uppercase text-secondary text-xs mb-3">Aplicações que vendem:</h4>
                    <ul className="grid grid-cols-1 gap-1 text-[11px] font-bold uppercase">
                      <li>• Marketing interativo</li>
                      <li>• Vouchers promocionais</li>
                      <li>• Identificação de PETs</li>
                      <li>• Cartões inteligentes</li>
                      <li>• Experiências gamificadas</li>
                    </ul>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                  <p className="font-bold italic text-slate-900 dark:text-white">Agora que você já conhece, faça a escolha certa agora mesmo!</p>
                  <p className="text-xs text-slate-500 mt-1">Selecione o chip que combina com seu projeto e leve sua solução em Networking para o próximo nível.</p>
                </div>
              </div>
            } 
          />
        </div>
      </section>
    </div>
  );
};
