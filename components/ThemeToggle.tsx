
import React from 'react';

interface ThemeToggleProps {
  isDark: boolean;
  toggle: () => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDark, toggle }) => (
  <button
    onClick={toggle}
    className="w-10 h-10 rounded-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-md shadow-md border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 transition-all active:scale-95"
  >
    <span className="material-icons-outlined">
      {isDark ? 'light_mode' : 'dark_mode'}
    </span>
  </button>
);
