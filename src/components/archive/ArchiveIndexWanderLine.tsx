/**
 * The Wander sentence — one prose line with the three sort-mode names
 * woven in as inline links, separated by ♦ diamonds. Not a button row.
 *
 * Used by both `/archive` (where one mode is "active" — that label
 * renders as a bronze span instead of a link) and `/` (where no mode
 * is active — all three labels render as live links). The `active`
 * prop is optional; omitting it produces the all-live-links variant.
 */

import Link from "next/link";

import { WANDER_MODES } from "@/lib/archive/wander";
import type { WanderMode } from "@/lib/archive/types";

export function ArchiveIndexWanderLine({
  active,
}: {
  active?: WanderMode;
}) {
  return (
    <p className="mx-auto max-w-2xl text-balance px-2 text-center font-serif text-[0.95rem] italic leading-relaxed text-ink-soft sm:text-[1.05rem]">
      <span className="not-italic text-ink">Wander</span>{" "}
      <span>through the archive</span>{" "}
      {WANDER_MODES.map((m, i) => {
        const isActive = active !== undefined && m.mode === active;
        const href =
          m.mode === "order" ? "/archive" : `/archive?wander=${m.mode}`;
        return (
          <span key={m.mode}>
            {i === 0 ? "" : (
              <span aria-hidden="true" className="mx-2 text-bronze/70">
                ♦
              </span>
            )}
            {isActive ? (
              <span className="not-italic font-display text-bronze">
                {m.label}
              </span>
            ) : (
              <Link
                href={href}
                className="not-italic text-green underline decoration-bronze/60 underline-offset-4 transition-colors hover:text-bronze"
              >
                {m.label}
              </Link>
            )}
          </span>
        );
      })}
      <span aria-hidden="true">.</span>
    </p>
  );
}