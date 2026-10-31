// The badge artwork, drawn to canvases that become the card and strap textures.
// Front: who issued it, who it's for, when, and a split band of what I designed
// and what I built. Back: the longer story, in the same two colours.

export const TW = 1024;
export const TH = 1536;

const NAME = ["Satya Sai", "Nagubathula"];
const SITE = "worldofsatya.in";

/* ---------- colour ---------- */

function rgb(hex) {
  const h = hex.replace("#", "");
  return [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16));
}

function luminance(hex) {
  const [r, g, b] = rgb(hex).map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (hi + 0.05) / (lo + 0.05);
}

// White or near-black, whichever reads better on `hex`.
export function inkOn(hex) {
  return contrast(hex, "#ffffff") >= contrast(hex, "#14171a") ? "#ffffff" : "#14171a";
}

// Toward white (amt > 0) or black (amt < 0).
export function shade(hex, amt) {
  const to = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  return `#${rgb(hex)
    .map((v) => Math.round(v + (to - v) * p).toString(16).padStart(2, "0"))
    .join("")}`;
}

/* ---------- dates: "MM/YYYY – Present" ---------- */

export function yearRange(period) {
  const [from, to] = period.split(/[–-]/).map((s) => s.trim());
  const a = from?.match(/\d{4}/)?.[0];
  const z = to?.match(/\d{4}/)?.[0];
  if (!a) return "";
  if (!z) return `${a} – now`;
  return a === z ? a : `${a} – ${z.slice(-2)}`;
}

/* ---------- drawing helpers ---------- */

function wrap(c, text, maxW) {
  const lines = [];
  let line = "";
  for (const word of String(text).split(/\s+/).filter(Boolean)) {
    const next = line ? `${line} ${word}` : word;
    if (line && c.measureText(next).width > maxW) {
      lines.push(line);
      line = word;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r);
  c.arcTo(x, y, x + w, y, r);
  c.closePath();
}

// Fine wavy lines, like the background print on a pass that's hard to forge.
function waves(c, x, y, w, h, color, alpha, seed) {
  c.save();
  c.beginPath();
  c.rect(x, y, w, h);
  c.clip();
  c.strokeStyle = color;
  c.globalAlpha = alpha;
  c.lineWidth = 1.6;
  for (let k = 0; k < 26; k++) {
    c.beginPath();
    for (let s = 0; s <= 220; s++) {
      const t = s / 220;
      const px = x + t * w;
      const py =
        y + h / 2 + (k - 13) * h * 0.012 + Math.sin(t * Math.PI * 5 + k * 0.21 + seed) * h * 0.28 * Math.cos(t * Math.PI * 1.6 + k * 0.13);
      if (s) c.lineTo(px, py);
      else c.moveTo(px, py);
    }
    c.stroke();
  }
  c.restore();
}

// Tiny repeated print down both long edges.
function edgePrint(c, text, ink, font) {
  c.save();
  c.fillStyle = ink;
  c.globalAlpha = 0.32;
  c.font = `500 17px ${font}`;
  c.textBaseline = "middle";
  for (const [x, turn] of [
    [26, -Math.PI / 2],
    [TW - 26, Math.PI / 2],
  ]) {
    c.save();
    c.translate(x, TH / 2);
    c.rotate(turn);
    const w = c.measureText(text).width;
    for (let s = -TH / 2 + 40; s < TH / 2 - 40; s += w) c.fillText(text, s, 0);
    c.restore();
  }
  c.restore();
}

const SEAL = { x: 860, y: 760, r: 96 };

// A holographic foil seal: a rainbow disc with a swirl and lettering round the rim.
function seal(c, font) {
  const { x, y, r } = SEAL;
  c.save();
  let fill;
  try {
    fill = c.createConicGradient(0.4, x, y);
    ["#ffb3dd", "#ffe9a3", "#a8ffd0", "#9fd8ff", "#cdb2ff", "#ffb3dd"].forEach((col, k, all) => fill.addColorStop(k / (all.length - 1), col));
  } catch {
    fill = c.createRadialGradient(x, y, 0, x, y, r);
    fill.addColorStop(0, "#eef8ff");
    fill.addColorStop(1, "#cdb2ff");
  }
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fillStyle = fill;
  c.fill();
  c.strokeStyle = "rgba(20,23,26,0.32)";
  c.lineWidth = 2;
  for (const ring of [r - 8, r - 42]) {
    c.beginPath();
    c.arc(x, y, ring, 0, Math.PI * 2);
    c.stroke();
  }
  c.lineWidth = 1.3;
  for (let k = 0; k < 40; k++) {
    const a = (k / 40) * Math.PI * 2;
    c.beginPath();
    c.moveTo(x + Math.cos(a) * 14, y + Math.sin(a) * 14);
    c.quadraticCurveTo(x + Math.cos(a + 0.6) * 36, y + Math.sin(a + 0.6) * 36, x + Math.cos(a + 1) * (r - 44), y + Math.sin(a + 1) * (r - 44));
    c.stroke();
  }
  const rim = `${SITE.toUpperCase()} · VERIFIED · `;
  c.fillStyle = "rgba(20,23,26,0.72)";
  c.font = `600 15px ${font}`;
  c.textAlign = "center";
  c.textBaseline = "middle";
  [...rim].forEach((ch, k) => {
    const a = (k / rim.length) * Math.PI * 2 - Math.PI / 2;
    c.save();
    c.translate(x + Math.cos(a) * (r - 25), y + Math.sin(a) * (r - 25));
    c.rotate(a + Math.PI / 2);
    c.fillText(ch, 0, 0);
    c.restore();
  });
  c.restore();
}

function topLabel(c, text, ink, font) {
  c.save();
  c.fillStyle = ink;
  c.globalAlpha = 0.72;
  c.font = `500 34px ${font}`;
  c.textAlign = "right";
  c.textBaseline = "alphabetic";
  c.fillText(text, TW - 64, 64);
  c.restore();
}

// The largest size from `max` down to `min` at which `fits` holds.
function fit(c, max, min, step, font, fits) {
  let size = max;
  for (; size > min; size -= step) {
    c.font = font(size);
    if (fits()) break;
  }
  c.font = font(size);
  return size;
}

/* ---------- faces ---------- */

// `b`: { company, role, period, type, location, color, band, band2, front: {design, build}, back: {design, build} }
// `fonts`: { body, mono }, `logo`: a loaded image or null.
export function drawFront(canvas, b, i, fonts, logo) {
  canvas.width = TW;
  canvas.height = TH;
  const c = canvas.getContext("2d");
  const ink = inkOn(b.color);
  const { body, mono } = fonts;

  c.fillStyle = b.color;
  c.fillRect(0, 0, TW, TH);
  const sheen = c.createLinearGradient(0, 0, TW, TH);
  sheen.addColorStop(0, "rgba(255,255,255,0.12)");
  sheen.addColorStop(0.5, "rgba(255,255,255,0)");
  sheen.addColorStop(1, "rgba(0,0,0,0.08)");
  c.fillStyle = sheen;
  c.fillRect(0, 0, TW, TH);

  waves(c, 40, 214, TW - 80, 440, ink, 0.07, i * 1.7);
  edgePrint(c, `${b.company.toUpperCase()} · ${NAME.join(" ").toUpperCase()} · ${b.type.toUpperCase()} · `, ink, mono);
  topLabel(c, b.type.toUpperCase(), ink, mono);
  c.fillStyle = b.band;
  c.fillRect(64, 204, TW / 2 - 64, 6);
  c.fillStyle = b.band2;
  c.fillRect(TW / 2, 204, TW / 2 - 64, 6);

  // The issuer on a white plate: its mark, then its name set beside it.
  const plateY = 236;
  const plateH = 300;
  roundRect(c, 52, plateY, TW - 104, plateH, 28);
  c.fillStyle = "#ffffff";
  c.fill();
  let textX = 96;
  if (logo && logo.width && logo.height) {
    const box = 196;
    const k = Math.min(box / logo.width, box / logo.height);
    const lw = logo.width * k;
    const lh = logo.height * k;
    c.drawImage(logo, 96 + (box - lw) / 2, plateY + (plateH - lh) / 2, lw, lh);
    textX = 96 + box + 40;
  }
  const nameW = TW - 52 - 44 - textX;
  c.fillStyle = "#14171a";
  c.textAlign = "left";
  c.textBaseline = "middle";
  fit(c, 132, 64, 4, (s) => `800 ${s}px ${body}`, () => c.measureText(b.company).width <= nameW);
  c.fillText(b.company, textX, plateY + plateH / 2 + 4);

  c.fillStyle = ink;
  c.textBaseline = "top";
  c.globalAlpha = 0.82;
  c.font = `500 46px ${body}`;
  c.fillText(b.location, 60, plateY + plateH + 26);
  c.globalAlpha = 1;

  // Whose pass it is, beside the seal.
  c.textBaseline = "alphabetic";
  const holderW = SEAL.x - SEAL.r - 64 - 36;
  const ns = fit(c, 88, 56, 2, (s) => `700 ${s}px ${body}`, () => NAME.every((line) => c.measureText(line).width <= holderW));
  c.fillText(NAME[0], 62, SEAL.y - ns * 0.12);
  c.fillText(NAME[1], 62, SEAL.y + ns * 0.92);
  seal(c, mono);

  // When | what
  const dy = 900;
  c.globalAlpha = 0.22;
  c.fillRect(64, dy, TW - 128, 3);
  c.globalAlpha = 0.62;
  c.font = `500 26px ${mono}`;
  c.fillText("DATE", 64, dy + 50);
  c.globalAlpha = 1;
  const dates = yearRange(b.period) || "—";
  c.font = `600 44px ${mono}`;
  c.fillText(dates, 64, dy + 104);
  const roleX = Math.max(320, 64 + c.measureText(dates).width + 56);
  const roleW = TW - 64 - roleX;
  c.globalAlpha = 0.62;
  c.font = `500 26px ${mono}`;
  c.fillText("ROLE", roleX, dy + 50);
  c.globalAlpha = 1;
  let rs = 46;
  let roleLines = [];
  for (; rs >= 30; rs -= 2) {
    c.font = `600 ${rs}px ${body}`;
    roleLines = wrap(c, b.role, roleW);
    if (roleLines.length <= 2 && roleLines.every((l) => c.measureText(l).width <= roleW)) break;
  }
  roleLines.slice(0, 2).forEach((line, k) => c.fillText(line, roleX, dy + 104 + k * rs * 1.1));

  // Split band: what I designed | what I built.
  const bandY = 1082;
  const half = TW / 2;
  [
    [0, b.band, "DESIGN", b.front.design],
    [half, b.band2, "ENGINEERING", b.front.build],
  ].forEach(([x0, fill, label, list], side) => {
    c.fillStyle = fill;
    c.fillRect(x0, bandY, half, TH - bandY);
    const bandInk = inkOn(fill);
    waves(c, x0, bandY, half, TH - bandY, bandInk, 0.06, i + side * 2.3);
    c.fillStyle = bandInk;
    c.globalAlpha = 0.75;
    c.font = `600 32px ${mono}`;
    c.fillText(label, x0 + 40, bandY + 66);
    c.globalAlpha = 1;
    const items = list.slice(0, 4);
    const room = TH - bandY - 104 - 30;
    let size = 54;
    let laid = [];
    let tx = 0;
    for (; size >= 32; size -= 2) {
      c.font = `600 ${size}px ${body}`;
      tx = x0 + 40 + size * 0.28 + 16;
      const maxW = x0 + half - 28 - tx;
      laid = items.map((item) => wrap(c, item, maxW));
      const height = laid.reduce((sum, lines) => sum + lines.length * size * 1.08 + size * 0.42, 0) - size * 0.42;
      if (laid.every((lines) => lines.length <= 2 && lines.every((l) => c.measureText(l).width <= maxW)) && height <= room) break;
    }
    let yy = bandY + 104 + size * 0.8;
    laid.forEach((lines) => {
      c.globalAlpha = 0.85;
      c.fillRect(x0 + 42, yy - size * 0.38, size * 0.28, size * 0.28);
      c.globalAlpha = 1;
      lines.slice(0, 2).forEach((line, j) => c.fillText(line, tx, yy + j * size * 1.08));
      yy += Math.min(lines.length, 2) * size * 1.08 + size * 0.42;
    });
  });
}

export function drawBack(canvas, b, fonts) {
  canvas.width = TW;
  canvas.height = TH;
  const c = canvas.getContext("2d");
  const { body, mono } = fonts;
  const bg = luminance(b.color) > 0.45 ? shade(b.color, -0.08) : shade(b.color, -0.4);
  const ink = inkOn(bg);
  c.fillStyle = bg;
  c.fillRect(0, 0, TW, TH);
  topLabel(c, yearRange(b.period).toUpperCase(), ink, mono);
  c.textAlign = "left";
  c.textBaseline = "top";

  // An accent too close to the back colour is lifted so its chip and bullets still show.
  const groups = [
    ["DESIGN", b.band, b.back.design],
    ["ENGINEERING", b.band2, b.back.build],
  ]
    .map(([label, col, items]) => [label, contrast(col, bg) < 1.8 ? shade(col, 0.5) : col, items])
    .filter(([, , items]) => items.length);

  let size = 60;
  let laid = [];
  for (; size >= 30; size -= 2) {
    c.font = `500 ${size}px ${body}`;
    const lh = size * 1.34;
    let y = 200;
    laid = [];
    groups.forEach(([label, col, items], gi) => {
      if (gi) y += 44;
      laid.push({ chip: { label, col, y } });
      y += 98;
      items.forEach((item, ii) => {
        const lines = wrap(c, item, TW - 182);
        laid.push({ col, y, lines });
        y += lines.length * lh + (ii < items.length - 1 ? size * 0.95 : 0);
      });
    });
    if (y <= 1360) break;
  }
  const lh = size * 1.34;
  for (const row of laid) {
    if (row.chip) {
      const { label, col, y } = row.chip;
      c.font = `600 34px ${mono}`;
      roundRect(c, 62, y, c.measureText(label).width + 48, 62, 31);
      c.fillStyle = col;
      c.fill();
      c.fillStyle = inkOn(col);
      c.textBaseline = "middle";
      c.fillText(label, 86, y + 33);
      c.textBaseline = "top";
    } else {
      c.font = `500 ${size}px ${body}`;
      c.fillStyle = row.col;
      c.fillRect(66, row.y + size * 0.36, size * 0.34, size * 0.34);
      c.fillStyle = ink;
      row.lines.forEach((line, k) => c.fillText(line, 118, row.y + k * lh));
    }
  }

  c.fillStyle = ink;
  c.globalAlpha = 0.22;
  c.fillRect(64, 1396, TW - 128, 3);
  c.globalAlpha = 0.9;
  c.textBaseline = "alphabetic";
  c.font = `600 44px ${body}`;
  c.fillText(`If found, return to ${SITE}`, 64, 1462);
  c.globalAlpha = 1;
  c.fillStyle = b.band;
  c.fillRect(0, 1500, TW / 2, 36);
  c.fillStyle = b.band2;
  c.fillRect(TW / 2, 1500, TW / 2, 36);
}

// A whole number of text repeats down the canvas, so the print tiles without a seam.
export function drawStrap(canvas, b, fonts) {
  const font = `600 40px ${fonts.mono}`;
  const unit = `${NAME.join(" ").toUpperCase()} · ${b.company.toUpperCase()} · `;
  let c = canvas.getContext("2d");
  c.font = font;
  const w = c.measureText(unit).width;
  const reps = Math.max(1, Math.round(512 / w));
  canvas.width = 128;
  canvas.height = Math.round(w * reps);
  c = canvas.getContext("2d");
  c.fillStyle = b.strap;
  c.fillRect(0, 0, 128, canvas.height);
  c.save();
  c.translate(64, 0);
  c.rotate(Math.PI / 2);
  c.fillStyle = inkOn(b.strap);
  c.globalAlpha = 0.86;
  c.font = font;
  c.textBaseline = "middle";
  for (let k = 0; k < reps; k++) c.fillText(unit, k * (canvas.height / reps), 0);
  c.restore();
  // Darker woven edges.
  c.fillStyle = "rgba(0,0,0,0.2)";
  c.fillRect(0, 0, 6, canvas.height);
  c.fillRect(122, 0, 6, canvas.height);
}
