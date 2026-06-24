/**
 * scripts/check-comment-form.ts
 *
 * Build-time lint for the "leave a reflection" form added to every
 * /archive/[slug] page. Same shape as check-play-with-me.ts.
 *
 *   1. COMMENT_FIELD_LABELS has exactly the four expected keys.
 *   2. src/lib/comment/actions.ts is a real "use server" module.
 *   3. /archive/[slug]/page.tsx imports and renders ArchiveCommentForm,
 *      passing postSlug + postLabel + hasExistingThread.
 *   4. Counts AWAITING NAZ'S APPROVAL markers in the comment-feature
 *      files — currently expected to be > 0, since none of this
 *      copy has been confirmed yet. This script will warn (not
 *      error) until Naz approves and the markers are cleared.
 *   5. Reports whether FORMSPREE_ENDPOINT is set (informational —
 *      this form deliberately reuses the same env var as
 *      Play-with-me, so if that one works, this one already does too).
 *
 * Run: `bun run check:comment-form` (or `npx tsx scripts/check-comment-form.ts`).
 */

import * as fs from "node:fs";
import * as path from "node:path";

import { COMMENT_FIELD_LABELS } from "../src/lib/comment/text";

const ROOT = path.resolve(__dirname, "..");
const ACTIONS_PATH = path.join(ROOT, "src", "lib", "comment", "actions.ts");
const TEXT_PATH = path.join(ROOT, "src", "lib", "comment", "text.ts");
const FORM_PATH = path.join(
  ROOT,
  "src",
  "components",
  "archive",
  "ArchiveCommentForm.tsx",
);
const SLUG_PAGE_PATH = path.join(
  ROOT,
  "src",
  "app",
  "archive",
  "[slug]",
  "page.tsx",
);

let errors = 0;
let warnings = 0;

console.log("\n  Inspiring the Sufi — Comment-form lint");
console.log("  ───────────────────────────────────────");

// Field labels
const expectedKeys = ["name", "reflection", "wantsResponse", "email"];
const actualKeys = Object.keys(COMMENT_FIELD_LABELS);
const missingKeys = expectedKeys.filter((k) => !actualKeys.includes(k));
const extraKeys = actualKeys.filter((k) => !expectedKeys.includes(k));
console.log(`  Field-label keys     : ${actualKeys.join(", ")}`);
if (missingKeys.length > 0 || extraKeys.length > 0) {
  console.log(
    `  ❌  COMMENT_FIELD_LABELS keys mismatch. Missing: ${missingKeys.join(", ") || "(none)"}, extra: ${extraKeys.join(", ") || "(none)"}.`,
  );
  errors += 1;
}

// Server Action shape
const actionsSrc = fs.readFileSync(ACTIONS_PATH, "utf8");
if (!actionsSrc.trimStart().startsWith('"use server"')) {
  console.log(
    "  ❌  src/lib/comment/actions.ts must start with the \"use server\" directive.",
  );
  errors += 1;
}
if (!actionsSrc.includes("FORMSPREE_ENDPOINT")) {
  console.log(
    "  ❌  actions.ts should read FORMSPREE_ENDPOINT — reusing the existing env var is the whole point (no new Vercel config needed).",
  );
  errors += 1;
} else {
  console.log("  Reuses env var       : FORMSPREE_ENDPOINT (same as Play-with-me)");
}

// Wired into the post page
const slugPageSrc = fs.readFileSync(SLUG_PAGE_PATH, "utf8");
const wiredChecks: Array<[string, boolean]> = [
  ["imports ArchiveCommentForm", slugPageSrc.includes("ArchiveCommentForm")],
  ["passes postSlug", slugPageSrc.includes("postSlug={post.slug}")],
  ["passes postLabel", slugPageSrc.includes("postLabel={postLabel}")],
  [
    "passes hasExistingThread",
    slugPageSrc.includes("hasExistingThread={post.comments.length > 0}"),
  ],
];
for (const [label, ok] of wiredChecks) {
  if (!ok) {
    console.log(`  ❌  /archive/[slug]/page.tsx does not ${label}.`);
    errors += 1;
  }
}
if (wiredChecks.every(([, ok]) => ok)) {
  console.log("  Wired into post page : yes — all four checks pass");
}

// Approval markers — expected > 0 until Naz signs off
const textSrc = fs.readFileSync(TEXT_PATH, "utf8");
const formSrc = fs.readFileSync(FORM_PATH, "utf8");
const textMarkers = (textSrc.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
const formMarkers = (formSrc.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
const totalMarkers = textMarkers + formMarkers;
console.log(`  Approval markers     : ${totalMarkers}   (pending Naz's review)`);
if (totalMarkers === 0) {
  console.log(
    "  ℹ️  Zero markers found — if this copy has been confirmed, great; if the markers were just deleted, double-check nothing was approved by accident.",
  );
}

// Endpoint env var (informational only)
const endpoint = process.env.FORMSPREE_ENDPOINT?.trim();
if (endpoint) {
  let host = "?";
  try {
    host = new URL(endpoint).host;
  } catch {
    host = "(unparseable)";
  }
  console.log(`  FORMSPREE_ENDPOINT   : set (${host})`);
} else {
  console.log(
    "  FORMSPREE_ENDPOINT   : not set in this env (normal for local dev — already set on Vercel from M4)",
  );
}

console.log("");
if (errors > 0) {
  console.log(`  Done — ${errors} error(s), ${warnings} warning(s).\n`);
  process.exitCode = 1;
} else {
  console.log(`  Done — ${warnings} warning(s).\n`);
}
