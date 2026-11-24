"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { playPopSound, playTickSound, playTingSound } from "./SoundEffects";
import { SPRING } from "@/lib/motion";

const TAKEN_HANDLES = new Set(["satya", "admin", "nxtwave", "root"]);

function Cell({ label, children }) {
  return (
    <div className="flex min-h-[260px] flex-col justify-between gap-4 rounded-2xl border border-black/[0.05] bg-white/70 px-4 py-5">
      <div className="flex flex-1 flex-col justify-center">{children}</div>
      <p className="text-center font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-muted">{label}</p>
    </div>
  );
}

function InlineValidationCell() {
  const handleId = useId();
  const emailId = useId();
  const [handle, setHandle] = useState("satya");
  const [handleState, setHandleState] = useState("taken"); // idle | checking | available | taken | short
  const [email, setEmail] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const checkHandle = (raw) => {
    const clean = raw.toLowerCase().replace(/[^a-z0-9._-]/g, "");
    setHandle(clean);
    clearTimeout(timerRef.current);

    if (!clean) {
      setHandleState("idle");
      return;
    }
    if (clean.length < 3) {
      setHandleState("short");
      return;
    }

    setHandleState("checking");
    timerRef.current = window.setTimeout(() => {
      const taken = TAKEN_HANDLES.has(clean);
      setHandleState(taken ? "taken" : "available");
      if (!taken) playPopSound(660, 0.06);
    }, 320);
  };

  const applySuggestion = (suggestion) => {
    clearTimeout(timerRef.current);
    setHandle(suggestion);
    setHandleState("available");
    playPopSound(720, 0.08);
  };

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const showEmailError = emailTouched && email.trim().length > 0 && !emailValid;

  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <label htmlFor={handleId} className="block text-[11.5px] font-medium text-ink-secondary">
          Handle
        </label>
        <div
          className={`mt-1 flex h-10 items-center rounded-xl border bg-white px-3 transition-colors ${
            handleState === "taken"
              ? "border-[#e11d48]/50"
              : handleState === "available"
              ? "border-[#0d8a38]/45"
              : "border-black/[0.08] focus-within:border-[#5b4cf0]"
          }`}
        >
          <span className="mr-0.5 text-[13px] text-ink-muted">@</span>
          <input
            id={handleId}
            type="text"
            value={handle}
            onChange={(e) => checkHandle(e.target.value)}
            placeholder="username"
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted/60"
          />
          <span className="ml-2 flex h-4 w-4 shrink-0 items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {handleState === "checking" && (
                <motion.span key="spin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Loader2 size={14} className="animate-spin text-ink-muted" />
                </motion.span>
              )}
              {handleState === "available" && (
                <motion.span
                  key="ok"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={SPRING.press}
                  className="text-[#0d8a38]"
                >
                  <Check size={14} strokeWidth={2.6} />
                </motion.span>
              )}
              {handleState === "taken" && (
                <motion.span
                  key="err"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={SPRING.press}
                  className="text-[#e11d48]"
                >
                  <AlertCircle size={14} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </div>

        {/* Fixed-height status slot prevents layout shift across state transitions */}
        <div className="mt-1.5 flex min-h-[22px] items-center justify-between gap-2 text-[11.5px]">
          {handleState === "checking" && <span className="text-ink-muted">Checking availability…</span>}
          {handleState === "available" && <span className="font-medium text-[#0d8a38]">@{handle} is available</span>}
          {handleState === "taken" && (
            <div className="flex w-full items-center justify-between gap-2">
              <span className="text-[#e11d48]">@{handle} is taken</span>
              <button
                type="button"
                onClick={() => applySuggestion(`${handle}.dev`)}
                className="rounded-full bg-[#5b4cf0]/10 px-2 py-0.5 font-mono text-[10.5px] font-medium text-[#5b4cf0] transition-colors hover:bg-[#5b4cf0]/15"
              >
                Use @{handle}.dev
              </button>
            </div>
          )}
          {handleState === "short" && <span className="text-ink-muted">Keep typing (3+ chars)</span>}
          {handleState === "idle" && <span className="text-ink-muted">Try @satya or your handle</span>}
        </div>
      </div>

      <div>
        <label htmlFor={emailId} className="block text-[11.5px] font-medium text-ink-secondary">
          Email
        </label>
        <div
          className={`mt-1 flex h-10 items-center rounded-xl border bg-white px-3 transition-colors ${
            showEmailError
              ? "border-[#e11d48]/50"
              : emailValid
              ? "border-[#0d8a38]/45"
              : "border-black/[0.08] focus-within:border-[#5b4cf0]"
          }`}
        >
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => setEmailTouched(true)}
            placeholder="you@studio.in"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted/60"
          />
          {emailValid && <Check size={14} strokeWidth={2.5} className="ml-2 shrink-0 text-[#0d8a38]" />}
        </div>
        <p className="mt-1 min-h-[16px] text-[11px] text-[#e11d48]">
          {showEmailError ? "Enter a valid email address" : ""}
        </p>
      </div>
    </div>
  );
}

const RULES = [
  { id: "len", label: "8+ chars", test: (v) => v.length >= 8 },
  { id: "upper", label: "A–Z", test: (v) => /[A-Z]/.test(v) },
  { id: "num", label: "0–9", test: (v) => /[0-9]/.test(v) },
  { id: "sym", label: "Symbol", test: (v) => /[^A-Za-z0-9]/.test(v) },
];

const STRENGTH_LEVELS = [
  { label: "Empty", color: "#d1d1d6" },
  { label: "Weak", color: "#e11d48" },
  { label: "Fair", color: "#d97706" },
  { label: "Good", color: "#0879a0" },
  { label: "Strong", color: "#0d8a38" },
];

function PasswordStrengthCell() {
  const inputId = useId();
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const passed = RULES.map((rule) => rule.test(password));
  const score = password.length === 0 ? 0 : Math.max(1, passed.filter(Boolean).length);
  const strength = STRENGTH_LEVELS[score];

  return (
    <div className="flex w-full flex-col gap-3">
      <div>
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-[11.5px] font-medium text-ink-secondary">
            Password
          </label>
          <span className="font-mono text-[11px] font-medium" style={{ color: score === 0 ? undefined : strength.color }}>
            {strength.label}
          </span>
        </div>
        <div className="mt-1 flex h-10 items-center rounded-xl border border-black/[0.08] bg-white px-3 focus-within:border-[#5b4cf0]">
          <input
            id={inputId}
            type={visible ? "text" : "password"}
            value={password}
            onChange={(e) => {
              const next = e.target.value;
              const nextScore = next.length === 0 ? 0 : Math.max(1, RULES.filter((r) => r.test(next)).length);
              if (nextScore > score) playTickSound(1400 + nextScore * 160, 0.035);
              setPassword(next);
            }}
            placeholder="Create password"
            className="min-w-0 flex-1 bg-transparent text-[13px] text-ink outline-none placeholder:text-ink-muted/60"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            className="ml-2 text-ink-muted transition-colors hover:text-ink"
          >
            {visible ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* 4-segment spring meter */}
      <div className="grid grid-cols-4 gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((idx) => {
          const filled = score > idx;
          return (
            <div key={idx} className="h-1.5 overflow-hidden rounded-full bg-black/[0.06]">
              <motion.div
                className="h-full origin-left rounded-full"
                initial={false}
                animate={{
                  scaleX: filled ? 1 : 0,
                  backgroundColor: filled ? strength.color : "#d1d1d6",
                }}
                transition={SPRING.pill}
              />
            </div>
          );
        })}
      </div>

      {/* Rule checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {RULES.map((rule, idx) => {
          const ok = passed[idx];
          return (
            <div
              key={rule.id}
              className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[11.5px] transition-colors ${
                ok
                  ? "border-[#0d8a38]/25 bg-[#0d8a38]/[0.06] text-[#0d8a38]"
                  : "border-black/[0.05] bg-white/80 text-ink-muted"
              }`}
            >
              <motion.span
                initial={false}
                animate={{ scale: ok ? 1 : 0.75 }}
                transition={SPRING.press}
                className={`grid h-3.5 w-3.5 place-items-center rounded-full ${
                  ok ? "bg-[#0d8a38] text-white" : "bg-black/[0.07] text-transparent"
                }`}
              >
                <Check size={9} strokeWidth={3} />
              </motion.span>
              <span className="font-medium">{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const VALID_OTP = "428190";

function OtpInputCell({ reduceMotion }) {
  const uid = useId();
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [focusIdx, setFocusIdx] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | verified | error
  const [shakeTick, setShakeTick] = useState(0);
  const inputsRef = useRef([]);

  const submitCode = (nextDigits) => {
    const code = nextDigits.join("");
    if (code.length < 6) {
      setStatus("idle");
      return;
    }
    if (code === VALID_OTP) {
      setStatus("verified");
      playTingSound(1568, 0.06);
    } else {
      setStatus("error");
      setShakeTick((n) => n + 1);
      playTickSound(880, 0.06);
    }
  };

  const fillFromString = (raw, startAt = 0) => {
    const nums = raw.replace(/\D/g, "").slice(0, 6 - startAt).split("");
    if (!nums.length) return;
    const next = [...digits];
    nums.forEach((ch, offset) => {
      next[startAt + offset] = ch;
    });
    setDigits(next);
    const nextFocus = Math.min(5, startAt + nums.length);
    inputsRef.current[nextFocus]?.focus();
    playTickSound(1700, 0.03);
    submitCode(next);
  };

  const handleChange = (idx, value) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length > 2 || (clean.length === 2 && !digits[idx])) {
      fillFromString(clean, idx);
      return;
    }
    const digit = clean.length === 2 && digits[idx] ? clean.replace(digits[idx], "").slice(-1) || clean.slice(-1) : clean;
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit) {
      playTickSound(1550 + idx * 70, 0.03);
      if (idx < 5) inputsRef.current[idx + 1]?.focus();
    } else {
      setStatus("idle");
    }
    submitCode(next);
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      e.preventDefault();
      const next = [...digits];
      next[idx - 1] = "";
      setDigits(next);
      setStatus("idle");
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowLeft" && idx > 0) {
      e.preventDefault();
      inputsRef.current[idx - 1]?.focus();
    } else if (e.key === "ArrowRight" && idx < 5) {
      e.preventDefault();
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const reset = () => {
    setDigits(["", "", "", "", "", ""]);
    setStatus("idle");
    inputsRef.current[0]?.focus();
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="text-center">
        <p className="text-[12px] font-medium text-ink-secondary">Enter verification code</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">Demo code: 428190</p>
      </div>

      <motion.div
        key={shakeTick}
        animate={status === "error" && !reduceMotion ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.36 }}
        className="flex items-center justify-center gap-1.5"
      >
        {digits.map((digit, idx) => {
          const isFocused = focusIdx === idx;
          return (
            <motion.div
              key={idx}
              animate={
                status === "verified" && !reduceMotion
                  ? { y: [0, -5, 0] }
                  : { y: 0 }
              }
              transition={{ duration: 0.35, delay: idx * 0.04 }}
              className="relative"
            >
              {isFocused && status !== "verified" && (
                <motion.span
                  layoutId={`${uid}-otp-ring`}
                  transition={SPRING.pill}
                  className="pointer-events-none absolute -inset-[2px] rounded-[11px] border-2 border-[#5b4cf0]"
                />
              )}
              <input
                ref={(el) => {
                  inputsRef.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6}
                aria-label={`Digit ${idx + 1}`}
                value={digit}
                onFocus={() => setFocusIdx(idx)}
                onBlur={() => setFocusIdx((cur) => (cur === idx ? null : cur))}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  fillFromString(e.clipboardData.getData("text"), 0);
                }}
                className={`relative h-11 w-9 rounded-[10px] border text-center font-mono text-[16px] font-semibold outline-none transition-colors ${
                  status === "verified"
                    ? "border-[#0d8a38] bg-[#0d8a38]/10 text-[#0d8a38]"
                    : status === "error"
                    ? "border-[#e11d48] bg-[#fff1f2] text-[#e11d48]"
                    : "border-black/[0.1] bg-white text-ink"
                }`}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="flex min-h-[26px] items-center gap-2">
        {status === "verified" ? (
          <>
            <span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#0d8a38]">
              <Check size={13} strokeWidth={2.5} /> Verified
            </span>
            <button
              type="button"
              onClick={reset}
              className="rounded-full border border-black/[0.08] bg-white px-2.5 py-0.5 text-[11px] font-medium text-ink-secondary hover:text-ink"
            >
              Reset
            </button>
          </>
        ) : (
          <>
            {status === "error" && <span className="text-[11.5px] font-medium text-[#e11d48]">Invalid · try 428190</span>}
            <button
              type="button"
              onClick={() => fillFromString(VALID_OTP, 0)}
              className="rounded-full border border-black/[0.08] bg-white px-3 py-1 text-[11.5px] font-medium text-ink transition-colors hover:bg-[#f5f5f7]"
            >
              Paste 428190
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function FormLab({ reduceMotion = false }) {
  return (
    <div className="grid w-full grid-cols-1 gap-3 p-3 sm:gap-4 sm:p-6 lg:grid-cols-3">
      <Cell label="Inline validation">
        <InlineValidationCell />
      </Cell>
      <Cell label="Password strength">
        <PasswordStrengthCell />
      </Cell>
      <Cell label="One-time code">
        <OtpInputCell reduceMotion={reduceMotion} />
      </Cell>
    </div>
  );
}
