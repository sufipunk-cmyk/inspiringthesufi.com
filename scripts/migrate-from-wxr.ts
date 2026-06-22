/**
 * scripts/migrate-from-wxr.ts
 *
 * One-shot migration runner. Reads the Squarespace WXR export and the
 * hand-curated metadata table, downloads all referenced images, applies
 * confirmed YouTube replacements, and writes 49 markdown files into
 * `content/archive/`.
 *
 * Run once during M2 implementation. The output `.md` files and image
 * directories are committed to the repo. The script is idempotent:
 * running it twice yields identical output (no diffs).
 *
 *   bun run scripts/migrate-from-wxr.ts
 */

import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import * as fs from "node:fs/promises";
import * as path from "node:path";

import {
  METADATA_BY_OLD_ID,
  POST_METADATA,
  type PostMetadata,
} from "../src/lib/archive/metadata";
import {
  HEADLINE_OVERRIDES,
  NARRATIVE_REVIEW_POST_IDS,
  YOUTUBE_REPLACEMENTS,
} from "../src/lib/archive/replacements";

// ──────────────────────────────────────────────────────────────────────
//  Paths
// ──────────────────────────────────────────────────────────────────────

const PROJECT_ROOT = path.resolve(__dirname, "..");
const WXR_PATH = path.join(
  PROJECT_ROOT,
  "source-docs",
  "Squarespace-Wordpress-Export-06-16-2026.xml",
);
const CONTENT_DIR = path.join(PROJECT_ROOT, "content", "archive");
const PUBLIC_ARCHIVE_DIR = path.join(PROJECT_ROOT, "public", "archive");

// ──────────────────────────────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────────────────────────────

type WxrComment = {
  id: string;
  parentId: string | null;
  author: string;
  date: string; // ISO
  bodyMarkdown: string;
};

type WxrPost = {
  oldPostId: string;
  title: string;
  link: string; // canonical Squarespace URL path
  publishedAt: string; // YYYY-MM-DD
  contentHtml: string;
  attachmentUrls: string[]; // attachment items linked to this post
  comments: WxrComment[];
};

// ──────────────────────────────────────────────────────────────────────
//  WXR parsing
// ──────────────────────────────────────────────────────────────────────

function asArray<T>(x: T | T[] | undefined): T[] {
  if (x === undefined || x === null) return [];
  return Array.isArray(x) ? x : [x];
}

async function parseWxr(): Promise<{
  posts: WxrPost[];
  attachmentsByParentId: Map<string, string[]>;
}> {
  const xml = await fs.readFile(WXR_PATH, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    parseTagValue: false,
    parseAttributeValue: false,
    cdataPropName: "__cdata",
    trimValues: true,
  });
  const doc = parser.parse(xml);

  const channel = doc.rss.channel;
  const items: any[] = asArray(channel.item);

  // Pass 1 — attachments, indexed by post_parent so we can attach the
  // hero image URL to the corresponding post.
  const attachmentsByParentId = new Map<string, string[]>();
  for (const item of items) {
    const postType = item["wp:post_type"];
    if (postType !== "attachment") continue;
    const parentId = String(item["wp:post_parent"] ?? "");
    const url = item["wp:attachment_url"];
    if (!parentId || !url) continue;
    if (!attachmentsByParentId.has(parentId)) {
      attachmentsByParentId.set(parentId, []);
    }
    attachmentsByParentId.get(parentId)!.push(url);
  }

  // Pass 2 — posts.
  const posts: WxrPost[] = [];
  for (const item of items) {
    if (item["wp:post_type"] !== "post") continue;
    if (item["wp:status"] !== "publish") continue;

    const oldPostId = String(item["wp:post_id"]);
    const title = String(item.title?.__cdata ?? item.title ?? "");
    const link = String(item.link ?? "");
    const dateStr = String(item["wp:post_date"] ?? "");
    const publishedAt = dateStr.slice(0, 10);
    const contentEl = item["content:encoded"];
    const contentHtml = String(
      typeof contentEl === "object" && contentEl !== null
        ? contentEl.__cdata ?? ""
        : contentEl ?? "",
    );

    const comments: WxrComment[] = [];
    for (const c of asArray(item["wp:comment"])) {
      const approved = String(c["wp:comment_approved"]);
      if (approved !== "1") continue;
      const cId = String(c["wp:comment_id"]);
      const cParent = String(c["wp:comment_parent"] ?? "0");
      const cAuthor =
        typeof c["wp:comment_author"] === "object"
          ? String(c["wp:comment_author"].__cdata ?? "")
          : String(c["wp:comment_author"] ?? "");
      const cDate = String(c["wp:comment_date_gmt"] ?? c["wp:comment_date"]);
      const cContentEl = c["wp:comment_content"];
      const cContentHtml =
        typeof cContentEl === "object" && cContentEl !== null
          ? String(cContentEl.__cdata ?? "")
          : String(cContentEl ?? "");

      comments.push({
        id: cId,
        parentId: cParent === "0" ? null : cParent,
        author: cAuthor.trim() || "Anonymous",
        date: cDate,
        bodyMarkdown: htmlToMarkdownComment(cContentHtml),
      });
    }
    // Stable order: by date ascending.
    comments.sort((a, b) => (a.date < b.date ? -1 : 1));

    posts.push({
      oldPostId,
      title,
      link,
      publishedAt,
      contentHtml,
      attachmentUrls: [],
      comments,
    });
  }

  // Wire attachment URLs into their parent posts.
  for (const p of posts) {
    p.attachmentUrls = attachmentsByParentId.get(p.oldPostId) ?? [];
  }

  return { posts, attachmentsByParentId };
}

// ──────────────────────────────────────────────────────────────────────
//  HTML → Markdown
// ──────────────────────────────────────────────────────────────────────

const turndown = new TurndownService({
  headingStyle: "atx",
  bulletListMarker: "-",
  codeBlockStyle: "fenced",
  emDelimiter: "_",
  strongDelimiter: "**",
});

// Drop Squarespace's redundant top-level <h1> that repeats the title.
turndown.addRule("dropTopH1", {
  filter: (node) => {
    if (node.nodeName !== "H1") return false;
    // Only drop the first H1 in document order; keep any later H1s.
    return node.parentElement?.tagName !== "BODY"
      ? // ↑ in our case the parser doesn't give a BODY; drop all H1s
        // because every post we sampled has exactly one H1 and it
        // always repeats the title.
        true
      : true;
  },
  replacement: () => "",
});

// Convert YouTube <iframe> embeds into a [youtube:ID] shortcode token.
// Captures both `youtube.com/embed/<ID>` and `youtu.be/<ID>` forms.
turndown.addRule("youtubeIframe", {
  filter: (node) => {
    if (node.nodeName !== "IFRAME") return false;
    const src = (node as any).getAttribute?.("src") ?? "";
    return /youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\//.test(src);
  },
  replacement: (_content, node) => {
    const src = (node as any).getAttribute?.("src") ?? "";
    const id = extractYouTubeId(src);
    return id ? `\n\n[youtube:${id}]\n\n` : "";
  },
});

// Strip Squarespace's wrapper divs that carry no semantic content.
turndown.addRule("stripWrappers", {
  filter: (node) => {
    if (node.nodeName !== "DIV") return false;
    const cls = (node as any).getAttribute?.("class") ?? "";
    // Keep the inner content but drop the wrapper itself.
    return /sqs-html-content|sqs-block|sqs-block-content/.test(cls);
  },
  replacement: (content) => content,
});

function htmlToMarkdownBody(
  html: string,
  postNumberPrefixToStrip: string,
): { markdown: string; bodyYouTubeIds: string[] } {
  // Fix non-breaking spaces *before* turndown — turndown otherwise
  // preserves them as &nbsp; entities.
  let cleaned = html
    .replaceAll("\u00a0", " ")
    .replaceAll("&nbsp;", " ");

  // Strip WordPress `[caption ...]...[/caption]` shortcodes that
  // Squarespace exports leak through — they wrap a few inline images
  // with caption metadata in 5 of the 49 posts. The shortcode wrapper
  // adds nothing; the inner <img> + caption text are kept.
  cleaned = cleaned.replace(
    /\[caption[^\]]*\]([\s\S]*?)\[\/caption\]/g,
    "$1",
  );

  const bodyYouTubeIds: string[] = [];
  // Collect YouTube IDs in document order, before turndown rewrites them.
  const ifSrc = /<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  for (const m of cleaned.matchAll(ifSrc)) {
    const id = extractYouTubeId(m[1]);
    if (id) bodyYouTubeIds.push(id);
  }

  let md = turndown.turndown(cleaned);

  // Collapse runs of >2 blank lines.
  md = md.replace(/\n{3,}/g, "\n\n");

  // Strip leading copies of the title's "1. " / "1 " prefix that the
  // first markdown paragraph sometimes inherits from the H1 fallback.
  if (postNumberPrefixToStrip) {
    const prefixRe = new RegExp(
      `^${postNumberPrefixToStrip}\\.?\\s+.+\\n+`,
      "",
    );
    md = md.replace(prefixRe, "");
  }

  return { markdown: md.trim() + "\n", bodyYouTubeIds };
}

function htmlToMarkdownComment(html: string): string {
  let cleaned = html.replaceAll("\u00a0", " ").replaceAll("&nbsp;", " ");
  // Squarespace comments often have multiple <p> tags; turndown handles
  // them, but bare youtu.be / youtube.com URLs in plain text we leave
  // alone — the body renderer will detect them and embed per Q4.
  let md = turndown.turndown(cleaned);
  md = md.replace(/\n{3,}/g, "\n\n");
  return md.trim();
}

// ──────────────────────────────────────────────────────────────────────
//  YouTube ID extraction
// ──────────────────────────────────────────────────────────────────────

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  // youtube.com/embed/<ID>?...
  let m = url.match(/youtube(?:-nocookie)?\.com\/embed\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // youtu.be/<ID>
  m = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  // youtube.com/watch?v=<ID>
  m = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
  if (m) return m[1];
  return null;
}

// ──────────────────────────────────────────────────────────────────────
//  Image rewriting + downloading
// ──────────────────────────────────────────────────────────────────────

const SQUARESPACE_CDN = "images.squarespace-cdn.com";

function extractBodyImageUrls(html: string): string[] {
  const urls: string[] = [];
  for (const m of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    urls.push(m[1]);
  }
  return urls;
}

function rewriteBodyImageUrls(
  markdown: string,
  postPaddedNumber: string,
  urlMap: Map<string, string>, // remote URL → local /archive/01/foo.jpeg
): string {
  // After turndown, images appear as `![alt](url)`.
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (full, alt, url) => {
    const local = urlMap.get(url);
    if (local) return `![${alt}](${local})`;
    return full;
  });
}

async function downloadImage(
  url: string,
  destPath: string,
): Promise<void> {
  // Idempotency — if the file exists already, skip.
  try {
    await fs.access(destPath);
    return;
  } catch {
    /* not present, will fetch */
  }

  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "ITS-archive-migration/1.0 (https://inspiringthesufi.com)",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, buf);
}

function pickExtension(url: string): string {
  const u = url.split("?")[0];
  const m = u.match(/\.([a-zA-Z0-9]{1,5})$/);
  if (m) return "." + m[1].toLowerCase();
  // Squarespace's `?format=original` URLs often don't carry an extension.
  return ".jpg";
}

// ──────────────────────────────────────────────────────────────────────
//  Frontmatter serialisation
// ──────────────────────────────────────────────────────────────────────

function yamlString(s: string): string {
  // Conservative single-line YAML string. Wrap in double quotes and
  // escape only `\` and `"`. Newlines aren't expected in any field
  // we serialise this way.
  if (/\n/.test(s)) {
    throw new Error(`yamlString cannot serialise multi-line text: ${s}`);
  }
  return `"${s.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

function indentBlock(text: string, indent: string): string {
  return text
    .split("\n")
    .map((l) => indent + l)
    .join("\n");
}

function commentToYaml(c: WxrComment): string {
  const body = c.bodyMarkdown;
  // Use YAML literal block (|) for the comment body so newlines and
  // markdown punctuation pass through untouched.
  return [
    `  - id: ${yamlString(c.id)}`,
    `    parentId: ${c.parentId === null ? "null" : yamlString(c.parentId)}`,
    `    author: ${yamlString(c.author)}`,
    `    date: ${yamlString(c.date)}`,
    `    bodyMarkdown: |`,
    indentBlock(body, "      "),
  ].join("\n");
}

function buildFrontmatter(
  meta: PostMetadata,
  song: { title: string; artist: string; country: string | null; youtube: string | null },
  publishedAt: string,
  oldPath: string,
  oldPostId: string,
  hasReplacedYouTube: boolean,
  narrativeReviewNeeded: boolean,
  hero: string | null,
  relatedMedia: { label: string; youtube: string | null; note?: string }[],
  comments: WxrComment[],
): string {
  const lines: string[] = ["---"];
  lines.push(`slug: ${yamlString(meta.slug)}`);
  lines.push(`postNumber: ${yamlString(meta.postNumber)}`);
  lines.push(`postNumberSort: ${meta.postNumberSort}`);
  lines.push("");

  lines.push("name:");
  lines.push(`  english: ${yamlString(meta.name.english)}`);
  lines.push(`  meaning: ${yamlString(meta.name.meaning)}`);
  lines.push(`  arabic: null`);
  if (meta.secondName) {
    lines.push("");
    lines.push("secondName:");
    lines.push(`  english: ${yamlString(meta.secondName.english)}`);
    lines.push(`  meaning: ${yamlString(meta.secondName.meaning)}`);
    lines.push(`  arabic: null`);
  }
  lines.push("");

  lines.push("song:");
  lines.push(`  title: ${yamlString(song.title)}`);
  lines.push(`  artist: ${yamlString(song.artist)}`);
  lines.push(
    `  country: ${song.country === null ? "null" : yamlString(song.country)}`,
  );
  lines.push(
    `  youtube: ${song.youtube === null ? "null" : yamlString(song.youtube)}`,
  );
  lines.push("");

  if (relatedMedia.length > 0) {
    lines.push("relatedMedia:");
    for (const r of relatedMedia) {
      lines.push(`  - label: ${yamlString(r.label)}`);
      lines.push(
        `    youtube: ${r.youtube === null ? "null" : yamlString(r.youtube)}`,
      );
      if (r.note) lines.push(`    note: ${yamlString(r.note)}`);
    }
    lines.push("");
  }

  lines.push(`publishedAt: ${yamlString(publishedAt)}`);
  lines.push(`oldPath: ${yamlString(oldPath)}`);
  lines.push(`oldPostId: ${yamlString(oldPostId)}`);
  lines.push("");

  lines.push(`narrativeReviewNeeded: ${narrativeReviewNeeded}`);
  lines.push(`hasReplacedYouTube: ${hasReplacedYouTube}`);
  lines.push("");

  lines.push(`sonAgeNote: null`);
  lines.push(`hero: ${hero === null ? "null" : yamlString(hero)}`);
  lines.push("");

  if (comments.length > 0) {
    lines.push("comments:");
    for (const c of comments) {
      lines.push(commentToYaml(c));
    }
  } else {
    lines.push("comments: []");
  }
  lines.push("---");
  return lines.join("\n");
}

// ──────────────────────────────────────────────────────────────────────
//  Main migration
// ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("ITS migration — reading WXR …");
  const { posts } = await parseWxr();
  console.log(`  ${posts.length} posts parsed.`);

  if (posts.length !== 49) {
    throw new Error(
      `Expected 49 published posts in the WXR; got ${posts.length}`,
    );
  }

  await fs.mkdir(CONTENT_DIR, { recursive: true });
  await fs.mkdir(PUBLIC_ARCHIVE_DIR, { recursive: true });

  // Verify every post has a matching metadata row before we do any
  // expensive work (image downloads).
  const unknownIds = posts
    .map((p) => p.oldPostId)
    .filter((id) => !METADATA_BY_OLD_ID[id]);
  if (unknownIds.length > 0) {
    throw new Error(
      `Posts without metadata mapping: ${unknownIds.join(", ")}`,
    );
  }
  if (POST_METADATA.length !== posts.length) {
    throw new Error(
      `Metadata table has ${POST_METADATA.length} entries, WXR has ${posts.length}`,
    );
  }

  // Migration loop
  let totalComments = 0;
  let totalReplacements = 0;
  let totalImagesDownloaded = 0;

  for (const post of posts) {
    const meta = METADATA_BY_OLD_ID[post.oldPostId];
    if (!meta) continue; // already verified above

    const padded =
      meta.postNumberSort < 10
        ? `0${meta.postNumberSort}`
        : String(meta.postNumberSort);
    const archiveDir = path.join(PUBLIC_ARCHIVE_DIR, padded);
    await fs.mkdir(archiveDir, { recursive: true });

    // 1. Hero image — first attachment URL, if any.
    let heroLocal: string | null = null;
    if (post.attachmentUrls.length > 0) {
      const heroUrl = post.attachmentUrls[0];
      const heroExt = pickExtension(heroUrl);
      const heroFilename = `hero${heroExt}`;
      const heroPath = path.join(archiveDir, heroFilename);
      try {
        await downloadImage(heroUrl, heroPath);
        totalImagesDownloaded += 1;
        heroLocal = `/archive/${padded}/${heroFilename}`;
      } catch (err) {
        console.warn(
          `  [${meta.slug}] hero download failed: ${(err as Error).message}`,
        );
      }
    }

    // 2. Body image URLs (inline) — download and rewrite.
    const bodyImgUrls = extractBodyImageUrls(post.contentHtml);
    const urlToLocalMd = new Map<string, string>();
    for (let i = 0; i < bodyImgUrls.length; i++) {
      const url = bodyImgUrls[i];
      // Skip the hero attachment if it appears inline (it usually does on
      // Squarespace) — we already have it as `hero.{ext}`.
      if (post.attachmentUrls.includes(url)) {
        urlToLocalMd.set(url, heroLocal ?? url);
        continue;
      }
      // Only mirror Squarespace-CDN-hosted images locally; leave external
      // images (rare) as their original URLs.
      if (!url.includes(SQUARESPACE_CDN)) {
        continue;
      }
      const ext = pickExtension(url);
      const filename = `image-${i + 1}${ext}`;
      const localFs = path.join(archiveDir, filename);
      try {
        await downloadImage(url, localFs);
        totalImagesDownloaded += 1;
        urlToLocalMd.set(url, `/archive/${padded}/${filename}`);
      } catch (err) {
        console.warn(
          `  [${meta.slug}] body image #${i + 1} failed: ${
            (err as Error).message
          }`,
        );
      }
    }

    // 3. Convert HTML → Markdown.
    const numberPrefix = String(meta.postNumberSort);
    const { markdown: rawMd } = htmlToMarkdownBody(
      post.contentHtml,
      numberPrefix,
    );
    const bodyMd = rewriteBodyImageUrls(rawMd, padded, urlToLocalMd);

    // 4. Apply YouTube replacements — keyed on the broken video ID, so
    //    multi-embed posts swap exactly the right token. Track whether
    //    *any* replacement was applied for `hasReplacedYouTube`.
    let bodyMdReplaced = bodyMd;
    let hasReplacedYouTube = false;
    const replacedIdsThisPost = new Set<string>();
    for (const [oldId, replacement] of Object.entries(YOUTUBE_REPLACEMENTS)) {
      if (replacement.postId !== post.oldPostId) continue;
      const token = `[youtube:${oldId}]`;
      if (bodyMdReplaced.includes(token)) {
        bodyMdReplaced = bodyMdReplaced.replaceAll(
          token,
          `[youtube:${replacement.newYouTube}]`,
        );
        replacedIdsThisPost.add(oldId);
        hasReplacedYouTube = true;
      }
    }
    if (hasReplacedYouTube) totalReplacements += 1;

    // 5. Dedupe consecutive duplicate `[youtube:ID]` tokens — when a
    //    multi-embed memorial set (e.g. Post 19, three Prince clips)
    //    all collapse to the same replacement ID, we want one embed
    //    not three.
    bodyMdReplaced = bodyMdReplaced.replace(
      /(\[youtube:([A-Za-z0-9_-]{11})\]\s*\n+\s*)+(\[youtube:\2\])/g,
      "$3",
    );
    // Also catch non-adjacent duplicates: if the same ID appears more
    // than once in the body after replacement, drop later occurrences.
    bodyMdReplaced = (() => {
      const seen = new Set<string>();
      return bodyMdReplaced.replace(
        /\[youtube:([A-Za-z0-9_-]{11})\]/g,
        (full, id) => {
          if (seen.has(id)) return "";
          seen.add(id);
          return full;
        },
      );
    })();
    bodyMdReplaced = bodyMdReplaced.replace(/\n{3,}/g, "\n\n");

    // 6. After replacements, re-extract YouTube IDs from the body
    //    in document order to compute headline + relatedMedia.
    const finalBodyIds: string[] = [];
    for (const m of bodyMdReplaced.matchAll(
      /\[youtube:([A-Za-z0-9_-]{11})\]/g,
    )) {
      finalBodyIds.push(m[1]);
    }

    let headlineYoutube: string | null = null;
    const headlineOverride = HEADLINE_OVERRIDES[post.oldPostId];
    if (headlineOverride && finalBodyIds.includes(headlineOverride)) {
      headlineYoutube = headlineOverride;
    } else if (finalBodyIds.length > 0) {
      headlineYoutube = finalBodyIds[0];
    }

    const relatedMedia: { label: string; youtube: string | null; note?: string }[] = [];
    for (const id of finalBodyIds) {
      if (id === headlineYoutube) continue;
      relatedMedia.push({
        label: "Also referenced in this post",
        youtube: id,
      });
    }

    // 6. Frontmatter
    const song = {
      title: meta.song.title,
      artist: meta.song.artist,
      country: meta.song.country,
      youtube: headlineYoutube,
    };
    const narrativeReviewNeeded = NARRATIVE_REVIEW_POST_IDS.has(
      post.oldPostId,
    );
    const frontmatter = buildFrontmatter(
      meta,
      song,
      post.publishedAt,
      post.link,
      post.oldPostId,
      hasReplacedYouTube,
      narrativeReviewNeeded,
      heroLocal,
      relatedMedia,
      post.comments,
    );

    const fileText = `${frontmatter}\n\n${bodyMdReplaced.trim()}\n`;
    const filePath = path.join(CONTENT_DIR, `${meta.slug}.md`);
    await fs.writeFile(filePath, fileText, "utf8");

    totalComments += post.comments.length;

    const replacementMark = hasReplacedYouTube ? "✱" : " ";
    const reviewMark = narrativeReviewNeeded ? "✦" : " ";
    console.log(
      `  [${meta.slug}] ${replacementMark}${reviewMark} ` +
        `body=${(bodyMdReplaced.length / 1024).toFixed(1)}KB · ` +
        `${post.comments.length} comments · ` +
        `${urlToLocalMd.size} body imgs`,
    );
  }

  console.log("");
  console.log("Migration complete.");
  console.log(`  posts:        ${posts.length}`);
  console.log(`  comments:     ${totalComments}`);
  console.log(`  replacements: ${totalReplacements}`);
  console.log(`  images:       ${totalImagesDownloaded} downloaded`);
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});