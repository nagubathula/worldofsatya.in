import { useMotionValue, useSpring } from "framer-motion";
import { prefersReducedMotion } from "./motion";

// Cursor-follow spring: a gesture spring, so it stays here rather than in SPRING.
const MAGNET_SPRING = { damping: 15, stiffness: 260, mass: 0.2 };

// Pulls an element toward the cursor while it hovers, then springs it home.
// Put `move` on the element to measure and `x`/`y` on the motion element to move.
export function useMagnetic({ max = 10, strength = 0.25 } = {}) {
  const pullX = useMotionValue(0);
  const pullY = useMotionValue(0);
  const x = useSpring(pullX, MAGNET_SPRING);
  const y = useSpring(pullY, MAGNET_SPRING);

  const move = (e) => {
    // Mouse and pen only: a tap on a phone shouldn't nudge what it hit.
    if (e.pointerType === "touch" || prefersReducedMotion()) return;
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
}
