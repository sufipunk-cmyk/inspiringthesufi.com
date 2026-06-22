/**
 * scripts/sync-redirects.ts
 *
 * Writes `src/lib/archive/redirects.generated.json` from the TS source
 * of truth at `src/lib/archive/redirects.ts`. `next.config.js` reads
 * the JSON because Next 15's config can't easily import TS at build
 * time — but the TS file remains the canonical edit point.
 *
 *   bun run scripts/sync-redirects.ts
 */

import * as fs from "node:fs/promises";
import * as path from "node:path";

import { ARCHIVE_REDIRECTS } from "../src/lib/archive/redirects";

const OUT = path.resolve(
  __dirname,
  "..",
  "src",
  "lib",
  "archive",
  "redirects.generated.json",
);

await fs.writeFile(OUT, JSON.stringify(ARCHIVE_REDIRECTS, null, 2) + "\n");
console.log(`Wrote ${ARCHIVE_REDIRECTS.length} redirects to ${OUT}`);