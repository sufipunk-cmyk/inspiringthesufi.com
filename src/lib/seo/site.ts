/**
 * Single source of truth for the canonical site URL.
 *
 * Used by `metadataBase` in the root layout, by `sitemap.ts`, by
 * `robots.ts`, and indirectly (via `absoluteUrl`) wherever a metadata
 * field needs an absolute URL — Open Graph protocol, Twitter cards,
 * and JSON-LD all reject relative paths in places we care about.
 *
 * Override at deploy time by setting `NEXT_PUBLIC_SITE_URL` on the
 * Vercel project; the `_PUBLIC_` prefix lets it inline at build for
 * any client-side reference, which is fine because the URL itself is
 * not a secret.
 *
 * The trailing slash is stripped so callers can write
 * `${SITE_URL}/path` and never produce a `//path`.
 */

const RAW =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ?? "https://inspiringthesufi.com";

export const SITE_URL = RAW.replace(/\/+$/, "");

/**
 * Resolve a possibly-relative path to an absolute URL on this site.
 * - Absolute http(s) URLs pass through untouched.
 * - Other inputs are joined with `SITE_URL`, ensuring exactly one
 *   slash between the host and the path.
 */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_URL}${path}`;
}