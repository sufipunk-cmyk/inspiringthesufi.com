/**
 * scripts/check-play-with-me.ts
 *
 * Build-time lint for /play-with-me. Same shape as check-archive.ts and
 * check-about.ts.
 *
 *   1. PLAY_INTRO_PARAGRAPHS has exactly 3 running-prose paragraphs.
 *   2. The [PHYSICIANS_LINK] marker appears in paragraph 1.
 *   3. All four authors' surnames (Meyer, Hyde, Muqaddam, Kahn) are in
 *      paragraph 1 alongside the marker — protects the credit from
 *      being silently shortened.
 *   4. Closing copy strings end as Naz wrote them.
 *   5. Field-label map has the five visible-field keys.
 *   6. Any stray AWAITING NAZ'S APPROVAL markers in page + form
 *      sources are flagged. The five M4 markers were cleared post-M4;
 *      count should be zero.
 *   7. Reports whether FORMSPREE_ENDPOINT is set in this environment
 *      (informational; absence is normal in dev).
 *
 * Run: `bun run check:play-with-me`.
 */

import * as fs from "node:fs";
import * as path from "node:path";

import {
  PLAY_CLOSING_LINE,
  PLAY_CLOSING_SMALL_PRINT,
  PLAY_FIELD_LABELS,
  PLAY_INTRO_HEADING,
  PLAY_INTRO_PARAGRAPHS,
  PLAY_SUCCESS_LINE_1,
  PLAY_SUCCESS_LINE_2,
} from "../src/lib/play/text";

const ROOT = path.resolve(__dirname, "..");
const PAGE_PATH = path.join(ROOT, "src", "app", "play-with-me", "page.tsx");
const FORM_PATH = path.join(ROOT, "src", "components", "play", "PlayForm.tsx");

let errors = 0;
let warnings = 0;

console.log("\n  Inspiring the Sufi — Play-with-me lint");
console.log("  ──────────────────────────────────────");
console.log(
  `  Heading              : "${PLAY_INTRO_HEADING.slice(0, 60)}…"`,
);
console.log(
  `  Running paragraphs   : ${PLAY_INTRO_PARAGRAPHS.length}   (expected: 3)`,
);

if (PLAY_INTRO_PARAGRAPHS.length !== 3) {
  console.log(
    `  ❌  Expected 3 running-prose paragraphs; found ${PLAY_INTRO_PARAGRAPHS.length}.`,
  );
  errors += 1;
}

// Marker + four-author check on paragraph 1
const p1 = PLAY_INTRO_PARAGRAPHS[0]?.body ?? "";
if (!p1.includes("[PHYSICIANS_LINK]")) {
  console.log(
    "  ❌  Paragraph 1 must contain the [PHYSICIANS_LINK] render-time marker.",
  );
  errors += 1;
}
const requiredAuthors = ["Meyer", "Hyde", "Muqaddam", "Kahn"];
const missingAuthors = requiredAuthors.filter((a) => !p1.includes(a));
if (missingAuthors.length > 0) {
  console.log(
    `  ❌  Paragraph 1 missing author surname(s): ${missingAuthors.join(", ")}. The Physicians-of-the-Heart credit must include all four.`,
  );
  errors += 1;
}

// Length sanity check
const tooShort = PLAY_INTRO_PARAGRAPHS.filter((p) => p.body.trim().length < 60);
if (tooShort.length > 0) {
  console.log(
    `  ❌  ${tooShort.length} paragraph(s) suspiciously short (< 60 chars):`,
  );
  for (const p of tooShort) {
    console.log(`        - paragraph ${p.index} (${p.body.length} chars)`);
  }
  errors += 1;
}

// Closing copy
if (
  !PLAY_CLOSING_LINE.endsWith("half-formed noticing counts.")
) {
  console.log(
    "  ❌  PLAY_CLOSING_LINE must end with 'half-formed noticing counts.'",
  );
  errors += 1;
}
if (!PLAY_CLOSING_SMALL_PRINT.includes("explorative project")) {
  console.log(
    "  ❌  PLAY_CLOSING_SMALL_PRINT must mention the project being explorative research.",
  );
  errors += 1;
}
if (!PLAY_SUCCESS_LINE_2.includes("Half-formed noticing")) {
  console.log(
    "  ⚠️  Success line 2 doesn't echo Naz's 'half-formed noticing' phrase.",
  );
  warnings += 1;
}

// Field labels
const expectedKeys = [
  "specialInterest",
  "sacredFixedPoint",
  "noticedTouch",
  "wantsResponse",
  "email",
  "aboutYou",
];
const actualKeys = Object.keys(PLAY_FIELD_LABELS);
const missingKeys = expectedKeys.filter((k) => !actualKeys.includes(k));
const extraKeys = actualKeys.filter((k) => !expectedKeys.includes(k));
if (missingKeys.length > 0 || extraKeys.length > 0) {
  console.log(
    `  ❌  PLAY_FIELD_LABELS keys mismatch. Missing: ${missingKeys.join(", ") || "(none)"}, extra: ${extraKeys.join(", ") || "(none)"}.`,
  );
  errors += 1;
}

// Approval markers — should be zero (all five cleared post-M4)
const pageSrc = fs.readFileSync(PAGE_PATH, "utf8");
const formSrc = fs.readFileSync(FORM_PATH, "utf8");
const pageMarkers = (pageSrc.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
const formMarkers = (formSrc.match(/AWAITING NAZ'S APPROVAL/g) ?? []).length;
const totalMarkers = pageMarkers + formMarkers;
console.log(
  `  Approval markers     : ${totalMarkers}   (expected: 0)`,
);
if (totalMarkers > 0) {
  console.log(
    `\n  ⚠️  ${totalMarkers} stray AWAITING NAZ'S APPROVAL marker(s) across page + form — should be zero (all five cleared post-M4).`,
  );
  warnings += 1;
}

// Endpoint env var
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
    `  FORMSPREE_ENDPOINT   : not set in this env (normal for local dev — set on Vercel)`,
  );
}

console.log("");
if (errors > 0) {
  console.log(`  Done — ${errors} error(s), ${warnings} warning(s).\n`);
  process.exitCode = 1;
} else {
  console.log(`  Done — ${warnings} warning(s).\n`);
}