import { useCallback, useEffect, useState } from 'react';
import PortfolioHome from './components/PortfolioHome';
import PortfolioIntro from './components/motion-led/PortfolioIntro';
import { copy } from './components/motion-led/copy';
import { usePreferences, useMedia, savePreference, type Theme, type Language } from './components/motion-led/preferences';
import styles from './App.module.css';

const SHORTCUT_DESTINATIONS: Record<string, string> = {
  '/h': 'https://hensyoku-mate.snkisk.com/',
  '/mc': 'https://mc.snkisk.com/',
  '/m': 'https://lmp.snkisk.com/',
  '/l': 'https://lmp.snkisk.com/',
  '/g': 'https://go.snkisk.com/',
  '/hpt': 'https://go.snkisk.com/a',
  '/hptrf': 'https://forms.gle/rZqAtEQAfm6ojmaY9',
  '/hf': 'https://hensyoku-mate.snkisk.com/contact/',
};

function PortfolioSite() {
  const preferences = usePreferences();
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const [showHome, setShowHome] = useState(reduced);
  const [pauseSignal, setPauseSignal] = useState(0);
  const pause = () => setPauseSignal(value => value + 1);
  const onHome = useCallback(() => setShowHome(true), []);
  const onReplay = useCallback(() => setShowHome(false), []);
  const text = copy[preferences.locale];
  useEffect(() => {
    document.documentElement.dataset.siteStage = showHome ? 'home' : 'reel';
    document.body.dataset.siteStage = showHome ? 'home' : 'reel';
    return () => { delete document.documentElement.dataset.siteStage; delete document.body.dataset.siteStage; };
  }, [showHome]);
  return <main className={styles.site} data-theme={preferences.resolvedTheme} data-view={showHome ? 'home' : 'film'} aria-label={text.overview}>
    <PortfolioIntro text={text} locale={preferences.locale} reduced={reduced} pauseSignal={pauseSignal} onHome={onHome} onReplay={onReplay} homeVisible={showHome}>
      <div className={styles.preferences} onFocusCapture={pause}>
        <label>{text.theme}<select value={preferences.theme} onChange={event => { const value = event.target.value as Theme; preferences.setTheme(value); savePreference('snkisk-site-theme-v1', value); }}><option value="system">{text.system}</option><option value="light">{text.light}</option><option value="dark">{text.dark}</option></select></label>
        <label>{text.language}<select value={preferences.language} onChange={event => { const value = event.target.value as Language; preferences.setLanguage(value); savePreference('snkisk-site-language-v1', value); }}><option value="system">{text.system}</option><option value="ja">日本語</option><option value="en">English</option></select></label>
      </div>
    </PortfolioIntro>
    <div className={styles.homeFrame} hidden={!showHome} onFocusCapture={pause}><PortfolioHome locale={preferences.locale}/></div>
  </main>;
}
export default function App() {
  const destination = SHORTCUT_DESTINATIONS[window.location.pathname];
  useEffect(() => { if (destination) window.location.replace(destination); }, [destination]);
  return destination ? null : <PortfolioSite />;
}
