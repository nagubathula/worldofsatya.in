export const UI_LAB_LAST_ADDED = "November 2026";

export const LAB_CATEGORIES = [
  "All",
  "Physics & 3D",
  "Audio & Shaders",
  "Spatial & Layout",
  "Micro-interactions",
  "Systems & Data",
];

export const PIECE_META = [
  {
    id: "id-badge",
    shortTitle: "Badges",
    title: "Badges on lanyards",
    category: "Physics & 3D",
    defaultBackdrop: "light",
    accent: "#0879a0",
    featured: true,
    description:
      "A pass from every job, hung on printed straps in WebGL. The strap is a simulated rope and the card a rigid body pinned to its end, so a drag swings it and knocks its neighbours. Each tap turns a badge over the same way, winding another half-twist into the strap and hitching it up; the seventh in a row lets the strap go, and it unwinds like a torsion spring.",
    tags: ["Three.js", "Rope physics", "Rigid body", "Torsion", "Canvas textures"],
    hint: "Drag a badge, or tap it to turn it over. Keep tapping.",
    stage: "h-[540px] sm:h-[620px]",
    minHeight: "min-h-[540px] sm:min-h-[620px]",
    files: ["components/LanyardWall.js", "components/lanyard/badgeArt.js"],
    extraDeps: {
      three: "^0.185.1",
      "@react-three/fiber": "^9.6.1",
    },
    tunerControls: [
      { key: "gravity", label: "Gravity", min: 6, max: 32, step: 0.5, unit: " m/s²", default: 16 },
      { key: "unwindAfter", label: "Unwind threshold", min: 3, max: 12, step: 1, unit: " taps", default: 7 },
    ],
    howItWorks: {
      steps: [
        ["Verlet rope + rigid card", "An 8-node Verlet chain constrained at 480 Hz pins to a rigid card body, with twist shortening the rest length."],
        ["Ribbon geometry", "Two woven strap meshes evaluate a Catmull-Rom spline each frame, rotating surface normals with accumulated yaw."],
        ["Demand render loop", "R3F runs with frameloop=\"demand\" and stops invalidating 500 ms after velocities settle, burning 0% GPU at rest."],
      ],
      snippet: `// Twist shortens rest length as a real woven strap does
const rest = L.rest * (1 - L.shrink);
for (let k = 0; k < N - 1; k++) {
  tA.subVectors(b, a);
  const lambda = -(len - rest) / (wa + ROPE_W + ROPE_SOFT / (h * h));
  a.addScaledVector(tA, -wa);
  b.addScaledVector(tA, ROPE_W);
}`,
    },
  },
  {
    id: "tactile-synth",
    shortTitle: "Synth",
    title: "Tactile step synthesizer",
    category: "Audio & Shaders",
    defaultBackdrop: "light",
    accent: "#0879a0",
    featured: true,
    description:
      "A four-voice polyphonic Web Audio step sequencer with pointer-captured rotary dials, resonant low-pass filtering, and a live AnalyserNode oscilloscope — zero external audio samples required.",
    tags: ["Web Audio API", "BiquadFilter", "Pointer capture", "Canvas oscilloscope"],
    hint: "Press Play Loop, tap sequencer pads, or drag Cutoff and Resonance dials vertically.",
    stage: "pb-10",
    minHeight: "min-h-[410px]",
    files: ["components/SynthLab.js"],
    springPreview: { stiffness: 450, damping: 24, mass: 1 },
    tunerControls: [
      { key: "bpm", label: "Tempo", min: 72, max: 168, step: 2, unit: " BPM", default: 118 },
      { key: "cutoff", label: "Filter cutoff", min: 240, max: 6400, step: 40, unit: " Hz", default: 1900 },
      { key: "resonance", label: "Filter Q", min: 0.5, max: 16, step: 0.2, unit: " Q", default: 5.2 },
      { key: "release", label: "Envelope release", min: 60, max: 650, step: 10, unit: " ms", default: 210 },
    ],
    howItWorks: {
      steps: [
        ["Zero-asset audio graph", "Each pad allocates an OscillatorNode -> BiquadFilterNode -> exponential GainNode routed into a shared AnalyserNode."],
        ["Vertical pointer-capture dials", "Rotary encoders lock pointer movement so sweeping past the SVG bezel still smoothly modulates Hz and Q."],
        ["Live waveform fallback", "Reads getByteTimeDomainData() while playing and renders a live harmonic preview trace while idle."],
      ],
      snippet: `filter.type = "lowpass";
filter.frequency.setValueAtTime(cutoff, now);
filter.Q.setValueAtTime(resonance, now);
gain.gain.exponentialRampToValueAtTime(0.0001, now + releaseMs / 1000);`,
    },
  },
  {
    id: "shader-surface",
    shortTitle: "Shaders",
    title: "Refractive caustic glass",
    category: "Audio & Shaders",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: true,
    description:
      "A custom GLSL fragment shader rendering multi-octave wave caustics beneath a cursor-tracked optical lens with RGB chromatic dispersion, variable index of refraction, and Fresnel rim highlights.",
    tags: ["WebGL", "GLSL", "Chromatic dispersion", "Refraction"],
    hint: "Glide across the surface to bend caustics, or switch material presets.",
    stage: "h-[400px] sm:h-[440px]",
    minHeight: "min-h-[400px] sm:min-h-[440px]",
    files: ["components/ShaderSurfaceLab.js"],
    tunerControls: [
      { key: "ior", label: "Index of refraction", min: 1.0, max: 2.2, step: 0.02, unit: "", default: 1.36 },
      { key: "dispersion", label: "RGB dispersion", min: 0.0, max: 1.2, step: 0.05, unit: "", default: 0.45 },
      { key: "fresnel", label: "Fresnel rim", min: 0.0, max: 1.4, step: 0.05, unit: "", default: 0.65 },
      { key: "speed", label: "Wave drift", min: 0.1, max: 2.5, step: 0.1, unit: "×", default: 1.0 },
    ],
    howItWorks: {
      steps: [
        ["Radial lens refraction", "Normalizes cursor distance by viewport aspect and bends UV coordinates proportionally to (u_ior - 1.0)."],
        ["Spectral R/G/B split", "Samples the procedural caustic field at three slightly offset vectors along the lens radial direction."],
        ["Viewport-aware loop", "Halts requestAnimationFrame immediately when paused off-screen and disposes buffers on unmount."],
      ],
      snippet: `float bend = (u_ior - 1.0) * 0.24 * lensMask;
vec2 baseUv = uv - dir * bend;
float shift = u_disp * 0.045 * (0.25 + lensMask * 1.4);
float r = sampleSurface(baseUv + dir * shift, u_time).r;
float g = sampleSurface(baseUv, u_time).g;
float b = sampleSurface(baseUv - dir * shift, u_time).b;`,
    },
  },
  {
    id: "spatial-dock",
    shortTitle: "Dock",
    title: "Spatial launcher dock",
    category: "Spatial & Layout",
    defaultBackdrop: "light",
    accent: "#0879a0",
    featured: true,
    description:
      "A macOS/visionOS-inspired glass shelf where icons breathe through a continuous Gaussian magnification curve driven purely by MotionValues — zero React re-renders as the cursor sweeps.",
    tags: ["Gaussian magnification", "MotionValue", "Shared springs", "Zero re-render"],
    hint: "Sweep across the dock shelf and click icons to launch live mini tools.",
    stage: "pb-10",
    minHeight: "min-h-[380px]",
    files: ["components/SpatialDockLab.js"],
    springPreview: { stiffness: 420, damping: 26, mass: 0.45 },
    tunerControls: [
      { key: "maxScale", label: "Peak magnification", min: 1.15, max: 2.1, step: 0.05, unit: "×", default: 1.72 },
      { key: "spread", label: "Gaussian spread", min: 60, max: 200, step: 4, unit: " px", default: 112 },
      { key: "stiffness", label: "Spring stiffness", min: 180, max: 700, step: 20, unit: "", default: 420 },
      { key: "damping", label: "Spring damping", min: 12, max: 46, step: 1, unit: "", default: 26 },
    ],
    howItWorks: {
      steps: [
        ["Zero-render pointer pipeline", "Updates one shared mouseX MotionValue on pointermove while each tile computes its own center offset in transforms."],
        ["Gaussian bell curve", "Target icon size evaluates 1 + (maxScale - 1) * exp(-d² / (2σ²)) and pipes through useSpring."],
        ["Stateful mini-windows", "Active apps reveal interactive micro-surfaces above the dock with illuminated running indicator dots."],
      ],
      snippet: `const gaussian = Math.exp(-(d * d) / (2 * (spread * 0.48) ** 2));
const target = base * (1 + (maxScale - 1) * gaussian);
const size = useSpring(target, { stiffness, damping, mass: 0.45 });`,
    },
  },
  {
    id: "ai-composer",
    shortTitle: "AI UI",
    title: "Generative UI composer",
    category: "Systems & Data",
    defaultBackdrop: "light",
    accent: "#0d8a38",
    featured: true,
    description:
      "An interactive streaming reasoning & generative UI surface. Submitting a prompt streams collapsible step telemetry and blur-resolves into live interactive controls rather than plain markdown.",
    tags: ["Generative UI", "Streaming trace", "Blur reveal", "Interactive widgets"],
    hint: "Pick a scenario pill or submit a prompt to stream live interactive UI.",
    stage: "pb-10",
    minHeight: "min-h-[400px]",
    files: ["components/AIComposerLab.js"],
    springPreview: { stiffness: 360, damping: 28, mass: 1 },
    tunerControls: [
      { key: "streamSpeed", label: "Stream tempo", min: 0.4, max: 2.2, step: 0.1, unit: "×", default: 1.0 },
      { key: "blurPx", label: "Reveal blur", min: 0, max: 16, step: 1, unit: " px", default: 8 },
      { key: "stiffness", label: "Card stiffness", min: 160, max: 600, step: 20, unit: "", default: 360 },
      { key: "damping", label: "Card damping", min: 14, max: 44, step: 1, unit: "", default: 28 },
    ],
    howItWorks: {
      steps: [
        ["Staged tool-trace timeline", "Streams deterministic step completions with live millisecond timings before hydrating the final widget tree."],
        ["Blur-deblur entrance", "Combines vertical translation with Gaussian blur decay scaled by the active timeScale."],
        ["Interactive resolved output", "Outputs real React tools: copyable AA/AAA token swatches, frame-budget bars, or a 5-band vertical EQ."],
      ],
      snippet: `<motion.div
  initial={{ opacity: 0, y: 12, filter: \`blur(\${blurPx}px)\` }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
  transition={scaleSpring({ type: "spring", stiffness, damping }, timeScale)}
/>`,
    },
  },
  {
    id: "buttons",
    shortTitle: "Buttons",
    title: "Buttons that answer back",
    category: "Micro-interactions",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "Six buttons, each with one interaction worth pressing twice: a pill that leans toward the cursor, a switch that squashes under your thumb, a like that bursts, a delete you have to hold, a download that becomes its own progress ring, and a copy that rolls over to say it worked.",
    tags: ["Micro-interactions", "Springs", "Hold gesture", "Clipboard"],
    hint: "Hover, press, hold. Every one of them does something.",
    stage: "pb-10",
    minHeight: "min-h-[380px]",
    files: ["components/ButtonLab.js"],
    springPreview: { stiffness: 450, damping: 24, mass: 1 },
    tunerControls: [
      { key: "stiffness", label: "Spring stiffness", min: 180, max: 760, step: 20, unit: "", default: 450 },
      { key: "damping", label: "Spring damping", min: 10, max: 44, step: 1, unit: "", default: 24 },
      { key: "holdMs", label: "Hold duration", min: 400, max: 2400, step: 100, unit: " ms", default: 1200 },
      { key: "particles", label: "Burst sparks", min: 4, max: 24, step: 2, unit: "", default: 12 },
    ],
    howItWorks: {
      steps: [
        ["Dual-layer clip mask", "Hold-to-confirm renders the red label beneath a white copy clipped by MotionValue progress so text inverts pixel-perfectly."],
        ["Radial particle burst", "Like spreads trigonometric sparks + an expanding ring while a popLayout counter rolls the digit."],
        ["SVG morph sequence", "Download animates width 148 → 48px into a circle, draws strokeDashoffset around 2πr, and springs a checkmark."],
      ],
      snippet: `const progress = useMotionValue(0);
const width = useTransform(progress, (p) => \`\${p * 100}%\`);
const clip = useTransform(progress, (p) => \`inset(0 \${100 - p * 100}% 0 0)\`);

fill.current = animate(progress, 1, {
  duration: (HOLD_MS / 1000) * (1 - progress.get()),
  ease: "linear",
});`,
    },
  },
  {
    id: "layout",
    shortTitle: "Layout",
    title: "Things that move into place",
    category: "Spatial & Layout",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "Layout animation, where the browser decides where a box goes and springs fill in the frames between. A tab pill that glides to the one you pick, a list you reorder by its grip, a toast stack that fans out on hover and swipes away, and a card that grows out of its own thumbnail.",
    tags: ["Shared layout", "Drag to reorder", "Gestures", "AnimatePresence"],
    hint: "Click the tabs, drag a row, stack some toasts, open the card.",
    stage: "pb-10",
    minHeight: "min-h-[620px]",
    files: ["components/LayoutLab.js"],
    springPreview: { stiffness: 300, damping: 30, mass: 0.8 },
    tunerControls: [],
    howItWorks: {
      steps: [
        ["FLIP shared layoutId", "Tabs and ExpandingCard share a layoutId across mount states so Framer computes inverse transforms on one spring."],
        ["Isolated drag grip", "Reorder.Item disables row dragging (dragListener={false}) and triggers controls.start(e) strictly from the grip icon."],
        ["Swipe-threshold stack", "Toasts fan linearly on hover and dismiss when drag offset crosses ±70 px, snapping back otherwise."],
      ],
      snippet: `<motion.div
  drag="x"
  dragSnapToOrigin
  onDragEnd={(_, info) => {
    if (Math.abs(info.offset.x) > 70) dismiss(toast.id);
  }}
  animate={{
    y: open ? -i * (TOAST_H + 8) : -i * 10,
    scale: open ? 1 : 1 - i * 0.05,
  }}
/>`,
    },
  },
  {
    id: "type",
    shortTitle: "Type",
    title: "Letters, numbers, light",
    category: "Micro-interactions",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "Small pieces about type and texture. Text that decodes itself, an odometer that rolls each digit on its own spring, one light that crosses four tiles, dots that melt into each other under an SVG filter, a sentence that rises out of a blur, and a slider that stretches like rubber when you pull past the end.",
    tags: ["Text effects", "SVG filters", "Rubber banding", "Stagger"],
    hint: "Hover, click, and pull the slider past its ends.",
    stage: "pb-10",
    minHeight: "min-h-[440px]",
    files: ["components/TypeLab.js"],
    springPreview: { stiffness: 180, damping: 22, mass: 1 },
    tunerControls: [
      { key: "scrambleMs", label: "Scramble tick", min: 16, max: 90, step: 4, unit: " ms", default: 32 },
      { key: "odometerStiffness", label: "Digit stiffness", min: 90, max: 420, step: 15, unit: "", default: 180 },
      { key: "rubberStretch", label: "Slider stretch", min: 8, max: 56, step: 2, unit: " px", default: 28 },
    ],
    howItWorks: {
      steps: [
        ["Shared pointer light", "SpotlightGrid updates --x and --y CSS vars on all 4 tiles simultaneously from one parent pointermove handler."],
        ["Gooey color matrix", "An SVG feGaussianBlur + feColorMatrix alpha threshold (20 -8) merges overlapping circles into liquid bridges."],
        ["Asymptotic rubber band", "Pulling past 0 or 1 feeds overflow through M × (1 − e^(−|over|/60)) so resistance tightens smoothly."],
      ],
      snippet: `const over = raw < 0 ? raw * r.width : raw > 1 ? (raw - 1) * r.width : 0;
overflow.set(Math.sign(over) * rubberStretch * (1 - Math.exp(-Math.abs(over) / 60)));

// On release: snap stretch back to zero on an underdamped spring
animate(overflow, 0, { type: "spring", stiffness: 500, damping: 15 });`,
    },
  },
  {
    id: "sensors",
    shortTitle: "Sensors",
    title: "Tilt it, shake it",
    category: "Physics & 3D",
    defaultBackdrop: "light",
    accent: "#2ec4f0",
    featured: false,
    description:
      "Interfaces that answer to the phone itself, like the home card you can shake to turn. A foil card that leans as you tilt, dice that tumble when you shake, and a marble that rolls around a bowl like a spirit level. On a laptop, the mouse stands in for the sensors.",
    tags: ["Device orientation", "Accelerometer", "Shake detection", "Haptics"],
    hint: "Best on a phone. On desktop, move or whip the mouse over them.",
    stage: "pb-10",
    minHeight: "min-h-[400px]",
    files: ["components/SensorLab.js", "lib/qr.js"],
    springPreview: { stiffness: 120, damping: 14, mass: 1 },
    tunerControls: [],
    howItWorks: {
      steps: [
        ["Dual-input tilt springs", "useTilt reads DeviceOrientation gamma/beta (zeroed around a 40° holding angle) or falls back to pointer offset."],
        ["Shake + whip detection", "useShake triggers on high accelerometer jerk (> 22 m/s²) or 4 horizontal pointer reversals inside 700 ms."],
        ["Pure-JS QR encoder", "Desktop shows an inline ISO/IEC 18004 QR SVG built with GF(256) Reed-Solomon parity so phones open /ui/sensors fast."],
      ],
      snippet: `const onOrient = (event) => {
  if (event.gamma == null || event.beta == null) return;
  sensor = true;
  rawX.set(clamp(event.gamma / 30));
  rawY.set(clamp((event.beta - 40) / 30));
};`,
    },
  },
  {
    id: "works-hand",
    shortTitle: "Works hand",
    title: "Works hand",
    category: "Spatial & Layout",
    defaultBackdrop: "light",
    accent: "#0879a0",
    featured: false,
    description:
      "Selected work dealt as a hand of cards. On desktop they fan out and step aside for the one you hover; on a phone they stack into a deck that shuffles itself and swipes left and right.",
    tags: ["Responsive", "Hover", "Swipe", "View transitions"],
    hint: "Hover a card on desktop, swipe the deck on a phone.",
    stage: "h-[540px] sm:h-[460px]",
    minHeight: "min-h-[540px] sm:min-h-[460px]",
    files: ["components/WorksFan.js", "components/NoiseStage.js"],
    springPreview: { stiffness: 300, damping: 30, mass: 0.8 },
    tunerControls: [],
    howItWorks: {
      steps: [
        ["Deckle turbulence mask", "An inline SVG feTurbulence + feDisplacementMap masks each card edge while keeping the inner screenshot sharp."],
        ["Neighbor displacement", "Hovering one card raises its z-index and shifts siblings outward by sign(i - active) × 16% on an unbounced spring."],
        ["Velocity-aware deck", "Below 640 px, cards stack into an auto-cycling deck supporting pointer swipe distance and flick speed."],
      ],
      snippet: `const side = activeIndex < 0 || lifted ? 0 : Math.sign(index - activeIndex);
animate={
  lifted
    ? { x: "0%", y: "-7%", rotate: -tilt * 0.7, scale: 1.05 }
    : side
    ? { x: \`\${side * 16}%\`, y: "3%", rotate: side * 2, scale: 0.94 }
    : { x: "0%", y: "0%", rotate: 0, scale: 1 }
}`,
    },
  },
  {
    id: "command-palette",
    shortTitle: "Palette",
    title: "Command palette (⌘K)",
    category: "Systems & Data",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "A two-level command palette modeled after NotBad's redesigned switcher: browse curated root actions, drill into nested pickers, or type any query from the root to fuzzy-match deeply nested leaves with highlighted characters.",
    tags: ["⌘K shortcut", "Fuzzy search", "Keyboard navigation", "Nested menus"],
    hint: "Type to filter, use ↑ ↓ and Enter, or press Esc.",
    stage: "pb-10",
    minHeight: "min-h-[440px]",
    files: ["components/CommandPaletteLab.js"],
    springPreview: { stiffness: 520, damping: 38, mass: 1 },
    tunerControls: [],
    howItWorks: {
      steps: [
        ["Weighted fuzzy scorer", "Scores sequential matches with word-boundary (+8), prefix (+10), and consecutive (+6) bonuses while capturing indices."],
        ["Browse simple, search deep", "Root shows 7 curated rows, yet non-empty queries flatten nested Accent, Appearance, and Jump leaves inline."],
        ["Shared selection pill", "Arrow keys move a layoutId highlight row and handle Esc cleanly (clear query → pop stack → close) without page-nav leaks."],
      ],
      snippet: `if (target[ti] === q[qi]) {
  indices.push(ti);
  score += ti === 0 ? 10 : /[\\s\\-_…›]/.test(target[ti - 1]) ? 8 : 1;
  if (ti === lastMatch + 1) score += 6;
  lastMatch = ti;
  qi++;
}`,
    },
  },
  {
    id: "bottom-sheet",
    shortTitle: "Sheet",
    title: "Drag-to-dismiss drawer",
    category: "Physics & 3D",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "A mobile bottom sheet contained in a live device frame with three magnetic snap detents (Full, Half, Peek), rubber-band over-drag above the top edge, velocity projection on release, and continuous background scale depth.",
    tags: ["Drag physics", "Snap points", "Velocity projection", "Detents"],
    hint: "Drag the handle up or down, flick to dismiss, or tap a detent.",
    stage: "pb-10",
    minHeight: "min-h-[540px]",
    files: ["components/DrawerLab.js"],
    springPreview: { stiffness: 380, damping: 34, mass: 1 },
    tunerControls: [
      { key: "stiffness", label: "Snap stiffness", min: 180, max: 640, step: 20, unit: "", default: 380 },
      { key: "damping", label: "Snap damping", min: 14, max: 52, step: 1, unit: "", default: 34 },
      { key: "flickProjection", label: "Flick horizon", min: 0.05, max: 0.4, step: 0.02, unit: " s", default: 0.18 },
      { key: "rubberBand", label: "Ceiling give", min: 12, max: 72, step: 4, unit: " px", default: 36 },
    ],
    howItWorks: {
      steps: [
        ["Continuous backdrop transform", "useTransform maps sheet y directly to background scale (0.92–1), border radius, and scrim opacity at 60 fps."],
        ["Velocity projection", "On pointerup, projectedY = y + velocityY × horizon decides whether a quick flick dismisses or snaps to the nearest detent."],
        ["Asymptotic top ceiling", "Pulling past Full engages M × (1 − e^(−over/72)) resistance so the drawer never detaches from the bottom."],
      ],
      snippet: `const projectedY = currentY + d.vy * flickProjection;
if ((d.vy > 650 && currentY > SNAP_Y.half - 20) || projectedY > dismissLine) {
  snapTo("closed", d.vy);
  return;
}
animate(y, SNAP_Y[closest], { type: "spring", stiffness, damping, velocity: d.vy });`,
    },
  },
  {
    id: "forms",
    shortTitle: "Forms",
    title: "Forms that help before you submit",
    category: "Micro-interactions",
    defaultBackdrop: "light",
    accent: "#0d8a38",
    featured: false,
    description:
      "Three everyday form micro-interactions tuned for low anxiety and zero layout shift: debounced handle lookup with instant alternative suggestions, a four-segment password meter with springing rule checks, and a 6-digit OTP box that pastes, waves on match, or shakes on error.",
    tags: ["Inline validation", "Debounce", "Password meter", "OTP paste"],
    hint: "Try @satya, test password rules, or paste 428190 into the OTP.",
    stage: "pb-10",
    minHeight: "min-h-[320px]",
    files: ["components/FormLab.js"],
    springPreview: { stiffness: 520, damping: 38, mass: 1 },
    tunerControls: [],
    howItWorks: {
      steps: [
        ["Zero-CLS status slot", "Validation messages live in a fixed-height row and validate late on email blur so typing never feels scolded."],
        ["Segmented strength bars", "Four independent bars scaleX on SPRING.pill while requirement pills pop checkmarks as predicates flip true."],
        ["Gliding OTP focus ring", "Six numeric inputs share one layoutId focus border, intercept full-code pastes, and trigger a staggered success wave."],
      ],
      snippet: `if (code === VALID_OTP) {
  setStatus("verified");
  playTingSound(1568, 0.06);
} else {
  setStatus("error");
  setShakeTick((n) => n + 1);
}`,
    },
  },
  {
    id: "data-viz",
    shortTitle: "Data viz",
    title: "Telemetry with a live crosshair",
    category: "Systems & Data",
    defaultBackdrop: "light",
    accent: "#0879a0",
    featured: false,
    description:
      "An animated SVG area chart built with monotone cubic-bezier interpolation so curves never overshoot data bounds. Switch metrics or time ranges with shared layout pills, then scrub across the plot with pointer, touch, or arrow keys.",
    tags: ["SVG spline", "Crosshair scrub", "Monotone curve", "Tabular KPI"],
    hint: "Scrub across the chart, use ← → keys, or switch metric and range.",
    stage: "pb-10",
    minHeight: "min-h-[400px]",
    files: ["components/ChartLab.js"],
    tunerControls: [],
    howItWorks: {
      steps: [
        ["Fritsch-Carlson spline", "Harmonic-mean tangents keep cubic-bezier segments smooth without ringing or dipping below zero between points."],
        ["Path-length draw-in", "Switching metrics or ranges replays a 550 ms pathLength stroke animation with an area gradient fade."],
        ["Nearest-index crosshair", "Pointer clientX maps to SVG viewBox coordinates, updating hairline guides, edge-clamped tooltip, and KPI ticks."],
      ],
      snippet: `if (m[i - 1] * m[i] <= 0) {
  tangents[i] = 0;
} else {
  const w1 = 2 * dx[i] + dx[i - 1];
  const w2 = dx[i] + 2 * dx[i - 1];
  tangents[i] = (w1 + w2) / (w1 / m[i - 1] + w2 / m[i]);
}`,
    },
  },
  {
    id: "theme-transition",
    shortTitle: "Theme",
    title: "Scoped radial theme transition",
    category: "Systems & Data",
    defaultBackdrop: "light",
    accent: "#5b4cf0",
    featured: false,
    description:
      "Click-origin circular reveal between four complete palettes (Paper, Dim, Midnight, Terminal). An isolated duplicate surface expands via CSS clip-path from the exact button coordinates while keeping the rest of the surface unaffected.",
    tags: ["Clip-path reveal", "Origin geometry", "Scoped tokens", "A11y"],
    hint: "Tap any palette pill or the Sun/Moon toggle to trigger a radial reveal.",
    stage: "pb-10",
    minHeight: "min-h-[340px]",
    files: ["components/ThemeLab.js"],
    tunerControls: [
      { key: "revealDuration", label: "Sweep duration", min: 0.2, max: 1.4, step: 0.04, unit: " s", default: 0.56 },
    ],
    howItWorks: {
      steps: [
        ["Farthest-corner radius", "Computes maxR = hypot(max(x, w - x), max(y, h - y)) from click coordinates so the expanding disc always covers the stage."],
        ["Stacked surface portal", "Mounts an inert target-theme layer above the live card, animates clipPath circle(0 → maxR), then commits base state."],
        ["Zero global side effects", "All surfaces, borders, and contrast tokens stay scoped inside React state without touching global CSS."],
      ],
      snippet: `const r = Math.hypot(Math.max(x, rect.width - x), Math.max(y, rect.height - y));

<motion.div
  initial={{ clipPath: \`circle(0px at \${x}px \${y}px)\` }}
  animate={{ clipPath: \`circle(\${r}px at \${x}px \${y}px)\` }}
  onAnimationComplete={() => { setBaseId(reveal.id); setReveal(null); }}
/>`,
    },
  },
];

export function getPieceBySlug(slug) {
  return PIECE_META.find((p) => p.id === slug) || null;
}
