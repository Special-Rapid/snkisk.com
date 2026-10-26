/** All narrative geometry, text reveals and the final fixed-colour handoff share this clock. */
export const DURATION = 17400;
export const HOME_AT = 16600;
export const clamp = (value: number) => Math.max(0, Math.min(1, value));
export const phase = (time: number, start: number, end: number) => clamp((time - start) / (end - start));
export const ease = (time: number, start: number, end: number) => {
  const t = phase(time, start, end); return t * t * (3 - 2 * t);
};
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const mixColour = (a: string, b: string, t: number) => {
  const parse = (s: string) => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16));
  const left = parse(a), right = parse(b);
  return `rgb(${left.map((v, i) => Math.round(mix(v, right[i], t))).join(',')})`;
};
export const FILM = {
  paper: '#fffdf8', ink: '#152033', route: '#0657ef', routeAlt: '#3d078c', cyan: '#00d4ee',
  lime: '#c4ed00', pink: '#f300a6', orange: '#ff7a0d', flagGround: '#f44816', flagShape: '#4531cd',
  blockGround: '#13c5ee', blockFace: '#fb7624', paletteGround: '#fff0dd', paletteFace: '#f8c7df',
  transitionPaper: '#fff8cf', white: '#ffffff', fontDisplay: "'Barlow Condensed', Impact, sans-serif", fontBody: 'system-ui, sans-serif',
  displayWeight: 900, labelWeight: 700, displayTracking: '-0.025em',
} as const;
export type Shape = { x: number; y: number; w: number; h: number; radius: number; angle: number };
export type Part = Shape & { opacity: number; screen: number };
const tweenShape = (a: Shape, b: Shape, t: number): Shape => ({
  x: mix(a.x, b.x, t), y: mix(a.y, b.y, t), w: mix(a.w, b.w, t), h: mix(a.h, b.h, t),
  radius: mix(a.radius, b.radius, t), angle: mix(a.angle, b.angle, t),
});
export function pose(inputTime: number, height = 620) {
  const time = Math.max(0, Math.min(DURATION, inputTime));
  const portrait = height > 900;
  const routeY = height * (portrait ? .61 : .57);
  const discY = height * (portrait ? .53 : .52);
  const blockY = height * (portrait ? .72 + .04 * (1 - phase(height, 901, 1300)) : .55);
  const paletteY = height * (portrait ? .60 : .70);
  const contract = ease(time, 2150, 2750), travel = ease(time, 2600, 3300);
  const expand = ease(time, 3300, 4300), square = ease(time, 6800, 7700);
  const split = ease(time, 7550, 8350), palette = ease(time, 11700, 13100);
  const pill: Shape = { x: mix(-170, 540, ease(time, 0, 900)), y: routeY, w: mix(portrait ? 360 : 278, 32, contract), h: mix(76, 32, contract), radius: mix(38, 16, contract), angle: 0 };
  pill.x = mix(pill.x, 850, travel);
  const discMotion = Math.sin(phase(time, 4300, 6800) * Math.PI);
  const discWidth = 365 + 34 * discMotion;
  const disc: Shape = { x: (portrait ? 500 : 565) + 28 * discMotion, y: discY - 18 * discMotion, w: discWidth, h: 365 - 18 * discMotion, radius: 182.5, angle: 0 };
  const blockSize = portrait ? Math.min(278, height * .22) : 240;
  const block: Shape = { x: portrait ? 550 : 820, y: blockY, w: blockSize, h: blockSize, radius: 9, angle: -10 };
  let core = tweenShape(pill, disc, expand);
  core = tweenShape(core, block, square);
  const cores = [FILM.route, FILM.flagShape, FILM.blockFace, FILM.paletteFace];
  let coreFill: string = mixColour(cores[0], cores[1], expand);
  coreFill = mixColourString(coreFill, cores[2], square);
  coreFill = mixColourString(coreFill, cores[3], palette);
  const size = core.w / 2;
  const scribeLift = portrait ? 0 : ease(time, 7650, 7900);
  const scribeSweep = ease(time, portrait ? 7650 : 7900, portrait ? 8350 : 8550);
  const scribeReturn = ease(time, portrait ? 8350 : 8550, 9300);
  const scribeDock = portrait ? 0 : ease(time, 9300, 9700);
  const laneSize = Math.min(64, height * .1), laneEnd = laneSize / 2 + 8;
  const parts: Part[] = Array.from({ length: 4 }, (_, i) => {
    const sx = i % 2 === 0 ? -1 : 1, sy = i < 2 ? -1 : 1;
    const assembly = Math.sin(phase(time, 8350, 11700) * Math.PI);
    const radians = core.angle * Math.PI / 180;
    const dx = sx * size / 2, dy = sy * size / 2;
    const p: Shape = {
      x: core.x + dx * Math.cos(radians) - dy * Math.sin(radians) + sx * split * (26 + assembly * (portrait ? 32 : 8)),
      y: core.y + dx * Math.sin(radians) + dy * Math.cos(radians) + sy * split * 26 + assembly * (i % 2 === 0 ? -24 : 24),
      w: size, h: size, radius: mix(0, 8, split), angle: core.angle + sx * split * 5 + assembly * (i % 2 === 0 ? -12 : 12),
    };
    // The first real quarter is the printhead: its moving left edge reveals the next type.
    // It returns to the quartet only after leaving a completed visible trail.
    if (i === 0) {
      p.x = mix(mix(p.x, portrait ? 110 : laneEnd, scribeSweep), p.x, scribeReturn);
      if (!portrait) {
        const inLane = scribeLift * (1 - scribeDock);
        p.y = mix(p.y, height * .07, inLane);
        p.w = mix(p.w, laneSize, inLane); p.h = mix(p.h, laneSize, inLane);
        p.angle = mix(p.angle, 0, inLane);
      }
    }
    const screenW = portrait ? Math.min(202, height * .15) : Math.min(126, height * .25);
    const screenH = screenW * 2622 / 1206;
    const destination: Shape = {
      x: portrait ? 500 + sx * 119 : 500 + i * 136,
      y: portrait ? paletteY + sy * (screenH / 2 + 14) : paletteY,
      w: screenW, h: screenH, radius: 16, angle: 0,
    };
    return { ...tweenShape(p, destination, palette), opacity: split, screen: ease(time, 12600 + i * 130, 13200 + i * 130) };
  });
  const printhead = parts[0];
  const projectedHalf = (Math.abs(Math.cos(printhead.angle*Math.PI/180))*printhead.w + Math.abs(Math.sin(printhead.angle*Math.PI/180))*printhead.h) / 2;
  const blockRevealEdge = time < (portrait ? 8350 : 8550) ? printhead.x - projectedHalf : portrait ? 110 - projectedHalf : 8;
  const camera = Math.sin(expand * Math.PI);
  const pan = (500 - mix(850, disc.x, expand)) * camera * .45;
  const scale = 1 + camera * .1;
  let ground: string = mixColour(FILM.paper, FILM.flagGround, expand);
  const colourTurn = ease(time, 7050, 8100);
  ground = colourTurn < .5 ? mixColourString(ground, FILM.transitionPaper, colourTurn * 2) : mixColour(FILM.transitionPaper, FILM.blockGround, colourTurn * 2 - 1);
  ground = mixColourString(ground, FILM.paletteGround, ease(time, 11700, 13000));
  return {
    time, portrait, height, core, parts, coreFill, ground, coreOpacity: 1 - split,
    routeY, blockRevealEdge, scribeSweep, scribeReturn, camera: { pan, scale },
    opening: 1 - ease(time, 0, 1050), routeDraw: ease(time, 600, 1850), contract, travel, expand, square, split, palette,
    goType: 1 - ease(time, 2850, 3350), goExit: ease(time, 2850, 3600),
    legitType: ease(time, 3750, 4350) * (1 - ease(time, 6900, 7450)), legitExit: ease(time, 6850, 7550),
    blockType: Math.min(1, scribeSweep*4) * (1 - ease(time, 11500, 12100)), blockExit: ease(time, 11400, 12200),
    paletteType: ease(time, 12400, 13200),
    handoffCover: ease(time, 16000, HOME_AT), handoffReveal: ease(time, HOME_AT, DURATION),
    showHome: time >= HOME_AT, finished: time >= DURATION,
  };
}
function mixColourString(a: string, b: string, t: number) {
  const values = a.startsWith('#') ? [1, 3, 5].map(i => parseInt(a.slice(i, i + 2), 16)) : a.match(/[\d.]+/g)!.map(Number);
  const target = [1, 3, 5].map(i => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${values.map((v, i) => Math.round(mix(v, target[i], t))).join(',')})`;
}

/** Display roles are authored in film viewBox units, separate from utility UI typography. */
export const FILM_TYPE = {
  routeTitle: [148,175], routeSubtitle: [130,158], flagWord: [230,270], blockWord: [160,188], blockMiddle: [120,162],
  flagBrand: [42,58], projectLabel: [32,50], routeLabel: [22,44], mealJaFirst: 98, mealEnFirst: 112, mealJaSecond: [83,92], mealEnSecond: 92,
} as const;
