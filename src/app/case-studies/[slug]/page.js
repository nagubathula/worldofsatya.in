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
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative max-w-4xl mx-auto w-full px-4 sm:px-12">

      <main className="relative z-10 flex flex-col pt-8 sm:pt-14 pb-16">
        <header className="mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-foreground/5 text-foreground/60 text-xs font-medium mb-6 uppercase tracking-widest border border-foreground/[0.06]">
            {study.type}
          </div>
          <h1 className="text-4xl md:text-6xl font-semibold text-foreground tracking-tight leading-[1.1] mb-6">
            {study.title}
          </h1>
          <p className="text-lg md:text-xl text-foreground/60 max-w-3xl leading-relaxed">
            {study.heroDescription}
          </p>
        </header>

        <article className="flex flex-col gap-12 md:gap-16">
          {study.content.map((section, idx) => (
            <section
              key={idx}
              className="p-6 sm:p-8 rounded-3xl bg-background/70 dark:bg-[#121214]/70 backdrop-blur-xl border border-foreground/[0.08] shadow-[0_8px_30px_rgb(0,0,0,0.03)]"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 tracking-tight">
                {section.section}
              </h2>
              <div 
                className="text-base md:text-lg text-foreground/80 leading-relaxed whitespace-pre-wrap max-w-3xl space-y-4"
                dangerouslySetInnerHTML={{ 
                  __html: section.body
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>')
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
