"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

let burstId = 0;

export default function ClickBurst() {
  const [bursts, setBursts] = useState([]);
  const audioCtxRef = useRef(null);

  // Short synthesized whoosh: filtered noise with a frequency sweep.
  // No audio file needed, and it only ever runs from a click (a user
  // gesture), so autoplay policies never block it.
  const playWhoosh = () => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      if (!audioCtxRef.current) audioCtxRef.current = new Ctx();
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const dur = 0.28;
      const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * dur), ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

      const src = ctx.createBufferSource();
      src.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 0.9;
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(1600, ctx.currentTime + dur * 0.55);
      filter.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + dur);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

      src.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      src.start();
      src.stop(ctx.currentTime + dur);
    } catch {
      // Audio is a garnish — never let it break a click
    }
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onPointerDown = (e) => {
      if (reduced) return;
      playWhoosh();

      const id = burstId++;
      const puffs = Array.from({ length: 5 }, () => {
        // Mostly upward spread, like a puff of disturbed cloud
        const angle = ((-90 + (Math.random() * 150 - 75)) * Math.PI) / 180;
        const dist = 45 + Math.random() * 55;
        return {
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          size: 20 + Math.random() * 22,
          rot: Math.random() * 60 - 30,
          delay: Math.random() * 0.05,
        };
      });

      setBursts((b) => [...b, { id, x: e.clientX, y: e.clientY, puffs }]);
      setTimeout(() => {
        setBursts((b) => b.filter((burst) => burst.id !== id));
      }, 900);
    };

    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <div className="fixed inset-0 z-[60] pointer-events-none" aria-hidden="true">
      {bursts.map((burst) =>
        burst.puffs.map((p, i) => (
          <motion.img
            key={`${burst.id}-${i}`}
            src="/images/cloud.png"
            alt=""
            draggable={false}
            initial={{
              x: burst.x - p.size / 2,
              y: burst.y - p.size / 2,
              opacity: 0.9,
              scale: 0.35,
              rotate: 0,
            }}
            animate={{
              x: burst.x - p.size / 2 + p.dx,
              y: burst.y - p.size / 2 + p.dy,
              opacity: 0,
              scale: 1,
              rotate: p.rot,
            }}
            transition={{ duration: 0.7, ease: "easeOut", delay: p.delay }}
            style={{ width: p.size }}
            className="absolute select-none"
          />
        ))
      )}
    </div>
  );
}
