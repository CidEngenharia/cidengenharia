import React from 'react';
import { NavLink, Link } from 'react-router-dom';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  isSpecial?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isSpecial }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `
      flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200 group/link
      ${isActive 
        ? (isSpecial ? 'bg-purple-500/20 text-purple-400' : 'bg-primary-500/20 text-primary-400') 
        : (isSpecial ? 'text-purple-400/50 hover:bg-purple-500/10 hover:text-purple-400' : 'text-slate-400 hover:bg-slate-500/10 hover:text-primary-400')}
    `}
  >
    <span className="material-icons-outlined text-2xl">{icon}</span>
    {label && (
      <span className="whitespace-nowrap font-black text-[7px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-5px] group-hover:translate-x-0">
        {label}
      </span>
    )}
  </NavLink>
);

export const Sidebar: React.FC = () => {
  return (
    <aside className="group fixed left-0 top-0 h-screen w-20 hover:w-60 z-50 bg-white/30 dark:bg-black/20 backdrop-blur-3xl border-r border-slate-200/30 dark:border-white/5 transition-all duration-500 flex flex-col justify-between overflow-hidden shadow-2xl">
      <div className="h-28 flex items-center px-4">
        <Link to="/" className="flex items-center gap-3 min-w-max">
          <div className="w-12 h-12 flex items-center justify-center transition-transform duration-700 group-hover:rotate-[360deg]">
             <span className="material-icons-outlined text-3xl text-primary-500">engineering</span>
          </div>
          <div className="flex flex-col opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="text-base font-black tracking-tight whitespace-nowrap leading-none text-slate-800 dark:text-slate-100">
              CidEngenharia
            </span>
            <span className="text-[7px] text-primary-500 mt-1 leading-none uppercase tracking-[0.3em] font-bold">
              Sidney Sales
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-2 px-3 py-4">
        <NavItem to="/" icon="home" label="Início" />
        <NavItem to="/services" icon="edit_note" label="Serviços" />
        <NavItem to="/generators" icon="auto_stories" label="Geradores" />
        <NavItem to="/quote" icon="request_quote" label="Orçamento" />
        <NavItem to="/digital-card" icon="qr_code_2" label="Cartão" />
        <NavItem to="/portfolio" icon="layers" label="Portfólio" />
        <NavItem to="/customers" icon="groups" label="Clientes" />
        <NavItem to="/shop" icon="apps" label="Apps" />
        <NavItem to="/virtual-engineer" icon="psychology" label="Eng. Virtual" />
        <div className="mt-auto border-t border-slate-200/50 dark:border-white/5 pt-4">
          <NavItem to="/admin" icon="lock" label="Painel" isSpecial={true} />
        </div>
      </nav>
    </aside>
  );
};