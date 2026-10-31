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

// Sections get the curtain. Moves inside Works (opening a project, flipping
// between them) keep the lighter page turn and the thumbnail morph.
export function usesTransitionScreen(from, to) {
  return !(isWorksPath(from) && isWorksPath(to));
}

const NAMES = { "/": "Home", "/about": "About", "/works": "Works", "/ui": "UI Lab", "/gallery": "Gallery" };

export function screenLabel(path) {
  if (NAMES[path]) return NAMES[path];
  const last = path.split("/").filter(Boolean).pop() || "";
  return last.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase());
}
