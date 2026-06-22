# M5 — Homepage

> **Status: PLAN — implemented in this same milestone.** Replaces the M1/M1.5 visual-foundation preview that has held `/` since bootstrap.

## Overview

`/` becomes the front door of `inspiringthesufi.com`. Three pieces only, in the order Naz asked for: (1) a wordmark hero, (2) an excerpt of the About page pulled live from `ABOUT_PARAGRAPHS.slice(0, 2)` so the homepage and `/about` can never drift, (3) the three Wander entry points presented as one inline sentence with `♦` separators — identical to the Archive's own Wander line, the same component, no button row.

This page deliberately does **not** carry the alcove arch as a hero frame. M3 Q5 confirmed (and M4 reinforced) that the alcove vocabulary is reserved for the archive's narrow index cards. A clean wordmark in Cormorant Garamond on parchment, with the hairline `❁` divider beneath, does the work an alcove would have done — without colonising the archive's frame.

## Goals

1. Replace `src/app/page.tsx` (currently the M1/M1.5 demo) with the real homepage.
2. Excerpt the About page from a single source of truth — `ABOUT_PARAGRAPHS.slice(0, 2)`. No copy-paste, no paraphrase. If Naz edits paragraph 1 in `src/lib/about/text.ts`, the homepage and `/about` change in the same commit.
3. Reuse `ArchiveIndexWanderLine` for the three Wander entry points so the visitor sees identical wording, identical separators, identical link styling on home and on `/archive`. The component grows one new optional behaviour: when no `active` mode is provided, all three modes render as live links (none is highlighted as "you're here now").
4. Quiet, uncluttered. No third hero element beyond the wordmark — no kicker, no hero image, no alcove arch around the title. Naz's first paragraph of the About excerpt is itself the standfirst.

## Non-goals

- No alcove around the title. (Reserved for archive cards.)
- No hero image. (Naz's brief: only if the alcove alone reads well as a frame for the title — and it doesn't, because it's ours-not-yours-yet.)
- No call-out tile for `/play-with-me`. The header now carries the link site-wide; the homepage doesn't need a second mention.
- No new content. Every word on this page already exists in another canonical module.
- No SEO/JSON-LD/sitemap work. That's a later milestone.

## Page structure (top → bottom)

1. `SiteHeader` — unchanged from M4 (*The Archive · About · Play with me · Sufi Punk*).
2. **Wordmark hero**, max-width ≈ 36rem, centred, generous vertical breathing room above:
   - Tiny bronze overline `INSPIRING THE SUFI · ARCHIVE` (uppercase, tracking-[0.32em]) — same vocabulary the Archive header uses, so the visitor lands inside the same atmosphere they'll find one click in.
   - Cormorant Garamond H1 reading `Forty-nine names.` / `Forty-nine songs.` — the master brief's locked banner phrase, broken across two lines exactly as it is on `/archive`.
   - A small italic Cormorant tagline beneath: *"An archive of attention."* — single sentence, single line, picking up Naz's own word *attention* from About paragraph 5 (*"trusting that…attention could become a form of devotion"*). Carries an `// AWAITING NAZ'S APPROVAL` marker so the lint surfaces it.
3. `❁` divider.
4. **About excerpt**, max-width ≈ 38rem, centred, font-serif at 1.1rem with generous leading. Renders `ABOUT_PARAGRAPHS.slice(0, 2)` directly — no map transforms, no edits. Below the second paragraph: a quiet *"Read on →"* link to `/about`, italic Cormorant, ink-soft, bronze-decorated underline on hover.
5. `❁` divider.
6. **Wander entry points** — `<ArchiveIndexWanderLine />` rendered without an `active` prop. On home, all three modes render as live links to `/archive`, `/archive?wander=names`, `/archive?wander=music` respectively, separated by `♦`. Same prose lead-in as on `/archive` (*"Wander through the archive…"*).
7. `SiteFooter` — unchanged from existing.

## Component refactor

`ArchiveIndexWanderLine` currently requires `active: WanderMode`. The refactor makes it `active?: WanderMode`:

- When `active` is provided (e.g. on `/archive` and `/archive?wander=names`), the matching label renders as a non-link bronze span exactly as it does today.
- When `active` is `undefined` (homepage), every label renders as a live link — visitor hasn't entered yet.

This change is purely additive. No callsite is broken; the existing archive callsite still passes `active={wander}` and still sees identical behaviour.

## File changes

```
src/
  app/
    page.tsx                                  # rewritten — old M1 demo removed
  components/
    archive/
      ArchiveIndexWanderLine.tsx              # active prop -> optional
specs/
  m5-homepage/
    document.md                               # this spec
scripts/
  check-home.ts                               # new lint
package.json                                  # +bun run check:home
specs/spec.md                                 # M5 status -> done, milestone trail entry
```

## Lint — `bun run check:home`

`scripts/check-home.ts` asserts:

1. The homepage source file (`src/app/page.tsx`) imports `ABOUT_PARAGRAPHS` from `@/lib/about/text`. (Catches accidental re-introduction of copy-paste.)
2. The homepage source contains the literal substring `ABOUT_PARAGRAPHS.slice(0, 2)` — i.e. the excerpt is exactly the first two paragraphs and not, say, three or four.
3. The homepage imports `ArchiveIndexWanderLine` from the archive components folder (catches accidental re-implementation of the Wander sentence).
4. The homepage source does **not** contain the literal phrase `Lorem` or `placeholder text` (catches a regression to the M1 demo).
5. The page's `AWAITING NAZ'S APPROVAL` marker count is reported (informational — the tagline is an agent draft).
6. None of the eight `ABOUT_PARAGRAPHS` body strings appear hard-coded inside `src/app/page.tsx` — i.e. someone hasn't quietly copied paragraph 1 in and broken the single-source-of-truth rule.

## Acceptance criteria

1. `/` renders the wordmark hero → `❁` → first two About paragraphs verbatim → `❁` → Wander sentence with three live links → SiteFooter.
2. The hero shows `Forty-nine names.` / `Forty-nine songs.` exactly, with the small italic tagline below.
3. The About excerpt is byte-identical to `ABOUT_PARAGRAPHS[0].body` and `ABOUT_PARAGRAPHS[1].body`. Editing those constants moves both the homepage and `/about` together.
4. Below the excerpt, the *"Read on →"* link points at `/about`.
5. The Wander sentence reads exactly the same wording as on `/archive`, with `♦` between the three modes; on the homepage all three are clickable links.
6. Visiting `/archive?wander=names` from the homepage reaches the archive in `names` mode, and the active-state styling kicks in there. (Verifies the optional-prop refactor.)
7. No alcove arch is rendered on `/`.
8. No horizontal overflow at 390 × 844.
9. `bun run check:home` reports clean. `bun run build` clean. The previous three lints (`check:archive`, `check:about`, `check:play-with-me`) still pass.

## Test plan

**Desktop 1440×900:**
1. Navigate to `/`. Screenshot top (overline, wordmark, tagline, divider, paragraph 1 starting).
2. Scroll to mid (rest of paragraph 1, paragraph 2, *"Read on →"* link).
3. Scroll to Wander sentence — confirm all three modes are live links (none is bronze span). Screenshot.
4. Click *by the names of Allah* → confirm landing at `/archive?wander=names` with that mode active.

**Mobile 390×844:**
1. `/` direct URL — screenshot top.
2. Confirm `document.documentElement.scrollWidth === clientWidth`.
3. Scroll to Wander sentence — confirm it wraps cleanly, `♦` separators visible, all three are tappable.

## Edge cases / failure modes

| Case | Behaviour |
|---|---|
| Naz adds a 9th paragraph to `ABOUT_PARAGRAPHS` later | Homepage excerpt unchanged (`slice(0, 2)` is static). About lint catches the count change. |
| Naz edits paragraph 1's wording | Both `/` and `/about` update in the same commit (single source of truth). |
| The archive page later adds a 4th Wander mode | `WANDER_MODES` array drives both pages. Both update together. |
| Visitor JS-disabled | The wordmark and excerpt are plain HTML; the Wander links are `<Link>` (anchors). All three sections work. |

## Implementation notes

- The homepage is a pure server component. No client state needed.
- Vertical rhythm matches `/about`: `py-16 sm:py-20`, divider margins of `mt-10` / `mt-12`.
- The "Read on →" link uses an actual right-arrow glyph (`→` U+2192), italic Cormorant, ink-soft default colour, bronze on hover.
- The `WANDER_MODES` array order is locked: *order → names → music*. That order is the brief's prescription and is preserved on both pages by the shared component.

## Status / open questions

- **Status:** PLAN, this same milestone implements it.
- **Open question (Q1):** the small italic tagline *"An archive of attention."* — agent draft, single `AWAITING NAZ'S APPROVAL` marker on the page, surfaced by `bun run check:home`. Approve, replace, or remove altogether (wordmark-only hero is also a clean option).
- **Open question (Q2):** overline wording. Drafted as `INSPIRING THE SUFI · ARCHIVE`. Carries the same approval marker. Approve, shorten to just `INSPIRING THE SUFI`, or remove.