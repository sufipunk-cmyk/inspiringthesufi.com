/**
 * Archive loader — build-time markdown reader.
 *
 * Reads every `.md` file under `content/archive/`, parses YAML
 * frontmatter, validates against the Zod schema, and returns a
 * fully-typed `ArchivePost[]`. Cached in module scope so multiple
 * page-render passes share one parse during `next build`.
 *
 * This file is **server-only** — it uses `fs` and `path` directly.
 * Next.js will tree-shake it out of any client bundle that accidentally
 * imports it.
 */

import "server-only";
import * as fs from "node:fs";
import * as path from "node:path";

import matter from "gray-matter";
import { z } from "zod";

import type { ArchivePost } from "./types";

// ──────────────────────────────────────────────────────────────────────
//  Zod schema mirroring the frontmatter shape
// ──────────────────────────────────────────────────────────────────────

const NameSchema = z.object({
  english: z.string().min(1),
  meaning: z.string().min(1),
  arabic: z.string().nullable().default(null),
});

const SongSchema = z.object({
  title: z.string(),
  artist: z.string(),
  country: z.string().nullable(),
  youtube: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/)
    .nullable(),
});

const RelatedMediaSchema = z.object({
  label: z.string(),
  youtube: z
    .string()
    .regex(/^[A-Za-z0-9_-]{11}$/)
    .nullable(),
  note: z.string().optional(),
});

const CommentSchema = z.object({
  id: z.string(),
  parentId: z.string().nullable(),
  author: z.string(),
  date: z.string(),
  bodyMarkdown: z.string(),
});

const FrontmatterSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  postNumber: z.string(),
  postNumberSort: z.number().int().min(1).max(50),
  name: NameSchema,
  secondName: NameSchema.optional(),
  song: SongSchema,
  relatedMedia: z.array(RelatedMediaSchema).optional(),
  publishedAt: z.string(),
  oldPath: z.string(),
  oldPostId: z.string(),
  narrativeReviewNeeded: z.boolean(),
  hasReplacedYouTube: z.boolean(),
  sonAgeNote: z.string().nullable().default(null),
  hero: z.string().nullable().default(null),
  comments: z.array(CommentSchema).default([]),
});

// ──────────────────────────────────────────────────────────────────────
//  Loader
// ──────────────────────────────────────────────────────────────────────

const ARCHIVE_DIR = path.resolve(process.cwd(), "content", "archive");

let cache: ArchivePost[] | null = null;

export function loadAllArchivePosts(): ArchivePost[] {
  if (cache) return cache;

  const files = fs
    .readdirSync(ARCHIVE_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const posts: ArchivePost[] = [];
  for (const filename of files) {
    const filePath = path.join(ARCHIVE_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);

    const parsed = FrontmatterSchema.safeParse(data);
    if (!parsed.success) {
      throw new Error(
        `Invalid frontmatter in ${filename}: ${parsed.error.message}`,
      );
    }

    posts.push({
      ...parsed.data,
      bodyMarkdown: content,
    });
  }

  // Default sort: by post number ascending (the "in the order it was
  // written" Wander mode is the default).
  posts.sort((a, b) => a.postNumberSort - b.postNumberSort);

  cache = posts;
  return posts;
}

export function loadArchivePost(slug: string): ArchivePost | null {
  return loadAllArchivePosts().find((p) => p.slug === slug) ?? null;
}