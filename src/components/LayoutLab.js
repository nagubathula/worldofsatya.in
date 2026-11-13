"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, Reorder, motion, useDragControls } from "framer-motion";
import { Bell, GripVertical, Plus, X } from "lucide-react";
import { playPopSound, playTickSound, playWhooshSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";

// Four layout animations: the browser moves the box, framer-motion fills in the frames between.
const VIOLET = "#5b4cf0";

function Cell({ label, children, className = "" }) {
  return (
    <div className={`relative flex min-h-[280px] flex-col rounded-2xl border border-black/[0.05] bg-white/70 p-4 ${className}`}>
      <div className="relative flex flex-1 items-center justify-center">{children}</div>
      <p className="mt-4 text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-[#6e6e73]">{label}</p>
    </div>
  );
}

const TABS = [
  { id: "design", label: "Design", body: "Figma, systems, a lot of grids." },
  { id: "build", label: "Build", body: "React, Next.js, springs everywhere." },
  { id: "ship", label: "Ship", body: "Measured, tested, on a real phone." },
];

// The pill is one element that moves between tabs; the panel slides the way you went.
function SlidingTabs() {
  const group = useId();
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);
  const select = (i) => {
    if (i === active) return;
    setDirection(i > active ? 1 : -1);
    setActive(i);
    playTickSound(1500 + i * 200, 0.05);
  };
  return (
    <div className="w-full max-w-[300px]">
      <div role="tablist" aria-label="Sliding tabs" className="relative flex rounded-full bg-[#f0f0f3] p-1">
        {TABS.map((tab, i) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => select(i)}
            className="relative flex-1 rounded-full py-2 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
          >
            {i === active && (
              <motion.span
                layoutId={`${group}-pill`}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_6px_rgba(0,0,0,0.1)]"
                transition={SPRING.pill}
              />
            )}
            <span className={`relative transition-colors duration-200 ${i === active ? "text-[#1d1d1f]" : "text-[#6e6e73]"}`}>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="relative mt-4 h-20 overflow-hidden rounded-2xl border border-black/[0.05] bg-white">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.p
            key={active}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d * 60, opacity: 0, filter: "blur(4px)" }),
              center: { x: 0, opacity: 1, filter: "blur(0px)" },
              exit: (d) => ({ x: d * -60, opacity: 0, filter: "blur(4px)" }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING.enter}
            className="absolute inset-0 flex items-center px-5 text-[14px] leading-snug text-[#515154]"
          >
            {TABS[active].body}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

const TASKS = [
  { id: "a", label: "Sketch the flow", color: "#ff9f0a" },
  { id: "b", label: "Prototype it", color: VIOLET },
  { id: "c", label: "Build the thing", color: "#30b0c7" },
  { id: "d", label: "Ship on Friday", color: "#ff375f" },
];

function TaskRow({ task }) {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={task}
      dragListener={false}
      dragControls={controls}
      whileDrag={{ scale: 1.04, boxShadow: "0 12px 28px rgba(0,0,0,0.14)", zIndex: 2 }}
      transition={SPRING.enter}
      onDragEnd={() => playTickSound(1900, 0.05)}
      className="relative flex h-11 select-none items-center gap-3 rounded-xl border border-black/[0.06] bg-white pl-2 pr-3 text-[13.5px] font-medium text-[#1d1d1f]"
    >
      <span
        onPointerDown={(e) => {
          e.preventDefault();
          controls.start(e);
        }}
        aria-label={`Drag ${task.label}`}
        className="grid h-8 w-6 cursor-grab touch-none place-items-center text-[#a1a1a6] active:cursor-grabbing"
      >
        <GripVertical size={15} />
      </span>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: task.color }} />
      {task.label}
    </Reorder.Item>
  );
}

// Drag a row by its grip; the others step out of the way and settle on release.
function ReorderList() {
  const [tasks, setTasks] = useState(TASKS);
  return (
    <Reorder.Group axis="y" values={tasks} onReorder={setTasks} className="flex w-full max-w-[260px] flex-col gap-2">
      {tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </Reorder.Group>
  );
}

const MESSAGES = [
  "Build passed in 41s",
  "Design review at 4pm",
  "New comment on Hero v3",
  "Deploy is live",
  "Lighthouse score: 100",
  "Figma file updated",
];
const TOAST_H = 52;
const MAX_TOASTS = 4;

// New toasts land in front; the rest tuck behind. Hover fans the stack out, swipe one away.
function ToastStack() {
  const [toasts, setToasts] = useState([]);
  const [open, setOpen] = useState(false);
  const next = useRef(0);
  const timers = useRef(new Map());

  const dismiss = (id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((list) => list.filter((t) => t.id !== id));
  };

  useEffect(() => {
    const all = timers.current;
    return () => all.forEach(clearTimeout);
  }, []);

  const add = () => {
    const id = next.current++;
    setToasts((list) => [{ id, text: MESSAGES[id % MESSAGES.length] }, ...list].slice(0, MAX_TOASTS));
    timers.current.set(id, setTimeout(() => dismiss(id), 6000));
    playPopSound(620 + (id % 4) * 60, 0.1);
  };

  return (
    <div className="flex h-full w-full max-w-[280px] flex-col items-center justify-between gap-4">
      <div
        className="relative h-[200px] w-full"
        onPointerEnter={() => setOpen(true)}
        onPointerLeave={() => setOpen(false)}
        aria-live="polite"
      >
        {toasts.length === 0 && (
          <p className="absolute inset-x-0 bottom-3 text-center text-[12px] text-[#a1a1a6]">No notifications yet</p>
        )}
        <AnimatePresence initial={false}>
          {toasts.map((toast, i) => (
            <motion.div
              key={toast.id}
              drag="x"
              dragSnapToOrigin
              onDragEnd={(_, info) => {
                if (Math.abs(info.offset.x) > 70) {
                  dismiss(toast.id);
                  playWhooshSound({ pitch: 1.4, volume: 0.08, duration: 0.25 });
                }
              }}
              initial={{ y: 24, opacity: 0, scale: 0.9 }}
              animate={{
                y: open ? -i * (TOAST_H + 8) : -i * 10,
                scale: open ? 1 : 1 - i * 0.05,
                opacity: i < 3 || open ? 1 : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={SPRING.enter}
              style={{ zIndex: MAX_TOASTS - i, height: TOAST_H }}
              className="absolute inset-x-0 bottom-0 flex cursor-grab touch-pan-y items-center gap-3 rounded-2xl border border-black/[0.06] bg-white px-3 shadow-[0_6px_20px_rgba(0,0,0,0.08)] active:cursor-grabbing"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#5b4cf0]/10 text-[#5b4cf0]">
                <Bell size={14} />
              </span>
              <span className="flex-1 truncate text-[13px] font-medium text-[#1d1d1f]">{toast.text}</span>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss"
                className="grid h-6 w-6 place-items-center rounded-full text-[#a1a1a6] hover:bg-black/[0.05] hover:text-[#1d1d1f]"
              >
                <X size={13} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <motion.button
        type="button"
        onClick={add}
        whileTap={{ scale: 0.94 }}
        transition={SPRING.press}
        className="relative z-10 flex h-10 items-center gap-2 rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
      >
        <Plus size={14} /> Notify me
      </motion.button>
    </div>
  );
}

// The thumbnail and the open card are the same element: it grows into place, and back.
function ExpandingCard() {
  const id = useId();
  const [open, setOpen] = useState(false);
  const toggle = (value) => {
    setOpen(value);
    playWhooshSound({ pitch: value ? 1.2 : 0.9, volume: 0.08, duration: 0.3 });
  };
  return (
    <LayoutGroup id={id}>
      <div className="absolute inset-0">
        {!open && (
          <div className="flex h-full items-center justify-center">
            <motion.button
              type="button"
              layoutId="card"
              onClick={() => toggle(true)}
              transition={SPRING.enter}
              style={{ borderRadius: 20 }}
              className="flex w-[220px] items-center gap-3 overflow-hidden bg-[#111111] p-3 text-left text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:ring-offset-2"
            >
              <motion.span
                layoutId="art"
                style={{ borderRadius: 12 }}
                className="h-12 w-12 shrink-0 bg-[conic-gradient(from_200deg,#5b4cf0,#ff375f,#ff9f0a,#30b0c7,#5b4cf0)]"
              />
              <motion.span layoutId="title" className="block">
                <span className="block text-[13.5px] font-semibold">Night Shift</span>
                <span className="block text-[11.5px] text-white/60">Tap to open</span>
              </motion.span>
            </motion.button>
          </div>
        )}
        <AnimatePresence>
          {open && (
            <motion.div
              layoutId="card"
              transition={SPRING.enter}
              style={{ borderRadius: 24 }}
              className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-[#111111] p-4 text-white"
            >
              <motion.span
                layoutId="art"
                style={{ borderRadius: 16 }}
                className="block h-28 w-full shrink-0 bg-[conic-gradient(from_200deg,#5b4cf0,#ff375f,#ff9f0a,#30b0c7,#5b4cf0)]"
              />
              <motion.span layoutId="title" className="mt-3 block">
                <span className="block text-[17px] font-semibold">Night Shift</span>
                <span className="block text-[11.5px] text-white/60">A shared-layout transition</span>
              </motion.span>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
                exit={{ opacity: 0, transition: { duration: 0.1 } }}
                className="mt-2 text-[12.5px] leading-relaxed text-white/70"
              >
                One element, two layouts. The art, title and frame each morph on their own spring.
              </motion.p>
              <button
                type="button"
                onClick={() => toggle(false)}
                aria-label="Close card"
                className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-black/40 text-white backdrop-blur outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </LayoutGroup>
  );
}

export default function LayoutLab() {
  return (
    <div className="grid w-full grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:gap-4 sm:p-6">
      <Cell label="Sliding tabs"><SlidingTabs /></Cell>
      <Cell label="Drag to reorder"><ReorderList /></Cell>
      <Cell label="Toast stack"><ToastStack /></Cell>
      <Cell label="Expanding card"><ExpandingCard /></Cell>
    </div>
  );
}
