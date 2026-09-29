"use client";

import { useEffect, useState } from "react";
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
      {/* Minimal Apple Soft Ambient Canvas */}
      <div className={styles.ambientWash} />

      {/* Interactive Cursor Soft Luminous Touch */}
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
