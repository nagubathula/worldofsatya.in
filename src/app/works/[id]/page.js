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
      case "Project": return <Briefcase size={14} className="mr-1" />;
      case "Case Study": return <BookOpen size={14} className="mr-1" />;
      case "Open Source": return <Code size={14} className="mr-1" />;
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

      <main className="relative z-10 flex flex-col pt-16 sm:pt-24 pb-20">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-12 mb-16 sm:mb-20">
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            <span className="inline-flex items-center px-4 py-1.5 rounded-sm bg-[#3e3832]/5 text-sm font-semibold text-[#3e3832]/80 uppercase tracking-widest border-2 border-[#3e3832]/25 shadow-[2px_2px_0px_rgba(62,56,50,0.15)] font-pixel">
              {getIcon(work.category)}
              {work.category}
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-normal tracking-tight text-[#3e3832] mb-12 text-center leading-[1.1] max-w-5xl mx-auto">
            {work.title}
          </h1>
          
          <div className="flex justify-center mb-16">
            {hasLink && (
              <LinkComponent
                {...linkProps}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#3e3832] text-[#f4ebd8] rounded-sm border-2 border-[#3e3832] font-pixel shadow-[4px_4px_0px_rgba(62,56,50,0.35)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_rgba(62,56,50,0.4)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_rgba(62,56,50,0.4)] transition-all duration-150 text-base"
              >
                {work.actionText} <ArrowUpRight size={18} />
              </LinkComponent>
            )}
          </div>
        </div>
        
        {/* Detail Content Section */}
        <div className="w-full">
          <div className="max-w-7xl mx-auto px-6 sm:px-12">
            {work.image && (
              <div className="w-full relative rounded-lg overflow-hidden mb-20 bg-foreground/5 shadow-2xl flex items-center justify-center">
                <Image 
                  src={work.image} 
                  alt={work.title} 
                  width={1920}
                  height={1080}
                  className="w-full h-auto object-contain sepia-[0.2] contrast-125" 
                />
              </div>
            )}
            
            <div className="prose prose-xl prose-p:leading-relaxed prose-headings:font-editorial prose-headings:font-normal prose-a:text-foreground max-w-none text-foreground/90 sm:columns-2 lg:columns-3 gap-12 mt-12">
              {work.content ? (
                <div dangerouslySetInnerHTML={{ __html: work.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60 col-span-full">
                  <BookOpen size={44} className="mb-4 text-foreground/40" />
                  <p className="text-xl">Detailed case study notes and process breakdown coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <div className="border-t border-foreground/10">
        <Footer />
      </div>
    </div>
  );
}
