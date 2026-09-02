const BASE_URL = "https://worldofsatya.in";

export default function sitemap() {
  const routes = [
    "",
    "/about",
    "/works",
    "/ai-videos",
    "/open-source",
    "/case-studies",
    "/internal-tools",
    "/experience",
    "/achievements",
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
