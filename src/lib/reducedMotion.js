import { useSyncExternalStore } from "react";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

// framer-motion's useReducedMotion() reads the setting during hydration, which
// the server can't know, so anything rendered from it differs from the HTML.
// This answers "no" while hydrating, then the real setting right after.
export function useReducedMotionAfterHydration() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false
  );
}
