import FieldNotesView from "@/components/uilab/FieldNotesView";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Field Notes — UI Labs | Satya Sai Nagubathula",
  description: "Interactive craft notes on interruptible springs, asymptotic rubber-banding, Web Audio synthesis, and 60fps UI discipline.",
  path: "/ui/notes",
});

export default function UILabNotesPage() {
  return <FieldNotesView />;
}
