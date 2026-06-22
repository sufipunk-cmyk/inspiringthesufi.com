/**
 * Archive — TypeScript shapes
 *
 * One ArchivePost per `.md` file in `content/archive/`. The body is
 * the markdown body of the file (loaded separately by the loader);
 * everything below is the shape of the YAML frontmatter.
 *
 * The exact field decisions are documented in
 * `specs/m2-archive/document.md` §2 — see also the rationale table.
 */

export type ArchiveName = {
  english: string; // verbatim from Naz's title — e.g. "Ya Darr"
  meaning: string; // verbatim — e.g. "The Aflicter"
  arabic: string | null;
};

export type ArchiveSong = {
  title: string;
  artist: string;
  country: string | null; // null when the original didn't supply one
  youtube: string | null;
};

export type ArchiveRelatedMedia = {
  label: string;
  youtube: string | null;
  note?: string;
};

export type ArchiveCommentNode = {
  id: string;
  parentId: string | null;
  author: string;
  date: string;
  bodyMarkdown: string;
};

export type ArchivePost = {
  // Identity
  slug: string;
  postNumber: string; // "1", "45/46", "50"
  postNumberSort: number; // 1, 45, 50

  // Names
  name: ArchiveName;
  secondName?: ArchiveName; // only on Post 45/46

  // Music
  song: ArchiveSong;
  relatedMedia?: ArchiveRelatedMedia[];

  // Provenance
  publishedAt: string; // YYYY-MM-DD
  oldPath: string; // e.g. /inspiring-the-sufi-blog/2015/11/11/...
  oldPostId: string;

  // Migration metadata
  narrativeReviewNeeded: boolean;
  hasReplacedYouTube: boolean;

  // Optional details
  sonAgeNote: string | null;

  // Reader comments
  comments: ArchiveCommentNode[];

  // Body markdown — loaded from the file body, attached by the loader
  bodyMarkdown: string;

  // Optional hero image relative path (e.g. "/archive/01/hero.jpeg")
  hero?: string | null;
};

export type WanderMode = "order" | "names" | "music";