import { useEffect, useRef, useState } from 'react';
import shaderParkRuntimeUrl from 'shader-park-core/dist/shader-park-core.umd.js?url';
import styles from './AuroraShader.module.css';

type AuroraShaderProps = {
  reduceMotion: boolean;
};

type ShaderParkRuntime = {
  sculptToMinimalRenderer: (
    canvas: HTMLCanvasElement,
    source: string,
    updateUniforms?: () => Record<string, number | number[]>,
  ) => void;
};

declare global {
  interface Window {
    'shader-park-core'?: ShaderParkRuntime;
  }
}

// This keeps the supplied Shader Park composition intact: a torus and sphere
// mix together, then mirror into the glowing object field behind the portfolio.
const AURORA_SHADER_CODE = `
  function getNoiseValue(p, offset, rings) {
    return nsin(noise(p + offset) * rings);
  }

  let nscale = 1.2;
  let rings = 6.0;
  let mixAmt = 1.0;

  let s = getSpace();
  let samplePos = s * nscale + vec3(0, 0, time) * 0.1;

  let deepBlue = vec3(0.025, 0.055, 0.42);
  let auroraCyan = vec3(0.04, 0.64, 1.0);
  let auroraPink = vec3(1.0, 0.06, 0.54);

  let pattern = getNoiseValue(samplePos, 0.0, rings);
  let baseColor = mix(deepBlue, auroraCyan, pattern);
  let finalCol = mix(baseColor, auroraPink, pow(pattern, 5.0));

  color(finalCol);
  shine(0.4);

  rotateX(mouse.y * 0.1);
  rotateX(mouse.y * 0.1);
  rotateY(mouse.x * 0.1);

  shape(() => {
    // Keep the supplied torus, sphere, and mirror geometry centered as one object.
    rotateX(PI / 2);
    torus(0.8, 0.5);
    sphere(0.28);
    mixGeo(mixAmt);
    mirrorN(3, 0.1);
    shape(() => {
      rotateX(time * 0.1);
      rotateZ(time * 0.1);
      boxFrame(vec3(0.1), 0.005);
      sphere(0.05);
    })();
  })();
`;

export default function AuroraShader({ reduceMotion }: AuroraShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererStartedRef = useRef(false);
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;

    // Shader Park's minimal renderer needs WebGL2; keep a static aurora fallback when unavailable.
    if (!canvas.getContext('webgl2')) {
      setWebglAvailable(false);
      return;
    }

    const existingRuntime = window['shader-park-core'];
    if (existingRuntime) {
      startRenderer(existingRuntime, canvas, rendererStartedRef);
      return;
    }

    // Load the unbundled UMD file as a Vite asset. Its compiler intentionally evaluates
    // the sculpt DSL, so it must retain the official runtime's original binding names.
    const script = document.createElement('script');
    script.src = shaderParkRuntimeUrl;
    script.async = true;
    script.onload = () => {
      const runtime = window['shader-park-core'];
      if (runtime) {
        startRenderer(runtime, canvas, rendererStartedRef);
      } else {
        setWebglAvailable(false);
      }
    };
    script.onerror = () => setWebglAvailable(false);
    document.head.append(script);

    return () => script.remove();
  }, [reduceMotion]);

  if (reduceMotion || !webglAvailable) {
    return <div className={styles.staticAurora} aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

function startRenderer(
  runtime: ShaderParkRuntime,
  canvas: HTMLCanvasElement,
  rendererStartedRef: { current: boolean },
) {
  if (rendererStartedRef.current) return;
  rendererStartedRef.current = true;

  // The unmodified runtime owns its animation loop, matching the provided HTML setup.
  runtime.sculptToMinimalRenderer(canvas, AURORA_SHADER_CODE, () => ({ _scale: 1.5 }));
}
