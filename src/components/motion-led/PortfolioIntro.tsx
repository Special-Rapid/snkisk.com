import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { DURATION, HOME_AT, pose } from './timeline';
import type { Locale, SiteCopy } from './copy';
import FilmArt from './FilmArt';
import styles from './PortfolioIntro.module.css';

export default function PortfolioIntro({ text, locale, reduced, pauseSignal, onHome, onReplay, homeVisible, children }: {
  text: SiteCopy; locale: Locale; reduced: boolean; pauseSignal: number; onHome: () => void;
  onReplay: () => void; homeVisible: boolean; children: ReactNode;
}) {
  const [elapsed, setElapsed] = useState(() => reduced ? DURATION : 0);
  const time = useRef(reduced ? DURATION : 0);
  const [paused, setPaused] = useState(false), [hidden, setHidden] = useState(document.hidden);
  const [height, setHeight] = useState(620);
  const viewport = useRef<HTMLDivElement>(null), completion = useRef(false), skipFocus = useRef(false);
  const finished = elapsed >= DURATION;
  const frame = pose(elapsed, height);
  useEffect(() => {
    const node = viewport.current; if (!node) return;
    const measure = () => { const rect = node.getBoundingClientRect(); if (rect.width > 0 && rect.height > 0) setHeight(1000 * rect.height / rect.width); };
    measure(); const observer = new ResizeObserver(measure); observer.observe(node); return () => observer.disconnect();
  }, []);
  useEffect(() => { if (pauseSignal > 0) setPaused(true); }, [pauseSignal]);
  useEffect(() => { if (reduced) { time.current = DURATION; setElapsed(DURATION); } }, [reduced]);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden), hide = () => setHidden(true);
    document.addEventListener('visibilitychange', visibility); window.addEventListener('pagehide', hide); window.addEventListener('pageshow', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', hide); window.removeEventListener('pageshow', visibility); };
  }, []);
  useEffect(() => {
    if (paused || hidden || reduced || finished) return;
    let request = 0, previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) time.current = Math.min(DURATION, time.current + now - previous);
      previous = now; setElapsed(time.current);
      if (time.current < DURATION) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick); return () => cancelAnimationFrame(request);
  }, [paused, hidden, reduced, finished]);
  useEffect(() => {
    if (elapsed >= HOME_AT && !completion.current) { completion.current = true; onHome(); }
  }, [elapsed, onHome]);
  useEffect(() => {
    if (homeVisible && skipFocus.current) { skipFocus.current = false; const target = document.getElementById('projects'); target?.scrollIntoView({ behavior: 'instant' }); target?.focus({ preventScroll: true }); }
  }, [homeVisible]);
  const skip = () => {
    skipFocus.current = true; time.current = DURATION; setElapsed(DURATION); setPaused(true);
    if (homeVisible) { skipFocus.current = false; const target = document.getElementById('projects'); target?.scrollIntoView({ behavior: 'instant' }); target?.focus({ preventScroll: true }); }
  };
  const play = () => {
    if (reduced) return;
    if (finished) { completion.current = false; time.current = 0; setElapsed(0); setPaused(false); onReplay(); }
    else setPaused(value => !value);
  };
  const status = reduced ? text.reduced : finished ? text.ended : paused || hidden ? text.paused : text.running;
  return <section className={styles.player} data-home={homeVisible} data-elapsed={Math.round(elapsed)} data-playback={reduced ? 'reduced' : finished ? 'finished' : paused || hidden ? 'paused' : 'playing'} aria-label={text.film}>
    <div ref={viewport} className={styles.viewport} hidden={homeVisible}>
      <h1 className={styles.srOnly}>{text.film}</h1>
      <FilmArt time={elapsed} height={height} locale={locale}/>
    </div>
    <div className={styles.transport}>
      <div className={styles.playbackControls}>
        {!reduced && <button type="button" className={styles.iconButton} onClick={play} aria-label={finished ? text.replay : paused || hidden ? text.resume : text.pause} title={finished ? text.replay : paused || hidden ? text.resume : text.pause}>
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">
            {finished ? <path d="M5 9a7 7 0 1 1 1 7M5 5v4h4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/> : paused || hidden ? <path d="M8 4v16l12-8z" fill="currentColor"/> : <path d="M6 4h4v16H6zm8 0h4v16h-4z" fill="currentColor"/>}
          </svg>
        </button>}
        <button type="button" onClick={skip} aria-label={text.skipAction}>{text.skipShort} <span aria-hidden="true">↓</span></button>
        <span role="status" className={styles.srOnly}>{status}</span>
      </div>
      <details className={styles.projects} hidden={!homeVisible} onFocusCapture={() => setPaused(true)} onToggle={event => { if (event.currentTarget.open) setPaused(true); }}>
        <summary>{text.menu} <span aria-hidden="true">⌄</span></summary>
        <div className={styles.panel}>
          <nav aria-label={text.index}>
            <a href="https://go.snkisk.com/" target="_blank" rel="noreferrer">Go / Link Shortener ↗</a>
            <a href="https://lmp.snkisk.com/" target="_blank" rel="noreferrer">Legitils ↗</a>
            <a href="https://mc.snkisk.com/" target="_blank" rel="noreferrer">Minecraft Production ↗</a>
            <a href="https://hensyoku-mate.snkisk.com/" target="_blank" rel="noreferrer">{text.hensyokuName} ↗</a>
          </nav>
          {children}
        </div>
      </details>
    </div>
    {frame.time >= 16000 && elapsed < DURATION && !reduced && <div data-handoff-plane="true" className={styles.handoff} aria-hidden="true" style={{ clipPath: elapsed < HOME_AT ? `inset(${(1-frame.handoffCover)*100}% 0 0 0)` : `inset(0 0 ${frame.handoffReveal*100}% 0)` }}/>}
  </section>;
}
