"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Pause, Play, RotateCcw, Sparkles, Volume2 } from "lucide-react";
import { isSoundEnabled } from "./SoundEffects";
import { scaleSpring, useLabTuner } from "@/lib/labTuning";
import { SPRING } from "@/lib/motion";

const VOICES = [
  { id: "c5", note: "C5", freq: 523.25, color: "#0879a0" },
  { id: "a4", note: "A4", freq: 440.0, color: "#5b4cf0" },
  { id: "f4", note: "F4", freq: 349.23, color: "#d97706" },
  { id: "d4", note: "D4", freq: 293.66, color: "#0d8a38" },
];

const STEPS = 8;

const DEFAULT_PATTERN = [
  [true, false, false, true, false, false, true, false],
  [false, false, true, false, false, true, false, false],
  [false, true, false, false, true, false, false, true],
  [true, false, false, false, true, false, false, false],
];

const GROOVE_PATTERN = [
  [true, false, true, false, false, true, false, true],
  [false, true, false, false, true, false, true, false],
  [true, false, false, true, false, false, true, false],
  [true, false, true, false, true, false, false, true],
];

const WAVEFORMS = [
  { id: "sawtooth", label: "SAW" },
  { id: "triangle", label: "TRI" },
  { id: "sine", label: "SIN" },
];

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function RotaryDial({ label, value, min, max, step = 1, unit = "", accent = "#0879a0", onChange }) {
  const dragRef = useRef(null);
  const ratio = clamp((value - min) / (max - min), 0, 1);
  const angle = -135 + ratio * 270;

  const r = 20;
  const c = 2 * Math.PI * r;
  const arcLen = c * 0.75;
  const filled = arcLen * ratio;

  const onPointerDown = (e) => {
    e.preventDefault();
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
    dragRef.current = { y: e.clientY, startVal: value };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const dy = dragRef.current.y - e.clientY;
    const raw = dragRef.current.startVal + (dy / 130) * (max - min);
    const snapped = Math.round(raw / step) * step;
    onChange(clamp(Number(snapped.toFixed(2)), min, max));
  };

  const onPointerUp = () => {
    dragRef.current = null;
  };

  const onKeyDown = (e) => {
    const delta =
      e.key === "ArrowUp" || e.key === "ArrowRight"
        ? step * 5
        : e.key === "ArrowDown" || e.key === "ArrowLeft"
        ? -step * 5
        : 0;
    if (!delta) return;
    e.preventDefault();
    onChange(clamp(Number((value + delta).toFixed(2)), min, max));
  };

  const formatted = step < 1 ? value.toFixed(1) : Math.round(value);

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <div
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        className="relative grid h-14 w-14 cursor-ns-resize touch-none place-items-center rounded-full bg-[#f3f4f7] shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
      >
        <svg viewBox="0 0 52 52" className="h-full w-full -rotate-[225deg]">
          <circle
            cx="26"
            cy="26"
            r={r}
            fill="none"
            stroke="rgba(0,0,0,0.1)"
            strokeWidth="3"
            strokeDasharray={`${arcLen} ${c}`}
            strokeLinecap="round"
          />
          <circle
            cx="26"
            cy="26"
            r={r}
            fill="none"
            stroke={accent}
            strokeWidth="3"
            strokeDasharray={`${filled} ${c}`}
            strokeLinecap="round"
          />
        </svg>
        <div
          className="absolute h-8 w-8 rounded-full border border-black/[0.1] bg-gradient-to-b from-white to-[#f4f4f6] shadow-sm"
          style={{ transform: `rotate(${angle}deg)` }}
        >
          <span
            className="absolute left-1/2 top-1 h-2 w-0.5 -translate-x-1/2 rounded-full"
            style={{ backgroundColor: accent }}
          />
        </div>
      </div>
      <div className="text-center">
        <p className="font-labMono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">{label}</p>
        <p className="font-labMono text-[11px] font-medium tabular-nums text-ink">
          {formatted}
          {unit}
        </p>
      </div>
    </div>
  );
}

export default function SynthLab({ reduceMotion = false, paused = false }) {
  const tuner = useLabTuner("tactile-synth", {
    bpm: 118,
    cutoff: 1900,
    resonance: 5.2,
    release: 210,
  });

  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [waveform, setWaveform] = useState("sawtooth");
  const [offsets, setOffsets] = useState({ cutoff: 0, resonance: 0, release: 0 });
  const [mutedNote, setMutedNote] = useState(false);

  const cutoff = clamp(tuner.cutoff + offsets.cutoff, 240, 6400);
  const resonance = clamp(tuner.resonance + offsets.resonance, 0.5, 16);
  const releaseMs = clamp(tuner.release + offsets.release, 60, 650);

  const audioRef = useRef({ ctx: null, analyser: null, data: null });
  const canvasRef = useRef(null);
  const phaseRef = useRef(0);
  const paramsRef = useRef({ cutoff, resonance, releaseMs, waveform, playing });

  useEffect(() => {
    paramsRef.current = { cutoff, resonance, releaseMs, waveform, playing };
  }, [cutoff, resonance, releaseMs, waveform, playing]);

  const ensureAudio = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!isSoundEnabled()) {
      setMutedNote(true);
      return null;
    }
    setMutedNote(false);
    try {
      if (!audioRef.current.ctx) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return null;
        const ctx = new Ctx();
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        analyser.connect(ctx.destination);
        audioRef.current = {
          ctx,
          analyser,
          data: new Uint8Array(analyser.frequencyBinCount),
        };
      }
      if (audioRef.current.ctx.state === "suspended") {
        audioRef.current.ctx.resume().catch(() => {});
      }
      return audioRef.current;
    } catch {
      return null;
    }
  }, []);

  const triggerVoice = useCallback(
    (freq) => {
      const audio = ensureAudio();
      if (!audio?.ctx || !audio?.analyser) return;
      const { ctx, analyser } = audio;
      const p = paramsRef.current;
      const now = ctx.currentTime;
      const dur = p.releaseMs / 1000;

      const osc = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc.type = p.waveform;
      osc.frequency.setValueAtTime(freq, now);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(p.cutoff, now);
      filter.Q.setValueAtTime(p.resonance, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.11, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(analyser);

      osc.start(now);
      osc.stop(now + dur + 0.02);
      osc.onended = () => {
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
        } catch {}
      };
    },
    [ensureAudio],
  );

  useEffect(() => {
    if (!playing || paused) return undefined;
    const effectiveBpm = Math.max(40, tuner.bpm * (tuner.timeScale || 1));
    const stepMs = (60 / effectiveBpm / 2) * 1000;
    const id = window.setInterval(() => {
      setStep((prev) => {
        const next = (prev + 1) % STEPS;
        VOICES.forEach((voice, rowIdx) => {
          if (pattern[rowIdx][next]) triggerVoice(voice.freq);
        });
        return next;
      });
    }, stepMs);
    return () => window.clearInterval(id);
  }, [playing, paused, pattern, tuner.bpm, tuner.timeScale, triggerVoice]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx2d = canvas.getContext("2d");
    if (!ctx2d) return undefined;

    let rafId = 0;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || 320;
      const h = canvas.clientHeight || 72;
      if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
      }

      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, w, h);

      ctx2d.strokeStyle = "rgba(0,0,0,0.07)";
      ctx2d.lineWidth = 1;
      ctx2d.beginPath();
      ctx2d.moveTo(0, h / 2);
      ctx2d.lineTo(w, h / 2);
      ctx2d.stroke();

      const audio = audioRef.current;
      let hasLiveEnergy = false;
      if (audio.analyser && audio.data && audio.ctx?.state === "running") {
        audio.analyser.getByteTimeDomainData(audio.data);
        for (let i = 0; i < audio.data.length; i++) {
          if (Math.abs(audio.data[i] - 128) > 2) {
            hasLiveEnergy = true;
            break;
          }
        }
      }

      const p = paramsRef.current;
      phaseRef.current += (p.playing ? 0.1 : 0.035) * (tuner.timeScale || 1);

      ctx2d.beginPath();
      ctx2d.strokeStyle = hasLiveEnergy ? "#0879a0" : "rgba(8, 121, 160, 0.55)";
      ctx2d.lineWidth = 1.8;

      if (hasLiveEnergy) {
        const len = audio.data.length;
        for (let i = 0; i < len; i++) {
          const x = (i / (len - 1)) * w;
          const v = (audio.data[i] - 128) / 128;
          const y = h / 2 + v * (h * 0.42);
          if (i === 0) ctx2d.moveTo(x, y);
          else ctx2d.lineTo(x, y);
        }
      } else {
        const harmonics = p.waveform === "sawtooth" ? 4 : p.waveform === "triangle" ? 2 : 1;
        const amp = (h * 0.22) * (0.55 + (p.cutoff / 6400) * 0.45);
        for (let px = 0; px <= w; px += 2) {
          const t = (px / w) * Math.PI * 4 + phaseRef.current;
          let sample = 0;
          for (let k = 1; k <= harmonics; k++) {
            const weight = p.waveform === "sawtooth" ? 1 / k : 1 / (k * k);
            sample += Math.sin(t * k) * weight;
          }
          const y = h / 2 + sample * amp * 0.72;
          if (px === 0) ctx2d.moveTo(px, y);
          else ctx2d.lineTo(px, y);
        }
      }
      ctx2d.stroke();

      if (!paused && !reduceMotion) {
        rafId = window.requestAnimationFrame(draw);
      }
    };

    draw();
    return () => window.cancelAnimationFrame(rafId);
  }, [paused, reduceMotion, tuner.timeScale, waveform, cutoff, resonance]);

  const toggleCell = (rowIdx, colIdx) => {
    const next = !pattern[rowIdx][colIdx];
    setPattern((prev) =>
      prev.map((row, r) => (r === rowIdx ? row.map((v, c) => (c === colIdx ? next : v)) : row)),
    );
    if (next) triggerVoice(VOICES[rowIdx].freq);
  };

  const togglePlay = () => {
    ensureAudio();
    setPlaying((p) => {
      if (p) setStep(-1);
      return !p;
    });
  };

  const padSpring = scaleSpring(SPRING.press, tuner.timeScale);

  return (
    <div className="flex w-full items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-3xl rounded-2xl border border-black/[0.07] bg-white p-4 text-ink shadow-[0_12px_36px_-14px_rgba(0,0,0,0.08)] sm:p-6">
        {/* Top instrument strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-labMono text-[11px] font-medium uppercase tracking-[0.12em] transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] ${
                playing
                  ? "bg-[#0879a0] text-white shadow-sm"
                  : "border border-black/[0.08] bg-[#f5f5f7] text-ink hover:bg-[#ebebf0]"
              }`}
            >
              {playing ? <Pause size={13} /> : <Play size={13} />}
              {playing ? "Running" : "Play Loop"}
            </button>

            <div className="flex rounded-full border border-black/[0.06] bg-[#f5f5f7] p-0.5" role="group" aria-label="Oscillator waveform">
              {WAVEFORMS.map((wf) => {
                const active = waveform === wf.id;
                return (
                  <button
                    key={wf.id}
                    type="button"
                    onClick={() => setWaveform(wf.id)}
                    className={`rounded-full px-2.5 py-1 font-labMono text-[10px] tracking-[0.1em] transition-colors ${
                      active ? "bg-white font-semibold text-[#0879a0] shadow-sm" : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    {wf.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-labMono text-[10.5px] tabular-nums text-ink-muted">
              {Math.round(tuner.bpm)} BPM
            </span>
            <button
              type="button"
              onClick={() => {
                ensureAudio();
                setPattern(GROOVE_PATTERN);
              }}
              className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-[#f7f7fa] px-2.5 py-1 font-labMono text-[10px] uppercase tracking-[0.1em] text-ink-secondary hover:bg-[#efeff4] hover:text-ink"
            >
              <Sparkles size={11} className="text-[#d97706]" />
              Groove
            </button>
            <button
              type="button"
              onClick={() => setPattern(Array.from({ length: 4 }, () => Array(STEPS).fill(false)))}
              className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-[#f7f7fa] px-2.5 py-1 font-labMono text-[10px] uppercase tracking-[0.1em] text-ink-muted hover:bg-[#efeff4] hover:text-ink"
            >
              <RotateCcw size={11} />
              Clear
            </button>
          </div>
        </div>

        {/* Oscilloscope + Rotary Dials */}
        <div className="mt-4 grid gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-center">
          <div className="relative overflow-hidden rounded-xl border border-black/[0.06] bg-[#f7f8fb] p-2">
            <div className="mb-1 flex items-center justify-between px-1.5 font-labMono text-[9.5px] uppercase tracking-[0.14em] text-ink-muted">
              <span className="inline-flex items-center gap-1.5">
                <Volume2 size={11} className="text-[#0879a0]" />
                Oscilloscope · {waveform.toUpperCase()}
              </span>
              {mutedNote && <span className="text-[#d97706]">Muted (press M)</span>}
            </div>
            <canvas ref={canvasRef} className="h-[68px] w-full" />
          </div>

          <div className="flex items-center justify-around rounded-xl border border-black/[0.06] bg-[#f7f8fb] px-2 py-3">
            <RotaryDial
              label="Cutoff"
              value={cutoff}
              min={240}
              max={6400}
              step={20}
              unit="Hz"
              accent="#0879a0"
              onChange={(next) => setOffsets((o) => ({ ...o, cutoff: next - tuner.cutoff }))}
            />
            <RotaryDial
              label="Resonance"
              value={resonance}
              min={0.5}
              max={16}
              step={0.1}
              unit="Q"
              accent="#5b4cf0"
              onChange={(next) => setOffsets((o) => ({ ...o, resonance: next - tuner.resonance }))}
            />
            <RotaryDial
              label="Release"
              value={releaseMs}
              min={60}
              max={650}
              step={10}
              unit="ms"
              accent="#0d8a38"
              onChange={(next) => setOffsets((o) => ({ ...o, release: next - tuner.release }))}
            />
          </div>
        </div>

        {/* 4 x 8 tactile sequencer pad matrix */}
        <div className="mt-4 flex flex-col gap-2">
          {VOICES.map((voice, rowIdx) => (
            <div key={voice.id} className="grid grid-cols-[44px_1fr] items-center gap-2">
              <button
                type="button"
                onClick={() => triggerVoice(voice.freq)}
                className="flex h-9 items-center justify-center rounded-lg border border-black/[0.07] bg-[#f7f7fa] font-labMono text-[11px] font-medium text-ink-secondary transition-colors hover:border-black/20 hover:text-ink"
                title={`Preview ${voice.note}`}
              >
                {voice.note}
              </button>

              <div className="grid grid-cols-8 gap-1.5">
                {pattern[rowIdx].map((active, colIdx) => {
                  const isPlayhead = step === colIdx;
                  return (
                    <motion.button
                      key={colIdx}
                      type="button"
                      aria-pressed={active}
                      aria-label={`${voice.note} step ${colIdx + 1}`}
                      whileTap={{ scale: 0.9 }}
                      transition={padSpring}
                      onClick={() => toggleCell(rowIdx, colIdx)}
                      className="relative h-9 rounded-lg border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                      style={{
                        borderColor: isPlayhead
                          ? "rgba(29,29,31,0.45)"
                          : active
                          ? `${voice.color}60`
                          : "rgba(0,0,0,0.07)",
                        backgroundColor: active
                          ? `${voice.color}${isPlayhead ? "38" : "1c"}`
                          : isPlayhead
                          ? "rgba(0,0,0,0.05)"
                          : "#f7f7fa",
                      }}
                    >
                      {active && (
                        <span
                          className="mx-auto block h-1.5 w-3 rounded-full"
                          style={{
                            backgroundColor: voice.color,
                            boxShadow: isPlayhead ? `0 0 8px ${voice.color}88` : "none",
                          }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
