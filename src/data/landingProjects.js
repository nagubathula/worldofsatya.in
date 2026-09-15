// Short perspectives on the projects documented in works.js and caseStudies.js.
export const landingProjects = [
  {
    id: "openweave",
    name: "OpenWeave",
    category: "AI design tool",
    image: "/openweave-app.png",
    imageAlt: "OpenWeave’s design canvas, layers, and property controls",
    href: "/works/o0",
    design: {
      title: "A canvas for ideas. Room for AI.",
      description: "I brought a familiar design canvas and AI-assisted creation into one editor, with open files people can keep and work with.",
      evidence: "Opens Figma and Pencil files",
    },
    engineering: {
      title: "From a prompt to a working design.",
      description: "I connected AI tools to a shared scene graph, so prompts can create and edit the same design you shape by hand.",
      evidence: "90+ AI tools · React SDK · MCP",
      nodes: [
        { label: "Your idea", detail: "Prompt or direct edit", icon: "idea" },
        { label: "Scene graph", detail: "AI tools + layout engine", icon: "system" },
        { label: "Your design", detail: "Canvas, files, or JSX", icon: "output" },
      ],
      note: "One document. Many ways to build.",
    },
  },
  {
    id: "notbad",
    name: "NotBad",
    category: "Writing experience",
    image: "/notbad-editor.png",
    imageAlt: "NotBad’s quiet Markdown editor with styled text and a small floating toolbar",
    href: "/case-studies/notbad-design",
    design: {
      title: "Let the words take the room.",
      description: "I shaped a writing experience where Markdown marks hide and controls recede. The line you’re editing reveals its marks when you need them.",
      evidence: "Three views. One plain Markdown file.",
    },
    engineering: {
      title: "A quiet interface takes careful engineering.",
      description: "I built the editor in Flutter, keeping text offsets intact as formatting changes, with autosave and draft recovery behind the scenes.",
      evidence: "One codebase for three desktop platforms",
      nodes: [
        { label: "Your words", detail: "A plain Markdown file", icon: "idea" },
        { label: "Native editor", detail: "Dart + line styling", icon: "system" },
        { label: "Quiet writing", detail: "Conceal, edit, save", icon: "output" },
      ],
      note: "The view changes. Your words stay yours.",
    },
  },
  {
    id: "contentflow",
    name: "ContentFlow",
    category: "Content operations",
    href: "/works/c0",
    design: {
      title: "Give every handoff a home.",
      description: "I designed role-specific workspaces so writers, editors, and managers can see what needs their attention as content moves through production.",
      evidence: "30+ dashboards tailored to each role",
    },
    engineering: {
      title: "Turn a busy team into a connected workflow.",
      description: "I built a platform that connects eight production stages, with access scoped by role and language, from the first script to publishing.",
      evidence: "2,000+ videos orchestrated",
      nodes: [
        { label: "Plan + write", detail: "Script and review", icon: "idea" },
        { label: "Create + edit", detail: "Voice, audio, video", icon: "system" },
        { label: "Ready + post", detail: "Tracked handoffs", icon: "output" },
      ],
      note: "Eight stages. Five languages. One shared view.",
    },
  },
];
