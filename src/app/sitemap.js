import { allWorks } from "@/data/works";
import { caseStudiesData } from "@/data/caseStudies";

const BASE_URL = "https://worldofsatya.in";

export default function sitemap() {
  const routes = ["", "/about", "/works", "/experience", "/achievements",
    ...allWorks.map(({ id }) => `/works/${id}`),
    ...caseStudiesData.map(({ slug }) => `/works/case-studies/${slug}`),
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
