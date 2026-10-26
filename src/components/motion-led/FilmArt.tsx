import { FILM, FILM_TYPE, ease, mix, pose } from './timeline';
import { screens } from './media';
import BrandMark, { BrandDefinitions } from './BrandMark';
import { copy, FILM_COPY, type Locale } from './copy';

/** Pure art shared by the live player and deterministic motion-verification export. */
export default function FilmArt({ time, height = 620, locale }: { time: number; height?: number; locale: Locale }) {
  const p = pose(time, height), h = height, mobile = p.portrait;
  const text = copy[locale];
  const face = p.core;
  const artScale = mobile ? 1 : Math.min(1, h / 620);
  const role = (values: readonly [number,number]) => values[mobile ? 1 : 0] * artScale;
  const blockSize = (values: readonly [number,number]) => role(values) * (mobile ? Math.min(1, h / 1700) : 1);
  const paletteScale = mobile ? Math.min(1, h / 1200) : artScale;
  const display = { fontFamily: FILM.fontDisplay, fontWeight: FILM.displayWeight, letterSpacing: FILM.displayTracking };
  const bandShift = p.expand * 260 - p.square * 110 + p.palette * 140;
  const routeTail = (1 - p.square) * p.routeDraw;
  const clipX = mix(face.x - face.w / 2, 0, ease(p.time, 3900, 4500));
  const clipY = mix(face.y - face.h / 2, 0, ease(p.time, 3900, 4500));
  const clipW = mix(face.w, 1000, ease(p.time, 3900, 4500));
  const clipH = mix(face.h, h, ease(p.time, 3900, 4500));
  return <svg viewBox={`0 0 1000 ${h}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false" data-film-art="true">
    <defs>
      <BrandDefinitions/>
      <clipPath id="film-disc-type"><rect x={clipX} y={clipY} width={clipW} height={clipH}/></clipPath>
      <clipPath id="film-block-type"><rect x={Math.max(0,p.blockRevealEdge)} y={0} width={1000-Math.max(0,p.blockRevealEdge)} height={h}/></clipPath>
      {p.parts.map((part,i)=><clipPath id={`film-screen-${i}`} key={i}><rect x={-part.w/2} y={-part.h/2} width={part.w} height={part.h} rx={part.radius}/></clipPath>)}
    </defs>
    <rect width="1000" height={h} fill={p.ground}/>
    {/* These colour planes persist; their geometry drifts with the same carrier clock. */}
    <g opacity={1 - p.palette * .75} transform={`translate(${bandShift} 0)`}>
      <path d={`M -250 ${h} L 540 ${h*.72} L 1050 ${h} Z`} fill={FILM.route}/>
      <path d={`M 0 ${h} L 770 ${h*.74} L 1190 ${h} Z`} fill={FILM.flagShape}/>
      <path d={`M 390 ${h} L 1020 ${h*.69} L 1270 ${h} Z`} fill={FILM.pink}/>
      <path d={`M 760 ${h} L 1270 ${h*.73} L 1350 ${h} Z`} fill={FILM.orange}/>
    </g>
    <g transform={`translate(${p.camera.pan} 0) translate(500 ${h/2}) scale(${p.camera.scale}) translate(-500 ${-h/2})`}>
      <g opacity={routeTail} fill="none" strokeWidth="3">
        <path d={`M 540 ${p.routeY} C 710 ${p.routeY} 640 ${p.routeY-170} 850 ${p.routeY-170}`} stroke={FILM.lime} pathLength="1" strokeDasharray="1" strokeDashoffset={1-p.routeDraw}/>
        <path d={`M 540 ${p.routeY} H ${Math.max(540,face.x)}`} stroke={FILM.route}/>
        <path d={`M 540 ${p.routeY} C 710 ${p.routeY} 660 ${p.routeY+150} 850 ${p.routeY+150}`} stroke={FILM.pink} pathLength="1" strokeDasharray="1" strokeDashoffset={1-p.routeDraw}/>
        <circle cx="850" cy={p.routeY-170} r="30" stroke={FILM.lime}/>
        <path d={`M 850 ${p.routeY+118} l 28 16 v 32 l -28 16 -28 -16 v -32 Z`} stroke={FILM.pink}/>
      </g>
      {/* One persistent object and its four persistent quarter pieces, never keyed scene replacements. */}
      <g data-carrier="true"><g transform={`translate(${face.x} ${face.y}) rotate(${face.angle})`} opacity={p.coreOpacity}>
        <rect x={-face.w/2} y={-face.h/2} width={face.w} height={face.h} rx={face.radius} fill={p.coreFill}/>
        <rect x={-face.w/2-7} y={-face.h/2-7} width={face.w+14} height={face.h+14} rx={face.radius+7} fill="none" stroke={FILM.white} strokeWidth="2" opacity={(1-p.expand)*.8}/>
        <text textAnchor="middle" dominantBaseline="central" fill={FILM.white} fontFamily={FILM.fontBody} fontSize={FILM_TYPE.routeLabel[mobile ? 1 : 0]} fontWeight={FILM.labelWeight} opacity={1-p.contract}>{FILM_COPY.routeAddress}</text>
      </g>

      </g>
      <g opacity={p.goType} transform={`translate(${-p.goExit*1100} 0)`} style={display}>
        <text x="55" y={h*(mobile?.19:.29)} fill={FILM.route} fontSize={role(FILM_TYPE.routeTitle)}>{FILM_COPY.routeFirst}</text>
        <text x="55" y={h*(mobile?.32:.48)} fill={FILM.routeAlt} fontSize={role(FILM_TYPE.routeSubtitle)}>{FILM_COPY.routeSecond}</text>
      </g>
      <g opacity={p.legitType} clipPath="url(#film-disc-type)" transform={`translate(${-p.legitExit*1150} 0)`} style={display}>
        <g transform={`translate(55 ${h*(mobile?.11:.13)-36}) scale(.8)`}><BrandMark/></g>
        <text x="110" y={h*(mobile?.11:.13)} fontWeight={FILM.labelWeight} fontSize={role(FILM_TYPE.flagBrand)} fill="url(#film-brand)" fontFamily={FILM.fontBody}>{FILM_COPY.legitils}</text>
        <text x={mobile?120:65} y={h*(mobile?.4:.47)} fontSize={role(FILM_TYPE.flagWord)} fill={FILM.white}>{FILM_COPY.flagFirst}</text>
        <text x={mobile?350:480} y={h*(mobile?.64:.85)} fontSize={role(FILM_TYPE.flagWord)} fill={FILM.white}>{FILM_COPY.flagSecond}</text>
      </g>
      <path d={`M ${p.blockRevealEdge} ${mobile ? h*.17 : p.parts[0].y+p.parts[0].h/2} V ${h*.88}`} stroke={FILM.orange} strokeWidth="4" opacity={p.blockType*(1-p.scribeReturn)} />
      <g data-block-type="true" opacity={p.blockType} clipPath="url(#film-block-type)" transform={`translate(${-p.blockExit*1050} 0)`} style={display}>
        <text x="55" y={h*(mobile?.16:.23)} fontSize={blockSize(FILM_TYPE.projectLabel)} fill={FILM.ink} fontFamily={FILM.fontBody}>{FILM_COPY.minecraft}</text>
        <text x="55" y={h*(mobile?.3:.44)} fontSize={blockSize(FILM_TYPE.blockWord)} fill={FILM.ink}>{FILM_COPY.buildFirst}</text>
        <text x="55" y={h*(mobile?.42:.63)} fontSize={blockSize(FILM_TYPE.blockMiddle)} fill={FILM.routeAlt}>{FILM_COPY.buildSecond}</text>
        <text x="55" y={h*(mobile?.55:.84)} fontSize={blockSize(FILM_TYPE.blockWord)} fill={FILM.ink}>{FILM_COPY.buildThird}</text>
      </g>
      <g data-palette-type="true" opacity={p.paletteType} style={display}>
        <text x="55" y={h*(mobile?.14:.19)} fill={FILM.ink} fontFamily={locale==='ja'?FILM.fontBody:FILM.fontDisplay} fontSize={(locale==='ja'?FILM_TYPE.mealJaFirst:FILM_TYPE.mealEnFirst)*paletteScale}>{text.hensyokuTitle}</text>
        <text x="55" y={h*(mobile?.24:.39)} fill={FILM.ink} fontFamily={locale==='ja'?FILM.fontBody:FILM.fontDisplay} fontSize={(locale==='ja'?FILM_TYPE.mealJaSecond[mobile ? 1 : 0]:FILM_TYPE.mealEnSecond)*paletteScale}>{text.hensyokuEm}</text>
      </g>
      {/* The real printhead stays in front of the type it prints, including its return. */}
      <g data-carrier-pieces="true">
      {p.parts.map((part,i)=><g data-carrier-part={i} key={i} opacity={part.opacity} transform={`translate(${part.x} ${part.y}) rotate(${part.angle})`}>
        <rect x={-part.w/2} y={-part.h/2} width={part.w} height={part.h} rx={part.radius} fill={[FILM.orange,FILM.lime,FILM.flagShape,FILM.pink][i]}/>
        <path d={`M ${-part.w/2+9} ${-part.h/2+9} H ${part.w/2-9} V ${part.h/2-9}`} fill="none" stroke={FILM.white} strokeWidth="3" opacity={(1-part.screen)*.75}/>
        <g opacity={part.screen} clipPath={`url(#film-screen-${i})`}>
          <image href={screens[i]} x={-part.w/2} y={-part.h/2} width={part.w} height={part.h} preserveAspectRatio="xMidYMid meet"/>
        </g>
      </g>)}
      </g>
    </g>
    {/* Only the initial entry uses the original full-frame coloured bands. */}
    <g opacity={p.opening} transform={`translate(0 ${-ease(p.time,0,1050)*h})`}>
      {[FILM.cyan,FILM.route,FILM.flagShape,FILM.pink,FILM.orange].map((fill,i)=><path key={fill} d={`M ${i*230-300} -100 H ${i*230+150} L ${i*230+550} ${h+100} H ${i*230+100} Z`} fill={fill}/>)}
    </g>
  </svg>;
}
