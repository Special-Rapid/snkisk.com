import { useEffect, useRef, useState } from 'react';
import { DURATION, pose } from './timeline';
import { projectMedia, screens } from './media';
import type { SiteCopy } from './copy';
import styles from './PortfolioIntro.module.css';

export default function PortfolioIntro({ text, reduced, pauseSignal }: { text: SiteCopy; reduced: boolean; pauseSignal: number }) {
  const [elapsed, setElapsed] = useState(() => reduced ? DURATION : 0);
  const time = useRef(reduced ? DURATION : 0);
  const [paused, setPaused] = useState(false);
  const [hidden, setHidden] = useState(document.hidden);
  const finished = elapsed >= DURATION;
  const frame = pose(reduced ? DURATION : elapsed);
  const names = ['Go / Link Shortener', 'Legitils', 'Minecraft Production', text.hensyokuName];
  const roles = [text.goRole, text.legitilsRole, text.minecraftRole, text.hensyokuRole];
  const urls = ['https://go.snkisk.com/', 'https://lmp.snkisk.com/', 'https://mc.snkisk.com/', 'https://hensyoku-mate.snkisk.com/'];
  const chapters = ['go', 'legitils', 'minecraft', 'hensyoku'];
  useEffect(() => { if (pauseSignal > 0) setPaused(true); }, [pauseSignal]);
  useEffect(() => {
    if (reduced) { time.current = DURATION; setElapsed(DURATION); }
  }, [reduced]);
  useEffect(() => {
    const visibility = () => setHidden(document.hidden);
    const hide = () => setHidden(true);
    document.addEventListener('visibilitychange', visibility); window.addEventListener('pagehide', hide); window.addEventListener('pageshow', visibility);
    return () => { document.removeEventListener('visibilitychange', visibility); window.removeEventListener('pagehide', hide); window.removeEventListener('pageshow', visibility); };
  }, []);
  useEffect(() => {
    if (paused || hidden || reduced || finished) return;
    let request = 0; let previous: number | undefined;
    const tick = (now: number) => {
      if (previous !== undefined) time.current = Math.min(DURATION, time.current + now - previous);
      previous = now; setElapsed(time.current);
      if (time.current < DURATION) request = requestAnimationFrame(tick);
    };
    request = requestAnimationFrame(tick); return () => cancelAnimationFrame(request);
  }, [paused, hidden, reduced, finished]);
  // Focus in stable navigation latches pause; blur never restarts moving content.
  const pauseForNavigation = () => setPaused(true);
  const skip = () => {
    time.current = DURATION; setElapsed(DURATION); setPaused(true);
    const target = document.getElementById('projects'); target?.scrollIntoView({ behavior: 'instant' }); target?.focus({ preventScroll: true });
  };
  const play = () => {
    if (reduced) return;
    if (finished) { time.current = 0; setElapsed(0); setPaused(false); }
    else setPaused(value => !value);
  };
  const status = reduced ? text.reduced : finished ? text.ended : paused || hidden ? text.paused : text.running;
  return <section id="top" className={styles.intro} aria-labelledby="intro-title" data-elapsed={Math.round(elapsed)} data-chapter={frame.chapter} data-playback={reduced ? 'reduced' : finished ? 'finished' : paused || hidden ? 'paused' : 'playing'}>
    <div className={styles.heading}>
      <p className={styles.eyebrow}>{text.selected}</p>
      <h1 id="intro-title">BEYOND<br />THE FRAME<span className={styles.period}>.</span></h1>
      <p className={styles.tagline}>{text.tagline}</p>
    </div>
    <div className={styles.showcase}>
      <div className={styles.mediaStack} aria-hidden="true">
        {projectMedia.map((src, index) => <div key={src} className={styles.media} data-visible={frame.chapter === index && !reduced} style={{ opacity: frame.chapter === index && !reduced ? frame.opacity : 0, transform: `translateY(${frame.chapter === index ? frame.offset : 0}px)` }}><img src={src} alt="" decoding="async" /></div>)}
        <div className={`${styles.media} ${styles.screens}`} data-visible={frame.chapter === 3 || reduced} style={{ opacity: frame.chapter === 3 || reduced ? frame.opacity : 0, transform: `translateY(${frame.chapter === 3 ? frame.offset : 0}px)` }}>{screens.map(src => <img key={src} src={src} alt="" decoding="async" />)}</div>
      </div>
      <div className={styles.caption}>
        <span className={styles.ordinal} aria-hidden="true">0{frame.chapter + 1} / 04</span>
        <div className={styles.captionText} style={{ opacity: frame.opacity }}>
          <h2>{names[frame.chapter]}</h2><p>{roles[frame.chapter]}</p>
        </div>
      </div>
      <div className={styles.track} aria-hidden="true"><span className={styles.carrier} style={{ left: `${frame.carrier}%` }} /></div>
    </div>
    <div className={styles.controls}>
      {!reduced && <button type="button" onClick={play}>{finished ? text.replay : paused || hidden ? text.resume : text.pause}</button>}
      <button type="button" onClick={skip}>{text.skip} <span aria-hidden="true">↓</span></button>
      <span role="status" className={styles.status}>{status}</span>
    </div>
    <nav className={styles.projectNav} aria-label={text.index} onFocusCapture={pauseForNavigation}>
      {names.map((name, index) => <a href={`#${chapters[index]}-title`} key={urls[index]} onClick={pauseForNavigation}><span className={styles.navNumber} aria-hidden="true">0{index + 1}</span><span>{name}</span><span aria-hidden="true">↘</span></a>)}
    </nav>
  </section>;
}
