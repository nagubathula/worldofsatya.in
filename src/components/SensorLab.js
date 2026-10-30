"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { playPopSound, playTickSound, playWhooshSound } from "./SoundEffects";

// Pieces that answer to the phone itself: tilt it, shake it. Every one has a
// mouse stand-in, so a laptop gets the same toys.

const clamp = (v, min = -1, max = 1) => Math.min(max, Math.max(min, v));

// iOS asks before it hands over motion sensors, and only from a tap.
function useMotionPermission() {
  const [needed, setNeeded] = useState(false);
  useEffect(() => {
    // Touch screens only: some desktop browsers expose the call but have no sensors.
    setNeeded(
      typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function" &&
        window.matchMedia("(pointer: coarse)").matches
    );
  }, []);
  const request = useCallback(async () => {
    try {
      const results = await Promise.all([
        DeviceOrientationEvent.requestPermission?.(),
        typeof DeviceMotionEvent !== "undefined" ? DeviceMotionEvent.requestPermission?.() : "granted",
      ]);
      if (results.every((r) => r === "granted" || r === undefined)) setNeeded(false);
    } catch {}
  }, []);
  return { needed, request };
}

// Tilt as two springs from -1 to 1: the phone's angle where there is one, the
// pointer's offset from the element's centre where there isn't.
function useTilt(ref) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 120, damping: 14 });
  const y = useSpring(rawY, { stiffness: 120, damping: 14 });

  useEffect(() => {
    let sensor = false;
    const onOrient = (event) => {
      if (event.gamma == null || event.beta == null) return;
      sensor = true;
      rawX.set(clamp(event.gamma / 30));
      // Phones are held leaning back about 40 degrees; that's level.
      rawY.set(clamp((event.beta - 40) / 30));
    };
    const onPointer = (event) => {
      if (sensor || event.pointerType === "touch" || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      rawX.set(clamp((event.clientX - (r.left + r.width / 2)) / (r.width / 2)));
      rawY.set(clamp((event.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    };
    const onLeave = () => {
      if (sensor) return;
      rawX.set(0);
      rawY.set(0);
    };
    const el = ref.current;
    window.addEventListener("deviceorientation", onOrient);
    el?.addEventListener("pointermove", onPointer);
    el?.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("deviceorientation", onOrient);
      el?.removeEventListener("pointermove", onPointer);
      el?.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, rawX, rawY]);

  return { x, y };
}

// A shake: a jolt from the accelerometer, or the pointer whipped back and forth
// over the element (four turns inside 700ms).
function useShake(ref, onShake) {
  const callback = useRef(onShake);
  callback.current = onShake;

  useEffect(() => {
    let last = null;
    let cooldown = 0;
    const fire = () => {
      const now = Date.now();
      if (now < cooldown) return;
      cooldown = now + 800;
      callback.current();
    };
    const onMotion = (event) => {
      const a = event.accelerationIncludingGravity;
      if (!a || a.x == null) return;
      if (last) {
        const jolt = Math.abs(a.x - last.x) + Math.abs(a.y - last.y) + Math.abs(a.z - last.z);
        if (jolt > 22) fire();
      }
      last = { x: a.x, y: a.y, z: a.z };
    };

    let lastX = null;
    let direction = 0;
    let turns = [];
    const onPointer = (event) => {
      if (event.pointerType === "touch") return;
      if (lastX !== null) {
        const dx = event.clientX - lastX;
        if (Math.abs(dx) > 8) {
          const d = Math.sign(dx);
          if (direction && d !== direction) {
            const now = performance.now();
            turns = [...turns.filter((t) => now - t < 700), now];
            if (turns.length >= 4) {
              turns = [];
              fire();
            }
          }
          direction = d;
        }
      }
      lastX = event.clientX;
    };
    const el = ref.current;
    window.addEventListener("devicemotion", onMotion);
    el?.addEventListener("pointermove", onPointer);
    return () => {
      window.removeEventListener("devicemotion", onMotion);
      el?.removeEventListener("pointermove", onPointer);
    };
  }, [ref]);
}

function Cell({ label, hint, children }) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-between gap-4 rounded-2xl border border-black/[0.05] bg-white/70 px-4 py-6">
      {/* Stretched, so the whole cell answers the mouse, not just the toy in it. */}
      <div className="flex w-full flex-1 items-stretch justify-center">{children}</div>
      <div className="text-center">
        <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#6e6e73]">{label}</p>
        <p className="mt-1 text-[11px] text-[#6e6e73]">{hint}</p>
      </div>
    </div>
  );
}

// A foil card that leans with the phone; the rainbow and the glare slide the other way.
function HoloCard() {
  const ref = useRef(null);
  const { x, y } = useTilt(ref);
  const rotateY = useTransform(x, [-1, 1], [-22, 22]);
  const rotateX = useTransform(y, [-1, 1], [18, -18]);
  const foil = useTransform(x, [-1, 1], ["0% 50%", "100% 50%"]);
  const glareX = useTransform(x, [-1, 1], ["80%", "20%"]);
  const glareY = useTransform(y, [-1, 1], ["80%", "20%"]);
  const glare = useTransform([glareX, glareY], ([gx, gy]) => `radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 55%)`);

  return (
    <div ref={ref} className="grid h-full w-full place-items-center p-4" style={{ perspective: 700 }}>
      <motion.div
        className="relative h-[170px] w-[120px] overflow-hidden rounded-2xl shadow-[0_20px_40px_-14px_rgba(40,30,120,0.5)]"
        style={{ rotateX, rotateY, background: "#1d1d1f" }}
      >
        <motion.span
          className="absolute inset-0 opacity-70 mix-blend-screen"
          style={{
            backgroundImage:
              "linear-gradient(110deg, #ff6ec7, #7a6dff, #2ec4f0, #6bffb8, #ffe66d, #ff6ec7)",
            backgroundSize: "300% 100%",
            backgroundPosition: foil,
          }}
        />
        <span className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.06)_0_2px,transparent_2px_6px)]" />
        <motion.span className="absolute inset-0" style={{ backgroundImage: glare }} />
        <span className="absolute bottom-3 left-3 right-3 text-white">
          <span className="block font-mono text-[8px] uppercase tracking-[0.2em] opacity-80">Holo · 001</span>
          <span className="mt-0.5 block text-[15px] font-semibold leading-tight tracking-[-0.02em]">Satya</span>
        </span>
      </motion.div>
    </div>
  );
}

const PIPS = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 26], [72, 26], [28, 50], [72, 50], [28, 74], [72, 74]],
};

function Die({ value, roll, delay }) {
  return (
    <motion.div
      key={roll}
      className="relative h-14 w-14 rounded-xl border border-black/[0.08] bg-white shadow-[0_6px_14px_rgba(0,0,0,0.12)]"
      initial={roll ? { rotate: -540, y: -70, scale: 0.7 } : false}
      animate={{ rotate: 0, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 160, damping: 12, delay }}
    >
      {PIPS[value].map(([px, py], i) => (
        <span
          key={i}
          className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${px}%`, top: `${py}%`, background: value === 1 ? "#ff375f" : "#1d1d1f" }}
        />
      ))}
    </motion.div>
  );
}

// Shake the phone, whip the mouse over them, or tap: the dice tumble and land.
function ShakeDice() {
  const ref = useRef(null);
  const [dice, setDice] = useState([3, 5]);
  const [roll, setRoll] = useState(0);
  const rollDice = useCallback(() => {
    setDice([1 + Math.floor(Math.random() * 6), 1 + Math.floor(Math.random() * 6)]);
    setRoll((r) => r + 1);
    playWhooshSound({ pitch: 1.3, volume: 0.1, duration: 0.3 });
    window.setTimeout(() => playTickSound(900, 0.08), 380);
    window.setTimeout(() => playTickSound(1100, 0.06), 470);
    try {
      navigator.vibrate?.([12, 40, 12]);
    } catch {}
  }, []);
  useShake(ref, rollDice);

  return (
    <div ref={ref} className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="flex gap-4">
        <Die value={dice[0]} roll={roll} delay={0} />
        <Die value={dice[1]} roll={roll} delay={0.06} />
      </div>
      <button
        type="button"
        onClick={rollDice}
        className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1d1d1f] outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
      >
        Roll · {dice[0] + dice[1]}
      </button>
    </div>
  );
}

// A marble in a shallow bowl, like a spirit level: it rolls downhill as you tilt.
function MarbleLevel() {
  const ref = useRef(null);
  const { x, y } = useTilt(ref);
  const R = 62;
  const mx = useTransform([x, y], ([a, b]) => {
    const len = Math.hypot(a, b);
    return (len > 1 ? a / len : a) * R;
  });
  const my = useTransform([x, y], ([a, b]) => {
    const len = Math.hypot(a, b);
    return (len > 1 ? b / len : b) * R;
  });
  const [level, setLevel] = useState("0.0°");
  const wasLevel = useRef(true);
  useEffect(() => {
    const update = () => {
      const deg = Math.hypot(x.get(), y.get()) * 30;
      setLevel(`${deg.toFixed(1)}°`);
      // A soft click each time the marble settles back in the centre ring.
      const centred = deg < 2;
      if (centred && !wasLevel.current) playPopSound(660, 0.05);
      wasLevel.current = centred;
    };
    const offX = x.on("change", update);
    const offY = y.on("change", update);
    return () => {
      offX();
      offY();
    };
  }, [x, y]);

  return (
    <div ref={ref} className="flex h-full w-full flex-col items-center justify-center gap-3">
      <div className="relative grid h-[160px] w-[160px] place-items-center rounded-full bg-[radial-gradient(circle_at_50%_45%,#ffffff,#ececf1_70%)] shadow-[inset_0_4px_14px_rgba(0,0,0,0.12)]">
        <span className="absolute h-9 w-9 rounded-full border border-dashed border-[#0879a0]/40" />
        <span className="absolute h-px w-full bg-black/[0.05]" />
        <span className="absolute h-full w-px bg-black/[0.05]" />
        <motion.span
          className="absolute h-7 w-7 rounded-full bg-[radial-gradient(circle_at_35%_30%,#a99fff,#5b4cf0_55%,#2c1f9e)] shadow-[0_6px_10px_rgba(40,30,120,0.35)]"
          style={{ x: mx, y: my }}
        />
      </div>
      <p className="font-mono text-[12px] tabular-nums text-[#1d1d1f]" aria-live="off">
        {level}
      </p>
    </div>
  );
}

export default function SensorLab() {
  const { needed, request } = useMotionPermission();
  return (
    <div className="flex w-full flex-col gap-3 p-3 sm:gap-4 sm:p-6">
      {needed && (
        <button
          type="button"
          onClick={request}
          className="mx-auto rounded-full bg-[#111111] px-4 py-2 text-[13px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
        >
          Enable motion sensors
        </button>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Cell label="Holo card" hint="Tilt your phone, or move the mouse over it.">
          <HoloCard />
        </Cell>
        <Cell label="Shake to roll" hint="Shake your phone, whip the mouse across, or tap.">
          <ShakeDice />
        </Cell>
        <Cell label="Marble level" hint="Tilt to roll it; centre it to level.">
          <MarbleLevel />
        </Cell>
      </div>
    </div>
  );
}
