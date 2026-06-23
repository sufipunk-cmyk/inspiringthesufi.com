/**
 * /archive — the index. 49 alcoves in Concept A layout, with the
 * Wander sentence woven into the page voice (no filter UI).
 */

import type { Metadata } from "next";

import { ArchiveIndexAlcove } from "@/components/archive/ArchiveIndexAlcove";
import { ArchiveIndexWanderLine } from "@/components/archive/ArchiveIndexWanderLine";
import { FooterThreshold } from "@/components/archive/FooterThreshold";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { loadAllArchivePosts } from "@/lib/archive/loader";
import { isWanderMode, sortPosts } from "@/lib/archive/wander";
import type { WanderMode } from "@/lib/archive/types";
import { OG_IMAGES } from "@/lib/seo/og";

const ARCHIVE_DESCRIPTION =
  "Forty-nine names. Forty-nine songs. Each of the 99 Names of Allah set next to a piece of secular music — a digital archive of a finished body of work.";

export const metadata: Metadata = {
  title: "The Archive — Inspiring the Sufi",
  description: ARCHIVE_DESCRIPTION,
  openGraph: {
    title: "The Archive — Inspiring the Sufi",
    description: ARCHIVE_DESCRIPTION,
    url: "/archive",
    type: "website",
    images: [
      {
        url: OG_IMAGES.archive.src,
        width: OG_IMAGES.archive.width,
        height: OG_IMAGES.archive.height,
        type: OG_IMAGES.archive.type,
        alt: OG_IMAGES.archive.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Archive — Inspiring the Sufi",
    description: ARCHIVE_DESCRIPTION,
    images: [OG_IMAGES.archive.src],
  },
  alternates: {
    canonical: "/archive",
  },
};

type SearchParams = { wander?: string | string[] };

// Standfirst — confirmed by Naz (post-M4). Lives here as a single
// const so future edits happen in one place.
const ARCHIVE_STANDFIRST = `Forty-nine entries, written between 2015 and 2017, each pairing one of the 99 Names of Allah with a piece of secular music — a song someone already loved, sat next to a Name and a meaning, to see where they touched. The archive is finished; this is its quiet home.`;

export default async function ArchiveIndexPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.wander) ? sp.wander[0] : sp.wander;
  const wander: WanderMode = isWanderMode(raw) ? raw : "order";

  const posts = sortPosts(loadAllArchivePosts(), wander);

  return (
    <>
      <SiteHeader />
      <main className="container py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.32em] text-bronze">
            The Archive
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-green sm:text-6xl">
            Forty-nine names.
            <span className="block">Forty-nine songs.</span>
          </h1>
          <p className="mt-8 font-serif text-[1.1rem] leading-[1.7] text-ink sm:text-[1.15rem]">
            {ARCHIVE_STANDFIRST}
          </p>
        </header>

        <div className="divider-flower mt-12" aria-hidden="true">
          ❁
        </div>

        <div className="mt-12">
          <ArchiveIndexWanderLine active={wander} />
        </div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
          {posts.map((p) => (
            <ArchiveIndexAlcove key={p.slug} post={p} wander={wander} />
          ))}
        </div>
      </main>
      <FooterThreshold />
      <SiteFooter />
    </>
  );
}