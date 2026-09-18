"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./RetroBackground.module.css";

export default function RetroBackground() {
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      if (!isHovering) setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering]);

  return (
    <div className={styles.container} aria-hidden="true">
      {/* Cinematic Retro Landscape Artwork Layer */}
      <div className={styles.imageLayer}>
        <Image
          src="/images/hero.jpg"
          alt="Satya in landscape"
          fill
          priority
          sizes="100vw"
          className={styles.artwork}
        />
      </div>

      {/* Warm Archival Sepia Color Grade */}
      <div className={styles.colorGrade} />

      {/* Central Luminous Readability Halo */}
      <div className={styles.readabilityHalo} />

      {/* Subtle Blueprint Drafting Grid Overlay */}
      <div className={styles.subtleGrid} />

      {/* Interactive Cursor Warmth */}
      <div
        className={styles.cursorGlow}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
          opacity: isHovering ? 1 : 0,
        }}
      />
    </div>
  );
}
