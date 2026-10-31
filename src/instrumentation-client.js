// Runs in the browser before React hydrates, to undo what browser extensions
// change in the page before React gets to it.

// Some extensions stamp bis_skin_checked on every div, which React reports as a
// hydration mismatch, so strip it now and whenever the extension adds it again.
function cleanAttributes() {
  for (const el of document.querySelectorAll("[bis_skin_checked]")) {
    el.removeAttribute("bis_skin_checked");
  }
}

// Image-overlay extensions (save and download buttons) drop an element into a
// work page's hero image box, and React then throws away the server HTML and
// renders the page again. The box only ever holds its image or film, so until the
// page has hydrated anything else in it goes. After that, the overlays can stay.
let hydrated = false;
window.addEventListener("page-ready", () => (hydrated = true), { once: true });

function cleanHeroMedia() {
  if (hydrated) return;
  for (const media of document.querySelectorAll("[data-work-media]")) {
    for (const child of [...media.children]) {
      // An extension that wraps the image keeps it: removing that would lose the image.
      if (child.tagName !== "IMG" && child.tagName !== "VIDEO" && !child.querySelector("img")) child.remove();
    }
  }
}

function clean() {
  cleanAttributes();
  cleanHeroMedia();
}

clean();
new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.type === "attributes" && m.target.hasAttribute("bis_skin_checked")) {
      m.target.removeAttribute("bis_skin_checked");
    }
    if (m.type === "childList") clean();
  }
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["bis_skin_checked"],
  subtree: true,
  childList: true,
});
