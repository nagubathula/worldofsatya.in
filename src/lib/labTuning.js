"use client";

import { createContext, useContext, useMemo } from "react";
import { MotionConfig } from "framer-motion";
import { SPRING } from "@/lib/motion";

const LabTuningContext = createContext(null);

/**
 * Scales spring stiffness & damping for physics-accurate slow-motion playback.
 * For m*x'' + c*x' + k*x = 0, scaling speed by s multiplies k by s^2 and c by s,
 * preserving the exact damping ratio and overshoot shape.
 */
export function scaleSpring(spring = SPRING.enter, timeScale = 1) {
  const s = typeof timeScale === "number" && timeScale > 0 ? timeScale : 1;
  if (s === 1) return spring;
  if (spring && spring.type === "spring") {
    const stiffness = spring.stiffness ?? 300;
    const damping = spring.damping ?? 30;
    return {
      ...spring,
      stiffness: Math.max(1, stiffness * s * s),
      damping: Math.max(0.5, damping * s),
    };
  }
  if (spring && typeof spring.duration === "number") {
    return {
      ...spring,
      duration: spring.duration / s,
    };
  }
  return spring;
}

export function scaleDuration(durationSec, timeScale = 1) {
  const s = typeof timeScale === "number" && timeScale > 0 ? timeScale : 1;
  return durationSec / s;
}

export function LabTuningProvider({ pieceId, values, timeScale = 1, children }) {
  const ctxValue = useMemo(
    () => ({
      pieceId,
      values: values || {},
      timeScale,
    }),
    [pieceId, values, timeScale],
  );

  const scaledDefaultTransition = useMemo(
    () => (timeScale < 1 ? scaleSpring(SPRING.enter, timeScale) : undefined),
    [timeScale],
  );

  return (
    <LabTuningContext.Provider value={ctxValue}>
      {timeScale < 1 ? (
        <MotionConfig transition={scaledDefaultTransition}>{children}</MotionConfig>
      ) : (
        children
      )}
    </LabTuningContext.Provider>
  );
}

/**
 * Reads live tuned parameters and timeScale for a specimen.
 * Falls back cleanly to `defaults` and `timeScale = 1` outside a provider (e.g. CodeSandbox).
 */
export function useLabTuner(pieceId, defaults = {}) {
  const ctx = useContext(LabTuningContext);
  if (!ctx || (pieceId && ctx.pieceId && ctx.pieceId !== pieceId)) {
    return { ...defaults, timeScale: 1 };
  }
  return { ...defaults, ...ctx.values, timeScale: ctx.timeScale ?? 1 };
}
