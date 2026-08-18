import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';

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

const FlagBR = () => (
  <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-sm shadow-sm inline-block">
    <g fillRule="evenodd" strokeWidth="1pt">
      <path fill="#009b3a" d="M0 0h640v480H0z" />
      <path fill="#fedf00" d="M320 44.5L53.7 240 320 435.5 586.3 240 320 44.5z" />
      <circle cx="320" cy="240" r="102" fill="#002776" />
      <path fill="#fff" d="M218.4 233s33.7-22 101.6-22c67.3 0 101.6 22 101.6 22l-.1 4.5s-34-22-101.5-22c-67.4 0-101.6 22-101.6 22z" />
    </g>
  </svg>
);

const FlagUS = () => (
  <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-sm shadow-sm inline-block">
    <path fill="#bd3d44" d="M0 0h640v480H0z" />
    <path stroke="#fff" strokeWidth="37" d="M0 55.4h640m0 73.8H0m0 73.9h640m0 73.8H0m0 73.9h640m0 73.8H0" />
    <path fill="#192f5d" d="M0 0h256v221.5H0z" />
    <circle cx="128" cy="110" r="60" fill="#fff" opacity="0.8" />
  </svg>
);

const FlagES = () => (
  <svg viewBox="0 0 640 480" className="w-4 h-3 rounded-sm shadow-sm inline-block">
    <path fill="#c60b1e" d="M0 0h640v480H0z" />
    <path fill="#ffc400" d="M0 120h640v240H0z" />
    <circle cx="150" cy="240" r="40" fill="#c60b1e" opacity="0.8" />
  </svg>
);

interface TopBarProps {
  isDark: boolean;
  onToggleDark: () => void;
  lang: 'PT' | 'EN' | 'ES';
  onChangeLang: (l: 'PT' | 'EN' | 'ES') => void;
  onMenuOpen?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ isDark, onToggleDark, lang, onChangeLang, onMenuOpen }) => {
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="w-full pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 md:px-24 flex items-center justify-between">
        <div className="pointer-events-auto flex items-center gap-3">
          {onMenuOpen && (
            <button
              onClick={onMenuOpen}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-[#171717] text-slate-200 shadow-md shadow-black/20 border border-white/10 transition-all active:scale-95"
              title="Abrir menu"
            >
              <MenuPanelIcon />
            </button>
          )}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-violet-600/10 to-indigo-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <img
                src="/infinito-logo.png"
                className="h-12 w-12 object-contain relative transition-transform duration-500 group-hover:scale-110"
                alt="CidEngenharia Logo"
              />
            </div>
            <div className="flex items-center">
              <span className="text-[15px] text-violet-400 leading-none hidden sm:block font-semibold">CidEngenharia</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 pointer-events-auto">
          <div className="hidden xl:flex items-center gap-5 mr-4">
            <span className="text-[9px] uppercase tracking-widest text-emerald-500 mr-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">Siga-nos</span>
            <div className="flex items-center gap-5">
              <a href="https://instagram.com/cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#E4405F] transition-all transform hover:scale-125">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m8.4 1.5a1 1 0 0 1 1 1 1 1 0 0 1-1 1 1 1 0 0 1-1-1 1 1 0 0 1 1-1M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>
              </a>
              <a href="https://linkedin.com/in/sidneysales" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0A66C2] transition-all transform hover:scale-125">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" /></svg>
              </a>
              <a href="https://youtube.com/@cidengenharia" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#FF0000] transition-all transform hover:scale-125">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" /></svg>
              </a>
            </div>
          </div>

          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="h-10 flex items-center gap-1.5 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 hover:text-violet-500 dark:hover:text-violet-400 transition-all active:scale-95 text-xs"
            >
              <span className="flex-shrink-0 flex items-center">
                {lang === 'PT' ? <FlagBR /> : lang === 'EN' ? <FlagUS /> : <FlagES />}
              </span>
              {lang}
              <svg className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl overflow-hidden z-50">
                {(['PT', 'EN', 'ES'] as const).map((l) => (
                  <button
                    key={l}
                    onClick={() => { onChangeLang(l); setLangOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs transition-colors ${
                      lang === l
                        ? 'bg-violet-500/10 text-violet-500'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="flex-shrink-0">
                      {l === 'PT' ? <FlagBR /> : l === 'EN' ? <FlagUS /> : <FlagES />}
                    </span>
                    {l === 'PT' ? 'Português' : l === 'EN' ? 'English' : 'Español'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin"
            className="h-10 flex items-center gap-2 px-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:text-violet-500 dark:hover:text-violet-400 transition-all active:scale-95"
          >
            <span className="material-icons-outlined text-base">lock</span>
            <span className="text-[10px] tracking-widest uppercase">Admin</span>
          </Link>

          <ThemeToggle isDark={isDark} toggle={onToggleDark} />
        </div>
      </div>
    </div>
  );
};
