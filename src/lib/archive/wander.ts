/**
 * Wander — the three sort orderings the visitor can move through the
 * archive in. No filter UI; this is just three sort keys, exposed
 * inline as one prose sentence with diamond separators (see
 * specs/m2-archive/document.md §8).
 */

import type { ArchivePost, WanderMode } from "./types";

const ARTICLE_PREFIXES = [
  "Al-",
  "Al ",
  "Ar-",
  "Ar ",
  "As-",
  "As ",
  "Ya-",
  "Ya ",
  "Malikal-",
  "Malikal ",
];

function stripArticle(s: string): string {
  const lower = s.trim();
  for (const prefix of ARTICLE_PREFIXES) {
    if (lower.toLowerCase().startsWith(prefix.toLowerCase())) {
      return lower.slice(prefix.length).trim();
    }
  }
  return lower;
}

function stripLeadingThe(s: string): string {
  // "The Verve" → "Verve" for sort comparisons.
  if (/^the\s+/i.test(s)) return s.replace(/^the\s+/i, "");
  return s;
}

function foldDiacritics(s: string): string {
  return s.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
}

function namesKey(post: ArchivePost): string {
  return foldDiacritics(stripArticle(post.name.english)).toLowerCase();
}

function musicKey(post: ArchivePost): string {
  const artist = foldDiacritics(stripLeadingThe(post.song.artist)).toLowerCase();
  const title = foldDiacritics(post.song.title).toLowerCase();
  return `${artist}\t${title}`;
}

export function sortPosts(
  posts: ArchivePost[],
  mode: WanderMode,
): ArchivePost[] {
  const copy = [...posts];
  switch (mode) {
    case "order":
      copy.sort((a, b) => a.postNumberSort - b.postNumberSort);
      return copy;
    case "names":
      copy.sort((a, b) => namesKey(a).localeCompare(namesKey(b)));
      return copy;
    case "music":
      copy.sort((a, b) => musicKey(a).localeCompare(musicKey(b)));
      return copy;
  }
}

export function isWanderMode(s: unknown): s is WanderMode {
  return s === "order" || s === "names" || s === "music";
}

export const WANDER_MODES: { mode: WanderMode; label: string }[] = [
  { mode: "order", label: "in the order it was written" },
  { mode: "names", label: "by the names of Allah" },
  { mode: "music", label: "by the music" },
];