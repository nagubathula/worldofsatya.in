import { notFound } from "next/navigation";
import SpecimenTheater from "@/components/uilab/SpecimenTheater";
import { PIECE_META, getPieceBySlug } from "@/data/uiLabMeta";
import { pageMetadata } from "@/lib/metadata";
import { getUiLabBundle } from "@/lib/uiLabServer";

export function generateStaticParams() {
  return PIECE_META.map((piece) => ({ slug: piece.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const piece = getPieceBySlug(slug);
  if (!piece) return {};

  return pageMetadata({
    title: `${piece.title} — UI Labs | Satya Sai Nagubathula`,
    description: piece.description,
    path: `/ui/${piece.id}`,
  });
}

export default async function SpecimenTheaterPage({ params }) {
  const { slug } = await params;
  const pieceIndex = PIECE_META.findIndex((p) => p.id === slug);
  if (pieceIndex < 0) notFound();

  const piece = PIECE_META[pieceIndex];
  const totalCount = PIECE_META.length;
  const prevPiece = PIECE_META[(pieceIndex - 1 + totalCount) % totalCount];
  const nextPiece = PIECE_META[(pieceIndex + 1) % totalCount];

  const { sourcesById, gzipKbById, sharedSources } = await getUiLabBundle();

  return (
    <SpecimenTheater
      key={piece.id}
      piece={piece}
      pieceIndex={pieceIndex}
      totalCount={totalCount}
      prevPiece={prevPiece}
      nextPiece={nextPiece}
      files={sourcesById[piece.id] || []}
      gzipKb={gzipKbById[piece.id]}
      sharedSources={sharedSources}
    />
  );
}
