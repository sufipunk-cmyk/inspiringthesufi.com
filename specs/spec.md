# inspiringthesufi.com — Master Spec

A companion site to **sufipunk.co.uk**. Built the same way: Next.js 15 App Router, TypeScript, Tailwind, deployed via manual tarball → GitHub → Vercel.

## Project overview

`inspiringthesufi.com` is the home of **The Inspiring the Sufi Archive** — a 49-post body of work pairing each of the 99 Names of Allah with a piece of secular music (and its place of origin), surfacing the sacred quietly inside the work people already love. The archive originally lived on Squarespace; this rebuild moves it into the same atmosphere as `sufipunk.co.uk`: arches, parchment, mosaic, hand-tooled typography, the Golden Door visual lineage.

The two sites are **siblings, not parent/child**. Each has its own domain, its own tone, its own door. They cross-link, but neither contains the other.

## Goals

1. Preserve all 49 posts (text, original publish dates, images, reader comments) faithfully — this is an archive of a finished body of work, not a live blog.
2. Replace the seven posts where the embedded YouTube link is now broken/region-locked, using the confirmed replacements.
3. Match the visual and atmospheric register of `sufipunk.co.uk` exactly enough that visitors feel they've stepped through a connecting arch, not landed on an unrelated site.
4. Keep the visitor in-atmosphere on the "Play with me" page — never bounce them to a Google Form or third-party UI.
5. Be cheap, static-where-possible, and resilient (no live CMS, no DB read on render).

## Source documents (in `/source-docs`, kept in-repo so they survive any session crash)

- `ITS_Master_Brief.md` — source of truth. **Read the OUTSTANDING section at the top first** when resuming work.
- `ITS_Replacement_Links.md` — confirmed YouTube replacements (Posts 1, 3, 16-Bat-for-Lashes, 19, 34, 36, 41, 49 confirmed; Posts 9, 14, 32 secondaries; Posts 21, 38 may need narrative rewrites).
- `Squarespace-Wordpress-Export-06-16-2026.xml` — full WXR export with all 49 posts, content, and reader comments.

## Three confirmed decisions not yet reflected in the brief

These override the brief where they conflict:

### 1. The "Play with me" form is native, not a Google Form
Built directly into the site's own styling: same arch frame, parchment, fonts. Visitor never leaves the page. Backed by **Formspree** (or an equivalent lightweight form-backend) to email submissions to the site owner. Atmosphere matters here — this is reflective practice, especially for ND visitors. Add an **email field** to the form, but **only show/require it when "would you like a response?" is toggled yes**.

### 2. Physicians of the Heart credit lives only on /play-with-me
Not a standalone dedication page. Woven into the explanation. **Use this exact text:**

> There are as many ways to turn toward the Divine as there are people seeking. What's yours?
>
> This isn't an invitation to find your own way into the 99 Names of Allah. The Names are mine — the fixed point I happened to be given, the tradition I stand inside. For my own practice, I lean on Physicians of the Heart by Wali Ali Meyer, Bilal Hyde, Faisal Muqaddam, and Shabda Kahn for how I come to understand what each Name actually means.
>
> But the method underneath it travels further than the Names ever could. Take something you already love completely, without justifying it — a special interest, a fascination, an obsession, gaming, Gundam, gardening, anything — and let it sit next to whatever you hold sacred or significant in your own life. A faith tradition, maybe. Maybe not. Notice where they touch, if they do. The noticing is the practice. You don't need to have found the connection yet.
>
> You can see it already happening if you read through the archive's comments — people writing in from their own blogs, their own songs, their own reference points entirely, and finding they'd landed somewhere near mine. I never asked for that. It just kept happening, one comment at a time. This page is just a clearer door for it.

Link the words **"Physicians of the Heart"** to <https://physiciansoftheheart.com>.

### 3. The archive has 49 posts, not 50
The brief says 50; the real export has 49 (45/46 is a single combined entry). Always trust the export count. The archive header reads **"Forty-nine names. Forty-nine songs."** — never "Fifty" — and contains **no time-duration claim**.

## Seven broken-link posts — corrected titles (use these exact strings when matching)

The previous matching logic compared against the song name, not the post title, and missed all seven. The real WXR titles are:

| # | Title (exactly as in XML) |
|---|---|
| 16 | Chaadni Ratey - Al Afuw (The Pardoner) Noor Jahan (Pakistan) |
| 19 | Prince - Al Majid (The Most Glorious) |
| 32 | Ben Deniz - Al Hafiz (The Preserver), Turkey |
| 34 | Cheikha Remitti, Ya Darr (The Aflicter), Algeria |
| 36 | Miracle, Above and Beyond Ocean Lab - Al Alim (The All Knowing), UK |
| 41 | PM Dawn Patient Eyes - Al Sabur, (The Patient One) |
| 49 | Nazia & Zoheb Hussain, Al Basit (The Expander), Pakistan |

Notes:
- Post 34 title has the typo **"Aflicter"** — keep it as-is.
- Posts 41 and 49 have **no period after the post number** (unlike the others).

## Technical stack

- **Framework**: Next.js 15 (App Router) + React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (mirroring sufipunk.co.uk's component patterns)
- **Content**: Markdown files in `/content/archive/` parsed at build time with `gray-matter` + `marked` (same loader pattern as sufipunk's `/content/sanctuary/`)
- **Form backend**: Formspree (or equivalent) — one POST endpoint, email field conditionally rendered
- **Deploy**: Manual tarball → GitHub → Vercel (no auto-push from sandbox; that path failed repeatedly on sufipunk)
- **Database**: scaffolded by template but **unused** at runtime, exactly mirroring the sufipunk pattern

### M0 / Vercel-clean config (locked in from sufipunk M12)

These are the patterns that cost sufipunk a milestone to discover; do not regress:

- **No `output: 'standalone'`** in `next.config.js`. Standalone produces a self-contained Node server bundle, not the static-friendly output Vercel expects.
- **No `distDir` override**. Default `.next` only.
- **No `vercel.json`** — Vercel's defaults are correct for this stack.
- **No `BUILD_DIR` env var** in `package.json` build scripts. `"build": "prisma generate; next build"` only.
- **`output: 'export'` is also not set** — keep dynamic routes available even if every page is currently static; the form route will need server execution.

## Architecture rules

1. **Atmosphere is the product.** Every cross-link, hover state, and transition should feel hand-tooled, not boilerplate. Generic shadcn defaults must be themed before they ship.
2. **Posts are immutable archive entries**, not blog posts. Sort order is original publish date, descending.
3. **Visible dates** — defer the same call sufipunk made in M18: do not show calendar dates inline if the reading direction and date direction visually contradict. Show the post's archive number (1–49) and the Name as the sequence-tellers.
4. **Cross-links to sufipunk.co.uk** are explicit and warm, not navigation chrome — door imagery, not breadcrumbs.
5. **No third-party iframes in primary flows.** No Google Forms, no Disqus, no embedded analytics widgets in the body.
6. **Source documents stay in `/source-docs`** in-repo, not in `.gitignore`. They are project memory.

## Feature list

| Feature | Status | Spec |
|---|---|---|
| Project bootstrap (M0) | done | [specs/m0-bootstrap/document.md](m0-bootstrap/document.md) |
| Visual foundation — palette, typography, header, footer (M1) | done | [specs/m1-visual-foundation/document.md](m1-visual-foundation/document.md) |
| Alcove arch component + mosaic-door header icon (M1.5) | done | [specs/m1-5-alcove-arch/document.md](m1-5-alcove-arch/document.md) |
| The Archive — 49 posts, index + single-post pages, replacements, comments, redirects, footer threshold (M2) | done | [specs/m2-archive/document.md](m2-archive/document.md) |
| About page (M3) | done | [specs/m3-about/document.md](m3-about/document.md) |
| "Play with me" page + native Formspree form (M4) | planned | _tbd_ |
| Replacement homepage / front door (M5+) | planned | _tbd_ |
| Sitemap, robots, RSS, JSON-LD | planned | _tbd_ |
| Vercel deploy + custom domain | planned | _tbd_ |

## Build / handoff workflow (locked)

1. Work in-sandbox; never auto-push to GitHub from inside it. Token-based auth from the sandbox repeatedly failed on sufipunk; do not retry it.
2. After each milestone: `bun run build` clean → `save_checkpoint` → tarball → handoff.
3. The user pushes the tarball to <https://github.com/sufipunk-cmyk/inspiringthesufi.com> from their own machine.
4. Wait for live-on-GitHub confirmation before starting the next milestone.

## Open questions / OUTSTANDING (snapshot — see ITS_Master_Brief.md for canonical list)

- Posts 21 and 38 may need short narrative rewrites once their replacement YouTube links are confirmed.
- Concept A archive layout vs alternates — confirmed Concept A in brief.
- Footer-threshold image: cropped detail of the golden-doors map (no full Final_map.png on this site).
- Domain DNS, Formspree project creation, and Vercel project creation are all on the user's side.

## Milestone trail

- **M0 — Project bootstrap.** Next.js 15 + Tailwind + shadcn scaffolded. M12 Vercel-clean config applied (no standalone, no distDir, no vercel.json, no BUILD_DIR). Source documents committed to `/source-docs`. Specs folder seeded. First clean `bun run build`. Tarball delivered. Confirmed live on GitHub at commit `c56711c` and auto-deployed by Vercel.
- **M1 — Shared visual foundation.** Deeper / aged parchment palette (`parchment` `#E5DAC8`, `green` `#294539`, `bronze` `#976E2C` — bronze, not amber, deliberately, since this site is keyed to a green mosaic door, not gold). Cormorant Garamond + Amiri only (no EB Garamond). `SiteHeader` and `SiteFooter` in the site's voice with a sister-door link to sufipunk.co.uk in both. M1 preview homepage so the foundation is visible end-to-end. **Alcove arch component (Concept A) deliberately deferred to M1.5 — awaiting a real photograph of the green mosaic door**, since substituting the sufipunk gold-door silhouette or generating one with AI would silently change what the archive frame *is*. Browser-verified desktop (1440×900) and mobile (390×844). See [specs/m1-visual-foundation/document.md](m1-visual-foundation/document.md).
- **M3 — About page (live).** `/about` ships Naz's confirmed eight-paragraph June-2026 text **verbatim**, the single source of truth for that text site-wide (M5+ home page will excerpt from `ABOUT_PARAGRAPHS.slice(0, 2)`, no copy-paste). Layout is a clean parchment single-column read in Cormorant Garamond — no alcove frame around the body, since the alcove is the archive's vocabulary and the About voice holds the reader on its own. A bronze-hairline pull-quote between paragraphs 5 and 6 lifts one of Naz's own lines verbatim ("trusting that longing itself could be a form of guidance and that attention could become a form of devotion.") as a moment of breath. Page closes with a quiet italic "Come sit with me." line — rendered as plain italic until M4's `/play-with-me` route lands, at which point it becomes a single-line link change. Page heading, italic kicker, and "Come sit with me" toggle are all flagged with `AWAITING NAZ'S APPROVAL` markers in source and surfaced by `bun run check:about`. `SiteHeader` primary nav now reads *The Archive · About · Sufi Punk*. Browser-verified desktop (1440×900) and mobile (390×844) — no horizontal overflow at 390 px. See [specs/m3-about/document.md](m3-about/document.md).
- **M2 — The Archive (live).** All 49 entries migrated from the WXR export into `content/archive/*.md` with hand-curated `POST_METADATA` as the single source of truth for slugs / Names / songs / artists / countries. Six Naz decisions (22 June 2026) honoured throughout: Q1 slugs use Naz's original wording (`34-ya-darr`, `48-ya-jami`, `50-ya-muhaimin`); Q2 missing country tags stay blank; Q3 standfirst shipped as a draft with an inline "(awaiting Naz's approval)" tag; Q4 YouTube URLs in reader comments render as embedded players; Q5 `sonAgeNote` populated only where Naz explicitly wrote an age (0 posts in current data); Q6 only the real Squarespace `/inspiring-the-sufi-blog/...` paths redirect, no transitional preview-URL redirects. YouTube replacement table is keyed on the broken 11-char video ID (not post ID) so multi-embed memorial sets get surgical swaps; `HEADLINE_OVERRIDES` locks Post 16's headline to Noor Jahan with Bat for Lashes appearing as the secondary related-media embed. Three Wander modes (`order` / `?wander=names` / `?wander=music`) woven into a single inline sentence with ♦ separators, not a filter UI. Footer threshold uses the golden-doors mosaic copied from sufipunk.co.uk behind a parchment scrim — only on `/archive`. Build: 54 routes, 49 SSG archive pages prerendered. Browser-verified desktop (1440×900) and mobile (390×844); horizontal overflow on the wander line at 390 px caught and patched before commit. `bun run check:archive` reports 49/76/11 (posts/comments/replacements) and surfaces the standfirst-pending state plus the two `narrativeReviewNeeded` posts (21 + 38) that Naz reviews, not the agent. See [specs/m2-archive/document.md](m2-archive/document.md).
- **M1.5 — Alcove arch component + mosaic-door header icon.** Photograph received and committed to `source-docs/green-mosaic-door.webp`. Both the `Alcove` frame and the `MosaicDoorIcon` traced from it: cubic-Bezier lancet profile, vertical sides for the lower half, sweep up to a softly-pointed apex (≈ 113°). Architectural decomposition (fixed-aspect crown SVG + CSS-bordered body) chosen after the naïve full-arch SVG with `preserveAspectRatio="none"` was found to flatten the lancet into a dome at wide aspect ratios. Stroke uses `vector-effect="non-scaling-stroke"` so the line stays 1.5 px and matches the body's `border-[1.5px]` borders pixel-for-pixel. M1 preview homepage updated with a 2-up alcove demonstration in deliberately generic placeholder text (no pretend archive entries). Browser-verified desktop (1440×900) and mobile (390×844) — alcove reads as a clearly-pointed lancet at both widths, icon reads as a clear door silhouette at text-height. See [specs/m1-5-alcove-arch/document.md](m1-5-alcove-arch/document.md).
- **M2 — The Archive (plan only, awaiting confirmation).** Plan-only milestone drafted while M1.5 was queued for live-on-GitHub confirmation. Built from a full re-read of `ITS_Master_Brief.md`, `ITS_Replacement_Links.md`, and a parse of the WXR export confirming **49 published posts, 70 reader comments, zero Arabic codepoints in body text**. Spec covers: TypeScript `ArchivePost` / `ArchiveComment` data model, frontmatter YAML schema, the full 49-post slug list with English Names + meanings + songs + artists + countries + YouTube IDs, the `oldPostId`-keyed YouTube replacement table (eliminating the previous string-match bug that missed all seven flagged posts), a separate handling note for Posts 16 (two-artist) and 38 (multi-Sawhney), narrative-review flag for Posts 21 and 38, file/folder layout (`content/archive/`, `public/archive/{nn}/`, `src/lib/archive/`, `src/components/archive/`, `src/app/archive/`), three-mode "Wander" sort (in order written / by Names / by music) presented as one inline sentence with ♦ diamond separators rather than a button row, old-Squarespace-path → new-slug redirect map, footer-threshold component (cropped detail of the golden-doors map only — no full `Final_map`), one-shot `migrate-from-wxr.ts` migration pipeline, full acceptance criteria, test plan, and six open questions for Naz (slug normalisation for Posts 34/41/48/50; country-tag policy; standfirst draft; comment URL handling; son's-age detail; transitional redirects). **No code written, no commits.** See [specs/m2-archive/document.md](m2-archive/document.md).