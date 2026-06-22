# M1.5 — Alcove arch component + matching mosaic-door header icon

## Overview

The arch silhouette that defines this site's frame, traced from a real photograph of the green mosaic door. Both the **`Alcove`** (the pointed-arch frame each archive entry will sit inside) and the **`MosaicDoorIcon`** (the small silhouette beside the wordmark in the header) come out of the same trace, so the two are visibly the same arch in two sizes.

The source photograph is committed to the repository at `source-docs/green-mosaic-door.webp` so the trace is reproducible by anyone reading the project later.

## Goals

1. Capture the *real* arch profile from the photo — not the sufipunk gold-door silhouette, not an AI approximation.
2. Render the alcove correctly at *any* container size — i.e. preserve the lancet character whether the alcove is narrow-and-tall (mobile single column) or wider (desktop 2-up grid).
3. Match the door icon in the header to the same arch profile so the relationship is unmistakable.

## What the photo shows

A hand-made small mosaic door object sitting on a low plinth. The geometry that matters for the trace:

- Outer silhouette is a **lancet** arch (single-curve pointed-equilateral) — *not* the cusped/foiled Moroccan profile of the sufipunk gold door, *not* a horseshoe, *not* a rounded Romanesque.
- Verticals rise from the base for roughly the lower half of the height.
- The shoulders transition smoothly into a sweep up to a softly-pointed apex (apex angle ≈ 110–120°, not razor-sharp).
- Width-to-height ratio of the full arch reads as ~1 : 1.4.

## Architectural decomposition (the discarded approach, then the chosen one)

The naïve approach — render the whole arch as one SVG path, stretched with `preserveAspectRatio="none"` — was tried first and discarded. It works at the photo's natural 1:1.4 aspect, but the moment the container is wider than it is tall (e.g. a two-column desktop alcove ≈ 600 × 200 px), the curve gets horizontally smeared into a flat dome. The lancet character is destroyed.

The chosen approach splits the alcove into two layers:

1. A **fixed-aspect crown SVG** at the top, drawing only the curved portion of the arch (shoulder → apex → shoulder). Its aspect ratio is locked via CSS so the curve always renders at its true proportions, regardless of how wide the container is.
2. A **body div** directly underneath, with CSS left / right / bottom borders extending downward from where the crown ends. This gives variable vertical extension to fit whatever content sits inside, while the arch above keeps its character.

Two paths are drawn in the crown SVG:
- A **closed fill path** (so the parchment-deep niche tint reaches all the way down to the shoulders).
- An **open stroke path** (so only the curve is drawn — not the artificial horizontal closing segment along `y=140` — and the line flows seamlessly into the body's CSS borders).

Stroke uses `vector-effect="non-scaling-stroke"` so the line stays at exactly **1.5 px** regardless of size, matching the body's `border-x-[1.5px]` / `border-b-[1.5px]` pixel-for-pixel.

## Path geometry

### Crown — viewBox 200 × 140 (≈ 10 : 7)

```
M 0 140 C 0 80, 80 30, 100 0 C 120 30, 200 80, 200 140 Z
```

Cubic Bezier, two control points per side. The first control `(0, 80)` keeps the tangent at the shoulder *vertical* (so it joins the body's CSS border seamlessly). The second control `(80, 30)` pulls the curve toward an apex tangent direction of `(20, −30)` — slope `-1.5`, apex angle ≈ 113°. This is the precise reason cubic was chosen over quadratic: a single quadratic control point cannot give both a vertical tangent at the shoulder *and* a steep angle at the apex; cubic can. The lancet character the photograph shows requires both.

### Icon — viewBox 24 × 30

Same cubic-Bezier shape, scaled and simplified, with an inner "doorway" carved out via `fill-rule="evenodd"` so the silhouette reads as a *door*, not just a triangle:

```
M 2 30 L 2 17 C 2 11, 8 4, 12 1 C 16 4, 22 11, 22 17 L 22 30 Z
M 9 30 L 9 22 C 9 19, 11 16, 12 15 C 13 16, 15 19, 15 22 L 15 30 Z
```

At small natural sizes (≈24–32 px) the container's aspect ratio stays close to the icon's native 24:30, so the icon doesn't suffer the stretching problem the alcove does. The single-path approach is therefore fine for the icon.

## API

```tsx
<Alcove tone="default" | "deep">
  …content…
</Alcove>
```

- `tone="default"` — quiet, near-transparent niche tint (`parchment-deep / 0.30`).
- `tone="deep"` — slightly more present foxed-paper ground (`parchment-deep / 0.55`), used sparingly for feature alcoves.

```tsx
<MosaicDoorIcon className="…" />
```

Inherits colour via `currentColor`. Default usage in `SiteHeader` is at `h-7 / sm:h-8` (≈ 28–32 px tall) in the same `text-green` colour as the wordmark.

## Acceptance criteria

- [x] Source photograph committed to `source-docs/green-mosaic-door.webp`.
- [x] `Alcove` renders a clearly-pointed lancet arch (not a flat dome) at desktop 2-up width (≈ 600 px).
- [x] `Alcove` renders the same arch profile at mobile single-column width (≈ 358 px).
- [x] Crown stroke joins the body's CSS borders seamlessly at the shoulders (no visible gap).
- [x] `MosaicDoorIcon` appears left of the wordmark in `SiteHeader`, in `text-green`, at the right text-relative size on both desktop and mobile.
- [x] Both the alcove and the icon read as the *same* arch in two sizes when viewed side by side.
- [x] M1 preview homepage demonstrates the alcove with deliberately generic placeholder text — no pretend archive entries.
- [x] `bun run build` clean.
- [x] Browser-verified at 1440×900 and 390×844.

## Status / open questions

- **Status**: complete.
- **Open**: whether to add a *third* tone (e.g. `tone="feature"` with a slightly stronger niche tint *and* a thicker stroke) for the homepage hero alcove that lands in M2 — defer until the homepage spec is ready.