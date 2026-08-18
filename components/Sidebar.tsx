import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const MenuPanelIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="4.5" y="5" width="6" height="14" rx="2" />
    <rect x="13.5" y="5" width="6" height="14" rx="2" />
  </svg>
);

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isSpecial?: boolean;
  isOpen: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isSpecial, isOpen }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group/link
      ${isActive
        ? (isSpecial ? 'bg-purple-500/20 text-purple-400' : 'bg-primary-500/20 text-primary-400')
        : (isSpecial ? 'text-purple-400/50 hover:bg-purple-500/10 hover:text-purple-400' : 'text-slate-400 hover:bg-slate-500/10 hover:text-primary-400')}
    `}
  >
    <span className="material-icons-outlined text-2xl min-w-[24px]">{icon}</span>
    <span className={`whitespace-nowrap font-bold text-xs tracking-tight transition-all duration-300 overflow-hidden ${isOpen ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 translate-x-[-10px]'
      }`}>
      {label}
    </span>
  </NavLink>
);

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const isSimplifiedMenu = location.pathname === '/cidvisual' || location.pathname === '/cidmanutencao';

  return (
    <aside className={`fixed left-0 top-0 h-screen z-50 bg-white dark:bg-[#06070a]/60 backdrop-blur-3xl border-r border-slate-200 dark:border-white/5 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl ${
      isOpen ? 'w-64 translate-x-0' : 'w-0 md:w-20 -translate-x-full md:translate-x-0 opacity-0 md:opacity-100'
      }`}>
      {/* Header: hamburger + "Menu" label */}
      <div className="h-20 flex items-center px-4 mt-2">
        <button
          onClick={onToggle}
          className={`flex items-center gap-3 p-2 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-primary-400 transition-all active:scale-95 w-full ${!isOpen ? 'justify-center' : ''}`}
          title={isOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[#171717] text-slate-200 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
            <MenuPanelIcon />
          </span>

          {/* "Menu" label — visible only when sidebar is open */}
          <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 overflow-hidden ${isOpen ? 'opacity-100 w-auto translate-x-0' : 'opacity-0 w-0 -translate-x-2'}`}>
            Menu
          </span>
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 mt-4">
        <NavItem to="/" icon="home" label="Início" isOpen={isOpen} />
        {!isSimplifiedMenu && (
          <>
            <NavItem to="/services" icon="edit_note" label="Serviços" isOpen={isOpen} />
            <NavItem to="/generators" icon="auto_stories" label="Geradores" isOpen={isOpen} />
            <NavItem to="/quote" icon="request_quote" label="Orçamento" isOpen={isOpen} />
            <NavItem to="/digital-card" icon="qr_code_2" label="Cartão" isOpen={isOpen} />
            <NavItem to="/portfolio" icon="code" label="Portfólio" isOpen={isOpen} />
            <NavItem to="/customers" icon="groups" label="Clientes" isOpen={isOpen} />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-200/30 dark:border-white/5 opacity-40">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 font-bold text-[10px] tracking-tighter">
            CE
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Plataforma</span>
            <span className="text-[9px] text-slate-500">v2.4.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
