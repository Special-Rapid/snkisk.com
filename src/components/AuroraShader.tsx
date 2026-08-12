import { useEffect, useRef } from 'react';
import styles from './AuroraShader.module.css';

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform vec2 u_orbCenter;
  uniform float u_time;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(p);
      p = p * 2.04 + vec2(7.3, 2.1);
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float aspect = u_resolution.x / u_resolution.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    float time = u_time * 0.12;

    vec2 flow = p * 1.55;
    flow.x += fbm(flow + vec2(time, -time * 0.35)) * 0.64;
    flow.y += fbm(flow * 1.62 + vec2(-time * 0.6, time)) * 0.4;
    float field = fbm(flow * 2.1 + vec2(time * 0.7, -time));
    float bands = sin((flow.x + flow.y * 0.62 + field * 1.7) * 5.4 + time * 1.6) * 0.5 + 0.5;

    vec3 blue = vec3(0.055, 0.15, 0.96);
    vec3 cyan = vec3(0.06, 0.84, 1.0);
    vec3 violet = vec3(0.47, 0.10, 0.96);
    vec3 pink = vec3(1.0, 0.05, 0.54);
    vec3 coral = vec3(1.0, 0.32, 0.24);

    vec3 color = mix(blue, cyan, smoothstep(0.15, 0.82, field));
    color = mix(color, violet, smoothstep(0.22, 0.74, bands));
    color = mix(color, pink, smoothstep(0.58, 0.95, fbm(flow * 1.2 + 4.2)) * 0.74);

    vec2 orbCenter = u_orbCenter;
    float distanceToOrb = length(p - orbCenter);
    float orbRadius = 0.34;
    float orbMask = 1.0 - smoothstep(orbRadius * 0.72, orbRadius, distanceToOrb);
    float orbNoise = fbm((p - orbCenter) * 5.6 + vec2(time * 1.15, -time));
    vec3 orbColor = mix(violet, pink, smoothstep(0.26, 0.78, orbNoise));
    orbColor = mix(orbColor, coral, smoothstep(0.6, 0.94, orbNoise) * 0.5);
    color = mix(color, orbColor, orbMask * 0.7);

    float rim = smoothstep(0.021, 0.0, abs(distanceToOrb - orbRadius));
    float outerGlow = 1.0 - smoothstep(orbRadius, orbRadius * 1.45, distanceToOrb);
    color += vec3(0.84, 0.94, 1.0) * rim * 0.92;
    color += vec3(0.45, 0.36, 1.0) * outerGlow * 0.22;

    float flare = pow(max(0.0, 1.0 - distance(p, orbCenter + vec2(0.0, -0.34)) * 1.65), 4.0);
    color += vec3(1.0, 0.71, 0.28) * flare * 0.44;
    color += (field - 0.5) * 0.13;

    gl_FragColor = vec4(color, 1.0);
  }
`;

type AuroraShaderProps = {
  reduceMotion: boolean;
};

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export default function AuroraShader({ reduceMotion }: AuroraShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: false, antialias: false, powerPreference: 'low-power' });
    if (!gl) return;

    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const position = gl.getAttribLocation(program, 'a_position');
    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const orbCenter = gl.getUniformLocation(program, 'u_orbCenter');
    const time = gl.getUniformLocation(program, 'u_time');
    const buffer = gl.createBuffer();
    if (!buffer || position < 0 || !resolution || !orbCenter || !time) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    let centerX = 0;
    let centerY = 0;

    const draw = (timestamp: number) => {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.enableVertexAttribArray(position);
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform2f(orbCenter, centerX, centerY);
      gl.uniform1f(time, timestamp / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const scale = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(rect.width * scale));
      canvas.height = Math.max(1, Math.floor(rect.height * scale));
      gl.viewport(0, 0, canvas.width, canvas.height);
      const rootFontSize = Number.parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
      const ringDiameter = Math.min(rect.width * 0.54, rootFontSize * 48);
      const ringCenterX = rect.width * 1.14 - ringDiameter / 2;
      const ringCenterYFromTop = rect.height * 0.09 + ringDiameter / 2;
      const aspect = canvas.width / canvas.height;
      centerX = (ringCenterX / rect.width) * aspect;
      centerY = 1 - ringCenterYFromTop / rect.height;
      // Resizing clears a canvas, so redraw even when the animated loop is disabled.
      draw(0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    let animationFrame = 0;
    const animate = (timestamp: number) => {
      draw(timestamp);
      animationFrame = window.requestAnimationFrame(animate);
    };
    if (!reduceMotion) animationFrame = window.requestAnimationFrame(animate);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
    };
  }, [reduceMotion]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}
