import PrimitivesShelf from "@/components/uilab/PrimitivesShelf";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Primitives Shelf — UI Labs | Satya Sai Nagubathula",
  description: "Reusable hooks, spring presets, gesture math helpers, and procedural audio utilities powering UI Labs.",
  path: "/ui/primitives",
});

export default function UILabPrimitivesPage() {
  return <PrimitivesShelf />;
}
