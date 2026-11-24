export const UI_LAB_PRIMITIVES = [
  {
    id: "use-magnetic",
    name: "useMagnetic",
    category: "Pointer Physics",
    sizeLabel: "0.4 kB gz",
    deps: "framer-motion",
    description: "Pulls a button or tile smoothly toward the cursor within a clamped radius, ignoring coarse touch pointers.",
    usage: `const magnet = useMagnetic({ max: 12, strength: 0.28 });
<motion.button
  style={{ x: magnet.x, y: magnet.y }}
  onPointerMove={magnet.move}
  onPointerLeave={magnet.reset}
/>`,
    code: `import { useMotionValue, useSpring } from "framer-motion";

const MAGNET_SPRING = { damping: 15, stiffness: 260, mass: 0.2 };

export function useMagnetic({ max = 10, strength = 0.25 } = {}) {
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const x = useSpring(pullX, MAGNET_SPRING);
  const y = useSpring(pullY, MAGNET_SPRING);

  const move = (e) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    pullX.set(Math.max(-max, Math.min(max, dx * strength)));
    pullY.set(Math.max(-max, Math.min(max, dy * strength)));
  };

  const reset = () => {
    pullX.set(0);
    pullY.set(0);
  };

  return { x, y, move, reset };
}`,
  },
  {
    id: "spring-presets",
    name: "SPRING & scaleSpring",
    category: "Motion System",
    sizeLabel: "0.3 kB gz",
    deps: "framer-motion",
    description: "Unified spring grammar (enter, press, pill, pop) with exact damping-ratio-preserving slow-motion scaling.",
    usage: `const slowPress = scaleSpring(SPRING.press, 0.25);
<motion.div whileTap={{ scale: 0.94 }} transition={slowPress} />`,
    code: `export const SPRING = {
  enter: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  press: { type: "spring", stiffness: 450, damping: 24 },
  pill:  { type: "spring", stiffness: 520, damping: 38 },
  pop:   { type: "spring", stiffness: 380, damping: 18, mass: 0.6 },
};

export function scaleSpring(spring, timeScale = 1) {
  if (timeScale === 1 || spring?.type !== "spring") return spring;
  return {
    ...spring,
    stiffness: Math.max(1, spring.stiffness * timeScale * timeScale),
    damping: Math.max(0.5, spring.damping * timeScale),
  };
}`,
  },
  {
    id: "synth-audio",
    name: "synthAudio",
    category: "Web Audio",
    sizeLabel: "0.6 kB gz",
    deps: "Zero dependencies",
    description: "Zero-asset Web Audio tactile sound synthesizer producing dry ticks, buoyant pops, and harmonic chimes.",
    usage: `onClick={() => {
  playTick(1800, 0.05);
  playPop(620, 0.12);
}}`,
    code: `let ctx = null;
function audio() {
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  ctx ||= new Ctx();
  if (ctx.state === "suspended") ctx.resume().catch(() => {});
  return ctx;
}

export function playTick(freq = 1800, volume = 0.05) {
  const c = audio();
  if (!c) return;
  const t = c.currentTime;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.frequency.setValueAtTime(freq, t);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.018);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.002);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
  osc.connect(gain).connect(c.destination);
  osc.start(t);
  osc.stop(t + 0.035);
}`,
  },
  {
    id: "rubber-band",
    name: "rubberBand",
    category: "Gesture Math",
    sizeLabel: "0.15 kB gz",
    deps: "Pure Math",
    description: "Asymptotic exponential over-drag limiter ensuring dragged surfaces stretch organically without leaving bounds.",
    usage: `const offset = over < 0
  ? -rubberBand(Math.abs(over), 36, 72)
  : over;`,
    code: `/**
 * Asymptotic rubber-band curve.
 * @param {number} distance - Past-boundary pixel overflow (>= 0)
 * @param {number} maxStretch - Hard asymptotic ceiling in px
 * @param {number} rate - Softness constant (higher = gentler give)
 */
export function rubberBand(distance, maxStretch = 36, rate = 72) {
  if (distance <= 0) return 0;
  return maxStretch * (1 - Math.exp(-distance / rate));
}`,
  },
  {
    id: "velocity-snap",
    name: "projectSnap",
    category: "Gesture Math",
    sizeLabel: "0.2 kB gz",
    deps: "Pure Math",
    description: "Projects release position forward by velocity × horizon so quick flicks jump directly to the intended detent.",
    usage: `const nextDetent = projectSnap(y.get(), velocityY, [26, 186, 332]);`,
    code: `export function projectSnap(current, velocity, detents, horizon = 0.18) {
  const projected = current + velocity * horizon;
  let best = detents[0];
  let bestDist = Infinity;
  for (const d of detents) {
    const dist = Math.abs(projected - d);
    if (dist < bestDist) {
      bestDist = dist;
      best = d;
    }
  }
  return best;
}`,
  },
  {
    id: "scoped-radial-reveal",
    name: "computeRadialRadius",
    category: "Geometry",
    sizeLabel: "0.15 kB gz",
    deps: "Pure Math",
    description: "Computes exact distance to the farthest viewport corner from a pointer origin for circular clip-path transitions.",
    usage: `const r = computeRadialRadius(e.clientX, e.clientY, rect);
// animate clipPath: \`circle(0px at x y)\` -> \`circle(\${r}px at x y)\``,
    code: `export function computeRadialRadius(clientX, clientY, rect) {
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  const r = Math.hypot(
    Math.max(x, rect.width - x),
    Math.max(y, rect.height - y),
  );
  return { x, y, r };
}`,
  },
];
