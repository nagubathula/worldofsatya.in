"use client";

import { useEffect, useRef } from "react";

export default function MotionTelemetryOverlay({ containerRef, active = false, paused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active || paused) return undefined;
    const canvas = canvasRef.current;
    const container = containerRef?.current;
    if (!canvas || !container) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    const trail = [];
    const clicks = [];
    const fpsHistory = [];
    let rafId = 0;
    let frames = 0;
    let lastSample = performance.now();
    let currentFps = 60;
    let pointerPos = null;

    const toLocal = (clientX, clientY) => {
      const r = container.getBoundingClientRect();
      return {
        x: clientX - r.left,
        y: clientY - r.top,
        inside:
          clientX >= r.left &&
          clientX <= r.right &&
          clientY >= r.top &&
          clientY <= r.bottom,
      };
    };

    const onMove = (e) => {
      const p = toLocal(e.clientX, e.clientY);
      if (!p.inside) {
        pointerPos = null;
        return;
      }
      pointerPos = { x: p.x, y: p.y };
      trail.push({ x: p.x, y: p.y, ts: performance.now() });
      if (trail.length > 42) trail.shift();
    };

    const onDown = (e) => {
      const p = toLocal(e.clientX, e.clientY);
      if (!p.inside) return;
      clicks.push({ x: p.x, y: p.y, ts: performance.now() });
      if (clicks.length > 8) clicks.shift();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });

    const draw = (now) => {
      frames += 1;
      const elapsed = now - lastSample;
      if (elapsed >= 250) {
        currentFps = Math.min(120, Math.round((frames * 1000) / elapsed));
        fpsHistory.push(currentFps);
        if (fpsHistory.length > 40) fpsHistory.shift();
        frames = 0;
        lastSample = now;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 380;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Prune old trail points (> 650 ms)
      while (trail.length && now - trail[0].ts > 650) trail.shift();
      while (clicks.length && now - clicks[0].ts > 1400) clicks.shift();

      // Draw velocity trail in deep cyan (#0879a0)
      if (trail.length > 1) {
        for (let i = 1; i < trail.length; i++) {
          const a = trail[i - 1];
          const b = trail[i];
          const age = 1 - (now - b.ts) / 650;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(8, 121, 160, ${(age * 0.72).toFixed(3)})`;
          ctx.lineWidth = Math.max(1, age * 2.5);
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Pointer crosshair
      if (pointerPos) {
        ctx.strokeStyle = "rgba(8, 121, 160, 0.22)";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(pointerPos.x, 0);
        ctx.lineTo(pointerPos.x, h);
        ctx.moveTo(0, pointerPos.y);
        ctx.lineTo(w, pointerPos.y);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // Click origin ripples & coordinates in violet (#5b4cf0)
      for (const c of clicks) {
        const progress = (now - c.ts) / 1400;
        const radius = 6 + progress * 34;
        const alpha = (1 - progress) * 0.9;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(91, 76, 240, ${alpha.toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.arc(c.x, c.y, radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = `rgba(91, 76, 240, ${alpha.toFixed(3)})`;
        ctx.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
        ctx.fillText(`(${Math.round(c.x)}, ${Math.round(c.y)})`, c.x + 10, c.y - 8);
      }

      // Corner FPS sparkline badge
      const boxW = 114;
      const boxH = 38;
      const bx = 12;
      const by = h - boxH - 12;
      ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
      ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(bx, by, boxW, boxH, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#0879a0";
      ctx.font = "600 10px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx.fillText(`HUD · ${currentFps} FPS`, bx + 8, by + 13);

      if (fpsHistory.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = "#0d8a38";
        ctx.lineWidth = 1.4;
        fpsHistory.forEach((val, idx) => {
          const sx = bx + 8 + (idx / Math.max(1, fpsHistory.length - 1)) * (boxW - 16);
          const sy = by + boxH - 6 - (Math.min(120, val) / 120) * 14;
          if (idx === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        });
        ctx.stroke();
      }

      rafId = window.requestAnimationFrame(draw);
    };

    rafId = window.requestAnimationFrame(draw);
    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [active, paused, containerRef]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  );
}
