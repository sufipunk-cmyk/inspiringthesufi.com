/**
 * One alcove on the archive index grid. Whole frame is clickable,
 * lifting the niche tint slightly on hover (only on devices that
 * support hover; touch devices skip the tint shift).
 */

import Link from "next/link";

import { Alcove } from "@/components/site/Ornaments";
import type { ArchivePost, WanderMode } from "@/lib/archive/types";

export function ArchiveIndexAlcove({
  post,
  wander,
}: {
  post: ArchivePost;
  wander: WanderMode;
}) {
  const href = `/archive/${post.slug}${wander === "order" ? "" : `?from=${wander}`}`;

  // Country line: only render if the original Squarespace title actually
  // supplied one (Q2 — no inference from artist nationality).
  const subtitleParts: string[] = [post.song.artist];
  if (post.song.country) subtitleParts.push(post.song.country);

  return (
    <Link
      href={href}
      className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-parchment"
    >
      <Alcove tone="default" className="transition-colors duration-300">
        <p className="text-center font-display text-xs uppercase tracking-[0.28em] text-bronze">
          No.&nbsp;{post.postNumber}
        </p>
        <p className="mt-2 text-center font-display text-2xl text-green sm:text-[1.6rem]">
          {post.name.english}
          {post.secondName ? (
            <>
              {" "}
              <span className="text-bronze/70">&amp;</span>{" "}
              {post.secondName.english}
            </>
          ) : null}
        </p>
        <p className="mt-1 text-center font-serif text-base italic text-ink-soft">
          {post.name.meaning}
          {post.secondName ? <> &amp; {post.secondName.meaning}</> : null}
        </p>
        <p className="mx-auto mt-4 w-12 text-center font-display text-bronze/70">
          ❁
        </p>
        {post.song.title ? (
          <p className="mt-3 text-center font-serif text-[1.05rem] italic text-ink">
            {post.song.title}
          </p>
        ) : null}
        <p
          className={`${
            post.song.title ? "mt-1" : "mt-3"
          } text-center font-serif text-sm text-ink-soft`}
        >
          {subtitleParts.join(" · ")}
        </p>
      </Alcove>
    </Link>
  );
}