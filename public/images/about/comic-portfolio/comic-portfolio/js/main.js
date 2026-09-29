const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#main-nav");

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

const form = document.querySelector("#signal-form");
const note = document.querySelector("#form-note");

if (form && note) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    note.hidden = false;
    form.reset();
  });
}

const revealTargets = document.querySelectorAll(
  ".ink-panel, .power-card, .mission, .balloon, .comic-form, .cover-art, .portrait-frame"
);

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealTargets.forEach((el) => {
    el.classList.add("will-reveal");
    io.observe(el);
  });
}
