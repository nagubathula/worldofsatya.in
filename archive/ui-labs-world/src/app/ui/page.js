import LabIndex from "@/components/uilab/LabIndex";
import { pageMetadata } from "@/lib/metadata";
import { getUiLabBundle } from "@/lib/uiLabServer";
import { PIECE_META } from "@/data/uiLabMeta";

export const metadata = pageMetadata({
  title: "UI Labs | Satya Sai Nagubathula",
  description: `An autonomous craft world of ${PIECE_META.length} live interactive UI specimens, WebGL physics, tactile Web Audio synthesis, shaders, and motion engineering.`,
  path: "/ui",
});

export default async function UIPage() {
  const { sourcesById, gzipKbById, sharedSources } = await getUiLabBundle();

  return (
    <LabIndex
      sourcesById={sourcesById}
      gzipKbById={gzipKbById}
      sharedSources={sharedSources}
    />
  );
}
