/**
 * Body rendering — markdown → HTML, plus the [youtube:ID] shortcode.
 *
 * The body markdown contains zero or more `[youtube:XYZ]` tokens that
 * the migration script inserted to replace Squarespace's <iframe>
 * embeds. We split the body on those tokens so a React renderer can
 * render the prose around them as marked-converted HTML and the
 * embeds themselves as <YouTubeEmbed> components.
 *
 * For comment bodies (Q4), bare YouTube URLs (youtube.com/watch?v=...
 * or youtu.be/...) are also detected and turned into embedded players.
 * This happens in `splitCommentBody` so the comment renderer can
 * render the surrounding text as markdown and the videos as embeds.
 */

import { marked } from "marked";

const SHORTCODE_RE = /\[youtube:([A-Za-z0-9_-]{11})\]/g;
const URL_RE =
  /\bhttps?:\/\/(?:www\.)?(?:youtube(?:-nocookie)?\.com\/watch\?(?:[^\s]*&)?v=([A-Za-z0-9_-]{11})|youtu\.be\/([A-Za-z0-9_-]{11}))[^\s)]*/gi;

export type BodyChunk =
  | { kind: "html"; html: string }
  | { kind: "youtube"; videoId: string };

export function splitPostBody(markdown: string): BodyChunk[] {
  const chunks: BodyChunk[] = [];
  let cursor = 0;
  for (const m of markdown.matchAll(SHORTCODE_RE)) {
    const before = markdown.slice(cursor, m.index ?? cursor);
    if (before.trim()) {
      chunks.push({ kind: "html", html: marked.parse(before) as string });
    }
    chunks.push({ kind: "youtube", videoId: m[1] });
    cursor = (m.index ?? 0) + m[0].length;
  }
  const tail = markdown.slice(cursor);
  if (tail.trim()) {
    chunks.push({ kind: "html", html: marked.parse(tail) as string });
  }
  return chunks;
}

/**
 * Comment bodies — Q4: bare YouTube URLs become embeds. The
 * surrounding prose is still rendered as markdown.
 *
 * Strategy: find all YouTube URL matches first. Around each, split
 * the comment body into prose chunks. Every URL-match becomes a
 * separate `youtube` chunk; whatever sits between them is rendered
 * as markdown.
 */
export function splitCommentBody(markdown: string): BodyChunk[] {
  const chunks: BodyChunk[] = [];
  let cursor = 0;
  // Reset the lastIndex on the regex (matchAll handles its own state
  // but exec() would not — using matchAll for safety).
  for (const m of markdown.matchAll(URL_RE)) {
    const id = m[1] ?? m[2];
    if (!id) continue;
    const idx = m.index ?? 0;
    const before = markdown.slice(cursor, idx);
    if (before.trim()) {
      chunks.push({ kind: "html", html: marked.parse(before) as string });
    }
    chunks.push({ kind: "youtube", videoId: id });
    cursor = idx + m[0].length;
  }
  const tail = markdown.slice(cursor);
  if (tail.trim()) {
    chunks.push({ kind: "html", html: marked.parse(tail) as string });
  }
  return chunks;
}