import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import HeroMotion from './components/HeroMotion';
import PortfolioHome from './components/PortfolioHome';
import PortfolioSequence from './components/PortfolioSequence';
import styles from './App.module.css';

type Stage = 'intro' | 'reel' | 'closing' | 'home';

type SiteHandoffProps = {
  phase: 'cover' | 'reveal';
  reduceMotion: boolean;
  onCovered: () => void;
};

function SiteHandoff({ phase, reduceMotion, onCovered }: SiteHandoffProps) {
  const isCover = phase === 'cover';

  useEffect(() => {
    if (!isCover) {
      return;
    }

    // Switch only after the final slat has fully covered the outgoing Hensyoku Mate frame.
    const timeoutId = window.setTimeout(onCovered, reduceMotion ? 190 : 760);
    return () => window.clearTimeout(timeoutId);
  }, [isCover, onCovered, reduceMotion]);

  return (
    <motion.div
      className={styles.siteHandoff}
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={isCover ? { opacity: 1 } : reduceMotion ? { opacity: [1, 0] } : { opacity: [1, 1, 0] }}
      transition={{ duration: isCover ? (reduceMotion ? 0.18 : 0.58) : (reduceMotion ? 0.22 : 1.74), times: isCover ? undefined : reduceMotion ? undefined : [0, 0.86, 1], ease: [0.18, 0.89, 0.32, 1] }}
    >
      {/* The warm finale closes first, then opens onto the portfolio rather than fading between pages. */}
      {[
        styles.siteHandoffCream,
        styles.siteHandoffOrange,
        styles.siteHandoffBlue,
      ].map((color, index) => (
        <motion.i
          className={`${styles.siteHandoffSlat} ${color}`}
          key={color}
          initial={reduceMotion ? { opacity: 1 } : { scaleY: isCover ? 0 : 1, y: 0 }}
          animate={
            reduceMotion
              ? { opacity: isCover ? 1 : 0 }
              : isCover
                ? { scaleY: 1, y: 0 }
                : { scaleY: [1, 1, 0], y: [0, 0, index === 1 ? '66%' : '-66%'] }
          }
          transition={{
            duration: reduceMotion ? 0.18 : isCover ? 0.54 + index * 0.06 : 1.08 + index * 0.08,
            delay: reduceMotion ? 0 : isCover ? index * 0.045 : 0,
            times: reduceMotion || isCover ? undefined : [0, 0.5 + index * 0.04, 1],
            ease: [0.18, 0.89, 0.32, 1],
          }}
        />
      ))}
    </motion.div>
  );
}

export default function App() {
  const [stage, setStage] = useState<Stage>('intro');
  const reduceMotion = Boolean(useReducedMotion());
  const showReel = stage === 'reel';
  const showClosingReel = stage === 'closing';
  const showHome = stage === 'home';
  const handleIntroComplete = useCallback(() => setStage('reel'), []);
  const handleReelComplete = useCallback(() => setStage('closing'), []);
  const handleHandoffCovered = useCallback(() => setStage('home'), []);

  return (
    <div className={styles.stage}>
      <AnimatePresence mode="sync" initial={false}>
        {showHome ? (
          <motion.div
            className={styles.frame}
            key="portfolio-home"
            initial={{ clipPath: 'inset(100% 0 0 0)', opacity: 0.4 }}
            animate={{ clipPath: 'inset(0% 0 0 0)', opacity: 1 }}
            transition={{ duration: 0.86, ease: [0.18, 0.89, 0.32, 1] }}
          >
            <PortfolioHome />
          </motion.div>
        ) : showReel || showClosingReel ? (
          <motion.div
            className={styles.frame}
            key="project-showreel"
            initial={{ opacity: 0, scale: 1.12, y: 72 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.18, 0.89, 0.32, 1.08] }}
          >
            <PortfolioSequence onComplete={handleReelComplete} />
          </motion.div>
        ) : (
          <motion.div
            className={styles.frame}
            key="opening-intro"
            exit={{ opacity: 0, scale: 0.86, y: -68 }}
            transition={{ duration: 0.42, ease: [0.18, 0.89, 0.32, 1.08] }}
          >
            <HeroMotion onIntroComplete={handleIntroComplete} />
          </motion.div>
        )}
      </AnimatePresence>
      {showClosingReel ? (
        <SiteHandoff phase="cover" reduceMotion={reduceMotion} onCovered={handleHandoffCovered} />
      ) : showHome ? (
        <SiteHandoff phase="reveal" reduceMotion={reduceMotion} onCovered={handleHandoffCovered} />
      ) : null}
      {showReel ? (
        <motion.div
          className={styles.handoffOverlay}
          aria-hidden="true"
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 1, 0] }}
          transition={{ duration: 1.02, times: [0, 0.48, 1], ease: [0.18, 0.89, 0.32, 1.08] }}
        >
          {/* The first cut is a deliberate full-frame send-off, not a soft page transition. */}
          <motion.i
            className={`${styles.handoffSlat} ${styles.handoffSlatCyan}`}
            initial={{ scaleY: 1, y: 0 }}
            animate={{ scaleY: [1, 1, 0], y: [0, 0, '-64%'] }}
            transition={{ duration: 0.96, times: [0, 0.42, 1], ease: [0.18, 0.89, 0.32, 1.08] }}
          />
          <motion.i
            className={`${styles.handoffSlat} ${styles.handoffSlatViolet}`}
            initial={{ scaleY: 1, y: 0 }}
            animate={{ scaleY: [1, 1, 0], y: [0, 0, '64%'] }}
            transition={{ duration: 1.02, times: [0, 0.47, 1], ease: [0.18, 0.89, 0.32, 1.08] }}
          />
          <motion.i
            className={`${styles.handoffSlat} ${styles.handoffSlatOrange}`}
            initial={{ scaleY: 1, y: 0 }}
            animate={{ scaleY: [1, 1, 0], y: [0, 0, '-68%'] }}
            transition={{ duration: 1.08, times: [0, 0.52, 1], ease: [0.18, 0.89, 0.32, 1.08] }}
          />
        </motion.div>
      ) : null}
    </div>
  );
}
