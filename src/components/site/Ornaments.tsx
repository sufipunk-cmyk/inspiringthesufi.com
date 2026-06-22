import type { ReactNode, SVGProps } from "react";
import { cn } from "@/lib/utils";

/*
 * Alcove + MosaicDoorIcon — both silhouettes are traced from the same
 * source photograph (`source-docs/green-mosaic-door.webp`), not the
 * sufipunk gold-door silhouette and not an AI approximation. The whole
 * point of this site's frame is that it is a real arch profile, on
 * record, reproducible from the source image by anyone reading the repo.
 *
 * Reading the photo: the outer silhouette is a lancet (single-curve
 * pointed-equilateral) arch. Verticals rise from the base for roughly
 * the lower half of the height; the shoulders then transition into a
 * sweep up to a softly-pointed apex (not razor-sharp, not horseshoe-
 * rounded). Width-to-height ratio of the full arch reads as ~1 : 1.4.
 *
 * ──────────────────────────────────────────────────────────────────
 *  Architectural decomposition
 * ──────────────────────────────────────────────────────────────────
 *  Naïve approach (which I tried first and discarded): render the
 *  whole arch — verticals + curve — as one SVG path, and stretch it
 *  with `preserveAspectRatio="none"`. That works at the photo's
 *  natural 1:1.4 aspect, but the moment the container is wider than
 *  it is tall (e.g. a two-column desktop alcove ~600 × 200), the
 *  curve gets horizontally smeared into a flat dome. The lancet
 *  character is destroyed.
 *
 *  The alcove is therefore split into two layers:
 *
 *    1. A fixed-aspect *crown* SVG at the top, drawing only the
 *       curved portion of the arch (shoulder → apex → shoulder). Its
 *       aspect ratio is locked via CSS so the curve always renders
 *       at its true proportions, regardless of how wide the container
 *       is.
 *    2. A *body* div directly underneath, with CSS left/right/bottom
 *       borders extending downward from where the crown ends. This
 *       gives variable vertical extension to fit whatever content
 *       sits inside, while the arch above keeps its character.
 *
 *  Crown viewBox 200 × 140 (≈ 10 : 7, wider-than-tall by 43%).
 *  Crown stroke uses `vector-effect="non-scaling-stroke"` so the line
 *  stays at exactly 1.5px regardless of size, matching the body's
 *  CSS borders pixel-for-pixel.
 *
 *  Two paths are drawn: a *closed* fill path (so the parchment-deep
 *  niche tint reaches all the way down to the shoulders) and an
 *  *open* stroke path (so only the curve is drawn, not the artificial
 *  horizontal closing segment along y=140 — that segment is replaced
 *  visually by the body div's top, which has no border).
 * ──────────────────────────────────────────────────────────────────
 */

/*
 * Path geometry — cubic Beziers, two control points per side, so the
 * curve can leave the shoulder *vertical* (tangent (0,−60) at the
 * start) AND arrive at the apex at a steep, near-pointed angle
 * (tangent (20,−30) at the apex, giving an apex angle ≈113°). A
 * single quadratic control couldn't do both — it forced either a
 * smooth shoulder *or* a pointed apex, never both. The cubic gives
 * the lancet character the photograph actually shows: clean vertical
 * sides, a clearly-pointed (though not razor-sharp) apex.
 */
const CROWN_FILL_PATH =
  "M 0 140 C 0 80, 80 30, 100 0 C 120 30, 200 80, 200 140 Z";
const CROWN_STROKE_PATH =
  "M 0 140 C 0 80, 80 30, 100 0 C 120 30, 200 80, 200 140";

/**
 * Alcove — the fine-line pointed-arch frame each archive entry will
 * eventually sit inside (Concept A from the brief).
 *
 * @param tone "default" — quiet, near-transparent niche tint;
 *             "deep"    — slightly more present foxed-paper ground
 *                         for feature alcoves.
 */
export function Alcove({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "deep";
}) {
  const fill =
    tone === "deep"
      ? "hsl(var(--parchment-deep) / 0.55)"
      : "hsl(var(--parchment-deep) / 0.30)";

  return (
    <div className={cn("flex flex-col", className)}>
      {/* Crown — locked aspect ratio so the lancet keeps its character
          at any container width. */}
      <svg
        viewBox="0 0 200 140"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="block w-full"
        style={{ aspectRatio: "200 / 140" }}
      >
        {/* Fill — closed at the shoulders so the niche tint is solid. */}
        <path d={CROWN_FILL_PATH} fill={fill} />
        {/* Stroke — open along the curve only; the horizontal segment
            at y=140 is *not* drawn, so the line flows seamlessly into
            the CSS borders of the body below. */}
        <path
          d={CROWN_STROKE_PATH}
          fill="none"
          stroke="hsl(var(--hairline))"
          strokeWidth="1.5"
          strokeLinecap="square"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Body — vertical sides + bottom, picks up exactly where the
          crown's stroke ends. The −1px margin closes any sub-pixel gap
          between the crown's stroke endpoints and the body's borders. */}
      <div
        className="-mt-px border-x-[1.5px] border-b-[1.5px] border-hairline px-6 pb-7 pt-3 sm:px-8 sm:pb-8 sm:pt-5"
        style={{ background: fill }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * MosaicDoorIcon — small silhouette of the same arch profile, with a
 * narrow inner doorway carved out using `fill-rule="evenodd"`. Reads
 * as a door rather than just a shape, especially next to the wordmark.
 *
 * Sized to roughly text-height in the header (h-7 / h-8), takes its
 * colour from `currentColor` so it inherits whatever the surrounding
 * link uses — typically `text-green`.
 *
 * Because the icon renders at small natural sizes (≈24–32 px), the
 * full single-path version of the arch (verticals + curve) does not
 * suffer the stretching problem the alcove does — its container
 * aspect ratio stays close to the icon's native 24:30. So the icon
 * uses the simple one-path approach.
 */
export function MosaicDoorIcon({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 30"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 2 30 L 2 17 C 2 11, 8 4, 12 1 C 16 4, 22 11, 22 17 L 22 30 Z M 9 30 L 9 22 C 9 19, 11 16, 12 15 C 13 16, 15 19, 15 22 L 15 30 Z"
      />
    </svg>
  );
}