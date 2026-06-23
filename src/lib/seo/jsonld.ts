/**
 * Article JSON-LD builder for archive post pages.
 *
 * Rendered in the page body as a single
 *   <script type="application/ld+json">
 * tag, so Google / Bing / DuckDuckGo / etc. can read each archive
 * entry as a dated article authored by Sufi Punk.
 *
 * Per Naz's M6 directive: headline (the Name + meaning), author
 * (Sufi Punk), datePublished, plus description and mainEntityOfPage.
 * We additionally include `image` (the same picture shown in the
 * page's OG card) and `publisher` so the structured-data validator
 * doesn't complain about missing required fields on `Article`.
 */

import type { ArchivePost } from "@/lib/archive/types";
import { SITE_URL, absoluteUrl } from "./site";
import { postOgImagePath } from "./post-og";

/** "Al Karim — The Generous"; for Post 45/46: "Al Zahir & Al Batin — The Manifest & The Hidden". */
function postHeadline(post: ArchivePost): string {
  const englishNames = post.secondName
    ? `${post.name.english} & ${post.secondName.english}`
    : post.name.english;
  const meanings = post.secondName
    ? `${post.name.meaning} & ${post.secondName.meaning}`
    : post.name.meaning;
  return `${englishNames} — ${meanings}`;
}

/** "Al Karim (The Generous) — Man in the Mirror, Michael Jackson". */
function postDescription(post: ArchivePost): string {
  const namePart = post.secondName
    ? `${post.name.english} & ${post.secondName.english} (${post.name.meaning} & ${post.secondName.meaning})`
    : `${post.name.english} (${post.name.meaning})`;
  const songPart = [post.song.title, post.song.artist].filter(Boolean).join(", ");
  return songPart ? `${namePart} — ${songPart}` : namePart;
}

export function articleJsonLd(post: ArchivePost): Record<string, unknown> {
  const url = absoluteUrl(`/archive/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: postHeadline(post),
    description: postDescription(post),
    datePublished: post.publishedAt,
    author: {
      "@type": "Person",
      name: "Sufi Punk",
    },
    publisher: {
      "@type": "Organization",
      name: "Inspiring the Sufi",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: [absoluteUrl(postOgImagePath(post))],
    url,
  };
}