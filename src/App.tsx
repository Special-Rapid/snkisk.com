import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import HeroMotion from './components/HeroMotion';
import PortfolioSequence from './components/PortfolioSequence';
import styles from './App.module.css';

export default function App() {
  const [showReel, setShowReel] = useState(false);

  return (
    <div className={styles.stage}>
      <AnimatePresence mode="wait" initial={false}>
        {showReel ? (
          <motion.div
            className={styles.frame}
            key="project-showreel"
            initial={{ opacity: 0, scale: 1.12, y: 72 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.18, 0.89, 0.32, 1.08] }}
          >
            <PortfolioSequence />
          </motion.div>
        ) : (
          <motion.div
            className={styles.frame}
            key="opening-intro"
            exit={{ opacity: 0, scale: 0.86, y: -68 }}
            transition={{ duration: 0.42, ease: [0.18, 0.89, 0.32, 1.08] }}
          >
            <HeroMotion onIntroComplete={() => setShowReel(true)} />
          </motion.div>
        )}
      </AnimatePresence>
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
