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
      { label: "Shipped", value: "1.0 in September 2026, now on 1.1.2" }
    ],
    content: [
      {
        section: "Overview",
        body: "NotBad is a Markdown writer for Windows, macOS, and Linux. You write in plain .md files, and the app hides the Markdown while you type, so headings look like headings and bold looks bold. Everything else stays out of the way until you ask for it.\n\nI did the whole thing: the product framing, the interaction design, the visual system, and the Flutter code that ships it. That matters for this story. Several of the decisions below were only possible because the person drawing the screen was also the person deciding how the text engine works.\n\nVersion 1.0 shipped in September 2026. It opens in about a second, installs from a 10.8 MB file, and behaves the same on all three desktops. In the weeks since, it has picked up code highlighting, a daily writing goal, an E-Ink mode, tables, and the ability to type in Telugu and Hindi."
      },
      {
        section: "The Problem: Plumbing Between Writer and Words",
        body: "Markdown editors force a choice. Either you stare at raw syntax (asterisks, hashes, brackets) while you write, or you split the screen with a preview pane and keep glancing sideways. Both put plumbing between the writer and the words.\n\nThere is a better model: show the Markdown as what it means, in place, and keep the file plain underneath. Trace did this beautifully, but only on the Mac. Writers on Windows and Linux had nothing like it.\n\nThe usual way to bring an editor like that to other platforms is to put a web-based editor inside a desktop shell. Most cross-platform editors are built that way, and it's why most of them need 100 MB or more and a few seconds to start. For a tool whose whole promise is calm, that felt like the wrong trade. So the question I started with was: can the in-place Markdown experience exist on every desktop without a browser engine underneath it?"
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
        section: "Key Decision: Hide the Syntax, Keep the Text",
        body: "The core interaction is concealment. Markdown marks fade away, and headings, emphasis, and links simply look like what they are.\n\n![The default view: headings, emphasis and links styled, with the Markdown marks hidden](/notbad-editor.png)\n\nThere were two ways to build it. One was a custom layout engine that removes the marks from the screen entirely. The other was to keep every character exactly where it is and paint the marks transparent at almost zero width. I chose the second. Because the marks still exist at their real positions, selection, undo, find, and caret movement always line up with the file on disk. A custom engine would have given me more control, but each of those behaviors would have needed its own translation between what you see and what gets saved, and every translation is a place for words to go missing.\n\nFully hidden marks have a cost too: you end up deleting characters you can't see. So the line you're editing reveals its marks, dimmed, while the rest of the document stays clean. I borrowed this caret-line reveal from Obsidian, because it's the best answer I found for editing honestly in a concealed view. The trade-off is that the active line shifts slightly as marks appear and disappear. I accepted it, and gave people who dislike it a way out: three view modes, one shortcut apart (Ctrl+Shift+H): marks hidden, marks visible, and plain source.\n\n![The same document with marks visible, for writers who'd rather see every asterisk](/notbad-marks.png)\n\nSome marks never hide, even in the default view: list bullets, checkboxes, blockquote bars, and horizontal rules. They are part of the content, so they stay."
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
        section: "Why Native Mattered to the Experience",
        body: "The obvious port would have wrapped Trace's web-based editor in a desktop shell. I rejected it because the experience goals ruled it out: desktop web views are heavy, behave differently across platforms (weakest on Linux, exactly where reach mattered), and break the promise of a light, instant tool.\n\nInstead the editor is built natively in Flutter: about 3,500 lines of Dart doing what the original needs roughly 28,000 lines of Swift and 14,600 of TypeScript for. Each keystroke restyles only the line it touched, so long documents stay as fast as short ones. For the writer, that technical bet shows up as experience: about one second from launch to typing, a 10.8 MB installer, and the exact same behavior on every desktop.\n\nInstalling follows the same thinking. On Windows, NotBad installs per user without asking for admin rights, because writers install their own tools. Linux gets a tarball and a Snap package, and macOS a zipped app, all built automatically from the same code."
      },
      {
        section: "After Launch: New Features, Same Quiet",
        body: "The updates after 1.0 were a test of the system: could new features land without making the app louder?\n\n**Code highlighting.** Code blocks now color their keywords, strings, and comments, using a small tokenizer written in Dart and colors drawn from the same palette as everything else.\n\n**A daily writing goal.** You can set a word target for the day. Progress shows as a small ring inside the statistics popover, and on the toolbar only once you've set a goal. It follows the same rule as the word count: there when you look for it, quiet otherwise.\n\n**E-Ink mode.** A pure black-and-white preset with crisp hairlines, for E-Ink monitors and anyone who wants maximum contrast.\n\n**Git status in the sidebar.** If your writing folder is a Git repository, files show a faint dot when they're modified and a plus when they're new.\n\n**Tables.** Markdown tables render as an aligned grid with bold headers, and NotBad can line the columns up for you.\n\n**Writing in Telugu and Hindi.** The 1.0 design document listed \"English only\" under design debt, with a note that an app about words owes its users their languages. NotBad now has Telugu input in three layouts (phonetic, InScript, and Anu Script) plus phonetic Hindi. In phonetic mode, typing \"telugu\" gives you తెలుగు, converted as you type.\n\nNone of it needed a new screen. Ctrl+M switches between English and your Indian language, and a small badge on the toolbar shows which one is active. The full list lives in the palette as Input Language…, built exactly like the other nested pickers. A reference chart covers the Anu Script keyboard, and exported HTML and PDF files load Telugu fonts, so the export looks like what you wrote."
      },
      {
        section: "What's Still Missing",
        body: "The design document keeps an honest list of what isn't done yet, and most of it still stands:\n\n- The custom editor styling hasn't been tested with screen readers. With marks concealed, it still needs working out what NVDA or VoiceOver should read aloud.\n- There's no right-to-left layout.\n- The interface itself is English only, even though you can now write in Telugu and Hindi.\n\nE-Ink mode covers part of what a full high-contrast mode would, but not all of it. These stay on the list until they're done."
      },
      {
        section: "Outcomes",
        body: "- **About 1 second** from cold start to typing.\n- **10.8 MB** installer, about 29 MB installed.\n- **Three desktops, one design**: built and tested automatically on every change, with regression tests guarding the sharp edges (view modes, line endings, list continuation, search, tables, and the Telugu engine).\n- **Telugu and Hindi input** within weeks of launch, without adding a single screen.\n\nAnd the one that can't be measured: the resting state of the app is a piece of paper with your words on it. That was the whole brief."
      },
      {
        section: "What This Project Taught Me",
        body: "**Write down what you won't build.** The list of non-goals did more design work than any mockup. It turned dozens of future debates into quick decisions.\n\n**Fix the structure behind the complaint.** \"Too long and too complex\" could have been patched with smaller type and section headers. The real fix was separating browsing from searching, and that same structure later made room for language input without a redesign.\n\n**Knowing the engine changes the design.** Painting marks transparent instead of removing them looks like an engineering detail, but it's the reason the caret never lies about where you are. I could only make that call because I was building the editor myself."
      },
      {
        section: "The Full Design Document",
        body: "The complete design document has state diagrams for the document lifecycle and view modes, full token tables, the UI element inventory with screenshots, and a ten-entry decision log with the alternatives each choice beat. It lives in the repository: **github.com/nagubathula/NotBad/blob/main/docs/DESIGN.md**"
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
