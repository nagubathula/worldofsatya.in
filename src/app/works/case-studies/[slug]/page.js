import { notFound, permanentRedirect } from "next/navigation";
import { allWorks } from "@/data/works";

export function generateStaticParams() {
  return allWorks
    .filter((work) => work.study)
    .flatMap((work) => [
      { slug: work.study },
      ...(work.studyAliases || []).map((slug) => ({ slug })),
    ]);
}

// Case studies now live on their work's own page.
export default async function LegacyCaseStudy({ params }) {
  const { slug } = await params;
  const work = allWorks.find(
    (entry) => entry.study === slug || entry.studyAliases?.includes(slug)
  );
  if (!work) notFound();
  permanentRedirect(`/works/${work.slug}`);
}
