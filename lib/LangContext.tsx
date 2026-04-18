import React, { createContext, useContext } from 'react';
import { Lang, translations } from './i18n';

interface LangContextType {
  lang: Lang;
  t: typeof translations['PT'];
}

export const LangContext = createContext<LangContextType>({
  lang: 'PT',
  t: translations['PT'],
});

export const useLang = () => useContext(LangContext);
