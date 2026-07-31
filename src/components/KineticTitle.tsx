import { motion } from 'motion/react';
import styles from './KineticTitle.module.css';
import type { SceneDefinition } from './HeroMotion';

type KineticTitleProps = {
  scene: SceneDefinition;
  sceneKey: string;
  reduceMotion: boolean;
  placement?: 'shell' | 'stage';
};

const LETTER_STAGGER = 0.024;
const SHARP_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

function MaskedPhrase({
  lines,
  sceneKey,
  reduceMotion,
  placement,
  titleDelayMs = 0,
}: {
  lines: string[];
  sceneKey: string;
  reduceMotion: boolean;
  placement: 'shell' | 'stage';
  titleDelayMs?: number;
}) {
  const delayOffset = titleDelayMs / 1000;

  return (
    <div className={`${styles.root} ${placement === 'shell' ? styles.shellRoot : ''} ${styles.phraseRoot}`}>
      {lines.map((line, lineIndex) => (
        <motion.div
          key={`${sceneKey}-${lineIndex}-${line}`}
          className={`${styles.maskLine} ${placement === 'shell' ? styles.shellMaskLine : ''}`}
          initial={{
            clipPath: 'inset(0 50% 0 50% round 999px)',
            opacity: 0,
          }}
          animate={{
            clipPath: 'inset(0 0 0 0 round 999px)',
            opacity: 1,
          }}
          transition={{
            duration: reduceMotion ? 0.18 : 0.42,
            delay: (reduceMotion ? 0.02 + lineIndex * 0.04 : 0.04 + lineIndex * 0.08) + delayOffset,
            ease: SHARP_EASE,
          }}
        >
          <span className={styles.lineText}>
            {line.split('').map((character, characterIndex) => (
              <motion.span
                key={`${sceneKey}-${lineIndex}-${characterIndex}-${character}`}
                className={`${styles.character} ${placement === 'shell' ? styles.shellCharacter : ''}`}
                initial={{
                  opacity: 0,
                  y: '0.7em',
                  scale: 0.9,
                  filter: 'blur(16px)',
                  clipPath: 'inset(0 0 100% 0)',
                }}
                animate={{
                  opacity: 1,
                  y: '0em',
                  scale: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0 0 0 0)',
                }}
                transition={{
                  duration: reduceMotion ? 0.14 : 0.3,
                  delay:
                    (reduceMotion
                      ? 0.08 + lineIndex * 0.04
                      : 0.08 + lineIndex * 0.08 + characterIndex * LETTER_STAGGER) + delayOffset,
                  ease: SHARP_EASE,
                }}
              >
                {character}
              </motion.span>
            ))}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

function SplitTypography({
  word,
  sceneKey,
  reduceMotion,
}: {
  word: string;
  sceneKey: string;
  reduceMotion: boolean;
}) {
  const slices = [
    'inset(0 0 66% 0)',
    'inset(34% 0 32% 0)',
    'inset(68% 0 0 0)',
  ];

  return (
    <div className={`${styles.root} ${styles.splitRoot}`}>
      <motion.span
        className={styles.splitGhost}
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(18px)' }}
        animate={{ opacity: 0.16, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.18 : 0.4, ease: SHARP_EASE }}
      >
        {word}
      </motion.span>

      {slices.map((clipPath, index) => (
        <motion.span
          key={`${sceneKey}-${word}-${index}`}
          className={styles.splitSlice}
          style={{ clipPath }}
          initial={{
            opacity: 0,
            y: index === 1 ? 0 : index === 0 ? -42 : 42,
            scale: 0.94,
            filter: 'blur(12px)',
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: reduceMotion ? 0.2 : 0.48,
            delay: reduceMotion ? 0.04 : index * 0.08,
            ease: SHARP_EASE,
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}

function MinimalLabel({ label, sceneKey, reduceMotion }: { label: string; sceneKey: string; reduceMotion: boolean }) {
  return (
    <div className={`${styles.root} ${styles.labelRoot}`}>
      <motion.span
        key={`${sceneKey}-${label}`}
        className={styles.minimalLabel}
        initial={{ opacity: 0, y: 18, filter: 'blur(10px)' }}
        animate={{ opacity: 0.86, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.16 : 0.28, ease: SHARP_EASE }}
      >
        {label}
      </motion.span>
    </div>
  );
}

export default function KineticTitle({ scene, sceneKey, reduceMotion }: KineticTitleProps) {
  const placement = scene.copyMode === 'split-typography' ? 'stage' : 'shell';

  if (scene.copyMode === 'none') {
    return null;
  }

  if (scene.copyMode === 'split-typography' && scene.splitWord) {
    return <SplitTypography word={scene.splitWord} sceneKey={sceneKey} reduceMotion={reduceMotion} />;
  }

  if (scene.copyMode === 'minimal-label' && scene.helperLabel) {
    return <MinimalLabel label={scene.helperLabel} sceneKey={sceneKey} reduceMotion={reduceMotion} />;
  }

  if (scene.titleLines) {
    return (
      <MaskedPhrase
        lines={scene.titleLines}
        sceneKey={sceneKey}
        reduceMotion={reduceMotion}
        placement={placement}
        titleDelayMs={scene.titleDelayMs}
      />
    );
  }

  return null;
}
