import { articlesData } from "./articles";
import { projectStudies } from "./projectStudies";

const studies = [
  {
    slug: "notbad-design",
    title: "NotBad: The Words Are the Interface",
    type: "Product Design Case Study",
    heroDescription: "Designing a Markdown writer where the interface steps aside for the words. Hidden syntax, chrome that appears only on intent, and a deliberately small design system take a macOS-only idea to every desktop.",
    image: "/notbad-editor.png",
    video: "/videos/notbad-launch.mp4",
    logo: "/notbad-logo.png",
    // The facts a reader wants before the story.
    meta: [
      { label: "Product", value: "Distraction-free Markdown writer" },
      { label: "Role", value: "Product design and engineering, end to end" },
      { label: "Platforms", value: "Windows, macOS, Linux" },
      { label: "Shipped", value: "1.0 in September 2026, now on 1.1.2" }
    ],
    highlights: [
      { value: "~1s", label: "From launch to typing" },
      { value: "15.2 MB", label: "Windows installer" },
      { value: "3,500", label: "Lines of Dart, against ~42,600 in the original" },
      { value: "3", label: "Desktops from one codebase" }
    ],
    content: [
      {
        section: "Overview",
        body: "NotBad is a Markdown writer for Windows, macOS, and Linux. You write in plain .md files, and the app hides the Markdown while you type, so headings look like headings and bold looks bold. Everything else stays out of the way until you ask for it.\n\nI did the whole thing: the product framing, the interaction design, the visual system, and the Flutter code that ships it. That matters for this story: several of the decisions below were only possible because the person drawing the screen was also the person deciding how the text engine works.\n\nVersion 1.0 shipped in September 2026. In the weeks since, it has picked up code highlighting, a daily writing goal, an E-Ink mode, tables, and the ability to type in Telugu and Hindi, all without making the app any louder."
      },
      {
        section: "The Problem: Plumbing Between Writer and Words",
        body: "Markdown editors force a choice. Either you stare at raw syntax (asterisks, hashes, brackets) while you write, or you split the screen with a preview pane and keep glancing sideways. Both put plumbing between the writer and the words.\n\nThere is a better model: show the Markdown as what it means, in place, and keep the file plain underneath. Trace did this beautifully, but only on the Mac. Writers on Windows and Linux had nothing like it.\n\nSo the question I started with was: can the in-place Markdown experience exist on every desktop, and still feel as light and calm as the idea deserves?"
      },
      {
        section: "Who It's For, and What It Leaves Out",
        body: "I designed for one kind of person: someone who writes prose (notes, essays, documentation) and who:\n\n- keeps their writing in plain .md files, with no library, no lock-in, and no cloud,\n- wants the piece to look finished while they're still writing it,\n- works mostly from the keyboard, but shouldn't be punished for reaching for the mouse.\n\nThat gave the design four goals:\n\n1. **Words first.** The resting state of the app is text on paper.\n2. **Instant and light.** Open and type in about a second, with nothing heavy in the way.\n3. **Same everywhere.** Identical behavior on Windows, macOS, and Linux.\n4. **Trustworthy.** An app for words must never lose them.\n\nJust as important was the list of things I decided not to build: preview panes, split views, a plugin manager, an AI assistant, and a formatting toolbar with forty buttons. Each of those is a reasonable feature in some other app. Here, every one of them would have put something between the writer and the text. Writing the list down early kept later arguments short. If a request landed on it, the answer was already decided."
      },
      {
        section: "Five Principles",
        body: "Five principles settled arguments before they started:\n\n1. **Conceal, don't remove.** Syntax marks stay in the file; only the view hides them. The document on disk is always plain Markdown, and the UI never owns the data.\n\n2. **Everything within reach, nothing in view.** Chrome appears on intent (mouse movement, a shortcut) and recedes while you write.\n\n3. **Keyboard-first, mouse-forgiven.** Every action has a shortcut and lives in a fuzzy command palette. A floating toolbar and quiet title-bar icons cover people who prefer the mouse.\n\n4. **Predictability beats magic.** Hidden marks reappear where you're editing, external file changes ask before overwriting anything, and what you see always maps to the file.\n\n5. **One theme, done well.** No theme gallery: one warm-paper light and one neutral dark appearance, six accent colors, three line heights. Fewer options meant each one could be tuned properly."
      },
      {
        section: "Key Decision: Native, Not a Browser in a Box",
        body: "The usual way to bring an editor like Trace to other platforms is to put a web-based editor inside a desktop shell. Most cross-platform editors are built that way, and it's why most of them need 100 MB or more and a few seconds to start. Desktop web views also behave differently on each platform, and they're weakest on Linux, exactly where reach mattered. For a tool whose whole promise is calm, that was the wrong trade.\n\nSo the editor is built natively in Flutter: about 3,500 lines of Dart doing what the original needs roughly 28,000 lines of Swift and 14,600 of TypeScript for. Each keystroke restyles only the line it touched, so long documents stay as fast as short ones.\n\nThe writer never sees any of that. What they get is about one second from launch to typing, a 15.2 MB Windows installer, and the same behavior on every desktop. Installing follows the same thinking: on Windows, NotBad installs per user without asking for admin rights, because writers install their own tools. Linux gets a tarball and a Snap package, and macOS a zipped app, all built automatically from the same code."
      },
      {
        section: "Key Decision: Hide the Syntax, Keep the Text",
        body: "The core interaction is concealment. Markdown marks fade away, and headings, emphasis, and links simply look like what they are.\n\nThere were two ways to build it. One was a custom layout engine that removes the marks from the screen entirely. The other was to keep every character exactly where it is and paint the marks transparent at almost zero width. I chose the second. Because the marks still exist at their real positions, selection, undo, find, and caret movement always line up with the file on disk. A custom engine would have given me more control, but each of those behaviors would have needed its own translation between what you see and what gets saved, and every translation is a place for words to go missing.\n\nFully hidden marks have a cost too: you end up deleting characters you can't see. So the line you're editing reveals its marks, dimmed, while the rest of the document stays clean.\n\n![The caret-line reveal: only the line being edited shows its marks, like the #### of this fourth-level heading](/notbad-demo.gif)\n\nI borrowed this caret-line reveal from Obsidian, because it's the best answer I found for editing honestly in a concealed view. The trade-off is that the active line shifts slightly as marks appear and disappear. I accepted it, and gave people who dislike it a way out: three view modes, one shortcut apart (Ctrl+Shift+H): marks hidden, marks visible, and plain source.\n\n![The same document with marks visible, for writers who'd rather see every asterisk](/notbad-marks.png)\n\nSome marks never hide, even in the default view: list bullets, checkboxes, blockquote bars, and horizontal rules. They are part of the content, so they stay."
      },
      {
        section: "Key Decision: Chrome That Appears on Intent",
        body: "If the words are the interface, anything else on screen needs a reason to be there. I went through every piece of standard window furniture and asked what it was for.\n\n**The title bar.** The system title bar is the biggest band of non-content in any window, so it went. In its place is a 36px transparent strip that fades into the page, so scrolled text dissolves under it instead of hitting a hard edge. It holds the document name with a soft \"Edited\" marker, a quiet sidebar toggle, a button that opens the command palette for mouse users, and the window controls. On macOS the native traffic lights stay.\n\n**The toolbar.** A floating pill at the bottom holds the eight actions prose actually needs: heading, bold, italic, list, find, view mode, focus mode, and statistics. Where a letter is the clearest icon (H, B, I), it uses the letter. The pill fades out the moment you start typing, because your hands are on the keyboard and the mouse controls are noise, and it comes back as soon as you move the mouse. That one 250ms fade does more for the quiet feel than any color choice.\n\n**The word count.** It lives behind the ⓘ button instead of sitting on screen. A live counter in the corner nags; a count you ask for informs.\n\n**The outline.** A table of contents lives as faint dashes in the top-left corner, one per heading, with length showing depth. Hover and they open into a clickable outline. You can ignore them for hours.\n\n**The file sidebar.** Files have no icons and no extensions, so it reads as a list of your writing (\"Reading list\") instead of a file manager (\"Reading list.md\"). Folders keep their chevrons because you can open them. The sidebar is fully keyboard-driven and refreshes itself when files change on disk.\n\n![The sidebar: a list of writing, without icons or file extensions](/notbad-sidebar.png)\n\n**Find.** The find bar docks in the top-right corner instead of opening as a dialog, because you need to see the text while you search it."
      },
      {
        section: "Iterating on Feedback: The Command Palette",
        body: "The command palette (Ctrl+K) is the app's whole surface area in one searchable list. It started as a flat list. As features grew it reached about 30 rows, and the feedback was blunt: \"it is getting long and too complex.\"\n\nI considered two other fixes first. A settings window would have shortened the list, but it would also have added a second place to look and a big panel of controls, which works against everything else in the app. Splitting the list into labeled sections would have helped scanning, but the list would have stayed just as long.\n\nThe redesign splits browsing from searching. Browsing shows about 13 curated rows, with settings grouped into nested pickers (View Mode…, Settings… → Appearance…, Accent Color…, Line Height…). Each parent row shows its current value underneath, so you know the state without opening it. Searching still reaches everything: nested options stay findable from the top level, so typing \"dark\" switches the appearance in two keystrokes.\n\n![The command palette: about a dozen rows to browse, with everything reachable by search](/notbad-palette.png)\n\nAccent colors are picked from real swatches, so you choose the color you see instead of its name. The nested structure also turned out to be the right home for features I hadn't planned yet, which I come back to below."
      },
      {
        section: "The Visual System",
        body: "Every color, size, and motion in the app comes from one set of tokens, defined in one file.\n\n**Surfaces:** the light theme is warm paper (#F7F6F3) instead of pure white, so the page feels inviting to write on. Dark is a neutral warm #2D2D2D, with the sidebar one step darker in both.\n\n**Accent with meaning:** six accents, each tuned separately for light and dark: Amber, Crimson, Fern, Teal, Azure (the default), and Graphite. A blue that reads well on paper is hard to see on dark gray, so each one has two values. The accent colors exactly five things: caret, selection, links, list markers, and active toolbar states. Everything else is grayscale, so color always means something.\n\n**Type built for long reading:** the system UI face at 15.5px with a generous 1.85 line height (Tight, Normal, and Relaxed presets), headings scaled ×1.6 / ×1.35 / ×1.15, and extra space on blank lines so paragraphs breathe without fake margins.\n\n**Motion as acknowledgement:** the palette opens in 140ms with a gentle scale-fade, the sidebar slides in over 220ms, and the toolbar fades in over 250ms, all with ease-out. Nothing bounces. Every animation answers one question, \"did that register?\", in under a quarter of a second."
      },
      {
        section: "Designing for Trust",
        body: "Losing writing is the one unforgivable failure, so I designed trust as deliberately as the visuals. I mapped every path a document can take, from launch to close, and gave each one a promise:\n\n1. **Pick up where you left off**: relaunching reopens your last document at the same spot.\n2. **Saved without thinking**: autosave every 30 seconds and whenever you switch away.\n3. **Untitled isn't unsafe**: unsaved drafts survive a crash and come back on the next launch.\n4. **No silent overwrites**: if the file changes elsewhere (sync, git, another editor), NotBad reloads quietly when you have no edits, and when you do, asks whether to Keep My Version or Reload From Disk.\n5. **One window per document**: opening a file hands it to the running app instead of spawning a confusing twin.\n\nPlus the invisible courtesies: line endings preserved exactly as each file had them, and a cursor that never drifts out of sync with the text."
      },
      {
        section: "Small Defaults That Add Up",
        body: "Most of the time in a writing app is spent typing, so the small behaviors matter more than the big screens:\n\n- **Enter** continues a list: bullets carry on, numbers count up, and checkbox lists get a fresh box. Enter on an empty item ends the list.\n- **Ctrl+B** or **Ctrl+I** with nothing selected wraps the word under the caret, which is what you want nine times out of ten.\n- Typing a bracket or backtick closes it for you, and typing the closing half skips over the one that's already there.\n- Click a checkbox to tick it, and Ctrl+click a link to open it.\n\n**Focus mode** dims everything except the paragraph you're in, and typewriter scrolling keeps the caret vertically centered. The dimming works on paragraphs instead of lines, because a sentence needs its neighbors to make sense.\n\n![Focus mode: everything outside the current paragraph fades back](/notbad-focus.png)\n\nEach of these removes a tiny bit of friction. Repeated a few hundred times a session, that friction is the difference between a tool you put up with and one you enjoy using."
      },
      {
        section: "After Launch: New Features, Same Quiet",
        body: "The updates after 1.0 were a test of the system: could new features land without making the app louder?\n\n**Code highlighting.** Code blocks now color their keywords, strings, and comments, using a small tokenizer written in Dart and colors drawn from the same palette as everything else.\n\n**A daily writing goal.** You can set a word target for the day. Progress shows as a small ring inside the statistics popover, and on the toolbar only once you've set a goal. It follows the same rule as the word count: there when you look for it, quiet otherwise.\n\n**E-Ink mode.** A pure black-and-white preset with crisp hairlines, for E-Ink monitors and anyone who wants maximum contrast.\n\n**Git status in the sidebar.** If your writing folder is a Git repository, files show a faint dot when they're modified and a plus when they're new.\n\n**Tables.** Markdown tables render as an aligned grid with bold headers, and NotBad can line the columns up for you.\n\n**Writing in Telugu and Hindi.** The 1.0 design document listed \"English only\" under design debt, with a note that an app about words owes its users their languages. NotBad now has Telugu input in three layouts (phonetic, InScript, and Anu Script) plus phonetic Hindi. In phonetic mode, typing \"telugu\" gives you తెలుగు, converted as you type.\n\nNone of it needed a new screen. Ctrl+M switches between English and your Indian language, and a small badge on the toolbar shows which one is active. The full list lives in the palette as Input Language…, built exactly like the other nested pickers. A reference chart covers the Anu Script keyboard, and exported HTML and PDF files load Telugu fonts, so the export looks like what you wrote."
      },
      {
        section: "Showing It: A Film Made From the Real App",
        body: "A quiet app is hard to sell with screenshots. A still frame of NotBad is mostly an empty page, and the whole point is what happens while you type: marks fading, chrome stepping aside, the page staying calm. So the launch needed a film.\n\nThe first films were built from an HTML recreation of the interface, animated frame by frame in a headless browser. They looked right, but every one of them was a drawing of NotBad, and a drawing drifts from the product the moment the product changes. For an app whose promise is honesty about your text, showing a mock-up felt wrong.\n\n![The cinematic cut: a keynote-style film on black, cut to a beat-synced score](/videos/notbad-cinematic.mp4)\n\n![The reveal: marks dissolving into particles, then focus mode and typewriter scroll](/videos/notbad-reveal.mp4)\n\nSo the final film is captured from the real app. A test harness runs the actual editor screen offscreen under a fake clock, types into it, presses the real shortcuts, and saves each frame, about 900 of them at 2400×1500. Nothing on screen is staged: the marks that dissolve are the editor's own concealment, and the sidebar is the real sidebar.\n\n![The 38-second launch film, captured from the running app](/videos/notbad-film.mp4)\n\nThe sound follows the same restraint as the interface. The edit is cut to a short voiceover over a soft felt-piano bed, the music ducks under each line, and quiet clicks land on the captured keystroke times, so what you hear is the writing itself. Because the footage comes from the app, re-shooting the film after an update is one command, not a redesign."
      },
      {
        section: "Outcomes",
        body: "- **About 1 second** from cold start to typing.\n- **15.2 MB** Windows installer; 18 to 27 MB downloads on Linux and macOS.\n- **Three desktops, one design**: built and tested automatically on every change, with regression tests guarding the sharp edges (view modes, line endings, list continuation, search, tables, and the Telugu engine).\n- **Telugu and Hindi input** within weeks of launch, without adding a single screen.\n\nAnd the one that can't be measured: the resting state of the app is a piece of paper with your words on it. That was the whole brief."
      },
      {
        section: "What This Project Taught Me",
        body: "**Write down what you won't build.** The list of non-goals did more design work than any mockup. It turned dozens of future debates into quick decisions.\n\n**Fix the structure behind the complaint.** \"Too long and too complex\" could have been patched with smaller type and section headers. The real fix was separating browsing from searching, and that same structure later made room for language input without a redesign.\n\n**Knowing the engine changes the design.** Painting marks transparent instead of removing them looks like an engineering detail, but it's the reason the caret never lies about where you are. I could only make that call because I was building the editor myself."
      },
      {
        section: "What's Still Missing",
        body: "The design document keeps an honest list of what isn't done yet, and most of it still stands:\n\n- The custom editor styling hasn't been tested with screen readers. With marks concealed, it still needs working out what NVDA or VoiceOver should read aloud.\n- There's no right-to-left layout.\n- The interface itself is English only, even though you can now write in Telugu and Hindi.\n\nE-Ink mode covers part of what a full high-contrast mode would, but not all of it. These stay on the list until they're done."
      },
      {
        section: "The Full Design Document",
        body: "The complete design document has state diagrams for the document lifecycle and view modes, full token tables, the UI element inventory with screenshots, and a ten-entry decision log with the alternatives each choice beat. It lives in the repository: [read DESIGN.md on GitHub](https://github.com/nagubathula/NotBad/blob/main/docs/DESIGN.md)."
      }
    ]
  },
  {
    slug: "openweave-design",
    title: "OpenWeave: A Design Tool You Can Open Up",
    type: "Product Design Case Study",
    heroDescription: "Taking an open-source Figma-compatible editor and pushing it toward the work designers do after the static frame: motion, prototypes on real devices, handoff, and live shader layers, while keeping the file on your own disk.",
    image: "/openweave-shader.png",
    meta: [
      { label: "Product", value: "Open-source design editor and toolkit" },
      { label: "Role", value: "Product design and engineering, on top of an open-source fork" },
      { label: "Platforms", value: "Windows, macOS, Linux, and the browser" },
      { label: "Built", value: "August to October 2026, now at 0.13" }
    ],
    highlights: [
      { value: "2", label: "Months from fork to 0.13" },
      { value: "~68,000", label: "Lines added on top of the fork" },
      { value: "6", label: "Live shader presets, plus custom SkSL" },
      { value: "3", label: "Code targets for every animation" }
    ],
    content: [
      {
        section: "Overview",
        body: "OpenWeave is a design editor that opens native Figma (.fig) and Pencil (.pen) files, keeps them on your disk, and lets you program the editor itself: a command-line tool, an MCP server for AI agents, and a headless SDK for building your own editing surfaces.\n\nIt didn't start from a blank page. OpenWeave is a fork of OpenPencil, Danila Poyarkov's MIT-licensed editor, which already had the hard foundation: a Skia renderer, a Figma file codec, auto layout on Yoga, and the CLI. I want to be clear about that line, because the interesting part of this project is what I did with a foundation I didn't have to pour.\n\nMy part: I moved the app and its SDK from Vue to React and Next.js, moved the desktop app from Tauri to Electron, and designed and built the features that take the editor past static frames: a motion timeline, prototyping on device frames, Dev Mode, live shader layers, vector path editing, and sharing a local file with someone across the internet.\n\n![Where the work sits: the engine came from OpenPencil; the app, the features, and the desktop shell on top are mine](/openweave-architecture.svg)"
      },
      {
        section: "The Problem: Design Stops at the Static Frame",
        body: "Open-source design tools usually chase parity with the static canvas: frames, auto layout, components. That is the part of design that is most solved. The work that eats a designer's week happens after it: making a toggle feel springy, showing a flow on an actual phone, handing a developer the exact values, and getting a reviewer into the file.\n\nIn most teams each of those lives in a different tool. Motion goes to an animation app, prototypes to a viewer, specs to a handoff plugin, and the file sits in someone's cloud. Every hop is an export, and every export is a copy that drifts.\n\n![Four tools and three exports, against one file with four tabs](/openweave-handoffs.svg)\n\nThe brief I set: keep all of that in the one file, on your own machine, in the same editor you drew it in."
      },
      {
        section: "Key Decision: Rebuild the Shell in React",
        body: "The fork's app and its headless SDK were written in Vue. Before adding anything, I moved both to React and the app to Next.js: the editor shell, every panel, and the SDK's components and hooks, one family at a time, with the old Vue files kept recoverable from history in case a port missed something.\n\nThis was the slowest and least visible month of the project, and the one everything else stands on. The SDK is the piece other people build with, and React is where most teams who would embed a design canvas already live. It is also the stack I design and build in every day, which meant every feature after this could go from sketch to working panel without switching mental models.\n\n| Layer | In the fork | In OpenWeave |\n|---|---|---|\n| Editor app | Vue | React on Next.js |\n| SDK for custom editors | Headless Vue components | Headless React components and hooks |\n| Desktop shell | Tauri (Rust) | Electron, same app code |\n| Engine: scene graph, renderer, file codecs | Framework-free TypeScript | Unchanged |\nTable: What moved and what didn't\n\nThe engine underneath (scene graph, renderer, file codecs) didn't move. The split between a framework-free core and a thin UI layer is what made a migration this size possible at all."
      },
      {
        section: "Key Decision: Motion Lives Next to the Layers",
        body: "Animation is where I wanted OpenWeave to feel most different, so it got the deepest design work.\n\nThe Motion tab sits beside Design and Prototype in the inspector, and a timeline docks under the canvas. Each animated layer gets a row; each property (position, scale, rotation, width, opacity) gets its own track of keyframes. You can scrub, loop, change playback speed, or turn on recording and simply move things on the canvas to write keyframes, which is how most people think about motion anyway.\n\n![The Motion tab and timeline: six animated layers, each property on its own keyframe track](/openweave-motion.png)\n\nThree details carry most of the feel:\n\n- **Easing you can see.** A bezier curve editor and spring presets sit in the keyframe popover, and the path a layer travels is drawn on the canvas as a trajectory, so you adjust motion where it happens.\n- **Presets as a starting point.** Fade in, slide up, scale pop, spring bounce, and pulse drop a working animation on any layer; then you edit the tracks like any other.\n- **Motion that leaves as code.** Any track exports as CSS keyframes, Framer Motion, or the Web Animations API, with easings mapped to each format, so an animation is a spec a developer can paste, not a video they have to imitate.\n\nMotion tracks are saved inside the document and survive save and reopen. That sounds obvious; it was a bug I had to fix, and it's the difference between a demo and a tool."
      },
      {
        section: "Key Decision: Prototypes on Real Hardware",
        body: "A phone screen on a white canvas doesn't read as a phone. So prototypes can sit inside device frames (iPhone 16 Pro and Pro Max, Pixel 9, iPad Pro, MacBook Pro), in dark, light, or titanium finishes and either orientation.\n\n![Presenting a prototype inside an iPhone frame](/openweave-prototype.png)\n\nThe frame is a property of the page, not a layer, so it can't get nudged or deleted by accident while you edit the screens inside it. Prototype links round-trip through the .fig format, including hotspot connections and transition curves, so a flow wired in OpenWeave still works when the file goes back to Figma."
      },
      {
        section: "Key Decision: Zoom That Means Real Size",
        body: "A device frame gets the shape right, but not the size. A screen at 83% zoom tells you nothing about how big a button will feel under a thumb. The usual check is a screenshot sent to your phone, or opening the file on mobile and waiting for it to load. Both work, and both break the flow.\n\nSo I added a calibration step. You hold any standard card against the screen (a bank card or an ID, which are all 85.60 × 53.98 mm) and drag a slider until the outline on screen matches the card in your hand. That one measurement gives the display's real pixel density.\n\n![Calibrating against a real card: the outline matches at 93.5 PPI on this monitor](/openweave-calibration.webp)\n\nFrom there, zoom finally means something. One command jumps to 1:1 physical size (97% on my monitor) and another to the size the selected frame would be on an actual phone (61%). The editor remembers the calibration for that display, and there are presets for ten common laptops, MacBooks, and monitors for anyone who doesn't want to hunt for a card.\n\nIt was a small feature that quickly became the one I use most. Seeing designs at true size is slightly rude in a useful way: buttons that looked fine at a random zoom suddenly look huge, and type that felt premium reads like a poster. I [wrote about it on LinkedIn](https://www.linkedin.com/posts/satyasainagubathula_figma-uxdesign-productdesign-share-7510938266267844608-cLmG) when it shipped."
      },
      {
        section: "Key Decision: Handoff Without Leaving the File",
        body: "Dev Mode is one shortcut away (Shift+D). The inspector swaps from editing controls to code: CSS, Tailwind, and JSX for the selection, measurements on the canvas, and redline annotations a designer can leave for whoever builds it.\n\n![Dev Mode: the selected card as CSS, with its measurements on the canvas](/openweave-devmode.png)\n\nI kept it a mode of the same editor rather than a separate viewer on purpose. A developer looking at Dev Mode is looking at the real file, not a snapshot exported last Tuesday, and switching back to editing is the same keystroke."
      },
      {
        section: "Key Decision: Shaders as Layers",
        body: "Gradients and blurs cover most backgrounds, but the backgrounds people actually ship now move: animated gradients, noise fields, particles that drift toward the cursor. Designers usually fake these with a looping video.\n\nOpenWeave renders with Skia, and Skia can run small GPU programs (SkSL). So any layer can take a shader as its fill, live on the canvas. There are six presets (animated gradient, noise field, particles, metaballs, lighting, and displacement) and a custom slot for your own SkSL.\n\n![A shader layer behind the hero: an animated gradient running live on the canvas](/openweave-shader.png)\n\nEvery preset shares the same handful of controls (four colors, speed, scale, intensity, complexity, and how strongly it follows the pointer), so learning one teaches all of them. They run live on the canvas and react to the pointer, so a reviewer sees the background moving instead of reading a note that says it will."
      },
      {
        section: "Sharing a File That Lives on Your Disk",
        body: "Local-first has a catch: if the file is on your machine, how does a reviewer get in?\n\nThis was the biggest roadblock of the project. The standard answer is a server, and a small cloud instance runs about $20 a month. But the whole point of OpenWeave is that it runs on your own machine, offline, for free. Paying rent on a server just so two people could look at one canvas would have broken that promise on day one.\n\nCollaboration is peer-to-peer over WebRTC, with live cursors and follow mode, so the document travels directly between people and is never stored on a server. Peers find each other through public MQTT brokers, which only pass the handshake. That covers people who can reach your machine. For everyone else, I used ngrok: the desktop app can run local commands, so it opens a tunnel to your local editor and copies a public link in one click. A local, offline app becomes a shared workspace without deploying anything.\n\n![How a share works: the tunnel carries the link, the room syncs peer to peer, and the host's file autosaves to disk](/openweave-sharing.svg)\n\nOpening that link doesn't drop a stranger straight onto your canvas. They land on a join screen first and can be asked for a room password, because a link that leaks shouldn't mean a file that leaks.\n\nA tunnel also brings an obvious risk: what if your Wi-Fi drops mid-session? The host's copy is the real one, and it autosaves to disk three seconds after the edits stop, so a dead tunnel costs the connection, not the work. To make sure there is a file to autosave into, a new document's first save now goes straight to Documents/openweave without a file dialog. I also made the tunnel recover on its own when ngrok reports an endpoint is already online, the most common way it failed in testing. I [wrote about this roadblock on LinkedIn](https://www.linkedin.com/posts/satyasainagubathula_figma-aws-ngrok-ugcPost-7500806039735386113-_Tp7) while building it."
      },
      {
        section: "Key Decision: Trading Size for a Working Clipboard",
        body: "The fork shipped as a Tauri app, around 7 MB. Small is good, and I didn't want to give that up lightly.\n\nWhat changed my mind was the clipboard. Copying layers out of Figma puts them on the system clipboard as HTML, and on Windows Tauri's clipboard plugin could only read plain text. I wrote a Rust command to read the HTML format directly, and it worked, but it was one more piece of native code next to the Rust that ran the ngrok tunnel, and the list was only going to grow.\n\nElectron has all of that built in, so I moved. The size cost is real, and I accepted it.\n\n| | Tauri | Electron |\n|---|---|---|\n| Download size | About 7 MB | Much larger: it ships its own Chromium |\n| Reading Figma layers from the clipboard on Windows | Text only; needed a custom Rust command | Built in |\n| Running ngrok and other local tools | Custom Rust | Node's process API |\n| Changes to the editor code | — | None: the preload speaks Tauri's IPC protocol |\nTable: The trade, side by side\n\nTo keep the move from rippling through the app, the Electron preload speaks the same IPC protocol the Tauri bridge did, so the editor code didn't have to change at all to run in the new shell."
      },
      {
        section: "Also on the Canvas",
        body: "Smaller pieces that make everyday editing feel finished:\n\n- **Vector networks and path editing.** Edit points and handles directly on the canvas, with a curvature pen tool for drawing smooth paths without dragging handles.\n- **Image crop in place.** Crop, move, and transform an image inside its fill on the canvas instead of in a dialog.\n- **Starter templates.** The home screen opens with working files (a motion showcase, a mobile app, a landing page, a design system, a slide deck) so the first thing you see is the editor doing something.\n\n![The home screen: five starter templates instead of an empty file list](/openweave-home.png)"
      },
      {
        section: "What This Project Taught Me",
        body: "**Credit the foundation, then build past it.** Starting from someone else's open-source engine let me spend my time on the parts designers feel. Being clear about where their work ends and mine begins made it easier to decide what to build, too.\n\n**Do the invisible migration first.** Moving the app to React delivered nothing a user could see. Every feature after it shipped faster because of it. The git history shows the shape: two heavy weeks of migration, then features in bursts.\n\n![Lines added per week: the React migration first, then motion, shaders, and the move to Electron](/openweave-activity.svg)\n\n**Export is a design surface.** Motion that exports as code, prototypes that round-trip to .fig, Dev Mode on the live file: the features that mattered most were about what leaves the editor, not what happens inside it."
      },
      {
        section: "What's Still Missing",
        body: "The honest list of what isn't done:\n\n| Gap | Why it matters | Next step |\n|---|---|---|\n| The download is no longer small | Electron costs far more disk than the 7 MB Tauri build, and the README still describes the old build | Measure the real installer size and update the docs |\n| Motion is in beta | Code exports one layer at a time, so a multi-layer sequence has to be stitched together by hand | Export a whole timeline as one component |\n| Sharing leans on public brokers | Free public MQTT servers are fine for a demo, not for a team to depend on | A self-hostable signaling option |\n| A brand-new file isn't autosaved | Autosave starts after the first save, and sharing doesn't trigger one | Save the file automatically when a share starts |\n| Shaders stay in OpenWeave | Settings survive save and reopen in the .fig, but Figma can't render them and Dev Mode has no code for them | Shader code in Dev Mode, with a static fallback for Figma |\nTable: Gaps, why they matter, and what's next"
      }
    ]
  },
  {
    slug: "zero-cost-automation",
    title: "Zero-Cost Automation",
    type: "Internal Tool Design",
    heroDescription: "Designing an internal automation tool around where the work already happens, the browser, so AI content and data tasks start in a click and report back on their own, on an infrastructure budget of zero.",
    meta: [
      { label: "Product", value: "Internal AI automation suite" },
      { label: "Role", value: "Design and build, end to end" },
      { label: "Interface", value: "Chrome extensions" },
      { label: "Constraint", value: "$0 infrastructure" },
    ],
    content: [
      {
        section: "The Problem",
        body: "Automating AI workflows usually means paying for it. Tools like Zapier, or running the work on AWS, get expensive quickly, especially for a solo developer or a small team running complex AI tasks over and over.\n\nThe goal was a tool that made those repetitive tasks effortless to start and easy to follow, without a monthly bill."
      },
      {
        section: "Design Goals",
        body: "1. **Start work where it happens.** No separate app to open and learn; tasks begin from the browser, where the content work already lives.\n2. **Don't make people check.** When a task finishes, the interface should know and say so, without refreshing or polling.\n3. **Cost nothing.** Every part of the system has to fit inside a free tier, which shapes what's possible as much as any user need."
      },
      {
        section: "Key Decision: The Interface Is a Browser Extension",
        body: "Instead of a standalone dashboard, the tool's interface is a set of lightweight Chrome extensions. People trigger a workflow directly from the page they're working on, and the extension sends the task off in one step.\n\nIt keeps the tool out of the way: no extra tab to manage and no new place to remember to look. The automation sits on top of the work rather than beside it."
      },
      {
        section: "Key Decision: Results Report Back on Their Own",
        body: "Generating video or text takes time, and the worst experience is wondering whether anything is happening. So every task is a row in a shared database, and the interface listens for changes to it.\n\nThe moment a task is picked up or finished, its row updates and the browser hears about it straight away. People queue work and carry on; the status comes to them."
      },
      {
        section: "How It Fits Together",
        body: "Three free pieces, each doing one job:\n\n1. **Chrome extensions (where people work):** the interface, where you start a task and see its status.\n2. **Supabase (the shared queue):** a free PostgreSQL database with real-time updates, connecting the browser to the work and back.\n3. **Google Colab (the engine):** free compute running the AI models and Python scripts, reachable through ngrok so new tasks can trigger it.\n\nA task flows in a loop: queued from the browser, picked up by Colab, written back to the database, and announced to the browser in real time."
      },
      {
        section: "The Impact",
        body: "- **5,000+ automated tasks** processed in the first month.\n- **90% more content produced** with the automation in place.\n- **About $300/month saved** in subscriptions, on an infrastructure bill of $0."
      }
    ]
  }
];

// Hand-written studies first, then the writing imported from Medium.
export const caseStudiesData = [...studies, ...projectStudies, ...articlesData];
