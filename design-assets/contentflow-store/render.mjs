// Renders index.html and cuts it into four 1320x2868 panels (plus web copies in public/).
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import sharp from "sharp";

const dir = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(dir, "set.png");
const chrome = "C:/Program Files/Google/Chrome/Application/chrome.exe";
execFileSync(chrome, [
  "--headless=new", "--hide-scrollbars", "--allow-file-access-from-files",
  "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--virtual-time-budget=30000",
  "--force-device-scale-factor=3", "--window-size=1820,956", `--screenshot=${out}`,
  pathToFileURL(path.join(dir, "index.html")).href,
], { stdio: "ignore", timeout: 240000 });
const web = path.join(dir, "../../public/cases/content-nexus");
for (let i = 0; i < 4; i++) {
  const panel = sharp(out).extract({ left: i * 1380, top: 0, width: 1320, height: 2868 });
  await panel.clone().png().toFile(path.join(dir, `panel-${i + 1}.png`));
  if (process.argv.includes("--web")) await panel.clone().webp({ quality: 88 }).toFile(path.join(web, `promo-v3-${i + 1}.webp`));
}
