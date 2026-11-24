// The curtain that covers a move between sections. The screen component
// listens here; smoothNavigate() asks it to play.
let player = null;

export function onTransitionScreen(play) {
  player = play;
  return () => {
    if (player === play) player = null;
  };
}

// Returns false when no screen is mounted, so the caller can navigate itself.
export function playTransitionScreen(detail) {
  if (!player) return false;
  return player(detail) !== false;
}

function isWorksPath(path) {
  return path === "/works" || path.startsWith("/works/");
}

export function isUiLabPath(path) {
  return path === "/ui" || path.startsWith("/ui/");
}

function isUiLabHost() {
  if (typeof window === "undefined") return false;
  return /^(?:lab|labs|uilab)\./i.test(window.location.hostname);
}

// Sections get the curtain. Moves inside Works (opening a project, flipping
// between them) or inside UI Labs keep the lighter view transition.
export function usesTransitionScreen(from, to) {
  if (isWorksPath(from) && isWorksPath(to)) return false;
  if (isUiLabPath(from) && isUiLabPath(to)) return false;
  if (isUiLabHost() && !to.startsWith("http")) return false;
  return true;
}

const NAMES = { "/": "Home", "/about": "About", "/works": "Works", "/ui": "UI Labs", "/gallery": "Gallery" };

export function screenLabel(path) {
  if (NAMES[path]) return NAMES[path];
  if (isUiLabPath(path)) return "UI Labs";
  const last = path.split("/").filter(Boolean).pop() || "";
  return last.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}
