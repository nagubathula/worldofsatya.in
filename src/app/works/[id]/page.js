import { allWorks } from "@/data/works";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, Code, Briefcase } from "lucide-react";
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

  const isExternal = work.link.startsWith('http');
  const LinkComponent = isExternal ? 'a' : Link;
  const linkProps = isExternal 
    ? { href: work.link, target: "_blank", rel: "noopener noreferrer" }
    : { href: work.link };

  return (
    <div className="min-h-screen text-foreground font-sans selection:bg-foreground selection:text-background relative w-full">
      {/* Noise Overlay */}
      <svg className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-difference w-full h-full">
        <filter id="noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#noise)" />
      </svg>

      <main className="relative z-10 flex flex-col pt-12 sm:pt-20">
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 mb-4">
          <Link 
            href="/works" 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/60 backdrop-blur-md border border-foreground/5 text-foreground/70 hover:text-foreground hover:bg-background transition-all text-xs sm:text-sm font-medium"
          >
            <ArrowLeft size={16} /> Back to Works
          </Link>
        </div>

        <div className="w-full max-w-3xl mx-auto px-4 sm:px-8 mt-8 mb-12 sm:mb-20">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-foreground/5 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
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
          
          <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed mb-10 max-w-2xl">
            {work.description}
          </p>

          <LinkComponent 
            {...linkProps}
            className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background rounded-full font-medium hover:scale-105 transition-transform duration-300 shadow-md"
          >
            {work.actionText} <ArrowUpRight size={18} />
          </LinkComponent>
        </div>
        
        {/* Detail Content Section */}
        <div className="w-full border-t border-foreground/5 bg-foreground/[0.02]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
            {work.image && (
              <div className="w-full aspect-[16/9] sm:aspect-[21/9] relative rounded-2xl overflow-hidden mb-12 bg-foreground/10">
                <Image 
                  src={work.image} 
                  alt={work.title} 
                  layout="fill" 
                  objectFit="cover" 
                  className="rounded-2xl" 
                />
              </div>
            )}
            
            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80">
              {work.content ? (
                <div dangerouslySetInnerHTML={{ __html: work.content }} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                  <BookOpen size={48} className="mb-4 text-foreground/40" />
                  <p className="text-lg">Detailed case study coming soon.</p>
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
