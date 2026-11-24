# UI Lab — improvements

Page: `src/app/ui/page.js` · pieces list: `src/components/UIShowcase.js` (`PIECE_META` / `DEMOS`)

## Priority (biggest win for the effort)

- [x] **Jump navigation** — sticky chip row (01 Badges · 02 Buttons · …) linking to each piece's existing `id`; highlight the chip for the section in view
- [x] **"How it's built" toggle** per piece — short code excerpt or 3-step breakdown (e.g. rope = Verlet chain → rigid card pinned to end → torsion counter)
- [x] **Replay / reset button** on each stage — especially the lanyard wall after the strap unwinds

## Navigation & structure

- [x] Copy-link "#" button next to each title so `/ui#buttons` can be shared directly
- [x] Intro meta line: piece count + "last added" date

## Showing engineering depth

- [x] Source / CodeSandbox link per demo (link portfolio or sandbox, not GitHub)
- [x] Performance badge per piece (fps, layout shift, bundle size)

## Interaction polish

- [x] Fade the bottom hint out after the first interaction with a piece
- [x] Sensor demo: show a QR code "open on your phone" on desktop
- [x] Lazy-mount demos as they approach the viewport; pause them when off-screen

## New pieces to add

- [x] Command palette (⌘K) with fuzzy search + keyboard navigation
- [x] Drag-to-dismiss bottom sheet / drawer with snap points
- [x] Form micro-interactions: inline validation, password-strength meter, OTP input
- [x] Data-viz piece: animated chart with hover crosshair
- [x] Theme-transition demo (scoped to the piece; the site stays light-only)

## Cleanup

- [x] Decide whether to keep the CrestLogic badge on the lanyard wall (rebranded to Billjot to match resume)
- [x] Move hard-coded colours (`#1d1d1f`, `#515154`, `#6e6e73`, `#8c9385`) into shared tokens
