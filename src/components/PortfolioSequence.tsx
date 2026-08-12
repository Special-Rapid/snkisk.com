import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import type { TargetAndTransition } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './PortfolioSequence.module.css';

const CUT_EASE: [number, number, number, number] = [0.18, 0.89, 0.32, 1.08];
const SHARP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SHOWREEL_DURATION_MS = 22500;

const SHOWREEL_CUTS = [
  { id: 'transition', startMs: 0, endMs: 2600 },
  { id: 'links', startMs: 2600, endMs: 6000 },
  { id: 'legitils', startMs: 6000, endMs: 10200 },
  { id: 'proxy', startMs: 10200, endMs: 13600 },
  { id: 'minecraft', startMs: 13600, endMs: 18000 },
  { id: 'hensyoku', startMs: 18000, endMs: SHOWREEL_DURATION_MS },
] as const;

type ShowreelCutId = (typeof SHOWREEL_CUTS)[number]['id'];
type TransitionKind = 'slats' | 'capsule' | 'brand' | 'iris' | 'minecraft-break' | 'tiles';

const CUT_TRANSITIONS: Record<ShowreelCutId, TransitionKind> = {
  transition: 'slats',
  links: 'capsule',
  legitils: 'brand',
  proxy: 'iris',
  minecraft: 'minecraft-break',
  hensyoku: 'tiles',
};

const BRAND_MARK_OFFSETS = [
  { x: -42, y: -38 },
  { x: 42, y: -38 },
  { x: -42, y: 38 },
  { x: 42, y: 38 },
];

const MINECRAFT_BREAK_VECTORS = [
  { x: -88, y: -76, rotate: -18 }, { x: -22, y: -96, rotate: 12 }, { x: 76, y: -80, rotate: 22 },
  { x: -108, y: -18, rotate: -24 }, { x: 102, y: -14, rotate: 26 }, { x: -92, y: 64, rotate: 20 },
  { x: -26, y: 94, rotate: -12 }, { x: 74, y: 80, rotate: 18 }, { x: 124, y: 54, rotate: 30 },
];

type CutFrameMotion = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
};

const CUT_FRAME_MOTIONS: Record<ShowreelCutId, CutFrameMotion> = {
  // The foreground sweep owns the wipe; chapter text itself never gets clipped mid-word.
  transition: {
    initial: { opacity: 0, y: 32, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -24, scale: 1.01 },
  },
  links: {
    initial: { opacity: 0, x: 44, scale: 1.02 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -28, scale: 0.99 },
  },
  legitils: {
    initial: { opacity: 0, x: -36, scale: 1.025 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: 28, scale: 0.99 },
  },
  proxy: {
    initial: { opacity: 0, y: 26, scale: 0.94 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -18, scale: 1.03 },
  },
  minecraft: {
    initial: { opacity: 0, x: 54, y: -20, scale: 0.98 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    exit: { opacity: 0, x: -36, y: 16, scale: 1.02 },
  },
  hensyoku: {
    initial: { opacity: 0, x: 42, y: 18, scale: 1.015 },
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    exit: { opacity: 0, x: -24, y: -18, scale: 0.99 },
  },
};

function useShowreelCut(reduceMotion: boolean) {
  const [cut, setCut] = useState<ShowreelCutId>('transition');
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let cutIndex = 0;
    let loopCount = 0;
    let timeoutId = 0;

    // Discrete timing prevents a skipped cut when a background tab drops animation frames.
    const playCut = () => {
      const activeCut = SHOWREEL_CUTS[cutIndex];
      setCut(activeCut.id);
      setCycle(loopCount);

      const duration = activeCut.endMs - activeCut.startMs;
      timeoutId = window.setTimeout(() => {
        cutIndex = (cutIndex + 1) % SHOWREEL_CUTS.length;
        if (cutIndex === 0) {
          loopCount += 1;
        }
        playCut();
      }, reduceMotion ? Math.max(1600, duration) : duration);
    };

    playCut();
    return () => window.clearTimeout(timeoutId);
  }, [reduceMotion]);

  return { cut, cycle };
}

type MotionFrameProps = {
  className: string;
  children: ReactNode;
  label: string;
};

type FlagEvent = {
  team: 'blue' | 'red' | 'yellow' | 'green';
  code: string;
  player: string;
  violation: string;
};

type MinecraftBlockTone = 'grass' | 'deepslate' | 'water' | 'quartz' | 'craft' | 'ore';

type MinecraftBlock = {
  id: number;
  tone: MinecraftBlockTone;
};

type HensyokuScreen = {
  id: 'loading' | 'palette' | 'safe';
  src: string;
  alt: string;
};

const HENSYOKU_SCREENS: HensyokuScreen[] = [
  { id: 'loading', src: 'https://images.snkisk.com/snkisk.com/images/5a48566e-62f5-4bd5-ada1-ca04a396d013.png', alt: '偏食メイトの起動画面' },
  { id: 'palette', src: 'https://images.snkisk.com/snkisk.com/images/1df82acd-14af-41e7-88c7-1cab6b0c2d89.png', alt: '偏食メイトのパレット画面' },
  { id: 'safe', src: 'https://images.snkisk.com/snkisk.com/images/4fc567c0-54f6-438b-9adf-81b3d3f550be.png', alt: '偏食メイトの安全圏画面' },
];

const MINECRAFT_BLOCK_TONES: MinecraftBlockTone[] = ['grass', 'deepslate', 'water', 'quartz', 'craft', 'ore'];
const MINECRAFT_BLOCK_COUNT = 5;

function getMinecraftBlockTone(id: number): MinecraftBlockTone {
  return MINECRAFT_BLOCK_TONES[id % MINECRAFT_BLOCK_TONES.length];
}

function createMinecraftBlockSet(): MinecraftBlock[] {
  return Array.from({ length: MINECRAFT_BLOCK_COUNT }, (_, id) => ({ id, tone: getMinecraftBlockTone(id) }));
}

function useMinecraftBlockQueue(reduceMotion: boolean) {
  const [blocks, setBlocks] = useState<MinecraftBlock[]>(() => (reduceMotion ? createMinecraftBlockSet() : []));

  useEffect(() => {
    if (reduceMotion) {
      setBlocks(createMinecraftBlockSet());
      return;
    }

    let nextId = 0;
    const addBlock = () => {
      setBlocks((current) => {
        const nextBlock = { id: nextId, tone: getMinecraftBlockTone(nextId) };
        nextId += 1;
        return [...current, nextBlock].slice(-MINECRAFT_BLOCK_COUNT);
      });
    };

    // The queue builds once, then every arrival advances the connected block chain by one slot.
    addBlock();
    const intervalId = window.setInterval(addBlock, 620);
    return () => window.clearInterval(intervalId);
  }, [reduceMotion]);

  return blocks;
}

function useHensyokuScreen(reduceMotion: boolean) {
  const [screenIndex, setScreenIndex] = useState(reduceMotion ? 2 : 0);

  useEffect(() => {
    if (reduceMotion) {
      setScreenIndex(2);
      return;
    }

    setScreenIndex(0);
    const paletteTimeout = window.setTimeout(() => setScreenIndex(1), 760);
    const safetyTimeout = window.setTimeout(() => setScreenIndex(2), 1680);
    return () => {
      window.clearTimeout(paletteTimeout);
      window.clearTimeout(safetyTimeout);
    };
  }, [reduceMotion]);

  return HENSYOKU_SCREENS[screenIndex];
}

const FLAG_EVENTS: FlagEvent[] = [
  { team: 'blue', code: 'B', player: 'Blueteamplayer', violation: 'BedNuke' },
  { team: 'red', code: 'R', player: 'Redteamplayer', violation: 'NoBreakDelay' },
  { team: 'yellow', code: 'Y', player: 'Yellowteamplayer', violation: 'AutoBlock' },
  { team: 'green', code: 'G', player: 'Greenteamplayer', violation: 'LegitScaffold' },
];

function BrandMark({ small = false }: { small?: boolean }) {
  return (
    <span className={`${styles.brandMark} ${small ? styles.brandMarkSmall : ''}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

function BrandLockup() {
  return (
    <div className={styles.brandLockup} aria-label="MirrorProxy / Legitils">
      <BrandMark small />
      <span className={styles.mirrorWord}>Mirror</span>
      <span className={styles.proxyWord}>Proxy</span>
      <span className={styles.brandSlash}>/</span>
      <span className={styles.legitilsWord}>Legitils</span>
    </div>
  );
}

type CutTransitionProps = {
  cut: ShowreelCutId;
  reduceMotion: boolean;
};

function CutTransition({ cut, reduceMotion }: CutTransitionProps) {
  const kind = CUT_TRANSITIONS[cut];
  const transition = { duration: reduceMotion ? 0.01 : 0.98, times: [0, 0.48, 1], ease: CUT_EASE };

  return (
    <motion.div
      className={styles.cutTransition}
      data-cut={cut}
      data-kind={kind}
      aria-hidden="true"
      initial={{ opacity: 1 }}
      animate={reduceMotion ? { opacity: 0 } : { opacity: [1, 1, 0] }}
      transition={transition}
    >
      {kind === 'slats' ? (
        <div className={styles.transitionSlats}>
          {[styles.transitionSlatCyan, styles.transitionSlatViolet, styles.transitionSlatOrange].map((className, index) => (
            <motion.i
              className={`${styles.transitionSlat} ${className}`}
              key={className}
              initial={{ scaleY: 1, y: 0 }}
              animate={{ scaleY: [1, 1, 0], y: [0, 0, index % 2 === 0 ? '-65%' : '65%'] }}
              transition={{ duration: reduceMotion ? 0.01 : 0.92 + index * 0.08, times: [0, 0.46, 1], ease: CUT_EASE }}
            />
          ))}
        </div>
      ) : null}

      {kind === 'capsule' ? (
        <motion.div
          className={styles.transitionCapsule}
          initial={{ scaleX: 0, scaleY: 0.38 }}
          animate={{ scaleX: [0, 1.18, 1.18], scaleY: [0.38, 1, 1], opacity: [1, 1, 0] }}
          transition={transition}
        />
      ) : null}

      {kind === 'brand' ? (
        <div className={styles.brandTransitionStage}>
          {/* The chapter is introduced as one giant identity frame before it pulls back into its working position. */}
          <motion.div
            className={styles.brandTransitionLockup}
            initial={{ scale: 3.4, x: 0, y: 0 }}
            animate={{ scale: [3.4, 1.42, 0.64], x: [0, '-16vw', '-36vw'], y: [0, '-10vh', '-34vh'] }}
            transition={{ duration: reduceMotion ? 0.01 : 1.04, times: [0, 0.52, 1], ease: CUT_EASE }}
          >
            <span className={styles.brandTransitionMark}>
              {BRAND_MARK_OFFSETS.map((offset, index) => (
                <motion.i
                  key={`${offset.x}-${offset.y}`}
                  className={styles[`brandTransitionPiece${index + 1}`]}
                  initial={{ x: 0, y: 0, scale: 1 }}
                  animate={{ x: [0, offset.x, offset.x], y: [0, offset.y, offset.y], scale: [1, 0.9, 0.7], opacity: [1, 1, 0] }}
                  transition={{ duration: reduceMotion ? 0.01 : 0.94, delay: 0.12, times: [0, 0.6, 1], ease: CUT_EASE }}
                />
              ))}
            </span>
            <span className={styles.brandTransitionText}>
              <b>Mirror</b><strong>Proxy</strong><i>/</i><em>Legitils</em>
            </span>
          </motion.div>
        </div>
      ) : null}

      {kind === 'iris' ? (
        <motion.div
          className={styles.transitionIris}
          initial={{ scale: 0.08, opacity: 1 }}
          animate={{ scale: [0.08, 2.4, 2.9], opacity: [1, 1, 0] }}
          transition={transition}
        />
      ) : null}

      {kind === 'minecraft-break' ? (
        <div className={styles.minecraftBreakGrid}>
          {MINECRAFT_BREAK_VECTORS.map((vector, index) => (
            <motion.i
              className={styles[`minecraftBreakTile${(index % 6) + 1}`]}
              key={`${vector.x}-${vector.y}`}
              initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
              animate={{ opacity: [1, 1, 0], x: [0, 0, `${vector.x}vw`], y: [0, 0, `${vector.y}vh`], rotate: [0, 0, vector.rotate], scale: [1, 1, 0.7] }}
              transition={{ duration: reduceMotion ? 0.01 : 0.96, delay: (index % 3) * 0.035, times: [0, 0.34, 1], ease: CUT_EASE }}
            />
          ))}
        </div>
      ) : null}

      {kind === 'tiles' ? (
        <div className={styles.transitionTiles}>
          {[styles.transitionTileCream, styles.transitionTilePeach, styles.transitionTileCoral].map((className, index) => (
            <motion.i
              className={`${styles.transitionTile} ${className}`}
              key={className}
              initial={{ x: '110%' }}
              animate={{ x: ['110%', '0%', index === 1 ? '-112%' : '112%'] }}
              transition={{ duration: reduceMotion ? 0.01 : 0.96, times: [0, 0.42, 1], delay: index * 0.05, ease: CUT_EASE }}
            />
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}

function MotionFrame({ className, children, label }: MotionFrameProps) {
  return (
    <section className={className} aria-label={label}>
      {children}
    </section>
  );
}

function MotionIntro({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <MotionFrame className={`${styles.frame} ${styles.motionIntro}`} label="Portfolio transition">
      <div className={styles.introRay} />
      <div className={styles.introMetaTop}>
        <span className={styles.orbitDot} />
        <span>SHOWREEL COMPLETE<br />08:00 / 08:00</span>
      </div>
      <div className={styles.introRule} />
      <span className={styles.introChapter}>CHAPTER 01<br />OPENING</span>

      <motion.h2
        className={styles.introTitle}
        initial={{ opacity: 0, y: 48, scale: 0.96, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.22 : 0.78, ease: SHARP_EASE }}
      >
        <span>NOW / IN MOTION</span>
        <strong>MAKING THINGS MOVE</strong>
      </motion.h2>

      <motion.div
        className={styles.introCapsule}
        initial={{ opacity: 0, scaleX: 0.08, filter: 'blur(14px)' }}
        animate={
          reduceMotion
            ? { opacity: 1, scaleX: 1, filter: 'blur(0px)' }
            : { opacity: [0, 1, 1], scaleX: [0.08, 1.04, 1], filter: ['blur(14px)', 'blur(0px)', 'blur(0px)'] }
        }
        transition={{ duration: reduceMotion ? 0.2 : 0.7, delay: reduceMotion ? 0.05 : 0.22, ease: CUT_EASE }}
      >
        <span className={styles.capsuleNoise} />
      </motion.div>

      <div className={styles.introFooter}>
        <span><i /> COMPRESSING INTRO<br />TRANSITIONING TO PORTFOLIO</span>
        <span><b>→</b> PLAYING REEL<br />NEXT CUT IN MOTION</span>
      </div>
    </MotionFrame>
  );
}

function LinkChapter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <MotionFrame className={`${styles.frame} ${styles.linkChapter}`} label="go.snkisk.com link service">
      <div className={styles.linkTopBand} />
      <div className={styles.linkBottomBands} />
      <div className={styles.linkDecorLine} />
      <motion.h2
        className={styles.linkTitle}
        initial={{ opacity: 0, x: -80, scale: 0.97, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.22 : 0.72, ease: SHARP_EASE }}
      >
        ONE LINK
        <span>/ MANY WAYS</span>
      </motion.h2>

      <div className={styles.routeStage}>
        {/* The route label is the single source; the lines visibly branch into separate destinations. */}
        <motion.a
          href="https://go.snkisk.com/"
          className={styles.routeLabel}
          initial={{ opacity: 0, scale: 0.72, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: reduceMotion ? 0.18 : 0.46, delay: reduceMotion ? 0.04 : 0.32, ease: CUT_EASE }}
        >
          go.snkisk.com
        </motion.a>
        <motion.span
          className={`${styles.routeLine} ${styles.routeLineLime}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.54, delay: reduceMotion ? 0.06 : 0.4, ease: SHARP_EASE }}
        />
        <motion.span
          className={`${styles.routeLine} ${styles.routeLineBlue}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.56, delay: reduceMotion ? 0.08 : 0.46, ease: SHARP_EASE }}
        />
        <motion.span
          className={`${styles.routeLine} ${styles.routeLinePink}`}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: reduceMotion ? 0.18 : 0.58, delay: reduceMotion ? 0.1 : 0.52, ease: SHARP_EASE }}
        />
        <span className={`${styles.routeNode} ${styles.routeNodeLime}`} />
        <span className={`${styles.routeNode} ${styles.routeNodeBlue}`} />
        <span className={`${styles.routeNode} ${styles.routeNodePink}`} />
      </div>
      <p className={styles.linkCaption}>A single route. A deliberately simple handoff.</p>
    </MotionFrame>
  );
}

function FlagChatDemo({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className={styles.flagChat} aria-label="Animated Legitils flag notification demo">
      {FLAG_EVENTS.map((event, index) => (
        // Start with an empty alert stack, then let one notification arrive every half second.
        <motion.div
          key={`${event.player}-${event.violation}`}
          className={`${styles.flagRow} ${index === 0 ? styles.flagRowLead : ''}`}
          initial={{ opacity: 0, x: -1400 }}
          animate={
            reduceMotion
              ? { opacity: 1, x: 0 }
              : {
                  opacity: [0, 1, 1, 0.92],
                  x: [-1400, 28, 0, 0],
                }
          }
          transition={{ duration: reduceMotion ? 0.2 : 0.78, delay: reduceMotion ? index * 0.05 : 0.5 + index * 0.5, ease: CUT_EASE }}
        >
          <BrandMark small />
          <p className={styles.pixelChat}>
            <span className={styles.chatBracket}>[</span><span className={styles.chatLegitils}>Legitils</span><span className={styles.chatBracket}>]</span>
            {' '}<span className={`${styles.chatTeam} ${styles[`team${event.team[0].toUpperCase()}${event.team.slice(1)}`]}`}>{event.code}</span>
            {' '}<span className={styles.chatPlayer}>{event.player}</span>
            {' '}<span className={styles.chatFlagged}>flagged</span>
            {' '}<span className={`${styles.chatViolation} ${styles[`violation${event.violation}`]}`}>{event.violation}</span>
            {' '}<span className={styles.chatSeparator}>|</span>{' '}<span className={styles.chatWdr}>[WDR]</span>
          </p>
        </motion.div>
      ))}
    </div>
  );
}

function LegitilsChapter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <MotionFrame className={`${styles.frame} ${styles.legitilsChapter}`} label="MirrorProxy Legitils notification demo">
      <div className={styles.flagNoise} />
      <div className={styles.flagDisc} />
      <div className={styles.flagTraces} />
      <BrandLockup />
      <span className={styles.timecode}>00:00:01:12&nbsp;&nbsp;&nbsp;›››</span>
      <motion.h2
        className={styles.flagTitle}
        initial={{ opacity: 0, y: 90, scale: 0.96, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.22 : 0.66, ease: SHARP_EASE }}
      >
        <span>FLAG</span>
        <span>NOW</span>
      </motion.h2>
      <FlagChatDemo reduceMotion={reduceMotion} />
      <div className={styles.flagFooter}>
        <span>LIVE SIGNAL / BED WARS</span>
        <span>FAIR PLAY, SMART AWARENESS</span>
      </div>
    </MotionFrame>
  );
}

function ProxyChapter({ reduceMotion }: { reduceMotion: boolean }) {
  const routeStyle = { '--delay': '0.1s' } as CSSProperties;

  return (
    <MotionFrame className={`${styles.frame} ${styles.proxyChapter}`} label="MirrorProxy project in progress">
      <div className={styles.proxyBand} />
      <div className={styles.proxyCorner} />
      <BrandLockup />
      <motion.h2
        className={styles.proxyTitle}
        initial={{ opacity: 0, y: 54, scale: 0.97, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: reduceMotion ? 0.22 : 0.66, ease: SHARP_EASE }}
      >
        ROUTE / YOUR VIEW
      </motion.h2>
      <div className={styles.proxyRoute}>
        {['CLIENT', 'MIRRORPROXY', 'HYPIXEL'].map((name, index) => (
          <motion.div
            key={name}
            className={`${styles.proxyNode} ${index === 1 ? styles.proxyNodeMain : ''}`}
            initial={{ opacity: 0, scale: 0.76, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: reduceMotion ? 0.18 : 0.4, delay: reduceMotion ? index * 0.06 : 0.18 + index * 0.16, ease: CUT_EASE }}
            style={index === 1 ? routeStyle : undefined}
          >
            {name}
          </motion.div>
        ))}
        <span className={styles.proxyConnectorOne} />
        <span className={styles.proxyConnectorTwo} />
      </div>
      <div className={styles.proxyMeta}>
        <span>LOCAL RELAY / IN PROGRESS</span>
        <span>PERSONAL VIEW. LIVE MATCH SIGNAL.</span>
      </div>
    </MotionFrame>
  );
}

function MinecraftMark() {
  return (
    <span className={styles.minecraftMark} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}

function MinecraftBlockQueue({ reduceMotion }: { reduceMotion: boolean }) {
  const blocks = useMinecraftBlockQueue(reduceMotion);

  return (
    <div className={styles.minecraftBlockStage} aria-hidden="true">
      <AnimatePresence initial={false}>
        {blocks.map((block, index) => (
          <motion.div
            className={`${styles.minecraftBlock} ${styles[`minecraftBlock${block.tone[0].toUpperCase()}${block.tone.slice(1)}`]}`}
            key={block.id}
            layout={!reduceMotion}
            initial={reduceMotion ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: '115vw', y: 38, rotate: 250, scale: 0.86 }}
            animate={
              reduceMotion
                ? { opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }
                : { opacity: 1, x: 0, y: [20, -9, 0], rotate: [250, -14, 0], scale: [0.86, 1.05, 1] }
            }
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: '-16vw', y: 30, rotate: -170, scale: 0.78 }}
            transition={{
              layout: { duration: reduceMotion ? 0.01 : 0.34, ease: CUT_EASE },
              duration: reduceMotion ? 0.01 : 0.52,
              delay: reduceMotion ? 0 : index === 0 && blocks.length === 1 ? 0.24 : 0,
              ease: CUT_EASE,
            }}
          >
            <span className={styles.minecraftBlockTexture} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function MinecraftChapter({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <MotionFrame className={`${styles.frame} ${styles.minecraftChapter}`} label="mc.snkisk.com Minecraft production">
      <div className={styles.minecraftOrangeSlope} />
      <div className={styles.minecraftLimeSlope} />
      <div className={styles.minecraftGrid} />
      <div className={styles.minecraftPixelField} />
      <div className={styles.minecraftArcLines} />

      <a className={styles.minecraftKicker} href="https://mc.snkisk.com/" aria-label="Open mc.snkisk.com">
        <MinecraftMark />
        <span>mc.snkisk.com</span>
        <b>/</b>
        <em>Minecraft Production</em>
      </a>

      <motion.h2
        className={styles.minecraftTitle}
        initial={{ opacity: 0, x: 76, y: 42, scale: 0.96, filter: 'blur(12px)' }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }
            : { opacity: 1, x: 0, y: [0, -3, 0], scale: 1, filter: 'blur(0px)' }
        }
        transition={{ duration: reduceMotion ? 0.2 : 0.72, ease: SHARP_EASE, y: { duration: 3.8, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span>BUILD</span>
        <span><i>/</i><strong>THE NEXT</strong></span>
        <b>BLOCK</b>
      </motion.h2>

      <MinecraftBlockQueue reduceMotion={reduceMotion} />
      <div className={styles.minecraftFooter}>
        <span>01&nbsp;&nbsp; IDEA <i /> 02&nbsp;&nbsp; BUILD <i /> 03&nbsp;&nbsp; TEST <i /> 04&nbsp;&nbsp; LAUNCH</span>
        <strong>LAUNCHING NOW&nbsp;&nbsp;›››</strong>
      </div>
    </MotionFrame>
  );
}

function HensyokuMateChapter({ reduceMotion }: { reduceMotion: boolean }) {
  const screen = useHensyokuScreen(reduceMotion);

  return (
    <MotionFrame className={`${styles.frame} ${styles.hensyokuChapter}`} label="偏食メイト product demo">
      <div className={styles.hensyokuSun} />
      <div className={styles.hensyokuWave} />
      <div className={styles.hensyokuDots} />
      <div className={styles.hensyokuKicker}>
        偏食メイト <span>/ YOUR PALETTE</span>
        <a href="https://hensyoku-mate.snkisk.com/" className={styles.hensyokuStatus}>hensyoku-mate.snkisk.com <b>IN PROGRESS</b></a>
      </div>

      <motion.h2
        className={styles.hensyokuTitle}
        initial={{ opacity: 0, x: -42, y: 20, filter: 'blur(10px)' }}
        animate={
          reduceMotion
            ? { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' }
            : { opacity: 1, x: 0, y: [0, -2, 0], filter: 'blur(0px)' }
        }
        transition={{ duration: reduceMotion ? 0.2 : 0.68, ease: SHARP_EASE, y: { duration: 4.2, repeat: Infinity, ease: 'easeInOut' } }}
      >
        <span>偏食、</span>
        <strong>治さなくていい。</strong>
      </motion.h2>
      <p className={styles.hensyokuCaption}>食べられるものを起点に、みんなでごはんを決める。</p>

      <div className={styles.hensyokuPhone}>
        <AnimatePresence initial={false} mode="sync">
          <motion.img
            key={screen.id}
            className={`${styles.hensyokuScreen} ${styles[`hensyokuScreen${screen.id[0].toUpperCase()}${screen.id.slice(1)}`]}`}
            src={screen.src}
            alt={screen.alt}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 52, scale: 1.025, filter: 'blur(7px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -32, scale: 0.99, filter: 'blur(5px)' }}
            transition={{ duration: reduceMotion ? 0.18 : 0.5, ease: CUT_EASE }}
          />
        </AnimatePresence>
      </div>

      <motion.div
        className={styles.hensyokuMetric}
        initial={{ opacity: 0, scale: 0.84, filter: 'blur(8px)' }}
        animate={screen.id === 'safe' ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 0.84, filter: 'blur(8px)' }}
        transition={{ duration: reduceMotion ? 0.01 : 0.42, ease: CUT_EASE }}
      >
        <b>45%</b>
        <span>いつもの安全圏</span>
      </motion.div>
      <div className={styles.hensyokuFooter}>PALETTE / CONSULT / REGULARS / RESULT</div>
    </MotionFrame>
  );
}

export default function PortfolioSequence() {
  const reduceMotion = Boolean(useReducedMotion());
  const { cut, cycle } = useShowreelCut(reduceMotion);
  const cutKey = `${cycle}-${cut}`;
  const cutFrameMotion = CUT_FRAME_MOTIONS[cut];

  const activeCut =
    cut === 'links' ? <LinkChapter reduceMotion={reduceMotion} /> :
    cut === 'legitils' ? <LegitilsChapter reduceMotion={reduceMotion} /> :
    cut === 'proxy' ? <ProxyChapter reduceMotion={reduceMotion} /> :
    cut === 'minecraft' ? <MinecraftChapter reduceMotion={reduceMotion} /> :
    cut === 'hensyoku' ? <HensyokuMateChapter reduceMotion={reduceMotion} /> :
    <MotionIntro reduceMotion={reduceMotion} />;

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.sequence} aria-label="Project showreel">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            className={styles.cut}
            key={cutKey}
            data-cut={cut}
            initial={reduceMotion ? { opacity: 0 } : cutFrameMotion.initial}
            animate={reduceMotion ? { opacity: 1 } : cutFrameMotion.animate}
            exit={reduceMotion ? { opacity: 0 } : cutFrameMotion.exit}
            transition={{ duration: reduceMotion ? 0.18 : 0.28, ease: SHARP_EASE }}
          >
            {activeCut}
          </motion.div>
        </AnimatePresence>
        <CutTransition key={`transition-${cutKey}`} cut={cut} reduceMotion={reduceMotion} />
      </main>
    </MotionConfig>
  );
}
