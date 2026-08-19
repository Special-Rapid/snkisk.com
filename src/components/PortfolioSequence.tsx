import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react';
import type { TargetAndTransition } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { useEffect, useState } from 'react';
import styles from './PortfolioSequence.module.css';

const CUT_EASE: [number, number, number, number] = [0.18, 0.89, 0.32, 1.08];
const SHARP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const SHOWREEL_DURATION_MS = 19900;

const SHOWREEL_CUTS = [
  { id: 'links', startMs: 0, endMs: 3400 },
  { id: 'legitils', startMs: 3400, endMs: 7600 },
  { id: 'proxy', startMs: 7600, endMs: 11000 },
  { id: 'minecraft', startMs: 11000, endMs: 15400 },
  { id: 'hensyoku', startMs: 15400, endMs: SHOWREEL_DURATION_MS },
] as const;

type ShowreelCutId = (typeof SHOWREEL_CUTS)[number]['id'];
type IntermediateTransition = {
  from: ShowreelCutId;
  to: Exclude<ShowreelCutId, 'links'>;
  id: string;
};

const EDITORIAL_SWITCH_MS = 840;
const EDITORIAL_TRANSITION_MS = 1480;

type CutFrameMotion = {
  initial: TargetAndTransition;
  animate: TargetAndTransition;
  exit: TargetAndTransition;
};

const CUT_FRAME_MOTIONS: Record<ShowreelCutId, CutFrameMotion> = {
  links: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  legitils: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  proxy: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  minecraft: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
  hensyoku: { initial: { opacity: 1 }, animate: { opacity: 1 }, exit: { opacity: 1 } },
};

function useShowreelCut(reduceMotion: boolean, onComplete: () => void) {
  const [cut, setCut] = useState<ShowreelCutId>('links');
  const [cycle, setCycle] = useState(0);
  const [transition, setTransition] = useState<IntermediateTransition | null>(null);

  useEffect(() => {
    const timeoutIds: number[] = [];
    const addTimeout = (callback: () => void, delay: number) => {
      timeoutIds.push(window.setTimeout(callback, delay));
    };

    const playCut = (cutIndex: number) => {
      const activeCut = SHOWREEL_CUTS[cutIndex];
      setCut(activeCut.id);
      setCycle(cutIndex);

      const duration = activeCut.endMs - activeCut.startMs;
      if (cutIndex === SHOWREEL_CUTS.length - 1) {
        addTimeout(onComplete, reduceMotion ? Math.max(1600, duration) : duration);
        return;
      }

      const nextCut = SHOWREEL_CUTS[cutIndex + 1].id;
      const leadMs = reduceMotion ? 150 : EDITORIAL_SWITCH_MS;
      const transitionMs = reduceMotion ? 260 : EDITORIAL_TRANSITION_MS;

      // Start over the outgoing composition, hit the edit while fully covered, then ease out on the incoming one.
      addTimeout(() => {
        setTransition({ from: activeCut.id, to: nextCut as Exclude<ShowreelCutId, 'links'>, id: `${activeCut.id}-${nextCut}-${cutIndex}` });
        addTimeout(() => setTransition(null), transitionMs);
      }, Math.max(0, duration - leadMs));

      addTimeout(() => {
        playCut(cutIndex + 1);
      }, duration);
    };

    playCut(0);
    return () => timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
  }, [onComplete, reduceMotion]);

  return { cut, cycle, transition };
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

const HENSYOKU_SAFE_SCREEN = {
  src: 'https://images.snkisk.com/snkisk.com/images/4fc567c0-54f6-438b-9adf-81b3d3f550be.png',
  alt: '偏食メイトの安全圏画面',
};

const MINECRAFT_BLOCK_TONES: MinecraftBlockTone[] = ['grass', 'deepslate', 'water', 'quartz', 'craft', 'ore'];
const MINECRAFT_BLOCK_COUNT = 5;

function getMinecraftBlockTone(id: number): MinecraftBlockTone {
  return MINECRAFT_BLOCK_TONES[id % MINECRAFT_BLOCK_TONES.length];
}

function createMinecraftBlockSet(): MinecraftBlock[] {
  return Array.from({ length: MINECRAFT_BLOCK_COUNT }, (_, id) => ({ id, tone: getMinecraftBlockTone(id) }));
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

const OPENING_WIPE_PARTICLES = Array.from({ length: 48 }, (_, index) => ({
  id: `opening-particle-${index}`,
  lane: (index * 19) % 114 - 14,
  length: 2.4 + (index % 7) * 1.9,
  delay: 0.02 + (index % 12) * 0.047,
  duration: 0.22 + (index % 6) * 0.045,
  intensity: index % 4 === 0 ? 'long' : index % 3 === 0 ? 'soft' : 'sharp',
  tone: index % 6 === 0 ? 'cyan' : index % 5 === 0 ? 'warm' : 'white',
}));

function OpeningDiagonalWipe({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      className={styles.openingWipe}
      aria-hidden="true"
      data-reduced-motion={reduceMotion || undefined}
    >
      {/* Open with the same color band language that remains at the bottom of the first frame. */}
      <div className={styles.openingWipeField}>
        {[styles.openingWipeBlue, styles.openingWipeViolet, styles.openingWipePink, styles.openingWipeOrange].map((className, index) => (
          <i className={`${styles.openingWipeBand} ${className}`} key={className} style={{ '--opening-index': index } as CSSProperties}>
            {/* Edge trails make the color bands feel like they cut through the frame, rather than simply cover it. */}
            <i className={styles.openingWipeTrail} />
          </i>
        ))}
        <div className={styles.openingWipeParticles}>
          {OPENING_WIPE_PARTICLES.map((particle) => (
            <i
              className={`${styles.openingWipeParticle} ${styles[`openingWipeParticle${particle.tone[0].toUpperCase()}${particle.tone.slice(1)}`]}`}
              key={particle.id}
              style={{
                '--particle-lane': `${particle.lane}%`,
                '--particle-length': `${particle.length}rem`,
                '--particle-delay': `${particle.delay}s`,
                '--particle-duration': `${particle.duration}s`,
                '--particle-opacity': particle.intensity === 'long' ? 0.68 : particle.intensity === 'soft' ? 0.5 : 0.92,
                '--particle-blur': particle.intensity === 'long' ? '0.85rem' : particle.intensity === 'soft' ? '0.52rem' : '0.24rem',
                '--particle-scale': particle.intensity === 'long' ? 2.1 : particle.intensity === 'soft' ? 1.6 : 1.2,
              } as CSSProperties}
            />
          ))}
        </div>
        <i className={styles.openingWipeFlash} />
      </div>
    </div>
  );
}

function OpeningCapsuleTransition({ reduceMotion }: { reduceMotion: boolean }) {
  const transition = { duration: reduceMotion ? 0.01 : 0.98, times: [0, 0.48, 1], ease: CUT_EASE };

  return (
    <motion.div
      className={styles.cutTransition}
      aria-hidden="true"
      data-kind="capsule"
      initial={{ opacity: 1 }}
      animate={reduceMotion ? { opacity: 0 } : { opacity: [1, 1, 0] }}
      transition={transition}
    >
      <motion.div
        className={styles.transitionCapsule}
        initial={{ scaleX: 0, scaleY: 0.38 }}
        animate={{ scaleX: [0, 1.18, 1.18], scaleY: [0.38, 1, 1], opacity: [1, 1, 0] }}
        transition={transition}
      />
    </motion.div>
  );
}

function MatchCutTransition({ transition, reduceMotion }: { transition: IntermediateTransition; reduceMotion: boolean }) {
  const kind = `${transition.from}-${transition.to}`;

  return (
    <div className={styles.matchTransition} data-kind={kind} data-reduced-motion={reduceMotion || undefined} aria-hidden="true">
      {kind === 'links-legitils' ? (
        <div className={styles.signalFlagTransition}>
          <i className={styles.signalFlagLine} />
          <i className={styles.signalFlagLineEcho} />
          <b className={styles.signalFlagWord}>FLAG</b>
          <span className={styles.signalFlagCorner} />
        </div>
      ) : null}
      {kind === 'legitils-proxy' ? (
        <div className={styles.markRouteTransition}>
          <span className={styles.markRoutePieces}>{Array.from({ length: 4 }, (_, index) => <i key={index} />)}</span>
          <span className={styles.markRouteGrid}>{Array.from({ length: 6 }, (_, index) => <i key={index} />)}</span>
          <b>ROUTE</b>
        </div>
      ) : null}
      {kind === 'proxy-minecraft' ? (
        <div className={styles.routeBlockTransition}>
          <span className={styles.routeBlockRails}>{Array.from({ length: 8 }, (_, index) => <i key={index} />)}</span>
          <span className={styles.routeBlockTiles}>{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</span>
        </div>
      ) : null}
      {kind === 'minecraft-hensyoku' ? (
        <div className={styles.blockOrbitTransition}>
          <span className={styles.blockOrbitTiles}>{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</span>
          <span className={styles.blockOrbitRing} />
          <b className={styles.blockOrbitWord}>PALETTE</b>
        </div>
      ) : null}
    </div>
  );
}

function MotionFrame({ className, children, label }: MotionFrameProps) {
  return (
    <section className={className} aria-label={label}>
      {children}
    </section>
  );
}

function LinkChapter() {
  return (
    <MotionFrame className={`${styles.frame} ${styles.linkChapter}`} label="go.snkisk.com link service">
      <div className={styles.linkTopBand} />
      <div className={styles.linkBottomBands} />
      <div className={styles.linkDecorLine} />
      <h2 className={styles.linkTitle}>
        <span className={styles.linkTitleFirst}>ONE LINK</span>
        <span>/ MANY WAYS</span>
      </h2>

      <div className={styles.routeStage}>
        {/* The route label is the single source; the lines visibly branch into separate destinations. */}
        <a href="https://go.snkisk.com/" className={styles.routeLabel}>go.snkisk.com</a>
        <span className={`${styles.routeLine} ${styles.routeLineLime}`} />
        <span className={`${styles.routeLine} ${styles.routeLineBlue}`} />
        <span className={`${styles.routeLine} ${styles.routeLinePink}`} />
        <span className={`${styles.routeNode} ${styles.routeNodeLime}`} />
        <span className={`${styles.routeNode} ${styles.routeNodeBlue}`} />
        <span className={`${styles.routeNode} ${styles.routeNodePink}`} />
      </div>
      <p className={styles.linkCaption}>A single route. A deliberately simple handoff.</p>
    </MotionFrame>
  );
}

function FlagChatDemo() {
  return (
    <div className={styles.flagChat} aria-label="Animated Legitils flag notification demo">
      {FLAG_EVENTS.map((event, index) => (
        <div
          key={`${event.player}-${event.violation}`}
          className={`${styles.flagRow} ${index === 0 ? styles.flagRowLead : ''}`}
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
        </div>
      ))}
    </div>
  );
}

function LegitilsChapter() {
  return (
    <MotionFrame className={`${styles.frame} ${styles.legitilsChapter}`} label="MirrorProxy Legitils notification demo">
      <div className={styles.flagNoise} />
      <div className={styles.flagDisc} />
      <div className={styles.flagTraces} />
      <BrandLockup />
      <span className={styles.timecode}>00:00:01:12&nbsp;&nbsp;&nbsp;›››</span>
      <h2 className={styles.flagTitle}>
        <span>FLAG</span>
        <span>NOW</span>
      </h2>
      <FlagChatDemo />
      <div className={styles.flagFooter}>
        <span>LIVE SIGNAL / BED WARS</span>
        <span>FAIR PLAY, SMART AWARENESS</span>
      </div>
    </MotionFrame>
  );
}

function ProxyChapter() {
  return (
    <MotionFrame className={`${styles.frame} ${styles.proxyChapter}`} label="MirrorProxy project in progress">
      <div className={styles.proxyBand} />
      <div className={styles.proxyCorner} />
      <BrandLockup />
      <h2 className={styles.proxyTitle}>ROUTE / YOUR VIEW</h2>
      <div className={styles.proxyRoute}>
        {['CLIENT', 'MIRRORPROXY', 'HYPIXEL'].map((name, index) => (
          <div
            key={name}
            className={`${styles.proxyNode} ${index === 1 ? styles.proxyNodeMain : ''}`}
          >
            {name}
          </div>
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

function MinecraftBlockQueue() {
  const blocks = createMinecraftBlockSet();

  return (
    <div className={styles.minecraftBlockStage} aria-hidden="true">
      {blocks.map((block) => (
          <div
            className={`${styles.minecraftBlock} ${styles[`minecraftBlock${block.tone[0].toUpperCase()}${block.tone.slice(1)}`]}`}
            key={block.id}
          >
            <span className={styles.minecraftBlockTexture} />
          </div>
        ))}
    </div>
  );
}

function MinecraftChapter() {
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

      <h2 className={styles.minecraftTitle}>
        <span>BUILD</span>
        <span><i>/</i><strong>THE NEXT</strong></span>
        <b>BLOCK</b>
      </h2>

      <MinecraftBlockQueue />
      <div className={styles.minecraftFooter}>
        <span>01&nbsp;&nbsp; IDEA <i /> 02&nbsp;&nbsp; BUILD <i /> 03&nbsp;&nbsp; TEST <i /> 04&nbsp;&nbsp; LAUNCH</span>
        <strong>LAUNCHING NOW&nbsp;&nbsp;›››</strong>
      </div>
    </MotionFrame>
  );
}

function HensyokuMateChapter() {
  return (
    <MotionFrame className={`${styles.frame} ${styles.hensyokuChapter}`} label="偏食メイト product demo">
      <div className={styles.hensyokuSun} />
      <div className={styles.hensyokuWave} />
      <div className={styles.hensyokuDots} />
      <div className={styles.hensyokuKicker}>
        偏食メイト <span>/ YOUR PALETTE</span>
        <a href="https://hensyoku-mate.snkisk.com/" className={styles.hensyokuStatus}>hensyoku-mate.snkisk.com <b>IN PROGRESS</b></a>
      </div>

      <h2 className={styles.hensyokuTitle}>
        <span>偏食、</span>
        <strong>治さなくていい。</strong>
      </h2>
      <p className={styles.hensyokuCaption}>食べられるものを起点に、みんなでごはんを決める。</p>

      <div className={styles.hensyokuPhone}>
        <img className={`${styles.hensyokuScreen} ${styles.hensyokuScreenSafe}`} src={HENSYOKU_SAFE_SCREEN.src} alt={HENSYOKU_SAFE_SCREEN.alt} />
      </div>

      <div className={styles.hensyokuMetric}>
        <b>45%</b>
        <span>いつもの安全圏</span>
      </div>
      <div className={styles.hensyokuFooter}>PALETTE / CONSULT / REGULARS / RESULT</div>
    </MotionFrame>
  );
}

type PortfolioSequenceProps = {
  onComplete: () => void;
};

export default function PortfolioSequence({ onComplete }: PortfolioSequenceProps) {
  const reduceMotion = Boolean(useReducedMotion());
  const { cut, cycle, transition } = useShowreelCut(reduceMotion, onComplete);
  const cutKey = `${cycle}-${cut}`;
  const cutFrameMotion = CUT_FRAME_MOTIONS[cut];

  const activeCut =
    cut === 'links' ? <LinkChapter /> :
    cut === 'legitils' ? <LegitilsChapter /> :
    cut === 'proxy' ? <ProxyChapter /> :
    cut === 'minecraft' ? <MinecraftChapter /> :
    <HensyokuMateChapter />;

  return (
    <MotionConfig reducedMotion="user">
      <main className={styles.sequence} aria-label="Project showreel">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            className={styles.cut}
            key={cutKey}
            data-cut={cut}
            initial={reduceMotion ? { opacity: 0 } : cutFrameMotion.initial}
            animate={reduceMotion ? { opacity: 1 } : cutFrameMotion.animate}
            exit={reduceMotion ? { opacity: 0 } : cutFrameMotion.exit}
            transition={{ duration: reduceMotion ? 0.18 : 0.01, ease: SHARP_EASE }}
          >
            {activeCut}
          </motion.div>
        </AnimatePresence>
        <OpeningDiagonalWipe reduceMotion={reduceMotion} />
        {cut === 'links' && cycle === 0 ? <OpeningCapsuleTransition reduceMotion={reduceMotion} /> : null}
        {transition ? <MatchCutTransition key={transition.id} transition={transition} reduceMotion={reduceMotion} /> : null}
      </main>
    </MotionConfig>
  );
}
