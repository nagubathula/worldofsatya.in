// A grainy gradient backdrop that a screenshot floats on, like a product shot on
// a backdrop instead of a flat grey box. The palette is picked from `seed`, so
// each work keeps its own colour wherever it shows up. See .noise-stage in globals.css.
const PALETTES = [
  { light: "#b9e0fb", mid: "#3f8fd8", deep: "#0a1f6b" }, // sky into navy
  { light: "#f4b8c6", mid: "#8a5fae", deep: "#14185a" }, // rose into ink
  { light: "#c9c2ff", mid: "#6f5fe0", deep: "#1b1150" }, // lilac into violet
  { light: "#aef0de", mid: "#2e9c9a", deep: "#08343f" }, // mint into teal
  { light: "#ffd6a8", mid: "#e0703f", deep: "#3a1022" }, // peach into plum
];

function paletteFor(seed = "") {
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return PALETTES[hash % PALETTES.length];
}

// The palette as CSS variables, for elements that put on .noise-stage themselves.
export function stageStyle(seed) {
  const { light, mid, deep } = paletteFor(seed);
  return { "--stage-light": light, "--stage-mid": mid, "--stage-deep": deep };
}

export default function NoiseStage({ seed, className = "", children }) {
  return (
    <div className={`noise-stage ${className}`} style={stageStyle(seed)}>
      <div className="relative z-[1]">{children}</div>
    </div>
  );
}
