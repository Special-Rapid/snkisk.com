import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { useEffect, useMemo, useState } from 'react';
import FloatingGrid from './FloatingGrid';
import GlowBackground from './GlowBackground';
import HeroObject from './HeroObject';
import type { ProductPanelSpec } from './MotionCard';
import styles from './HeroMotion.module.css';

const LOOP_DURATION_MS = 8000;
const CUT_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export type SceneId =
  | 'scene-01'
  | 'scene-02'
  | 'scene-03'
  | 'scene-04'
  | 'scene-05'
  | 'scene-06';

export type HeroObjectState = 'pill' | 'bar' | 'split' | 'panel' | 'chip' | 'cta';
export type CopyMode = 'masked-phrase' | 'split-typography' | 'minimal-label' | 'none';
export type ObjectContent = 'none' | 'chips' | 'panel-ui' | 'broadcast' | 'cta';

export type ScenePalette = {
  bg1: string;
  bg2: string;
  bg3: string;
  accent: string;
  surface: string;
  text: string;
};

export type SceneDefinition = {
  id: SceneId;
  startMs: number;
  endMs: number;
  palette: ScenePalette;
  heroObjectState: HeroObjectState;
  copyMode: CopyMode;
  objectContent: ObjectContent;
  titleLines?: string[];
  splitWord?: string;
  helperLabel?: string;
  chips?: string[];
  fragments?: string[];
  ctaLabel?: string;
  panel?: ProductPanelSpec;
  titleDelayMs?: number;
};

const SCENE_TIMELINE: SceneDefinition[] = [
  {
    id: 'scene-01',
    startMs: 0,
    endMs: 1100,
    palette: {
      bg1: '#19e3ff',
      bg2: '#1f54ff',
      bg3: '#7d35ff',
      accent: '#ff8f2b',
      surface: 'rgba(255, 255, 255, 0.22)',
      text: '#09132b',
    },
    heroObjectState: 'pill',
    copyMode: 'masked-phrase',
    objectContent: 'none',
    titleLines: ['BUILD FAST'],
    helperLabel: 'OBJECT / IGNITE',
    titleDelayMs: 140,
  },
  {
    id: 'scene-02',
    startMs: 1100,
    endMs: 2300,
    palette: {
      bg1: '#ff912d',
      bg2: '#ff3ba0',
      bg3: '#6158ff',
      accent: '#95ff45',
      surface: 'rgba(255, 255, 255, 0.24)',
      text: '#190d2e',
    },
    heroObjectState: 'bar',
    copyMode: 'masked-phrase',
    objectContent: 'chips',
    titleLines: ['SHIP CLEAN'],
    chips: ['AUTO LAYOUT', 'QA PASS', 'PUBLISH READY'],
    helperLabel: 'BAR / REVEAL',
  },
  {
    id: 'scene-03',
    startMs: 2300,
    endMs: 3900,
    palette: {
      bg1: '#1fd5ff',
      bg2: '#2250ff',
      bg3: '#d7ff3d',
      accent: '#ffffff',
      surface: 'rgba(255, 255, 255, 0.18)',
      text: '#0a1530',
    },
    heroObjectState: 'split',
    copyMode: 'split-typography',
    objectContent: 'none',
    splitWord: 'MERGE',
    helperLabel: 'SPLIT / ALIGN / PANEL',
  },
  {
    id: 'scene-04',
    startMs: 3900,
    endMs: 5500,
    palette: {
      bg1: '#6d32ff',
      bg2: '#ff33a0',
      bg3: '#ff9928',
      accent: '#cbff2f',
      surface: 'rgba(255, 255, 255, 0.22)',
      text: '#ffffff',
    },
    heroObjectState: 'panel',
    copyMode: 'none',
    objectContent: 'panel-ui',
    helperLabel: 'PANEL / LIVE SIGNAL',
    panel: {
      badge: 'STATUS / LIVE',
      title: 'Release board',
      metric: '98.4%',
      rows: ['Sync complete', 'Build stable', 'Launch queued'],
    },
  },
  {
    id: 'scene-05',
    startMs: 5500,
    endMs: 6800,
    palette: {
      bg1: '#19e2ff',
      bg2: '#234dff',
      bg3: '#8dff30',
      accent: '#ff48a6',
      surface: 'rgba(255, 255, 255, 0.2)',
      text: '#071127',
    },
    heroObjectState: 'chip',
    copyMode: 'minimal-label',
    objectContent: 'broadcast',
    helperLabel: 'SIGNAL / LIVE',
    fragments: ['128 FPS', 'NEXT', 'LIVE / 04', '04 / 08 / 24'],
  },
  {
    id: 'scene-06',
    startMs: 6800,
    endMs: 8000,
    palette: {
      bg1: '#23deff',
      bg2: '#355dff',
      bg3: '#b03dff',
      accent: '#ff8b26',
      surface: 'rgba(255, 255, 255, 0.22)',
      text: '#08132b',
    },
    heroObjectState: 'cta',
    copyMode: 'none',
    objectContent: 'cta',
    ctaLabel: 'OPEN BETA / START NOW',
    helperLabel: 'CTA / LOOP RESET',
  },
];

type LoopClock = {
  elapsedMs: number;
  sceneIndex: number;
  cycle: number;
};

type HeroMotionProps = {
  onIntroComplete?: () => void;
};

function getSceneIndex(elapsedMs: number) {
  return SCENE_TIMELINE.findIndex((scene) => elapsedMs >= scene.startMs && elapsedMs < scene.endMs);
}

function getSceneLabel(scene: SceneDefinition) {
  return scene.id.replace('scene-', 'SCENE ');
}

function useLoopClock(reduceMotion: boolean) {
  const [clock, setClock] = useState<LoopClock>({
    elapsedMs: 0,
    sceneIndex: 0,
    cycle: 0,
  });

  useEffect(() => {
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const totalElapsed = now - startedAt;
      const elapsedMs = totalElapsed % LOOP_DURATION_MS;
      const cycle = Math.floor(totalElapsed / LOOP_DURATION_MS);
      const sceneIndex = Math.max(getSceneIndex(elapsedMs), 0);

      setClock((previous) => {
        if (
          previous.sceneIndex === sceneIndex &&
          previous.cycle === cycle &&
          Math.abs(previous.elapsedMs - elapsedMs) < (reduceMotion ? 140 : 80)
        ) {
          return previous;
        }

        return {
          elapsedMs,
          sceneIndex,
          cycle,
        };
      });

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, [reduceMotion]);

  return clock;
}

export default function HeroMotion({ onIntroComplete }: HeroMotionProps) {
  const reduceMotion = useReducedMotion();
  const clock = useLoopClock(Boolean(reduceMotion));
  const activeScene = useMemo(() => SCENE_TIMELINE[clock.sceneIndex] ?? SCENE_TIMELINE[0], [clock.sceneIndex]);
  const sceneKey = `${clock.cycle}-${activeScene.id}`;

  useEffect(() => {
    if (!onIntroComplete) {
      return;
    }

    // The first 8-second loop is cut 00; hand control to the project reel instead of repeating forever.
    const timeoutId = window.setTimeout(onIntroComplete, reduceMotion ? 1200 : LOOP_DURATION_MS);
    return () => window.clearTimeout(timeoutId);
  }, [onIntroComplete, reduceMotion]);

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.page}>
        <section
          className={styles.hero}
          aria-label="Persistent 2D product intro hero"
          style={
            {
              '--scene-text': activeScene.palette.text,
              '--scene-surface': activeScene.palette.surface,
              '--scene-accent': activeScene.palette.accent,
            } as CSSProperties
          }
        >
          <GlowBackground palette={activeScene.palette} sceneId={activeScene.id} sceneKey={sceneKey} reduceMotion={Boolean(reduceMotion)} />

          {/* Each opening beat gets a short color strike so the first sequence has film-like cuts, not only soft morphs. */}
          <motion.div
            className={styles.sceneStrike}
            key={`strike-${sceneKey}`}
            aria-hidden="true"
            initial={{ opacity: 0, scaleX: 0.05, x: '-42%' }}
            animate={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: [0, 0.82, 0], scaleX: [0.05, 1.18, 1.54], x: ['-42%', '0%', '38%'] }
            }
            transition={{ duration: reduceMotion ? 0.01 : 0.52, times: [0, 0.36, 1], ease: CUT_EASE }}
          />

          <div className={styles.sceneStamp}>
            <motion.span
              key={`stamp-${sceneKey}`}
              initial={{ opacity: 0, y: 14, filter: 'blur(10px)' }}
              animate={{ opacity: 0.78, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: Boolean(reduceMotion) ? 0.14 : 0.28, ease: CUT_EASE }}
            >
              PERSISTENT OBJECT / {getSceneLabel(activeScene)}
            </motion.span>
          </div>

          <div className={styles.sceneCanvas}>
            <HeroObject scene={activeScene} sceneKey={sceneKey} reduceMotion={Boolean(reduceMotion)} />

            <AnimatePresence initial={false} mode="sync">
              <FloatingGrid key={`fragments-${sceneKey}`} scene={activeScene} sceneKey={sceneKey} reduceMotion={Boolean(reduceMotion)} />
            </AnimatePresence>
          </div>
        </section>
      </main>
    </MotionConfig>
  );
}
