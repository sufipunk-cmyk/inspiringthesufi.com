/**
 * scripts/check-home.ts
 *
 * Build-time lint for the homepage. Same shape as the other check-* lints.
 *
 * The point of this lint is to enforce the single-source-of-truth rule:
 * the homepage shows the first two About paragraphs, but it must not
 * carry its own copy of those words. If someone (human or model) ever
 * pastes paragraph 1 into `src/app/page.tsx` "for clarity", this lint
 * fails loudly.
 *
 *   1. The homepage imports `ABOUT_PARAGRAPHS` from @/lib/about/text.
 *   2. The homepage source contains the literal `ABOUT_PARAGRAPHS.slice(0, 2)`.
 *   3. The homepage imports `ArchiveIndexWanderLine` (catches re-impl).
 *   4. The homepage source does NOT contain "Lorem" or "placeholder text"
 *      (catches a regression to the M1 demo).
 *   5. None of the eight ABOUT_PARAGRAPHS bodies appears verbatim inside
 *      `src/app/page.tsx` — i.e. no copy-paste.
 *   6. Reports `AWAITING NAZ'S APPROVAL` marker count (informational).
 *
 * Run: `bun run check:home`.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { ABOUT_PARAGRAPHS } from "../src/lib/about/text";

const ROOT = path.resolve(__dirname, "..");
const HOME_PATH = path.join(ROOT, "src", "app", "page.tsx");

let errors = 0;
let warnings = 0;

const src = fs.readFileSync(HOME_PATH, "utf8");

console.log("\n  Inspiring the Sufi — Homepage lint");
console.log("  ──────────────────────────────────");

// 1. Imports ABOUT_PARAGRAPHS
if (!/import\s*\{[^}]*ABOUT_PARAGRAPHS[^}]*\}\s*from\s*["']@\/lib\/about\/text["']/.test(src)) {
  console.log(
    "  ❌  src/app/page.tsx must import ABOUT_PARAGRAPHS from @/lib/about/text — that is the single source of truth.",
  );
  errors += 1;
} else {
  console.log("  ABOUT_PARAGRAPHS import : present");
}

// 2. Uses .slice(0, 2)
if (!src.includes("ABOUT_PARAGRAPHS.slice(0, 2)")) {
  console.log(
    "  ❌  src/app/page.tsx must use ABOUT_PARAGRAPHS.slice(0, 2) for the excerpt — first two paragraphs only.",
  );
  errors += 1;
} else {
  console.log("  Excerpt slice         : ABOUT_PARAGRAPHS.slice(0, 2) ✓");
}

// 3. Imports the Wander line component
if (!/import\s*\{[^}]*ArchiveIndexWanderLine[^}]*\}\s*from\s*["']@\/components\/archive\/ArchiveIndexWanderLine["']/.test(src)) {
  console.log(
    "  ❌  src/app/page.tsx must import ArchiveIndexWanderLine from @/components/archive/ArchiveIndexWanderLine.",
  );
  errors += 1;
} else {
  console.log("  WanderLine import     : present");
}

// 4. No M1-demo regression
if (/\bLorem\b|placeholder text/i.test(src)) {
  console.log(
    "  ❌  src/app/page.tsx contains 'Lorem' or 'placeholder text' — looks like the M1 demo regressed.",
  );
  errors += 1;
}

// 5. None of the eight ABOUT_PARAGRAPHS bodies appears in the page source
//    (single-source-of-truth check).
const copied: number[] = [];
for (const p of ABOUT_PARAGRAPHS) {
  // Look for a 60-char fingerprint from each paragraph — if found in the
  // homepage source, someone has hard-coded it.
  const probe = p.body.slice(0, 60);
  if (src.includes(probe)) {
    copied.push(p.index);
  }
}
if (copied.length > 0) {
  console.log(
    `  ❌  The body of About paragraph(s) ${copied.join(", ")} appears verbatim inside src/app/page.tsx — must be excerpted from ABOUT_PARAGRAPHS, not copy-pasted.`,
  );
  errors += 1;
} else {
  console.log("  Single-source-of-truth: no About paragraph hard-coded in page");
}

// 6. Approval markers — should be zero (overline + tagline confirmed post-M5).
const markerCount = (src.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
console.log(`  Approval markers      : ${markerCount}   (expected: 0)`);
if (markerCount > 0) {
  console.log(
    `\n  ⚠️  ${markerCount} stray AWAITING NAZ'S APPROVAL marker(s) in src/app/page.tsx — should be zero (overline + tagline were approved post-M5).`,
  );
  warnings += 1;
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