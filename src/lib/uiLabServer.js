import { readFile } from "node:fs/promises";
import path from "node:path";
import { gzipSync } from "node:zlib";
import { PIECE_META } from "@/data/uiLabMeta";

export const SHARED_SANDBOX_FILES = [
  "components/SoundEffects.js",
  "components/Magnetic.js",
  "lib/useMagnetic.js",
  "lib/tokens.js",
  "lib/labTuning.js",
  "data/experiences.js",
];

async function readSrcFile(relPath) {
  const fullPath = path.join(process.cwd(), "src", relPath);
  return readFile(fullPath, "utf8");
}

export async function getUiLabBundle() {
  const sourcesById = {};
  const gzipKbById = {};

  await Promise.all(
    PIECE_META.map(async (piece) => {
      const files = await Promise.all(
        piece.files.map(async (relPath) => {
          const code = await readSrcFile(relPath);
          return {
            name: path.posix.basename(relPath),
            path: relPath,
            code,
          };
        }),
      );
      sourcesById[piece.id] = files;
      const combined = files.map((f) => f.code).join("\n");
      const gzBytes = gzipSync(Buffer.from(combined, "utf8")).length;
      gzipKbById[piece.id] = (gzBytes / 1024).toFixed(1);
    }),
  );

  const sharedEntries = await Promise.all(
    SHARED_SANDBOX_FILES.map(async (relPath) => [relPath, await readSrcFile(relPath)]),
  );
  const sharedSources = Object.fromEntries(sharedEntries);

  return { sourcesById, gzipKbById, sharedSources };
}
