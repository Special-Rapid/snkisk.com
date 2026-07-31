import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState, type CSSProperties } from 'react';
import KineticTitle from './KineticTitle';
import MotionCard from './MotionCard';
import styles from './HeroObject.module.css';
import type { SceneDefinition } from './HeroMotion';

type HeroObjectProps = {
  scene: SceneDefinition;
  sceneKey: string;
  reduceMotion: boolean;
};

type HeroObjectVariant = {
  width: string | string[];
  height: string | string[];
  borderRadius: string | string[];
  rotate: string | string[];
  x: string | string[];
  y: string | string[];
  scale: number | number[];
  opacity: number | number[];
};

type MorphRailState = {
  opacity: number | number[];
  width: string | string[];
  height: string | string[];
  y: string | string[];
  scaleX: number | number[];
  rotate: string | string[];
};

const SHELL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPLIT_EASE: [number, number, number, number] = [0.18, 0.89, 0.32, 1.18];

function getLastValue<T>(value: T | T[]) {
  return Array.isArray(value) ? value[value.length - 1] : value;
}

function useCompactLayout() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 720px)');
    const sync = () => setIsCompact(mediaQuery.matches);

    sync();
    mediaQuery.addEventListener('change', sync);
    return () => mediaQuery.removeEventListener('change', sync);
  }, []);

  return isCompact;
}

function getShellVariant(scene: SceneDefinition, isCompact: boolean): HeroObjectVariant {
  if (isCompact) {
    switch (scene.id) {
      case 'scene-01':
        return {
          width: ['20rem', '22rem', '23.5rem'],
          height: ['5.2rem', '6.8rem', '7.4rem'],
          borderRadius: ['999px', '999px', '999px'],
          rotate: ['-7deg', '-6deg', '-5deg'],
          x: ['0%', '0%', '0%'],
          y: ['1%', '1%', '1%'],
          scale: [0.98, 1.01, 1],
          opacity: [0.94, 1, 1],
        };
      case 'scene-02':
        return {
          width: ['27rem', '29rem', '30rem'],
          height: ['7.2rem', '7rem', '6.8rem'],
          borderRadius: ['999px', '999px', '999px'],
          rotate: ['-6deg', '-4deg', '-2deg'],
          x: ['0%', '0%', '0%'],
          y: ['0%', '0%', '0%'],
          scale: [1, 1.01, 1],
          opacity: [1, 1, 0.98],
        };
      case 'scene-03':
        return {
          width: ['24rem', '20rem', '17rem'],
          height: ['6.2rem', '4.2rem', '2.8rem'],
          borderRadius: ['3rem', '999px', '999px'],
          rotate: ['-2deg', '-1deg', '0deg'],
          x: ['0%', '0%', '0%'],
          y: ['2%', '2%', '3%'],
          scale: [1, 1, 0.98],
          opacity: [0.4, 0.58, 0.76],
        };
      case 'scene-04':
        return {
          width: ['17rem', '21rem', '23rem'],
          height: ['2.8rem', '11.6rem', '13.8rem'],
          borderRadius: ['999px', '2.2rem', '1.9rem'],
          rotate: ['0deg', '-2deg', '-1deg'],
          x: ['0%', '0%', '0%'],
          y: ['3%', '3%', '4%'],
          scale: [0.98, 1.01, 1],
          opacity: [0.76, 1, 1],
        };
      case 'scene-05':
        return {
          width: ['24rem', '16rem', '15rem'],
          height: ['14rem', '5.4rem', '3.8rem'],
          borderRadius: ['2rem', '1.8rem', '999px'],
          rotate: ['-1deg', '0deg', '0deg'],
          x: ['0%', '0%', '0%'],
          y: ['5%', '10%', '14%'],
          scale: [1, 1.02, 1],
          opacity: [1, 1, 0.96],
        };
      case 'scene-06':
      default:
        return {
          width: ['12.5rem', '15.5rem', '22rem'],
          height: ['3.2rem', '4rem', '5.8rem'],
          borderRadius: ['999px', '999px', '999px'],
          rotate: ['0deg', '-2deg', '-6deg'],
          x: ['0%', '0%', '0%'],
          y: ['12%', '7%', '1%'],
          scale: [1, 0.98, 1],
          opacity: [0.98, 1, 0.98],
        };
    }
  }

  switch (scene.id) {
    case 'scene-01':
      return {
        width: ['52rem', '60rem', '64rem'],
        height: ['10.5rem', '15.4rem', '16.8rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['-8deg', '-7deg', '-6deg'],
        x: ['0%', '0%', '0%'],
        y: ['0%', '0%', '0%'],
        scale: [0.96, 1.02, 1],
        opacity: [0.92, 1, 1],
      };
    case 'scene-02':
      return {
        width: ['64rem', '70rem', '72rem'],
        height: ['16.8rem', '13.4rem', '12rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['-6deg', '-4deg', '-2deg'],
        x: ['0%', '0%', '0%'],
        y: ['0%', '0%', '0%'],
        scale: [1, 1.02, 1],
        opacity: [1, 1, 0.98],
      };
    case 'scene-03':
      return {
        width: ['58rem', '44rem', '36rem'],
        height: ['10rem', '5.8rem', '3.4rem'],
        borderRadius: ['3.4rem', '999px', '999px'],
        rotate: ['-2deg', '-1deg', '0deg'],
        x: ['0%', '0%', '0%'],
        y: ['2%', '2%', '3%'],
        scale: [1, 0.99, 0.98],
        opacity: [0.34, 0.56, 0.72],
      };
    case 'scene-04':
      return {
        width: ['36rem', '50rem', '56rem'],
        height: ['3.4rem', '17rem', '21rem'],
        borderRadius: ['999px', '2.8rem', '2.2rem'],
        rotate: ['0deg', '-2deg', '-1deg'],
        x: ['0%', '0%', '0%'],
        y: ['3%', '3%', '4%'],
        scale: [0.98, 1.01, 1],
        opacity: [0.72, 1, 1],
      };
    case 'scene-05':
      return {
        width: ['58rem', '24rem', '22rem'],
        height: ['21rem', '7.2rem', '4.4rem'],
        borderRadius: ['2.2rem', '2rem', '999px'],
        rotate: ['-1deg', '0deg', '0deg'],
        x: ['0%', '0%', '0%'],
        y: ['4%', '12%', '16%'],
        scale: [1, 1.02, 1],
        opacity: [1, 1, 0.96],
      };
    case 'scene-06':
    default:
      return {
        width: ['22rem', '32rem', '52rem'],
        height: ['4.4rem', '6rem', '10.5rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['0deg', '-2deg', '-8deg'],
        x: ['0%', '0%', '0%'],
        y: ['16%', '10%', '0%'],
        scale: [1, 0.98, 1],
        opacity: [0.96, 1, 0.98],
      };
  }
}

function getSplitBarState(scene: SceneDefinition, index: number, isCompact: boolean) {
  const offsets = isCompact ? [-3.4, 0, 3.4] : [-5.6, 0, 5.6];
  const widths = ['72%', '46%', '62%'];

  if (scene.heroObjectState === 'split') {
    return {
      opacity: [0, 1, 1],
      scaleX: [0.4, 1.06, 1],
      y: [0, `${offsets[index]}rem`, `${offsets[index]}rem`],
      width: [widths[index], widths[index], widths[index]],
      height: ['2rem', '2.2rem', '2.2rem'],
    };
  }

  if (scene.heroObjectState === 'panel') {
    return {
      opacity: [1, 0.86, 0.46],
      scaleX: [1, 0.98, 0.9],
      y: [`${offsets[index]}rem`, `${offsets[index] * 0.28}rem`, '0rem'],
      width: [widths[index], ['82%', '64%', '54%'][index], ['74%', '58%', '42%'][index]],
      height: isCompact ? ['1.6rem', '0.82rem', '0.44rem'] : ['2.2rem', '1rem', '0.56rem'],
    };
  }

  return {
    opacity: 0,
    scaleX: 0.34,
    y: '0rem',
    width: '40%',
    height: '1rem',
  };
}

function getContentState(objectContent: SceneDefinition['objectContent']) {
  switch (objectContent) {
    case 'panel-ui':
      return { opacity: 1, scale: 1, filter: 'blur(0px)' };
    case 'cta':
      return { opacity: 1, scale: 1, filter: 'blur(0px)' };
    default:
      return { opacity: 0, scale: 0.96, filter: 'blur(10px)' };
  }
}

function getMorphRailState(scene: SceneDefinition, index: number, isCompact: boolean): MorphRailState {
  const compactRows = ['-1.1rem', '0rem', '1.1rem'];
  const wideRows = ['-1.6rem', '0rem', '1.6rem'];
  const rows = isCompact ? compactRows : wideRows;
  const chipRows = isCompact ? ['-0.5rem', '0.26rem', '0.92rem'] : ['-0.72rem', '0.34rem', '1.18rem'];
  const panelRows = isCompact ? ['-3rem', '-0.56rem', '2rem'] : ['-4.2rem', '-0.8rem', '2.8rem'];
  const splitRows = isCompact ? ['-2.4rem', '0rem', '2.4rem'] : ['-3.4rem', '0rem', '3.4rem'];
  const handoffRows = isCompact ? ['-0.26rem', '0.48rem', '1.16rem'] : ['-0.34rem', '0.6rem', '1.4rem'];

  switch (scene.heroObjectState) {
    case 'pill':
      return {
        // Scene 01 now begins from the compact CTA's internal rail layout before widening back into the pill.
        opacity: [[0.18, 0.18, 0.18][index], [0.28, 0.34, 0.28][index], [0.22, 0.3, 0.22][index]],
        width: [['18%', '22%', '28%'][index], ['52%', '60%', '42%'][index], ['62%', '42%', '26%'][index]],
        height: [['0.18rem', '0.18rem', '0.2rem'][index], ['0.28rem', '0.38rem', '0.28rem'][index], ['0.32rem', '0.36rem', '0.26rem'][index]],
        y: [handoffRows[index], rows[index], ['-1.4rem', '0rem', '1.4rem'][index]],
        scaleX: [0.9, 1.06, 1],
        rotate: [['0deg', '0deg', '-2deg'][index], ['-4deg', '-3deg', '-2deg'][index], ['-6deg', '-4deg', '-3deg'][index]],
      };
    case 'bar':
      return {
        opacity: [0.18, 0.44, 0.28],
        width: [['74%', '66%', '44%'][index], ['86%', '72%', '48%'][index], ['82%', '64%', '40%'][index]],
        height: [['0.34rem', '0.42rem', '0.28rem'][index], ['0.38rem', '0.52rem', '0.32rem'][index], ['0.34rem', '0.44rem', '0.28rem'][index]],
        y: rows[index],
        scaleX: [0.88, 1.06, 1],
        rotate: ['-3deg', '-2deg', '-1deg'],
      };
    case 'split':
      return {
        opacity: [0.22, 0.52, 0.36],
        width: [['56%', '42%', '54%'][index], ['68%', '48%', '62%'][index], ['64%', '44%', '58%'][index]],
        height: [['0.34rem', '0.44rem', '0.34rem'][index], ['0.44rem', '0.56rem', '0.44rem'][index], ['0.38rem', '0.5rem', '0.38rem'][index]],
        y: isCompact ? ['-2.4rem', '0rem', '2.4rem'][index] : ['-3.4rem', '0rem', '3.4rem'][index],
        scaleX: [0.52, 1.08, 1],
        rotate: ['-1deg', '0deg', '1deg'],
      };
    case 'panel':
      return {
        // Split bars no longer vanish immediately; they re-settle into panel guides first.
        opacity: [[0.22, 0.52, 0.36][index], [0.34, 0.46, 0.32][index], [0.28, 0.38, 0.26][index]],
        width: [['64%', '44%', '58%'][index], ['74%', '86%', '70%'][index], ['66%', '76%', '58%'][index]],
        height: [['0.38rem', '0.5rem', '0.38rem'][index], ['0.22rem', '0.24rem', '0.18rem'][index], ['0.14rem', '0.16rem', '0.14rem'][index]],
        y: [splitRows[index], panelRows[index], panelRows[index]],
        scaleX: [0.6, 1, 1],
        rotate: ['0deg', '0deg', '0deg'],
      };
    case 'chip':
      return {
        opacity: [0.28, 0.52, 0.22],
        width: [['42%', '26%', '16%'][index], ['56%', '34%', '20%'][index], ['52%', '30%', '18%'][index]],
        height: [['0.18rem', '0.24rem', '0.18rem'][index], ['0.24rem', '0.28rem', '0.18rem'][index], ['0.22rem', '0.26rem', '0.16rem'][index]],
        y: chipRows[index],
        scaleX: [0.84, 1.02, 1],
        rotate: ['0deg', '0deg', '0deg'],
      };
    case 'cta':
    default:
      return {
        opacity: [0.22, 0.42, 0.18],
        width: [['54%', '34%', '18%'][index], ['64%', '40%', '22%'][index], ['72%', '46%', '28%'][index]],
        height: [['0.2rem', '0.26rem', '0.18rem'][index], ['0.22rem', '0.3rem', '0.18rem'][index], ['0.28rem', '0.32rem', '0.2rem'][index]],
        y: isCompact ? ['-0.26rem', '0.48rem', '1.16rem'][index] : ['-0.34rem', '0.6rem', '1.4rem'][index],
        scaleX: [0.82, 1, 1.08],
        rotate: ['0deg', '0deg', '-2deg'],
      };
  }
}

function getSeamState(scene: SceneDefinition, isCompact: boolean) {
  switch (scene.heroObjectState) {
    case 'pill':
      return {
        opacity: [0.28, 0.38, 0.26],
        width: ['74%', '72%', '64%'],
        height: ['0.3rem', '0.42rem', '0.36rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['-3deg', '-4deg', '-3deg'],
        y: ['0rem', '0rem', '0rem'],
      };
    case 'bar':
      return {
        opacity: [0.2, 0.46, 0.34],
        width: ['28%', '86%', '82%'],
        height: ['0.3rem', '0.34rem', '0.3rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['-4deg', '-1deg', '0deg'],
        y: ['0rem', '0rem', '0rem'],
      };
    case 'split':
      return {
        opacity: [0.22, 0.1, 0],
        width: ['76%', '34%', '18%'],
        height: ['0.28rem', '0.22rem', '0.18rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['0deg', '0deg', '0deg'],
        y: ['0rem', '0rem', '0rem'],
      };
    case 'panel':
      return {
        opacity: [0.18, 0.24, 0.16],
        width: ['72%', isCompact ? '0.16rem' : '0.18rem', isCompact ? '0.14rem' : '0.16rem'],
        height: ['0.24rem', '72%', '62%'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['0deg', '0deg', '0deg'],
        y: ['0rem', '0rem', '0rem'],
      };
    case 'chip':
      return {
        opacity: [0.12, 0.3, 0.24],
        width: ['10%', '44%', '38%'],
        height: ['46%', '0.22rem', '0.18rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['0deg', '0deg', '0deg'],
        y: ['0rem', '0rem', '0rem'],
      };
    case 'cta':
    default:
      return {
        opacity: [0.16, 0.42, 0.28],
        width: ['38%', '64%', '74%'],
        height: ['0.22rem', '0.22rem', '0.3rem'],
        borderRadius: ['999px', '999px', '999px'],
        rotate: ['0deg', '0deg', '-3deg'],
        y: [isCompact ? '0.66rem' : '0.86rem', isCompact ? '0.76rem' : '0.98rem', '0rem'],
      };
  }
}

function getPulseState(scene: SceneDefinition, isCompact: boolean) {
  switch (scene.heroObjectState) {
    case 'pill':
      return {
        opacity: [0.42, 0.94, 0.58],
        x: ['30%', '18%', '16%'],
        y: [isCompact ? '0.66rem' : '0.86rem', isCompact ? '0.18rem' : '0.24rem', '0rem'],
        scale: [0.8, 1.1, 0.92],
      };
    case 'bar':
      return {
        opacity: [0.2, 0.92, 0.52],
        x: ['-28%', '18%', '28%'],
        y: ['0rem', '0rem', '0rem'],
        scale: [0.72, 1, 0.82],
      };
    case 'split':
      return {
        opacity: [0.4, 0.22, 0],
        x: ['0%', isCompact ? '6%' : '10%', isCompact ? '12%' : '18%'],
        y: ['0rem', isCompact ? '-0.8rem' : '-1rem', isCompact ? '-1.4rem' : '-1.8rem'],
        scale: [0.82, 0.7, 0.42],
      };
    case 'panel':
      return {
        opacity: [0, 0.76, 0.44],
        x: [isCompact ? '-6rem' : '-10rem', isCompact ? '-6rem' : '-10rem', isCompact ? '-6rem' : '-10rem'],
        y: [isCompact ? '-3.2rem' : '-4.6rem', isCompact ? '-1rem' : '-1.6rem', isCompact ? '0.8rem' : '1.2rem'],
        scale: [0.46, 0.82, 0.68],
      };
    case 'chip':
      return {
        opacity: [0.14, 0.82, 0.46],
        x: ['-6%', '18%', '24%'],
        y: [isCompact ? '-0.2rem' : '-0.3rem', isCompact ? '-0.2rem' : '-0.3rem', isCompact ? '-0.2rem' : '-0.3rem'],
        scale: [0.72, 1, 0.78],
      };
    case 'cta':
    default:
      return {
        opacity: [0.18, 0.84, 0.42],
        x: ['10%', '24%', '30%'],
        y: [isCompact ? '0.66rem' : '0.86rem', isCompact ? '0.66rem' : '0.86rem', isCompact ? '0.66rem' : '0.86rem'],
        scale: [0.72, 1, 0.8],
      };
  }
}

function getObjectTag(scene: SceneDefinition) {
  switch (scene.heroObjectState) {
    case 'pill':
      return 'GLOW PILL';
    case 'bar':
      return 'REVEAL BAR';
    case 'split':
      return 'SPLIT BARS';
    case 'panel':
      return 'PANEL MODE';
    case 'chip':
      return 'SIGNAL CHIP';
    case 'cta':
    default:
      return 'CTA LABEL';
  }
}

export default function HeroObject({ scene, sceneKey, reduceMotion }: HeroObjectProps) {
  const isCompact = useCompactLayout();
  const shell = getShellVariant(scene, isCompact);
  const contentState = getContentState(scene.objectContent);
  const renderShellTitle = scene.copyMode === 'masked-phrase' || scene.copyMode === 'minimal-label';
  const renderStageTitle = scene.copyMode === 'split-typography';

  return (
    <div
      className={styles.stage}
      aria-hidden="true"
      style={
        {
          '--object-surface': scene.palette.surface,
          '--object-accent': scene.palette.accent,
          '--object-text': scene.palette.text,
        } as CSSProperties
      }
    >
      {renderStageTitle ? (
        <div className={styles.stageTitle}>
          <KineticTitle scene={scene} sceneKey={sceneKey} reduceMotion={reduceMotion} placement="stage" />
        </div>
      ) : null}

      <motion.div
        className={styles.aura}
        animate={
          reduceMotion
            ? { scale: 1, opacity: 0.64 }
            : {
                scale: scene.heroObjectState === 'panel' ? [1.04, 1.08, 1.02] : [0.96, 1.08, 1],
                opacity: [0.44, 0.72, 0.58],
              }
        }
        transition={{
          duration: reduceMotion ? 0.18 : 0.8,
          ease: SHELL_EASE,
          times: reduceMotion ? undefined : [0, 0.6, 1],
        }}
      />

      <motion.div
        className={styles.shell}
        animate={
          reduceMotion
            ? {
                ...shell,
                width: getLastValue(shell.width),
                height: getLastValue(shell.height),
                borderRadius: getLastValue(shell.borderRadius),
                rotate: getLastValue(shell.rotate),
                x: getLastValue(shell.x),
                y: getLastValue(shell.y),
                scale: getLastValue(shell.scale),
                opacity: getLastValue(shell.opacity),
              }
            : shell
        }
        transition={{
          duration: reduceMotion ? 0.22 : 0.82,
          ease: SHELL_EASE,
          times: reduceMotion ? undefined : [0, 0.62, 1],
        }}
      >
        <div className={styles.shellSurface} />
        <div className={styles.shellHighlight} />
        <div className={styles.morphLayer}>
          {[0, 1, 2].map((index) => (
            <motion.div
              key={`${sceneKey}-rail-${index}`}
              className={`${styles.morphRail} ${styles[`morphRail${index + 1}` as 'morphRail1' | 'morphRail2' | 'morphRail3']}`}
              animate={reduceMotion ? {
                opacity: getLastValue(getMorphRailState(scene, index, isCompact).opacity),
                width: getLastValue(getMorphRailState(scene, index, isCompact).width),
                height: getLastValue(getMorphRailState(scene, index, isCompact).height),
                y: getLastValue(getMorphRailState(scene, index, isCompact).y),
                scaleX: getLastValue(getMorphRailState(scene, index, isCompact).scaleX),
                rotate: getLastValue(getMorphRailState(scene, index, isCompact).rotate),
              } : getMorphRailState(scene, index, isCompact)}
              transition={{
                duration: reduceMotion ? 0.18 : 0.72,
                delay: reduceMotion ? 0.02 : index * 0.03,
                ease: SHELL_EASE,
                times: reduceMotion ? undefined : [0, 0.58, 1],
              }}
            />
          ))}

          <motion.div
            className={styles.seam}
            animate={reduceMotion ? {
              opacity: getLastValue(getSeamState(scene, isCompact).opacity),
              width: getLastValue(getSeamState(scene, isCompact).width),
              height: getLastValue(getSeamState(scene, isCompact).height),
              borderRadius: getLastValue(getSeamState(scene, isCompact).borderRadius),
              rotate: getLastValue(getSeamState(scene, isCompact).rotate),
              y: getLastValue(getSeamState(scene, isCompact).y),
            } : getSeamState(scene, isCompact)}
            transition={{
              duration: reduceMotion ? 0.18 : 0.76,
              ease: SHELL_EASE,
              times: reduceMotion ? undefined : [0, 0.6, 1],
            }}
          />

          <motion.div
            className={styles.pulseDot}
            animate={reduceMotion ? {
              opacity: getLastValue(getPulseState(scene, isCompact).opacity),
              x: getLastValue(getPulseState(scene, isCompact).x),
              y: getLastValue(getPulseState(scene, isCompact).y),
              scale: getLastValue(getPulseState(scene, isCompact).scale),
            } : getPulseState(scene, isCompact)}
            transition={{
              duration: reduceMotion ? 0.18 : 0.7,
              ease: [0.18, 0.89, 0.32, 1.18],
              times: reduceMotion ? undefined : [0, 0.55, 1],
            }}
          />
        </div>

        <motion.div
          className={styles.objectTag}
          animate={
            reduceMotion
              ? { opacity: 0.9, y: 0 }
              : { opacity: [0, 0.92, 0.84], y: [10, 0, 0] }
          }
          transition={{ duration: reduceMotion ? 0.18 : 0.42, ease: SHELL_EASE }}
        >
          {getObjectTag(scene)}
        </motion.div>

        {renderShellTitle ? (
          <div className={styles.titleContent}>
            <KineticTitle scene={scene} sceneKey={sceneKey} reduceMotion={reduceMotion} placement="shell" />
          </div>
        ) : null}

        <motion.div
          className={styles.content}
          animate={contentState}
          transition={{ duration: reduceMotion ? 0.16 : 0.34, ease: SHELL_EASE }}
        >
          <AnimatePresence initial={false} mode="sync">
            {scene.objectContent === 'panel-ui' && scene.panel ? (
              <motion.div
                key={`panel-${sceneKey}`}
                className={styles.panelContent}
                initial={{
                  opacity: 0,
                  y: 24,
                  scale: 0.96,
                  filter: 'blur(12px)',
                  clipPath: 'inset(10% 8% 28% 8% round 1.8rem)',
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                  clipPath: 'inset(0% 0% 0% 0% round 1.8rem)',
                }}
                exit={{ opacity: 0, y: 12, filter: 'blur(10px)', clipPath: 'inset(8% 6% 16% 6% round 1.8rem)' }}
                transition={{ duration: reduceMotion ? 0.18 : 0.46, delay: reduceMotion ? 0 : 0.28, ease: SHELL_EASE }}
              >
                <MotionCard panel={scene.panel} />
              </motion.div>
            ) : null}

            {scene.objectContent === 'cta' && scene.ctaLabel ? (
              <motion.div
                key={`cta-${sceneKey}`}
                className={styles.ctaContent}
                initial={{ opacity: 0, scale: 0.88, filter: 'blur(10px)', x: 10 }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', x: 0 }}
                exit={{ opacity: 0, scale: 0.92, filter: 'blur(10px)', x: 6 }}
                transition={{ duration: reduceMotion ? 0.16 : 0.32, delay: reduceMotion ? 0 : 0.08, ease: SHELL_EASE }}
              >
                {scene.ctaLabel}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      <div className={styles.splitLayer}>
        {[0, 1, 2].map((index) => (
          <motion.div
            key={`${sceneKey}-split-${index}`}
            className={`${styles.splitBar} ${styles[`splitBar${index + 1}` as 'splitBar1' | 'splitBar2' | 'splitBar3']}`}
            animate={reduceMotion ? { opacity: scene.heroObjectState === 'split' ? 1 : 0, y: scene.heroObjectState === 'split' ? `${(isCompact ? [-3.4, 0, 3.4] : [-5.6, 0, 5.6])[index]}rem` : '0rem', scaleX: scene.heroObjectState === 'split' ? 1 : 0.34, width: scene.heroObjectState === 'split' ? ['72%', '46%', '62%'][index] : '40%', height: scene.heroObjectState === 'split' ? (isCompact ? '1.6rem' : '2.2rem') : '1rem' } : getSplitBarState(scene, index, isCompact)}
            transition={{
              duration: reduceMotion ? 0.18 : 0.58,
              delay: reduceMotion ? 0.02 : index * 0.04,
              ease: SPLIT_EASE,
              times: reduceMotion ? undefined : [0, 0.6, 1],
            }}
          />
        ))}
      </div>
    </div>
  );
}
