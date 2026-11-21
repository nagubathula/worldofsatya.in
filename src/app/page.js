import OnePageHome from "@/components/onepage/OnePageHome";
import { allWorks } from "@/data/works";
import { caseStudiesData } from "@/data/caseStudies";
import { EXPERIENCES } from "@/data/experiences";
import { galleryWorks } from "@/data/galleryWorks";

export const metadata = {
  alternates: { canonical: "/" },
};

// The home page is a one-pager: every project and article opens in an overlay
// on this page, so only what the page shows is sent down, not the archive.
const PROJECTS = ["openweave", "contentflow", "billjot", "notbad", "toothpaste"];
const WRITING = ["design-to-code", "why-i-choose-minimal-design", "from-doodles-to-design"];
// Opened from the Impact stories but not listed under Projects.
const EXTRAS = ["tailus", "gen-ai-production"];
const ARTIFACTS = 12;

function pack(work, study) {
  return {
    slug: work.slug,
    title: work.title,
    description: work.description,
    category: work.category,
    tag: work.tag || work.category,
    image: study?.image || work.image || "",
    link: work.link || "",
    actionText: work.actionText || "",
    study: study
      ? {
          title: study.title,
          type: study.type || "",
          heroDescription: study.heroDescription || "",
          image: study.image || work.image || "",
          meta: study.meta || [],
          highlights: study.highlights || [],
          content: (study.content || []).map(({ section, body }) => ({ section, body })),
        }
      : null,
  };
}

const studyFor = (work) => caseStudiesData.find((s) => s.slug === work.study);

function bySlugs(slugs) {
  return slugs.map((slug) => allWorks.find((w) => w.slug === slug))
    .filter(Boolean)
    .map((work) => pack(work, studyFor(work)));
}

function projects() {
  return PROJECTS.map((slug) => allWorks.find((w) => w.slug === slug))
    .filter(Boolean)
    .map((work) => pack(work, studyFor(work)));
}

function writing() {
  return WRITING.map((study) => allWorks.find((w) => w.study === study))
    .filter(Boolean)
    .map((work) => {
      const study = studyFor(work);
      const date = study?.meta?.find((m) => /date|published/i.test(m.label))?.value || "";
      return { ...pack(work, study), tag: "Writing", date };
    });
}

// A mix across the archive's categories, so the collage isn't all posters.
function artifacts() {
  const withArt = galleryWorks.filter((g) => g.src && g.width && g.height);
  const byCat = new Map();
  for (const g of withArt) {
    if (!byCat.has(g.category)) byCat.set(g.category, []);
    byCat.get(g.category).push(g);
  }
  const lists = [...byCat.values()];
  const out = [];
  for (let i = 0; out.length < ARTIFACTS && lists.some((l) => l[i]); i++) {
    for (const l of lists) if (l[i] && out.length < ARTIFACTS) out.push(l[i]);
  }
  return out.map(({ id, title, category, src, width, height, description }) => ({ id, title, category, src, width, height, description }));
}

export default function Home() {
  return (
    <OnePageHome
      projects={projects()}
      writing={writing()}
      extras={bySlugs(EXTRAS)}
      experiences={EXPERIENCES}
      artifacts={artifacts()}
    />
  );
}
