import { Fragment } from 'react';
import Image from 'next/image';
import { caseStudiesData } from '@/data/caseStudies';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import PageTurn from '@/components/PageTurn';
import BackToWorks from '@/components/BackToWorks';

export async function generateStaticParams() {
  return caseStudiesData.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const study = caseStudiesData.find((s) => s.slug === slug);
  if (!study) return {};

  const title = `${study.title} | Satya Sai Nagubathula`;
  const images = study.image ? [{ url: study.image, alt: study.title }] : undefined;
  return {
    title,
    description: study.heroDescription,
    alternates: { canonical: `/works/case-studies/${slug}` },
    openGraph: { title, description: study.heroDescription, url: `/works/case-studies/${slug}`, images },
    twitter: { title, description: study.heroDescription, images },
  };
}

const INLINE = /(\*\*\*.+?\*\*\*|\*\*.+?\*\*|\[[^\]]+\]\([^)\s]+\)|\*[^*\s](?:[^*]*[^*\s])?\*)/g;

// ***bold italic***, **bold**, *italic* and [links](url) inside a line of copy.
function Inline({ text }) {
  return text.split(INLINE).map((part, i) => {
    if (part.startsWith('***') && part.endsWith('***') && part.length > 6) {
      return <strong key={i} className="font-semibold italic text-[#1d1d1f]">{part.slice(3, -3)}</strong>;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-semibold text-[#1d1d1f]">{part.slice(2, -2)}</strong>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const external = link[2].startsWith('http');
      return (
        <a
          key={i}
          href={link[2]}
          {...(external && { target: '_blank', rel: 'noopener noreferrer' })}
          className="text-[#1d1d1f] underline decoration-black/20 underline-offset-4 hover:decoration-black"
        >
          <Inline text={link[1].trim()} />
        </a>
      );
    }
    if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const NUMBERED = /^\d+\.\s+/;
const BULLET = /^-\s+/;
const IMAGE = /^!\[(.*)\]\((\S+)\)$/;

function lineKind(line) {
  if (IMAGE.test(line)) return 'img';
  if (line.startsWith('> ')) return 'quote';
  if (line.startsWith('#### ')) return 'h3';
  if (NUMBERED.test(line)) return 'ol';
  if (BULLET.test(line)) return 'ul';
  return 'p';
}

// A section body is plain text: blank lines split paragraphs, and lines
// starting "1." or "-" are list items. Neighbouring items join one list.
// "![caption](src)" is an image, "> " a quote and "#### " a subheading.
function Body({ text }) {
  const blocks = [];
  for (const chunk of text.split(/\n{2,}/)) {
    let last = null;
    for (const line of chunk.split('\n').filter(Boolean)) {
      const kind = lineKind(line);
      const prev = blocks[blocks.length - 1];
      if ((kind === 'ol' || kind === 'ul') && prev?.kind === kind) prev.items.push(line);
      else if (kind === 'ol' || kind === 'ul') blocks.push({ kind, items: [line] });
      // Lines of one paragraph stay one paragraph, broken where the text breaks.
      else if (kind === 'p' && last?.kind === 'p' && prev === last) last.lines.push(line);
      else blocks.push(kind === 'p' ? { kind, lines: [line] } : { kind, text: line });
      last = blocks[blocks.length - 1];
    }
  }

  return blocks.map((block, i) => {
    if (block.kind === 'p') {
      return (
        <p key={i}>
          {block.lines.map((line, j) => (
            <Fragment key={j}>{j > 0 && <br />}<Inline text={line} /></Fragment>
          ))}
        </p>
      );
    }
    if (block.kind === 'img') {
      const [, caption, src] = block.text.match(IMAGE);
      return (
        <figure key={i} className="my-2">
          {/* Plain img: these are a mix of sizes and animated GIFs. */}
          <img src={src} alt={caption} loading="lazy" className="h-auto w-full rounded-xl border border-black/[0.06] bg-[#f5f5f7]" />
          {caption && <figcaption className="mt-2 text-center text-sm text-[#86868b]">{caption}</figcaption>}
        </figure>
      );
    }
    if (block.kind === 'quote') {
      return (
        <blockquote key={i} className="border-l-2 border-black/15 pl-5 italic text-[#1d1d1f]">
          <Inline text={block.text.slice(2)} />
        </blockquote>
      );
    }
    if (block.kind === 'h3') {
      return <h3 key={i} className="mt-2 text-lg font-semibold tracking-[-0.02em] text-[#1d1d1f]">{block.text.slice(5)}</h3>;
    }
    const List = block.kind;
    const marker = block.kind === 'ol' ? NUMBERED : BULLET;
    return (
      <List key={i} className={`flex flex-col gap-3 pl-5 ${block.kind === 'ol' ? 'list-decimal' : 'list-disc'} marker:text-[#86868b]`}>
        {block.items.map((item, j) => (
          <li key={j} className="pl-1"><Inline text={item.replace(marker, '')} /></li>
        ))}
      </List>
    );
  });
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = caseStudiesData.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  const nextStudy = caseStudiesData[(caseStudiesData.indexOf(study) + 1) % caseStudiesData.length];

  return (
    <div className="min-h-screen relative w-full">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-32 pb-16">
        {/* One reading column; only the image runs wider. */}
        <div className="mx-auto w-full max-w-2xl px-4 sm:px-0">
          <BackToWorks className="mb-10 inline-block text-sm text-[#515154] hover:text-black" />
          <header>
            <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-[#86868b]">{study.type}</p>
            <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-[#1d1d1f] sm:text-5xl">
              {study.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-[#515154]">
              {study.heroDescription}
            </p>
          </header>

          {study.meta && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-black/[0.08] py-6 sm:grid-cols-4">
              {study.meta.map((item) => (
                <div key={item.label}>
                  <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-[#86868b]">{item.label}</dt>
                  <dd className="mt-1.5 text-sm leading-snug text-[#1d1d1f]">{item.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {study.image && (
          <div className="mx-auto mt-12 w-full max-w-4xl px-4 sm:px-8">
            <Image
              src={study.image}
              alt={study.title}
              width={1280}
              height={800}
              priority
              className="h-auto w-full rounded-2xl border border-black/[0.06] bg-[#f5f5f7]"
            />
          </div>
        )}

        <article className="mx-auto mt-16 flex w-full max-w-2xl flex-col gap-14 px-4 sm:mt-20 sm:gap-16 sm:px-0">
          {study.content.map((section, idx) => (
            <section key={idx}>
              <p className="text-[11px] font-medium tabular-nums tracking-[0.16em] text-[#86868b]">
                {String(idx + 1).padStart(2, '0')}
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-[#1d1d1f]">
                {section.section}
              </h2>
              <div className="mt-4 flex flex-col gap-4 text-[17px] leading-[1.7] text-[#515154]">
                <Body text={section.body} />
              </div>
            </section>
          ))}
          {study.source && (
            <p className="border-t border-black/[0.08] pt-6 text-sm text-[#86868b]">
              Originally published on{' '}
              <a href={study.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-black">
                Medium
              </a>
              .
            </p>
          )}
        </article>

        <div className="px-4 sm:px-8">
          <PageTurn
            prev={{ href: "/works", title: "All works" }}
            next={nextStudy !== study ? { href: `/works/case-studies/${nextStudy.slug}`, title: nextStudy.title } : undefined}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
