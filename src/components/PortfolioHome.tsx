import { motion, useReducedMotion } from 'motion/react';
import styles from './PortfolioHome.module.css';

const PROJECTS = [
  ['GO', 'go.snkisk.com', 'ONE LINK / MANY WAYS'],
  ['LP', 'MirrorProxy / Legitils', 'LIVE MATCH SIGNAL'],
  ['MC', 'mc.snkisk.com', 'MINECRAFT PRODUCTION'],
  ['HM', '偏食メイト', 'YOUR PALETTE / IN PROGRESS'],
];

export default function PortfolioHome() {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <main className={styles.home} aria-label="snkisk portfolio home">
      <div className={styles.glow} aria-hidden="true" />
      <motion.header
        className={styles.header}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -28, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.18 : 0.58, ease: [0.18, 0.89, 0.32, 1] }}
      >
        <span className={styles.wordmark}>snkisk</span>
        <span className={styles.status}>SELECTED WORK / 2026</span>
      </motion.header>

      <section className={styles.intro} aria-labelledby="home-title">
        <motion.p
          initial={{ opacity: 0, x: reduceMotion ? 0 : -22 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.48, delay: reduceMotion ? 0 : 0.16, ease: 'easeOut' }}
        >
          SHOWREEL COMPLETE / NOW BROWSING
        </motion.p>
        <motion.h1
          id="home-title"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 48, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: reduceMotion ? 0.2 : 0.74, delay: reduceMotion ? 0.04 : 0.24, ease: [0.22, 1, 0.36, 1] }}
        >
          MADE TO<br />MOVE.
        </motion.h1>
      </section>

      <section className={styles.projectGrid} aria-label="Projects">
        {PROJECTS.map(([code, name, detail], index) => (
          <motion.article
            className={styles.project}
            key={code}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: reduceMotion ? 0.16 : 0.46, delay: reduceMotion ? index * 0.04 : 0.48 + index * 0.09, ease: [0.18, 0.89, 0.32, 1] }}
          >
            <span className={styles.projectCode}>{code}</span>
            <div>
              <h2>{name}</h2>
              <p>{detail}</p>
            </div>
            <span className={styles.projectArrow}>↗</span>
          </motion.article>
        ))}
      </section>

      <motion.footer
        className={styles.footer}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.48, delay: reduceMotion ? 0.12 : 0.96 }}
      >
        <span>PORTFOLIO / STAY IN MOTION</span>
        <span>snkisk.com</span>
      </motion.footer>
    </main>
  );
}
