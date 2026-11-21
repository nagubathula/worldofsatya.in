import { allWorks } from "@/data/works";
import { PIECE_META } from "@/data/uiLabMeta";

const BASE_URL = "https://worldofsatya.in";

export default function sitemap() {
  const routes = ["", "/about", "/works", "/ui", "/ui/notes", "/ui/primitives", "/gallery", "/achievements",
    ...PIECE_META.map(({ id }) => `/ui/${id}`),
    ...allWorks.map(({ slug }) => `/works/${slug}`),
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
