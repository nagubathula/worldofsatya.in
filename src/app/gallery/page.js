import GalleryExperience from "@/components/gallery/GalleryExperience";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Gallery | Satya Sai Nagubathula",
  description: "A spatial visual archive of posters, interfaces, motion studies, and 3D renders.",
  path: "/gallery",
});

export default function GalleryPage() {
  return <GalleryExperience />;
}
