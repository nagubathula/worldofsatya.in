"use client";

import { useRef } from "react";
import { RotateCcw } from "lucide-react";
import { LAB_DEMOS } from "./DemoRegistry";
import MotionTelemetryOverlay from "./MotionTelemetryOverlay";
import { LabTuningProvider } from "@/lib/labTuning";

export default function StageFrame({
  piece,
  mounted = true,
  inView = true,
  reduceMotion = false,
  backdrop = piece.defaultBackdrop || "light",
  viewportMode = "fluid", // "fluid" | "mobile"
  timeScale = 1,
  tunerValues = {},
  telemetryOn = false,
  resetKey = 0,
  interacted = false,
  onReset,
  onInteract,
  onStageEnter,
  onStageLeave,
  className = "",
  stageHeightClass,
}) {
  const stageContainerRef = useRef(null);
  const Demo = LAB_DEMOS[piece.id];

  const surfaceClass =
    backdrop === "paper"
      ? "bg-[#f5f5f7] text-ink border-black/[0.07] shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      : backdrop === "blueprint"
      ? "lab-blueprint-bg text-ink border-[#0879a0]/15 shadow-[0_2px_12px_rgba(0,0,0,0.03)]"
      : "bg-white/65 text-ink border-black/[0.06] shadow-[0_2px_12px_rgba(0,0,0,0.03)] backdrop-blur-sm";

  const isShaderStage = piece.id === "shader-surface";
  const tickBorder = isShaderStage ? "border-white/40" : "border-black/[0.14]";
  const heightCls = stageHeightClass ?? piece.stage;

  return (
    <div
      ref={stageContainerRef}
      data-piece-id={piece.id}
      data-prevent-flip="true"
      data-stage-paused={!inView ? "true" : undefined}
      data-time-scale={timeScale < 1 ? String(timeScale) : undefined}
      onPointerEnter={onStageEnter}
      onPointerLeave={onStageLeave}
      onPointerDown={() => {
        onStageEnter?.();
        onInteract?.();
      }}
      onFocusCapture={onStageEnter}
      onBlurCapture={onStageLeave}
      onKeyDown={(e) => {
        if (
          ["Enter", " ", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) ||
          e.key.length === 1
        ) {
          onInteract?.();
        }
      }}
      className={`relative w-full overflow-hidden rounded-[28px] border ${surfaceClass} ${
        viewportMode === "fluid" ? heightCls : "min-h-[480px] p-4 sm:p-6"
      } ${className}`}
    >
      {/* Subtle corner registration ticks */}
      <span aria-hidden="true" className={`pointer-events-none absolute left-3.5 top-3.5 z-20 h-2.5 w-2.5 border-l border-t ${tickBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute right-3.5 top-3.5 z-20 h-2.5 w-2.5 border-r border-t ${tickBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-3.5 left-3.5 z-20 h-2.5 w-2.5 border-b border-l ${tickBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-3.5 right-3.5 z-20 h-2.5 w-2.5 border-b border-r ${tickBorder}`} />

      {/* Reset button */}
      {onReset && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReset();
          }}
          aria-label={`Reset ${piece.title}`}
          title={`Reset ${piece.title}`}
          className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white/85 px-2.5 py-1 font-labMono text-[10.5px] font-medium text-ink-secondary shadow-sm backdrop-blur-md transition-colors hover:bg-white hover:text-ink outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
        >
          <RotateCcw size={11.5} />
          <span className="hidden sm:inline">Reset</span>
        </button>
      )}

      <LabTuningProvider pieceId={piece.id} values={tunerValues} timeScale={timeScale}>
        {mounted && Demo ? (
          viewportMode === "mobile" ? (
            <div className="mx-auto my-2 w-full max-w-[390px] overflow-hidden rounded-[26px] border border-black/[0.1] bg-white shadow-[0_18px_48px_-16px_rgba(0,0,0,0.12)]">
              <div className={`relative w-full ${heightCls}`}>
                <Demo key={`${resetKey}-mobile`} reduceMotion={reduceMotion || !inView} paused={!inView} />
              </div>
            </div>
          ) : (
            <Demo key={resetKey} reduceMotion={reduceMotion || !inView} paused={!inView} />
          )
        ) : (
          <div className={`flex w-full items-center justify-center ${piece.minHeight}`}>
            <span className="font-labMono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              Loading {piece.shortTitle}…
            </span>
          </div>
        )}
      </LabTuningProvider>

      <MotionTelemetryOverlay
        containerRef={stageContainerRef}
        active={telemetryOn}
        paused={!inView}
      />

      {piece.hint && (
        <p
          className={`pointer-events-none absolute inset-x-0 bottom-3.5 z-20 px-4 text-center font-labMono text-[10.5px] tracking-[0.03em] transition-opacity duration-500 ${
            isShaderStage ? "text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.65)]" : "text-ink-muted"
          } ${interacted ? "opacity-0" : "opacity-100"}`}
        >
          {piece.hint}
        </p>
      )}
    </div>
  );
}
