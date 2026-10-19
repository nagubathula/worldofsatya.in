export const EASE_OUT = [0.22, 1, 0.36, 1];

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
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

function finishOnce(resolve) {
  let settled = false;
  return () => {
    if (settled) return;
    settled = true;
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  };
}

export function smoothNavigate(router, href) {
  if (!href || !router) return;
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    haptic("tap");
    window.location.href = href;
    return;
  }

  haptic("navigate");
  const go = () => router.push(href);
  if (prefersReducedMotion() || !canViewTransition()) {
    go();
    return;
  }

  const current = `${window.location.pathname}${window.location.search}`;
  try {
    const transition = document.startViewTransition(() => new Promise((resolve) => {
      const done = finishOnce(resolve);
      const onReady = () => {
        const next = `${window.location.pathname}${window.location.search}`;
        if (next === current) return;
        window.removeEventListener("page-ready", onReady);
        done();
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
    transition.finished?.catch(() => {});
  } catch {
    go();
  }
}
