import React from 'react';
import { NavLink, Link } from 'react-router-dom';

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
  return (
    <aside className={`fixed left-0 top-0 h-screen z-50 bg-white/30 dark:bg-[#020617]/40 backdrop-blur-3xl border-r border-slate-200/30 dark:border-white/5 transition-all duration-500 flex flex-col overflow-hidden shadow-2xl ${isOpen ? 'w-64' : 'w-20'
      }`}>
      <div className="h-20 flex items-center justify-between px-4 mt-2">
        <div className={`transition-all duration-500 overflow-hidden ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
          <Link to="/" className="flex items-center gap-3 min-w-max">
            <div className="w-10 h-10 flex items-center justify-center">
              <span className="material-icons-outlined text-2xl text-primary-500">engineering</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight whitespace-nowrap leading-none text-slate-800 dark:text-slate-100">
                CidEngenharia
              </span>
              <span className="text-[9px] text-primary-500 mt-1 leading-none font-bold">
                360° Vision
              </span>
            </div>
          </Link>
        </div>

        <button
          onClick={onToggle}
          className={`p-2 rounded-lg hover:bg-slate-500/10 text-slate-400 hover:text-primary-400 transition-all active:scale-95 ${!isOpen ? 'mx-auto' : ''}`}
          title={isOpen ? "Fechar menu" : "Abrir menu"}
        >
          <span className="material-icons-outlined text-2xl">
            {isOpen ? 'meeting_room' : 'sensor_door'}
          </span>
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-3 py-4 mt-4">
        <NavItem to="/" icon="home" label="Início" isOpen={isOpen} />
        <NavItem to="/services" icon="edit_note" label="Serviços" isOpen={isOpen} />
        <NavItem to="/generators" icon="auto_stories" label="Geradores" isOpen={isOpen} />
        <NavItem to="/quote" icon="request_quote" label="Orçamento" isOpen={isOpen} />
        <NavItem to="/digital-card" icon="qr_code_2" label="Cartão" isOpen={isOpen} />
        <NavItem to="/portfolio" icon="layers" label="Portfólio" isOpen={isOpen} />
        <NavItem to="/customers" icon="groups" label="Clientes" isOpen={isOpen} />
        <NavItem to="/shop" icon="apps" label="Apps" isOpen={isOpen} />
      </nav>

      <div className="p-4 border-t border-slate-200/30 dark:border-white/5">
        <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div className="w-8 h-8 rounded-full bg-primary-500/20 flex items-center justify-center text-primary-500 font-bold text-xs">
            SF
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Sidney França</span>
            <span className="text-[10px] text-slate-500">Premium Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
};