"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { playTickSound } from "./SoundEffects";
import { useLabTuner } from "@/lib/labTuning";

const PRESETS = [
  {
    id: "prism",
    name: "Dichroic Prism",
    c1: [0.18, 0.77, 0.94],
    c2: [0.55, 0.36, 0.96],
    c3: [0.96, 0.62, 0.04],
  },
  {
    id: "mercury",
    name: "Liquid Mercury",
    c1: [0.82, 0.86, 0.93],
    c2: [0.22, 0.27, 0.38],
    c3: [0.18, 0.77, 0.94],
  },
  {
    id: "phosphor",
    name: "Phosphor CRT",
    c1: [0.06, 0.72, 0.51],
    c2: [0.18, 0.77, 0.94],
    c3: [0.04, 0.14, 0.12],
  },
  {
    id: "solar",
    name: "Solar Caustic",
    c1: [0.98, 0.55, 0.12],
    c2: [0.92, 0.22, 0.45],
    c3: [0.25, 0.12, 0.42],
  },
];

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision mediump float;
varying vec2 v_uv;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_time;
uniform float u_disp;
uniform float u_ior;
uniform float u_fresnel;
uniform vec3 u_c1;
uniform vec3 u_c2;
uniform vec3 u_c3;

float waveField(vec2 p, float t) {
  float a = sin(p.x * 3.1 + t * 0.9) * cos(p.y * 2.7 - t * 0.7);
  float b = sin((p.x + p.y) * 4.3 - t * 1.1) * 0.5;
  float c = cos((p.x - p.y * 1.3) * 6.2 + t * 0.6) * 0.25;
  return a + b + c;
}

vec3 sampleSurface(vec2 uv, float t) {
  float f1 = waveField(uv * 2.4, t);
  float f2 = waveField(uv * 3.8 + vec2(f1 * 0.35, -f1 * 0.28), t * 1.15);
  float caustic = smoothstep(-0.35, 1.1, f1 * 0.55 + f2 * 0.65);

  vec3 base = mix(vec3(0.03, 0.04, 0.07), u_c2 * 0.45, smoothstep(0.0, 1.0, uv.y));
  base = mix(base, u_c1 * 0.85, caustic * 0.65);
  float ridge = pow(max(0.0, 1.0 - abs(f2) * 1.8), 3.0);
  base += u_c3 * ridge * 0.72;
  return base;
}

void main() {
  float aspect = u_res.x / max(1.0, u_res.y);
  vec2 uv = v_uv;
  vec2 delta = (uv - u_mouse) * vec2(aspect, 1.0);
  float dist = length(delta);

  float lensRadius = 0.34;
  float lensMask = smoothstep(lensRadius, 0.0, dist);
  vec2 dir = dist > 0.0001 ? delta / dist : vec2(0.0);

  // Refractive displacement scaled by IOR
  float bend = (u_ior - 1.0) * 0.24 * lensMask;
  vec2 baseUv = uv - dir * bend;

  // RGB chromatic dispersion around optical lens
  float shift = u_disp * 0.045 * (0.25 + lensMask * 1.4);
  float r = sampleSurface(baseUv + dir * shift, u_time).r;
  float g = sampleSurface(baseUv, u_time).g;
  float b = sampleSurface(baseUv - dir * shift, u_time).b;
  vec3 col = vec3(r, g, b);

  // Fresnel rim glow at lens edge
  float rim = exp(-pow((dist - lensRadius * 0.52) * 11.0, 2.0)) * u_fresnel;
  col += (u_c1 * 0.7 + vec3(0.35)) * rim * 0.55;

  // Subtle vignette & micro grain
  float vig = smoothstep(1.2, 0.25, length((uv - 0.5) * vec2(aspect * 0.8, 1.0)));
  col *= 0.62 + 0.38 * vig;
  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) * 0.025;
  col += grain - 0.012;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function ShaderSurfaceLab({ reduceMotion = false, paused = false }) {
  const tuner = useLabTuner("shader-surface", {
    dispersion: 0.45,
    ior: 1.36,
    speed: 1.0,
    fresnel: 0.65,
  });

  const [presetId, setPresetId] = useState("prism");
  const [coords, setCoords] = useState({ x: 0.5, y: 0.5 });
  const [webglReady, setWebglReady] = useState(true);

  const canvasRef = useRef(null);
  const pointerTarget = useRef({ x: 0.5, y: 0.5 });
  const pointerCurrent = useRef({ x: 0.5, y: 0.5 });
  const preset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];

  const liveRef = useRef({
    preset,
    dispersion: tuner.dispersion,
    ior: tuner.ior,
    speed: tuner.speed,
    fresnel: tuner.fresnel,
    timeScale: tuner.timeScale,
  });

  useEffect(() => {
    liveRef.current = {
      preset,
      dispersion: tuner.dispersion,
      ior: tuner.ior,
      speed: tuner.speed,
      fresnel: tuner.fresnel,
      timeScale: tuner.timeScale,
    };
  }, [preset, tuner.dispersion, tuner.ior, tuner.speed, tuner.fresnel, tuner.timeScale]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const gl = canvas.getContext("webgl", { antialias: true, powerPreference: "high-performance" });
    if (!gl) {
      queueMicrotask(() => setWebglReady(false));
      return undefined;
    }

    const vert = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vert || !frag) {
      queueMicrotask(() => setWebglReady(false));
      return undefined;
    }

    const program = gl.createProgram();
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      queueMicrotask(() => setWebglReady(false));
      return undefined;
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      res: gl.getUniformLocation(program, "u_res"),
      mouse: gl.getUniformLocation(program, "u_mouse"),
      time: gl.getUniformLocation(program, "u_time"),
      disp: gl.getUniformLocation(program, "u_disp"),
      ior: gl.getUniformLocation(program, "u_ior"),
      fresnel: gl.getUniformLocation(program, "u_fresnel"),
      c1: gl.getUniformLocation(program, "u_c1"),
      c2: gl.getUniformLocation(program, "u_c2"),
      c3: gl.getUniformLocation(program, "u_c3"),
    };

    let rafId = 0;
    let simTime = 1.8;
    let lastTs = performance.now();

    const render = (now) => {
      const dt = Math.min(0.05, Math.max(0, (now - lastTs) / 1000));
      lastTs = now;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 640;
      const h = canvas.clientHeight || 360;
      const rw = Math.round(w * dpr);
      const rh = Math.round(h * dpr);
      if (canvas.width !== rw || canvas.height !== rh) {
        canvas.width = rw;
        canvas.height = rh;
      }

      const cfg = liveRef.current;
      if (!reduceMotion && !paused) {
        simTime += dt * cfg.speed * (cfg.timeScale || 1);
      }

      pointerCurrent.current.x += (pointerTarget.current.x - pointerCurrent.current.x) * 0.14;
      pointerCurrent.current.y += (pointerTarget.current.y - pointerCurrent.current.y) * 0.14;

      gl.viewport(0, 0, rw, rh);
      gl.useProgram(program);
      gl.uniform2f(uniforms.res, rw, rh);
      gl.uniform2f(uniforms.mouse, pointerCurrent.current.x, pointerCurrent.current.y);
      gl.uniform1f(uniforms.time, simTime);
      gl.uniform1f(uniforms.disp, cfg.dispersion);
      gl.uniform1f(uniforms.ior, cfg.ior);
      gl.uniform1f(uniforms.fresnel, cfg.fresnel);
      gl.uniform3fv(uniforms.c1, cfg.preset.c1);
      gl.uniform3fv(uniforms.c2, cfg.preset.c2);
      gl.uniform3fv(uniforms.c3, cfg.preset.c3);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      if (!paused && !reduceMotion) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vert);
      gl.deleteShader(frag);
    };
  }, [paused, reduceMotion, presetId, tuner.dispersion, tuner.ior, tuner.speed, tuner.fresnel]);

  const onPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const ny = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
    pointerTarget.current = { x: nx, y: ny };
    setCoords({ x: nx, y: ny });
  };

  return (
    <div
      onPointerMove={onPointerMove}
      className="relative flex min-h-[380px] w-full flex-col justify-between overflow-hidden bg-[#111827] p-4 sm:min-h-[420px] sm:p-6"
    >
      {webglReady ? (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at ${coords.x * 100}% ${(1 - coords.y) * 100}%, rgba(46,196,240,0.45), rgba(91,76,240,0.22) 45%, #111827 80%)`,
          }}
        />
      )}

      {/* Top HUD in daylight glass */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/85 px-3 py-1 shadow-sm backdrop-blur-md">
          <Sparkles size={12} className="text-[#0879a0]" />
          <span className="font-labMono text-[10.5px] font-medium uppercase tracking-[0.14em] text-ink">
            GLSL Caustic Optics
          </span>
        </div>

        <div className="rounded-full border border-white/45 bg-white/85 px-3 py-1 font-labMono text-[10.5px] tabular-nums text-ink-secondary shadow-sm backdrop-blur-md">
          IOR {tuner.ior.toFixed(2)} · UV ({coords.x.toFixed(2)}, {coords.y.toFixed(2)})
        </div>
      </div>

      {/* Bottom Preset Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Shader material presets">
          {PRESETS.map((p) => {
            const active = p.id === presetId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setPresetId(p.id);
                  playTickSound(1600, 0.04);
                }}
                className={`rounded-full border px-3 py-1 font-labMono text-[10.5px] tracking-[0.06em] shadow-sm backdrop-blur-md transition-colors ${
                  active
                    ? "border-ink bg-ink font-medium text-white"
                    : "border-white/45 bg-white/85 text-ink hover:bg-white"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
