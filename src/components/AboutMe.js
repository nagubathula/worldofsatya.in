import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowRight, Code2, Compass, Layers3, Sparkles } from "lucide-react";

const principles = [
  {
    number: "01",
    icon: Compass,
    title: "Start with the person.",
    description: "Understand the task, remove the friction, and make the next step feel obvious and inevitable.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Make it real.",
    description: "Design, build, then refine. The nuances and details that matter reveal themselves only in the working product.",
  },
  {
    number: "03",
    icon: Code2,
    title: "Leave it open.",
    description: "Readable code, open formats, and tools people can make their own. Always share what you learn with the community.",
  },
];

const independentTools = [
  {
    name: "OpenWeave",
    category: "Open Source · Design Canvas + AI",
    id: "o0",
    desc: "Sovereign design editor with Figma binary support & natural AI co-creation.",
  },
  {
    name: "NotBad",
    category: "Case Study · Distraction-Free Writing",
    id: "case-studies/notbad-design",
    desc: "Editorial sanctuary in Flutter where Markdown conceals on rest.",
  },
  {
    name: "Toothpaste",
    category: "Open Source · Media Workflow Engine",
    id: "o1",
    desc: "Specialized utility bridging timeline sequencing and automated media pipelines.",
  },
];

export default function AboutMe() {
  return (
    <section aria-label="About Satya" className="mx-auto w-full max-w-5xl pt-4 pb-16 text-[#1d1d1f] sm:pt-8 sm:pb-24">
      {/* Editorial Meta Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.08] pb-5 text-xs">
        <div className="flex items-center gap-2 text-[#626267]">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono uppercase tracking-[0.16em]">Available for select initiatives</span>
        </div>
        <span className="font-mono text-[#86868b] tracking-wider">Satya Sai Nagubathula · Design & Code</span>
      </div>

      {/* Hero Spread: Open Editorial Layout */}
      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
        {/* Left: Typographic Title & Biography */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <p className="text-[11px] font-mono font-medium uppercase tracking-[0.2em] text-[#86868b] mb-4">
              Satya Sai Nagubathula / AI + Design Engineer
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.04em] text-[#1d1d1f] sm:text-6xl lg:text-[4.2rem] leading-[1.06]">
              A designer&apos;s eye.
              <span
                className="block italic font-normal text-[#626267] mt-1 sm:mt-2"
                style={{ fontFamily: "var(--font-editorial)" }}
              >
                A builder&apos;s hands.
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[#515154] font-normal sm:text-xl sm:leading-relaxed">
              I turn ideas into tools that feel clear, useful, and considered. My work brings together product design, systems engineering, and generative AI.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Link
              href="/works"
              className="group inline-flex items-center gap-2.5 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-medium text-white transition-all hover:bg-[#333336] hover:shadow-md"
            >
              Explore my work
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              href="/experience"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#626267] hover:text-[#1d1d1f] transition-colors py-3 px-2 underline decoration-black/20 underline-offset-4"
            >
              View experience
            </Link>
          </div>
        </div>

        {/* Right: Natural Portrait Feature */}
        <div className="lg:col-span-5">
          <figure className="relative overflow-hidden rounded-2xl bg-[#f5f5f7] border border-black/[0.06] shadow-[0_8px_30px_rgba(0,0,0,0.03)]">
            <Image
              src="/images/about/about_main_image.png"
              alt="Satya Sai Nagubathula with a cat"
              width={596}
              height={359}
              priority
              sizes="(max-width: 1024px) 90vw, 420px"
              className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]"
            />
            <figcaption className="border-t border-black/[0.06] bg-white/90 backdrop-blur-sm p-4 sm:p-5">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-[0.16em] text-[#86868b]">
                <span>Always curious</span>
                <span>Companion</span>
              </div>
              <p className="mt-1.5 text-base sm:text-lg text-[#1d1d1f]" style={{ fontFamily: "var(--font-editorial)" }}>
                &ldquo;From how it looks to how it works.&rdquo;
              </p>
              <p className="mt-2 text-xs text-[#626267]">
                Engineer. Designer. Open-source builder.
              </p>
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-20 sm:mt-28 border-t border-black/[0.08]" />

      {/* Chapter 01: Practice & Philosophy */}
      <div className="mt-14 sm:mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Current Role at NxtWave */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">01 / Current Practice</span>
              <Sparkles size={14} className="text-[#86868b]" aria-hidden="true" />
            </div>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Creative tools.<br />Practical systems.
            </h2>
            <p className="mt-2 font-mono text-xs text-[#626267] uppercase tracking-wider">
              NxtWave Disruptive Technologies · 2025 — Present
            </p>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#515154]">
              My work spans generative AI production and internal tools that help teams create and deliver content at scale. Orchestrating high-throughput video pipelines, prompt automation, and creative toolchains that slash turnaround times by 90%.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {["Generative AI", "Automation", "Product Design", "Internal Tools"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-black/[0.08] bg-[#f5f5f7] px-3 py-1 text-xs text-[#515154] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right: The Common Thread */}
        <div className="lg:col-span-7 lg:border-l lg:border-black/[0.08] lg:pl-16">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">02 / Philosophy</span>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Learning by making.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-[#515154]">
            <p>
              I started with electronics and hardware security, then found my way into interfaces, design systems, and creative tools. The question stayed constant: <span className="text-[#1d1d1f] font-medium">how can this work better for the person using it?</span>
            </p>
            <p>
              Today, that means connecting visible aesthetic details with the robust architectures underneath — whether tuning a tactile component in Chaya UI or crafting a quieter, distraction-free writing sanctuary in NotBad.
            </p>
            <p>
              I believe great software doesn&apos;t just solve a functional requirement; it respects the user&apos;s attention and gives them confidence to create.
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-20 sm:mt-28 border-t border-black/[0.08]" />

      {/* Chapter 02: Principles */}
      <div className="mt-14 sm:mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">03 / Principles</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              How I approach the craft.
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#626267]">
            Core tenets that guide every prototype, design system, and technical architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {principles.map(({ number, icon: Icon, title, description }) => (
            <div key={title} className="group relative border-t border-black/[0.1] pt-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm text-[#86868b]">{number}</span>
                  <Icon
                    size={18}
                    className="text-[#86868b] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#1d1d1f]"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mt-5 text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  {title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-[#515154]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mt-20 sm:mt-28 border-t border-black/[0.08]" />

      {/* Chapter 03: Community & Independent Software */}
      <div className="mt-14 sm:mt-20 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: Community */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">04 / Community</span>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
              Better when<br />we build together.
            </h2>
            <p className="mt-2 font-mono text-xs text-[#626267] uppercase tracking-wider">
              Engineerudu · Founder & Community Lead
            </p>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-[#515154]">
              I build Engineerudu, an open-source community in Andhra Pradesh. A dedicated space to learn in public, build real-world tools, and help students and new engineers transition from theory to shipping production software.
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-black/[0.06] flex items-center gap-3 text-xs text-[#626267]">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#1d1d1f]" />
            <span>Open-source initiatives & public workshops</span>
          </div>
        </div>

        {/* Right: Independent Tools */}
        <div className="lg:col-span-7 lg:border-l lg:border-black/[0.08] lg:pl-16">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#86868b]">05 / Independent Software</span>
            <span className="text-xs text-[#86868b]">Outside the day job</span>
          </div>
          <h2 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            Made to be yours.
          </h2>
          <p className="mt-3 text-sm text-[#515154]">
            Independent utilities designed to give creators autonomy and tactile control over their tools.
          </p>

          <div className="mt-8 divide-y divide-black/[0.08] border-y border-black/[0.08]">
            {independentTools.map((tool) => (
              <Link
                key={tool.name}
                href={`/works/${tool.id}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 transition-colors hover:bg-black/[0.015] px-2 -mx-2 rounded"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#1d1d1f] group-hover:text-[#0071e3] transition-colors">
                      {tool.name}
                    </span>
                    <span className="text-xs text-[#86868b]">{tool.category}</span>
                  </div>
                  <p className="mt-1 text-xs text-[#515154] max-w-md">{tool.desc}</p>
                </div>
                <ArrowUpRight
                  size={16}
                  className="text-[#86868b] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1d1d1f] shrink-0"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
