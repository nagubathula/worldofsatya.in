// Runs in the browser before React hydrates. Some browser extensions stamp
// bis_skin_checked on every div, which React reports as a hydration mismatch,
// so strip it now and whenever the extension adds it again.
function clean() {
  for (const el of document.querySelectorAll("[bis_skin_checked]")) {
    el.removeAttribute("bis_skin_checked");
  }
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
