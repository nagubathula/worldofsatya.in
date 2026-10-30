import { Fragment } from 'react';

// Widths the column ever draws at, through Next's optimizer. GIFs, SVGs and
// remote files are served as they are.
const STILL_WIDTHS = [640, 1080, 1920];
function stillSrcSet(src) {
  if (!src.startsWith('/') || /\.(gif|svg)$/i.test(src)) return undefined;
  return STILL_WIDTHS.map((w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75 ${w}w`).join(', ');
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
export default function CaseStudyBody({ text }) {
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
          {/* Plain img: these are a mix of sizes and animated GIFs. Stills still get
              optimizer-sized sources so a phone doesn't pull a 1MB screenshot. */}
          <img src={src} srcSet={stillSrcSet(src)} sizes="(min-width: 768px) 704px, 100vw" alt={caption} loading="lazy" decoding="async" className="h-auto w-full rounded-xl border border-black/[0.06] bg-[#f5f5f7]" />
          {caption && <figcaption className="mt-2 text-center text-sm text-[#6e6e73]">{caption}</figcaption>}
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
      <List key={i} className={`flex flex-col gap-3 pl-5 ${block.kind === 'ol' ? 'list-decimal' : 'list-disc'} marker:text-[#6e6e73]`}>
        {block.items.map((item, j) => (
          <li key={j} className="pl-1"><Inline text={item.replace(marker, '')} /></li>
        ))}
      </List>
    );
  });
}
