import React, { createContext, useContext } from 'react';
import { Lang, translations } from './i18n';

export type TranslationType = (typeof translations)[Lang];

interface LangContextType {
  lang: Lang;
  t: TranslationType;
}

export const LangContext = createContext<LangContextType>({
  lang: 'PT',
  t: translations['PT'],
});

export const useLang = () => useContext(LangContext);
