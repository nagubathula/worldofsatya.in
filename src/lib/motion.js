import { playTransitionScreen, usesTransitionScreen } from "./transitionScreen";

export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN = [0.4, 0, 1, 1];

// The site's only springs. Every enter, press and indicator uses one of these,
// so all motion shares one feel. Gesture-follow springs (drag, cursor) stay local.
export const SPRING = {
  // Content arriving or resizing: cards, rows, page sections.
  enter: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  // Taps and hovers on buttons and tiles.
  press: { type: "spring", stiffness: 450, damping: 24 },
  // Sliding selection pills and tab indicators.
  pill: { type: "spring", stiffness: 520, damping: 38 },
  // The one playful accent: the avatar and its annotation.
  pop: { type: "spring", stiffness: 380, damping: 18, mass: 0.6 },
};

// A work's image carries this view-transition-name on every page that shows it,
// so navigating morphs the thumbnail into the detail page hero.
export function workMediaName(slug) {
  return slug ? `work-media-${slug}` : undefined;
}

export function workMediaStyle(slug) {
  const name = workMediaName(slug);
  return name ? { viewTransitionName: name, viewTransitionClass: "work-media" } : undefined;
}

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// False on the server and through the first client render, true once the app has
// hydrated. Entrance animations that start hidden check it, so a page loaded
// straight from the server paints its content before any script runs, and only
// pages reached in-app play their intro.
let hydrated = false;

export function markHydrated() {
  hydrated = true;
}

export function hasHydrated() {
  return hydrated;
}

export function canViewTransition() {
  return typeof document !== "undefined" && typeof document.startViewTransition === "function";
}

let lastHapticAt = 0;

export function haptic(kind = "tap") {
  if (prefersReducedMotion()) return;
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  const now = performance.now();
  const gap = kind === "tap" ? 48 : 420;
  // A page change replaces a tap that just fired, so the longer pulse is the one you feel.
  if (kind !== "navigate" && now - lastHapticAt < gap) return;
  lastHapticAt = now;
  const pattern = kind === "navigate" ? [7, 32, 12] : kind === "select" ? [10] : [8];
  try {
    navigator.vibrate(pattern);
  } catch {
    /* some browsers expose vibrate and still throw */
  }
}

// The detail hero is rarely loaded when the new page first paints. Hold the
// transition briefly so the thumbnail morphs into a picture, not an empty frame.
function workMediaDecoded(limit = 450) {
  const img = document.querySelector("[data-work-media] img");
  if (!img || img.complete) return Promise.resolve();
  return Promise.race([
    img.decode().catch(() => {}),
    new Promise((resolve) => window.setTimeout(resolve, limit)),
  ]);
}

function finishOnce(resolve) {
  let settled = false;
  return () => {
    if (settled) return;
    settled = true;
    // Frames are paused during the update, so give React a tick with a timer instead.
    window.setTimeout(resolve, 16);
  };
}

// Pages sit on a map: home, then its sections side by side, then the works
// inside Works. A page change moves the way you travel on it (see globals.css).
const SECTIONS = ["/", "/about", "/works", "/gallery"];

function pathOf(href) {
  return href.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
}

function depthOf(path) {
  return path.split("/").filter(Boolean).length;
}

export function pageTurn(from, to, rel) {
  if (rel === "next" || rel === "prev") return rel;
  const a = pathOf(from);
  const b = pathOf(to);
  if (depthOf(b) > depthOf(a)) return "in";
  if (depthOf(b) < depthOf(a)) return "out";
  const i = SECTIONS.indexOf(a);
  const j = SECTIONS.indexOf(b);
  return i >= 0 && j >= 0 && j < i ? "prev" : "next";
}

export function smoothNavigate(router, href, { rel } = {}) {
  if (!href || !router) return;
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    haptic("tap");
    window.location.href = href;
    return;
  }

  haptic("navigate");
  const go = () => router.push(href);
  if (prefersReducedMotion()) {
    go();
    return;
  }

  // Between sections the transition screen covers the change.
  if (usesTransitionScreen(window.location.pathname, href.split(/[?#]/)[0]) && playTransitionScreen({ href, go })) {
    return;
  }

  if (!canViewTransition()) {
    go();
    return;
  }

  const current = `${window.location.pathname}${window.location.search}`;
  const root = document.documentElement;
  root.dataset.pageTurn = pageTurn(window.location.pathname, href, rel);
  const settle = () => delete root.dataset.pageTurn;
  try {
    const transition = document.startViewTransition(() => new Promise((resolve) => {
      const done = finishOnce(resolve);
      const onReady = () => {
        const next = `${window.location.pathname}${window.location.search}`;
        if (next === current) return;
        window.removeEventListener("page-ready", onReady);
        workMediaDecoded().then(done);
      };
      window.addEventListener("page-ready", onReady);
      try {
        go();
      } catch {
        done();
      }
      window.setTimeout(() => {
        window.removeEventListener("page-ready", onReady);
        done();
      }, 900);
    }));
    // Skipping a running transition rejects these. Nothing is awaiting them.
    transition.ready?.catch(() => {});
    transition.updateCallbackDone?.catch(() => {});
    transition.finished?.then(settle, settle);
  } catch {
    settle();
    go();
  }
}
