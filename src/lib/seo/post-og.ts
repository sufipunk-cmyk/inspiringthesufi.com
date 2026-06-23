/**
 * Per-post Open Graph image deriver.
 *
 * Resolution order:
 *   1. `post.hero` from frontmatter — authoritative if Naz set one.
 *   2. `public/archive/{nn}/image-1.{jpeg|jpg|png|webp}` — the
 *      Squarespace migration left these on disk for 25 of 49 posts.
 *      `{nn}` is the post's slug prefix, e.g. "01" from "01-al-karim",
 *      because `post.postNumber` can carry a slash for the dual-Name
 *      Post 45/46.
 *   3. Site default `/og/green-mosaic-door.webp` — quiet fallback for
 *      the 24 posts with no hero on file.
 *
 * Server-only — uses `fs` synchronously at build/render time. The
 * archive route is statically generated, so all of these checks happen
 * once during `next build` and the resolved paths are baked into the
 * prerendered HTML.
 */

import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";

import type { ArchivePost } from "@/lib/archive/types";
import { SITE_DEFAULT_OG } from "./og";

const PUBLIC_ROOT = path.resolve(process.cwd(), "public");
const HERO_EXTS = ["jpeg", "jpg", "png", "webp"] as const;

/** "01-al-karim" → "01"; "45-al-zahir-and-al-batin" → "45". */
function slugPrefix(slug: string): string {
  const m = slug.match(/^(\d+)/);
  return m ? m[1].padStart(2, "0") : slug;
}

/**
 * Pick a public-asset path for the post's OG image, falling back to
 * the site default when nothing is found on disk.
 */
export function postOgImagePath(post: ArchivePost): string {
  // 1. Frontmatter hero wins outright.
  if (post.hero && post.hero.length > 0) {
    return post.hero.startsWith("/") ? post.hero : `/${post.hero}`;
  }

  // 2. Look on disk under public/archive/{nn}/image-1.{ext}.
  const nn = slugPrefix(post.slug);
  const dir = path.join(PUBLIC_ROOT, "archive", nn);
  if (fs.existsSync(dir)) {
    for (const ext of HERO_EXTS) {
      const candidate = path.join(dir, `image-1.${ext}`);
      if (fs.existsSync(candidate)) {
        return `/archive/${nn}/image-1.${ext}`;
      }
    }
  }

  // 3. Site fallback.
  return SITE_DEFAULT_OG.src;
}

/**
 * Same as postOgImagePath but returns `true` only if the post has its
 * own on-disk or frontmatter-supplied hero (i.e. did NOT fall back to
 * the site default). Used by the SEO lint to report hero coverage.
 */
export function postHasOwnHero(post: ArchivePost): boolean {
  return postOgImagePath(post) !== SITE_DEFAULT_OG.src;
}