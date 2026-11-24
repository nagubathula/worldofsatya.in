// Minimal ISO/IEC 18004 QR Code generator (Byte mode, ECC Level L, Versions 1–4).
// Renders an exact crisp SVG <path> without external dependencies.

const VERSIONS = [
  { version: 1, size: 21, dataCodewords: 19, ecCodewords: 7, align: [] },
  { version: 2, size: 25, dataCodewords: 34, ecCodewords: 10, align: [6, 18] },
  { version: 3, size: 29, dataCodewords: 55, ecCodewords: 15, align: [6, 22] },
  { version: 4, size: 33, dataCodewords: 80, ecCodewords: 20, align: [6, 26] },
];

const getBit = (val, index) => ((val >>> index) & 1) !== 0;

function gfMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function rsDivisor(degree) {
  const result = new Uint8Array(degree);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function rsRemainder(data, divisor) {
  const result = new Uint8Array(divisor.length);
  for (const b of data) {
    const factor = b ^ result[0];
    result.copyWithin(0, 1);
    result[result.length - 1] = 0;
    for (let i = 0; i < divisor.length; i++) {
      result[i] ^= gfMultiply(divisor[i], factor);
    }
  }
  return result;
}

function pushBits(bits, val, len) {
  for (let i = len - 1; i >= 0; i--) {
    bits.push((val >>> i) & 1);
  }
}

function maskMatches(mask, x, y) {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    case 7:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return false;
  }
}

function penaltyScore(modules, size) {
  let score = 0;
  // Rule 1: 5+ consecutive same-color modules in rows and columns.
  for (let y = 0; y < size; y++) {
    let runColor = false;
    let runLen = 0;
    for (let x = 0; x < size; x++) {
      if (modules[y][x] === runColor) {
        runLen++;
        if (runLen === 5) score += 3;
        else if (runLen > 5) score += 1;
      } else {
        runColor = modules[y][x];
        runLen = 1;
      }
    }
  }
  for (let x = 0; x < size; x++) {
    let runColor = false;
    let runLen = 0;
    for (let y = 0; y < size; y++) {
      if (modules[y][x] === runColor) {
        runLen++;
        if (runLen === 5) score += 3;
        else if (runLen > 5) score += 1;
      } else {
        runColor = modules[y][x];
        runLen = 1;
      }
    }
  }
  // Rule 2: 2x2 solid blocks.
  for (let y = 0; y < size - 1; y++) {
    for (let x = 0; x < size - 1; x++) {
      const c = modules[y][x];
      if (c === modules[y][x + 1] && c === modules[y + 1][x] && c === modules[y + 1][x + 1]) {
        score += 3;
      }
    }
  }
  // Rule 4: balance of dark modules.
  let dark = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (modules[y][x]) dark++;
    }
  }
  const total = size * size;
  const k = Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1;
  score += Math.max(0, k) * 10;
  return score;
}

export function encodeQR(text) {
  const bytes = new TextEncoder().encode(text);
  const spec = VERSIONS.find((v) => 12 + bytes.length * 8 <= v.dataCodewords * 8);
  if (!spec) {
    throw new Error("QR payload exceeds supported Version 1–4 capacity");
  }

  const { size, dataCodewords, ecCodewords, align } = spec;

  // Build data bit stream: mode (0100), byte count (8 bits), UTF-8 payload, terminator & pads.
  const bits = [];
  pushBits(bits, 0b0100, 4);
  pushBits(bits, bytes.length, 8);
  for (const b of bytes) pushBits(bits, b, 8);
  const capacityBits = dataCodewords * 8;
  pushBits(bits, 0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  for (let padByte = 0xec; bits.length < capacityBits; padByte ^= 0xec ^ 0x11) {
    pushBits(bits, padByte, 8);
  }

  const data = new Uint8Array(dataCodewords);
  for (let i = 0; i < bits.length; i++) {
    data[i >>> 3] |= bits[i] << (7 - (i & 7));
  }
  const ecc = rsRemainder(data, rsDivisor(ecCodewords));
  const codewords = new Uint8Array(dataCodewords + ecCodewords);
  codewords.set(data);
  codewords.set(ecc, dataCodewords);

  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const isFunction = Array.from({ length: size }, () => Array(size).fill(false));

  const setFunction = (x, y, dark) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y][x] = dark;
    isFunction[y][x] = true;
  };

  // Finder patterns (7x7) + 1-module quiet separators.
  const drawFinder = (cx, cy) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(cx + dx, cy + dy, dist !== 2 && dist !== 4);
      }
    }
  };
  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  // Timing patterns.
  for (let i = 8; i < size - 8; i++) {
    const dark = i % 2 === 0;
    setFunction(i, 6, dark);
    setFunction(6, i, dark);
  }

  // Alignment patterns (skip corners overlapping finders).
  for (let i = 0; i < align.length; i++) {
    for (let j = 0; j < align.length; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === align.length - 1) || (i === align.length - 1 && j === 0)) {
        continue;
      }
      const cx = align[i];
      const cy = align[j];
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  // Format bits (reserved first with mask 0, overwritten below with optimal mask).
  const drawFormatBits = (mask) => {
    const fmtData = (0b01 << 3) | mask; // 0b01 = ECC Level L
    let rem = fmtData;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const fmtBits = ((fmtData << 10) | rem) ^ 0x5412;

    for (let i = 0; i <= 5; i++) setFunction(8, i, getBit(fmtBits, i));
    setFunction(8, 7, getBit(fmtBits, 6));
    setFunction(8, 8, getBit(fmtBits, 7));
    setFunction(7, 8, getBit(fmtBits, 8));
    for (let i = 9; i < 15; i++) setFunction(14 - i, 8, getBit(fmtBits, i));

    for (let i = 0; i < 8; i++) setFunction(size - 1 - i, 8, getBit(fmtBits, i));
    for (let i = 8; i < 15; i++) setFunction(8, size - 15 + i, getBit(fmtBits, i));
    setFunction(8, size - 8, true); // Fixed dark module.
  };

  drawFormatBits(0);

  // Zigzag placement of codewords.
  let bitIdx = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const upward = ((right + 1) & 2) === 0;
        const y = upward ? size - 1 - vert : vert;
        if (!isFunction[y][x] && bitIdx < codewords.length * 8) {
          modules[y][x] = getBit(codewords[bitIdx >>> 3], 7 - (bitIdx & 7));
          bitIdx++;
        }
      }
    }
  }

  const toggleMask = (mask) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (!isFunction[y][x] && maskMatches(mask, x, y)) {
          modules[y][x] = !modules[y][x];
        }
      }
    }
  };

  // Pick best mask pattern.
  let bestMask = 0;
  let bestScore = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    toggleMask(mask);
    drawFormatBits(mask);
    const s = penaltyScore(modules, size);
    if (s < bestScore) {
      bestScore = s;
      bestMask = mask;
    }
    toggleMask(mask);
  }
  toggleMask(bestMask);
  drawFormatBits(bestMask);

  return { size, modules };
}

export function QRCodeSvg({ value, size = 76, quiet = 2, className = "" }) {
  const { size: gridSize, modules } = encodeQR(value);
  const viewSize = gridSize + quiet * 2;
  let d = "";
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      if (modules[y][x]) {
        d += `M${x + quiet},${y + quiet}h1v1h-1z`;
      }
    }
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${viewSize} ${viewSize}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`QR code for ${value}`}
      className={className}
    >
      <rect width={viewSize} height={viewSize} fill="#ffffff" />
      <path d={d} fill="currentColor" />
    </svg>
  );
}
