import { useEffect, useState } from 'react';
import { resolveLocale, type Locale } from './copy';
export type Theme = 'system' | 'light' | 'dark';
export type Language = 'system' | Locale;
export function readPreference<T extends string>(key: string, values: readonly T[], fallback: T): T {
  try { const value = localStorage.getItem(key); return values.includes(value as T) ? value as T : fallback; } catch { return fallback; }
}
export function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* In-memory preferences remain usable. */ }
}
export function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => { const media = matchMedia(query); const update = () => setMatches(media.matches); update(); media.addEventListener('change', update); return () => media.removeEventListener('change', update); }, [query]);
  return matches;
}
export function usePreferences() {
  const [theme, setTheme] = useState<Theme>(() => readPreference('snkisk-site-theme-v1', ['system', 'light', 'dark'], 'system'));
  const [language, setLanguage] = useState<Language>(() => readPreference('snkisk-site-language-v1', ['system', 'ja', 'en'], 'system'));
  const [osLanguage, setOsLanguage] = useState(navigator.language);
  const dark = useMedia('(prefers-color-scheme: dark)');
  const resolvedTheme = theme === 'system' ? dark ? 'dark' : 'light' : theme;
  const locale = language === 'system' ? resolveLocale(osLanguage) : language;
  useEffect(() => { const update = () => setOsLanguage(navigator.language); window.addEventListener('languagechange', update); return () => window.removeEventListener('languagechange', update); }, []);
  useEffect(() => {
    const root = document.documentElement; const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    root.dataset.portfolioTheme = resolvedTheme; root.lang = locale; root.dir = 'ltr'; root.style.colorScheme = resolvedTheme;
    if (meta) meta.content = resolvedTheme === 'dark' ? '#171919' : '#efeee8';
    return () => { delete root.dataset.portfolioTheme; };
  }, [locale, resolvedTheme]);
  return { theme, setTheme, language, setLanguage, locale, resolvedTheme };
}
