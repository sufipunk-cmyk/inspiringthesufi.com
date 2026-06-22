/**
 * scripts/check-archive.ts
 *
 * Build-time lint for the Archive content. Surfaces things that are
 * intentionally pending Naz's review, so they cannot ship silently:
 *
 *   1. The Archive standfirst paragraph carries a literal
 *      "AWAITING NAZ'S APPROVAL" marker in src/app/archive/page.tsx.
 *      That marker MUST be present until Naz approves the wording;
 *      this script confirms it is still there.
 *
 *   2. Any post whose frontmatter has narrativeReviewNeeded = true
 *      (per the master brief, Posts 21 and 38) is listed.
 *
 *   3. Sanity counts — 49 posts, total comment count, replacement
 *      count — to catch accidental data loss.
 *
 * Exit code is always 0; the script is informational, not blocking.
 * Naz reads the report; CI doesn't fail the build on it.
 *
 * Run: `bun run scripts/check-archive.ts`
 */

import * as fs from "node:fs";
import * as path from "node:path";

import matter from "gray-matter";

const ROOT = path.resolve(__dirname, "..");
const ARCHIVE_DIR = path.join(ROOT, "content", "archive");
const INDEX_PAGE = path.join(ROOT, "src", "app", "archive", "page.tsx");

type Frontmatter = {
  slug: string;
  postNumber: string;
  postNumberSort: number;
  name: { english: string; meaning: string };
  song: { title: string; artist: string; country: string | null };
  narrativeReviewNeeded?: boolean;
  hasReplacedYouTube?: boolean;
  sonAgeNote?: string | null;
  comments?: unknown[];
};

type Issue = { level: "warn" | "info"; message: string };

const issues: Issue[] = [];

// 1. Standfirst-approval marker
const indexSrc = fs.readFileSync(INDEX_PAGE, "utf8");
const hasMarker = indexSrc.includes("AWAITING NAZ'S APPROVAL");
if (hasMarker) {
  issues.push({
    level: "warn",
    message:
      "Archive standfirst paragraph still flagged AWAITING NAZ'S APPROVAL in src/app/archive/page.tsx — review and confirm wording before launch.",
  });
} else {
  issues.push({
    level: "info",
    message:
      "Standfirst approval marker has been removed from src/app/archive/page.tsx — assuming Naz approved the wording.",
  });
}

// 2. Walk archive/*.md
const files = fs
  .readdirSync(ARCHIVE_DIR)
  .filter((f) => f.endsWith(".md"))
  .sort();

let totalComments = 0;
let totalReplacements = 0;
let totalMissingCountry = 0;
let totalSonAge = 0;
const narrativeReview: { slug: string; postNumber: string; title: string }[] =
  [];

for (const f of files) {
  const raw = fs.readFileSync(path.join(ARCHIVE_DIR, f), "utf8");
  const { data } = matter(raw);
  const fm = data as Frontmatter;

  if (Array.isArray(fm.comments)) totalComments += fm.comments.length;
  if (fm.hasReplacedYouTube) totalReplacements += 1;
  if (fm.song?.country == null) totalMissingCountry += 1;
  if (fm.sonAgeNote) totalSonAge += 1;

  if (fm.narrativeReviewNeeded) {
    narrativeReview.push({
      slug: fm.slug,
      postNumber: fm.postNumber,
      title: `${fm.name.english} — ${fm.song.title} (${fm.song.artist})`,
    });
  }
}

if (narrativeReview.length > 0) {
  issues.push({
    level: "warn",
    message:
      `Posts flagged narrativeReviewNeeded (per master brief, Naz to review wording — not auto-rewritten):\n` +
      narrativeReview
        .map((p) => `      - Post ${p.postNumber} (${p.slug}) — ${p.title}`)
        .join("\n"),
  });
}

// 3. Sanity counts
console.log("\n  Inspiring the Sufi — Archive lint");
console.log("  ─────────────────────────────────");
console.log(`  Posts on disk        : ${files.length}    (expected: 49)`);
console.log(`  Total comments       : ${totalComments}`);
console.log(`  Replaced YouTube     : ${totalReplacements} posts`);
console.log(
  `  Missing country tag  : ${totalMissingCountry} posts (Q2 — left blank by design)`,
);
console.log(`  sonAgeNote present   : ${totalSonAge} post(s) (Q5 — explicit only)`);
console.log("");

for (const issue of issues) {
  const prefix = issue.level === "warn" ? "  ⚠️  " : "  ℹ️  ";
  console.log(`${prefix}${issue.message}\n`);
}

if (files.length !== 49) {
  console.log(
    `  ❌  Expected 49 posts, found ${files.length}. Investigate.\n`,
  );
  process.exitCode = 1;
}

console.log("  Done.\n");