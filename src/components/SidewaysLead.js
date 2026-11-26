"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";

// The opening of a case study as one strip: the intro, the promo images, then
// the cover. On wide screens it pins and scrolling down moves it sideways; the
// page carries on once the strip ends. Phones, short windows and reduced motion
// get the same pieces stacked. Layout lives under .sw in globals.css. Pass
// `scroller` (a ref) when it sits in its own scroll area, like the home sheet.
const WIDE = "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)";

export default function SidewaysLead({ children, scroller }) {
  const outer = useRef(null);
  const track = useRef(null);
  const bar = useRef(null);
  const lenis = useLenis();

  useEffect(() => {
    const el = outer.current;
    const strip = track.current;
    const box = scroller?.current ?? null;
    const source = box ?? window;
    const top = () => el.getBoundingClientRect().top - (box ? box.getBoundingClientRect().top : 0);
    const wide = window.matchMedia(WIDE);
    let distance = 0;

    const move = () => {
      if (!distance) return;
      const x = Math.min(distance, Math.max(0, -top()));
      strip.style.transform = `translate3d(${-x}px,0,0)`;
      bar.current.style.transform = `scaleX(${x / distance})`;
    };
    const measure = () => {
      distance = wide.matches ? Math.max(0, strip.scrollWidth - el.clientWidth) : 0;
      el.style.setProperty("--sw", `${distance}px`);
      if (distance) move();
      else strip.style.transform = "";
    };
    // A sideways swipe on a trackpad moves the strip too.
    const wheel = (e) => {
      if (!distance || e.ctrlKey || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const at = top();
      if (at > 1 || at < -distance - 1) return;
      e.preventDefault();
      if (box) {
        box.scrollTop += e.deltaX;
        return;
      }
      const to = window.scrollY + e.deltaX;
      if (lenis) lenis.scrollTo(to, { immediate: true });
      else window.scrollTo(0, to);
    };

    measure();
    const sizes = new ResizeObserver(measure);
    sizes.observe(strip);
    sizes.observe(el.parentElement);
    wide.addEventListener("change", measure);
    source.addEventListener("scroll", move, { passive: true });
    el.addEventListener("wheel", wheel, { passive: false });
    return () => {
      sizes.disconnect();
      wide.removeEventListener("change", measure);
      source.removeEventListener("scroll", move);
      el.removeEventListener("wheel", wheel);
    };
  }, [lenis, scroller]);

  return (
    <div ref={outer} className={scroller ? "sw sw-sheet" : "sw"}>
      <div className="sw-pin">
        <div ref={track} className="sw-track">{children}</div>
        <div className="sw-bar" aria-hidden="true"><span ref={bar} /></div>
      </div>
    </div>
  );
}
