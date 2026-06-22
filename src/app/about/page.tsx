/**
 * /about — the canonical About page.
 *
 * Carries Naz's eight-paragraph confirmed text from
 * `source-docs/ITS_Master_Brief.md` (June 2026). Single source of truth
 * for the wording site-wide; future milestones (Home M5+) excerpt from
 * `ABOUT_PARAGRAPHS` rather than maintaining their own copy.
 *
 * Layout: clean parchment, single centred column, no alcove around the
 * body text. The alcove vocabulary belongs to the archive entries; on
 * the About page the voice itself is what holds the reader. A small
 * pull-quote between paragraphs 5 and 6 lifts one of Naz's own lines
 * for a moment of breath, and the page closes with a quiet "Come sit
 * with me" invitation pointing at /play-with-me (which lands in M4 —
 * until then it renders as plain italic, not a clickable link).
 *
 * Three header strings (overline, h1, kicker) and the pull-quote are
 * flagged with AWAITING NAZ'S APPROVAL markers — the agent drafted the
 * page heading, so the eight paragraphs themselves stay verbatim while
 * the page-level chrome around them is reviewable.
 */

import type { Metadata } from "next";

import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ABOUT_PARAGRAPHS, ABOUT_PULL_QUOTE } from "@/lib/about/text";

export const metadata: Metadata = {
  title: "About — Inspiring the Sufi",
  description:
    "Low-demand faith and Spiritual Parallel Play, in Naz's own words.",
};

// Toggles, kept at module scope so they're trivially audited / flipped
// while the page is in approval-pending state.
const SHOW_PULL_QUOTE = true;
const SHOW_COME_SIT_WITH_ME = true;
const COME_SIT_WITH_ME_LINKS_TO_PLAY = false; // M4 not live yet — leave as italic

// AWAITING NAZ'S APPROVAL — Q1 page heading.
const ABOUT_HEADING_LINE_1 = "Two definitions,";
const ABOUT_HEADING_LINE_2 = "and where they began.";

// AWAITING NAZ'S APPROVAL — Q2 italic kicker.
const ABOUT_KICKER = "Low-demand faith. Spiritual Parallel Play.";

export default function AboutPage() {
  // Insert the pull-quote between paragraphs 5 and 6 (i.e. after index 5).
  return (
    <>
      <SiteHeader />
      <main className="container py-16 sm:py-20">
        <header className="mx-auto max-w-2xl text-center">
          <p className="font-display text-xs uppercase tracking-[0.32em] text-bronze">
            About
          </p>
          <h1 className="mt-4 font-display text-5xl leading-tight text-green sm:text-6xl">
            {ABOUT_HEADING_LINE_1}
            <span className="block">{ABOUT_HEADING_LINE_2}</span>
          </h1>
          <p className="mt-6 font-serif text-[1.05rem] italic text-ink-soft sm:text-[1.15rem]">
            {ABOUT_KICKER}
          </p>
          <p className="mt-3 font-serif text-xs italic text-ink-soft/70">
            (Page heading and kicker — awaiting Naz&apos;s approval. The eight
            paragraphs below are verbatim.)
          </p>
        </header>

        <div className="divider-flower mt-10" aria-hidden="true">
          ❁
        </div>

        <article className="mx-auto mt-12 max-w-[38rem] font-serif text-[1.1rem] leading-[1.8] text-ink sm:text-[1.15rem]">
          {ABOUT_PARAGRAPHS.map((p, i) => {
            const isAfterFifth = p.index === 5;
            return (
              <div key={p.index}>
                <p className={i === 0 ? "" : "mt-6"}>{p.body}</p>
                {SHOW_PULL_QUOTE && isAfterFifth ? (
                  <PullQuote>{ABOUT_PULL_QUOTE}</PullQuote>
                ) : null}
              </div>
            );
          })}

          {SHOW_COME_SIT_WITH_ME ? (
            <p className="mt-12 text-center font-display text-xl italic text-bronze sm:text-2xl">
              {COME_SIT_WITH_ME_LINKS_TO_PLAY ? (
                <a
                  href="/play-with-me"
                  className="underline decoration-bronze/65 underline-offset-4 transition-colors hover:text-green"
                >
                  Come sit with me.
                </a>
              ) : (
                // Plain italic until M4 lands — clicking nowhere is the right
                // behaviour while /play-with-me does not yet exist.
                <span>Come sit with me.</span>
              )}
            </p>
          ) : null}
        </article>
      </main>
      <SiteFooter />
    </>
  );
}

function PullQuote({ children }: { children: React.ReactNode }) {
  return (
    <figure className="my-12 sm:my-14">
      <hr className="mx-auto h-px w-16 border-0 bg-bronze/45" />
      <blockquote className="mx-auto mt-6 max-w-[32rem] text-balance text-center font-display text-[1.35rem] italic leading-snug text-green sm:text-[1.6rem]">
        <span aria-hidden="true" className="mr-1 text-bronze">
          “
        </span>
        {children}
        <span aria-hidden="true" className="ml-1 text-bronze">
          ”
        </span>
      </blockquote>
      <hr className="mx-auto mt-6 h-px w-16 border-0 bg-bronze/45" />
    </figure>
  );
}