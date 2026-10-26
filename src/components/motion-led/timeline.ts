export const DURATION = 14400;
export const CHAPTER_MS = 3300;
export const TRANSITION_MS = 450;
export const clamp = (x: number) => Math.max(0, Math.min(1, x));
export function pose(time: number) {
  const t = Math.max(0, Math.min(DURATION, time));
  const chapter = Math.min(3, Math.floor(t / CHAPTER_MS));
  const local = t - chapter * CHAPTER_MS;
  const entering = chapter === 0 ? 1 : clamp(local / TRANSITION_MS);
  // A smooth, short entrance and a truly still reading interval. No perpetual type scaling.
  const ease = entering * entering * (3 - 2 * entering);
  const settling = clamp((t - 13200) / 600);
  return { chapter, opacity: ease, offset: (1 - ease) * 22,
    carrier: 12.5 + chapter * 25 + (chapter < 3 ? clamp((local - 2850) / TRANSITION_MS) * 25 : 0),
    finished: t >= DURATION, settling };
}
