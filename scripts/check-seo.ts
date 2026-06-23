/**
 * scripts/check-seo.ts
 *
 * Build-time lint for the M6 SEO-foundations layer. Same shape as the
 * other check-* lints. Fails the build if any of the SEO contracts
 * Naz signed off on regress.
 *
 * What we enforce:
 *   1. src/app/sitemap.ts and src/app/robots.ts both exist and import
 *      SITE_URL from @/lib/seo/site (single canonical host).
 *   2. The four standard pages each declare an openGraph.images array
 *      sourced from OG_IMAGES (per-page OG image, no site-wide default).
 *   3. The archive [slug] page imports articleJsonLd + postOgImagePath
 *      and renders an `application/ld+json` <script> in its body.
 *   4. The OG_IMAGES map's referenced public files all exist on disk.
 *   5. Reports per-post hero coverage (informational): N/49 posts have
 *      either a frontmatter hero or a public/archive/{nn}/image-1.* on
 *      disk; the rest fall back to the site default.
 *   6. AWAITING NAZ'S APPROVAL markers in M6-touched files (informational).
 *
 * Run: `bun run check:seo`.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import matter from "gray-matter";

import { OG_IMAGES, SITE_DEFAULT_OG } from "../src/lib/seo/og";

// Note: we deliberately do NOT import from `@/lib/archive/loader` or
// `@/lib/seo/post-og` here — both are "server-only", which means Bun
// refuses to load them outside a Next render context. The hero-coverage
// check below walks `content/archive/` and `public/archive/` directly,
// matching the resolution rules in `src/lib/seo/post-og.ts`.
const HERO_EXTS = ["jpeg", "jpg", "png", "webp"] as const;
function slugPrefix(slug: string): string {
  const m = slug.match(/^(\d+)/);
  return m ? m[1].padStart(2, "0") : slug;
}

const ROOT = path.resolve(__dirname, "..");
const PUBLIC_ROOT = path.join(ROOT, "public");

let errors = 0;
let warnings = 0;

console.log("\n  Inspiring the Sufi — SEO foundations lint");
console.log("  ─────────────────────────────────────────");

// 1. sitemap.ts + robots.ts present and importing SITE_URL.
const sitemapPath = path.join(ROOT, "src", "app", "sitemap.ts");
const robotsPath = path.join(ROOT, "src", "app", "robots.ts");

for (const [label, p] of [
  ["sitemap.ts", sitemapPath],
  ["robots.ts", robotsPath],
] as const) {
  if (!fs.existsSync(p)) {
    console.log(`  ❌  src/app/${label} is missing.`);
    errors += 1;
    continue;
  }
  const src = fs.readFileSync(p, "utf8");
  if (!/import\s*\{[^}]*SITE_URL[^}]*\}\s*from\s*["']@\/lib\/seo\/site["']/.test(src)) {
    console.log(`  ❌  src/app/${label} must import SITE_URL from @/lib/seo/site.`);
    errors += 1;
  } else {
    console.log(`  ${label.padEnd(22)}: present, imports SITE_URL ✓`);
  }
}

// Bonus: sitemap covers all five page kinds.
{
  const sitemapSrc = fs.readFileSync(sitemapPath, "utf8");
  const expectations: Array<[string, RegExp]> = [
    ["homepage", /\$\{SITE_URL\}\/`/],
    ["/about", /\$\{SITE_URL\}\/about`/],
    ["/play-with-me", /\$\{SITE_URL\}\/play-with-me`/],
    ["/archive", /\$\{SITE_URL\}\/archive`/],
    ["/archive/[slug] map", /\$\{SITE_URL\}\/archive\/\$\{[a-zA-Z_.]+\}/],
  ];
  for (const [label, re] of expectations) {
    if (!re.test(sitemapSrc)) {
      console.log(`  ❌  sitemap.ts is missing the ${label} entry.`);
      errors += 1;
    }
  }
}

// 2. Standard pages each declare openGraph.images using OG_IMAGES.
const standardPages: Array<[string, string, keyof typeof OG_IMAGES]> = [
  ["src/app/page.tsx", "homepage", "home"],
  ["src/app/about/page.tsx", "/about", "about"],
  ["src/app/play-with-me/page.tsx", "/play-with-me", "playWithMe"],
  ["src/app/archive/page.tsx", "/archive", "archive"],
];

for (const [rel, label, key] of standardPages) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) {
    console.log(`  ❌  ${rel} is missing.`);
    errors += 1;
    continue;
  }
  const src = fs.readFileSync(p, "utf8");
  if (!/import\s*\{[^}]*OG_IMAGES[^}]*\}\s*from\s*["']@\/lib\/seo\/og["']/.test(src)) {
    console.log(`  ❌  ${label.padEnd(15)}: must import OG_IMAGES from @/lib/seo/og.`);
    errors += 1;
    continue;
  }
  if (!new RegExp(`OG_IMAGES\\.${key}\\.src`).test(src)) {
    console.log(`  ❌  ${label.padEnd(15)}: must reference OG_IMAGES.${key}.src in its metadata.`);
    errors += 1;
    continue;
  }
  if (!/openGraph\s*:\s*\{[\s\S]*?images\s*:/.test(src)) {
    console.log(`  ❌  ${label.padEnd(15)}: openGraph.images array not declared.`);
    errors += 1;
    continue;
  }
  if (!/twitter\s*:\s*\{[\s\S]*?images\s*:/.test(src)) {
    console.log(`  ❌  ${label.padEnd(15)}: twitter.images array not declared.`);
    errors += 1;
    continue;
  }
  console.log(`  ${label.padEnd(22)}: openGraph.images + twitter.images ✓`);
}

// 3. Archive [slug] page imports the SEO helpers and renders JSON-LD.
{
  const slugPath = path.join(ROOT, "src", "app", "archive", "[slug]", "page.tsx");
  if (!fs.existsSync(slugPath)) {
    console.log("  ❌  src/app/archive/[slug]/page.tsx is missing.");
    errors += 1;
  } else {
    const src = fs.readFileSync(slugPath, "utf8");
    const requiredImports: Array<[string, RegExp]> = [
      ["articleJsonLd", /import\s*\{[^}]*articleJsonLd[^}]*\}\s*from\s*["']@\/lib\/seo\/jsonld["']/],
      ["postOgImagePath", /import\s*\{[^}]*postOgImagePath[^}]*\}\s*from\s*["']@\/lib\/seo\/post-og["']/],
    ];
    for (const [label, re] of requiredImports) {
      if (!re.test(src)) {
        console.log(`  ❌  archive [slug] page must import ${label}.`);
        errors += 1;
      }
    }
    if (!/type=["']application\/ld\+json["']/.test(src)) {
      console.log(`  ❌  archive [slug] page must render <script type="application/ld+json">.`);
      errors += 1;
    } else {
      console.log("  archive [slug] page    : JSON-LD <script> + postOgImagePath ✓");
    }
    if (!/articleJsonLd\(post\)/.test(src)) {
      console.log("  ❌  archive [slug] page must call articleJsonLd(post).");
      errors += 1;
    }
    if (!/postOgImagePath\(post\)/.test(src)) {
      console.log("  ❌  archive [slug] page must call postOgImagePath(post) in generateMetadata.");
      errors += 1;
    }
  }
}

// 4. OG_IMAGES public assets all exist on disk.
const ogPaths = new Set<string>();
for (const v of Object.values(OG_IMAGES)) ogPaths.add(v.src);
ogPaths.add(SITE_DEFAULT_OG.src);
for (const rel of ogPaths) {
  const p = path.join(PUBLIC_ROOT, rel.replace(/^\//, ""));
  if (!fs.existsSync(p)) {
    console.log(`  ❌  OG asset ${rel} is missing on disk (looked at ${p}).`);
    errors += 1;
  } else {
    console.log(`  OG asset ${rel.padEnd(38)} ✓`);
  }
}

// 5. Per-post hero coverage report (informational).
{
  const archiveDir = path.join(ROOT, "content", "archive");
  const files = fs
    .readdirSync(archiveDir)
    .filter((f) => f.endsWith(".md"))
    .sort();
  let withHero = 0;
  let withoutHero = 0;
  const fallbackSlugs: string[] = [];
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(archiveDir, f), "utf8");
    const fm = matter(raw).data as { hero?: string | null };

    let hasOwn = false;
    if (typeof fm.hero === "string" && fm.hero.length > 0) {
      hasOwn = true;
    } else {
      const nn = slugPrefix(slug);
      const dir = path.join(PUBLIC_ROOT, "archive", nn);
      if (fs.existsSync(dir)) {
        for (const ext of HERO_EXTS) {
          if (fs.existsSync(path.join(dir, `image-1.${ext}`))) {
            hasOwn = true;
            break;
          }
        }
      }
    }
    if (hasOwn) {
      withHero += 1;
    } else {
      withoutHero += 1;
      fallbackSlugs.push(slug);
    }
  }
  console.log("");
  console.log(`  Hero coverage         : ${withHero}/${files.length} posts have an own hero`);
  console.log(`  Site-default fallback : ${withoutHero}/${files.length} posts (uses ${SITE_DEFAULT_OG.src})`);
  if (fallbackSlugs.length > 0 && fallbackSlugs.length <= 30) {
    console.log(`    ${fallbackSlugs.join(", ")}`);
  }
}

// 6. AWAITING NAZ'S APPROVAL markers in M6-touched files (informational).
{
  const m6Files = [
    "src/app/sitemap.ts",
    "src/app/robots.ts",
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/about/page.tsx",
    "src/app/play-with-me/page.tsx",
    "src/app/archive/page.tsx",
    "src/app/archive/[slug]/page.tsx",
    "src/lib/seo/site.ts",
    "src/lib/seo/og.ts",
    "src/lib/seo/post-og.ts",
    "src/lib/seo/jsonld.ts",
  ];
  let totalMarkers = 0;
  for (const rel of m6Files) {
    const p = path.join(ROOT, rel);
    if (!fs.existsSync(p)) continue;
    const src = fs.readFileSync(p, "utf8");
    const n = (src.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
    totalMarkers += n;
  }
  console.log(`  Approval markers      : ${totalMarkers}   (expected: 0)`);
  if (totalMarkers > 0) {
    console.log(
      `\n  ⚠️  ${totalMarkers} AWAITING NAZ'S APPROVAL marker(s) across M6 files — should be zero.`,
    );
    warnings += 1;
  }
}

console.log("");
if (errors > 0) {
  console.log(`  Done — ${errors} error(s), ${warnings} warning(s).\n`);
  process.exitCode = 1;
} else if (warnings > 0) {
  console.log(`  Done — ${warnings} warning(s).\n`);
} else {
  console.log("  Done — clean.\n");
}