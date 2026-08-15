import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const FPS = 30;
const CUT_DURATION = 108;
const CUTS = [
  {id: "LINKS", label: "go.snkisk.com", color: "#6f60ff", accent: "#63f0ff", ink: "#f7f6ff"},
  {id: "LEGITILS", label: "observe, don't accuse", color: "#ff713b", accent: "#ceff34", ink: "#1c1a2a"},
  {id: "PROXY", label: "MirrorProxy", color: "#1263d6", accent: "#79f7f7", ink: "#f4ffff"},
  {id: "MINECRAFT", label: "production build", color: "#5a944b", accent: "#ffde72", ink: "#fbffe4"},
  {id: "HENSYOKU", label: "偏食、治さなくていい。", color: "#ffb28e", accent: "#7d4039", ink: "#5a302d"},
] as const;

type Cut = (typeof CUTS)[number];

const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
const enter = (frame: number, delay = 0) => spring({fps: FPS, frame: frame - delay, config: {damping: 22, mass: 0.62, stiffness: 170}});
const map = (frame: number, input: number[], output: number[]) => interpolate(frame, input, output, {...clamp, easing: easeOut});

const FrameLabel: React.FC<{cut: Cut; localFrame: number}> = ({cut, localFrame}) => {
  const appear = enter(localFrame, 5);
  return (
    <div className="frame-label" style={{opacity: appear, translate: `${map(appear, [0, 1], [-46, 0])}px 0`}}>
      <span>SELECTED / 2026</span><strong>{cut.id}</strong><i /><span>{String(Math.min(99, Math.round((localFrame / CUT_DURATION) * 100))).padStart(2, "0")}</span>
    </div>
  );
};

const RailField: React.FC<{frame: number; color: string}> = ({frame, color}) => (
  <div className="rail-field" aria-hidden="true">
    {Array.from({length: 13}, (_, index) => {
      const lane = index - 6;
      const rush = ((frame * (1.25 + (index % 3) * 0.14) + index * 17) % 150) / 150;
      return <i key={index} style={{backgroundColor: color, opacity: 0.18 + rush * 0.48, width: `${8 + rush * 62}vw`, translate: `${lane * 12}vw ${lane * 5.2}vh`, scale: 0.2 + rush * 1.1}} />;
    })}
  </div>
);

const LinksCut: React.FC<{frame: number; cut: Cut}> = ({frame, cut}) => {
  const urlEnter = enter(frame, 13);
  const urlExit = map(frame, [74, 102], [0, 1]);
  const slash = enter(frame, 32);
  return <>
    <RailField frame={frame} color={cut.accent} />
    <div className="links-grid" style={{rotate: `${-15 + frame * 0.09}deg`, scale: 0.84 + frame * 0.004}} />
    <div className="url-orb" style={{scale: 0.35 + urlEnter * 0.77 + urlExit * 1.7, rotate: `${-19 + urlEnter * 21 + urlExit * 13}deg`, translate: `${-120 + urlEnter * 130 - urlExit * 410}px ${62 - urlEnter * 68 + urlExit * 150}px`, opacity: 1 - urlExit * 0.35}}><span>https://</span><b>go</b><em>.snkisk.com</em></div>
    <div className="slash-word" style={{opacity: slash, scale: 0.4 + slash * 0.8, rotate: `${-30 + slash * 22}deg`}}>SHORT<br />CUT</div>
  </>;
};

const LegitilsCut: React.FC<{frame: number; cut: Cut}> = ({frame, cut}) => {
  const sphere = enter(frame, 5);
  const card = enter(frame, 24);
  return <>
    <RailField frame={frame} color={cut.accent} />
    <div className="legit-sphere sphere-back" style={{scale: 0.5 + sphere * 1.35, translate: `${360 - sphere * 450}px ${-160 + sphere * 220}px`, rotate: `${-40 + sphere * 36}deg`}} />
    <div className="legit-sphere sphere-front" style={{scale: 0.12 + sphere * 1.08, translate: `${-250 + sphere * 320}px ${300 - sphere * 340}px`, rotate: `${40 - sphere * 63}deg`}} />
    <div className="flag-stack" style={{opacity: card, translate: `${200 - card * 200}px ${-100 + card * 100}px`, rotate: `${12 - card * 12}deg`, scale: 0.78 + card * 0.22}}><span>OBSERVATION // 04</span><b>UNUSUAL</b><em>never a verdict</em></div>
    <div className="legit-word" style={{opacity: sphere, translate: `${-100 + sphere * 100}px ${180 - sphere * 180}px`, scale: 1.25 - sphere * 0.25}}>LEGIT<br />FIRST</div>
  </>;
};

const ProxyCut: React.FC<{frame: number; cut: Cut}> = ({frame, cut}) => {
  const portal = enter(frame, 10);
  const logo = enter(frame, 26);
  return <>
    <div className="tunnel" style={{scale: 0.45 + frame * 0.018, rotate: `${-16 + frame * 0.22}deg`}}>{Array.from({length: 10}, (_, index) => <i key={index} style={{inset: `${index * 7}%`, opacity: 0.12 + index * 0.07}} />)}</div>
    <div className="proxy-portal" style={{scale: 0.15 + portal * 1.3, rotate: `${50 - portal * 73}deg`, opacity: portal}}><i /><i /><i /><i /></div>
    <div className="proxy-lockup" style={{opacity: logo, scale: 0.35 + logo * 0.72, translate: `${-420 + logo * 420}px ${170 - logo * 170}px`}}><span>Mirror</span><b>Proxy</b></div>
    <div className="proxy-caption" style={{opacity: logo}}>CLIENT → LOCAL → MIRROR</div>
  </>;
};

const Block: React.FC<{index: number; frame: number}> = ({index, frame}) => {
  const progress = enter(frame, 5 + index * 7);
  const angle = index * 51;
  return <i className="voxel" style={{rotate: `${angle - progress * 20}deg`, translate: `${Math.cos(angle) * (490 - progress * 290)}px ${Math.sin(angle) * (260 - progress * 160)}px`, scale: 0.25 + progress * (0.7 + (index % 2) * 0.12), opacity: progress}} />;
};

const MinecraftCut: React.FC<{frame: number; cut: Cut}> = ({frame}) => {
  const title = enter(frame, 34);
  return <>
    <div className="sun-disk" style={{scale: 0.2 + enter(frame, 4) * 1.4, translate: `${350 - frame * 4}px ${-200 + frame * 2}px`}} />
    <div className="voxel-world" style={{rotate: `${-7 + frame * 0.1}deg`, scale: 0.83 + frame * 0.006}}>{Array.from({length: 9}, (_, index) => <Block key={index} index={index} frame={frame} />)}</div>
    <div className="craft-title" style={{opacity: title, translate: `${-300 + title * 300}px ${160 - title * 160}px`, scale: 0.46 + title * 0.6}}>BUILD<br /><b>FORWARD</b></div>
    <div className="craft-stamp" style={{opacity: title, rotate: `${20 - title * 20}deg`}}>WORLD<br />01</div>
  </>;
};

const HensyokuCut: React.FC<{frame: number; cut: Cut}> = ({frame, cut}) => {
  const phone = enter(frame, 8);
  const copy = enter(frame, 37);
  return <>
    <RailField frame={frame} color={cut.accent} />
    <div className="orbit orbit-one" style={{scale: 0.3 + phone * 1.25, rotate: `${-70 + phone * 104}deg`, opacity: phone}} /><div className="orbit orbit-two" style={{scale: 0.15 + phone * 1.48, rotate: `${80 - phone * 128}deg`, opacity: phone * 0.78}} />
    <div className="mate-phone" style={{scale: 0.3 + phone * 0.78, rotate: `${25 - phone * 19}deg`, translate: `${-220 + phone * 250}px ${210 - phone * 240}px`, opacity: phone}}><div className="phone-screen"><span>palette</span><b>OK</b><i /><i /><i /></div></div>
    <div className="mate-copy" style={{opacity: copy, translate: `${270 - copy * 270}px ${-150 + copy * 150}px`, rotate: `${-12 + copy * 12}deg`}}><span>YOUR PLATE, YOUR RULES</span><strong>偏食、<br />治さなくていい。</strong></div>
  </>;
};

const SmashCut: React.FC<{frame: number; cut: Cut; next: Cut}> = ({frame, cut, next}) => {
  const progress = map(frame, [CUT_DURATION - 20, CUT_DURATION - 2], [0, 1]);
  if (progress <= 0) return null;
  return <div className="smash-cut" style={{opacity: interpolate(progress, [0, 0.12, 0.8, 1], [0, 1, 1, 0], clamp)}}><div style={{backgroundColor: cut.accent, clipPath: `polygon(0 0, ${progress * 150}% 0, ${progress * 85}% 100%, 0 100%)`}} /><div style={{backgroundColor: next.color, clipPath: `polygon(${100 - progress * 140}% 0, 100% 0, 100% 100%, ${100 - progress * 72}% 100%)`}} /><b style={{scale: 0.2 + progress * 2.1, rotate: `${-18 + progress * 33}deg`, opacity: 1 - progress}}>///</b></div>;
};

const Scene: React.FC<{cut: Cut; localFrame: number}> = ({cut, localFrame}) => {
  const cutIndex = CUTS.indexOf(cut);
  const next = CUTS[(cutIndex + 1) % CUTS.length];
  const cameraIn = enter(localFrame);
  const cameraOut = map(localFrame, [84, CUT_DURATION], [0, 1]);
  const commonStyle = {backgroundColor: cut.color, color: cut.ink, scale: 1.17 - cameraIn * 0.17 + cameraOut * 0.22, rotate: `${(1 - cameraIn) * (cutIndex % 2 === 0 ? -3 : 3) + cameraOut * (cutIndex % 2 === 0 ? 8 : -8)}deg`, translate: `${(1 - cameraIn) * (cutIndex % 2 === 0 ? -140 : 140) + cameraOut * (cutIndex % 2 === 0 ? 310 : -310)}px ${(1 - cameraIn) * 80 - cameraOut * 120}px`};
  return <AbsoluteFill className="scene" style={commonStyle}>
    <div className="grain" /><FrameLabel cut={cut} localFrame={localFrame} />
    {cutIndex === 0 && <LinksCut frame={localFrame} cut={cut} />}{cutIndex === 1 && <LegitilsCut frame={localFrame} cut={cut} />}{cutIndex === 2 && <ProxyCut frame={localFrame} cut={cut} />}{cutIndex === 3 && <MinecraftCut frame={localFrame} cut={cut} />}{cutIndex === 4 && <HensyokuCut frame={localFrame} cut={cut} />}
    <div className="scene-footer"><span>{cut.label}</span><span>CAMERA STUDY / {String(cutIndex + 1).padStart(2, "0")}</span></div><SmashCut frame={localFrame} cut={cut} next={next} />
  </AbsoluteFill>;
};

export const MyComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cutIndex = Math.min(CUTS.length - 1, Math.floor(frame / CUT_DURATION));
  return <AbsoluteFill style={{backgroundColor: "#101010"}}><Scene cut={CUTS[cutIndex]} localFrame={frame - cutIndex * CUT_DURATION} /><div className="safe-frame" style={{width, height}} /></AbsoluteFill>;
};
