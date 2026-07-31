import { motion } from 'motion/react';
import styles from './FloatingGrid.module.css';
import type { SceneDefinition } from './HeroMotion';

type FloatingGridProps = {
  scene: SceneDefinition;
  sceneKey: string;
  reduceMotion: boolean;
};

function SceneTwoChips({
  chips,
  sceneKey,
  reduceMotion,
}: {
  chips: string[];
  sceneKey: string;
  reduceMotion: boolean;
}) {
  const placements = [styles.chipLeft, styles.chipCenter, styles.chipRight];

  return (
    <div className={styles.objectZone}>
      {chips.map((chip, index) => (
        <motion.div
          key={`${sceneKey}-${chip}`}
          className={`${styles.chip} ${placements[index] ?? ''}`}
          initial={{ opacity: 0, y: 24, scale: 0.86, filter: 'blur(10px)' }}
          animate={
            reduceMotion
              ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
              : { opacity: [0, 1, 1], y: [24, -4, 0], scale: [0.86, 1.06, 1], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'] }
          }
          transition={{
            duration: reduceMotion ? 0.18 : 0.42,
            delay: reduceMotion ? 0.04 + index * 0.04 : 0.12 + index * 0.12,
            ease: [0.18, 0.89, 0.32, 1.18],
          }}
        >
          {chip}
        </motion.div>
      ))}
    </div>
  );
}

function SceneFiveBroadcast({
  fragments,
  sceneKey,
  reduceMotion,
}: {
  fragments: string[];
  sceneKey: string;
  reduceMotion: boolean;
}) {
  const [fps, next, live, digits] = fragments;

  return (
    <div className={`${styles.objectZone} ${styles.broadcastZone}`}>
      <motion.div
        key={`live-${sceneKey}`}
        className={`${styles.broadcastLabel} ${styles.liveLabel}`}
        initial={{ opacity: 0, x: -22, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: 'easeOut' }}
      >
        {live}
      </motion.div>

      <motion.div
        key={`fps-${sceneKey}`}
        className={`${styles.broadcastLabel} ${styles.fpsLabel}`}
        initial={{ opacity: 0, y: 18, scale: 0.86, filter: 'blur(10px)' }}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: [0, 1, 1], y: [18, -3, 0], scale: [0.86, 1.04, 1], filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'] }
        }
        transition={{ duration: reduceMotion ? 0.18 : 0.34, delay: reduceMotion ? 0.04 : 0.08, ease: 'easeOut' }}
      >
        {fps}
      </motion.div>

      <motion.div
        key={`next-${sceneKey}`}
        className={`${styles.broadcastLabel} ${styles.nextLabel}`}
        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.18 : 0.3, delay: reduceMotion ? 0.04 : 0.14, ease: 'easeOut' }}
      >
        {next}
      </motion.div>

      <motion.div
        key={`digits-${sceneKey}`}
        className={styles.broadcastDigits}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 0.92, y: 0 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.28, delay: reduceMotion ? 0.06 : 0.2, ease: 'easeOut' }}
      >
        {digits}
      </motion.div>

      <motion.div
        key={`arrow-${sceneKey}`}
        className={styles.broadcastArrow}
        initial={{ opacity: 0, scaleX: 0.24 }}
        animate={{ opacity: 0.94, scaleX: 1 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.34, delay: reduceMotion ? 0.06 : 0.24, ease: 'easeOut' }}
      />

      <motion.div
        key={`ring-${sceneKey}`}
        className={styles.broadcastRing}
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 0.78, scale: 1 }}
        transition={{ duration: reduceMotion ? 0.18 : 0.32, delay: reduceMotion ? 0.08 : 0.18, ease: 'easeOut' }}
      />
    </div>
  );
}

function SceneSixFooter({ label, sceneKey, reduceMotion }: { label: string; sceneKey: string; reduceMotion: boolean }) {
  return (
    <motion.div
      key={`footer-${sceneKey}`}
      className={styles.footerTag}
      initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
      animate={{ opacity: 0.84, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: reduceMotion ? 0.16 : 0.28, delay: reduceMotion ? 0.02 : 0.14, ease: 'easeOut' }}
    >
      {label}
    </motion.div>
  );
}

export default function FloatingGrid({ scene, sceneKey, reduceMotion }: FloatingGridProps) {
  return (
    <motion.div
      className={styles.root}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduceMotion ? 0.12 : 0.2 }}
    >
      {scene.objectContent === 'chips' && scene.chips ? (
        <SceneTwoChips chips={scene.chips} sceneKey={sceneKey} reduceMotion={reduceMotion} />
      ) : null}

      {scene.objectContent === 'broadcast' && scene.fragments ? (
        <SceneFiveBroadcast fragments={scene.fragments} sceneKey={sceneKey} reduceMotion={reduceMotion} />
      ) : null}

      {scene.objectContent === 'cta' && scene.helperLabel ? (
        <SceneSixFooter label={scene.helperLabel} sceneKey={sceneKey} reduceMotion={reduceMotion} />
      ) : null}
    </motion.div>
  );
}
