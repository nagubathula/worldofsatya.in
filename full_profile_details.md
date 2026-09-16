# Satya Sai Nagubathula
**Generative AI Lead @ NxtWave | Design Technologist**

*Design + Engineering. Currently building OpenWeave & NotBad.*

**Email:** nagubathula.satyasai@gmail.com  
**LinkedIn:** [satyasainagubathula](https://www.linkedin.com/in/satyasainagubathula)  
**Profile Image:** `/main.jpeg`

## Bio
I’m Satya — operating at the boundary where interface craft, typography, and deep systems engineering converge. Leading Generative AI at NxtWave (2,000+ productions orchestrated) while building sovereign open tools for creators.

---

## 📈 Stats & Milestones
* **6** Years of experience
* **280+** Clients served
* **2,000+** AI Video Pipelines Orchestrated
* **36** Students trained in engineering & design
* **3** Movies worked on

---

## 💼 Corporate Experience

### Generative AI Engineer and Creative Lead
**NXTWAVE DISRUPTIVE TECHNOLOGIES** | *05/2025 - Present*
Led AI production, scaling channels to 100K+ followers and orchestrating 2,000+ videos. Pioneered structured JSON automation for models like Veo 3 & Wan 2.2. Built internal tools slashing asset creation time by 90%.

### Product Engineer
**CrestLogic Systems** | *11/2024 - 03/2025*
Branding, User Interface Design, and marketing funnel development for billjot.

### Product & Design Engineer (Consultant)
**Andhra Pradesh Solar Power Corporation** | *07/2024 - 10/2024*
UI Design, Web Design, and Fullstack Web development.

### Product Engineer (Intern)
**Traboda Solutions** | *08/2023 - 07/2024*
UI Designer, Hardware Security Researcher, and Fullstack Web Development.

### Design and Development Engineer (Intern)
**Redantio Solutions** | *01/2022 - 02/2023*
UI Designer, Figma Tutor, Graphic Design, Hardware Security Research and Web Development.

---

## 🏆 Achievements

* **GSOC 2024 Qualified:** Qualified for Google Summer of Code 2024. [Link](https://summerofcode.withgoogle.com/)
* **NASA Space Apps Awards:** Galactic Impact Award (2023) and Local Award for Local Impact (2022). [Link](https://www.spaceappschallenge.org/)
* **Hackathon Highlights:** Runner Up at Kavach Cyber Security Hackathon (2023). Top 5 at Nullcon Goa (2022).
* **SIH 2022 Finalist:** National Finalist in Smart India Hackathon Hardware Edition.

---

## 🔬 In-Depth Case Studies

### NotBad — The Words Are the Interface
**Type:** Product Design Case Study
**Images:** `/notbad-demo.gif`, `/notbad-editor.png`, `/notbad-palette.png`
**Hero Description:** Designing and building a cross-platform Markdown writer where the chrome disappears — a pure-Flutter port of the macOS-only Trace, covering the concealment engine, the token system, and every decision in between.

* **The Problem:** Markdown editors force a choice: stare at raw syntax while you write, or split the screen with a preview pane. Both put plumbing between the writer and the words. Trace (built on MarkEdit's CodeMirror engine) solved this beautifully — syntax marks fade as you type, and what remains reads like the finished piece — but it only exists on macOS, and only by embedding a web engine. The brief I set myself: bring that product idea to Windows, macOS, and Linux as a genuinely lightweight native app, without losing the one thing that makes it special.
* **The Bet: Pure Flutter, No Web View:** The obvious port reuses Trace's CodeMirror core inside a webview. I rejected it: desktop webviews are heavy, uneven across platforms (weakest exactly where I needed reach — Linux), and contradict the "lightweight" promise. Instead, the Markdown-aware editor is implemented natively in Dart as a custom TextEditingController — roughly 3,500 lines of Dart replacing what upstream does with ~28,000 lines of Swift plus ~14,600 lines of TypeScript. One codebase, identical behavior on all three desktops, ~1 second from cold start to typing, 10.8 MB installer.
* **Five Design Principles:**
  1. **Conceal, don't remove.** Syntax marks stay in the file; only the view hides them. The document on disk is always plain Markdown — the UI never owns the data.
  2. **Everything within reach, nothing in view.** Chrome appears on intent (mouse movement, a shortcut) and recedes on writing. The resting state of the app is text on paper.
  3. **Keyboard-first, mouse-forgiven.** Every action has a shortcut and lives in a fuzzy command palette; a floating toolbar pill and quiet title-bar icons cover mouse-first users.
  4. **Predictability beats magic.** Concealed marks reappear on the caret's line; external file changes ask before clobbering; caret positions always map 1:1 to the source text.
  5. **One theme, done well.** No theme gallery — one warm-paper light and one neutral dark appearance, six accent colors, three line heights. Constraints are the aesthetic.
* **The Concealment Engine:** Three view modes sit one keystroke apart (Ctrl+Shift+H): styled with marks hidden, styled with marks visible, and plain monospace source. The load-bearing UX decision is the caret-line reveal. Fully hidden marks make editing disorienting — you're deleting characters you can't see. So the line under the caret reveals its marks (dimmed), while the rest of the document reads clean. The tradeoff — the active line reflows slightly as marks appear — is accepted, and mode two exists precisely for people who dislike it. What never conceals, even in the default mode: list bullets, checkboxes, blockquote markers, and horizontal rules — because they are the visual, not plumbing around it. Under the hood, concealed marks are painted transparent at near-zero size but stay in the text at their true offsets, so selection, undo, find, and caret math never diverge from the file. A per-line span cache means a keystroke restyles one line, not the document.
* **Design Tokens:** Every color in the app constructs from one palette object.
  - **Surfaces:** the light theme is warm paper (#F7F6F3), not pure white — "the canvas should feel receptive, not sterile." Dark is a neutral warm #2D2D2D, with the sidebar one step darker in both.
  - **Accents:** six colors — Amber, Crimson, Fern, Teal, Azure (default), Graphite — each tuned separately for light and dark (light-mode blue is illegible on dark). The accent colors exactly five things: caret, selection, links, list markers, and active toolbar states. Everything else is grayscale, so the accent always means something.
  - **Type:** system UI face at 15.5px, line height 1.85 (Tight/Normal/Relaxed presets), headings at ×1.6/×1.35/×1.15 weight 700, a mono stack for code at −1.5px, and blank lines given ×1.25 line height for paragraph breathing room.
  - **Motion:** palette opens in 140ms with a 0.97→1 scale-fade; the sidebar slides in 220ms; the toolbar fades in 250ms — all easeOut curves. Nothing bounces. Motion here is acknowledgement, not decoration.
* **The Chrome That Isn't There:** The OS title bar is hidden. In its place: a 36px transparent strip whose background is a vertical gradient to nothing, so scrolled text dissolves under it instead of hitting a hard edge. Document name centered with a gray "— Edited" dirty marker, a quiet sidebar toggle left, custom caption buttons right (close glows red on hover). The floating toolbar pill holds the eight actions prose actually needs — and recedes while you type, returning on mouse movement. The writer's hands are on the keyboard, so the mouse affordance is irrelevant; remove it. That one 250ms fade does more for the "quiet" feel than any color choice. A hover table of contents lives as quiet dashes in the top-left — one per heading, width encoding depth — that cross-fade into a clickable outline.
* **Redesigning the Palette (Real Feedback):** The command palette started as one flat list. As features grew it hit ~30 rows, and the user feedback was blunt: "it is getting long and too complex." The fix is a two-level structure with a search escape hatch. Browsing shows ~13 curated rows with nested pickers (View Mode…, Settings… → Appearance…, Accent Color…, Line Height…), and parent rows display their current value as a subtitle. The crucial property: nested leaves stay fuzzy-searchable from the root — typing "dark" still switches appearance in two keystrokes. Browse simple, search deep. Accent options render with actual color swatches — you pick what you see, not what you read.
* **The Trust Model:** An app for words must never lose them. The document lifecycle is designed as an explicit state machine:
  1. **Session restore** — relaunching reopens your last document at your last caret position.
  2. **Autosave** — every 30 seconds and on window blur, for titled documents.
  3. **Crash-safe drafts** — untitled text is continuously stashed and restored on next launch.
  4. **External-change detection** — if the file changes on disk (sync, git, another editor), NotBad silently reloads when you have no local edits, and asks — Keep My Version / Reload From Disk — when you do.
  5. **Single instance** — double-clicking a document hands it to the running window instead of spawning a confused twin.
  Plus the invisible courtesies: CRLF/LF line endings preserved per file, and caret offsets that always survive the styling layer.
* **Outcomes:** Cold start to typing in about a second. A 10.8 MB installer producing a ~29 MB install. Three platforms from one codebase, built and tested by CI on every push. Eight regression tests covering the sharp edges (view modes, CRLF normalization, list continuation, search, empty states). And one unmeasurable: the resting state of the app is a piece of paper with your words on it. That was the whole brief.
* **The Full Case Study:** This is the condensed version. The complete document — Mermaid state machines for the document lifecycle and view modes, the styling-pipeline diagram, full token tables, the UI element inventory with screenshots, and a ten-entry decision log with the alternatives each choice beat — lives in the repository: **github.com/nagubathula/NotBad/blob/main/docs/DESIGN.md**


### Zero-Cost Automation
**Type:** Architecture Breakdown
**Hero Description:** Building an internal productivity suite using Google Colab, Supabase, and lightweight web extensions without spending a dime on infrastructure.
* **The Problem:** Modern SaaS tools for productivity and automation can quickly become expensive, especially for solo developers or small teams trying to orchestrate complex AI workflows. The challenge was to build a robust, scalable system to automate content generation and data processing without relying on paid tiers of services like Zapier or AWS.
* **The Architecture:** I architected a serverless, decoupled system using three primary components:
  1. **Google Colab (Compute):** Acted as our heavy-lifting engine for running AI models and complex Python scripts for free. We exposed it via ngrok for webhook triggers.
  2. **Supabase (Database/Auth):** Provided a generous free tier for PostgreSQL and real-time subscriptions, acting as the central nervous system connecting the frontend to the backend.
  3. **Chrome Extensions (Client):** Custom lightweight extensions served as the UI to trigger workflows directly from the browser, injecting data into Supabase.
* **The Execution:** By listening to Postgres changes in Supabase, the Colab notebooks could immediately pick up new tasks queued from the Chrome Extension. Once a video or text generation task finished, Colab updated the row, and Supabase's real-time channels instantly notified the frontend.
* **The Impact:** This entirely free stack successfully processed over 5,000 automated tasks in its first month, scaling digital content production by 90% and saving an estimated $300/month in SaaS subscriptions.


### ContentFlow
**Type:** Product Engineering
* **The problem:** Producing content at scale across YouTube and Instagram, in five languages — Telugu, Hindi, Tamil, Marathi, and Kannada — means dozens of people touching every video: writers, voice artists, editors, designers, managers. Spreadsheets and chat threads don't survive that. ContentFlow is the internal platform I built to run the entire operation in one place.
* **30+ dashboards, one per job:** Instead of one dashboard trying to serve everyone, ContentFlow ships 30+ purpose-built views — Manager, Writer, Editor, Editing Manager, Voice Artist, Graphic Designer, Central Team, Admin, and more. Each role logs in to exactly the screens, actions, and data its job needs, enforced by a role-based access control system that also scopes everything by language and region.
* **The pipeline:** Every piece of content moves through an eight-stage pipeline — Script, Review, Voice Over, Audio Cut, Raw Upload, Editing, Ready, Posted — visible on a shared content calendar with per-channel and per-status filtering. Around the pipeline sit the supporting systems: channel analytics (including YouTube analytics), studio booking for recording slots, and team role management.
* **The impact:** ContentFlow is the operational backbone behind the numbers on this site — 2,000+ videos orchestrated and channels scaled to 100K+ followers, with every handoff between roles tracked instead of lost in chat.

### From Doodles to Design
**Type:** Medium Article | [Read Article](https://hippogriff.medium.com)
* **The story:** How does someone go from sketching doodles to architecting AI pipelines? This piece traces that arc — the journey from pure visual design into deep technical automation, and why the most interesting work happens in the overlap between the two. It's the origin story behind "The AI/UI Guy."
* **Read it:** The full article is on Medium, along with my other writing on design, engineering, and generative AI.

### How I Built My Pseudo Fullstack Portfolio
**Type:** Medium Article | [Read Article](https://medium.com/@hippogriff/how-i-built-my-psuedo-fullstack-portfolio-73cd1f6aecda)
* **What it covers:** An in-depth breakdown of how this very website was designed and built — the "pseudo fullstack" approach of getting dynamic-feeling behavior out of a lean static architecture, and the design and engineering decisions behind it.
* **Read it:** The full write-up is on Medium — from concept and visual direction through implementation.

### Why Are You Still Confused When Turning Your Design To Code?
**Type:** Medium Article | [Read Article](https://medium.com/design-bootcamp/why-are-you-still-confusing-when-turning-your-design-to-code-a7489d544deb)
* **What it covers:** The design-to-development handoff is where good work goes to die: spacing drifts, states get missed, and both sides blame each other. Published in Design Bootcamp, this guide walks through the common pitfalls of turning designs into code and how to structure your work so the translation is faithful.
* **Read it:** The full article is on Medium via the link above.

---

## 🛠️ Open Source & Tools

### NotBad
**Role:** Creator | [View Repository](https://github.com/nagubathula/NotBad)
**Images:** `/notbad-demo.gif`, `/notbad-editor.png`
* **A quiet place to write — on every desktop:** Markdown editors make you choose: stare at raw syntax, or split the screen with a preview pane. NotBad does neither. Marks like `**` and `#` fade as you type, what remains reads like the finished piece, and every bit of chrome recedes until you reach for it. It's a from-scratch, pure-Flutter port of the macOS-only Trace — no web view, no CodeMirror — so one Dart codebase behaves identically on Windows, macOS, and Linux.
* **What it does:** 
  * **Concealed syntax with a caret-line reveal** — three view modes one keystroke apart: styled with marks hidden (the caret's line reveals its marks so editing stays predictable), styled with marks visible, and plain monospace source.
  * **Everything within reach, nothing in view** — a fuzzy command palette, keyboard-driven file sidebar, hover table of contents, find & replace with live highlights, and a floating toolbar that fades while you type.
  * **Trustworthy with files** — session restore, autosave, crash-safe untitled drafts, external-change detection, CRLF/LF preservation, and single-instance document handoff. Plain .md files, no lock-in.
  * **A writer's editor** — smart list continuation, auto-pairing, focus mode with typewriter scrolling, smart typography, Copy as Rich Text, and HTML export.
* **Under the hood:** The upstream app is ~28k lines of Swift wrapped around ~14.6k lines of TypeScript; NotBad re-imagines it in ~3.5k lines of Dart. A custom `TextEditingController` styles Markdown live with per-line span caching, concealed marks stay in the text (painted invisible) so caret math never drifts from the file, and the chrome — hidden title bar, custom caption buttons, receding toolbar — is drawn by the app itself. Ships with an Inno Setup installer, "Open with NotBad" shell integration, CI builds for all three platforms, and an in-app update check against GitHub releases.

### OpenWeave
**Role:** Creator | [View Repository](https://github.com/nagubathula/OpenWeave)
**Image:** `/openweave-app.png`
* **Why I built it:** Design tools are closed ecosystems: your files live in someone else's cloud, and automating anything means fighting a plugin sandbox. OpenWeave is my answer — a design editor that treats the design file as an open, inspectable document you own, and the editor itself as a programmable toolkit rather than a walled garden.
* **What it does:**
  * **Opens native design files** — reads and writes Figma `.fig` and Pencil `.pen` documents, with copy & paste between apps.
  * **AI builds designs** — describe what you want in chat and 90+ tools create and modify nodes. Works with Anthropic, OpenAI, Google AI, OpenRouter, and compatible endpoints.
  * **Fully programmable** — headless CLI, XPath queries over the node tree, Figma Plugin API support, and an MCP server so AI agents like Claude Code can drive the editor.
  * **Design-to-code** — export selections as JSX/Tailwind, extract design tokens, lint naming, layout, and accessibility.
  * **Real-time collaboration** — peer-to-peer over WebRTC with cursors, presence, and follow mode. No server, no account.
  * **React SDK** — headless components and composables for embedding the editor into other apps or building custom editing surfaces.
* **Under the hood:** A monorepo of focused packages — scene graph, file-format codecs, core engine, React bindings, CLI, and MCP server — built with Next.js and TypeScript. Auto layout and CSS Grid run on Yoga WASM, and the desktop app ships as a ~7 MB Tauri v2 binary for macOS, Windows, and Linux, with the same code running in the browser as a PWA.

### Toothpaste
**Role:** Creator | [View Repository](https://github.com/nagubathula/toothpaste)
**Images:** `/toothpaste-panel-wide.png`
* **Paste anything. Straight to the timeline:** Getting media into Premiere Pro is death by a thousand clicks: download, locate, import, drag to the timeline. Toothpaste collapses all of it into a paste. It's a CEP 11 extension for Premiere Pro 15+ and After Effects 18+ — hit `Ctrl+V` in the panel and your media lands at the playhead.
* **What it does:**
  * **Paste or drag anything** — images, file paths, or URLs, with batch drag-and-drop from Explorer/Finder.
  * **URL downloads** — paste a YouTube, TikTok, X/Twitter, Reddit, or Pinterest link and it auto-downloads and imports via yt-dlp, with quality selection and time-range clipping to grab just a segment.
  * **Timeline-ready** — imported media auto-places at the playhead; GIFs and WebPs are converted to MP4 via FFmpeg so they just work.
  * **Editor conveniences** — audio-only MP3 extraction, browser-cookie support for restricted content, and a recent-history panel for instant re-use.
* **Distribution:** Ships as a pre-built `.zxp` on GitHub Releases — no Node.js, no build steps, just install and go. The repo also doubles as a clean, documented template for anyone building their own Adobe CEP extension.

### CHAYA UI
**Role:** Core Contributor | [View Repository](https://github.com/traboda/chaya)
* **What it is:** Chaya UI is a modern, data-first component library for React by Traboda — 40+ components and custom hooks with full TypeScript type safety, styled with Tailwind CSS on Radix primitives, with dark mode and custom theming built in. Documented with Storybook and open-sourced under GPL v3.
* **My contribution:** As a core contributor I collaborated directly with the creators on design, development, and optimization, and authored several exclusive custom components — working across the full lifecycle from component design to the code that ships.

### Engineerudu
**Role:** FOSS Community Builder | [Visit Community](https://engineerudu.com)
* **The mission:** Andhra Pradesh has no shortage of engineering talent — what it lacked was a home for open source. Engineerudu is the state's first Free and Open Source Software community, built to give local developers a place to learn in public, contribute to real projects, and find each other.
* **What building it means:** Community building is unglamorous open source: organizing people rather than code. The work spans growing membership, fostering a contribution culture among students and early-career engineers, and connecting local talent to the wider FOSS ecosystem.

### CompatrIoT
**Role:** Hardware Security | [Watch Demo](https://drive.google.com/file/d/1e1d_eKrPW2BtSN-1nqGks1lxa6HyI7hn/view)
**Images:** `/gallery/compatriot-board.jpg`, `/gallery/compatriot-labs.jpg`
* **What it is:** Most people learn hardware security from slides. CompatrIoT is a physical, open-source training board you attack for real — built for security researchers, hobbyists, and students. Dual microcontrollers (an STM32 and an ESP32) give it broad protocol coverage, and the on-board targets — SPI flash, I2C EEPROM, sensors, programmable LEDs, JTAG/SWD debug ports, and a USB serial console — turn every classic hardware attack into something you can practice hands-on.
* **The training labs:** Twenty gamified labs walk from first contact to full compromise, with progressive difficulty:
  * **UART** — port identification two ways, then talking to the target.
  * **JTAG/SWD** — pinout identification, firmware extraction, firmware patching, and peripheral access.
  * **I2C** — chip reconnaissance, communication sniffing, memory dumping.
  * **SPI** — chip recon, sniffing, and full flash firmware extraction.
  * **BLE** — scanning, GATT enumeration, protocol sniffing, device control, and LTK cracking.
* **Why it matters:** Everything is open — hardware designs, firmware, and documentation — so anyone can build, extend, or teach with it. It compresses what usually takes a shelf of dev boards and scattered CTF challenges into one board with a structured learning path: real protocols, real extraction, real exploitation, from beginner to advanced.

---

## 🎨 Design & Web Projects

### Redantio
**Type:** Brand Design | [Case Study](https://hippogriff.medium.com/redantio-designing-a-startup-in-6-hours-4e24a593950f)
**Image:** `/redantio.webp`
* **The challenge:** Six hours. One designer. Zero room for error. Redantio was a cybersecurity brand aimed at a very specific audience of bureaucrats, and it needed a complete identity and web presence — brand, interface, and experience — in a single sprint. A real-world simulation of startup pressure: limited resources, an impossible deadline, and a vision that needed translating into pixels fast.
* **The process:**
  * **Wireframes first** — bare-bones black-and-white boxes to lock down layout and flow without overthinking.
  * **Color check** — tested contrast, accessibility, and emotional tone. Vibrant reds (#C10206, #A50113) over soft grays: bold, urgent, memorable.
  * **Micro animations** — AOS.js scroll reveals, hover feedback on buttons and cards, subtle input highlights. Seasoning, not the meal.
  * **Type system** — Poppins for a clean base, Kanit for bold headers, Pathway Extreme for flair.
* **What I learned:** Built with Figma, Tailwind CSS, and raw HTML/CSS/JS — speed over polish. The takeaway: great design isn't born in a vacuum, it's born in constraints. Time pressure didn't kill creativity; it forced it to grow in new directions.

### Chaya UI
**Type:** Design System | [Visit Site](https://chaya.traboda.com)
**Image:** `/chaya.avif`
* **What it is:** Chaya UI is a modern, data-first component library for React, built to help teams ship SaaS applications with minimal code. It offers 40+ components and custom hooks with full TypeScript type safety, Tailwind CSS styling on top of Radix primitives, dark mode, and custom theming — documented in Storybook.
* **My role:** I worked directly with the creators at Traboda on design, development, and optimization of the system, and authored several of its custom components — shaping both how the components look and how they're engineered underneath.

### KLU PAS
**Type:** Product Design | [Case Study](https://hippogriff.medium.com/ux-case-study-of-public-adressing-system-for-hoste-a84ce1583288)
**Image:** `/customamplifierbox.webp`
* **The problem:** K L University's hostels ran announcements manually — microphones, speakers, and trained operators. The result: missed wake-up calls, last-minute panic during emergencies, and total dependency on whoever knew how to work the equipment. The university needed a centralized public address system that hostel wardens — many of them not tech-savvy, some over 60 — could operate confidently without assistance.
* **The approach:**
  * **Research** — interviews with five hostel wardens and two supervisors, distilled into personas, an empathy map, and a user journey.
  * **Deliberately "old-school" UI** — the interface was designed to feel like a radio or landline phone: large buttons, minimal text, clear visual feedback, keyboard shortcuts. Familiarity over flash, to eliminate fear of technology.
  * **Hardware design** — a desk unit with a comfortable viewing angle, grippy tactile knobs, reliable switches with satisfying feedback, and color-coded labels.
* **Outcomes:** In trial runs: 100% task completion by wardens on first try, zero scheduling errors over a month, and new-warden onboarding in under five minutes. Wardens reported feeling "empowered" and "confident" — the design became a bridge to digital comfort for users who had long stayed away from tech.

### Own Your Bill
**Type:** Product Design | [Case Study](https://www.figma.com/board/iZoO9T4W3C4RwIUWZRbZsV/Case-Study?node-id=0-1&t=OAdZQYVAwiFOnSA7-1)
**Image:** `/videos/8.webp`
* **The idea:** Billing is one of the most repeated interactions in commerce, yet receipts and invoices are stuck in a one-size-fits-all format. Own Your Bill rethinks the bill as something the business and the customer can shape — a new-age, customizable billing system designed around how people actually read, share, and act on their bills.
* **The work:** A product design exploration covering the end-to-end flow — from research and sketches through wireframes to the final concept. The complete process, artifacts and thinking are laid out on the FigJam case study board.

### Tailus
**Type:** Design System | [Case Study](https://www.behance.net/gallery/210333091/Tailus-Ui-Case-Study)
**Image:** `/tailus.png`
* **About the project:** Tailus is a Tailwind CSS UI kit — a library of polished, ready-to-compose interface blocks and components built on utility-first CSS. The work focused on designing components that look refined out of the box while staying flexible enough to theme and rearrange for real products.
* **The case study:** The full visual case study — component anatomy, layout systems, and design decisions — is published on Behance via the link above.

### APSPCL
**Type:** Website | [Visit Site](https://apspcl.ap.gov.in)
**Image:** `/videos/2.webp`
* **About the project:** The official website for the Andhra Pradesh Solar Power Corporation Pvt. Ltd. (APSPCL) — the state body behind some of India's largest solar parks. A public-sector site serving citizens, vendors, and government stakeholders, where clarity and reliability matter more than decoration.
* **The work:** Designing for government means organizing dense information — tenders, project data, notices, reports — into an architecture people can actually navigate, and building it to hold up for every visitor on every device.

### RWDY Store Revamp
**Type:** Website | [View Case Study](https://www.behance.net/gallery/195847337/RWDY-Store-Revamping)
**Image:** `/videos/1.webp`
* **About the project:** A ground-up revamp of the RWDY e-commerce fashion store. Fashion retail lives or dies on presentation: the redesign focused on letting the products lead — cleaner product presentation, a clearer path from browsing to buying, and a visual language that matches the brand's energy.
* **The work:** The before-and-after breakdown of the revamp — screens, flows, and design decisions — is published on Behance.

### B Sides Kochi
**Type:** Website | [Visit Site](https://bsideskochi.in/)
**Image:** `/videos/9.gif`
* **About the project:** The website for BSides Kochi, part of the global Security BSides family of community-driven cybersecurity conferences. A conference site has to do several jobs at once — sell the event to attendees, inform speakers and sponsors, and carry the community's identity — and this one was built to do all three.
* **The work:** Design and build of the event's web presence — schedule, speakers, CFP, and sponsor information — with a look that fits hacker-culture without sacrificing legibility.

### Bi0s Hardware
**Type:** Website | [Visit Site](https://bi0shardware.com/)
**Image:** `/bi0shardware.png`
* **About the project:** The website for bi0s Hardware — the hardware security wing of team bi0s, one of India's top-ranked CTF (Capture The Flag) teams. The site presents the team's research, projects, and community work in hardware and embedded security.
* **The work:** Design and build of a web identity that reflects the team's technical depth — a security-culture aesthetic that stays clean and readable.

### Graphic Design
**Type:** Graphic Design | [Visit Site](https://bi0shardware.com/)
**Image:** `/wiredctf.png`
* **About the work:** A running collection of graphic design work for events and organizations — conference branding, CTF event graphics, posters, and social media creatives. Each piece adapts to its event's identity while keeping typography and hierarchy doing the heavy lifting.
* **Range:** From cybersecurity event identities (like the WiRED CTF artwork) to promotional material for student and community organizations — work that spans print, web, and social formats.
