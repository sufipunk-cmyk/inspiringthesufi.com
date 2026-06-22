import type { ArchivePost } from "@/lib/archive/types";

function formatPublishedDate(iso: string): string {
  // "2015-12-08" → "8 December 2015"
  const [y, m, d] = iso.split("-").map((s) => Number(s));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  if (!y || !m || !d) return iso;
  return `${d} ${months[m - 1]} ${y}`;
}

export function ArchivePostHeader({ post }: { post: ArchivePost }) {
  const captionParts: string[] = [];
  if (post.song.title) captionParts.push(post.song.title);
  if (post.song.artist) captionParts.push(post.song.artist);
  if (post.song.country) captionParts.push(post.song.country);

  return (
    <header className="mx-auto max-w-2xl text-center">
      <p className="font-display text-xs uppercase tracking-[0.32em] text-bronze">
        From the archive{" "}
        <span aria-hidden="true" className="mx-2 text-bronze/70">
          ♦
        </span>{" "}
        No.&nbsp;{post.postNumber}
      </p>
      <h1 className="mt-4 font-display text-4xl leading-tight text-green sm:text-5xl">
        {post.name.english}
        {post.secondName ? (
          <>
            <span className="mx-2 text-bronze/70">&amp;</span>
            {post.secondName.english}
          </>
        ) : null}
      </h1>
      <p className="mt-2 font-display text-2xl italic text-ink-soft sm:text-[1.7rem]">
        {post.name.meaning}
        {post.secondName ? <> &amp; {post.secondName.meaning}</> : null}
      </p>
      <p className="mt-6 font-serif text-sm text-ink-soft sm:text-[0.95rem]">
        {captionParts.join(" · ")}
        {captionParts.length > 0 ? (
          <span className="mx-2 text-bronze/70">·</span>
        ) : null}
        <span className="italic">
          originally posted {formatPublishedDate(post.publishedAt)}
        </span>
      </p>
    </header>
  );
}