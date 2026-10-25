import { useEffect, useRef, useState } from 'react';
import { copy, resolveLocale, type Locale } from './copy';
import styles from './MotionPreview.module.css';

type Theme = 'system' | 'light' | 'dark';
type Language = 'system' | Locale;
const DURATION = 6000;
const THEME_KEY = 'snkisk-motion-theme';
const LANGUAGE_KEY = 'snkisk-motion-language';
function preference<T extends string>(key: string, options: readonly T[], fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return options.includes(value as T) ? value as T : fallback;
  } catch { return fallback; }
}
function savePreference(key: string, value: string) {
  try { localStorage.setItem(key, value); } catch { /* In-memory selection still works. */ }
}
function useMedia(query: string) {
  const [matches, setMatches] = useState(() => matchMedia(query).matches);
  useEffect(() => {
    const media = matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, [query]);
  return matches;
}
const smooth = (value: number) => { const t = Math.max(0, Math.min(1, value)); return t * t * (3 - 2 * t); };
const phase = (time: number, start: number, end: number) => smooth((time - start) / (end - start));

export default function MotionPreview() {
  const [theme, setTheme] = useState<Theme>(() => preference(THEME_KEY, ['system', 'light', 'dark'], 'system'));
  const [language, setLanguage] = useState<Language>(() => preference(LANGUAGE_KEY, ['system', 'ja', 'en'], 'system'));
  const [osLanguage, setOsLanguage] = useState(navigator.language);
  const systemDark = useMedia('(prefers-color-scheme: dark)');
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)');
  const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;
  const locale = language === 'system' ? resolveLocale(osLanguage) : language;
  const text = copy[locale];
  const [elapsed, setElapsed] = useState(0);
  const clock = useRef(0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const finished = elapsed >= DURATION;
  const directory = useRef<HTMLHeadingElement>(null);
  const focusPause = () => setPaused(true);

  useEffect(() => {
    const update = () => setOsLanguage(navigator.language);
    window.addEventListener('languagechange', update);
    return () => window.removeEventListener('languagechange', update);
  }, []);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    const pageHide = () => setHidden(true);
    window.addEventListener('pagehide', pageHide);
    window.addEventListener('pageshow', visibility);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('pagehide', pageHide);
      window.removeEventListener('pageshow', visibility);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    // Stop permanently when motion reduction is enabled; no surprise restart if it is disabled.
    if (reduceMotion) { clock.current = DURATION; setElapsed(DURATION); }
  }, [reduceMotion]);
  useEffect(() => {
    if (paused || hidden || reduceMotion || finished) return;
    let frame = 0;
    let previous: number | null = null;
    const tick = (now: number) => {
      if (previous !== null) clock.current = Math.min(DURATION, clock.current + now - previous);
      previous = now;
      setElapsed(clock.current);
      if (clock.current < DURATION) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, hidden, reduceMotion, finished]);
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    const original = { lang: html.lang, dir: html.dir, scheme: html.style.colorScheme, color: meta?.content };
    html.dataset.siteStage = 'home';
    body.dataset.siteStage = 'home';
    html.dataset.motionPreview = resolvedTheme;
    html.style.colorScheme = resolvedTheme;
    html.lang = locale;
    html.dir = 'ltr';
    if (meta) meta.content = resolvedTheme === 'dark' ? '#181821' : '#f7f4ef';
    return () => {
      delete html.dataset.siteStage;
      delete body.dataset.siteStage;
      delete html.dataset.motionPreview;
      html.lang = original.lang;
      html.dir = original.dir;
      html.style.colorScheme = original.scheme;
      if (meta && original.color) meta.content = original.color;
    };
  }, [locale, resolvedTheme]);

  const travel = phase(elapsed, 200, 2100);
  const fold = phase(elapsed, 2100, 3700);
  const observe = phase(elapsed, 3700, 5100);
  const x = (160 + travel * 590) * (1 - fold) + 500 * fold;
  const y = 290 - Math.sin(fold * Math.PI) * 75;
  const size = 24 + fold * 72 - observe * 72;
  const radius = size / 2 * (1 - Math.sin(observe * Math.PI) * 0.72);
  const outgoing = 1 - phase(elapsed, 2200, 3100);
  const incoming = phase(elapsed, 3200, 4300);
  const status = reduceMotion ? text.reduced : finished ? text.ended : paused || hidden ? text.paused : text.running;
  const skip = () => {
    clock.current = DURATION;
    setElapsed(DURATION);
    setPaused(true);
    directory.current?.focus();
  };
  const play = () => {
    if (reduceMotion) return;
    if (finished) { clock.current = 0; setElapsed(0); setPaused(false); }
    else setPaused((value) => !value);
  };

  return (
    <main className={styles.page} data-theme={resolvedTheme} data-elapsed={Math.round(elapsed)} data-playback={reduceMotion ? 'reduced' : finished ? 'finished' : paused || hidden ? 'paused' : 'playing'}>
      <header className={styles.header}>
        <a href="/" className={styles.brand}>snkisk</a>
        <div className={styles.preferences}>
          <label>{text.theme}<select value={theme} onChange={(event) => { const value = event.target.value as Theme; setTheme(value); savePreference(THEME_KEY, value); }}><option value="system">{text.system}</option><option value="light">{text.light}</option><option value="dark">{text.dark}</option></select></label>
          <label>{text.language}<select value={language} onChange={(event) => { const value = event.target.value as Language; setLanguage(value); savePreference(LANGUAGE_KEY, value); }}><option value="system">{text.system}</option><option value="ja">日本語</option><option value="en">English</option></select></label>
        </div>
      </header>
      <section className={styles.study} aria-labelledby="motion-title">
        <p className={styles.kicker}>{text.preview}</p>
        <h1 id="motion-title">{text.title}</h1>
        <div className={styles.controls}>
          <button type="button" aria-disabled={reduceMotion || undefined} onClick={play}>{reduceMotion ? text.staticView : finished ? text.replay : paused || hidden ? text.resume : text.pause}</button>
          <button type="button" onClick={skip}>{text.skip}<span aria-hidden="true">↓</span></button>
          <span className={styles.status} role="status">{status}</span>
        </div>
        <div className={styles.stage} hidden={reduceMotion}>
          <svg viewBox="0 0 1000 460" aria-hidden="true" focusable="false">
            <g opacity={outgoing} transform={`translate(0 ${-fold * 24})`}>
              <text x="110" y="155" className={styles.display}>Go.</text>
            </g>
            <g opacity={incoming} transform={`translate(0 ${(1 - incoming) * 24})`}>
              <text x="110" y="155" className={styles.display}>Legitils.</text>
            </g>
            <path d={`M 160 290 L ${x} ${y}`} className={styles.route} opacity={1 - fold} />
            <g opacity={observe} transform="translate(500 290)">
              <circle r={50 + observe * 14} className={styles.orbit} />
              <circle r={96 + observe * 18} className={styles.orbit} />
              <path d="M -150 0 H -30 M 30 0 H 150 M 0 -100 V -30 M 0 30 V 100" className={styles.orbit} />
            </g>
            <rect data-carrier="true" x={-size / 2} y={-size / 2} width={size} height={size} rx={radius} className={styles.carrier} transform={`translate(${x} ${y}) rotate(${fold * 90 + observe * 90})`} />
            <g opacity={outgoing}><text x="110" y="420" className={styles.caption}>go.snkisk.com</text></g>
            <g opacity={incoming}><text x="110" y="420" className={styles.caption}>lmp.snkisk.com</text></g>
          </svg>
        </div>

      </section>
      <section className={styles.directory} aria-labelledby="project-index" onFocusCapture={focusPause}>
        <h2 ref={directory} id="project-index" tabIndex={-1}>{text.directory}</h2>
        <ul>
          <li><a href="https://go.snkisk.com/"><span>{text.go}</span><span>go.snkisk.com ↗</span></a></li>
          <li><a href="https://lmp.snkisk.com/"><span>{text.legitils}</span><span>lmp.snkisk.com ↗</span></a></li>
          <li><a href="https://mc.snkisk.com/"><span>{text.minecraft}</span><span>mc.snkisk.com ↗</span></a></li>
          <li><a href="https://hensyoku-mate.snkisk.com/"><span>{text.hensyoku}</span><span>hensyoku-mate.snkisk.com ↗</span></a></li>
        </ul>
        <a href="/" className={styles.siteLink}>{text.site}<span aria-hidden="true">↗</span></a>
      </section>
    </main>
  );
}
