import { articlesData } from "./articles";

const studies = [
  {
    slug: "notbad-design",
    title: "NotBad: The Words Are the Interface",
    type: "Product Design Case Study",
    heroDescription: "Designing a Markdown writer where the interface steps aside for the words. Hidden syntax, chrome that appears only on intent, and a deliberately small design system take a macOS-only idea to every desktop.",
    image: "/notbad-editor.png",
    // The facts a reader wants before the story.
    meta: [
      { label: "Product", value: "Distraction-free Markdown writer" },
      { label: "Role", value: "Product design and engineering, end to end" },
      { label: "Platforms", value: "Windows, macOS, Linux" },
      { label: "Starting point", value: "Trace, a macOS-only writer" },
    ],
    content: [
      {
        section: "The Problem: Plumbing Between Writer and Words",
        body: "Markdown editors force a choice. Either you stare at raw syntax (asterisks, hashes, brackets) while you write, or you split the screen with a preview pane and keep glancing sideways. Both put plumbing between the writer and the words.\n\nTrace solved this beautifully, but only for Mac users. Writers on Windows and Linux had no equivalent, and a straight port would have meant embedding a heavy web engine and trading the calm, instant feel for a bloated one."
      },
      {
        section: "Who It's For",
        body: "People who want Markdown's plain, portable files without having to look at Markdown while they write, and who expect a writing tool to open instantly, stay quiet, and never lose a word.\n\nThat gave the design four goals:\n\n1. **Words first.** The resting state of the app is text on paper.\n2. **Instant and light.** Open and type in about a second; nothing heavy in the way.\n3. **Same everywhere.** Identical behavior on Windows, macOS, and Linux.\n4. **Trustworthy.** An app for words must never lose them."
      },
      {
        section: "Design Principles",
        body: "Five principles settled arguments before they started:\n\n1. **Conceal, don't remove.** Syntax marks stay in the file; only the view hides them. The document on disk is always plain Markdown. The UI never owns the data.\n\n2. **Everything within reach, nothing in view.** Chrome appears on intent (mouse movement, a shortcut) and recedes on writing.\n\n3. **Keyboard-first, mouse-forgiven.** Every action has a shortcut and lives in a fuzzy command palette; a floating toolbar and quiet title-bar icons cover mouse-first users.\n\n4. **Predictability beats magic.** Hidden marks reappear where you're editing; external file changes ask before overwriting; what you see always maps to the file.\n\n5. **One theme, done well.** No theme gallery: one warm-paper light and one neutral dark appearance, six accent colors, three line heights. Fewer options meant each one could be tuned properly."
      },
      {
        section: "Key Decision: Hide the Syntax, Not the Text",
        body: "The core interaction is concealment: Markdown marks fade away, and headings, emphasis, and links simply look like what they are.\n\nBut fully hidden marks make editing disorienting: you end up deleting characters you can't see. The answer is the **caret-line reveal**: the line you're editing shows its marks, dimmed, while the rest of the document reads clean. The trade-off is that the active line shifts slightly as marks appear. I accepted it, and gave people who dislike it a way out: three view modes one shortcut apart (Ctrl+Shift+H): marks hidden, marks visible, and plain source.\n\nSome marks never hide, even by default: list bullets, checkboxes, blockquote bars, and horizontal rules. They are part of the content, so they stay."
      },
      {
        section: "Key Decision: Chrome That Appears on Intent",
        body: "If the words are the interface, anything else on screen needs a reason to be there.\n\n**The title bar disappears.** The system title bar is replaced by a 36px transparent strip that fades to nothing, so scrolled text dissolves under it instead of hitting a hard edge. It holds only the document name with a soft \"Edited\" marker, a quiet sidebar toggle, and window buttons.\n\n**The toolbar steps back while you type.** A floating pill holds the eight actions prose actually needs, and fades out as soon as you start typing. Your hands are on the keyboard, so the mouse controls are noise. It returns the moment you move the mouse. That one 250ms fade does more for the quiet feel than any color choice.\n\n**The outline is a whisper.** A table of contents lives as faint dashes in the corner (one per heading, length showing depth) that open into a clickable outline on hover."
      },
      {
        section: "Iterating on Feedback: The Command Palette",
        body: "The command palette began as one flat list. As features grew it reached about 30 rows, and the feedback was blunt: \"it is getting long and too complex.\"\n\nThe redesign splits browsing from searching. Browsing shows about 13 curated rows, with settings grouped into nested pickers (View Mode…, Settings… → Appearance…, Accent Color…, Line Height…), and each parent row shows its current value underneath, so you know the state without opening it. Searching still reaches everything: nested options stay findable from the top level, so typing \"dark\" switches the appearance in two keystrokes. **Browse simple, search deep.**\n\nAccent colors are picked from real swatches, so you choose the color you see instead of its name."
      },
      {
        section: "The Visual System",
        body: "Every color, size, and motion in the app comes from one set of tokens.\n\n**Surfaces:** the light theme is warm paper (#F7F6F3) instead of pure white, so the page feels inviting to write on. Dark is a neutral warm #2D2D2D, with the sidebar one step darker in both.\n\n**Accent with meaning:** six accents, each tuned separately for light and dark: Amber, Crimson, Fern, Teal, Azure (the default), and Graphite. The accent colors exactly five things: caret, selection, links, list markers, and active toolbar states. Everything else is grayscale, so color always means something.\n\n**Type built for long reading:** the system UI face at 15.5px with generous 1.85 line height (Tight, Normal, and Relaxed presets), headings scaled ×1.6 / ×1.35 / ×1.15, and extra space on blank lines so paragraphs breathe.\n\n**Motion as acknowledgement:** the palette opens in 140ms with a gentle scale-fade, the sidebar slides in over 220ms, the toolbar fades in 250ms, all with ease-out. Nothing bounces. Motion is only there to confirm that something happened."
      },
      {
        section: "Designing for Trust",
        body: "Losing writing is the one unforgivable failure, so trust was designed as deliberately as the visuals. Each behavior is a promise to the writer:\n\n1. **Pick up where you left off**: relaunching reopens your last document at the same spot.\n2. **Saved without thinking**: autosave every 30 seconds and whenever you switch away.\n3. **Untitled isn't unsafe**: unsaved drafts survive a crash and come back on the next launch.\n4. **No silent overwrites**: if the file changes elsewhere (sync, git, another editor), NotBad reloads quietly when you have no edits, and when you do, asks whether to Keep My Version or Reload From Disk.\n5. **One window per document**: opening a file hands it to the running app instead of spawning a confusing twin.\n\nPlus the invisible courtesies: line endings preserved exactly as each file had them, and a cursor that never drifts out of sync with the text."
      },
      {
        section: "Why Native Mattered to the Experience",
        body: "The obvious port would have wrapped Trace's web-based editor in a desktop shell. I rejected it because the experience goals ruled it out: desktop web views are heavy, behave differently across platforms (weakest on Linux, exactly where reach mattered), and break the promise of a light, instant tool.\n\nInstead the editor is built natively in Flutter: about 3,500 lines of Dart doing what the original needs roughly 28,000 lines of Swift and 14,600 of TypeScript for. For the writer, that technical bet shows up as experience: about one second from launch to typing, a 10.8 MB installer, and the exact same behavior on every desktop."
      },
      {
        section: "Outcomes",
        body: "- **About 1 second** from cold start to typing.\n- **10.8 MB** installer, about 29 MB installed.\n- **Three desktops, one design**: built and tested automatically on every change, with regression tests guarding the sharp edges (view modes, line endings, list continuation, search, empty states).\n\nAnd the one that can't be measured: the resting state of the app is a piece of paper with your words on it. That was the whole brief."
      },
      {
        section: "The Full Case Study",
        body: "This is the condensed version. The complete design document has state diagrams for the document lifecycle and view modes, full token tables, the UI element inventory with screenshots, and a ten-entry decision log with the alternatives each choice beat. It lives in the repository: **github.com/nagubathula/NotBad/blob/main/docs/DESIGN.md**"
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
export const caseStudiesData = [...studies, ...articlesData];
