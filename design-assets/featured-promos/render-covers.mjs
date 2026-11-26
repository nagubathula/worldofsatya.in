// node render-covers.mjs [--web] [names...]: transparent cut-outs, trimmed to their own shape.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
const dir = path.dirname(fileURLToPath(import.meta.url));
const SIZES = { openweave: [1400, 1040], contentflow: [1400, 1060], billjot: [1400, 1060], notbad: [1400, 1080], toothpaste: [1400, 960], "billjot-v2": [1400, 940] };
const args = process.argv.slice(2), web = args.includes("--web"), names = args.filter((a) => !a.startsWith("--"));
mkdirSync(path.join(dir, "out"), { recursive: true });
for (const n of names.length ? names : Object.keys(SIZES)) {
  const out = path.join(dir, "out", `cover-${n}.png`);
  execFileSync("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--hide-scrollbars", "--allow-file-access-from-files", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--virtual-time-budget=30000", "--default-background-color=00000000", "--force-device-scale-factor=2", `--window-size=${SIZES[n]}`, `--screenshot=${out}`, `${pathToFileURL(path.join(dir, "covers.html")).href}?name=${n}`], { stdio: "ignore", timeout: 240000 });
  if (!web) continue;
  const to = path.join(dir, "../../public/cases/covers"); mkdirSync(to, { recursive: true });
  const info = await sharp(out).trim({ threshold: 2 }).resize({ width: 2400 }).webp({ quality: 88, alphaQuality: 95 }).toFile(path.join(to, `${n}.webp`));
  console.log(n, info.width, info.height, info.size);
}
