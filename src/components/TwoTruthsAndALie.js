"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowDown,
  RefreshCw,
  Flame,
  Gamepad2,
} from "lucide-react";
import {
  play8BitCoinSound,
  playPopSound,
  play8BitTapSound,
  play8BitBlipSound,
} from "./SoundEffects";

// Curated 4 rounds of authentic trivia about Satya Sai Nagubathula
// verified against real achievements, publications, and projects.
const ROUNDS_DATA = [
  {
    category: "CREATIVE & PRODUCTION",
    subtitle: "Hollywood, AI pipelines, and secret talents",
    statements: [
      {
        id: "r1-a",
        text: "Worked on 3 feature film productions across visual design, graphics, and video pipelines.",
        isLie: false,
        explanation:
          "100% TRUE! Before diving fully into software & AI engineering, Satya worked across 3 feature films doing visual design, graphics, and media production workflows.",
      },
      {
        id: "r1-b",
        text: "Orchestrated 2,000+ AI Video Pipelines and scaled social channels to 100K+ followers at NxtWave.",
        isLie: false,
        explanation:
          "100% TRUE! As Generative AI Lead at NxtWave, Satya pioneered structured JSON automation for video generation models (Veo 3, Wan 2.2) and built tools slashing asset creation times by 90%.",
      },
      {
        id: "r1-c",
        text: "Won 1st place in an international barista latte-art competition in Milan during a design residency.",
        isLie: true,
        explanation:
          "🎯 BUSTED! That's the lie! While Satya fuels his late-night coding with plenty of coffee and chai, he has never competed in a Milanese latte-art championship!",
      },
    ],
  },
  {
    category: "HARDWARE & SECURITY",
    subtitle: "Physical exploitation, NASA awards, and urban myths",
    statements: [
      {
        id: "r2-a",
        text: "Built CompatrIoT — an open-source hardware security training board with 20 gamified hacking labs.",
        isLie: false,
        explanation:
          "100% TRUE! CompatrIoT is an open-source physical security board with dual microcontrollers (STM32 & ESP32) teaching real-world UART, JTAG, SPI, and BLE exploitation hands-on.",
      },
      {
        id: "r2-b",
        text: "Accidentally bricked a city's smart solar grid during a live university penetration testing drill.",
        isLie: true,
        explanation:
          "🎯 BUSTED! That's the lie! Satya did consulting work for Andhra Pradesh Solar Power Corporation and placed in top hackathons (Kavach, Nullcon), but he never shut down a solar grid!",
      },
      {
        id: "r2-c",
        text: "Won two separate NASA Space Apps Challenge awards — Galactic Impact (2023) and Local Impact (2022).",
        isLie: false,
        explanation:
          "100% TRUE! Satya won the NASA Space Apps Galactic Impact Award in 2023 and the Local Impact Award in 2022 for innovative space-data software solutions.",
      },
    ],
  },
  {
    category: "ENGINEERING & SPEED",
    subtitle: "Radical rewrites, startup pressure, and coding quirks",
    statements: [
      {
        id: "r3-a",
        text: "Re-engineered a 42,000-line Swift/TypeScript desktop app into ~3,500 lines of pure Flutter/Dart in NotBad.",
        isLie: false,
        explanation:
          "100% TRUE! In NotBad, Satya ditched sluggish webviews and built a custom Dart syntax controller that starts in under 1 second from a tiny 10.8 MB installer.",
      },
      {
        id: "r3-b",
        text: "Designed and launched the entire brand, UI, and web code for cybersecurity startup Redantio in just 6 hours.",
        isLie: false,
        explanation:
          "100% TRUE! Under extreme crunch, Satya designed the wireframes, color system, micro-animations, and coded the site in a single 6-hour sprint (documented on Medium).",
      },
      {
        id: "r3-c",
        text: "Coded the entire OpenWeave vector canvas using only an iPad with voice-to-text dictation.",
        isLie: true,
        explanation:
          "🎯 BUSTED! That's the lie! OpenWeave is a sophisticated monorepo with Next.js, Yoga WASM, and Tauri v2 — written on real keyboards with precision engineering!",
      },
    ],
  },
  {
    category: "COMMUNITY & CURIOUS TALES",
    subtitle: "Grassroots FOSS, $0 stacks, and feline companions",
    statements: [
      {
        id: "r4-a",
        text: "Founded Engineerudu, the first Free and Open Source Software (FOSS) community in Andhra Pradesh.",
        isLie: false,
        explanation:
          "100% TRUE! Satya created Engineerudu to help students and developers learn in public, bridge theory to production, and build real open-source tools together.",
      },
      {
        id: "r4-b",
        text: "Built an internal AI automation suite processing 5,000+ tasks monthly for $0/month in server costs.",
        isLie: false,
        explanation:
          "100% TRUE! He cleverly orchestrated Google Colab compute with ngrok and Supabase free-tier webhooks, saving hundreds of dollars a month.",
      },
      {
        id: "r4-c",
        text: "The sunglasses-wearing cat in his profile photo was personally rescued from a data center server rack.",
        isLie: true,
        explanation:
          "🎯 BUSTED! That's the lie! The swagger-filled cat with sunglasses is a playful photo companion designed to capture his curiosity and humor — no server racks involved!",
      },
    ],
  },
];

// Lightweight celebratory confetti particle explosion
function ConfettiExplosion() {
  const particles = Array.from({ length: 26 }, (_, i) => {
    const angle = (i / 26) * 360 + (Math.random() * 20 - 10);
    const rad = (angle * Math.PI) / 180;
    const distance = 80 + Math.random() * 110;
    const colors = [
      "#10b981",
      "#0071e3",
      "#f59e0b",
      "#ec4899",
      "#8b5cf6",
      "#06b6d4",
    ];
    return {
      id: i,
      x: Math.cos(rad) * distance,
      y: Math.sin(rad) * distance - 20,
      scale: 0.5 + Math.random() * 0.7,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
    };
  });

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible z-30">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.x,
            y: p.y,
            opacity: [1, 1, 0],
            scale: [0, p.scale, 0.2],
            rotate: p.rotate,
          }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="absolute h-2.5 w-2.5 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

export default function TwoTruthsAndALie({ onContinue }) {
  const [currentRound, setCurrentRound] = useState(0);
  const [selectedStatementId, setSelectedStatementId] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [wrongGuesses, setWrongGuesses] = useState([]);
  const containerRef = useRef(null);

  const round = ROUNDS_DATA[currentRound];

  const handleSelect = (statement) => {
    if (revealed) return;

    try {
      playPopSound(540, 0.12);
    } catch {}

    if (statement.isLie) {
      // User found the lie!
      setSelectedStatementId(statement.id);
      setRevealed(true);
      setShowConfetti(true);

      const isFirstTry = wrongGuesses.length === 0;
      if (isFirstTry) {
        setScore((prev) => prev + 1);
      }

      try {
        play8BitCoinSound();
      } catch {}

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate([25, 40, 25]);
        } catch {}
      }

      setTimeout(() => setShowConfetti(false), 1200);
    } else {
      // User clicked a truth!
      if (!wrongGuesses.includes(statement.id)) {
        setWrongGuesses((prev) => [...prev, statement.id]);
      }

      try {
        play8BitTapSound();
      } catch {}

      if (typeof navigator !== "undefined" && navigator.vibrate) {
        try {
          navigator.vibrate(20);
        } catch {}
      }
    }
  };

  const handleNextRound = () => {
    try {
      play8BitBlipSound(640);
    } catch {}

    if (currentRound + 1 < ROUNDS_DATA.length) {
      setCurrentRound((prev) => prev + 1);
      setSelectedStatementId(null);
      setRevealed(false);
      setWrongGuesses([]);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    try {
      play8BitBlipSound(520);
    } catch {}
    setCurrentRound(0);
    setSelectedStatementId(null);
    setRevealed(false);
    setScore(0);
    setCompleted(false);
    setWrongGuesses([]);
  };

  const handleScrollToBio = () => {
    if (onContinue) {
      onContinue();
      return;
    }
    const target = document.getElementById("practice-philosophy");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-3xl border border-black/[0.08] bg-gradient-to-b from-[#fbfbfd] to-[#f5f5f7] p-6 sm:p-9 lg:p-10 shadow-[0_12px_40px_rgba(0,0,0,0.03)] overflow-hidden"
    >
      {/* Decorative subtle ambient background */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-200/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />

      {/* Confetti Explosion on Finding the Lie */}
      {showConfetti && <ConfettiExplosion />}

      {/* Header bar */}
      <div className="relative flex flex-wrap items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white shadow-xs">
            <Gamepad2 size={16} />
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[#86868b]">
                Before the story · Warm-up
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Interactive Game
              </span>
            </div>
            <h2 className="mt-0.5 text-xl sm:text-2xl font-semibold tracking-tight text-[#1d1d1f]">
              Two Truths and One Lie
            </h2>
          </div>
        </div>

        {/* Progress & Score Tracker */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-mono text-[#626267] shadow-2xs">
            <Flame size={13} className="text-amber-500" />
            <span>Score: <strong className="text-[#1d1d1f] font-semibold">{score}</strong>/{ROUNDS_DATA.length}</span>
          </div>

          <div className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-xs font-mono text-[#86868b] shadow-2xs">
            Round {currentRound + 1} of {ROUNDS_DATA.length}
          </div>
        </div>
      </div>

      {!completed ? (
        <div className="relative mt-6 sm:mt-7">
          {/* Prompt instruction */}
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.16em] text-[#86868b]">
                Round {currentRound + 1} — {round.category}
              </p>
              <p className="mt-1 text-base sm:text-lg text-[#1d1d1f] font-medium">
                Which of these three statements about Satya is <span className="underline decoration-red-500 decoration-2 underline-offset-4 text-red-600 font-semibold">a complete LIE</span>?
              </p>
            </div>
            <span className="text-xs text-[#86868b] shrink-0 font-sans">
              Click a card to test your guess
            </span>
          </div>

          {/* Statements 3-Card Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentRound}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="grid grid-cols-1 gap-3.5 sm:gap-4"
              >
                {round.statements.map((statement, idx) => {
                  const letter = String.fromCharCode(65 + idx); // A, B, C
                  const isSelected = selectedStatementId === statement.id;
                  const isWrong = wrongGuesses.includes(statement.id);
                  const isLieCard = statement.isLie;

                  let cardStyle =
                    "border-black/[0.08] bg-white hover:border-black/25 hover:shadow-sm";
                  let badge = null;

                  if (revealed) {
                    if (isLieCard) {
                      cardStyle =
                        "border-emerald-500/60 bg-emerald-500/[0.07] shadow-sm ring-1 ring-emerald-500/30";
                      badge = (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-2xs">
                          <CheckCircle2 size={12} />
                          THE LIE (BUSTED!)
                        </span>
                      );
                    } else {
                      cardStyle = "border-black/[0.06] bg-white/70 opacity-90";
                      badge = (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-medium text-blue-700">
                          <CheckCircle2 size={12} />
                          100% TRUE FACT
                        </span>
                      );
                    }
                  } else if (isWrong) {
                    cardStyle =
                      "border-amber-400 bg-amber-500/[0.06] ring-1 ring-amber-400/30";
                    badge = (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-medium text-amber-800">
                        <Sparkles size={12} />
                        ACTUALLY TRUE! GUESS AGAIN
                      </span>
                    );
                  }

                  return (
                    <motion.button
                      key={statement.id}
                      type="button"
                      whileHover={!revealed ? { scale: 1.008 } : {}}
                      whileTap={!revealed ? { scale: 0.995 } : {}}
                      onClick={() => handleSelect(statement)}
                      disabled={revealed}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200 cursor-pointer ${cardStyle}`}
                    >
                      <div className="flex items-start gap-3.5 sm:gap-4 flex-1">
                        <span className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f0f2] font-mono text-xs font-semibold text-[#1d1d1f] group-hover:bg-[#1d1d1f] group-hover:text-white transition-colors">
                          {letter}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm sm:text-base font-normal leading-relaxed text-[#1d1d1f]">
                            {statement.text}
                          </p>

                          {/* Inline truth explanation on reveal or wrong guess */}
                          {(revealed || isWrong) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              transition={{ duration: 0.25 }}
                              className="mt-2.5 pt-2.5 border-t border-black/[0.06] text-xs leading-relaxed text-[#515154]"
                            >
                              {statement.explanation}
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {badge && (
                        <div className="shrink-0 self-start sm:self-center">
                          {badge}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Footer: Next Round / Skip / Jump to Bio */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-black/[0.06]">
            <div>
              {revealed ? (
                <div className="flex items-center gap-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>
                    Great eye! You spotted the lie for Round {currentRound + 1}.
                  </span>
                </div>
              ) : wrongGuesses.length > 0 ? (
                <div className="flex items-center gap-2 text-xs text-amber-700 font-medium">
                  <HelpCircle size={15} className="text-amber-500" />
                  <span>
                    Surprised? That fact is 100% genuine! Now find the fabricated one.
                  </span>
                </div>
              ) : (
                <span className="text-xs text-[#86868b]">
                  Pick the one you believe Satya made up.
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {revealed ? (
                <button
                  type="button"
                  onClick={handleNextRound}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-black transition-all active:scale-95 cursor-pointer"
                >
                  <span>
                    {currentRound + 1 < ROUNDS_DATA.length
                      ? "Next Round"
                      : "See Final Results"}
                  </span>
                  <ArrowRight size={13} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScrollToBio}
                  className="inline-flex items-center gap-1.5 text-xs text-[#626267] hover:text-[#1d1d1f] transition-colors py-2 px-1 underline decoration-black/20 underline-offset-4 cursor-pointer"
                >
                  <span>Skip to bio</span>
                  <ArrowDown size={13} />
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Completed Screen */
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="relative mt-8 text-center py-6"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 shadow-xs mb-4">
            <Trophy size={32} />
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            {score === ROUNDS_DATA.length
              ? "Flawless Intuition! 🎯"
              : score >= 2
              ? "Impressive Radar! 👏"
              : "Wild Facts, Right? 😄"}
          </h3>

          <p className="mt-2 text-sm sm:text-base text-[#515154] max-w-md mx-auto">
            You scored{" "}
            <strong className="text-[#1d1d1f] font-semibold">{score}</strong> out of{" "}
            {ROUNDS_DATA.length}. You now know Satya&apos;s real track record
            better than 95% of visitors!
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={handleScrollToBio}
              className="inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-xs sm:text-sm font-semibold text-white shadow-xs hover:bg-black transition-all active:scale-95 cursor-pointer"
            >
              <span>Explore the full story & craft</span>
              <ArrowDown size={14} />
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-white px-5 py-3 text-xs sm:text-sm font-medium text-[#1d1d1f] hover:bg-black/[0.03] transition-all cursor-pointer shadow-2xs"
            >
              <RefreshCw size={13} />
              <span>Play again</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
