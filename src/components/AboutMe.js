import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Code2, Compass, Layers3, Sparkles } from "lucide-react";

const principles = [
  { icon: Compass, title: "Start with the person.", description: "Understand the task, remove the friction, and make the next step feel obvious." },
  { icon: Layers3, title: "Make it real.", description: "Design, build, then refine. The details that matter reveal themselves in the working product." },
  { icon: Code2, title: "Leave it open.", description: "Readable code, open formats, and tools people can make their own. Share what you learn." },
];

const card = "min-w-0 overflow-hidden rounded-[28px] border border-black/[0.06]";
const label = "text-[11px] font-medium uppercase tracking-[0.18em]";

export default function AboutMe() {
  return (
    <section aria-label="About Satya" className="mx-auto w-full max-w-6xl py-8 text-[#1d1d1f] sm:py-12">
      <div className="mb-6 flex items-center justify-between gap-4 px-1">
        <p className={`${label} text-[#626267]`}>A little about me</p>
        <span className="text-xs text-[#626267]">Design · Code · Curiosity</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-6 lg:grid-cols-12">
        <div className={`${card} flex flex-col justify-between bg-white p-7 sm:p-10 md:col-span-4 lg:col-span-8`}>
          <div>
            <p className={`${label} mb-7 text-[#626267]`}>Satya Sai Nagubathula / Design technologist</p>
            <h1 className="text-[2.65rem] font-semibold leading-[1.07] tracking-[-0.05em] sm:text-6xl lg:text-[4.25rem]">A designer&apos;s eye.<br /><span className="text-[#787870]">A builder&apos;s hands.</span></h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-[#515154] sm:text-lg">I turn ideas into tools that feel clear, useful, and considered. My work brings together product design, software, and generative AI.</p>
          </div>
          <Link href="/works" className="mt-8 inline-flex w-fit items-center gap-4 rounded-full bg-[#1d1d1f] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#414141]">Explore my work <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>

        <figure className={`${card} flex flex-col justify-between bg-[#eeeee8] md:col-span-2 lg:col-span-4`}>
          <div className="p-7 pb-0 sm:p-8 sm:pb-0">
            <p className={`${label} text-[#62625b]`}>Always curious</p>
            <p className="mt-4 text-3xl leading-tight tracking-tight" style={{ fontFamily: "var(--font-editorial)" }}>From how it looks<br />to how it works.</p>
          </div>
          <Image src="/images/about/about_main_image.png" alt="Satya Sai Nagubathula with a cat" width={596} height={359} priority sizes="(max-width: 768px) 90vw, 380px" className="mt-8 h-auto w-full object-contain" />
          <figcaption className="border-t border-black/[0.07] px-7 py-4 text-xs text-[#62625b]">Engineer. Designer. Open-source builder.</figcaption>
        </figure>

        <article className={`${card} bg-[#232722] p-7 text-white sm:p-8 md:col-span-3 lg:col-span-5`}>
          <div className="flex items-center justify-between"><p className={`${label} text-[#c3ccbd]`}>Currently / NxtWave</p><Sparkles size={18} className="text-[#c3ccbd]" aria-hidden="true" /></div>
          <h2 className="mt-8 text-3xl font-medium leading-tight tracking-tight">Creative tools.<br />Practical systems.</h2>
          <p className="mt-5 text-sm leading-7 text-[#d6dcd2]">My work spans generative AI production and internal tools that help teams create and deliver content.</p>
          <div className="mt-7 flex flex-wrap gap-2">{["Generative AI", "Automation", "Product design"].map(tag => <span key={tag} className="rounded-full border border-white/20 px-3 py-1.5 text-xs text-[#d6dcd2]">{tag}</span>)}</div>
        </article>

        <article className={`${card} bg-white p-7 sm:p-8 md:col-span-3 lg:col-span-7`}>
          <p className={`${label} text-[#626267]`}>The common thread</p>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight">Learning by making.</h2>
          <div className="mt-5 space-y-4 text-sm leading-7 text-[#515154]">
            <p>I started with electronics and hardware security, then found my way into interfaces, design systems, and creative tools. The question stayed the same: how can this work better for the person using it?</p>
            <p>Today, that means connecting the visible details with the systems underneath, from a component in Chaya UI to a quieter writing experience in NotBad.</p>
          </div>
        </article>

        <article className={`${card} bg-[#e9eee5] p-7 sm:p-8 md:col-span-3 lg:col-span-4`}>
          <p className={`${label} text-[#52604a]`}>Community / Engineerudu</p>
          <h2 className="mt-8 text-3xl font-semibold leading-tight tracking-tight">Better when<br />we build together.</h2>
          <p className="mt-5 text-sm leading-7 text-[#495343]">I build Engineerudu, an open-source community in Andhra Pradesh. A place to learn in public, share tools, and help others get started.</p>
        </article>

        <article className={`${card} bg-[#f2efe9] p-7 sm:p-8 md:col-span-3 lg:col-span-4`}>
          <p className={`${label} text-[#686052]`}>Outside the day job</p>
          <h2 className="mt-8 text-3xl font-semibold tracking-tight">Made to be yours.</h2>
          <p className="mt-5 text-sm leading-7 text-[#5c554b]">Tools that give creators more control over their work.</p>
          <div className="mt-5 divide-y divide-black/10">
            {[["OpenWeave", "Design", "o0"], ["NotBad", "Writing", "o5"], ["Toothpaste", "Editing", "o1"]].map(([name, kind, id]) => <Link key={id} href={`/works/${id}`} className="group flex items-center justify-between gap-3 py-3 text-sm"><span className="font-medium group-hover:underline">{name}</span><span className="inline-flex items-center gap-2 text-xs text-[#686052]">{kind}<ArrowUpRight size={14} aria-hidden="true" /></span></Link>)}
          </div>
        </article>

        <article className={`${card} bg-white p-7 sm:p-8 md:col-span-6 lg:col-span-4`}>
          <p className={`${label} text-[#626267]`}>How I work</p>
          <div className="mt-7 space-y-6">
            {principles.map(({ icon: Icon, title, description }) => <div key={title} className="flex items-start gap-3"><Icon size={18} className="mt-1 shrink-0 text-[#757e6b]" aria-hidden="true" /><div><h2 className="text-base font-semibold tracking-tight">{title}</h2><p className="mt-1.5 text-sm leading-6 text-[#515154]">{description}</p></div></div>)}
          </div>
        </article>
      </div>
    </section>
  );
}
