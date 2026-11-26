// node render.mjs [--web] [names...]: renders each page and cuts four 1320x2868 panels.
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";
const dir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), web = args.includes("--web");
const names = args.filter((a) => !a.startsWith("--"));
for (const n of names.length ? names : ["openweave", "billjot", "notbad", "toothpaste"]) {
  mkdirSync(path.join(dir, "out"), { recursive: true });
  const out = path.join(dir, "out", n + ".png");
  execFileSync("C:/Program Files/Google/Chrome/Application/chrome.exe", ["--headless=new", "--hide-scrollbars", "--allow-file-access-from-files", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--virtual-time-budget=30000", "--force-device-scale-factor=3", "--window-size=1820,956", `--screenshot=${out}`, pathToFileURL(path.join(dir, n + ".html")).href], { stdio: "ignore", timeout: 240000 });
  if (!web) continue;
  const to = path.join(dir, "../../public/cases/promos"); mkdirSync(to, { recursive: true });
  for (let i = 0; i < 4; i++) await sharp(out).extract({ left: i * 1380, top: 0, width: 1320, height: 2868 }).webp({ quality: 88 }).toFile(path.join(to, `${n}-${i + 1}.webp`));
}
