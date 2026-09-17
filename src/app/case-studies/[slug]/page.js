import { caseStudiesData } from '@/data/caseStudies';
import { notFound } from 'next/navigation';
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

      <main className="relative z-10 flex flex-col pt-8 sm:pt-14 pb-16">
        <header className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-sm bg-[#3e3832]/5 text-[#3e3832]/80 text-xs font-pixel mb-6 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)]">
            {study.type}
          </div>
          <h1 className="text-4xl md:text-6xl font-editorial font-normal text-[#3e3832] tracking-tight leading-[1.1] mb-6">
            {study.title}
          </h1>
          <p className="text-lg md:text-xl text-[#3e3832]/70 max-w-3xl leading-relaxed font-editorial">
            {study.heroDescription}
          </p>
        </header>

        <article className="flex flex-col gap-10 md:gap-14">
          {study.content.map((section, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-8 retro-card"
            >
              <h2 className="text-2xl md:text-3xl font-editorial font-normal text-[#3e3832] mb-4 tracking-tight">
                {section.section}
              </h2>
              <div 
                className="text-base md:text-lg text-[#3e3832]/85 font-editorial leading-relaxed whitespace-pre-wrap max-w-3xl space-y-4"
                dangerouslySetInnerHTML={{ 
                  __html: section.body
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-[#3e3832]">$1</strong>')
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
