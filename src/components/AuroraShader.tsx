import { useEffect, useRef, useState } from 'react';
import { sculptToMinimalRenderer } from 'shader-park-core';
import styles from './AuroraShader.module.css';

type AuroraShaderProps = {
  reduceMotion: boolean;
};

// This keeps the supplied Shader Park composition intact: a torus and sphere
// mix together, then mirror into the glowing object field behind the portfolio.
const AURORA_SHADER_CODE = `
  let click = input();
  let buttonHover = input();

  function getNoiseValue(p, offset, rings) {
    return nsin(noise(p + offset) * rings);
  }

  let nscale = 1.2;
  let rings = 6.0;
  let mixAmt = 1 - click;

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
  const interactionRef = useRef({
    buttonHover: 0,
    currButtonHover: 0,
    click: 0,
    currClick: 0,
  });
  const [webglAvailable, setWebglAvailable] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduceMotion) return;

    // Shader Park's minimal renderer needs WebGL2; keep a static aurora fallback when unavailable.
    if (!canvas.getContext('webgl2')) {
      setWebglAvailable(false);
      return;
    }

    const state = interactionRef.current;

    const onPointerEnter = () => {
      state.buttonHover = 5;
    };
    const onPointerLeave = () => {
      state.buttonHover = 0;
      state.click = 0;
    };
    const onPointerDown = () => {
      state.click = 1;
    };
    const onPointerUp = () => {
      state.click = 0;
    };

    canvas.addEventListener('pointerenter', onPointerEnter);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointerup', onPointerUp);

    if (!rendererStartedRef.current) {
      rendererStartedRef.current = true;

      // The renderer owns its lightweight time loop, matching the original Shader Park setup.
      sculptToMinimalRenderer(canvas, AURORA_SHADER_CODE, () => {
        state.currButtonHover = state.currButtonHover * 0.999 + state.buttonHover * 0.001;
        state.currClick = state.currClick * 0.97 + state.click * 0.03;

        return {
          buttonHover: state.currButtonHover,
          click: state.currClick,
          _scale: 1.5,
        };
      });
    }

    return () => {
      canvas.removeEventListener('pointerenter', onPointerEnter);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointerup', onPointerUp);
    };
  }, [reduceMotion]);

  if (reduceMotion || !webglAvailable) {
    return <div className={styles.staticAurora} aria-hidden="true" />;
  }

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
