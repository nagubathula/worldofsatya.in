import CaseStudies from "@/components/CaseStudies";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Case Studies | Satya Sai Nagubathula — Design Technologist & AI Engineer",
  description: "In-depth case studies detailing interface architecture, AI engineering pipelines, and product design systems.",
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen relative max-w-7xl mx-auto w-full px-4 sm:px-12">
      <main className="relative z-10 flex flex-col pt-8 sm:pt-14">
        <CaseStudies />
      </main>
      <Footer />
    </div>
  );
}
