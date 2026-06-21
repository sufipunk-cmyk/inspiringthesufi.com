# M1 — Shared visual foundation (palette + typography + header + footer)

## Overview

The shared visual register for the whole site, before any real page content lands. M1 is intentionally *partial*: the alcove arch component (Concept A) is **deferred** because it must be traced from a real photograph of the green mosaic door, and that photograph is not yet in the project.

## Goals

1. Lock in the deeper / aged parchment palette so every later milestone inherits it without revisiting the question.
2. Wire Cormorant Garamond + Amiri (and only those two faces) so the archive reads as one piece, in one voice, on one old paper — by deliberate design, even at body sizes where Cormorant is less obvious as a body face.
3. Ship a basic header and footer that carry the site's voice and a clear sister-door link to sufipunk.co.uk.
4. Hold the alcove arch back rather than substitute the gold door or an AI approximation — that would silently change what the archive frame *is*.

## Scope / non-goals

**In scope**
- Tailwind tokens (`tailwind.config.ts`)
- Base palette + typography + `prose-archive` / `archive-prose` / `divider-flower` component classes (`src/app/globals.css`)
- `next/font/google` wiring for Cormorant Garamond and Amiri (`src/app/layout.tsx`)
- ITS-flavoured site metadata (title template, description, OG, Twitter)
- `SiteHeader` — wordmark + single sister-door link
- `SiteFooter` — three-column quiet footer with sister-door + email + © + voice line
- M1 preview homepage so the foundation is visible end-to-end

**Not in this milestone (deliberate)**
- Alcove arch component — pending green-door photograph
- Mosaic-door header icon — same reason; it's traced from the same photograph
- Archive index / individual post / About / Play with me routes
- Content loader, Formspree wiring, analytics
- Any phantom links pointing at routes that don't exist (would land visitors on 404)

## Palette decisions

One or two notches deeper / more aged than sufipunk.co.uk. Keyed to a green mosaic door, not gold, so the warm metal note is **aged copper**, not leaf-gold.

| Token | HSL | Hex | Role |
|---|---|---|---|
| `parchment` | `36 32% 85%` | `#E5DAC8` | the page itself — aged paper |
| `parchment-deep` | `34 28% 76%` | `#D6C7AE` | foxed paper for section grounds |
| `ink` | `28 32% 12%` | `#2A1E12` | warm sepia ink |
| `ink-soft` | `28 22% 28%` | `#5A4836` | muted sepia for secondary text |
| `green` | `153 27% 21%` | `#294539` | deep mosaic green — heading + accent |
| `green-soft` | `153 18% 38%` | `#4F7263` | moss green for rest-state links |
| `bronze` | `34 56% 38%` | `#976E2C` | aged copper — rare accent (not amber) |
| `bronze-soft` | `34 50% 56%` | `#C39A57` | softer copper for hover states |
| `hairline` | `34 22% 64%` | `#B5A88E` | visible against parchment, never harsh |

The accent token is named **`bronze`**, not `amber`, deliberately — anyone reading both sites' code will see immediately that ITS is intentionally *not* the same accent as sufipunk.

## Typography decisions

- **Display**: Cormorant Garamond (h1–h4, wordmark, big italic quotes)
- **Body**: Cormorant Garamond at regular weight (1.125rem / 1.72 line-height)
- **Tail fallback**: Amiri for Arabic codepoints (e.g. ﷺ U+FDFA)

This is a **deliberate departure** from the sufipunk pattern, where EB Garamond carries body and Cormorant carries display only. ITS uses Cormorant for both because the brief specified Cormorant + Amiri only, and because the slightly more "display-flavoured" body text reinforces the bookish, archival register. Body size is bumped from sufipunk's 1.0625 / 1.65 to 1.125 / 1.72 to compensate for Cormorant's lighter body proportions.

## Header decision

Single line on desktop, stacked on mobile. Wordmark "Inspiring the Sufi" on the left; one warm sister-door link "↶ Sufi Punk" on the right. **No** /archive, /about, /play-with-me links yet — those routes don't exist in M1, and stub-linking would silently 404 visitors.

The mosaic-door icon (left of the wordmark, the way sufipunk's M17 icon sits left of "Sufi Punk") is intentionally absent. It will be traced from the same green-door photograph as the alcove arch and will land in the same follow-up milestone.

## Footer decision

Three quiet columns:

1. **Wordmark column** — "Inspiring the Sufi" + tagline "Forty-nine names. Forty-nine songs."
2. **The Archive column** — italic placeholder "Routes arrive in the next milestones." (rather than ghost links)
3. **Elsewhere column** — sister door to sufipunk.co.uk + `sufipunk@icloud.com`

Centred bottom line: italic voice line *"The Names are mine. The method travels further."* (drawn from the Physicians-of-the-Heart text in spec.md but trimmed to a single sentence) + standard © line.

## Acceptance criteria

- [x] Palette tokens defined as CSS variables in `globals.css` and exposed as Tailwind colours.
- [x] Cormorant Garamond + Amiri loaded via `next/font/google`; no EB Garamond.
- [x] `SiteHeader` renders wordmark + single sister-door link, stacks gracefully on mobile.
- [x] `SiteFooter` renders three columns, with sister-door link and `sufipunk@icloud.com`.
- [x] Homepage placeholder demonstrates the foundation visibly without committing real content.
- [x] No links in the header or footer point at non-existent routes.
- [x] `bun run build` completes cleanly.
- [x] Browser-verified at desktop (1440×900) and mobile (390×844).
- [x] Console quiet — no errors, no missing-resource warnings tied to the foundation.

## Deferred to a follow-up milestone (M1.5)

- **Alcove arch component** — fine-line pointed-arch frame traced from the green mosaic door photograph (Concept A from the brief). Awaiting the photo.
- **Header mosaic-door icon** — same dependency.

## Status / open questions

- **Status**: complete pending green-door photograph for M1.5.
- **Open**: photograph of the green mosaic door — ideally front-on, sharp, tight enough to fill the frame so the arch profile is unambiguous.