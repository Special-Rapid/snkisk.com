declare module 'shader-park-core' {
  export function sculptToMinimalRenderer(
    canvas: HTMLCanvasElement,
    source: string | (() => void),
    updateUniforms?: () => Record<string, number | number[]>,
  ): void;
}
