// Case studies for client, design, open-source, internal-tool and AI-video work.
// Each section carries at least one visual: an image, a film, or a table.

export const projectStudies = [
  {
    slug: "tailus-design",
    title: "Tailus: A UI Kit That Speaks Tailwind",
    type: "Design System Case Study",
    heroDescription: "Designing a Figma UI kit built on Tailwind CSS tokens, so the components a designer drags in are the same ones a developer can write without translating a single value.",
    image: "/cases/tailus-hero.webp",
    meta: [
      { label: "Product", value: "Figma UI kit based on Tailwind CSS" },
      { label: "Role", value: "Research, design system, and prototyping" },
      { label: "Platforms", value: "Responsive web" },
      { label: "Published", value: "October 2024" }
    ],
    highlights: [
      { value: "4", label: "Interview rounds before any pixels" },
      { value: "65+", label: "People interviewed" },
      { value: "10%", label: "Less development time" },
      { value: "4", label: "Prototype stages, paper to clickable" }
    ],
    content: [
      {
        section: "Overview",
        body: "Tailus is a Figma UI kit built on Tailwind CSS: pre-designed components that adapt across screen sizes, organised around the same tokens a developer uses in code. The idea was simple. If the colours, spacing, and type scale in the design file are Tailwind's own, nothing gets lost between the mockup and the build.\n\nI ran the project end to end: four rounds of interviews, competitive research, the information architecture, the prototypes, and the final component set.\n\n![Tailus: a Tailwind-based UI kit for designers and developers](/cases/tailus-hero.webp)"
      },
      {
        section: "Research: Four Groups, Four Questions",
        body: "A UI kit sits between people who want different things. A business wants conversions, a user wants to find things, a designer wants to move fast, and a developer wants something they can actually build. So instead of one research round I ran four, each with its own goals.\n\n| Group | Who | Time | What they told me |\n|---|---|---|---|\n| Businesses | 12 business owners | 15 days | Conversions, brand consistency, and accessibility matter; so does less design-to-development time |\n| Users | 20+ users | 30 days | Clear hierarchy, fast pages, and layouts that work on every screen |\n| Developers | 15 developers | 15 days | Translating specs into code is slow, and design and dev tools disagree |\n| Designers | 20+ designers | 30 days | They want consistency, a ready component library, and room to iterate |\nTable: Four interview rounds, run before any design work"
      },
      {
        section: "The Problem: Two Tools That Disagree",
        body: "The clearest pattern came from the developers. Every one of their top problems was a version of the same thing: the design file and the code describe the interface in different terms.\n\n| What developers said | What it costs |\n|---|---|\n| Design specs are hard to turn into working code | Time spent measuring and guessing values |\n| Design and development tools don't match | Small errors that pile up in review |\n| No standard components or guidelines | Every project looks slightly different |\n| Designer–developer communication is unclear | Back-and-forth instead of building |\nTable: The developer interviews, grouped by cost\n\nThe persona that came out of this research was a final-year computer science student: strong at backend work, already using Tailwind for its simplicity, but struggling to make an interface look professional on his own. He didn't need more freedom. He needed good defaults in a language he already spoke."
      },
      {
        section: "Key Decision: Build on Tailwind, Not Around It",
        body: "Competitive research showed the gap. Existing kits had big component libraries and active communities, but customisation was limited and integrating them was complicated. Most were built around pre-designed components that fight you the moment you need something different.\n\nTailwind takes the opposite approach, and that's why the kit is built on it.\n\n| | Bootstrap | Tailwind CSS |\n|---|---|---|\n| Philosophy | Pre-designed components and layouts | Low-level utility classes |\n| Customising | Override the defaults | Compose from utilities |\n| Design values | Fixed by the framework | Tokens you define: colour, spacing, type |\n| Why it fit Tailus | Every change fights the defaults | The kit's tokens become the code's tokens |\nTable: Why the kit follows Tailwind's model\n\nThat turned into the kit's three goals: enhanced customisation through tokens, reusable and accessible components, and time saved by matching the tools developers already use."
      },
      {
        section: "Process: From Scope to User Testing",
        body: "The structure of the kit came from a card-sorting exercise: grouping components the way designers and developers actually reach for them, with stakeholders in the room. Then the work moved in one direction, with a review loop at the end.\n\n![The design process: scope, research, exploration, design system, developer collaboration, then review and testing](/cases/tailus-process.webp)\n\nThe developer collaboration step was the important one. Presenting the system to developers before it was finished, and discussing feasibility early, caught problems while they were still cheap."
      },
      {
        section: "Prototyping in Four Steps",
        body: "Each stage answered a different question, and each one fed the next with stakeholder feedback.\n\n| Stage | Question it answered |\n|---|---|\n| Paper prototypes | Does the layout and interaction flow make sense at all? |\n| Low-fidelity in Figma | Do the basic components work together? |\n| High-fidelity | Do the colours, type, and imagery hold up? |\n| Clickable prototypes | Can stakeholders and test users move through it like the real thing? |\nTable: Eight days of prototyping, paper to clickable"
      },
      {
        section: "The Final Kit",
        body: "The finished kit pairs a full Tailwind colour palette, every hue in every step, with components designed on top of it: dialogs, alerts, accordions, a date picker, and progress indicators, plus sample pages that show them composed together.\n\n![The final kit: Tailwind's full palette alongside components built from it](/cases/tailus-final.webp)\n\nBecause the palette is Tailwind's own, a colour in the design file has the same name in the code. A developer reading the mockup never has to ask which blue."
      },
      {
        section: "Results",
        body: "| Result | Where it came from |\n|---|---|\n| Faster design iteration | The step-by-step prototyping approach |\n| Happier stakeholders | Feedback built in at every prototype stage |\n| Better engagement in user testing | Clickable prototypes tested with real users |\n| 10% less development time | High-fidelity prototypes developers could build from directly |\nTable: Outcomes reported in the original case study\n\nThe next step is growing the toolkit so website design gets more accessible for people who aren't designers. The full visual case study is [on Behance](https://www.behance.net/gallery/210333091/Tailus-Ui-Case-Study)."
      }
    ]
  },
  {
    slug: "rwdy-store-design",
    title: "RWDY: Letting the Clothes Do the Talking",
    type: "E-commerce Redesign",
    heroDescription: "Revamping the storefront for RWDY, an Indian street-culture fashion label, so the homepage sells the brand's energy first and makes the path from browsing to buying short.",
    image: "/cases/rwdy-hero.webp",
    meta: [
      { label: "Product", value: "E-commerce fashion store" },
      { label: "Role", value: "UI design" },
      { label: "Tools", value: "Figma and Photoshop" },
      { label: "Published", value: "April 2024" }
    ],
    highlights: [
      { value: "1", label: "Scrolling page from brand to checkout" },
      { value: "6", label: "Homepage sections, each with one job" },
      { value: "4", label: "Products per row, price always visible" },
      { value: "3", label: "Words for the brand: swag, style, street" }
    ],
    content: [
      {
        section: "Overview",
        body: "RWDY is a fashion label rooted in Indian street culture. Fashion retail lives or dies on presentation: people buy the feeling before they buy the shirt. This revamp of the store's homepage puts the brand's photography up front, keeps the products impossible to miss, and gives every section a single job.\n\n![The new RWDY homepage: campaign photography, the wordmark, and one call to action](/cases/rwdy-hero.webp)\n\nThe hero does three things and nothing else: shows the people wearing the clothes, states the brand in one line (Indian street culture), and offers one button. The search bar and cart stay in the top bar, because returning shoppers come to find something specific."
      },
      {
        section: "One Page, Six Jobs",
        body: "A long homepage works when each band answers the next question a shopper has. I planned the page as a sequence, top to bottom.\n\n| Section | The shopper's question | The answer |\n|---|---|---|\n| Hero | Is this brand for me? | Campaign photography and one line of identity |\n| Proof bar | Can I trust it? | Brand, product, and customer counts in large type |\n| New arrivals | What's new? | Four products with rating, price, and discount |\n| Top selling | What do other people buy? | The same card, sorted by popularity |\n| Swag, Style, Street | What's the attitude? | A full-width campaign band |\n| Reviews and call to action | Will I like it? | Customer quotes, then one last push |\nTable: The homepage as a sequence of questions"
      },
      {
        section: "Key Decision: Products Before Decoration",
        body: "The product card is the most repeated element on the page, so it got the strictest rules: the product on a quiet background, then the name, the rating, and the price, always in that order. Discounts show as the old price struck through plus a small percentage tag, so a deal is visible without shouting.\n\n![New arrivals: the same card everywhere, with price and rating always visible](/cases/rwdy-products.webp)\n\nFour cards per row and a single View All button keep the grid scannable. The same card is reused for Top Selling, so shoppers learn it once."
      },
      {
        section: "Key Decision: A Brand Band, Not a Banner",
        body: "Between the product grids, the page stops selling and starts showing. Three campaign photographs run edge to edge, each with one word over it: Swag, Style, Street. It is the only place on the page where the type gets loud, so it reads as a statement instead of another ad.\n\n![The campaign band: three photographs, three words](/cases/rwdy-campaign.webp)\n\nPlacing it after the products, not before, was deliberate. Someone who came to shop has already seen what's on offer; this band is for the person still deciding whether the brand is theirs."
      },
      {
        section: "Closing the Loop",
        body: "The bottom of the page answers the last doubt. Customer reviews run as a carousel, each with a verified mark and star rating, then a black call-to-action bar repeats the brand line. The footer stays plain: company, help, and FAQ links where people expect them.\n\n![Reviews, the final call to action, and a plain footer](/cases/rwdy-close.webp)"
      },
      {
        section: "The Visual System",
        body: "| Element | Choice | Why |\n|---|---|---|\n| Display type | Heavy, extended capitals | Matches the confidence of street fashion |\n| Body type | A clean sans-serif | Product names and prices stay easy to read |\n| Colour | Black, white, and warm off-white | Lets the clothes and photography carry the colour |\n| Badges | Stars, verified ticks, discount tags | Small trust signals beside the facts they support |\n| Photography | Full-bleed, people in motion | Sells the feeling, not just the garment |\nTable: A deliberately small system\n\nThe design is published [on Behance](https://www.behance.net/gallery/195847337/RWDY-Store-Revamping)."
      }
    ]
  },
  {
    slug: "billjot-design",
    title: "Billjot: A POS That Fits in Your Hand",
    type: "Product Design Case Study",
    heroDescription: "Designing and shipping a billing system for small Indian restaurants still running on old billing machines and notebooks: researched across 168 restaurants, redesigned for phones after the first test, and deployed in 8.",
    image: "/cases/oyb-v2.webp",
    meta: [
      { label: "Product", value: "Point-of-sale and billing system" },
      { label: "Role", value: "Research, design, development, and testing; solo on the first version" },
      { label: "For", value: "Family restaurants up to 3-star hotels" },
      { label: "Status", value: "Deployed in 8 restaurants, December 2024" }
    ],
    highlights: [
      { value: "168", label: "Restaurants surveyed across five towns" },
      { value: "24", label: "In-depth restaurant interviews" },
      { value: "8", label: "Restaurants running it" },
      { value: "₹6,200", label: "Per unit, hardware included" }
    ],
    content: [
      {
        section: "Overview",
        body: "Billjot is a point-of-sale system for small restaurants: the kind of busy, locally famous family place that still bills on an old machine and keeps tabs in a notebook. The goals were short: build a POS that fits in your hand, make it easy for anyone on staff, and let each restaurant shape it to how it works.\n\nI did it alone, as a freelance project in the final year of my B.Tech: the research, the design, the development, and the testing in real restaurants. It started life as Own Your Bill; today it's [Billjot](https://billjot.com), billing and point of sale for restaurants and shops across India.\n\n![Version 2, designed at a bakery owner's request: menu on the left, the bill on the right](/cases/oyb-v2.webp)"
      },
      {
        section: "Phase 1: The Story",
        body: "It started with an observation. A restaurant in the lunch rush: staff juggling orders, the kitchen shouting updates, and a cashier stuck with a frozen billing system. The owner muttered that he only wished it worked as smoothly as it should.\n\nThat scene wasn't unique, so I asked owners three questions: what are you using, where does it hurt, and why are you still using it?\n\n![What, where, and why: an old billing machine, three pain points, and three reasons nobody switches](/cases/oyb-discovery.webp)\n\n| Question | What owners said |\n|---|---|\n| What do you use? | An old-school billing machine, plus a notebook for tabs |\n| Where is the problem? | Issuing tokens, tallying wages and expenses, and counting orders: paper gets lost, and lost paper means stealing |\n| Why not switch? | **Cost**: modern systems run ₹30,000 or more. **Fear**: complex systems scare staff who worry about pressing the wrong button. **Inertia**: twenty years of doing it one way |\nTable: The first round of questions"
      },
      {
        section: "Phase 2: The Sherlock Holmes Part",
        body: "One restaurant isn't a market. I classified restaurant types the textbook way, about twenty of them from dhabas to tiffin centres, then grouped them by how they actually take orders and bill.\n\n| Major type | Includes | How they bill |\n|---|---|---|\n| Traditional and regional | Dhabas, ethnic restaurants, sweet shops, halwai shops | Regional food, often one bill at the end |\n| Modern and casual dining | Fine dining, casual dining, multi-cuisine, buffets, pubs and bars | Table service, many rounds per table |\n| Quick and on-the-go | Quick-service restaurants, food trucks, street food, tiffin services | Fast, high volume, often takeaway |\n| Speciality and cafés | Cafés, bakeries, seafood places, canteens | Counter orders, packaged goods |\nTable: Four groups, from about twenty restaurant types\n\nThen came the hard questions, asked the same way of each group: system reliability, ease of use, inventory, payments, role-based access, and custom features. Quick surveys covered **168 restaurants** across Vijayawada, Kakinada, Rajahmundry, Tuni, and Yanam, and in-depth interviews covered two dozen restaurants over 18 days."
      },
      {
        section: "Constraints and the Market",
        body: "The big players were already there: Petpooja, RanceLab, Posiflex, Vyapar, and Gofrugal. The target was everyone they priced out: basic, locally famous family restaurants up to 3-star hotels.\n\nI wrote down my own limits as plainly as the market's, because they shaped every decision after.\n\n| Constraint | What it meant |\n|---|---|\n| Money | No budget for travel, more research, or prototype hardware |\n| People | The first version was solo: research, design, build, and test |\n| Time | Final year of a B.Tech, so academics came first and travel was limited |\n| Market | Going against established products, so the audience had to be hooked from day one |\nTable: The ground reality, as I wrote it down"
      },
      {
        section: "The First Design, and What Testing Changed",
        body: "The first design was a desktop screen sketched on paper: table numbers down the side, items in a grid, the bill and a print button on the right.\n\n![The first sketch: table numbers, an item grid, and billing on the right, with an early phone layout below](/cases/oyb-sketch.webp)\n\nI released it and tested it in restaurants. The feedback was clear about where it worked and where it didn't.\n\n| Feedback | What I did |\n|---|---|\n| Good for traditional restaurants that bill at the end | Kept that flow exactly as it was |\n| Desktop version is good | Left it alone |\n| Bad on mobile | Made the phone view the focus of the next round |\n| They wanted something like Swiggy | Designed the phone flow around browsing and tapping items |\nTable: First-round feedback and the new plan"
      },
      {
        section: "Key Decision: Design for the Waiter's Phone",
        body: "Restaurants with table service don't bill at a counter; they take orders on the floor. So the phone flow became the main design: the waiter picks a table, adds items, and sends a temporary bill that becomes the kitchen order ticket. The counter sees every table's bill live, and prints when the table leaves.\n\n![The mobile flow: table, items, send bill, kitchen order ticket, live bills](/cases/oyb-workflow.svg)\n\nThe desktop layout was then rebuilt as an annotated wireframe for a takeaway restaurant with one user: logo and navigation on the left, categories and search on top, order cards in the middle, and a billing panel on the right. Current orders sit as cards along the bottom that you swipe through.\n\n![The annotated desktop wireframe for a single-user takeaway counter](/cases/oyb-wireframe.webp)\n\nA bakery owner then asked for a version of their own, and that became Version 2: categories as tabs, product photos, and the order panel always visible. The process followed a triple-diamond, user-centred approach: research, then experiment, then deliver, with a review loop at the end."
      },
      {
        section: "Phase 4: Deployment",
        body: "By 29 December 2024 the system was running in **8 restaurants**, the ones that had supported me from the start. Each deployment was software and hardware, at a making cost of ₹6,200 per unit, built on Next.js as a PWA, Node.js, and MongoDB, served from a Raspberry Pi in the restaurant.\n\nI tracked which features each restaurant actually used. That turned out to be the most useful design input of the whole project.\n\n![Feature use across the 8 restaurants: the core is universal, the extras are not](/cases/oyb-adoption.svg)\n\nThe core (offline mode, printing, inventory, analytics, sync, and access control) was used everywhere. The extras split the room: barcode scanning only mattered to places selling packaged goods, and tabs only to places with regulars. Nobody used the payment gateway, because every restaurant already had its own UPI; the virtual wallet and custom website went unused too."
      },
      {
        section: "What I Learned",
        body: "| Lesson | Where it came from |\n|---|---|\n| Fear is a design problem, not a training problem | Staff afraid of pressing the wrong button kept old machines running for twenty years |\n| Test early, even on paper | The first release showed the phone view mattered more than the desktop |\n| Customisation means turning things off | Most extras were used by three restaurants or fewer |\n| Don't rebuild what people already have | Every restaurant had UPI, so the payment gateway went unused |\nTable: Lessons from research to deployment\n\nThe full research board, with the interview tables and sketches, is [on FigJam](https://www.figma.com/board/iZoO9T4W3C4RwIUWZRbZsV/Case-Study?node-id=0-1)."
      }
    ]
  },
  {
    slug: "chaya-ui-design-system",
    title: "Chaya UI: A Data-First Component Library",
    type: "Open-Source Design System",
    heroDescription: "Contributing to Chaya UI, Traboda's open-source React component library: a data-first design system built on TypeScript, Tailwind CSS, and Radix, where my work focused on how the DataTable and Breadcrumb look and behave.",
    image: "/chaya.avif",
    meta: [
      { label: "Project", value: "Chaya UI by Traboda, GPL-3.0" },
      { label: "Role", value: "Contributor: design and front-end" },
      { label: "Stack", value: "React, TypeScript, Tailwind CSS, Radix, Storybook" },
      { label: "Contributed", value: "October 2023" }
    ],
    highlights: [
      { value: "50", label: "Components in the library" },
      { value: "8", label: "Hooks" },
      { value: "3", label: "Merged pull requests" },
      { value: "13", label: "Contributors to the project" }
    ],
    content: [
      {
        section: "Overview",
        body: "Chaya UI is Traboda's open-source component library for React, built so teams can ship SaaS applications with less code. It's documented in Storybook and open-sourced under GPL-3.0, and it's one of the projects where I worked alongside the people who created it, on design as well as code.\n\n![Chaya UI's introduction: a modern, data-first component library for React](/cases/chaya-intro.webp)\n\nThe library was started by Traboda's team in 2022; most of its code is theirs. My merged contributions are focused on two components, the DataTable and the Breadcrumb, described below."
      },
      {
        section: "The Philosophy",
        body: "Chaya's documentation opens with its principles, and they explain most of the design decisions inside it.\n\n| Principle | What it means in practice |\n|---|---|\n| The best developer experience | Less code downstream, minimal boilerplate, no surprises |\n| Data-first, no compositions | Components take lists and objects directly, without wrapper components or mapping |\n| The best ingredients | TypeScript, Tailwind CSS, Radix primitives, and class-variance-authority |\n| Maximum flexibility | Variants, props, and theming |\n| Do the heavy lifting | Accessibility, responsiveness, and performance built in |\n| Follow the standard | Names and props consistent with libraries like Chakra UI and Mantine |\nTable: Chaya's principles, from its documentation\n\nData-first is the one that matters most for a component like the DataTable: you hand it your rows and a column definition, and it renders, sorts, and styles them."
      },
      {
        section: "What's in the Library",
        body: "The library covers what a SaaS dashboard needs, with display and input components making up most of it.\n\n![50 components and 8 hooks, grouped by type](/cases/chaya-library.svg)"
      },
      {
        section: "My Contribution: Readable Tables",
        body: "Data tables are where dashboards live or die. Long rows of similar values are hard to scan, so the DataTable supports striping, and my first pull request reworked how striped rows and columns are coloured so the bands stay visible without fighting the content, including the theme colours in the Tailwind config.\n\n![Striped rows: alternate bands guide the eye across a wide row](/cases/chaya-rows.webp)\n\n![Striped columns: the same idea, vertically, for comparing values down a column](/cases/chaya-columns.webp)\n\n| Pull request | What changed |\n|---|---|\n| Fixed the rows and columns colours (#120) | Striped row and column colours in the DataTable, its stories, and the Tailwind theme |\n| Changes in the title bar (#121) | The DataTable's title bar and row styling |\n| Table colour (#122) | The Breadcrumb component and its stories |\nTable: Merged contributions, October 2023"
      },
      {
        section: "The Title Bar",
        body: "A table in a real product rarely stands alone: it needs a title, a search box, and a count. The DataTable's title bar holds those, and my second pull request reworked its layout and how it sits on top of the rows.\n\n![The DataTable with its manager: search on the left, the count on the right, then the rows](/cases/chaya-manager.webp)\n\n| Part | Job |\n|---|---|\n| Search box | Filter rows without leaving the table |\n| Count | Tells you how much is there, and how much matches |\n| Column headers | Sortable, with a quiet sort icon |\n| Rows | Links stay blue; everything else stays neutral |\nTable: Anatomy of a table with a title bar"
      },
      {
        section: "What I Took From It",
        body: "| Lesson | Why |\n|---|---|\n| Small changes in a shared system travel far | A row colour in a library shows up in every product that uses it |\n| Stories are the spec | Each change came with its Storybook stories, so reviewers could see it, not just read it |\n| Follow the system's principles | Data-first meant changing styling without changing how people pass in data |\nTable: Contributing to someone else's design system\n\nThe library and its documentation are at [chaya.traboda.com](https://chaya.traboda.com), and the code is [on GitHub](https://github.com/traboda/chaya)."
      }
    ]
  },
  {
    slug: "toothpaste-extension",
    title: "Toothpaste: Paste Anything, Straight to the Timeline",
    type: "Open-Source Tool",
    heroDescription: "Building a Premiere Pro and After Effects extension that turns copy and paste into an import: images, files, and links from the web land on the timeline without a trip through the Downloads folder.",
    image: "/toothpaste-panel-wide.png",
    meta: [
      { label: "Product", value: "Adobe CEP extension for Premiere Pro and After Effects" },
      { label: "Role", value: "Design and development, solo" },
      { label: "Stack", value: "CEP 11, ExtendScript, yt-dlp, FFmpeg" },
      { label: "Released", value: "Version 2.1, July 2026" }
    ],
    highlights: [
      { value: "1", label: "Keystroke from web to timeline" },
      { value: "1,000+", label: "Sites it can download from" },
      { value: "10", label: "Features in one small panel" },
      { value: "0", label: "Build steps to install" }
    ],
    content: [
      {
        section: "Overview",
        body: "Toothpaste is an extension for Premiere Pro 15+ and After Effects 18+. You copy an image, a file path, or a video link, press Ctrl+V in the panel, and the media lands on your timeline at the playhead.\n\n![The Toothpaste panel: paste or drop, two toggles, and advanced options folded away](/toothpaste-panel.png)\n\nThe name is the joke: it helps you squeeze every last drop of efficiency out of an edit, and keeps the timeline fresh. I built it for my own editing first."
      },
      {
        section: "The Problem: Death by a Thousand Clicks",
        body: "Every edit had the same loop, and none of its steps was hard. Together they broke the creative flow every time.\n\n| Step | What it costs |\n|---|---|\n| Find a reference on YouTube or Pinterest | Nothing; this is the fun part |\n| Download it | A browser tab, a save dialog, sometimes a converter site |\n| Lose it in Downloads | A minute of hunting through files named video (3).mp4 |\n| Import and drag it onto the timeline | Another dialog, another drag |\n| Remember the idea you had | Often, you don't |\nTable: The loop Toothpaste removes\n\nThe last row is the real cost. By the time the clip is on the timeline, the idea that made you want it has gone cold."
      },
      {
        section: "How a Paste Becomes a Clip",
        body: "The panel works out what you pasted and routes it. A local file or image goes straight in. A link goes through yt-dlp to download it, and animated GIFs and WebPs go through FFmpeg to become MP4s Premiere can actually use. Then ExtendScript, running inside Premiere, imports the file and places it at the playhead.\n\n![From paste to playhead: the panel, yt-dlp, FFmpeg, then ExtendScript inside Premiere](/cases/toothpaste-flow.svg)"
      },
      {
        section: "Key Decision: Simple by Default, Powerful When Asked",
        body: "The panel shows one instruction and two switches. Everything else, quality, a time range, and browser cookies, sits under Advanced Options, so the common case stays one keystroke.\n\n| Feature | Where it lives |\n|---|---|\n| Paste: images, file paths, or URLs | The whole panel is the target |\n| Drag and drop, including batches | The whole panel is the target |\n| Audio only, saved as MP3 | A switch, always visible |\n| Auto-place on the timeline | A switch, always visible |\n| Quality: highest, 1080p, or 720p | Advanced options |\n| Time range: download just a segment | Advanced options |\n| Browser cookies for restricted content | Advanced options |\n| GIF and WebP to MP4 | Automatic |\n| Recent history: the last 5 imports | Below the panel |\nTable: Ten features, two levels"
      },
      {
        section: "Version 2.1: Fixing What Users Hit",
        body: "The second version was mostly about removing friction the first one created.\n\n| In 2.0 | In 2.1 |\n|---|---|\n| Pasting a link started a download immediately, often by accident | A dedicated URL field and a Download button |\n| FFmpeg re-encoded every video, sometimes for 15+ minutes | Direct stream copying: seconds instead of minutes |\n| Downloads always fetched the whole video | Start and end times slice just the part you need |\n| Some downloads failed with an unsupported compression error | Requests H.264 and AAC, falling back from 4K VP9 or AV1 to 1080p H.264 |\n| Silent freezes on Initializing download | Errors reported in the progress bar |\n| Updates failed with Invalid Code Signature | The build reuses its certificate |\nTable: What changed in 2.1, from the changelog\n\nI [shared the launch on LinkedIn](https://www.linkedin.com/posts/satyasainagubathula_solodev-adobe-premierepro-ugcPost-7495183858833969152-TCKt), and the most common support question was FFmpeg missing, so the first fix for any trouble is [installing FFmpeg](https://ffmpeg.org/)."
      },
      {
        section: "Distribution",
        body: "Toothpaste ships as a pre-built .zxp on GitHub Releases. Install it with an extension manager and open it from Window → Extensions; there's no Node.js and no build step for users.\n\n![Toothpaste](/cases/toothpaste-logo.webp)\n\n| Piece | File |\n|---|---|\n| Extension manifest | CSXS/manifest.xml |\n| Panel interface and logic | index.html, js/main.js, css/style.css |\n| Premiere and After Effects side | jsx/host.jsx (ExtendScript) |\n| Packaging | build.js produces a signed .zxp |\nTable: A small, readable codebase that doubles as a CEP template\n\nThe code is ISC-licensed [on GitHub](https://github.com/nagubathula/toothpaste)."
      }
    ]
  },
  {
    slug: "engineerudu-community",
    title: "Engineerudu: A Home for Telugu Open Source",
    type: "Community and Platform",
    heroDescription: "Building Andhra Pradesh's first free and open-source software community, and the website that turns its idea into a path: learn, build, and grow with other Telugu engineers.",
    image: "/cases/eng-home.webp",
    meta: [
      { label: "Project", value: "Telugu open-source and engineering community" },
      { label: "Role", value: "Community builder; designed and built the site" },
      { label: "Stack", value: "Next.js, React, Tailwind CSS, shadcn" },
      { label: "Live", value: "engineerudu.com" }
    ],
    highlights: [
      { value: "1st", label: "Telugu open-source and engineering org" },
      { value: "3", label: "Steps: learn, build, grow" },
      { value: "3", label: "Starter open-source projects" },
      { value: "2", label: "Film cuts: widescreen and vertical" }
    ],
    content: [
      {
        section: "Overview",
        body: "Andhra Pradesh has plenty of engineering talent, but it had no home for open source. Engineerudu is the state's first free and open-source software community: a place for local developers to learn in public, contribute to real projects, and find each other.\n\n![The home page: Building the future of Telugu engineering](/cases/eng-home.webp)\n\nCommunity building is unglamorous open source: organising people rather than code. The website is the front door to that work."
      },
      {
        section: "The Gap Between College and Real Work",
        body: "The people Engineerudu is for are mostly students and early-career engineers. Their problem isn't talent; it's a missing bridge.\n\n| What college gives you | What real engineering needs | What Engineerudu offers |\n|---|---|---|\n| A syllabus | Industry-standard tools and practices | Courses built for the modern stack |\n| Solo assignments | Collaboration and code review | Open-source projects to contribute to |\n| A degree | A portfolio and a network | Reviewed work and other engineers to learn from |\nTable: The bridge the community builds"
      },
      {
        section: "Key Decision: A Path, Not a Pile of Links",
        body: "Community sites often become a list of resources. I designed Engineerudu's home page around a sequence instead: learn, build, grow. Each step leads to a page, and each page leads to the next step.\n\n![Here's how it works: learn, build, grow](/cases/eng-journey.webp)\n\n| Step | What it means | Where it goes |\n|---|---|---|\n| 01 Learn | Documentation and courses built for modern standards | Courses |\n| 02 Build | Real open-source projects, practice straight away | Projects |\n| 03 Grow | Code review, other engineers, career growth | GitHub and the community |\nTable: The journey on the home page"
      },
      {
        section: "Courses",
        body: "The courses page promises to bridge the gap between the college syllabus and real engineering. The first course is SQL and relational databases: 25 hours from beginner to intermediate, built around a 30-day masterclass with interactive queries.\n\n![Upskill for the real world: the courses page](/cases/eng-courses.webp)"
      },
      {
        section: "Projects",
        body: "The best way to learn is by doing, so the projects page lists starter projects with their stack and a Contribute button that goes straight to the code.\n\n![Open-source projects, each with its stack and a way in](/cases/eng-projects.webp)\n\n| Project | What it is | Stack |\n|---|---|---|\n| Engineerudu Portal | The community's own platform | Next.js, TypeScript, Tailwind CSS |\n| Telugu Tech Dictionary | Technical jargon translated into accessible Telugu | React, Node.js, MongoDB |\n| Student Portfolio Template | A portfolio template for engineering students | HTML, CSS, JavaScript, Vite |\nTable: Starter projects, chosen so beginners have somewhere to start"
      },
      {
        section: "Telling the Story",
        body: "A community needs a story people want to share. I made a short cinematic film for Engineerudu, about engineers breaking boundaries, open-source hacking, and community across Telugu-speaking regions, in a widescreen cut and a vertical cut for Reels and Shorts.\n\n![The Engineerudu film, widescreen cut](/aivideos/engineerudu_horizontal.mp4)\n\nThe site itself is built with Next.js and Tailwind, with a serif display face that gives the community a warmer, more editorial voice than a typical developer site, and it holds up on a phone.\n\n![The home page on a phone](/cases/eng-mobile.webp)"
      }
    ]
  },
  {
    slug: "compatriot-hardware-security",
    title: "CompatrIoT: Learn Hardware Security by Attacking a Real Board",
    type: "Open-Source Hardware",
    heroDescription: "An open-source hardware security training platform: one board with an STM32 and an ESP32, and twenty gamified labs that walk from finding a UART port to cracking a Bluetooth key.",
    image: "/gallery/compatriot-board.jpg",
    meta: [
      { label: "Product", value: "Hardware security training board and labs" },
      { label: "Hardware", value: "STM32 and ESP32 microcontrollers" },
      { label: "Audience", value: "Security researchers, hobbyists, and students" },
      { label: "Licence", value: "Open hardware, firmware, and docs" }
    ],
    highlights: [
      { value: "20", label: "Gamified labs" },
      { value: "5", label: "Protocols: UART, JTAG/SWD, I2C, SPI, BLE" },
      { value: "2", label: "Microcontrollers on one board" },
      { value: "1", label: "Board instead of a shelf of dev kits" }
    ],
    content: [
      {
        section: "Overview",
        body: "Most people learn hardware security from slides. CompatrIoT is a physical, open-source training board that you attack for real, built for security researchers, hobbyists, and students.\n\n![The CompatrIoT demo: the board, probing it, and capturing its signals](/videos/compatriot-demo.mp4)\n\nIt compresses what usually takes a shelf of development boards and scattered CTF challenges into one board with a structured learning path."
      },
      {
        section: "What's on the Board",
        body: "Two microcontrollers give the board broad protocol coverage, and the targets around them turn every classic hardware attack into something you can practise.\n\n![Hands on the board: every target is reachable with a probe](/cases/compatriot-hands.webp)\n\n| Component | What you do with it |\n|---|---|\n| STM32 microcontroller | Debug ports, firmware extraction, and patching |\n| ESP32 microcontroller | Bluetooth Low Energy attacks |\n| SPI flash | Sniff the bus and extract firmware |\n| I2C EEPROM and sensors | Reconnaissance, sniffing, and memory dumps |\n| JTAG/SWD debug ports | Pinout discovery and full control of the chip |\n| USB serial console | The lab console and UART exercises |\n| Programmable LEDs | Visible proof that you changed the hardware's behaviour |\nTable: Every target has a lesson attached"
      },
      {
        section: "Twenty Labs, One Path",
        body: "The labs run from first contact to full compromise, one protocol at a time, with difficulty rising as you go.\n\n![Twenty labs across five protocols](/cases/compatriot-labs.svg)"
      },
      {
        section: "The Lab Console",
        body: "Every lab is played through a terminal-native console: the list of labs on the left, the current challenge and its objective on the right. It feels like the tools security people already use, and it keeps the focus on the hardware.\n\n![The lab console: twenty labs, and a JTAG challenge to control the GPIOs](/cases/compatriot-console.webp)\n\nA JTAG lab, for example, asks you to use the debug port to drive the microcontroller's GPIOs and change the LED patterns: you see on the board that you've taken control."
      },
      {
        section: "Seeing the Signals",
        body: "Hardware attacks are invisible until you capture them. The labs pair the board with a logic analyser, so sniffing a bus means watching real traffic, decoding it, and pulling secrets out of it.\n\n![A logic analyser capture of the board's bus traffic](/cases/compatriot-analyzer.webp)\n\n| Skill | How the labs teach it |\n|---|---|\n| Finding interfaces | Identify ports and pinouts on real hardware |\n| Sniffing | Capture I2C, SPI, and BLE traffic and decode it |\n| Extraction | Dump memory and firmware from real chips |\n| Exploitation | Patch firmware, take over GPIOs, crack a BLE key |\nTable: From reading signals to owning the device"
      },
      {
        section: "Why It's Open",
        body: "The hardware designs, firmware, and documentation are all open, so anyone can build the board, extend the labs, or teach with it.\n\n![The CompatrIoT labs](/gallery/compatriot-labs.jpg)\n\n| Without CompatrIoT | With CompatrIoT |\n|---|---|\n| A shelf of different dev boards | One board |\n| Scattered CTF challenges | Twenty labs in order |\n| Slides about attacks | Attacks on real hardware |\n| Closed training kits | Open designs anyone can build |\nTable: What one open board replaces"
      }
    ]
  },
  {
    slug: "contentflow-platform",
    title: "ContentFlow: Running a Five-Language Content Operation",
    type: "Internal Platform",
    heroDescription: "The internal platform behind a multi-language video operation: 30+ role-based dashboards and an eight-stage pipeline from script to posted video, plus a live analytics command centre — YouTube data, thumbnail click-through, and velocity alerts — all under one set of permissions.",
    image: "/cases/contentflow-hero.webp",
    meta: [
      { label: "Product", value: "Content operations and analytics platform" },
      { label: "Role", value: "Design and build" },
      { label: "Languages", value: "Telugu, Hindi, Tamil, Marathi, Kannada" },
      { label: "Stack", value: "React, PostgreSQL, REST APIs, YouTube Data API" }
    ],
    highlights: [
      { value: "30+", label: "Role-based dashboards" },
      { value: "8", label: "Pipeline stages" },
      { value: "2,000+", label: "Videos orchestrated" },
      { value: "100K+", label: "Followers on channels it runs" }
    ],
    content: [
      {
        section: "Overview",
        body: "Producing content at scale across YouTube and Instagram in five languages means dozens of people touching every video: writers, voice artists, editors, designers, and managers. Then, once a video is live, someone has to read what it did. Spreadsheets and chat threads survive neither job. ContentFlow is the internal platform I built to run the whole operation in one place — the production work, and the numbers that follow it.\n\nThe team knows the analytics side as Content Nexus. It isn't a separate tool but the command centre inside the same platform, sharing one login, one set of roles, and one set of permissions.\n\n| Language | Language | Language | Language | Language |\n|---|---|---|---|---|\n| Telugu | Hindi | Tamil | Marathi | Kannada |\nTable: Every video can exist in five languages, each with its own team"
      },
      {
        section: "The Pipeline",
        body: "Every piece of content moves through eight stages, from the first draft of the script to the posted video — Script, Review, Voice Over, Audio Cut, Raw Upload, Editing, Ready, Posted. Each stage has an owner, and every handoff is recorded instead of lost in chat.\n\n![Eight stages from script to posted](/cases/contentflow-pipeline.svg)\n\nThe pipeline is visible on a shared content calendar, filterable by channel and by status, so anyone can see what's stuck and where."
      },
      {
        section: "Key Decision: A Dashboard per Job",
        body: "One dashboard trying to serve everyone ends up serving no one: a voice artist doesn't need channel analytics, and a manager doesn't need the recording queue. So ContentFlow ships 30+ purpose-built views, and each role sees exactly the screens, actions, and data its job needs.\n\n| Role | What they need from the platform |\n|---|---|\n| Writer | Scripts to write and review notes |\n| Voice Artist | Scripts ready to record and studio slots |\n| Editor and Editing Manager | Raw uploads to edit, and what's due |\n| Graphic Designer | Thumbnails and assets to make |\n| Manager | Status across the pipeline and the team |\n| Central Team and Admin | Every channel and language, and roles |\nTable: A few of the roles, each with its own views"
      },
      {
        section: "Access by Role, Language, and Region",
        body: "Role-based access control decides what each person can see and do, and everything is also scoped by language and region. A Telugu editor sees Telugu work; a Hindi manager sees Hindi channels. The same permission model carries straight into the analytics side, which is why outside collaborators can be let into the numbers without being let into everything.\n\n| Scope | What it limits |\n|---|---|\n| Role | Which screens and actions a person has |\n| Language | Which language's content they work on |\n| Region | Which channels and teams they see |\nTable: Three layers of access"
      },
      {
        section: "The Analytics Command Centre",
        body: "Once a video is posted, the platform stops tracking work and starts tracking performance. The YouTube Data API feeds a PostgreSQL store, the platform tracks thumbnail click-through, and it watches each video's velocity for anomalies — flagging a video that's suddenly taking off, or stalling, instead of waiting for someone to notice.\n\n![From the YouTube API to tiered dashboards](/cases/contentnexus-flow.svg)\n\n| Capability | What it does |\n|---|---|\n| Live YouTube data | Channel and video metrics through the YouTube Data API |\n| Thumbnail CTR tracking | Automatic click-through tracking for every thumbnail |\n| Velocity anomaly alerts | Flags videos whose growth suddenly changes |\n| Permission tiers | Separates internal teams from outside collaborators |\nTable: One command centre instead of a dozen YouTube Studio tabs"
      },
      {
        section: "Key Decision: Permissions as a First-Class Feature",
        body: "Most analytics tools treat sharing as an afterthought. This operation runs with internal teams and external collaborators side by side, so permission tiers are built into every view rather than bolted on. The numbers a partner can see are a property of their tier, not a report someone remembers to redact.\n\n| Who | What they get |\n|---|---|\n| Internal team | The full picture across channels and languages |\n| External collaborators | Only what their tier allows |\nTable: Strict permission tiers, by design"
      },
      {
        section: "Around the Pipeline",
        body: "| System | What it does |\n|---|---|\n| Content calendar | Every video on one calendar, filtered by channel and status |\n| Channel analytics | Performance across channels, including live YouTube data |\n| Studio booking | Recording slots for voice artists |\n| Team management | Roles and access for every member |\nTable: The supporting systems"
      },
      {
        section: "Impact",
        body: "ContentFlow is the operational backbone behind more than 2,000 videos and channels grown past 100,000 followers, with every handoff between roles tracked instead of lost in chat — and every posted video measured in the same place it was made.\n\n| Before | After |\n|---|---|\n| Spreadsheets and chat threads | One platform |\n| Handoffs lost in messages | Every handoff recorded |\n| Everyone sees everything | Each role sees its own work |\n| Status by asking around | Status on a shared calendar |\n| Numbers in scattered YouTube Studio tabs | One analytics command centre |\nTable: What changed for the team\n\nContentFlow is an internal platform, so there's no public build or source to link to."
      }
    ]
  },
  {
    slug: "autoedit-tool",
    title: "AutoEdit: Animated Typography Without Keyframes",
    type: "Internal Tool",
    heroDescription: "An internal web studio that turns a voiceover into animated typography and infographics: Whisper times every word, Gemini picks what to highlight, and the result exports straight into a video editor.",
    image: "/cases/autoedit-hero.webp",
    meta: [
      { label: "Product", value: "Internal animation studio" },
      { label: "Role", value: "Design and build" },
      { label: "Stack", value: "Python, React, Whisper, Gemini" },
      { label: "Users", value: "The in-house video team" }
    ],
    highlights: [
      { value: "100s", label: "Of animated assets needed every week" },
      { value: "60", label: "Frames per second, rendered in the browser" },
      { value: "1", label: "Click to export into the editor" },
      { value: "0", label: "Manual keyframes" }
    ],
    content: [
      {
        section: "The Problem",
        body: "Content at scale needs hundreds of animated typography and infographic assets every week. Making each one by hand in After Effects, keyframe by keyframe, turned motion graphics into the bottleneck of the whole production.\n\n| Step by hand | Why it doesn't scale |\n|---|---|\n| Listen and mark where each word lands | Repeated for every line of every video |\n| Decide which words to emphasise | A judgement call, made hundreds of times a week |\n| Keyframe the type to match | Slow, fiddly, and easy to get out of sync |\n| Export and import into the edit | Another handoff per asset |\nTable: The manual loop AutoEdit replaces"
      },
      {
        section: "How It Works",
        body: "AutoEdit automates the loop end to end. Whisper aligns every spoken word to its exact time, Gemini reads the meaning and picks the keywords worth highlighting, and the studio renders the animation as SVG and Canvas at 60 frames per second.\n\n![From voiceover to the edit: Whisper, Gemini, animation, export](/cases/autoedit-flow.svg)"
      },
      {
        section: "Key Decision: Split Timing From Meaning",
        body: "The two hard parts of kinetic typography are different problems, so each gets the tool that's good at it.\n\n| Problem | Tool | Why |\n|---|---|---|\n| When is each word said? | Whisper | Word-level timing from the audio itself, so type lands on the beat |\n| Which words matter? | Gemini | A semantic read of the script, so emphasis follows meaning |\n| How should it move? | The studio | SVG and Canvas animation, consistent across every asset |\nTable: Timing, meaning, and motion, each solved once"
      },
      {
        section: "The Result",
        body: "An editor drops in a voiceover and gets animated typography back, timed to the speech, ready to export into their video editor in one click.\n\n| Before | After |\n|---|---|\n| Keyframing every asset in After Effects | Generated from the voiceover |\n| Emphasis chosen word by word | Keywords picked automatically |\n| Motion graphics as the bottleneck | Motion graphics keep pace with the edit |\nTable: What changed for the team\n\nAutoEdit is an internal tool, so there's no public build or source to link to."
      }
    ]
  },
  {
    slug: "whattheprompt-tool",
    title: "WhatThePrompt: Consistent AI Video, Scene After Scene",
    type: "Internal Tool",
    heroDescription: "A web app that replaces ad-hoc prompting with parameterised presets, so a multi-scene AI video keeps the same style, lighting, and camera from the first shot to the last.",
    image: "/cases/whattheprompt-hero.webp",
    meta: [
      { label: "Product", value: "Prompt preset platform for AI video and images" },
      { label: "Role", value: "Design and build" },
      { label: "Stack", value: "Next.js, ComfyUI, Supabase" },
      { label: "Users", value: "The creative team" }
    ],
    highlights: [
      { value: "1", label: "Shared formula per look" },
      { value: "3", label: "Things kept consistent: style, light, camera" },
      { value: "0", label: "Seeds lost between sessions" },
      { value: "1", label: "Browser tab to preview in" }
    ],
    content: [
      {
        section: "The Problem",
        body: "Keeping visual style, lighting, and camera seeds consistent across a multi-scene AI video is notoriously hard. When everyone prompts their own way, scene four doesn't look like scene one, and nobody can say which seed made the good take.\n\n| What breaks | Why |\n|---|---|\n| Style drifts between scenes | Each prompt is written fresh |\n| Lighting doesn't match | Small wording changes shift the whole look |\n| Good takes can't be reproduced | The seed wasn't saved |\n| Every person prompts differently | No shared formula across the team |\nTable: The cost of ad-hoc prompting"
      },
      {
        section: "How It Works",
        body: "WhatThePrompt enforces parameterised prompt formulas and node recipes across the creative team. You pick a preset, fill in its parameters, and the matching ComfyUI workflow runs; the seed goes into Supabase, and the preview renders straight in the browser.\n\n![From preset to preview: parameters, ComfyUI, the seed in Supabase](/cases/whattheprompt-flow.svg)"
      },
      {
        section: "Key Decision: Formulas, Not Free Text",
        body: "The core idea is that a look is a formula with blanks, not a paragraph someone retypes.\n\n| Ad-hoc prompting | A WhatThePrompt preset |\n|---|---|\n| A paragraph, rewritten each time | A fixed formula with named parameters |\n| Settings chosen per person | A shared ComfyUI node recipe |\n| Seeds in someone's notes, if anywhere | Seed history stored in Supabase |\n| Preview after a full render elsewhere | Preview in the browser |\nTable: What a preset standardises"
      },
      {
        section: "The Result",
        body: "| For the team | What it means |\n|---|---|\n| Consistency | Scenes in one video share a look by default |\n| Reproducibility | Any good take can be traced back to its seed |\n| Speed | People fill in parameters instead of writing prompts |\nTable: What changed\n\nWhatThePrompt is an internal tool, so there's no public build or source to link to."
      }
    ]
  },
  {
    slug: "wa-guardian-extension",
    title: "WA-Guardian: Scam Warnings Before the Click",
    type: "Browser Extension",
    heroDescription: "A real-time browser extension that spots phishing, impersonation, and malicious links in community chats and warns people before they click, without sending their messages anywhere.",
    image: "/cases/waguardian-hero.webp",
    meta: [
      { label: "Product", value: "Browser extension for chat safety" },
      { label: "Role", value: "Design and build" },
      { label: "Stack", value: "JavaScript, browser extension, on-device ML" },
      { label: "Privacy", value: "No personal data leaves the device" }
    ],
    highlights: [
      { value: "0", label: "Messages sent to a server" },
      { value: "Real-time", label: "Scanning as messages render" },
      { value: "3", label: "Threats: phishing, impersonation, malicious links" },
      { value: "1", label: "Warning, before the click" }
    ],
    content: [
      {
        section: "The Problem",
        body: "Community chats are where scams spread fastest: a phishing link, an impersonated admin, a too-good offer. By the time someone reports it, people have already clicked. The goal was to warn people in real time, before they click.\n\n| Threat | What it looks like |\n|---|---|\n| Phishing | Links to pages that steal logins or payments |\n| Impersonation | Messages pretending to be someone trusted |\n| Malicious links | URLs that lead somewhere harmful |\nTable: What WA-Guardian looks for"
      },
      {
        section: "How It Works",
        body: "The extension scans the chat page as messages render, checks links with on-device heuristics, scores suspicious patterns with a lightweight classifier, and shows a warning before the click.\n\n![From chat page to warning, entirely on the device](/cases/waguardian-flow.svg)"
      },
      {
        section: "Key Decision: Everything Stays on the Device",
        body: "A safety tool that reads your chats has to earn trust. So nothing is uploaded: the URL checks and the classifier both run locally, and suspicious patterns are flagged without transmitting personal data.\n\n| Approach | Trade-off |\n|---|---|\n| Send messages to a server to check | More powerful models, but your chats leave your device |\n| Check everything on the device | Lighter models, and your chats stay yours |\nTable: Why WA-Guardian chose on-device"
      },
      {
        section: "Protection Engine",
        body: "| Layer | Job |\n|---|---|\n| DOM scanning | Reads messages as they appear, with no delay |\n| URL heuristics | Checks links against known risky patterns, on the device |\n| Lightweight classifier | Scores messages for suspicious patterns |\n| Warning | Tells the person before they click |\nTable: Four layers, all local\n\nWA-Guardian is an internal tool, so there's no public build or source to link to."
      }
    ]
  },
  {
    slug: "apspcl-website",
    title: "APSPCL: A Government Site People Can Navigate",
    type: "Public Sector Website",
    heroDescription: "Designing and building the website for the Andhra Pradesh Solar Power Corporation, where tenders, notices, policies, and reports have to be easy to find for citizens, vendors, and officials alike.",
    image: "/cases/apspcl-home.webp",
    meta: [
      { label: "Client", value: "Andhra Pradesh Solar Power Corporation Pvt. Ltd." },
      { label: "Role", value: "Design and build" },
      { label: "Audience", value: "Citizens, vendors, and government stakeholders" },
      { label: "Status", value: "Live at apspcl.ap.gov.in" }
    ],
    highlights: [
      { value: "12", label: "Top-level menu items" },
      { value: "16", label: "Quick links to related bodies" },
      { value: "4", label: "Visitor groups the menu is built around" },
      { value: "2", label: "Layouts: desktop and phone" }
    ],
    content: [
      {
        section: "Overview",
        body: "APSPCL is a joint venture of the Government of Andhra Pradesh and the Government of India, behind some of the country's largest solar parks, including the 1,500 MW Ananthapuramu and 1,000 MW Kadapa ultra mega solar parks. Its website is where contractors find tenders, citizens read about the parks, and officials publish notices and reports.\n\nOn a government site, clarity and reliability matter more than decoration. The job was to take dense, constantly updated information and organise it so every kind of visitor finds their part quickly.\n\n![The home page: identity, navigation, latest news, and active tenders above the fold](/cases/apspcl-home.webp)"
      },
      {
        section: "Three Audiences, One Site",
        body: "Most government sites are organised around the department's structure. Visitors don't think that way; they come with a task. I started from who visits and what they came to do.\n\n| Visitor | What they came to do | Where they go |\n|---|---|---|\n| Contractor or vendor | Find an open tender before the deadline | Active tenders on the home page, then Tenders |\n| Citizen or journalist | Understand what APSPCL is and what it builds | About, Background, Solar Parks, Gallery |\n| Official or regulator | Check policies, filings, and reports | Solar Policies, Financials, Downloads |\n| Anyone asking questions | File an RTI request or get in touch | RTI and Contact Us |\nTable: Organised by task, not by department"
      },
      {
        section: "Information Architecture",
        body: "That turned into a single menu of twelve items, grouped in practice into three jobs: learning about the corporation, doing business with it, and holding it to account. A quick-links panel connects out to sixteen related bodies, from the Ministry of New and Renewable Energy to the state distribution companies and the e-procurement portal, so the site doesn't have to duplicate what they publish.\n\n![The menu grouped by who it serves](/cases/apspcl-map.svg)"
      },
      {
        section: "Key Decision: Tenders on the Home Page",
        body: "Tenders are the most time-sensitive thing on the site, and the most common reason a vendor visits. So the latest public and active tenders sit right on the home page, beside the latest news, each with its full notice number, a one-line description, the upload date, and a View Tender button.\n\n![Active tenders and leadership, with quick links down the side](/cases/apspcl-tenders.webp)\n\nA contractor can scan for their kind of work and open the right notice without learning the site. The full archive still lives under Tenders for anyone who needs history."
      },
      {
        section: "Building Trust",
        body: "A public body's site has to show who is accountable. The home page carries the corporation's identity as a joint venture, its leadership, a plain-language explanation of the national solar park scheme, and its vision and mission. The award gallery and full corporate and correspondence addresses close the page.\n\n![About APSPCL, with the scheme explained and an award gallery below](/cases/apspcl-about.webp)\n\n| Trust signal | Why it's there |\n|---|---|\n| Government and joint-venture identity in the header | Visitors know immediately this is the official site |\n| Leadership with names and titles | Accountability has a face |\n| The scheme in plain language | Citizens understand what the corporation is for |\n| Awards and both office addresses | Proof of work, and a way to reach a person |\nTable: What the home page does beyond navigation"
      },
      {
        section: "Every Visitor, Every Device",
        body: "A public site has to work for everyone, including people checking a tender on their phone. On small screens the twelve-item menu collapses behind one button, the identity block stacks, and news and tenders follow in a single column, so the most important content is still the first thing you reach.\n\n![The same home page on a phone: identity, one menu button, then news and tenders](/cases/apspcl-mobile.webp)\n\nThe site is live at [apspcl.ap.gov.in](https://apspcl.ap.gov.in)."
      }
    ]
  },
  {
    slug: "bsides-kochi-website",
    title: "BSides Kochi: A Conference Site With Hacker Culture",
    type: "Event Website",
    heroDescription: "Designing and building the website for BSides Kochi, a community-run cybersecurity conference, so one site can sell the event to attendees, brief sponsors and volunteers, and carry the community's identity.",
    image: "/cases/bsides-home.webp",
    meta: [
      { label: "Client", value: "BSides Kochi" },
      { label: "Role", value: "Design and build" },
      { label: "Audience", value: "Attendees, speakers, sponsors, volunteers" },
      { label: "Status", value: "Live at bsideskochi.in" }
    ],
    highlights: [
      { value: "4", label: "Audiences, each with its own page" },
      { value: "2", label: "CTF competitions" },
      { value: "3", label: "Hands-on villages" },
      { value: "1", label: "Register button, on every page" }
    ],
    content: [
      {
        section: "Overview",
        body: "BSides Kochi is part of Security BSides, the global family of community-led cybersecurity conferences, known as conferences by the community, for the community. Its website has several jobs at once: sell the event to attendees, inform speakers, sponsors, and volunteers, and carry an identity that feels like the hacker scene without being hard to read.\n\n![The home page: Kathakali, the event name, a countdown, and one Register button](/cases/bsides-home.webp)\n\nThe hero puts a Kathakali face, Kerala's classical dance-drama, against a dark terminal-style background. It says Kochi and security in one image."
      },
      {
        section: "One Site, Four Audiences",
        body: "Every visitor wants something different from a conference site, so each audience got its own page and a place in the top navigation.\n\n| Audience | What they need | Page |\n|---|---|---|\n| Attendees | Dates, venue, what happens, and how to register | Home, Schedule, Villages, CTF, Register |\n| Speakers | How to submit a talk | CFP |\n| Sponsors | Why to sponsor and what they get | Sponsor Us |\n| Volunteers | Shifts, rules, and logistics | Volunteer |\nTable: Navigation built around who is visiting"
      },
      {
        section: "Key Decision: Explain the Event, Not Just List It",
        body: "Many people coming to a BSides are students and newcomers. Words like village and CTF mean nothing to them, so the inner pages explain each format before listing anything.\n\n![The Villages page: what a hacking village is, then each village](/cases/bsides-villages.webp)\n\n| Activity | What the page explains |\n|---|---|\n| Hacking Village | Hands-on learning through exercises, demos, and competitions |\n| Lock Pick Village | Physical security: how locks fail, starting with single-pin picking |\n| Soldering Village | Learn to solder by assembling a conference badge to take home |\n| Shakthi CTF | A women-only CTF across cryptography, reverse engineering, web security, OSINT, and cloud security, in teams of one or two |\n| Hardware CTF | A hardware-focused competition |\nTable: Each format explained before it's listed"
      },
      {
        section: "Capture the Flag",
        body: "The CTF page does the same: it explains what a CTF is and why it teaches teamwork as well as skill, then introduces both competitions. Shakthi CTF gets the most space, with its challenge areas and team sizes listed plainly, because a women-only CTF is a reason in itself for some people to attend.\n\n![The CTF page: what a CTF is, then the two competitions](/cases/bsides-ctf.webp)"
      },
      {
        section: "Sponsors and Volunteers",
        body: "Sponsors and volunteers are the people who make a community event possible, so they get pages written for them rather than a contact form. The sponsor page leads with reasons to sponsor (investing in security's future, building relationships, brand visibility, leads, and custom packages), then shows what sponsorship looks like in practice.\n\n![The Sponsor Us page: reasons first, then what sponsorship includes](/cases/bsides-sponsor.webp)\n\nThe volunteer page is just as direct: registration dates, a minimum of one full 10-hour day in two 5-hour shifts, meals and accommodation, setup and teardown times, and how to swap shifts to attend a talk."
      },
      {
        section: "The Visual System and Mobile",
        body: "| Element | Choice |\n|---|---|\n| Background | Near-black navy with falling-code texture on page headers |\n| Accent | One bright blue, used for the word Kochi and section headings |\n| Type | A geometric sans-serif for headings, a clean sans for body text |\n| Calls to action | A single white Register pill, always in the top bar |\nTable: Hacker culture, kept legible\n\nOn a phone the navigation folds into one menu button, and the hero keeps the name, date, venue, countdown, and Register button in one screen.\n\n![The home page on a phone](/cases/bsides-mobile.webp)\n\nThe site is live at [bsideskochi.in](https://bsideskochi.in/)."
      }
    ]
  },
  {
    slug: "bi0s-hardware-website",
    title: "bi0s Hardware: A Web Identity for a Security Team",
    type: "Organisation Website",
    heroDescription: "Designing the website for bi0s Hardware, the hardware security wing of team bi0s, one of India's top-ranked CTF teams, with a terminal-inspired look that stays clean and readable.",
    image: "/bi0shardware.png",
    meta: [
      { label: "Client", value: "Team bi0s Hardware, Amrita University" },
      { label: "Role", value: "Design; the code was built by the bi0s team" },
      { label: "Audience", value: "Students, the security community, recruiters" },
      { label: "Archived", value: "December 2022; the domain has since lapsed" }
    ],
    highlights: [
      { value: "5", label: "Pages: home, about, members, research, contact" },
      { value: "1", label: "Monospace typeface sets the tone" },
      { value: "2", label: "Themes: dark and light" },
      { value: "1", label: "Sentence that explains the team" }
    ],
    content: [
      {
        section: "Overview",
        body: "Team bi0s is a student-run cybersecurity club at Amrita University and one of India's top-ranked CTF teams. bi0s Hardware is its hardware security wing: mentors train freshers through CTFs, run infosec events and trainings, and work on research in hardware and embedded security.\n\nThe website had to reflect that technical depth to students thinking about joining, to the wider community, and to anyone looking at the team's research.\n\n![bi0s Hardware](/bi0shardware.png)"
      },
      {
        section: "Key Decision: Look Like a Terminal, Read Like a Page",
        body: "Security culture lives in terminals, so the site borrows that world: a deep navy background, monospace type, and a glowing title. But it stops there. The body copy is set wide and calm, there's one button, and nothing animates for its own sake.\n\n![The home page, as archived in December 2022](/cases/bi0s-home.webp)\n\n| Choice | Why |\n|---|---|\n| Monospace type throughout | Instantly reads as security and code |\n| Deep navy, not pure black | Easier on the eyes for long reading |\n| A theme toggle in the navigation | Visitors choose dark or light |\n| One sentence, one button on the home page | Says who the team is and how to reach them |\nTable: A security aesthetic, kept readable"
      },
      {
        section: "Structure",
        body: "| Page | What it holds |\n|---|---|\n| Home | Who the team is, in one paragraph, and a contact button |\n| About | The team's story and how it trains new members |\n| Members | The people in the team |\n| Research | Projects and achievements |\n| Contact | Email and social links |\nTable: Five pages, one job each\n\nThe footer carries email, Twitter, GitHub, and LinkedIn icons, because that's where security people actually find each other."
      },
      {
        section: "A Note on the Archive",
        body: "The bi0shardware.com domain has since lapsed. The Internet Archive kept a copy of the home page from December 2022, which is the screenshot above; the inner pages weren't archived, so their descriptions here come from the site's navigation rather than screenshots.\n\n| What survives | Source |\n|---|---|\n| Home page design and copy | Internet Archive, 2 December 2022 |\n| Navigation and page list | The archived home page |\n| Hardware visual | This portfolio's gallery |\nTable: What this case study is based on"
      }
    ]
  },
  {
    slug: "graphic-design-work",
    title: "Graphic Design: Typography Doing the Heavy Lifting",
    type: "Graphic Design Collection",
    heroDescription: "A running collection of posters, event artwork, and social creatives for conferences, CTFs, festivals, and brands, where each piece adapts to its event while hierarchy and type carry the message.",
    image: "/wiredctf.png",
    meta: [
      { label: "Work", value: "Posters, event identities, social creatives" },
      { label: "Clients", value: "Security events, student groups, brands" },
      { label: "Formats", value: "Print, web, and social" },
      { label: "Range", value: "CTFs, workshops, festivals, food, and products" }
    ],
    highlights: [
      { value: "8+", label: "Posters in the gallery" },
      { value: "3", label: "Formats: print, web, social" },
      { value: "1", label: "Job per poster" },
      { value: "1", label: "Rule: type stays out of the subject" }
    ],
    content: [
      {
        section: "Overview",
        body: "Alongside product work I design graphics for events and organisations: cybersecurity conference identities, CTF artwork, festival posters, and social media creatives. Each piece takes on its event's identity, but the method is the same every time: decide the one thing the poster must do, then let typography and hierarchy do the heavy lifting.\n\n![WiRED CTF artwork](/wiredctf.png)"
      },
      {
        section: "Security Events",
        body: "Security events need artwork that feels like the scene without becoming unreadable noise. The hardware hacking workshop poster has one job: get people into the room.\n\n![Hardware Hacking: tight type, high contrast, one job](/gallery/hardware-hacking.jpg)\n\n| Piece | The one job |\n|---|---|\n| WiRED CTF | Give a competition an identity people remember |\n| Hardware Hacking workshop | Get people into the room |\nTable: Event artwork"
      },
      {
        section: "Festivals and Culture",
        body: "Festival posters carry a lot of colour and emotion, which makes hierarchy harder, not easier. The work is in keeping that colour in a quiet structure so the date and place still read first.\n\n![Ugadi: festival colour held in a quiet hierarchy](/gallery/ugadi.jpg)\n\n| Piece | The approach |\n|---|---|\n| Trip South Festival | Portrait, type, and colour locked into one vertical system |\n| Ugadi | Festival colour held in a quiet hierarchy |\n| Christmas Calendar | The grid is the illustration |\n| Michael Jackson tribute | One figure, a loud crop, and type that stays out of the silhouette |\nTable: Festivals and tributes"
      },
      {
        section: "Brands and Social",
        body: "Social creatives are read in a second, on a phone, mid-scroll. The rule is the same as any poster, just faster: the product is the hero and the offer reads at a glance.\n\n![A biryani combo for social: the meal is the hero](/gallery/combo-biryani.jpg)\n\n| Piece | Format | The approach |\n|---|---|---|\n| Food combo | Square social post | The meal is the hero; the offer reads in a glance |\n| Product campaign | Campaign board | A series of ads composed as one system |\n| Entrance exam campaign | Poster | Dates, hierarchy, and one call to action |\nTable: Brand and social work"
      },
      {
        section: "The Method",
        body: "| Step | Question |\n|---|---|\n| 1. One job | What is the single thing this piece must make someone do? |\n| 2. Hierarchy | What must be read first, second, and third? |\n| 3. Identity | What does this event or brand already look like? |\n| 4. Subject | What is the image, and how does type stay out of its way? |\n| 5. Format | Where will it be seen: a wall, a feed, a screen? |\nTable: The questions behind every piece\n\n![A product campaign composed as one board](/gallery/product-ads.jpg)"
      }
    ]
  },
  {
    slug: "ai-stereo-headphones",
    title: "Stereo Headphones: A Commercial Made With AI",
    type: "AI Video",
    heroDescription: "A cinematic headphones commercial generated with AI: one woman, one day of noise, and the moment the headphones go on.",
    image: "/aivideos/posters/AI_ADVERTISEMENT.jpg",
    meta: [
      { label: "Format", value: "Commercial, 2.35:1 widescreen" },
      { label: "Length", value: "48 seconds" },
      { label: "Made with", value: "Generative AI video" },
      { label: "Role", value: "Concept, direction, and edit" }
    ],
    highlights: [
      { value: "48s", label: "Running time" },
      { value: "2.35:1", label: "Cinema aspect ratio" },
      { value: "1", label: "Character, kept consistent across scenes" },
      { value: "4", label: "Settings, one story" }
    ],
    content: [
      {
        section: "Overview",
        body: "A commercial for stereo headphones, made entirely with generative AI video and cut like a film: widescreen, warm grade, and a single character carried from scene to scene.\n\n![Stereo Headphones](/aivideos/AI_ADVERTISEMENT.mp4)"
      },
      {
        section: "The Story in Four Frames",
        body: "The ad follows one woman through her day: a lift, the morning paper, a desk late at night. The payoff is the moment she puts the headphones on.\n\n![Four moments from the film](/cases/ai-AI_ADVERTISEMENT-frames.webp)\n\n| Beat | What we see |\n|---|---|\n| Opening | Eyes closed in a steel lift |\n| The day | Reading the newspaper at home |\n| The work | At her desk under a lamp |\n| The product | Headphones on, everything else falls away |\nTable: A day told in four scenes"
      },
      {
        section: "What Makes It Hard",
        body: "| Challenge in AI video | Why it matters here |\n|---|---|\n| Keeping one face across scenes | The ad only works if it's clearly the same woman all day |\n| Consistent wardrobe | The same yellow kurta ties the scenes together |\n| A product that holds its shape | Headphones need to look like one real product, not a new design each shot |\n| A grade that feels like cinema | Warm, low-key light sells the calm the product promises |\nTable: The craft problems this film had to solve"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 2.35:1, the widescreen cinema frame |\n| Resolution | 1280 × 544 |\n| Length | 48 seconds |\n| Sound | Music and sound design |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/AI_ADVERTISEMENT.jpg)"
      }
    ]
  },
  {
    slug: "ai-hangy",
    title: "Hangy: Curing Hangovers Since the Stone Age",
    type: "AI Video",
    heroDescription: "A comic AI-generated commercial for a hangover drink: a caveman wakes up wrecked, cracks open a can, and the tagline lands.",
    image: "/aivideos/posters/HANGY.jpg",
    meta: [
      { label: "Format", value: "Commercial, 2.35:1 widescreen" },
      { label: "Length", value: "34 seconds" },
      { label: "Made with", value: "Generative AI video" },
      { label: "Role", value: "Concept, direction, and edit" }
    ],
    highlights: [
      { value: "34s", label: "Running time" },
      { value: "1", label: "Joke, told visually" },
      { value: "1", label: "Product shot to land it" },
      { value: "0", label: "Lines of dialogue needed" }
    ],
    content: [
      {
        section: "Overview",
        body: "Hangy is a hangover drink, and this is its commercial: a caveman wakes up in his cave after a very long night, finds the can, and recovers. The tagline does the rest: curing hangovers since the Stone Age.\n\n![Hangy](/aivideos/HANGY.mp4)"
      },
      {
        section: "The Story in Four Frames",
        body: "![Four moments from the film](/cases/ai-HANGY-frames.webp)\n\n| Beat | What we see |\n|---|---|\n| The morning after | A caveman sprawled on the cave floor among the empties |\n| Waking up | A full-body groan of regret |\n| The fix | He drinks a can of Hangy |\n| The pack shot | The can in the cave mouth: curing hangovers since the Stone Age |\nTable: Setup, suffering, fix, product"
      },
      {
        section: "What Makes It Hard",
        body: "| Challenge in AI video | Why it matters here |\n|---|---|\n| Comic timing | The groan has to land before the cut, or the joke dies |\n| A believable body | Weight and slump sell the hangover more than the face |\n| A readable product | The can and its label have to stay legible in the final shot |\n| A world that matches | Cave, fur, and light all have to feel like the same place |\nTable: The craft problems this film had to solve"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 2.35:1 widescreen |\n| Resolution | 1280 × 544 |\n| Length | 34 seconds |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/HANGY.jpg)"
      }
    ]
  },
  {
    slug: "ai-virtual-host",
    title: "AI Virtual Host: A Presenter Who Was Never Filmed",
    type: "AI Video",
    heroDescription: "A realistic AI-generated presenter in a podcast studio, built for vertical explainers: natural expressions, steady identity, and lip-sync to the voice.",
    image: "/aivideos/posters/female_host_ai_generated.jpg",
    meta: [
      { label: "Format", value: "Vertical video, 9:16" },
      { label: "Length", value: "43 seconds" },
      { label: "Made with", value: "Generative AI video and voice" },
      { label: "Use", value: "Localised educational explainers" }
    ],
    highlights: [
      { value: "43s", label: "Of continuous presenting" },
      { value: "9:16", label: "Made for phones" },
      { value: "1", label: "Host, consistent shot to shot" },
      { value: "0", label: "Cameras or studio bookings" }
    ],
    content: [
      {
        section: "Overview",
        body: "A presenter for educational and technical explainers, generated rather than filmed: a woman in a red saree at a podcast microphone, in a warm studio set. The goal was a host who could present in any language without booking a studio.\n\n![AI Virtual Host](/aivideos/female_host_ai_generated.mp4)"
      },
      {
        section: "Range of Expression",
        body: "A host who holds one expression reads as a mannequin. These frames, from across the clip, show the range: speaking, smiling, a thoughtful pause, and a relaxed wide shot.\n\n![Four moments from the clip](/cases/ai-female_host_ai_generated-frames.webp)\n\n| Moment | What it shows |\n|---|---|\n| Mid-sentence | Mouth shapes that follow the voice |\n| Smiling | Warmth, so it feels like a person, not a reader |\n| A pause | Closed eyes and a breath between thoughts |\n| Wide shot | The same host and set from a second angle |\nTable: What makes a host believable"
      },
      {
        section: "What Makes It Hard",
        body: "| Challenge | Why it matters |\n|---|---|\n| Lip-sync | Viewers notice a mismatch between mouth and voice instantly |\n| Natural blinks and gaze | A fixed stare is the fastest way into the uncanny valley |\n| Identity across angles | The close-up and the wide shot must be the same person |\n| Jewellery, fabric, hands | Small details are where generated people usually break |\nTable: The craft problems a virtual host has to solve"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 9:16 vertical |\n| Resolution | 720 × 1280 |\n| Length | 43 seconds |\n| Intended use | Explainers localised into regional languages |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/female_host_ai_generated.jpg)"
      }
    ]
  },
  {
    slug: "ai-niat-ugc",
    title: "NIAT UGC: Creator Content, Generated",
    type: "AI Video",
    heroDescription: "A user-generated-style video for NIAT, made with AI: a young creator talking to his phone on a busy street, with the handheld feel that makes UGC work.",
    image: "/aivideos/posters/niat_ugc.jpg",
    meta: [
      { label: "Client", value: "NIAT" },
      { label: "Format", value: "Vertical UGC, 9:16" },
      { label: "Length", value: "27 seconds" },
      { label: "Made with", value: "Generative AI video" }
    ],
    highlights: [
      { value: "27s", label: "Running time" },
      { value: "9:16", label: "Made for Reels and Shorts" },
      { value: "1", label: "Creator, talking straight to camera" },
      { value: "0", label: "Creators hired" }
    ],
    content: [
      {
        section: "Overview",
        body: "User-generated content works because it looks unpolished: a person, a phone, a real street. This is UGC for NIAT made with AI, recreating that handheld, talk-to-camera feel without a shoot.\n\n![NIAT UGC](/aivideos/niat_ugc.mp4)"
      },
      {
        section: "The Look of Real UGC",
        body: "![Four moments from the clip](/cases/ai-niat_ugc-frames.webp)\n\n| Signal | How the video fakes it |\n|---|---|\n| Selfie framing | Arm's-length camera, face filling the frame |\n| A real place | A busy street with billboards and autos behind him |\n| Movement | Walking, turning, and holding up his phone |\n| Casual delivery | Talking to the camera like a friend, not an advert |\nTable: What makes it read as creator content"
      },
      {
        section: "What Makes It Hard",
        body: "Imperfection has to be generated on purpose, and some things still break.\n\n| Challenge | What happened |\n|---|---|\n| Handheld feel without chaos | Camera movement that feels human, not shaky |\n| A believable street | Signs, traffic, and people that stay coherent as the camera moves |\n| Text on clothing | The T-shirt's band name drifts by the last frame, a classic AI tell |\nTable: Honest notes on the craft\n\nThat last row is worth naming. Lettering is one of the hardest things for video models to hold steady, and it's the detail a careful viewer catches first."
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 9:16 vertical |\n| Resolution | 720 × 1280 |\n| Length | 27 seconds |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/niat_ugc.jpg)"
      }
    ]
  },
  {
    slug: "ai-mustang-realism",
    title: "Mustang: Chrome, Up Close",
    type: "AI Video",
    heroDescription: "A short AI-generated detail film of a Mustang: the running-horse badge on the tail and the grille, with chrome that reflects like chrome.",
    image: "/aivideos/posters/mustang_ai_realism.jpg",
    meta: [
      { label: "Format", value: "Detail film, 16:9" },
      { label: "Length", value: "10 seconds" },
      { label: "Made with", value: "Generative AI video" },
      { label: "Focus", value: "Reflective surfaces and badges" }
    ],
    highlights: [
      { value: "10s", label: "Running time" },
      { value: "2", label: "Badges: tail and grille" },
      { value: "1", label: "Car, white paint, chrome trim" },
      { value: "16:9", label: "Frame" }
    ],
    content: [
      {
        section: "Overview",
        body: "Cars are notoriously hard for AI video: rigid shapes that must not warp, and glossy surfaces that reflect everything around them. This short film goes straight at the hardest part, chrome badges on white paint, close enough to see every edge.\n\n![Mustang](/aivideos/mustang_ai_realism.mp4)"
      },
      {
        section: "Four Frames",
        body: "![Four moments from the film](/cases/ai-mustang_ai_realism-frames.webp)\n\n| Shot | What it tests |\n|---|---|\n| Tail badge | Chrome against curved white paint |\n| Closer on the badge | Fine edges and the mane's detail |\n| Grille badge | Chrome against a dark honeycomb grille |\n| Holding on the grille | Reflections staying stable as the camera moves |\nTable: Two badges, two backgrounds"
      },
      {
        section: "What Makes It Hard",
        body: "| Challenge | Why it matters |\n|---|---|\n| Rigid geometry | A badge that wobbles or melts instantly reads as fake |\n| Specular reflections | Chrome has to reflect the scene consistently as the camera moves |\n| Brand detail | The running horse has to stay recognisably the Mustang mark |\n| Paint versus chrome | Two very different materials side by side |\nTable: The craft problems in a car detail shot"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 16:9 |\n| Resolution | 1280 × 720 |\n| Length | 10 seconds |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/mustang_ai_realism.jpg)"
      }
    ]
  },
  {
    slug: "ai-hyper-realistic-detail",
    title: "Wheat-Based Pasta Only: A Rooftop Stunt, Generated",
    type: "AI Video",
    heroDescription: "A vertical AI-generated stunt shot: a chef and an armed guard on top of a telecom mast above a city skyline, flying a flag about pasta, as the camera pulls away.",
    image: "/aivideos/posters/hyper_realistic_detail.jpg",
    meta: [
      { label: "Format", value: "Vertical video, 9:16" },
      { label: "Length", value: "10 seconds" },
      { label: "Made with", value: "Generative AI video" },
      { label: "Shot", value: "Aerial pull-back" }
    ],
    highlights: [
      { value: "10s", label: "Running time" },
      { value: "1", label: "Continuous camera move" },
      { value: "1", label: "Flag message that stays readable" },
      { value: "9:16", label: "Made for phones" }
    ],
    content: [
      {
        section: "Overview",
        body: "A stunt that would be impossible, or at least very expensive, to film: a chef and an armed guard standing on top of a telecom mast high above a city, holding a flag that reads We serve wheat-based pasta only. The camera starts close and pulls away until they're specks above the skyline.\n\n![Wheat-based pasta only](/aivideos/hyper_realistic_detail.mp4)"
      },
      {
        section: "One Shot, Four Frames",
        body: "![Four moments from the pull-back](/cases/ai-hyper_realistic_detail-frames.webp)\n\n| Moment | What the camera reveals |\n|---|---|\n| Close | The chef, the guard, and the flag's message |\n| Pulling back | The mast and the drop beneath them |\n| Wider | The glass towers around the mast |\n| Widest | The whole city and the water beyond |\nTable: The joke gets bigger as the frame does"
      },
      {
        section: "What Makes It Hard",
        body: "| Challenge | Why it matters |\n|---|---|\n| Readable text on a flag | The whole joke is the flag; it has to read clearly while it moves |\n| Scale | The city has to feel enormous as the camera pulls back |\n| A continuous move | One unbroken pull-back without the scene reshuffling |\n| Two consistent figures | The chef and the guard have to stay the same people as they shrink |\nTable: The craft problems in an aerial stunt shot"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 9:16 vertical |\n| Resolution | 720 × 1280 |\n| Length | 10 seconds |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/hyper_realistic_detail.jpg)"
      }
    ]
  },
  {
    slug: "ai-engineerudu-widescreen",
    title: "Engineerudu: The Widescreen Film",
    type: "AI Video",
    heroDescription: "An animated widescreen film for Engineerudu, the Telugu open-source community: Telugu-English type, a ride down a road of milestones, and the message that skills, not shortcuts, get you placed.",
    image: "/aivideos/posters/engineerudu_horizontal.jpg",
    meta: [
      { label: "Client", value: "Engineerudu" },
      { label: "Format", value: "Widescreen motion graphics" },
      { label: "Length", value: "47 seconds" },
      { label: "Language", value: "Telugu and English" }
    ],
    highlights: [
      { value: "47s", label: "Running time" },
      { value: "2", label: "Languages on screen" },
      { value: "1", label: "Rider, one road" },
      { value: "2", label: "Cuts: widescreen and vertical" }
    ],
    content: [
      {
        section: "Overview",
        body: "The widescreen film for Engineerudu speaks to students the way they speak: Telugu and English mixed in bold red type, playful illustration, and a rider moving down a road of milestones. It's built to be shared in student groups and on YouTube.\n\n![Engineerudu, widescreen](/aivideos/engineerudu_horizontal.mp4)"
      },
      {
        section: "The Story in Four Frames",
        body: "![Four moments from the film](/cases/ai-engineerudu_horizontal-frames.webp)\n\n| Beat | What's on screen |\n|---|---|\n| The promise | Direct ga placement kottatam: landing a placement, in Telugu-English |\n| The calendar | A page flipping to June, placement season |\n| The search | A search bar: find what's next |\n| The answer | Mee skills: your skills, with the rider moving down the road |\nTable: From the placement worry to the skills answer"
      },
      {
        section: "Design Choices",
        body: "| Choice | Why |\n|---|---|\n| Telugu-English type | It's how the audience actually talks |\n| Bold red display type on white | Reads instantly, even as a small thumbnail |\n| A rider on a road of signboards | Progress as a journey, not a shortcut |\n| Flat, playful illustration | Friendly to students, cheap to iterate |\nTable: Speaking the audience's language"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | About 16:9 |\n| Resolution | 1080 × 608 |\n| Length | 47 seconds |\n| Companion | A separate vertical cut for Reels and Shorts |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/engineerudu_horizontal.jpg)"
      }
    ]
  },
  {
    slug: "ai-engineerudu-mobile",
    title: "Engineerudu: The Vertical Cut",
    type: "AI Video",
    heroDescription: "A fast vertical film for Engineerudu built for Reels and Shorts: a prisoner jailed for doing good, a screen recording of the tools, and one punchline card.",
    image: "/aivideos/posters/engineerudu_vertical.jpg",
    meta: [
      { label: "Client", value: "Engineerudu" },
      { label: "Format", value: "Vertical, 9:16" },
      { label: "Length", value: "18 seconds" },
      { label: "Made for", value: "Instagram Reels and YouTube Shorts" }
    ],
    highlights: [
      { value: "18s", label: "Running time" },
      { value: "9:16", label: "Made for phones" },
      { value: "3", label: "Kinds of footage in one cut" },
      { value: "1", label: "Punchline card" }
    ],
    content: [
      {
        section: "Overview",
        body: "Short-form video wins or loses in the first second. This vertical film for Engineerudu is its own edit, not a crop of the widescreen film: an absurd opening image, a quick look at the tools, and a punchline.\n\n![Engineerudu, vertical](/aivideos/engineerudu_vertical.mp4)"
      },
      {
        section: "The Story in Four Frames",
        body: "![Four moments from the film](/cases/ai-engineerudu_vertical-frames.webp)\n\n| Beat | What's on screen |\n|---|---|\n| The hook | A man in prison stripes holding a sign: Jailed for doing good |\n| The tool | A screen recording of an AI app |\n| The ask | What would you like to do? |\n| The punchline | Need website, in bold red capitals |\nTable: Hook, demo, punchline"
      },
      {
        section: "Design Choices",
        body: "| Choice | Why |\n|---|---|\n| An absurd first frame | Stops the scroll before anything is explained |\n| Real screen recordings | Shows the tools are real, not a promise |\n| The same red display type as the widescreen film | Keeps both cuts recognisably Engineerudu |\n| 18 seconds | Short enough to watch twice on a loop |\nTable: Built for the feed"
      },
      {
        section: "Format",
        body: "| Detail | Value |\n|---|---|\n| Aspect ratio | 9:16 vertical |\n| Resolution | 720 × 1280 |\n| Length | 18 seconds |\nTable: Delivery specs\n\n![The opening frame](/aivideos/posters/engineerudu_vertical.jpg)"
      }
    ]
  }
];
