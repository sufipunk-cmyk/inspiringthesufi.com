/**
 * Open Graph image map for the four standard pages.
 *
 * Each value is a *site-relative* path to a real photograph already
 * present in `/public/`. Per Naz's M6 directive, every page declares
 * its own OG image rather than inheriting one site-wide default — this
 * file is the single source of truth for those declarations.
 *
 * Per-archive-post OG images live in `post-og.ts` because they depend
 * on per-post filesystem inspection.
 *
 * The two atmospheric photographs in play here:
 *
 *   green-mosaic-door.webp
 *     The literal door this entire site's silhouette is traced from.
 *     Used as the OG image for the homepage and /about — the door is
 *     the site's primary visual identity. Copied into /public/og/
 *     during M6 (it previously lived only in /source-docs/).
 *
 *   return-to-the-sanctuary.jpg
 *     The gold-doors mosaic that already appears in the archive's
 *     footer threshold. Used on /play-with-me ("as many ways to turn
 *     toward the Divine as there are people seeking" — many doors)
 *     and on /archive (which is literally a wall of 49 doors).
 */

export const OG_IMAGES = {
  home: {
    src: "/og/green-mosaic-door.webp",
    alt: "A green mosaic door — the silhouette this site's archway is traced from.",
    width: 1200,
    height: 1500,
    type: "image/webp",
  },
  about: {
    src: "/og/green-mosaic-door.webp",
    alt: "A green mosaic door — the silhouette this site's archway is traced from.",
    width: 1200,
    height: 1500,
    type: "image/webp",
  },
  playWithMe: {
    src: "/threshold/return-to-the-sanctuary.jpg",
    alt: "A wall of golden doors set in deep teal mosaic — many ways in.",
    width: 1600,
    height: 900,
    type: "image/jpeg",
  },
  archive: {
    src: "/threshold/return-to-the-sanctuary.jpg",
    alt: "A wall of golden doors — the archive's threshold image.",
    width: 1600,
    height: 900,
    type: "image/jpeg",
  },
} as const;

/** The site-default fallback used by individual archive posts that
 *  have no on-disk hero image. Same image as the homepage. */
export const SITE_DEFAULT_OG = OG_IMAGES.home;