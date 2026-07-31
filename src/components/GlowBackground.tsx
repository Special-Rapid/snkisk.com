import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import styles from './GlowBackground.module.css';
import type { SceneId, ScenePalette } from './HeroMotion';

type GlowBackgroundProps = {
  palette: ScenePalette;
  sceneId: SceneId;
  sceneKey: string;
  reduceMotion: boolean;
};

export default function GlowBackground({ palette, sceneId, sceneKey, reduceMotion }: GlowBackgroundProps) {
  return (
    <div
      className={styles.root}
      aria-hidden="true"
      data-scene={sceneId}
      style={
        {
          '--scene-bg-1': palette.bg1,
          '--scene-bg-2': palette.bg2,
          '--scene-bg-3': palette.bg3,
          '--scene-accent': palette.accent,
          '--scene-surface': palette.surface,
        } as CSSProperties
      }
    >
      {/* The background now only changes the color world. The hero object carries the narrative continuity. */}
      <motion.div
        key={`wash-${sceneKey}`}
        className={styles.baseGradient}
        initial={{ opacity: 0, scale: 1.04, filter: 'blur(20px)' }}
        animate={
          reduceMotion
            ? { opacity: 1, scale: 1, filter: 'blur(0px)' }
            : {
                opacity: 1,
                scale: [1.04, 1.01, 1],
                filter: ['blur(20px)', 'blur(6px)', 'blur(0px)'],
                backgroundPosition: ['0% 50%', '100% 50%', '50% 50%'],
              }
        }
        transition={{
          duration: reduceMotion ? 0.2 : 0.76,
          ease: 'easeOut',
          backgroundPosition: reduceMotion ? undefined : { duration: 1.2, ease: 'easeInOut' },
        }}
      />

      <motion.div
        key={`blob-a-${sceneKey}`}
        className={`${styles.blob} ${styles.blobA}`}
        initial={{ opacity: 0, scale: 0.76 }}
        animate={
          reduceMotion
            ? { opacity: 0.7, scale: 1 }
            : {
                opacity: [0.36, 0.82, 0.64],
                scale: [0.76, 1.08, 0.96],
                x: ['0%', '-4%', '0%'],
                y: ['0%', '4%', '0%'],
              }
        }
        transition={{ duration: reduceMotion ? 0.24 : 0.9, ease: 'easeOut' }}
      />

      <motion.div
        key={`blob-b-${sceneKey}`}
        className={`${styles.blob} ${styles.blobB}`}
        initial={{ opacity: 0, scale: 0.74 }}
        animate={
          reduceMotion
            ? { opacity: 0.58, scale: 1 }
            : {
                opacity: [0.26, 0.7, 0.54],
                scale: [0.74, 1.02, 0.96],
                x: ['0%', '4%', '0%'],
                y: ['0%', '-5%', '0%'],
              }
        }
        transition={{ duration: reduceMotion ? 0.22 : 0.96, ease: 'easeOut', delay: reduceMotion ? 0.02 : 0.04 }}
      />

      <motion.div
        key={`wash-c-${sceneKey}`}
        className={styles.colorField}
        initial={{ opacity: 0 }}
        animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.28, 0.64, 0.52], backgroundPosition: ['0% 0%', '100% 50%', '50% 100%'] }}
        transition={{ duration: reduceMotion ? 0.18 : 0.9, ease: 'easeOut' }}
      />

      <div className={styles.mesh} />
      <div className={styles.grain} />
    </div>
  );
}
