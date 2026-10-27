const SHARE_IMAGE = { url: "/main.jpeg", width: 800, height: 800, alt: "Satya Sai Nagubathula" };

// Next replaces (not merges) openGraph and twitter from the root layout, so each
// page restates them; otherwise shared links show the home page title and URL.
export function pageMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "World of Satya", images: [SHARE_IMAGE], type: "website" },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
  };
}
