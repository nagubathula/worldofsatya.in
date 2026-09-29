"use client";

import { useEffect, useRef } from "react";
import styles from "./RetroBackground.module.css";

export default function RetroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Mouse coordinates with smooth interpolation
    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      isHovering: false,
      speed: 0,
      lastX: width / 2,
      lastY: height / 2,
    };

    // Click ripples
    const ripples = [];

    // Grid spacing & points
    const SPACING = 38;
    const INFLUENCE_RADIUS = 150;
    const INFLUENCE_RADIUS_SQ = INFLUENCE_RADIUS * INFLUENCE_RADIUS;

    class Point {
      constructor(baseX, baseY) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.x = baseX;
        this.y = baseY;
        this.vx = 0;
        this.vy = 0;
        this.size = 1.1;
        this.targetSize = 1.1;
        this.alpha = 0.07;
        this.color = "rgba(0, 0, 0, 0.07)";
      }

      update(mx, my, isHovering, activeRipples) {
        let targetX = this.baseX;
        let targetY = this.baseY;
        let targetAlpha = 0.07;
        let targetSize = 1.1;
        let isInfluenced = false;

        // Pointer proximity interaction
        if (isHovering) {
          const dx = mx - this.baseX;
          const dy = my - this.baseY;
          const distSq = dx * dx + dy * dy;

          if (distSq < INFLUENCE_RADIUS_SQ) {
            const dist = Math.sqrt(distSq);
            const factor = 1 - dist / INFLUENCE_RADIUS; // 0 to 1
            const easeFactor = factor * factor; // smooth curve

            // Gentle magnetic attraction towards cursor
            const pull = easeFactor * 14;
            targetX = this.baseX + (dx / dist) * pull;
            targetY = this.baseY + (dy / dist) * pull;

            targetAlpha = 0.07 + easeFactor * 0.65;
            targetSize = 1.1 + easeFactor * 2.2;
            isInfluenced = true;
          }
        }

        // Ripple shockwave interaction
        for (let i = 0; i < activeRipples.length; i++) {
          const r = activeRipples[i];
          const rdx = this.x - r.x;
          const rdy = this.y - r.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const diff = Math.abs(rDist - r.radius);

          if (diff < 35 && rDist > 0) {
            const waveStrength = (1 - diff / 35) * (1 - r.radius / r.maxRadius);
            const push = waveStrength * 16;
            targetX += (rdx / rDist) * push;
            targetY += (rdy / rDist) * push;
            targetAlpha = Math.max(targetAlpha, waveStrength * 0.8);
            targetSize = Math.max(targetSize, 1.2 + waveStrength * 2.5);
            isInfluenced = true;
          }
        }

        // Elastic spring physics toward target
        const ax = (targetX - this.x) * 0.16;
        const ay = (targetY - this.y) * 0.16;
        this.vx = (this.vx + ax) * 0.72;
        this.vy = (this.vy + ay) * 0.72;
        this.x += this.vx;
        this.y += this.vy;

        this.alpha += (targetAlpha - this.alpha) * 0.2;
        this.size += (targetSize - this.size) * 0.2;

        if (isInfluenced) {
          // Dynamic Apple system-blue highlight
          this.color = `rgba(0, 113, 227, ${this.alpha})`;
        } else {
          this.color = `rgba(0, 0, 0, ${this.alpha})`;
        }
      }

      draw(c) {
        c.fillStyle = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    let points = [];

    const initGrid = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      points = [];
      const cols = Math.ceil(width / SPACING) + 1;
      const rows = Math.ceil(height / SPACING) + 1;
      const offsetX = (width - (cols - 1) * SPACING) / 2;
      const offsetY = (height - (rows - 1) * SPACING) / 2;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const x = offsetX + c * SPACING;
          const y = offsetY + r * SPACING;
          points.push(new Point(x, y));
        }
      }
    };

    initGrid();

    // Event Handlers
    const handlePointerMove = (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      if (!mouse.isHovering) mouse.isHovering = true;
    };

    const handlePointerLeave = () => {
      mouse.isHovering = false;
    };

    const handlePointerDown = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: Math.min(width, height) * 0.35,
        speed: 7,
        alpha: 1,
      });
      if (ripples.length > 5) ripples.shift();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handlePointerLeave);
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });

    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initGrid, 120);
    };
    window.addEventListener("resize", handleResize);

    // Animation Loop
    let lastTime = performance.now();

    const render = (now) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse interpolation (spring lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.18;
      mouse.y += (mouse.targetY - mouse.y) * 0.18;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Subtle Interactive Spotlight Glow
      if (mouse.isHovering) {
        const glowRadius = Math.min(width, height) * 0.38;
        const spotlight = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          glowRadius
        );
        spotlight.addColorStop(0, "rgba(0, 113, 227, 0.055)");
        spotlight.addColorStop(0.4, "rgba(142, 142, 147, 0.03)");
        spotlight.addColorStop(1, "rgba(251, 251, 253, 0)");

        ctx.fillStyle = spotlight;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Update and Draw Expanding Shockwave Ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);

        // Draw faint ripple ring
        ctx.strokeStyle = `rgba(0, 113, 227, ${r.alpha * 0.22})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (r.radius >= r.maxRadius || r.alpha <= 0.01) {
          ripples.splice(i, 1);
        }
      }

      // 3. Update & Draw Grid Points
      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.update(mouse.x, mouse.y, mouse.isHovering, ripples);
        p.draw(ctx);
      }

      // 4. Subtle connecting light filigree between nearby energized points
      if (mouse.isHovering) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < points.length; i++) {
          const p1 = points[i];
          if (p1.alpha < 0.2) continue;

          const dxM = p1.x - mouse.x;
          const dyM = p1.y - mouse.y;
          if (dxM * dxM + dyM * dyM > 70 * 70) continue;

          for (let j = i + 1; j < points.length; j++) {
            const p2 = points[j];
            if (p2.alpha < 0.2) continue;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distSq = dx * dx + dy * dy;

            if (distSq < SPACING * SPACING * 1.6) {
              const lineAlpha = Math.min(p1.alpha, p2.alpha) * 0.45;
              ctx.strokeStyle = `rgba(0, 113, 227, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handlePointerLeave);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Base Minimal Canvas Wash */}
      <div className={styles.ambientWash} />

      {/* Interactive High-DPI Grid Canvas */}
      <canvas ref={canvasRef} className={styles.interactiveCanvas} />
    </div>
  );
}
