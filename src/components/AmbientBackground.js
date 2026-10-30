"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

// The canvas behind every page: a faint dot grid, three soft colour glows that
// drift on long loops, and a spotlight that wakes the dots up around the pointer.
// Gradients and transforms only (no blur filters), so it costs next to nothing.
// The gallery is its own 3D room and skips it.
export default function AmbientBackground() {
  const pathname = usePathname();
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let frame = 0;
    let x = 0;
    let y = 0;
    // CSS variables, set once per frame: moving the pointer never re-renders React.
    const apply = () => {
      frame = 0;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
      el.style.setProperty("--spot-on", "1");
    };
    const onMove = (event) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => el.style.setProperty("--spot-on", "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  if (pathname?.startsWith("/gallery")) return null;

  return (
    <div ref={ref} aria-hidden="true" className="ambient">
      <div className="ambient-glow ambient-glow-a" />
      <div className="ambient-glow ambient-glow-b" />
      <div className="ambient-glow ambient-glow-c" />
      <div className="ambient-dots" />
      <div className="ambient-dots ambient-dots-lit" />
    </div>
  );
}
