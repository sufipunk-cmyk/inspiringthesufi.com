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
| Homepage / front door | planned | _tbd_ |
| Archive index (49 posts, Concept A layout) | planned | _tbd_ |
| Individual post page | planned | _tbd_ |
| Seven broken-link replacements | planned | _tbd_ |
| Reader comments import (per post, read-only) | planned | _tbd_ |
| "Play with me" page + native form | planned | _tbd_ |
| Footer threshold (cropped golden-doors detail → Sanctuary) | planned | _tbd_ |
| Cross-link arch to sufipunk.co.uk | planned | _tbd_ |
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
- **M1.5 — Alcove arch component + mosaic-door header icon.** Photograph received and committed to `source-docs/green-mosaic-door.webp`. Both the `Alcove` frame and the `MosaicDoorIcon` traced from it: cubic-Bezier lancet profile, vertical sides for the lower half, sweep up to a softly-pointed apex (≈ 113°). Architectural decomposition (fixed-aspect crown SVG + CSS-bordered body) chosen after the naïve full-arch SVG with `preserveAspectRatio="none"` was found to flatten the lancet into a dome at wide aspect ratios. Stroke uses `vector-effect="non-scaling-stroke"` so the line stays 1.5 px and matches the body's `border-[1.5px]` borders pixel-for-pixel. M1 preview homepage updated with a 2-up alcove demonstration in deliberately generic placeholder text (no pretend archive entries). Browser-verified desktop (1440×900) and mobile (390×844) — alcove reads as a clearly-pointed lancet at both widths, icon reads as a clear door silhouette at text-height. See [specs/m1-5-alcove-arch/document.md](m1-5-alcove-arch/document.md).