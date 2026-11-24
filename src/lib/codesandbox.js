// Builds a runnable CodeSandbox payload from the piece's real component source
// using the CodeSandbox Define API (zero GitHub links).

const MOTION_SHIM = `export const EASE_OUT = [0.22, 1, 0.36, 1];
export const EASE_IN = [0.4, 0, 1, 1];

export const SPRING = {
  enter: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 },
  press: { type: "spring", stiffness: 450, damping: 24 },
  pill: { type: "spring", stiffness: 520, damping: 38 },
  pop: { type: "spring", stiffness: 380, damping: 18, mass: 0.6 },
};

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function workMediaStyle(slug) {
  return slug ? { viewTransitionName: "work-media-" + slug } : undefined;
}
`;

const NEXT_IMAGE_SHIM = `import React from "react";

export default function Image({ src, alt = "", fill, className = "", width, height, unoptimized, sizes, priority, ...rest }) {
  const resolved = typeof src === "string" && src.startsWith("/") ? "https://worldofsatya.in" + src : src;
  return (
    <img
      src={resolved}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      className={(fill ? "absolute inset-0 h-full w-full " : "") + className}
      {...rest}
    />
  );
}
`;

const NEXT_FONT_SHIM = `export function IBM_Plex_Mono() {
  return { style: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" } };
}
`;

const SANDBOX_CSS = `body {
  margin: 0;
  background: #fbfbfd;
  color: #1d1d1f;
  font-family: Inter, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  -webkit-font-smoothing: antialiased;
}
.noise-stage {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 28px;
  background:
    radial-gradient(60% 70% at 18% 22%, var(--stage-light) 0%, transparent 70%),
    radial-gradient(55% 65% at 82% 78%, var(--stage-mid) 0%, transparent 72%),
    var(--stage-deep);
}
.noise-stage-media {
  display: block;
  overflow: hidden;
  border-radius: 14px;
  background: #1c1c1e;
}
`;

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>UI Labs Specimen — Satya Sai Nagubathula</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              ink: { DEFAULT: "#1d1d1f", secondary: "#515154", muted: "#6e6e73" },
              sage: "#8c9385",
            },
            fontFamily: {
              sans: ["Inter", "system-ui", "sans-serif"],
              labMono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
            },
          },
        },
      };
    </script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
`;

const SAMPLE_WORKS = JSON.stringify(
  [
    {
      id: "openweave",
      title: "OpenWeave",
      image: "https://worldofsatya.in/openweave-app.png",
      href: "https://worldofsatya.in/works/openweave",
      slug: "openweave",
      blurb: "Design editor",
    },
    {
      id: "notbad",
      title: "NotBad",
      image: "https://worldofsatya.in/notbad-editor.png",
      logo: "https://worldofsatya.in/notbad-logo.png",
      href: "https://worldofsatya.in/works/notbad",
      slug: "notbad",
      blurb: "Markdown writer",
    },
    {
      id: "toothpaste",
      title: "Toothpaste",
      image: "https://worldofsatya.in/toothpaste-panel.png",
      href: "https://worldofsatya.in/works/toothpaste",
      slug: "toothpaste",
      blurb: "Premiere Pro extension",
    },
    {
      id: "contentflow",
      title: "ContentFlow",
      image: "https://worldofsatya.in/cases/content-nexus/overview-hero-dark.webp",
      logo: "https://worldofsatya.in/cases/content-nexus/contentflow-logo.png",
      href: "https://worldofsatya.in/works/contentflow",
      slug: "contentflow",
      blurb: "Media operations platform",
    },
  ],
  null,
  2,
);

function rewriteImports(code, sandboxPath) {
  const depth = sandboxPath.split("/").length - 2; // relative to src/
  const prefix = depth <= 0 ? "./" : "../".repeat(depth);

  return code
    .replace(/^["']use client["'];?\s*\n?/m, "")
    .replace(/from\s+["']@\/([^"']+)["']/g, (_, target) => `from "${prefix}${target}"`)
    .replace(/from\s+["']next\/image["']/g, () => `from "${prefix}shims/nextImage"`)
    .replace(/from\s+["']next\/font\/google["']/g, () => `from "${prefix}shims/nextFont"`);
}

function buildAppFile(pieceMeta, mainImportPath) {
  const pageBg = "bg-[#fbfbfd] text-[#1d1d1f]";
  const stageShell = "border-black/[0.06] bg-white/70 shadow-sm";

  if (pieceMeta.id === "works-hand") {
    return `import React from "react";
import WorksFan from "./${mainImportPath}";

const ITEMS = ${SAMPLE_WORKS};

export default function App() {
  return (
    <main className="min-h-screen ${pageBg} p-6 sm:p-12 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-4xl h-[480px] rounded-[28px] border ${stageShell} flex items-center justify-center p-6">
        <div className="relative aspect-[100/124] w-[min(360px,84vw)] sm:aspect-[780/380] sm:w-[min(720px,88%)]">
          <WorksFan items={ITEMS} interactive={false} reduceMotion={false} />
        </div>
      </div>
      <p className="mt-4 text-xs text-[#6e6e73]">From worldofsatya.in/ui/${pieceMeta.id}</p>
    </main>
  );
}
`;
  }

  const fixedHeight =
    pieceMeta.id === "id-badge" || pieceMeta.id === "shader-surface" ? "h-[560px]" : "min-h-[360px]";
  return `import React from "react";
import Demo from "./${mainImportPath}";

export default function App() {
  return (
    <main className="min-h-screen ${pageBg} p-4 sm:p-10 flex flex-col items-center justify-center">
      <div className="relative w-full max-w-5xl overflow-hidden rounded-[28px] border ${stageShell} ${fixedHeight}">
        <Demo reduceMotion={false} />
      </div>
      <p className="mt-4 text-xs text-[#6e6e73]">From worldofsatya.in/ui/${pieceMeta.id}</p>
    </main>
  );
}
`;
}

export function buildSandboxFiles(pieceMeta, pieceSources, sharedSources) {
  const files = {
    "package.json": {
      content: {
        name: `ui-lab-${pieceMeta.id}`,
        version: "1.0.0",
        main: "src/index.js",
        scripts: { start: "react-scripts start", build: "react-scripts build" },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          "react-scripts": "5.0.1",
          "framer-motion": "^12.4.7",
          "lucide-react": "^0.488.0",
          ...(pieceMeta.extraDeps || {}),
        },
      },
    },
    "public/index.html": { content: INDEX_HTML },
    "src/styles.css": { content: SANDBOX_CSS },
    "src/index.js": {
      content: `import React from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import App from "./App";

createRoot(document.getElementById("root")).render(<App />);
`,
    },
    "src/lib/motion.js": { content: MOTION_SHIM },
    "src/shims/nextImage.js": { content: NEXT_IMAGE_SHIM },
    "src/shims/nextFont.js": { content: NEXT_FONT_SHIM },
  };

  for (const [relPath, code] of Object.entries(sharedSources || {})) {
    const sandboxPath = `src/${relPath}`;
    files[sandboxPath] = { content: rewriteImports(code, sandboxPath) };
  }

  for (const srcFile of pieceSources || []) {
    const sandboxPath = `src/${srcFile.path}`;
    files[sandboxPath] = { content: rewriteImports(srcFile.code, sandboxPath) };
  }

  const primaryRel = pieceMeta.files[0];
  files["src/App.js"] = { content: buildAppFile(pieceMeta, primaryRel.replace(/\.js$/, "")) };

  return { files, entryPath: `src/${primaryRel}` };
}

export async function openInCodeSandbox(pieceMeta, pieceSources, sharedSources) {
  const win = window.open("about:blank", "_blank");
  if (win && win.document) {
    win.document.title = `Opening ${pieceMeta.title}…`;
    win.document.body.innerHTML =
      '<div style="font-family:system-ui,sans-serif;padding:40px;color:#1d1d1f">Preparing CodeSandbox…</div>';
  }

  const { files, entryPath } = buildSandboxFiles(pieceMeta, pieceSources, sharedSources);

  let sandboxId = null;
  try {
    const localRes = await fetch("/api/sandbox", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ files }),
    });
    if (localRes.ok) {
      const data = await localRes.json();
      sandboxId = data?.sandbox_id || null;
    }
  } catch {}

  if (!sandboxId) {
    try {
      const directRes = await fetch("https://codesandbox.io/api/v1/sandboxes/define?json=1", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ files }),
      });
      if (directRes.ok) {
        const data = await directRes.json();
        sandboxId = data?.sandbox_id || null;
      }
    } catch {}
  }

  if (sandboxId) {
    const targetUrl = `https://codesandbox.io/p/sandbox/${sandboxId}?file=${encodeURIComponent("/" + entryPath)}`;
    if (win) {
      win.location.href = targetUrl;
    } else {
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    }
    return true;
  }

  if (win) win.close();
  return false;
}
