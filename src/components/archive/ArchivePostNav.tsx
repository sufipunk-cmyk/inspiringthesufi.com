/**
 * Adjacent navigation at the foot of a post page — ← previous · next →,
 * computed from the visitor's current Wander mode so the order stays
 * consistent with the way they came in.
 */

import Link from "next/link";

import { sortPosts } from "@/lib/archive/wander";
import type { ArchivePost, WanderMode } from "@/lib/archive/types";

export function ArchivePostNav({
  current,
  allPosts,
  wander,
}: {
  current: ArchivePost;
  allPosts: ArchivePost[];
  wander: WanderMode;
}) {
  const ordered = sortPosts(allPosts, wander);
  const idx = ordered.findIndex((p) => p.slug === current.slug);
  const prev = idx > 0 ? ordered[idx - 1] : null;
  const next = idx >= 0 && idx < ordered.length - 1 ? ordered[idx + 1] : null;

  function buildHref(slug: string) {
    return wander === "order"
      ? `/archive/${slug}`
      : `/archive/${slug}?from=${wander}`;
  }

  return (
    <nav
      aria-label="Adjacent posts"
      className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-6 border-t border-hairline/50 pt-8 sm:grid-cols-2 sm:gap-10"
    >
      <div className="text-center sm:text-left">
        {prev ? (
          <Link
            href={buildHref(prev.slug)}
            className="group block font-serif text-ink-soft hover:text-bronze"
          >
            <span className="font-display text-xs uppercase tracking-[0.22em] text-bronze/80 group-hover:text-bronze">
              ← Previous
            </span>
            <span className="mt-1 block font-display text-lg italic text-green group-hover:text-bronze">
              No.&nbsp;{prev.postNumber} · {prev.name.english}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
      <div className="text-center sm:text-right">
        {next ? (
          <Link
            href={buildHref(next.slug)}
            className="group block font-serif text-ink-soft hover:text-bronze"
          >
            <span className="font-display text-xs uppercase tracking-[0.22em] text-bronze/80 group-hover:text-bronze">
              Next →
            </span>
            <span className="mt-1 block font-display text-lg italic text-green group-hover:text-bronze">
              No.&nbsp;{next.postNumber} · {next.name.english}
            </span>
          </Link>
        ) : (
          <span aria-hidden="true" />
        )}
      </div>
    </nav>
  );
}