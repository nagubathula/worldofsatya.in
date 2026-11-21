"use client";

import { useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { playTickSound } from "./SoundEffects";
import { EASE_OUT, SPRING } from "@/lib/motion";

const METRICS = {
  renders: {
    id: "renders",
    label: "Renders / day",
    unit: "",
    color: "#5b4cf0",
    goodUp: true,
    format: (v) => v.toLocaleString("en-US"),
    deltaFormat: (d) => `${d >= 0 ? "+" : ""}${Math.round(d).toLocaleString("en-US")}`,
    series: {
      "7D": [
        { label: "Nov 10", value: 1180 },
        { label: "Nov 11", value: 1320 },
        { label: "Nov 12", value: 1290 },
        { label: "Nov 13", value: 1540 },
        { label: "Nov 14", value: 1690 },
        { label: "Nov 15", value: 1610 },
        { label: "Nov 16", value: 1840 },
      ],
      "30D": [
        { label: "Oct 18", value: 890 },
        { label: "Oct 21", value: 940 },
        { label: "Oct 24", value: 1020 },
        { label: "Oct 27", value: 980 },
        { label: "Oct 30", value: 1150 },
        { label: "Nov 02", value: 1210 },
        { label: "Nov 05", value: 1180 },
        { label: "Nov 08", value: 1390 },
        { label: "Nov 11", value: 1470 },
        { label: "Nov 13", value: 1620 },
        { label: "Nov 15", value: 1710 },
        { label: "Nov 16", value: 1840 },
      ],
      "90D": [
        { label: "Aug 20", value: 520 },
        { label: "Aug 30", value: 610 },
        { label: "Sep 09", value: 590 },
        { label: "Sep 19", value: 740 },
        { label: "Sep 29", value: 830 },
        { label: "Oct 09", value: 910 },
        { label: "Oct 19", value: 1060 },
        { label: "Oct 29", value: 1240 },
        { label: "Nov 07", value: 1520 },
        { label: "Nov 16", value: 1840 },
      ],
      "1Y": [
        { label: "Dec", value: 210 },
        { label: "Jan", value: 290 },
        { label: "Feb", value: 340 },
        { label: "Mar", value: 420 },
        { label: "Apr", value: 510 },
        { label: "May", value: 640 },
        { label: "Jun", value: 780 },
        { label: "Jul", value: 920 },
        { label: "Aug", value: 1090 },
        { label: "Sep", value: 1310 },
        { label: "Oct", value: 1560 },
        { label: "Nov", value: 1840 },
      ],
    },
  },
  latency: {
    id: "latency",
    label: "p95 latency",
    unit: "ms",
    color: "#0879a0",
    goodUp: false,
    format: (v) => `${Math.round(v)} ms`,
    deltaFormat: (d) => `${d >= 0 ? "+" : ""}${Math.round(d)} ms`,
    series: {
      "7D": [
        { label: "Nov 10", value: 248 },
        { label: "Nov 11", value: 236 },
        { label: "Nov 12", value: 242 },
        { label: "Nov 13", value: 214 },
        { label: "Nov 14", value: 196 },
        { label: "Nov 15", value: 188 },
        { label: "Nov 16", value: 174 },
      ],
      "30D": [
        { label: "Oct 18", value: 312 },
        { label: "Oct 21", value: 298 },
        { label: "Oct 24", value: 304 },
        { label: "Oct 27", value: 282 },
        { label: "Oct 30", value: 274 },
        { label: "Nov 02", value: 265 },
        { label: "Nov 05", value: 251 },
        { label: "Nov 08", value: 238 },
        { label: "Nov 11", value: 222 },
        { label: "Nov 13", value: 204 },
        { label: "Nov 15", value: 186 },
        { label: "Nov 16", value: 174 },
      ],
      "90D": [
        { label: "Aug 20", value: 420 },
        { label: "Aug 30", value: 395 },
        { label: "Sep 09", value: 372 },
        { label: "Sep 19", value: 356 },
        { label: "Sep 29", value: 334 },
        { label: "Oct 09", value: 318 },
        { label: "Oct 19", value: 289 },
        { label: "Oct 29", value: 254 },
        { label: "Nov 07", value: 216 },
        { label: "Nov 16", value: 174 },
      ],
      "1Y": [
        { label: "Dec", value: 540 },
        { label: "Jan", value: 510 },
        { label: "Feb", value: 470 },
        { label: "Mar", value: 445 },
        { label: "Apr", value: 412 },
        { label: "May", value: 380 },
        { label: "Jun", value: 348 },
        { label: "Jul", value: 315 },
        { label: "Aug", value: 282 },
        { label: "Sep", value: 246 },
        { label: "Oct", value: 208 },
        { label: "Nov", value: 174 },
      ],
    },
  },
};

const RANGES = ["7D", "30D", "90D", "1Y"];

// Monotone cubic spline (Fritsch-Carlson) so curves never overshoot below/above real data.
function monotonePath(pts) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  const n = pts.length;
  const dx = [];
  const dy = [];
  const m = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = pts[i + 1].x - pts[i].x;
    dy[i] = pts[i + 1].y - pts[i].y;
    m[i] = dy[i] / (dx[i] || 1);
  }

  const tangents = new Array(n);
  tangents[0] = m[0];
  tangents[n - 1] = m[n - 2];
  for (let i = 1; i < n - 1; i++) {
    if (m[i - 1] * m[i] <= 0) {
      tangents[i] = 0;
    } else {
      const w1 = 2 * dx[i] + dx[i - 1];
      const w2 = dx[i] + 2 * dx[i - 1];
      tangents[i] = (w1 + w2) / (w1 / m[i - 1] + w2 / m[i]);
    }
  }

  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const step = dx[i] / 3;
    const c1x = pts[i].x + step;
    const c1y = pts[i].y + tangents[i] * step;
    const c2x = pts[i + 1].x - step;
    const c2y = pts[i + 1].y - tangents[i + 1] * step;
    d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${pts[i + 1].x.toFixed(2)} ${pts[i + 1].y.toFixed(2)}`;
  }
  return d;
}

const VB_W = 640;
const VB_H = 220;
const PAD = { top: 20, right: 16, bottom: 26, left: 16 };

export default function ChartLab({ reduceMotion = false }) {
  const uid = useId();
  const svgRef = useRef(null);
  const lastSoundIdx = useRef(null);

  const [metricKey, setMetricKey] = useState("renders");
  const [range, setRange] = useState("30D");
  const [activeIdx, setActiveIdx] = useState(null);

  const metric = METRICS[metricKey];
  const data = metric.series[range];

  const chart = useMemo(() => {
    const values = data.map((d) => d.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const span = Math.max(1, max - min);
    const yLo = min - span * 0.16;
    const yHi = max + span * 0.14;
    const plotW = VB_W - PAD.left - PAD.right;
    const plotH = VB_H - PAD.top - PAD.bottom;

    const points = data.map((d, i) => ({
      ...d,
      x: PAD.left + (i / Math.max(1, data.length - 1)) * plotW,
      y: PAD.top + (1 - (d.value - yLo) / (yHi - yLo)) * plotH,
    }));

    const line = monotonePath(points);
    const baseLineY = PAD.top + plotH;
    const area = `${line} L ${points[points.length - 1].x.toFixed(2)} ${baseLineY} L ${points[0].x.toFixed(2)} ${baseLineY} Z`;
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const first = values[0];
    const last = values[values.length - 1];
    const pct = ((last - first) / Math.max(1, first)) * 100;

    return { points, line, area, avg, pct, baseLineY, plotH };
  }, [data]);

  const inspectedIdx = activeIdx !== null ? Math.min(activeIdx, chart.points.length - 1) : null;
  const activePoint = inspectedIdx !== null ? chart.points[inspectedIdx] : null;
  const latestPoint = chart.points[chart.points.length - 1];
  const displayPoint = activePoint || latestPoint;
  const deltaFromAvg = displayPoint.value - chart.avg;
  const positiveTrend = metric.goodUp ? chart.pct >= 0 : chart.pct <= 0;

  const updateFromClientX = (clientX) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const relX = ((clientX - rect.left) / Math.max(1, rect.width)) * VB_W;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < chart.points.length; i++) {
      const dist = Math.abs(chart.points[i].x - relX);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    }
    if (lastSoundIdx.current !== best) {
      lastSoundIdx.current = best;
      playTickSound(1450 + best * 35, 0.02);
    }
    setActiveIdx(best);
  };

  const handleChartKey = (e) => {
    const current = inspectedIdx ?? chart.points.length - 1;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = Math.max(0, current - 1);
      setActiveIdx(next);
      playTickSound(1400 + next * 30, 0.025);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(chart.points.length - 1, current + 1);
      setActiveIdx(next);
      playTickSound(1400 + next * 30, 0.025);
    } else if (e.key === "Escape") {
      setActiveIdx(null);
    }
  };

  const gradId = `${uid}-grad`;

  return (
    <div className="w-full p-3 sm:p-6">
      <div className="mx-auto w-full rounded-2xl border border-black/[0.06] bg-white/85 p-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] sm:p-6">
        {/* Top controls: metric tabs + range tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="tablist" aria-label="Telemetry metric" className="inline-flex rounded-full bg-[#f0f0f3] p-1">
            {Object.values(METRICS).map((m) => {
              const selected = m.id === metricKey;
              return (
                <button
                  key={m.id}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setMetricKey(m.id);
                    setActiveIdx(null);
                    playTickSound(1600, 0.04);
                  }}
                  className="relative rounded-full px-3.5 py-1 text-[12px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {selected && (
                    <motion.span
                      layoutId={`${uid}-metric-pill`}
                      transition={SPRING.pill}
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                    />
                  )}
                  <span className={`relative ${selected ? "text-ink" : "text-ink-muted"}`}>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div role="tablist" aria-label="Time range" className="inline-flex rounded-full bg-[#f0f0f3] p-1">
            {RANGES.map((r) => {
              const selected = r === range;
              return (
                <button
                  key={r}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  onClick={() => {
                    setRange(r);
                    setActiveIdx(null);
                    playTickSound(1750, 0.04);
                  }}
                  className="relative rounded-full px-2.5 py-1 font-mono text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0]"
                >
                  {selected && (
                    <motion.span
                      layoutId={`${uid}-range-pill`}
                      transition={SPRING.pill}
                      className="absolute inset-0 rounded-full bg-white shadow-sm"
                    />
                  )}
                  <span className={`relative ${selected ? "text-ink" : "text-ink-muted"}`}>{r}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI Readout */}
        <div className="mt-5 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-muted">
              {activePoint ? `${metric.label} · ${displayPoint.label}` : `Latest · ${displayPoint.label}`}
            </p>
            <div className="mt-1 flex items-baseline gap-2.5">
              <span className="text-3xl font-semibold tabular-nums tracking-[-0.035em] text-ink sm:text-4xl">
                {metric.format(displayPoint.value)}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[11px] font-medium ${
                  positiveTrend ? "bg-[#0d8a38]/10 text-[#0d8a38]" : "bg-[#e11d48]/10 text-[#e11d48]"
                }`}
              >
                {chart.pct >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {chart.pct >= 0 ? "+" : ""}
                {chart.pct.toFixed(1)}%
              </span>
            </div>
          </div>

          <p className="font-mono text-[11.5px] tabular-nums text-ink-muted">
            Avg {metric.format(Math.round(chart.avg))} ·{" "}
            <span className="text-ink-secondary">{metric.deltaFormat(deltaFromAvg)} vs avg</span>
          </p>
        </div>

        {/* Chart stage */}
        <div className="relative mt-4">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            role="slider"
            tabIndex={0}
            aria-label={`${metric.label} over ${range}`}
            aria-valuemin={0}
            aria-valuemax={chart.points.length - 1}
            aria-valuenow={inspectedIdx ?? chart.points.length - 1}
            aria-valuetext={`${displayPoint.label}: ${metric.format(displayPoint.value)}`}
            onKeyDown={handleChartKey}
            onPointerDown={(e) => {
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {}
              updateFromClientX(e.clientX);
            }}
            onPointerMove={(e) => updateFromClientX(e.clientX)}
            onPointerLeave={() => {
              lastSoundIdx.current = null;
              setActiveIdx(null);
            }}
            className="h-[200px] w-full cursor-crosshair touch-pan-y select-none overflow-visible outline-none focus-visible:ring-2 focus-visible:ring-[#0879a0] focus-visible:rounded-xl sm:h-[220px]"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={metric.color} stopOpacity="0.22" />
                <stop offset="100%" stopColor={metric.color} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Horizontal gridlines */}
            {[0, 0.33, 0.66, 1].map((t) => {
              const gy = PAD.top + t * chart.plotH;
              return (
                <line
                  key={t}
                  x1={PAD.left}
                  x2={VB_W - PAD.right}
                  y1={gy}
                  y2={gy}
                  stroke="rgba(0,0,0,0.06)"
                  strokeDasharray={t === 1 ? undefined : "3 4"}
                />
              );
            })}

            {/* Area fill */}
            <motion.path
              key={`${metricKey}-${range}-area`}
              d={chart.area}
              fill={`url(#${gradId})`}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
            />

            {/* Main spline */}
            <motion.path
              key={`${metricKey}-${range}-line`}
              d={chart.line}
              fill="none"
              stroke={metric.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduceMotion ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.55, ease: EASE_OUT }}
            />

            {/* X-axis endpoints */}
            <text x={PAD.left} y={VB_H - 6} fontSize="10" fill="currentColor" className="fill-ink-muted font-mono">
              {chart.points[0].label}
            </text>
            <text
              x={VB_W - PAD.right}
              y={VB_H - 6}
              fontSize="10"
              textAnchor="end"
              fill="currentColor"
              className="fill-ink-muted font-mono"
            >
              {latestPoint.label}
            </text>

            {/* Interactive crosshair */}
            {activePoint && (
              <g aria-hidden="true">
                <line
                  x1={activePoint.x}
                  x2={activePoint.x}
                  y1={PAD.top - 4}
                  y2={chart.baseLineY}
                  stroke={metric.color}
                  strokeOpacity="0.4"
                  strokeWidth="1.25"
                />
                <line
                  x1={PAD.left}
                  x2={VB_W - PAD.right}
                  y1={activePoint.y}
                  y2={activePoint.y}
                  stroke={metric.color}
                  strokeOpacity="0.24"
                  strokeDasharray="3 3"
                />
                <circle cx={activePoint.x} cy={activePoint.y} r="9" fill={metric.color} fillOpacity="0.16" />
                <circle
                  cx={activePoint.x}
                  cy={activePoint.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke={metric.color}
                  strokeWidth="2.5"
                />
              </g>
            )}
          </svg>

          {/* Edge-clamped HTML floating tooltip */}
          {activePoint && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1 z-10 -translate-x-1/2 rounded-xl border border-black/[0.08] bg-white/95 px-2.5 py-1.5 shadow-[0_8px_20px_rgba(0,0,0,0.08)] backdrop-blur-sm"
              style={{
                left: `${Math.min(86, Math.max(14, (activePoint.x / VB_W) * 100))}%`,
              }}
            >
              <p className="font-mono text-[10px] text-ink-muted">{activePoint.label}</p>
              <p className="text-[12.5px] font-semibold tabular-nums text-ink">{metric.format(activePoint.value)}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
