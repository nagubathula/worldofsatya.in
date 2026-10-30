const SHARE_IMAGE = { url: "/main.jpeg", width: 800, height: 800, alt: "Satya Sai Nagubathula" };

// Next replaces (not merges) openGraph and twitter from the root layout, so each
// page restates them; otherwise shared links show the home page title and URL.
export function pageMetadata({ title, description, path }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "World of Satya", images: [SHARE_IMAGE], type: "website" },
    // The share image is a square portrait: the small card shows it whole, the large one crops it.
    twitter: { card: "summary", title, description, images: [SHARE_IMAGE.url] },
  };
}
