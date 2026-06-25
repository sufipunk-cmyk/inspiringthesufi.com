/**
 * `/` — the homepage. The site's front door.
 *
 * Three pieces only, in order: wordmark hero → first two paragraphs of
 * the About page (pulled live from `ABOUT_PARAGRAPHS.slice(0, 2)`, the
 * single source of truth — never copy-paste here) → the three Wander
 * entry points presented as one inline sentence with ♦ separators,
 * using the same component the Archive page uses.
 *
 * Deliberately no alcove around the title: the alcove vocabulary is
 * reserved for the archive's narrow index cards (M3 Q5, reinforced by
 * M4). The wordmark in Cormorant Garamond on parchment, with a hairline
 * `❁` divider beneath, does the work an alcove would have done without
 * colonising the archive's own frame.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ArchiveIndexWanderLine } from "@/components/archive/ArchiveIndexWanderLine";
import { ABOUT_PARAGRAPHS } from "@/lib/about/text";
import { OG_IMAGES } from "@/lib/seo/og";

const HOME_DESCRIPTION =
  "Fifty Names of Allah, surrounded by songs. Each Name set next to a piece of secular music — a digital archive of a finished body of work.";

export const metadata: Metadata = {
  title: "Inspiring the Sufi",
  description: HOME_DESCRIPTION,
  openGraph: {
    title: "Inspiring the Sufi",
    description: HOME_DESCRIPTION,
    url: "/",
    type: "website",
    images: [
      {
        url: OG_IMAGES.home.src,
        width: OG_IMAGES.home.width,
        height: OG_IMAGES.home.height,
        type: OG_IMAGES.home.type,
        alt: OG_IMAGES.home.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiring the Sufi",
    description: HOME_DESCRIPTION,
    images: [OG_IMAGES.home.src],
  },
  alternates: {
    canonical: "/",
  },
};

// Tagline + overline confirmed by Naz post-M5.
// "An archive of attention." picks up Naz's own word "attention" from
// About paragraph 5 ("…attention could become a form of devotion").
const HOME_TAGLINE = "An archive of attention.";
const HOME_OVERLINE = "Inspiring the Sufi · Archive";

const EXCERPT = ABOUT_PARAGRAPHS.slice(0, 2);

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-16 sm:py-20">
        {/* Wordmark hero */}
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.32em] text-bronze">
            {HOME_OVERLINE}
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-green sm:text-6xl">
            Fifty Names,
            <span className="block">surrounded by songs.</span>
          </h1>
          <p className="mt-6 font-display text-xl italic text-ink-soft sm:text-2xl">
            {HOME_TAGLINE}
          </p>
        </header>

        <div className="divider-flower mt-12" aria-hidden="true">
          ❁
        </div>

        {/* About excerpt — first two paragraphs, no edits, no
            transforms. ABOUT_PARAGRAPHS is the single source of truth;
            edits to those constants update the homepage and /about
            together in the same commit. */}
        <article className="mx-auto mt-12 max-w-[38rem] font-serif text-[1.1rem] leading-[1.8] text-ink sm:text-[1.15rem]">
          {EXCERPT.map((p, i) => (
            <p key={p.index} className={i === 0 ? "" : "mt-6"}>
              {p.body}
            </p>
          ))}

          <p className="mt-8 text-center">
            <Link
              href="/about"
              className="font-display text-base italic text-ink-soft underline decoration-bronze/55 underline-offset-4 transition-colors hover:text-bronze sm:text-lg"
            >
              Read on{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </p>
        </article>

        <div className="divider-flower mt-14" aria-hidden="true">
          ❁
        </div>

        {/* Wander entry points — same component as /archive, with no
            `active` prop so all three modes render as live links. */}
        <div className="mt-10">
          <ArchiveIndexWanderLine />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}