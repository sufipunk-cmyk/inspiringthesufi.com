/**
 * /play-with-me — the active door.
 *
 * Server component renders the verbatim Physicians-of-the-Heart text
 * and the closing copy; the active form is the <PlayForm/> client
 * component. Page-heading rendering, button label, toggle visual, email
 * placeholder, and success-state link are all confirmed by Naz post-M4.
 */

import type { Metadata } from "next";
import Link from "next/link";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { PlayForm } from "@/components/play/PlayForm";
import {
  PHYSICIANS_HREF,
  PHYSICIANS_LINK_TEXT,
  PLAY_CLOSING_LINE,
  PLAY_CLOSING_SMALL_PRINT,
  PLAY_INTRO_HEADING,
  PLAY_INTRO_PARAGRAPHS,
} from "@/lib/play/text";
import { OG_IMAGES } from "@/lib/seo/og";

const PLAY_DESCRIPTION =
  "There are as many ways to turn toward the Divine as there are people seeking. What's yours? A native, quiet form for sharing your own way in.";

export const metadata: Metadata = {
  title: "Play with me — Inspiring the Sufi",
  description: PLAY_DESCRIPTION,
  openGraph: {
    title: "Play with me — Inspiring the Sufi",
    description: PLAY_DESCRIPTION,
    url: "/play-with-me",
    type: "website",
    images: [
      {
        url: OG_IMAGES.playWithMe.src,
        width: OG_IMAGES.playWithMe.width,
        height: OG_IMAGES.playWithMe.height,
        type: OG_IMAGES.playWithMe.type,
        alt: OG_IMAGES.playWithMe.alt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Play with me — Inspiring the Sufi",
    description: PLAY_DESCRIPTION,
    images: [OG_IMAGES.playWithMe.src],
  },
  alternates: {
    canonical: "/play-with-me",
  },
};

export default function PlayWithMePage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.32em] text-bronze">
            Play with me
          </p>
          <h1 className="mt-5 font-display text-3xl italic leading-snug text-green sm:text-[2.4rem]">
            {PLAY_INTRO_HEADING}
          </h1>
        </header>

        <div className="divider-flower mt-10" aria-hidden="true">
          ❁
        </div>

        <article className="mx-auto mt-10 max-w-[38rem] font-serif text-[1.1rem] leading-[1.8] text-ink sm:text-[1.15rem]">
          {PLAY_INTRO_PARAGRAPHS.map((p, i) => (
            <p key={p.index} className={i === 0 ? "" : "mt-6"}>
              {renderParagraph(p.body)}
            </p>
          ))}
        </article>

        <div className="divider-flower mt-14" aria-hidden="true">
          ❁
        </div>

        <div className="mt-10">
          <PlayForm />
        </div>

        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="font-serif text-[1rem] italic leading-relaxed text-ink-soft sm:text-[1.05rem]">
            {PLAY_CLOSING_LINE}
          </p>
          <p className="mt-4 font-serif text-xs leading-relaxed text-ink-soft/80">
            {PLAY_CLOSING_SMALL_PRINT}
          </p>
        </div>

        <p className="mx-auto mt-12 max-w-md text-center font-serif text-xs italic text-ink-soft/65">
          Submissions are emailed directly to Naz.{" "}
          <Link
            href="/about"
            className="underline decoration-bronze/50 underline-offset-4 hover:text-bronze"
          >
            About this practice
          </Link>
          .
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

/**
 * Renders a paragraph body that may contain the [PHYSICIANS_LINK]
 * marker. The marker is replaced by an <a> wrapping
 * "Physicians of the Heart" and pointing at physiciansoftheheart.com.
 */
function renderParagraph(body: string): React.ReactNode {
  const marker = "[PHYSICIANS_LINK]";
  const idx = body.indexOf(marker);
  if (idx === -1) return body;
  const before = body.slice(0, idx);
  const after = body.slice(idx + marker.length);
  return (
    <>
      {before}
      <a
        href={PHYSICIANS_HREF}
        target="_blank"
        rel="noreferrer"
        className="text-green underline decoration-bronze/65 underline-offset-4 transition-colors hover:text-bronze"
      >
        {PHYSICIANS_LINK_TEXT}
      </a>
      {after}
    </>
  );
}