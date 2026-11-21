"use client";

import { useId, useMemo } from "react";

const SIM_DURATION = 1.4; // seconds
const DT = 1 / 480;
const STEPS = Math.round(SIM_DURATION / DT);
const SAMPLE_EVERY = 4; // 120 Hz SVG path resolution

function simulateSpring({ stiffness = 360, damping = 28, mass = 1 }) {
  const k = Math.max(10, stiffness);
  const c = Math.max(0.5, damping);
  const m = Math.max(0.1, mass);

  let x = 0;
  let v = 0;
  const samples = [{ t: 0, x: 0 }];
  let maxX = 0;
  let lastOutsideIndex = 0;

  for (let i = 1; i <= STEPS; i++) {
    const a = (-k * (x - 1) - c * v) / m;
    v += a * DT;
    x += v * DT;

    if (x > maxX) maxX = x;
    if (Math.abs(x - 1) > 0.02) lastOutsideIndex = i;

    if (i % SAMPLE_EVERY === 0) {
      samples.push({ t: i * DT, x });
    }
  }

  const zeta = c / (2 * Math.sqrt(k * m));
  const regime = zeta < 0.96 ? "Underdamped" : zeta <= 1.04 ? "Critical" : "Overdamped";
  const overshootPct = Math.max(0, (maxX - 1) * 100);
  const settleMs = Math.round(lastOutsideIndex * DT * 1000);

  return { samples, zeta, regime, overshootPct, settleMs, maxX };
}

export default function SpringCurvePlot({
  stiffness = 360,
  damping = 28,
  mass = 1,
  timeScale = 1,
  accent = "#5b4cf0",
}) {
  const gradId = useId();
  const sim = useMemo(
    () => simulateSpring({ stiffness, damping, mass }),
    [stiffness, damping, mass],
  );

  const W = 300;
  const H = 104;
  const padX = 10;
  const padTop = 14;
  const padBottom = 16;
  const plotW = W - padX * 2;
  const plotH = H - padTop - padBottom;
  const yCeiling = Math.max(1.32, sim.maxX + 0.12);

  const toX = (t) => padX + (t / SIM_DURATION) * plotW;
  const toY = (val) => padTop + plotH - (val / yCeiling) * plotH;

  const targetY = toY(1);
  const pathD = sim.samples
    .map((pt, i) => `${i === 0 ? "M" : "L"}${toX(pt.t).toFixed(1)},${toY(pt.x).toFixed(1)}`)
    .join(" ");
  const areaD = `${pathD} L${toX(SIM_DURATION).toFixed(1)},${toY(0).toFixed(1)} L${toX(0).toFixed(1)},${toY(0).toFixed(1)} Z`;

  const peakPt = sim.samples.reduce((best, p) => (p.x > best.x ? p : best), sim.samples[0]);

  return (
    <div className="rounded-xl border border-black/[0.07] bg-[#f7f7fa] p-3">
      <div className="mb-2 flex items-center justify-between gap-2 font-labMono text-[10px] uppercase tracking-[0.12em]">
        <span className="text-ink-muted">Step Response · {sim.regime}</span>
        <span style={{ color: accent }}>ζ = {sim.zeta.toFixed(2)}</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-24 w-full overflow-visible"
        role="img"
        aria-label={`Spring step response curve: ${sim.regime}, ${sim.overshootPct.toFixed(1)}% overshoot, settles in ${sim.settleMs}ms`}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={accent} stopOpacity="0.22" />
            <stop offset="100%" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Reference grid lines */}
        {[0.25, 0.5, 0.75].map((frac) => (
          <line
            key={frac}
            x1={padX + plotW * frac}
            y1={padTop}
            x2={padX + plotW * frac}
            y2={H - padBottom}
            stroke="rgba(0,0,0,0.06)"
            strokeWidth="1"
          />
        ))}
        <line
          x1={padX}
          y1={toY(0)}
          x2={W - padX}
          y2={toY(0)}
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />

        {/* Target line y = 1.0 */}
        <line
          x1={padX}
          y1={targetY}
          x2={W - padX}
          y2={targetY}
          stroke="rgba(217,119,6,0.5)"
          strokeDasharray="3 3"
          strokeWidth="1"
        />

        {/* Area & Curve */}
        <path d={areaD} fill={`url(#${gradId})`} />
        <path
          d={pathD}
          fill="none"
          stroke={accent}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Peak overshoot marker */}
        {sim.overshootPct > 0.6 && (
          <circle
            cx={toX(peakPt.t)}
            cy={toY(peakPt.x)}
            r="3"
            fill="#d97706"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        )}
      </svg>

      <div className="mt-2 grid grid-cols-3 gap-1.5 border-t border-black/[0.06] pt-2 font-labMono text-[10px]">
        <div>
          <span className="block text-ink-muted">OVERSHOOT</span>
          <span className="tabular-nums text-ink">{sim.overshootPct.toFixed(1)}%</span>
        </div>
        <div>
          <span className="block text-ink-muted">SETTLE (±2%)</span>
          <span className="tabular-nums text-ink">
            {Math.round(sim.settleMs / Math.max(0.1, timeScale))} ms
          </span>
        </div>
        <div>
          <span className="block text-ink-muted">K / C / M</span>
          <span className="tabular-nums text-ink">
            {Math.round(stiffness)}·{Math.round(damping)}·{mass}
          </span>
        </div>
      </div>
    </div>
  );
}
