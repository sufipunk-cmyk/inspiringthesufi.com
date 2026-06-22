# M3 — About

> **Status: PLAN — about to be implemented in this same milestone.** Naz's directive on 22 June 2026: "Please proceed with M3 — the About page — using the structure and content rules established for the rest of the site." Same discipline as M0/M1/M1.5/M2: spec → code → browser-test → tarball → stop for confirmation.

## Overview

The About page carries the **single confirmed canonical text** of *what this site is, in Naz's own words*. The text is locked at the master-brief level — eight paragraphs, written by Naz, June 2026 — and supersedes every earlier draft, including the original "In 2015 I couldn't pray…" passage. The About page is the single source of truth for that text site-wide; future home-page (M5+) and Play-with-me (M4) excerpts will quote *from* this page, not maintain their own copies.

## Goals

1. Ship the About page at `/about` with the eight confirmed paragraphs **verbatim** — no paraphrasing, no summarising, no AI-rewriting, no quiet edits to vocabulary or punctuation.
2. Sit inside the same visual register as M1.5 / M2: parchment ground, Cormorant Garamond body, bronze accents, the same alcove vocabulary used elsewhere — but used quietly here, not loudly. About is contemplative, not feature-filled.
3. Reach typographic settings appropriate to a long single-column read: comfortable measure (~64–68 characters), generous line-height, drop-cap or first-line treatment optional but only if it doesn't fight the voice.
4. Make the page reachable from the global header and footer.
5. Leave the page extensible: future milestones (Home M5+) need to be able to pull the first two paragraphs as an excerpt without having to re-author the text. The text therefore lives in a single typed module and the page renders it.
6. Treat the page as a *quiet door*, not a marketing "About Us". No team photos, no "our mission" framing, no CTA stack at the bottom — just Naz's words and the site's own quiet exit (sister door + sitewide footer).

## Non-goals (explicitly NOT in M3)

- Substack / Ko-fi / "Find me" links module — not on the About page (the brief lists those under **Find me**, separate concern). They surface from the global footer's "Elsewhere" column already, which is enough.
- A photo of Naz. The brief never asked for one and adding it would shift register.
- Any inline form. Play with me is its own page, M4.
- Any rewrite of the canonical text. Even small "clarity" improvements are out of scope.
- Any duplication of the homepage excerpt mechanism. M3 only ships the About page; M5+ will excerpt *from* M3's text module.
- The footer threshold (golden-doors mosaic + "Return to the Sanctuary" alcove) is **archive-only** per master brief §136-7; About uses the standard `SiteFooter` only.

---

## 1. The canonical text (verbatim, locked)

Eight paragraphs, source: `source-docs/ITS_Master_Brief.md` lines 391-432, dated June 2026.

> 1. Low-demand faith is the recognition that faith can be practised outside ritual, standardised religious practices, and cultural norms. It is the understanding that our relationship with the Divine is often alive in the ordinary moments of our lives, not only within formal acts of worship.
>
> 2. For more than a decade, my work in community arts has centred around accessibility, belonging, and faith. I have spent years designing spaces where people can engage in ways that honour their own capacity, curiosity, and ways of being. Spiritual Parallel Play grew out of that same curiosity and was eventually applied to my own relationship with God.
>
> 3. I became interested in what contemplation of the Divine might look like outside ritual and ceremony. What happens when we follow intuition, longing, wonder, and direct guidance? What if faith could be approached with the same spirit of exploration that we bring to art, creativity, and play?
>
> 4. In 2015, I wanted my son to have his own direct connection with God — one that did not depend solely on inherited forms, rules, or the interpretations of others. As I reflected on this, I began trying to understand and document my own spiritual play with God, hoping that one day he might discover his own.
>
> 5. At the time, music was my special interest. I began a practice of allowing a song to lead me towards God. Sometimes a Divine Name would lead me to a song. Sometimes a feeling, a memory, or a question would become the starting point. I followed these threads playfully, trusting that longing itself could be a form of guidance and that attention could become a form of devotion.
>
> 6. Over time, I realised that many people were already doing something similar. They encountered the Divine through nature, poetry, movement, gardening, art, collecting objects, learning, making things, caring for others, or following a fascination wherever it led. What connected these experiences was not the activity itself but the quality of attention they brought to it.
>
> 7. Today, I invite others to sit with me in this space of Spiritual Parallel Play. Together, we explore the ways God meets us through our interests, curiosities, delights, and longings. We share the unexpected paths that have opened our hearts, trusting that there are as many ways to turn towards the Divine as there are people seeking.
>
> 8. Spiritual Parallel Play is not a replacement for traditional practice. Rather, it is an invitation to notice the sacred conversations already taking place within our lives and to recognise them as part of our relationship with God.

These eight paragraphs ship intact, in this exact order, with this exact wording. No drop-cap on "Low-demand faith" because Naz uses it as a defined term immediately ("Low-demand faith *is*…"); a drop-cap would break the typographic rhythm of that opening definition. The first paragraph instead opens flush, with the term "Low-demand faith" rendered in the same body face — emphasis comes from the syntactic position, not from extra ornament.

---

## 2. Data model

Single typed module at `src/lib/about/text.ts`:

```ts
export type AboutParagraph = {
  /** 1..8, matches the master-brief numbering for traceability. */
  index: number;
  /** Verbatim paragraph text. */
  body: string;
};

export const ABOUT_PARAGRAPHS: AboutParagraph[];
```

Reasons for a typed module rather than a markdown file:

1. The text is short, fixed, and authored by Naz directly — no migration pipeline, no parsing, no risk of YAML frontmatter drift.
2. Future M5+ Home page needs `ABOUT_PARAGRAPHS.slice(0, 2)` as a one-line operation. Markdown would require either a re-parse or a hand-maintained excerpt copy.
3. Strict TypeScript types make a future "import the wrong paragraph" mistake structurally impossible.

The full text is also referenced (not duplicated) in code comments by line range from `source-docs/ITS_Master_Brief.md`, so anyone reading the module can trace it back.

## 3. Page layout (`/about`)

Single full-page route, `src/app/about/page.tsx`, server component, statically rendered.

Vertical structure top-to-bottom:

1. `SiteHeader` — unchanged from M1.5/M2, except the existing primary-nav now also points at `/about` (see §6).
2. **Page header block**, max-width ≈ 36rem, centred:
   - Bronze, uppercase, tracking-[0.32em] overline: `About`.
   - Cormorant Garamond H1 in green: a quiet, two-line title — *Two definitions, / and where they began.* The title is mine (the agent's), not Naz's, and is therefore explicitly drafted-for-approval (see §11).
   - A short italic ink-soft kicker line in serif: *Low-demand faith. Spiritual Parallel Play.* — this echoes the two terms Naz defines in the canonical text without paraphrasing them. Also drafted-for-approval.
   - `❁` divider.
3. **Body block**, max-width ≈ 38rem, centred, font-serif (Cormorant) at ≈ 1.1rem, line-height ≈ 1.75, paragraph spacing generous. The eight `ABOUT_PARAGRAPHS` render as plain `<p>` elements, mapped from the typed module.
4. **A quiet pull-quote** between paragraphs 5 and 6 lifting Naz's own line — *"trusting that longing itself could be a form of guidance and that attention could become a form of devotion."* — set in a centred, italic, larger Cormorant face with bronze rule-marks above and below. The quote is **not invented**; it is lifted verbatim from paragraph 5 and shown in addition (in italics, between paragraphs) so it acts as a moment of breath, not as new content. Optional — see §11 acceptance criteria; if Naz prefers a perfectly clean text without the pull-quote, it is straightforward to remove. Implementation flag: `SHOW_PULL_QUOTE` (boolean, on by default, easy to flip).
5. **Page-foot resonance**: a small, italic, ink-soft line in the same voice as the page below paragraph 8, linking through to the active door — *Come sit with me.* — a `Link` to `/play-with-me`. **Important**: the brief lists "Come sit with me" as a *home-page* invitation line, not strictly an About page line. We include it on About too because paragraph 7 ends with "I invite others to sit with me", and following that immediately with a clickable "Come sit with me" line is the natural close. If Naz prefers to reserve "Come sit with me" exclusively for the home page, we'll remove it from About when M5+ lands. Flag: `SHOW_COME_SIT_WITH_ME` (boolean, on by default).
6. `SiteFooter` — unchanged.

No alcove frame is wrapped around the body text. The alcove is the archive's vocabulary; About is the page where the archive's *frame* steps aside and the voice itself is what holds the reader. There is one quiet exception: the page-header overline + h1 + kicker can sit inside a tone="default" alcove, but this is **opt-in via flag** (`SHOW_HEADER_ALCOVE`, **off by default**) — the default render is alcove-free, parchment-only.

## 4. API contracts

None. About is fully static.

## 5. Edge cases / failure modes

| Case | Behaviour |
|---|---|
| `ABOUT_PARAGRAPHS` accidentally edited and length ≠ 8 | Page still renders; the build-time `check:archive` lint script gains a `check:about` companion (§7) that fails CI/local with a clear message. Not a runtime concern. |
| Pull-quote toggled off | Paragraphs 5 → 6 flow normally with usual spacing. |
| Long, narrow viewport (≤ 360px) | Body measure clamps via existing `container` rules; min font-size 1rem; pull-quote rule-marks shrink to short hairlines. |
| Reduced-motion / prefers-reduced-motion | About has no motion. Already compliant by construction. |
| `/about` requested with trailing `?from=archive` etc. | Unused; ignored. About has no query-string behaviour. |
| Old Squarespace `/about` URL | Squarespace About did not have a stable canonical path historically; out of scope. If Naz later flags one, we'll add it to `redirects.generated.json`. |

## 6. Header + footer wiring

- `SiteHeader` primary nav, current order: `The Archive` → sister door. New order after M3: `The Archive` → `About` → sister door.
- `SiteFooter` "Elsewhere" column already lists the sister door + `sufipunk@icloud.com`. Add an "About" link **above** the Archive column? **No** — keep "Elsewhere" focused on outbound. Instead, add an "About" entry in the Archive column header? Cleaner: add a tiny new `On this site` mini-column **only on M3 onwards**, listing `About` and (later) `Play with me`. Decision for M3: keep the existing two-column footer (`The Archive` + `Elsewhere`) and just have the About link in the *header*. The footer stays clean. M5+ can revisit when the navigation is more populated.

## 7. Lint script

`scripts/check-about.ts`, identical pattern to `scripts/check-archive.ts`:

- Reads `src/lib/about/text.ts` via simple `import { ABOUT_PARAGRAPHS }`.
- Asserts `ABOUT_PARAGRAPHS.length === 8`.
- Asserts every `body` is non-empty and ≥ 80 chars (catches accidental truncation).
- Reads `src/app/about/page.tsx` and warns if either the title or kicker still carries an `// AWAITING NAZ'S APPROVAL` marker (parallel to the standfirst marker on `/archive`).
- Run via `bun run check:about`.

## 8. Routing / navigation

| Route | File | Render |
|---|---|---|
| `/about` | `src/app/about/page.tsx` | Static, server component |

`generateMetadata` returns:
```ts
{
  title: "About — Inspiring the Sufi",
  description:
    "Low-demand faith and Spiritual Parallel Play, in Naz's own words.",
}
```

## 9. File layout for M3

```
src/
  app/
    about/
      page.tsx                     # the route
  lib/
    about/
      text.ts                      # ABOUT_PARAGRAPHS, the eight verbatim paragraphs
  components/
    site/
      SiteHeader.tsx               # +1 nav link
specs/
  m3-about/
    document.md                    # this file
scripts/
  check-about.ts                   # lint
```

No new images, no new fonts, no new packages.

## 10. Acceptance criteria

1. **`/about`** is reachable both via direct URL and via the primary-nav `About` link in the header.
2. The page renders **all eight** canonical paragraphs in order, **verbatim**, with no edits and no insertions other than the optional pull-quote (which itself is a verbatim lift of one sentence from paragraph 5).
3. The paragraphs are visually grouped as one continuous, single-column read, in Cormorant Garamond, on the parchment ground.
4. The page is responsive: legible at 1440×900 (desktop) and 390×844 (mobile), with no horizontal overflow at 390 px.
5. The header and kicker are flagged in source as awaiting Naz's approval; the lint script reports it.
6. `bun run build` is clean; `/about` appears as a static (○) route.
7. The eight paragraphs are accessible to future milestones via a typed module (`ABOUT_PARAGRAPHS`) so the home page can later pull the first two paragraphs without a copy-paste duplication.
8. No alcove wraps the body text by default; the body is clean parchment.
9. The page contains **no** Substack/Ko-fi/social links, no team photos, no "Our story" framing, no CTA stack.
10. The footer threshold component does **not** appear on `/about` — that component stays exclusive to `/archive`.

## 11. Open questions (drafted-for-approval, not blocking the build)

- **Q1 — Page heading.** Naz didn't write a title for this page. The agent draft is *Two definitions, and where they began.* Approve, replace, or remove entirely (just keep the `About` overline).
- **Q2 — Italic kicker line.** Draft: *Low-demand faith. Spiritual Parallel Play.* Approve, replace, or remove.
- **Q3 — Pull-quote between paragraphs 5 and 6.** A breath in the middle of a long page, lifted verbatim from Naz's own paragraph 5. Keep, or remove for a perfectly clean text?
- **Q4 — "Come sit with me" link to /play-with-me below paragraph 8.** Brief lists this line as a *home-page* invitation. We've added it to About too as the natural close of paragraph 7's "I invite others to sit with me". Keep on About, remove from About (reserve for home), or use a different closing line?
- **Q5 — Header-alcove default.** Currently off (clean parchment). Should the header overline + h1 + kicker sit inside a tone="default" alcove, mirroring how the archive entries are framed?
- **Q6 — `/about` Squarespace redirect.** Did the old Squarespace site use a stable `/about-1` or similar path that we should map into `redirects.generated.json`?

All six are flagged with `// AWAITING NAZ'S APPROVAL` markers in source and surfaced by `bun run check:about` so they cannot ship silently.

## 12. Implementation notes

- **No new packages.** Everything M3 needs is already installed.
- The route is a pure server component. No `"use client"` anywhere on the About page.
- The "Come sit with me" link points to `/play-with-me` even though that route is M4. Until M4 lands, the link will 404 if clicked. **Two acceptable behaviours**: (a) ship the link disabled (rendered as plain ink-soft italic, no anchor) until M4; (b) ship the link live and accept a temporary 404 since M4 will likely follow within a small number of milestones. The implementation chooses **(a)** — render as plain italic until M4. Replacing it with a `Link` is a one-line change later.
- The pull-quote uses a styled `<blockquote>` element and is read by screen readers as a quote with the same text the page already contains, so it doesn't introduce new content for assistive tech either; it's a visual breath.

## 13. Test plan

Browser-verified (per the project's standing discipline):

- Desktop **1440 × 900**:
  1. Navigate `/about` directly → screenshot top.
  2. Scroll to mid-page (around the pull-quote) → screenshot.
  3. Scroll to page foot → screenshot.
  4. Click `About` in primary nav from `/archive` → confirm route changes correctly.
- Mobile **390 × 844**:
  1. Navigate `/about` directly → screenshot top.
  2. Scroll past pull-quote → screenshot.
  3. Scroll to foot → screenshot.
  4. Inspect `document.documentElement.scrollWidth` vs `clientWidth` — must equal (no horizontal overflow).
  5. Tap primary-nav `About` from header on mobile → confirm route works.

Build-time:

- `bun run build` clean.
- `bun run check:about` reports paragraphs = 8, no truncation, and surfaces the AWAITING markers as warnings.

## 14. Status / open questions

- **Status:** PLAN, this same milestone implements it.
- **Open questions:** §11 Q1–Q6, all flagged in source for Naz's review post-build.