import { allWorks } from "@/data/works";

const BASE_URL = "https://worldofsatya.in";

export default function sitemap() {
  const routes = ["", "/about", "/works", "/ui", "/gallery", "/achievements",
    ...allWorks.map(({ slug }) => `/works/${slug}`),
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
