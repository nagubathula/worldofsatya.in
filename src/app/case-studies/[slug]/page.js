import { caseStudiesData } from '@/data/caseStudies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return caseStudiesData.map((study) => ({
    slug: study.slug,
  }));
}

export default function CaseStudyPage({ params }) {
  const study = caseStudiesData.find((s) => s.slug === params.slug);

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-4xl mx-auto w-full px-4 sm:px-12">
      {/* Noise Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <main className="relative z-10 flex flex-col pt-12 sm:pt-24 pb-16">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-black/5 text-black/70 hover:text-black hover:bg-white transition-all mb-8 sm:mb-12 w-fit font-medium text-xs sm:text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        
        <header className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/5 text-black/60 text-xs font-medium mb-6 uppercase tracking-widest">
            {study.type}
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-black tracking-tight leading-[1.1] mb-6">
            {study.title}
          </h1>
          <p className="text-lg md:text-xl text-black/60 max-w-3xl leading-relaxed">
            {study.heroDescription}
          </p>
        </header>

        <article className="flex flex-col gap-12 md:gap-16">
          {study.content.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl md:text-3xl font-semibold text-black mb-4 tracking-tight">
                {section.section}
              </h2>
              {/* Parse markdown-like syntax simply or just render body. For bold syntax we can do a simple replacement if needed, but for now we'll render it safely */}
              <div 
                className="text-base md:text-lg text-black/70 leading-relaxed whitespace-pre-wrap max-w-3xl"
                dangerouslySetInnerHTML={{ 
                  __html: section.body
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n\n/g, '<br/><br/>')
                }}
              />
            </section>
          ))}
        </article>
      </main>
      
      <Footer />
    </div>
  );
}
