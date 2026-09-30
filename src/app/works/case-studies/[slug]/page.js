import { caseStudiesData } from '@/data/caseStudies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/components/Footer';

export async function generateStaticParams() {
  return caseStudiesData.map((study) => ({
    slug: study.slug,
  }));
}

export default async function CaseStudyPage({ params }) {
  const { slug } = await params;
  const study = caseStudiesData.find((s) => s.slug === slug);

  if (!study) {
    notFound();
  }

  return (
    <div className="min-h-screen relative max-w-4xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-32 pb-16">
        <Link href="/works" className="mb-8 w-fit text-sm text-[#515154] hover:text-black">← All works</Link>
        <header className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f5f5f7] text-[#86868b] text-xs font-sans mb-6 uppercase tracking-wider font-medium border border-black/[0.04]">
            {study.type}
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-sans font-semibold text-[#1d1d1f] tracking-[-0.03em] leading-[1.08] mb-5">
            {study.title}
          </h1>
          <p className="text-base md:text-lg text-[#86868b] max-w-3xl leading-relaxed font-sans">
            {study.heroDescription}
          </p>
        </header>

        <article className="flex flex-col gap-6 md:gap-8">
          {study.content.map((section, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
            >
              <h2 className="text-xl md:text-2xl font-sans font-semibold text-[#1d1d1f] mb-4 tracking-tight">
                {section.section}
              </h2>
              <div 
                className="text-base text-[#515154] font-sans leading-relaxed whitespace-pre-wrap max-w-3xl space-y-4"
                dangerouslySetInnerHTML={{ 
                  __html: section.body
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#1d1d1f]">$1</strong>')
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

