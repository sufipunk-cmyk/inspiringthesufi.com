/**
 * Reader comments — read-only, threaded by `parentId`. Q4: any
 * YouTube URL inside a comment body renders as an embedded player,
 * not a plain hyperlink.
 *
 * Naz's own replies (author === "Sufi Punk") get a tiny ❁ glyph next
 * to the name. No other distinction. Quiet, not loud.
 */

import { splitCommentBody } from "@/lib/archive/body-render";
import { YouTubeEmbed } from "@/components/archive/YouTubeEmbed";
import type { ArchiveCommentNode } from "@/lib/archive/types";

function formatCommentDate(iso: string): string {
  // "2016-09-20 10:58:53" → "20 September 2016"
  const datePart = iso.split(" ")[0] ?? iso;
  const [y, m, d] = datePart.split("-").map((s) => Number(s));
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

function CommentNode({
  comment,
  children,
}: {
  comment: ArchiveCommentNode;
  children?: React.ReactNode;
}) {
  const isHost = comment.author === "Sufi Punk";
  const chunks = splitCommentBody(comment.bodyMarkdown);

  return (
    <article
      className={`pt-6 ${isHost ? "" : "border-t border-hairline/50"}`}
    >
      <header className="mb-2 font-display text-xs uppercase tracking-[0.18em] text-ink-soft">
        <span className="text-green">{comment.author}</span>
        {isHost ? (
          <span aria-hidden="true" className="ml-1 text-bronze">
            ❁
          </span>
        ) : null}
        <span className="mx-2 text-bronze/60">·</span>
        <time dateTime={comment.date}>{formatCommentDate(comment.date)}</time>
      </header>
      <div className="prose-archive">
        {chunks.map((c, i) =>
          c.kind === "html" ? (
            // eslint-disable-next-line react/no-danger
            <div key={i} dangerouslySetInnerHTML={{ __html: c.html }} />
          ) : (
            <div key={i} className="my-4">
              <YouTubeEmbed videoId={c.videoId} />
            </div>
          ),
        )}
      </div>
      {children ? <div className="mt-4 border-l border-hairline/50 pl-5 sm:pl-6">{children}</div> : null}
    </article>
  );
}

export function ArchiveCommentList({
  comments,
}: {
  comments: ArchiveCommentNode[];
}) {
  if (comments.length === 0) return null;

  // Build parent → children map, preserving the file's date-ascending order.
  const childrenOf = new Map<string | null, ArchiveCommentNode[]>();
  for (const c of comments) {
    const list = childrenOf.get(c.parentId) ?? [];
    list.push(c);
    childrenOf.set(c.parentId, list);
  }

  function renderThread(parentId: string | null) {
    const children = childrenOf.get(parentId) ?? [];
    if (children.length === 0) return null;
    return children.map((c) => (
      <CommentNode key={c.id} comment={c}>
        {renderThread(c.id)}
      </CommentNode>
    ));
  }

  return (
    <section className="mx-auto mt-20 max-w-2xl">
      <h2 className="text-center font-display text-2xl text-green">
        Reader comments
      </h2>
      <div className="divider-flower mt-3 mb-6" aria-hidden="true">
        ❁
      </div>
      <div className="space-y-2">{renderThread(null)}</div>
    </section>
  );
}