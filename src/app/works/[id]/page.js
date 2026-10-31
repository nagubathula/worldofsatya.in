import { allWorks } from "@/data/works";
import { notFound, permanentRedirect } from "next/navigation";
import { Fragment } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Code, Briefcase, Video, Sparkles, Wrench } from "lucide-react";
import Footer from "@/components/Footer";
import PageTurn from "@/components/PageTurn";
import BackToWorks from "@/components/BackToWorks";
import Image from "next/image";
import { workMediaStyle } from "@/lib/motion";
import { caseStudiesData } from "@/data/caseStudies";
import CaseStudyBody from "@/components/CaseStudyBody";
import NoiseStage from "@/components/NoiseStage";
import Magnetic from "@/components/Magnetic";
import { CaseStudyContents, CountUp, ReadingProgress, RevealOnScroll } from "@/components/CaseStudyChrome";

const findStudy = (work) => work.study && caseStudiesData.find((study) => study.slug === work.study);

// Exact slug or id first, then a loose match so hand-typed links like /works/KLUPas still land on klu-pas.
const looseKey = (value) => String(value).toLowerCase().replace(/[^a-z0-9]/g, "");
const findWork = (id) =>
  allWorks.find((entry) => entry.slug === id) ||
  allWorks.find((entry) => entry.id === id) ||
  allWorks.find((entry) => looseKey(entry.slug) === looseKey(id));

// Pre-generate routes at build time
export function generateStaticParams() {
  return allWorks.flatMap((work) => [{ id: work.slug }, { id: work.id }]);
}

// Each project gets its own title, so tabs, history and shared links tell them apart.
export async function generateMetadata({ params }) {
  const { id } = await params;
  const work = findWork(id);
  if (!work) return {};

  const study = findStudy(work);
  const title = `${study?.title || work.title} | Satya Sai Nagubathula`;
  const description = study?.heroDescription || work.description;
  const image = study?.image || work.poster || work.image;
  const images = image ? [{ url: image, alt: work.title }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/works/${work.slug}` },
    openGraph: { title, description, url: `/works/${work.slug}`, images },
    // Work images are wide screenshots, so the large card shows them uncropped.
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function WorkDetailPage({ params }) {
  const { id } = await params;

  const work = findWork(id);

  if (!work) {
    notFound();
  }

  if (id !== work.slug) {
    permanentRedirect(`/works/${work.slug}`);
  }

  // Neighbours in the works list, wrapping round at the ends.
  const index = allWorks.indexOf(work);
  const prevWork = allWorks[(index - 1 + allWorks.length) % allWorks.length];
  const nextWork = allWorks[(index + 1) % allWorks.length];

  const getIcon = (category) => {
    switch (category) {
      case "Project": return <Briefcase size={14} className="mr-1.5" />;
      case "Open Source": return <Code size={14} className="mr-1.5" />;
      case "AI Videos": return <Video size={14} className="mr-1.5" />;
      case "Case Study": return <BookOpen size={14} className="mr-1.5" />;
      case "Internal Tools": return <Wrench size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  const hasLink = Boolean(work.link);
  const isExternal = hasLink && work.link.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  const linkProps = isExternal
    ? { href: work.link, target: "_blank", rel: "noopener noreferrer" }
    : { href: work.link };

  const study = findStudy(work);
  if (study) {
    return (
      <CaseStudy
        study={study}
        work={work}
        action={hasLink && (
          <Magnetic max={6}>
            <LinkComponent
              {...linkProps}
              className="group inline-flex items-center gap-2 rounded-full bg-[#1d1d1f] px-6 py-3 text-sm font-medium text-white shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-[#333336] hover:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.5)] active:scale-95"
            >
              {work.actionText}
              <ArrowUpRight size={17} className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </LinkComponent>
          </Magnetic>
        )}
        prevWork={prevWork}
        nextWork={nextWork}
      />
    );
  }

  return (
    <div className="min-h-screen relative w-full">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-12 mb-8 sm:mb-16">
          <BackToWorks className="mb-8 inline-block text-sm text-[#515154] hover:text-black" />
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#f5f5f7] text-xs sm:text-[13px] font-sans font-medium text-[#6e6e73] uppercase tracking-wider border border-black/[0.04]">
              {getIcon(work.category)}
              {work.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-6xl lg:text-7xl font-sans font-semibold tracking-[-0.035em] text-[#1d1d1f] mb-6 sm:mb-10 text-center leading-[1.08] max-w-5xl mx-auto">
            {work.title}
          </h1>
          
          <div className="flex justify-center mb-8 sm:mb-14">
            {hasLink && (
              <LinkComponent
                {...linkProps}
                className="inline-flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-3.5 bg-[#1d1d1f] text-white rounded-full font-sans font-medium shadow-sm hover:bg-[#333336] active:scale-95 transition-all duration-150 text-sm sm:text-base"
              >
                {work.actionText} <ArrowUpRight size={17} />
              </LinkComponent>
            )}
          </div>
        </div>
        
        {/* Detail Content Section */}
        <div className="w-full">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            {work.videoSrc ? (
              <div className="w-full relative rounded-3xl overflow-hidden mb-12 sm:mb-20 bg-black shadow-[0_4px_30px_rgba(0,0,0,0.12)] flex items-center justify-center border border-black/[0.08]">
                <video 
                  src={work.videoSrc} 
                  poster={work.poster || work.image} 
                  controls 
                  playsInline 
                  preload="metadata"
                  className={`w-full max-h-[75vh] object-contain ${work.isVertical ? "max-w-md mx-auto" : ""}`}
                />
              </div>
            ) : work.image ? (
              <NoiseStage seed={work.slug} className="mb-12 sm:mb-20 p-4 sm:p-12 lg:p-16">
                {/* The screenshot carries the morph name, so the card's shot lands on this one. */}
                <div data-work-media style={workMediaStyle(work.slug)} className="noise-stage-media">
                  <Image
                    src={work.image}
                    alt={work.title}
                    width={1920}
                    height={1080}
                    // Full column width: phones fetch a phone-sized file, not the 2x desktop one.
                    sizes="(min-width: 1280px) 1024px, 100vw"
                    loading="eager"
                    fetchPriority="high"
                    className="w-full h-auto object-contain"
                  />
                </div>
              </NoiseStage>
            ) : null}
            
            {/* One column at a comfortable reading width. */}
            <div className="prose prose-base sm:prose-lg font-sans text-[#515154] leading-relaxed max-w-3xl mx-auto mt-8 sm:mt-12">
              {work.content ? (
                <div dangerouslySetInnerHTML={{ __html: work.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#6e6e73] col-span-full">
                  <BookOpen size={40} className="mb-4 text-neutral-300" />
                  <p className="text-lg">Detailed project notes and process breakdown coming soon.</p>
                </div>
              )}
            </div>

            <PageTurn
              prev={{ href: `/works/${prevWork.slug}`, title: prevWork.title }}
              next={{ href: `/works/${nextWork.slug}`, title: nextWork.title }}
            />
          </div>
        </div>
      </main>

      <div className="border-t border-black/[0.06]">
        <Footer />
      </div>
    </div>
  );
}

// A work with a written case study reads as one long column instead.
const sectionId = (title) => title.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Words rise into place one after another (see .cs-word in globals.css).
function RisingWords({ text, from = 0 }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span className="cs-word">
        <span style={{ "--cs-i": from + i }}>{word}</span>
      </span>
    </Fragment>
  ));
}

function CaseStudy({ study, work, action, prevWork, nextWork }) {
  const image = study.image || work.image;
  const sections = study.content.map((section) => ({ id: sectionId(section.section), title: section.section }));
  const words = study.content.reduce((n, s) => n + s.body.split(/\s+/).length, 0);
  const minutes = Math.max(1, Math.round(words / 230));
  const titleWords = study.title.split(" ").length;

  return (
    <div className="min-h-screen relative w-full">
      <ReadingProgress />
      <RevealOnScroll />
      <main className="relative z-10 flex flex-col pt-24 sm:pt-32 pb-16">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-8">
          <BackToWorks className="cs-rise mb-10 inline-block text-sm text-[#515154] hover:text-black" />
          <header>
            {study.logo && (
              <Image
                src={study.logo}
                alt=""
                width={256}
                height={256}
                sizes="64px"
                className="cs-rise mb-6 h-14 w-14 drop-shadow-[0_10px_20px_rgba(0,0,0,0.22)] sm:h-16 sm:w-16"
                style={{ "--cs-i": 0 }}
              />
            )}
            <div className="cs-rise flex flex-wrap items-center gap-x-3 gap-y-2 text-[12px] text-[#6e6e73]" style={{ "--cs-i": 1 }}>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.05] bg-[#f5f5f7] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.16em] text-[#626267]">
                <BookOpen size={11} className="text-[#8c9385]" /> {study.type}
              </span>
              <span className="whitespace-nowrap tabular-nums">
                {minutes} min read <span aria-hidden="true" className="mx-1.5">·</span> {sections.length} sections
              </span>
            </div>
            <h1 className="mt-6 text-[2.6rem] font-semibold leading-[1.02] tracking-[-0.045em] text-[#1d1d1f] [text-wrap:balance] sm:text-6xl lg:text-[4.25rem]">
              <RisingWords text={study.title} from={2} />
            </h1>
            <p
              className="cs-rise mt-6 max-w-2xl text-lg leading-relaxed text-[#515154] [text-wrap:pretty] sm:text-xl sm:leading-relaxed"
              style={{ "--cs-i": titleWords + 3 }}
            >
              {study.heroDescription}
            </p>
            <div className="cs-rise mt-9 flex flex-wrap items-center gap-x-6 gap-y-4" style={{ "--cs-i": titleWords + 4 }}>
              {action}
              <a
                href={`#${sections[0].id}`}
                className="group inline-flex items-center gap-2 text-sm font-medium text-[#515154] transition-colors hover:text-[#1d1d1f]"
              >
                Start reading
                <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-y-0.5">↓</span>
              </a>
            </div>
          </header>

          {study.meta && (
            <dl
              className="cs-rise mt-12 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-black/[0.08] py-6 sm:grid-cols-4"
              style={{ "--cs-i": titleWords + 5 }}
            >
              {study.meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#6e6e73]">{item.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-[#1d1d1f]">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* The results, for readers who stop here. */}
          {study.highlights && (
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {study.highlights.map((item, i) => (
                <li
                  key={item.label}
                  className="cs-rise group rounded-2xl border border-black/[0.04] bg-[#f5f5f7] px-4 py-4 transition-[transform,background-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_10px_30px_-16px_rgba(0,0,0,0.25)]"
                  style={{ "--cs-i": titleWords + 6 + i }}
                >
                  <p className="text-2xl font-semibold tabular-nums tracking-[-0.03em] text-[#1d1d1f] sm:text-[1.75rem]">
                    <CountUp value={item.value} delay={0.45 + (titleWords + 6 + i) * 0.045} />
                  </p>
                  <p className="mt-1 text-[13px] leading-snug text-[#6e6e73]">{item.label}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {image && (
          <div className="mx-auto mt-14 w-full max-w-5xl px-4 sm:mt-16 sm:px-8">
            <NoiseStage seed={work.slug} className="p-4 sm:p-12">
              <div data-work-media style={workMediaStyle(work.slug)} className="noise-stage-media">
                {study.video ? (
                  // A launch film leads when there is one; its poster lives in posters/ beside it.
                  <video
                    src={study.video}
                    poster={study.video.replace(/([^/]+)\.mp4$/i, 'posters/$1.jpg')}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={study.title}
                    className="h-auto w-full"
                  />
                ) : (
                  <Image
                    src={image}
                    alt={study.title}
                    width={1280}
                    height={800}
                    // The hero tops out at max-w-5xl; below that it spans the screen.
                    sizes="(min-width: 1024px) 900px, 100vw"
                    priority
                    className="h-auto w-full"
                  />
                )}
              </div>
            </NoiseStage>
          </div>
        )}

        {/* The contents sit in the left margin on wide screens; the reading column stays put. */}
        <div className="relative mx-auto mt-20 w-full max-w-3xl px-4 sm:mt-28 sm:px-8">
          <aside className="absolute inset-y-0 right-full hidden w-56 xl:block 2xl:w-64">
            <CaseStudyContents sections={sections} />
          </aside>

          <article className="flex max-w-2xl flex-col gap-16 sm:gap-20">
            {study.content.map((section, idx) => (
              <section key={idx} id={sections[idx].id} data-cs-reveal="" className="scroll-mt-28">
                <div className="flex items-baseline gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#6e6e73]">
                  <span className="tabular-nums text-[#1d1d1f]">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-black/15" aria-hidden="true" />
                  <span className="tabular-nums">{String(sections.length).padStart(2, "0")}</span>
                </div>
                <h2 className="mt-3 text-[1.65rem] font-semibold leading-tight tracking-[-0.035em] text-[#1d1d1f] [text-wrap:balance] sm:text-3xl">
                  {section.section}
                </h2>
                <div className="mt-5 flex flex-col gap-5 text-[17px] leading-[1.75] text-[#515154] [text-wrap:pretty]">
                  <CaseStudyBody text={section.body} seed={work.slug} />
                </div>
              </section>
            ))}
            {study.source && (
              <p className="border-t border-black/[0.08] pt-6 text-sm text-[#6e6e73]">
                Originally published on{" "}
                <a href={study.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black">
                  Medium
                </a>
                .
              </p>
            )}
          </article>
        </div>

        <div className="px-4 sm:px-8">
          <PageTurn
            prev={{ href: `/works/${prevWork.slug}`, title: prevWork.title }}
            next={{ href: `/works/${nextWork.slug}`, title: nextWork.title }}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
