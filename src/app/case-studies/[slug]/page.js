import { permanentRedirect } from "next/navigation";
import { caseStudiesData } from "@/data/caseStudies";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return caseStudiesData.map(({ slug }) => ({ slug }));
}

export default async function LegacyCaseStudy({ params }) {
  const { slug } = await params;
  if (!caseStudiesData.some((study) => study.slug === slug)) notFound();
  permanentRedirect(`/works/case-studies/${slug}`);
}
