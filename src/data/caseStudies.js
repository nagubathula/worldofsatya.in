export const caseStudiesData = [
  {
    slug: "notbad-design",
    title: "NotBad — The Words Are the Interface",
    type: "Product Design Case Study",
    heroDescription: "Designing and building a cross-platform Markdown writer where the chrome disappears — a pure-Flutter port of the macOS-only Trace, covering the concealment engine, the token system, and every decision in between.",
    content: [
      {
        section: "The Problem",
        body: "Markdown editors force a choice: stare at raw syntax while you write, or split the screen with a preview pane. Both put plumbing between the writer and the words. Trace (built on MarkEdit's CodeMirror engine) solved this beautifully — syntax marks fade as you type, and what remains reads like the finished piece — but it only exists on macOS, and only by embedding a web engine.\n\nThe brief I set myself: bring that product idea to Windows, macOS, and Linux as a genuinely lightweight native app, without losing the one thing that makes it special."
      },
      {
        section: "The Bet: Pure Flutter, No Web View",
        body: "The obvious port reuses Trace's CodeMirror core inside a webview. I rejected it: desktop webviews are heavy, uneven across platforms (weakest exactly where I needed reach — Linux), and contradict the \"lightweight\" promise.\n\nInstead, the Markdown-aware editor is implemented natively in Dart as a custom TextEditingController — roughly **3,500 lines of Dart** replacing what upstream does with ~28,000 lines of Swift plus ~14,600 lines of TypeScript. One codebase, identical behavior on all three desktops, ~1 second from cold start to typing, 10.8 MB installer."
      },
      {
        section: "Five Design Principles",
        body: "1. **Conceal, don't remove.** Syntax marks stay in the file; only the view hides them. The document on disk is always plain Markdown — the UI never owns the data.\n\n2. **Everything within reach, nothing in view.** Chrome appears on intent (mouse movement, a shortcut) and recedes on writing. The resting state of the app is text on paper.\n\n3. **Keyboard-first, mouse-forgiven.** Every action has a shortcut and lives in a fuzzy command palette; a floating toolbar pill and quiet title-bar icons cover mouse-first users.\n\n4. **Predictability beats magic.** Concealed marks reappear on the caret's line; external file changes ask before clobbering; caret positions always map 1:1 to the source text.\n\n5. **One theme, done well.** No theme gallery — one warm-paper light and one neutral dark appearance, six accent colors, three line heights. Constraints are the aesthetic."
      },
      {
        section: "The Concealment Engine",
        body: "Three view modes sit one keystroke apart (Ctrl+Shift+H): styled with marks hidden, styled with marks visible, and plain monospace source.\n\nThe load-bearing UX decision is the **caret-line reveal**. Fully hidden marks make editing disorienting — you're deleting characters you can't see. So the line under the caret reveals its marks (dimmed), while the rest of the document reads clean. The tradeoff — the active line reflows slightly as marks appear — is accepted, and mode two exists precisely for people who dislike it.\n\nWhat never conceals, even in the default mode: list bullets, checkboxes, blockquote markers, and horizontal rules — because they are the visual, not plumbing around it.\n\nUnder the hood, concealed marks are painted transparent at near-zero size but stay in the text at their true offsets, so selection, undo, find, and caret math never diverge from the file. A per-line span cache means a keystroke restyles one line, not the document."
      },
      {
        section: "Design Tokens",
        body: "Every color in the app constructs from one palette object.\n\n**Surfaces:** the light theme is warm paper (#F7F6F3), not pure white — \"the canvas should feel receptive, not sterile.\" Dark is a neutral warm #2D2D2D, with the sidebar one step darker in both.\n\n**Accents:** six colors — Amber, Crimson, Fern, Teal, Azure (default), Graphite — each tuned separately for light and dark (light-mode blue is illegible on dark). The accent colors exactly five things: caret, selection, links, list markers, and active toolbar states. Everything else is grayscale, so the accent always means something.\n\n**Type:** system UI face at 15.5px, line height 1.85 (Tight/Normal/Relaxed presets), headings at ×1.6/×1.35/×1.15 weight 700, a mono stack for code at −1.5px, and blank lines given ×1.25 line height for paragraph breathing room.\n\n**Motion:** palette opens in 140ms with a 0.97→1 scale-fade; the sidebar slides in 220ms; the toolbar fades in 250ms — all easeOut curves. Nothing bounces. Motion here is acknowledgement, not decoration."
      },
      {
        section: "The Chrome That Isn't There",
        body: "The OS title bar is hidden. In its place: a 36px transparent strip whose background is a vertical gradient to nothing, so scrolled text dissolves under it instead of hitting a hard edge. Document name centered with a gray \"— Edited\" dirty marker, a quiet sidebar toggle left, custom caption buttons right (close glows red on hover).\n\nThe floating toolbar pill holds the eight actions prose actually needs — and **recedes while you type**, returning on mouse movement. The writer's hands are on the keyboard, so the mouse affordance is irrelevant; remove it. That one 250ms fade does more for the \"quiet\" feel than any color choice.\n\nA hover table of contents lives as quiet dashes in the top-left — one per heading, width encoding depth — that cross-fade into a clickable outline."
      },
      {
        section: "Redesigning the Palette (Real Feedback)",
        body: "The command palette started as one flat list. As features grew it hit ~30 rows, and the user feedback was blunt: \"it is getting long and too complex.\"\n\nThe fix is a two-level structure with a search escape hatch. Browsing shows ~13 curated rows with nested pickers (View Mode…, Settings… → Appearance…, Accent Color…, Line Height…), and parent rows display their current value as a subtitle. The crucial property: **nested leaves stay fuzzy-searchable from the root** — typing \"dark\" still switches appearance in two keystrokes. Browse simple, search deep.\n\nAccent options render with actual color swatches — you pick what you see, not what you read."
      },
      {
        section: "The Trust Model",
        body: "An app for words must never lose them. The document lifecycle is designed as an explicit state machine:\n\n1. **Session restore** — relaunching reopens your last document at your last caret position.\n2. **Autosave** — every 30 seconds and on window blur, for titled documents.\n3. **Crash-safe drafts** — untitled text is continuously stashed and restored on next launch.\n4. **External-change detection** — if the file changes on disk (sync, git, another editor), NotBad silently reloads when you have no local edits, and asks — Keep My Version / Reload From Disk — when you do.\n5. **Single instance** — double-clicking a document hands it to the running window instead of spawning a confused twin.\n\nPlus the invisible courtesies: CRLF/LF line endings preserved per file, and caret offsets that always survive the styling layer."
      },
      {
        section: "Outcomes",
        body: "Cold start to typing in about a second. A 10.8 MB installer producing a ~29 MB install. Three platforms from one codebase, built and tested by CI on every push. Eight regression tests covering the sharp edges (view modes, CRLF normalization, list continuation, search, empty states).\n\nAnd one unmeasurable: the resting state of the app is a piece of paper with your words on it. That was the whole brief."
      },
      {
        section: "The Full Case Study",
        body: "This is the condensed version. The complete document — Mermaid state machines for the document lifecycle and view modes, the styling-pipeline diagram, full token tables, the UI element inventory with screenshots, and a ten-entry decision log with the alternatives each choice beat — lives in the repository: **github.com/nagubathula/NotBad/blob/main/docs/DESIGN.md**"
      }
    ]
  },
  {
    slug: "zero-cost-automation",
    title: "Zero-Cost Automation",
    type: "Architecture Breakdown",
    heroDescription: "Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions without spending a dime on infrastructure.",
    content: [
      {
        section: "The Problem",
        body: "Modern SaaS tools for productivity and automation can quickly become expensive, especially for solo developers or small teams trying to orchestrate complex AI workflows. The challenge was to build a robust, scalable system to automate content generation and data processing without relying on paid tiers of services like Zapier or AWS."
      },
      {
        section: "The Architecture",
        body: "I architected a serverless, decoupled system using three primary components:\n\n1. **Google Colab (Compute):** Acted as our heavy-lifting engine for running AI models and complex Python scripts for free. We exposed it via ngrok for webhook triggers.\n2. **Supabase (Database/Auth):** Provided a generous free tier for PostgreSQL and real-time subscriptions, acting as the central nervous system connecting the frontend to the backend.\n3. **Chrome Extensions (Client):** Custom lightweight extensions served as the UI to trigger workflows directly from the browser, injecting data into Supabase."
      },
      {
        section: "The Execution",
        body: "By listening to Postgres changes in Supabase, the Colab notebooks could immediately pick up new tasks queued from the Chrome Extension. Once a video or text generation task finished, Colab updated the row, and Supabase's real-time channels instantly notified the frontend."
      },
      {
        section: "The Impact",
        body: "This entirely free stack successfully processed over 5,000 automated tasks in its first month, scaling digital content production by 90% and saving an estimated $300/month in SaaS subscriptions."
      }
    ]
  }
];
