import { allWorks } from "@/data/works";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Code, Briefcase } from "lucide-react";
import Footer from "@/components/Footer";
import Image from "next/image";

// Pre-generate routes at build time
export function generateStaticParams() {
  return allWorks.map((work) => ({
    id: work.id,
  }));
}

export default async function WorkDetailPage({ params }) {
  const { id } = await params;
  
  const work = allWorks.find((w) => w.id === id);

  if (!work) {
    notFound();
  }

  const getIcon = (category) => {
    switch (category) {
      case "Project": return <Briefcase size={14} className="mr-1.5" />;
      case "Open Source": return <Code size={14} className="mr-1.5" />;
      default: return null;
    }
  };

  const hasLink = Boolean(work.link);
  const isExternal = hasLink && work.link.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  const linkProps = isExternal
    ? { href: work.link, target: "_blank", rel: "noopener noreferrer" }
    : { href: work.link };

  return (
    <div className="min-h-screen relative w-full">
      <main className="relative z-10 flex flex-col pt-24 sm:pt-32 pb-12 sm:pb-20">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-12 mb-8 sm:mb-16">
          <Link href="/works" className="mb-8 inline-block text-sm text-[#515154] hover:text-black">← All works</Link>
          <div className="flex flex-wrap items-center justify-center gap-3 mb-6 sm:mb-8">
            <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-[#f5f5f7] text-xs sm:text-[13px] font-sans font-medium text-[#86868b] uppercase tracking-wider border border-black/[0.04]">
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
            {work.image && (
              <div className="w-full relative rounded-3xl overflow-hidden mb-12 sm:mb-20 bg-[#f5f5f7] shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center justify-center border border-black/[0.06]">
                <Image 
                  src={work.image} 
                  alt={work.title} 
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain" 
                />
              </div>
            )}
            
            <div className="prose prose-base sm:prose-lg font-sans text-[#515154] leading-relaxed max-w-none sm:columns-2 lg:columns-3 gap-8 sm:gap-12 mt-8 sm:mt-12">
              {work.content ? (
                <div dangerouslySetInnerHTML={{ __html: work.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center text-[#86868b] col-span-full">
                  <BookOpen size={40} className="mb-4 text-neutral-300" />
                  <p className="text-lg">Detailed project notes and process breakdown coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="border-t border-black/[0.06]">
        <Footer />
      </div>
    </div>
  );
}
