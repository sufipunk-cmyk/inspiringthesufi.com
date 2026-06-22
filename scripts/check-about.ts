/**
 * scripts/check-about.ts
 *
 * Build-time lint for the About page. Exact-mirror of check-archive.ts:
 * surfaces things that are intentionally pending Naz's review so they
 * cannot ship silently.
 *
 *   1. ABOUT_PARAGRAPHS must have exactly eight entries.
 *   2. Every paragraph body must be non-empty and at least 80 chars
 *      (catches accidental truncation or a paragraph being deleted).
 *   3. Any stray AWAITING NAZ'S APPROVAL markers in
 *      src/app/about/page.tsx are flagged. Heading + kicker were
 *      approved post-M4; the marker should NOT be present.
 *
 * Exit code 0 unless the structural assertion (#1) fails — that is
 * a real data error and should fail loudly.
 *
 * Run: `bun run check:about`.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { ABOUT_PARAGRAPHS } from "../src/lib/about/text";

const ROOT = path.resolve(__dirname, "..");
const PAGE_PATH = path.join(ROOT, "src", "app", "about", "page.tsx");

let warnings = 0;
let errors = 0;

console.log("\n  Inspiring the Sufi — About lint");
console.log("  ───────────────────────────────");
console.log(
  `  Paragraphs           : ${ABOUT_PARAGRAPHS.length}   (expected: 8)`,
);

if (ABOUT_PARAGRAPHS.length !== 8) {
  console.log(
    `  ❌  Expected 8 canonical About paragraphs; found ${ABOUT_PARAGRAPHS.length}.`,
  );
  errors += 1;
}

const tooShort = ABOUT_PARAGRAPHS.filter((p) => p.body.trim().length < 80);
if (tooShort.length > 0) {
  console.log(
    `  ❌  ${tooShort.length} paragraph(s) suspiciously short (< 80 chars):`,
  );
  for (const p of tooShort) {
    console.log(`        - paragraph ${p.index} (${p.body.length} chars)`);
  }
  errors += 1;
}

// Sequence check: indexes 1..8 in order
const expected = [1, 2, 3, 4, 5, 6, 7, 8];
const actual = ABOUT_PARAGRAPHS.map((p) => p.index);
if (actual.join(",") !== expected.join(",")) {
  console.log(
    `  ❌  Paragraph indexes out of sequence. Expected 1..8, got ${actual.join(",")}.`,
  );
  errors += 1;
}

// Approval-marker check (should be zero — heading + kicker confirmed post-M4).
const pageSrc = fs.readFileSync(PAGE_PATH, "utf8");
const markerCount = (pageSrc.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
console.log(`  Approval markers     : ${markerCount}   (expected: 0)`);
if (markerCount > 0) {
  console.log(
    `\n  ⚠️  src/app/about/page.tsx carries ${markerCount} stray AWAITING NAZ'S APPROVAL marker(s) — should be zero (heading + kicker were approved post-M4).`,
  );
  warnings += 1;
}

console.log("");
if (errors > 0) {
  console.log(`  Done — ${errors} error(s), ${warnings} warning(s).\n`);
  process.exitCode = 1;
} else {
  console.log(`  Done — ${warnings} warning(s).\n`);
}