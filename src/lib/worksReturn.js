// Remembers where the works list was when a project opened, so "All works"
// lands back on the same filter, page and scroll spot instead of the top.
const KEY = "works-return";

function read() {
  try {
    return JSON.parse(window.sessionStorage.getItem(KEY));
  } catch {
    return null;
  }
}

function write(place) {
  try {
    window.sessionStorage.setItem(KEY, JSON.stringify(place));
  } catch {}
}

// Called by the list as a project opens.
export function saveWorksPlace({ filter, currentPage, searchQuery }) {
  write({ filter, currentPage, searchQuery, scrollY: window.scrollY });
}

// Called by the way back to the list. A plain visit to /works starts fresh.
export function markReturnToWorks() {
  const place = read();
  if (place) write({ ...place, restore: true });
}

// The list asks once on mount; the place is used up either way.
export function takeWorksPlace() {
  const place = read();
  if (!place?.restore) return null;
  try {
    window.sessionStorage.removeItem(KEY);
  } catch {}
  return place;
}
