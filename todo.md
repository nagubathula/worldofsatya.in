# UI Lab — improvements

Page: `src/app/ui/page.js` · pieces list: `src/components/UIShowcase.js` (`PIECES` array)

## Priority (biggest win for the effort)

- [ ] **Jump navigation** — sticky chip row (01 Badges · 02 Buttons · …) linking to each piece's existing `id`; highlight the chip for the section in view
- [ ] **"How it's built" toggle** per piece — short code excerpt or 3-step breakdown (e.g. rope = Verlet chain → rigid card pinned to end → torsion counter)
- [ ] **Replay / reset button** on each stage — especially the lanyard wall after the strap unwinds

## Navigation & structure

- [ ] Copy-link "#" button next to each title so `/ui#buttons` can be shared directly
- [ ] Intro meta line: piece count + "last added" date

## Showing engineering depth

- [ ] Source / CodeSandbox link per demo (link portfolio or sandbox, not GitHub)
- [ ] Performance badge per piece (fps, layout shift, bundle size)

## Interaction polish

- [ ] Fade the bottom hint out after the first interaction with a piece
- [ ] Sensor demo: show a QR code "open on your phone" on desktop
- [ ] Lazy-mount demos as they approach the viewport; pause them when off-screen

## New pieces to add

- [ ] Command palette (⌘K) with fuzzy search + keyboard navigation
- [ ] Drag-to-dismiss bottom sheet / drawer with snap points
- [ ] Form micro-interactions: inline validation, password-strength meter, OTP input
- [ ] Data-viz piece: animated chart with hover crosshair
- [ ] Theme-transition demo (scoped to the piece; the site stays light-only)

## Cleanup

- [ ] Decide whether to keep the CrestLogic badge on the lanyard wall (it was dropped from the resume)
- [ ] Move hard-coded colours (`#1d1d1f`, `#515154`, `#6e6e73`, `#8c9385`) into shared tokens
