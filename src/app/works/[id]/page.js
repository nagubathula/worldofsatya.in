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
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative w-full">

      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <div className="w-full max-w-4xl mx-auto px-4 sm:px-8 mb-12 sm:mb-16">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground/5 text-xs font-semibold text-foreground/60 uppercase tracking-wider border border-foreground/[0.06]">
              {getIcon(work.category)}
              {work.category}
            </span>
            <span className="text-xs font-semibold text-foreground/40 uppercase tracking-widest">
              {work.tag}
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-foreground mb-6">
            {work.title}
          </h1>
          
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed mb-8 max-w-3xl">
            {work.description}
          </p>

          {hasLink && (
            <LinkComponent
              {...linkProps}
              className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:scale-105 transition-transform duration-300 shadow-md text-sm"
            >
              {work.actionText} <ArrowUpRight size={16} />
            </LinkComponent>
          )}
        </div>
        
        {/* Detail Content Section */}
        <div className="w-full bg-foreground/[0.02] border-t border-foreground/[0.06]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 py-14 sm:py-20">
            {work.image && (
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] relative rounded-3xl overflow-hidden mb-12 bg-foreground/5 border border-foreground/[0.08] shadow-[0_12px_36px_-10px_rgba(0,0,0,0.06)]">
                <Image 
                  src={work.image} 
                  alt={work.title} 
                  fill
                  className="object-cover" 
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 space-y-6">
              {work.content ? (
                <div dangerouslySetInnerHTML={{ __html: work.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <BookOpen size={44} className="mb-4 text-foreground/40" />
                  <p className="text-base text-foreground/60">Detailed case study notes and process breakdown coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
