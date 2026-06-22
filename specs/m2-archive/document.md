# M2 — The Archive

> **Status: BUILT — AWAITING NAZ'S REVIEW.** All 49 archive entries are migrated, paged, and live behind the M1.5 alcove frame. Three Wander modes work, 49 old Squarespace URLs redirect, the footer threshold is in place, both desktop (1440×900) and mobile (390×844) browser-tested clean. Two items deliberately left for Naz: (a) the standfirst paragraph wording (Q3 — currently shipped as a draft with an "(awaiting approval)" tag underneath, flagged by `bun run check:archive`); (b) Posts 21 and 38 narrative wording (per master brief, Naz reviews — not auto-rewritten). Built from `source-docs/ITS_Master_Brief.md`, `source-docs/ITS_Replacement_Links.md`, and a parse of the WXR export.

## Decisions (Naz, 22 June 2026)

These override anything in the body of the spec where they conflict:

1. **Slugs use Naz's original wording, not canonical Arabic transliteration.** Posts 34/48/50 keep `Ya Darr` / `Ya Jami` / `Ya Muhaimin` in both slug and display: `34-ya-darr`, `48-ya-jami`, `50-ya-muhaimin`. Post 41 stays `41-al-sabur` (Naz's form was already proposed). No silent canonicalisation anywhere — link, page, or anchor.
2. **Country tags missing in the original Squarespace title stay blank.** No inference from artist nationality. The alcove and post page just don't show a country line where the source didn't supply one.
3. **The Archive standfirst paragraph is drafted for Naz's approval before merge.** The implementation ships a draft inline, but it is explicitly flagged "AWAITING NAZ'S APPROVAL" in code comments + the build-time `check:archive` lint.
4. **Reader comments containing YouTube URLs render as embedded video players** (the same `<YouTubeEmbed>` component as the body), not plain hyperlinks. Comments stay otherwise plain prose.
5. **`sonAgeNote` is populated only where the original post body explicitly states an age.** No inference from post numbers, slug numbers, or the canonical 99-Names ordering.
6. **No transitional/preview-URL redirects.** The redirect map covers only the real old Squarespace paths in the WXR.

## Overview

The Archive is the heart of `inspiringthesufi.com` — 49 entries, each pairing one of the 99 Names of Allah with a piece of secular music and a short reflection, originally published on Squarespace between December 2015 and August 2017. M2 migrates all 49 entries faithfully into the new site, replaces the seven posts whose embedded YouTube videos are confirmed broken, preserves all reader comments, and presents the whole archive inside the M1.5 alcove frame in the Concept A layout.

## Goals

1. All 49 entries live, readable, in the same voice they were written in — no paraphrasing, no summarising, no AI-rewriting of body text.
2. Seven broken YouTube videos replaced with the confirmed links from `ITS_Replacement_Links.md`. No new replacement links sourced inside this milestone.
3. Reader comments preserved as static content (not a live commenting system), threaded by `wp:comment_parent` where the original threading existed.
4. Three "Wander" entry points (in the order written, by the Names of Allah, by the music) — implemented as **sort orderings** woven into the page voice, not a filter UI.
5. Footer threshold (cropped golden-doors map detail + "Return to the Sanctuary" link) at the very bottom of `/archive` — the full map asset does **not** appear anywhere on this site.
6. Old Squarespace URLs redirect to their new locations so any external links still resolve.

## Non-goals (explicitly NOT in M2)

- About page (M3).
- Play with me page + Formspree wiring (M4).
- Homepage replacement (the M1.5 preview homepage stays in place until M5+).
- A new-comments system. Comments are read-only static.
- Squarespace cancellation, DNS cutover, Vercel domain pointing — these are user-side ops, not engineering.
- Any AI-rewriting of post bodies. Migration is faithful.
- Posts 21 and 38 narrative review (the brief calls this a *content task*, not a technical task — flag, don't auto-rewrite).

---

## 1. Inventory — what's actually in the WXR export

Confirmed by parse of the XML on 22 June 2026:

- **49 published `post_type="post"` records** (titles span 1–50 visibly; entry **45/46** is one combined record, which is why count is 49 not 50).
- **49 `post_type="attachment"` records** (one image asset per post on average, hosted at `images.squarespace-cdn.com/...`).
- **70 reader comments** total, distributed across 30 of the 49 posts (max 7 on Post 30, 5 each on Posts 17, 19, 28, 31, 33, 35).
- Comment threading is real — `wp:comment_parent` is non-zero for replies. Naz's own replies are authored as `Sufi Punk`.
- Publication dates span 2015-12-08 to 2017-08-01.
- **Body text contains zero Arabic codepoints.** Every Name appears only in Latin transliteration ("Al Karim", "Ar Rahman"). The Amiri tail-fallback shipped in M1 stays as defensive insurance, but no current archive content actually requires it.

---

## 2. Data model

### 2.1 `ArchivePost` — TypeScript shape (proposed)

```ts
type ArchivePost = {
  // Identity
  slug: string;                  // URL slug, e.g. "01-al-karim"
  postNumber: string;            // display number, e.g. "1", "45/46", "50"
  postNumberSort: number;        // numeric sort key, e.g. 1, 45, 50

  // The Name(s)
  name: {
    english: string;             // verbatim from Naz's title, e.g. "Al Karim"
    meaning: string;             // verbatim, e.g. "The Generous"
    arabic: string | null;       // optional — empty for all current posts
  };
  // For combined entries (45/46), a second name may be present:
  secondName?: { english: string; meaning: string; arabic: string | null };

  // The music
  song: {
    title: string;               // e.g. "Man in the Mirror"
    artist: string;              // e.g. "Michael Jackson"
    country: string | null;      // e.g. "USA", or null when not given
    youtube: string | null;      // 11-char YouTube video ID, or null
  };
  // Some posts reference additional related media in the body
  // (e.g. Post 16 has both Noor Jahan and Bat for Lashes; Post 38
  // references multiple Nitin Sawhney videos). These are attached as
  // optional secondary references — shown in the body, not as the
  // headline pairing.
  relatedMedia?: Array<{
    label: string;
    youtube: string | null;
    note?: string;
  }>;

  // Provenance
  publishedAt: string;           // "YYYY-MM-DD" from wp:post_date
  oldPath: string;               // original Squarespace path (with leading /)
  oldPostId: string;             // wp:post_id (kept for forensic traceability)

  // Migration metadata
  narrativeReviewNeeded: boolean;// true for Posts 21 and 38 only
  hasReplacedYouTube: boolean;   // true for the seven posts in §4

  // Optional details
  sonAgeNote: string | null;     // brief asks for "the son's age at each
                                 // post as a quiet detail where mentioned
                                 // in original posts" — populated from body
                                 // text if the body explicitly mentions it,
                                 // otherwise null. Default null.

  // Reader comments — threaded; ordered by date ascending
  comments: ArchiveComment[];
};

type ArchiveComment = {
  id: string;                    // wp:comment_id (kept for stable React keys)
  parentId: string | null;       // wp:comment_parent, null when "0"
  author: string;                // "Sufi Punk" for Naz's own replies
  date: string;                  // ISO date string
  bodyMarkdown: string;          // converted from comment HTML
};
```

The post **body** itself is not a frontmatter field — it's the markdown body of the `.md` file (loaded separately by the loader, see §6).

### 2.2 Frontmatter schema (the YAML at the top of each `.md`)

```yaml
---
slug: "01-al-karim"
postNumber: "1"
postNumberSort: 1

name:
  english: "Al Karim"
  meaning: "The Generous"
  arabic: null

song:
  title: "Man in the Mirror"
  artist: "Michael Jackson"
  country: "USA"
  youtube: "PivWY9wn5ps"

publishedAt: "2015-12-08"
oldPath: "/2015/11/11/1-man-in-the-mirror-michael-jackson-al-karim-the-generous"
oldPostId: "1"

narrativeReviewNeeded: false
hasReplacedYouTube: true        # Post 1 is one of the nine confirmed replacements

sonAgeNote: null

comments: []
---

The post body in **markdown**, migrated faithfully from the WXR
`<content:encoded>` field via HTML→markdown conversion. The Squarespace
`<h1>` that repeats the title is stripped (the page header renders the
title from frontmatter). Squarespace CDN image URLs are rewritten to
local `/archive/01/...` paths. YouTube `<iframe>` embeds are converted
to a controlled component shortcode at the appropriate position.
```

### 2.3 Frontmatter rationale (small but pointed decisions)

| Decision | Reasoning |
|---|---|
| Comments embedded in YAML, not a sibling JSON file | Max 7 comments per post, all short. Self-contained `.md` files keep authoring/diff-review simple. |
| `postNumber` is a string, not a number | "45/46" is not a number. String preserves the combined-entry display label exactly. |
| `postNumberSort` is a separate field | Lets sorting and routing use a real integer (45 for the combined entry). Cheaper than parsing on every render. |
| `name.arabic` exists but is null | None of the current 49 posts contain Arabic in body. Keeping the field reserved means a later enrichment pass (e.g. adding the Arabic Name to each card) doesn't require a schema migration. |
| `oldPath` stored on the post | Drives the redirect map (§7) without a separate lookup table. Single source of truth. |
| `narrativeReviewNeeded` is data, not a runtime check | Lets a build-time CLI (`bun run check:archive`) list the flagged posts deterministically. |
| `hasReplacedYouTube` is recorded | Forensic traceability of which posts had link surgery — useful if future audits raise questions. |

---

## 3. The 49-post slug list

Slug pattern: **`{nn}-{name-slug}`** where `nn` is the zero-padded post number (`01` … `50`, plus the special `45-46`) and `name-slug` is the English Name lowercased and hyphenated, with apostrophes dropped.

The English Name in each row is exactly as Naz wrote it in the post title — including her transliteration choices (`Al Gafur` rather than canonical `Al Ghafur`, `Al Sabur` rather than canonical `As Sabur`, `Ya Darr` / `Ya Jami` / `Ya Muhaimin` rather than `Ad Darr` / `Al Jami` / `Al Muhaimin`, the `Aflicter` typo on Post 34, etc.). **Per Naz's Q1 decision, slugs preserve her exact wording — no canonicalisation, anywhere, ever.**

| # | Slug | English Name | Meaning | Song | Artist | Country | YouTube |
|---|---|---|---|---|---|---|---|
| 1 | `01-al-karim` | Al Karim | The Generous | Man in the Mirror | Michael Jackson | USA | **PivWY9wn5ps** ✱ |
| 2 | `02-al-mutakabbir` | Al Mutakabbir | The Majestic | I adore the Sea | Nagat Al Saghira | Egypt | PHk4ct21vQ0 |
| 3 | `03-al-batin` | Al Batin | The Hidden | Hidden Place | Björk | — | **54LQ_AO1gDI** ✱ |
| 4 | `04-al-mumit` | Al Mumit | The Causer of Death | Let Go | Clinton Cerejo feat. Master Saleem (Coke Studio India) | India | itdTtu9heSU |
| 5 | `05-al-gafur` | Al Gafur | The Forgiving | Hello | Adele | UK | YQHsXMglC9A |
| 6 | `06-al-rashid` | Al Rashid | The Guide | Amay Bhashaili | Alamgir & Fariha Pervez (Coke Studio) | Pakistan | FnDmg-cBVsA |
| 7 | `07-al-wadud` | Al Wadud | The Loving One | Remember the Loveliness | Mercan Dede | Turkey | dKBEpRmZ6SY |
| 8 | `08-al-muqit` | Al Muqit | The Sustainer | When Am I Going to Make a Living? | Sade | UK | O-KqMHxpirI |
| 9 | `09-al-badi` | Al Badi | The Originator | Yny Maj Hyrynh | Marlui Miranda | Brazil | **ROzYz3HAfz0** ✱ |
| 10 | `10-al-nur` | Al Nur | The Light | Khallini Biljao | Maya Nasri | Lebanon | UcN7SGGoCNI |
| 11 | `11-al-khafid` | Al Khafid | The Abaser | Nezlen Ala El Boustan | Kulna Sawa | Syria | Alzfs1hNYFo |
| 12 | `12-ar-raqib` | Ar Raqib | The Watchful | Guardian | Alanis Morissette | Canada | gCBIG28On0o |
| 13 | `13-al-muhyi` | Al Muhyi | The Giver of Life | Zariya | A.R. Rahman, Ani Choying, Farah Siraj (Coke Studio India) | India | wlaZSx6tqRo |
| 14 | `14-ar-rahman` | Ar Rahman | The Most Compassionate | Faraway | Demis Roussos | Egypt/Greece | **iKWL8viMjBM** ✱ |
| 15 | `15-al-quddus` | Al Quddus | The Most Holy | Didi | Cheb Khaled | Algeria | g93odzEUXg8 |
| 16 | `16-al-afuw` | Al Afuw | The Pardoner | Chaadni Ratey † | Noor Jahan | Pakistan | PRBu6uZa5Hk |
| 17 | `17-as-salam` | As Salam | The All Peaceful | Peace | Ajeet Kaur | — | nLYRGOKsdoQ |
| 18 | `18-al-mudhill` | Al Mudhill | The Humiliator | I Am Eve | Mahsa Vahdat | Iran | gawnR7EjOPM |
| 19 | `19-al-majid` | Al Majid | The Most Glorious | Gold (memorial set) | Prince | USA | **7IQE62Vn4_U** ✱ |
| 20 | `20-al-mani` | Al Mani | The Preventer of Harm | (untitled lead) | Mariem Hassan | Western Sahara | cpnpyGAS374 |
| 21 | `21-al-khaliq` | Al Khaliq | The Creator | (Niyaz / Azam Ali) | Niyaz | Canada/Iran | 7BwWAHqxcTw ✦ |
| 22 | `22-al-haqq` | Al Haqq | The Truth | (Abrar-ul-Haq) | Abrar-ul-Haq | Pakistan | QLf2ewlaLMA |
| 23 | `23-al-awwal` | Al-Awwal | The First | Poem of the Cloak (Burdah) | Khalid Belrhouzi | France | E4DhtfPWinE |
| 24 | `24-al-kabir` | Al Kabir | The Most Great | Kabir Poetry | (various readings) | India | 24eczLuq1n0 |
| 25 | `25-al-hayy` | Al Hayy | The Forever Living | Lay Next to You | Sam Smith | UK | HaMq2nn5ac0 |
| 26 | `26-al-akhir` | Al Akhir | The Last | Eid Mubarak | Harris J | UK | -5ff0lgzUOs |
| 27 | `27-al-wahid` | Al-Wahid | The One | ENGLISTAN | Riz MC | UK | F4Fz6SBjGGs |
| 28 | `28-al-musawwir` | Al Musawwir | The Bestower of Form, The Shaper | (Arooj Aftab) | Arooj Aftab | USA/Pakistan | 53izq9PGo-o |
| 29 | `29-al-mutaali` | Al Muta'ali | The Most Exalted | The Mirror of My Soul | Rim Banna | Palestine | N9cW_IiDJ9s |
| 30 | `30-al-bari` | Al Bari | The Maker | (lead Desert Dwellers track) | Desert Dwellers | USA | _vM79tMNFsw |
| 31 | `31-al-tawwab` | Al Tawwab | The Granter and Accepter of Repentance | (Lover's rock pairing) | Louisa Marks & Carroll Thompson | UK | 29b8lieI8mM |
| 32 | `32-al-hafiz` | Al Hafiz | The Preserver | Ya Sen Ya Hiç | Bendeniz | Turkey | **5gDZ5hWCZ7Y** ✱ |
| 33 | `33-al-baqi` | Al Baqi | The Everlasting | Saa Magni (Death Is Terrible) | Oumou Sangaré | Mali | kHMFie-BOPs |
| 34 | `34-ya-darr` | Ya Darr | The Aflicter | Sidi Mansour | Cheikha Rimitti (ft. Robert Fripp & Flea) | Algeria | **TLAnJaCawTA** ✱ |
| 35 | `35-al-muid` | Al Muid | The Restorer of Life | Sheep | Gonjasufi | USA | m5tBag0DAMs |
| 36 | `36-al-alim` | Al Alim | The All Knowing | Miracle | Above & Beyond / OceanLab | UK | **JsL9q3Pr4kw** ✱ |
| 37 | `37-malikal-mulk` | Malikal Mulk | Owner of Kingdom | Royals | Lorde | New Zealand | nlcIKh6sBtc |
| 38 | `38-al-muqsit` | Al Muqsit | The Equitable | Nadia | Nitin Sawhney & Nicki Wells | UK | **4jJJHfL1yQA** ✱ ✦ |
| 39 | `39-al-qabid` | Al Qabid | The Withholder | (lead Verve track) | The Verve | UK | 1lyu1KKwC74 |
| 40 | `40-al-muntaqim` | Al Muntaqim | The Avenger | (Lauryn Hill) | Lauryn Hill | USA | Mq00-nAhEtE |
| 41 | `41-al-sabur` | Al Sabur | The Patient One | Looking Through Patient Eyes | PM Dawn | USA | **k_0LHKxTy9g** ✱ |
| 42 | `42-al-aliyy` | Al Aliyy | The Most High | I Only Have Eyes for You | The Flamingos | USA | -Tqa1CnhUU8 |
| 43 | `43-al-qahhar` | Al Qahhar | The Subduer | Eye of the Tiger | Survivor | USA | QEjgPh4SEmU |
| 44 | `44-al-halim` | Al Halim | The Forbearing | Nimma Nimma | Shani Arshad | Pakistan | 9AQIcILiGlA |
| 45/46 | `45-46-al-mumin-al-qayyum` | Al Mumin & Al Qayyum | The Granter of Security & The Self-Existing | (Tina Turner meditation set) | Tina Turner | USA | 6XP-f7wPM0A |
| 47 | `47-al-muqtadir` | Al Muqtadir | The Powerful | Poems of Rumi | Madonna & Deepak Chopra | USA/India | eY0fxvV8cwI |
| 48 | `48-ya-jami` | Ya Jami | The Gatherer | Bag Lady | Erykah Badu | USA | OqN0jsSeqPo |
| 49 | `49-al-basit` | Al Basit | The Expander | Disco Deewane | Nazia & Zoheb Hassan | Pakistan | **K797A36tjdo** ✱ |
| 50 | `50-ya-muhaimin` | Ya Muhaimin | The Guardian | Moornie | Punjabi MC | UK/India | 3fRNtqD2UBU |

**Legend**

- **Bold YouTube ID** = a confirmed replacement from `ITS_Replacement_Links.md` (nine in total — see §4).
- **✱** = `hasReplacedYouTube: true`.
- **✦** = `narrativeReviewNeeded: true` (Posts 21 and 38 — see §5).
- An em-dash in the **Country** column means the Squarespace title didn't supply one and the body text doesn't either — this is a faithful preservation, not a missing field. The migration script does **not** invent country tags. (Q2 decision.)
- "(untitled lead)", "(lead Desert Dwellers track)", etc. mean the post doesn't surface a song title in its own header; the body text references a single named album/track but the title pairing is artist-only. The migration script will scan body text for the actual song title and prefer that over a placeholder.

---

## 4. Seven broken-link replacements — the mapping

The brief and Naz's M0 message both identified seven posts (16, 19, 32, 34, 36, 41, 49) where the embedded YouTube video is currently broken on the live Squarespace site. `ITS_Replacement_Links.md` carries nine confirmed replacements in total — the seven plus Posts 1 and 3 which were already on the replacements list. Posts 9, 14, 38 also have confirmed replacements that fold in.

### 4.1 The seven flagged broken posts — corrected matching

The previous migration script attempted to match against song-name strings and missed all seven because Squarespace post titles are keyed to the **Name of Allah and country**, not the song name. The new migration script keys on `oldPostId` (`wp:post_id`, which is stable in the export) — eliminating fuzzy string matching entirely.

| Post | Real title (verbatim from XML) | Broken video ID | Confirmed replacement | Replacement source line |
|---|---|---|---|---|
| 16 | `16. Chaadni Ratey - Al Afuw (The Pardoner) Noor Jahan (Pakistan)` | PRBu6uZa5Hk *(Noor Jahan original — keep, may still work)* and nhyjzHFbxcI *(Bat for Lashes "In God's House" — broken)* | **XBjuJbvqm_Y** for Bat for Lashes; Noor Jahan track stays as recorded — verify in body | "Post 16 — In God's House, Bat for Lashes — Al Afuw … XBjuJbvqm_Y" |
| 19 | `19. Prince - Al Majid (The Most Glorious)` | 0XJz7vamkzk + m8mg7CxAYUM + utRozVkd3g0 *(memorial set after Prince's death; likely region-blocked)* | **7IQE62Vn4_U** *(official Prince Estate channel)* | "Post 19 — Gold, Prince — Al Majid … 7IQE62Vn4_U (Official Prince Estate channel)" |
| 32 | `32. Ben Deniz - Al Hafiz (The Preserver), Turkey` | O8yrt16hfgI | **5gDZ5hWCZ7Y** *(official video for "Ya Sen Ya Hiç"); alternative o8xpn4Bk2O4 (TRT broadcast)* | "Post 32 — Bendeniz (Deniz Çelik), 'Ya Sen Ya Hiç' — Al Hafiz … 5gDZ5hWCZ7Y (official video)" |
| 34 | `34. Cheikha Remitti, Ya Darr (The Aflicter), Algeria` | fsAxnUuOhYo + pCPB6WD87Yw | **TLAnJaCawTA** *(Sidi Mansour album)* | "Post 34 — Sidi Mansour, Cheikha Rimitti (ft. Robert Fripp & Flea) — Ad Darr … TLAnJaCawTA" |
| 36 | `36. Miracle, Above and Beyond Ocean Lab - Al Alim (The All Knowing), UK` | -UsuVTRaglY + TGTWaUV6Z10 | **JsL9q3Pr4kw** | "Post 36 — Miracle, Above & Beyond OceanLab — Al Alim … JsL9q3Pr4kw" |
| 41 | `41 PM Dawn Patient Eyes - Al Sabur, (The Patient One)` | RPPvA3buNLU | **k_0LHKxTy9g** | "Post 41 — Looking Through Patient Eyes, PM Dawn — Al Sabur … k_0LHKxTy9g" |
| 49 | `49 Nazia & Zoheb Hussain, Al Basit (The Expander), Pakistan` | mZqawa_lmSo | **K797A36tjdo** | "Post 49 — Disco Deewane, Nazia & Zoheb Hassan — Al Basit … K797A36tjdo" |

Note: the **two posts the old script may have already gotten right but couldn't be confirmed** (Posts 1 and 3) are also covered by the migration script for safety. Post 1's original `BgpEg3tu01I` becomes **PivWY9wn5ps**; Post 3's original `3vEjKrP6tOs` becomes **54LQ_AO1gDI**. These are recorded as `hasReplacedYouTube: true` whether or not the original ID was in fact dead, so the audit trail is consistent.

### 4.2 The replacement table — single source of truth

The migration script imports a single TypeScript constant — proposed location `src/lib/archive/replacements.ts` — that mirrors `ITS_Replacement_Links.md` line-for-line:

```ts
// One row per oldPostId from the WXR export.
// Keyed on oldPostId, NOT title — eliminates the string-matching bug.
export const YOUTUBE_REPLACEMENTS: Record<string, {
  newYouTube: string;
  reason: string;       // ITS_Replacement_Links.md verbatim
}> = {
  "1":  { newYouTube: "PivWY9wn5ps", reason: "Post 1 — Man in the Mirror, Michael Jackson — Al Karim" },
  "5":  { newYouTube: "54LQ_AO1gDI", reason: "Post 3 — Hidden Place, Björk — Al Batin (Official 'björk : hidden place (HD)')" },
  "11": { newYouTube: "ROzYz3HAfz0", reason: "Post 9 — Yny Maj Hyrynh, Marlui Miranda — Al Badi (exact track from IHU Todos os Sons)" },
  "41": { newYouTube: "iKWL8viMjBM", reason: "Post 14 — Faraway, Demis Roussos — Ar Rahman (Provided to YouTube by UMG)" },
  "37": { newYouTube: "XBjuJbvqm_Y", reason: "Post 16 — In God's House, Bat for Lashes — Al Afuw" },
  "45": { newYouTube: "7IQE62Vn4_U", reason: "Post 19 — Gold, Prince — Al Majid (Official Prince Estate channel)" },
  "69": { newYouTube: "5gDZ5hWCZ7Y", reason: "Post 32 — Bendeniz, 'Ya Sen Ya Hiç' — Al Hafiz (official video)" },
  "21": { newYouTube: "TLAnJaCawTA", reason: "Post 34 — Sidi Mansour, Cheikha Rimitti — Ad Darr" },
  "25": { newYouTube: "JsL9q3Pr4kw", reason: "Post 36 — Miracle, Above & Beyond OceanLab — Al Alim" },
  "83": { newYouTube: "4jJJHfL1yQA", reason: "Post 38 — Nadia, Nitin Sawhney — Al Muqsit (one confirmed working)" },
  "81": { newYouTube: "k_0LHKxTy9g", reason: "Post 41 — Looking Through Patient Eyes, PM Dawn — Al Sabur" },
  "93": { newYouTube: "K797A36tjdo", reason: "Post 49 — Disco Deewane, Nazia & Zoheb Hassan — Al Basit" },
};
```

The **WP post IDs above are the actual numbers from the WXR** (extracted at parse time on 22 June 2026), not the visible "Post 16" / "Post 49" numbering — IDs 37, 93, etc. are real. This is the matching key the previous script was missing.

### 4.3 Post 16 — the two-artist case, handled

Post 16 has *two* embedded videos in the body: a Noor Jahan original and a Bat for Lashes track ("In God's House"). The replacement targets the Bat for Lashes embed only — the Noor Jahan video may still work and is left as-is. The migration script handles this by:

1. Extracting **all** YouTube IDs from the body in document order.
2. Setting `song.youtube` to the *first* ID (Noor Jahan, since "Chaadni Ratey" is the post's headline pairing).
3. Pushing the second ID into `relatedMedia[0]` with label "Bat for Lashes — In God's House" and replacing it with `XBjuJbvqm_Y`.

### 4.4 Post 38 — the multi-Sawhney case

Same structural pattern: three videos in the body (Nadia, plus two referenced Nitin Sawhney/Coke Studio tracks). Headline `song.youtube` set to the confirmed-working `4jJJHfL1yQA`. The two secondary references go into `relatedMedia` with `narrativeReviewNeeded: true` set on the post (see §5).

---

## 5. Posts 21 and 38 — narrative review

These are flagged in `ITS_Replacement_Links.md` as content tasks, not technical ones:

> "Post 21's path to Niyaz, Post 38's Prince tangent. Rather than just swapping links, Naz noted these may need a small rewrite so the narrative still makes sense without the missing intermediate links. This is a content task, not a technical one — flag for Naz to review during final pass before migration."

Handling:

1. The migration script **does not** auto-rewrite these. Their bodies are migrated faithfully, including any references to media that no longer resolves.
2. Frontmatter records `narrativeReviewNeeded: true` on both.
3. A new lint script — `bun run check:archive` — lists all posts where `narrativeReviewNeeded: true`, with their slug + body excerpt around the broken reference. The build fails CI only if a release flag (`ARCHIVE_REVIEW_REQUIRED=true`) is set; ordinary builds just print a warning.
4. **No public-facing "this post is under review" banner.** The brief is clear that this is an editorial flag for Naz, not a visitor-facing notice.

When Naz returns with edits, those land in their own milestone (M2.1) by editing the two `.md` files directly — no script re-run needed.

---

## 6. File and folder layout

```
content/
  archive/
    01-al-karim.md
    02-al-mutakabbir.md
    …
    44-al-halim.md
    45-46-al-mumin-al-qayyum.md
    47-al-muqtadir.md
    48-al-jami.md
    49-al-basit.md
    50-al-muhaimin.md         ← 49 files total

public/
  archive/
    01/
      hero.jpeg               ← original Squarespace lead image, downloaded
      <body-image-N>.jpeg     ← inline body images, if present
    02/
      hero.jpeg
    …                         ← 49 directories, one per post
  threshold/
    return-to-the-sanctuary.webp  ← cropped golden-doors detail (see §11)

src/lib/archive/
  types.ts                    ← ArchivePost, ArchiveComment types (§2.1)
  loader.ts                   ← buildtime markdown reader → ArchivePost[]
  redirects.ts                ← exported redirect map (old → new) for next.config.js
  replacements.ts             ← YOUTUBE_REPLACEMENTS table (§4.2)
  wander.ts                   ← three sort functions (§8)
  body-render.ts              ← markdown → React, with YouTubeEmbed shortcode

src/components/archive/
  ArchiveIndexAlcove.tsx      ← one alcove card on the index grid
  ArchiveIndexWanderLine.tsx  ← the inline-sentence wander control (§8.2)
  ArchivePostHeader.tsx       ← N° + Name + meaning + song + artist + country
  ArchivePostBody.tsx         ← rendered body, with YouTube embed
  ArchivePostNav.tsx          ← ← previous · next →
  ArchiveCommentList.tsx      ← threaded read-only comments
  ArchiveComment.tsx          ← single comment node (recurses for replies)
  YouTubeEmbed.tsx            ← controlled iframe with privacy params
  FooterThreshold.tsx         ← cropped doors detail + "Return to the Sanctuary"

src/app/archive/
  page.tsx                    ← /archive (the index)
  [slug]/page.tsx             ← /archive/[slug] (single post)

scripts/
  migrate-from-wxr.ts         ← one-shot migration runner (§7)

specs/m2-archive/
  document.md                 ← this file
```

### 6.1 Loader pattern (no DB at runtime)

`loader.ts` exports two functions, both **build-time** — Next.js calls them during `next build` and they never run on a request:

```ts
export async function loadAllArchivePosts(): Promise<ArchivePost[]>
export async function loadArchivePost(slug: string): Promise<ArchivePost | null>
```

Internal flow:

1. Read every `.md` file under `content/archive/` (49 files).
2. Parse with `gray-matter` to split YAML frontmatter from markdown body.
3. Coerce frontmatter against the `ArchivePost` type (Zod, light validation).
4. Cache the resulting array in module scope so multiple page calls share one parse.

This is the same pattern sufipunk uses for `/content/sanctuary/` — known good.

### 6.2 Why markdown + frontmatter (not MDX)

Considered MDX. Decided against:

- The body content is plain prose with images and one YouTube embed. No JSX is needed inside the body.
- MDX raises the dependency footprint and the editing cognitive load (any future content editor — including a non-developer — has to mentally reconcile JSX in their prose).
- A controlled-component approach (one `<YouTubeEmbed>` shortcode rendered post-parse from a `[youtube:ID]` token in the markdown) gets us the same functionality without bringing MDX into the pipeline.

Rendering: `marked` with custom renderers — same library sufipunk uses. Image src rewriting and YouTube shortcode expansion happen as marked extensions.

---

## 7. Old-URL redirects

Every post in the WXR has an `oldPath` like `/2015/11/11/1-man-in-the-mirror-michael-jackson-al-karim-the-generous`. External links — Substack newsletters, blogposts referencing specific entries, Google search results — point at these URLs. If we silently break them all on cutover, the archive's connective tissue with the wider web dies.

Plan:

1. `src/lib/archive/redirects.ts` exports a `Redirect[]` array, one entry per post:

   ```ts
   { source: oldPath, destination: `/archive/${slug}`, permanent: true }
   ```

2. `next.config.js` adds an `async redirects()` block that imports and returns this array (plus the index redirect `/2015/11/11 → /archive` etc., catch-all not required since Squarespace dates are deterministic).

3. The redirect array also covers two extra cases:
   - `/archive` itself when called without a `?wander=…` parameter — falls through to the default sort, no redirect needed.
   - The sufipunk visitor coming in via the M1.5 sister-door link → no redirect needed; that link already targets `https://sufipunk.co.uk` directly.

Tested in the M2 acceptance pass by hitting each `oldPath` with `agent-browser` and confirming a 308 to the new path.

---

## 8. Wander — three sort orderings, no filter UI

The brief is explicit:

> "The 'wander' menu (by Names, by music, in order written) should NOT be three buttons in a row. It should read as part of the same continuous voice as the rest of the page — closer to one sentence with three quiet inline links woven through it than a UI menu sitting separately from the writing."

And:

> "the 'Wander' links use small diamond bullets (♦) between them rather than reading as a button row" *(Concept A confirmation, 18 June 2026)*

### 8.1 The three sorts

| Mode | Query param | Sort key | Notes |
|---|---|---|---|
| In the order it was written | `?wander=order` *(default)* | `postNumberSort` ascending | 1 → 50; 45/46 sits between 44 and 47 |
| By the names of Allah | `?wander=names` | `name.english` (lowercased, "Al "/"Ar "/"As "/"Ya "/"Malikal " stripped for comparison) ascending | So "Al Akhir" sorts as "akhir", not under "A" for "Al" — i.e. by the Name itself, not the article |
| By the music | `?wander=music` | `song.artist` ascending, `song.title` ascending tiebreak | "Above & Beyond" → "above", "The Verve" → "verve" (article-stripped); diacritics folded |

No filter UI. No country chips. No date scrub. The three sorts are the entire wander surface.

### 8.2 The wander sentence (proposed prose)

A single line, in the page's own voice, with the three Names of the modes as inline links separated by ♦ diamonds:

> *Wander through the archive [in the order it was written] ♦ [by the names of Allah] ♦ [by the music].*

The currently-active sort renders as plain bronze text (not a link); the other two render as link-coloured. Clicking either swaps the URL query param and re-sorts the alcove grid below. No spinner, no transition flash — the page is small enough (49 entries) that the re-render is instant.

### 8.3 No bookmarkable filter combinations

This is intentional: the brief frames the archive as "a courtyard, not a database". The URL state space is exactly four URLs:

- `/archive` (= `?wander=order`, the default)
- `/archive?wander=order`
- `/archive?wander=names`
- `/archive?wander=music`

No combinatorial explosion, no URL fragments lost over time, no need for client-side state libraries.

---

## 9. The Archive index page (`/archive`)

### 9.1 Page structure

1. **Page header**
   - Kicker: "The Archive" (font-display, bronze, uppercase, tracked)
   - Title: "Forty-nine names. Forty-nine songs."  *(no time-duration claim — outstanding brief item)*
   - One-paragraph standfirst in the page voice, describing what the archive is, in two or three sentences. Drafted in M2 implementation, sent to Naz for confirmation before merge.

2. **Wander sentence** (§8.2)

3. **Alcove grid**
   - 49 alcoves, each rendering one post.
   - Layout: 1 column on mobile, 2 columns from `sm`, 3 columns from `lg`. The brief warns against making it feel like "a database being browsed" — three columns on a wide screen still reads as a courtyard, not a directory. Re-tested against that read at M2 acceptance.
   - Each alcove (the M1.5 `<Alcove>` component, `tone="default"`) shows:
     - Bronze post number — `No. 01`
     - Display Name + meaning, on two lines: `Al Karim` / `The Generous` (italic, smaller)
     - A horizontal hairline `❁`
     - Song title in italic, then `Artist · Country` in soft ink
   - The alcove itself is wrapped in `<Link href={`/archive/${slug}`}>` so the whole frame is clickable. Hover lifts the niche tint slightly (`tone="default" → "deep"` swap on hover, `@media (hover: hover)` gated).

4. **Footer threshold** at the very bottom (§11).

### 9.2 No images on the index

Deliberate. Squarespace lead images are uneven in tone (some bright product shots, some atmospheric stills, some plain photos of CDs). Putting them all on one grid page would override the alcove frame and make it feel like Pinterest. The lead image lives on the *post* page; the index is text-only inside the arch.

### 9.3 Mobile

Single column, alcoves stack with calm spacing. Wander sentence wraps cleanly; ♦ diamonds stay in line with the link text. The arch profile reads even better at narrow widths (already verified in M1.5).

---

## 10. The single post page (`/archive/[slug]`)

### 10.1 Page structure

1. **Page header**
   - Kicker: "From the archive ♦ No. 01"  *(the post number sits in the kicker so it doesn't shout)*
   - Display Name (large, font-display, deep green): `Al Karim`
   - Meaning, italic, on the next line: `The Generous`
   - A small caption line under that: *Song · Artist · Country · originally posted 8 December 2015*
   - The published date is **shown** here on the post page (unlike sufipunk's Sanctuary First decision to hide dates); the archive's date is its provenance — it tells the visitor when the entry was made, which is part of what an archive is for.

2. **Hero image** (the original Squarespace lead image, migrated into `/public/archive/01/hero.jpeg` etc.)

3. **YouTube embed** (`<YouTubeEmbed videoId={song.youtube} title={...}>`) — appears at the position it sat in the original body

4. **Body prose** — `archive-prose` class from M1, faithful migration

5. **Related media**, if `relatedMedia` is non-empty (Posts 16, 38, etc.): a quiet sub-section titled "Also embedded in this post" with each item as a small inline card.

6. **Comments**, if `comments.length > 0`:
   - Heading: "Reader comments" (font-display, ink-soft)
   - One thread per top-level comment (`parentId === null`), with replies indented under their parents
   - Each comment: author + date in small caps, body in `prose-archive`
   - Naz's own replies (`author === "Sufi Punk"`) get a tiny ❁ next to the name, no other distinction — quiet, not loud

7. **Adjacent navigation**
   - `← Previous: 02 Al Mutakabbir` on the left, `Next: 04 Al Mumit →` on the right
   - Sort order matches whatever Wander mode the visitor came in with (carried via `?from=order|names|music` query param). Default `order`.

8. **"Back to the archive"** link, centred, in the page voice — "Step back into the archive."

9. **Footer threshold** (§11) at the very bottom.

### 10.2 YouTube embed component — privacy + atmosphere

- Use `youtube-nocookie.com` host instead of `youtube.com`. No tracking unless the visitor presses play.
- 16:9 aspect ratio enforced by CSS `aspect-ratio`.
- Wrapped in an `<Alcove tone="deep">` so the video sits inside the arch — the mosaic frame contains the music, rather than the music breaking out of the frame.
- `loading="lazy"` so embeds below the fold don't fetch until they enter the viewport.

---

## 11. Footer threshold — the door back to sufipunk.co.uk

The brief is precise about this:

> "a cropped, faded detail of the map (e.g. the golden doors), with the heading 'Return to the Sanctuary' and copy *'Inspiring the Sufi is one part of the Spiritual Underground. Step back into the garden.'*, linking out to sufipunk.co.uk … The full map image does NOT appear anywhere on this site."

Plan:

1. **Asset**: a manually-cropped detail of the golden-doors region of `Final_map.webp` (sufipunk.co.uk's master map). Cropped tightly so only one or two doors are visible — recognisably a fragment, not a navigable map. Saved at `public/threshold/return-to-the-sanctuary.webp`. The crop happens at M2 implementation time, not now; the source is already in `/workspace/sufipunk-co-uk/public/images/`. **This is not an AI-generated illustration and not a re-rendering — it's a crop of the existing real asset.**

2. **Component**: `<FooterThreshold />` renders the cropped image faded down to ~55% opacity, with the M1.5 alcove laid over the bottom half of it; the alcove holds the heading "Return to the Sanctuary" and the verbatim brief copy, with a clear link to <https://sufipunk.co.uk>.

3. **Placement**: at the very bottom of `/archive` and at the bottom of every single-post page. The standard `<SiteFooter />` (M1) sits **below** the threshold — i.e. the order is: page content → footer threshold → site footer.

---

## 12. Migration pipeline (`scripts/migrate-from-wxr.ts`)

A one-shot Node script — committed to the repo for reproducibility, run once during M2 implementation, never on a visitor request.

Inputs:
- `source-docs/Squarespace-Wordpress-Export-06-16-2026.xml`
- `src/lib/archive/replacements.ts`

Output:
- 49 `.md` files in `content/archive/`
- 49 directories of images in `public/archive/`
- A console report: posts migrated, comments migrated, images downloaded, replacements applied, posts flagged for narrative review.

Steps per post:

1. **Parse** the WXR `<item>`, filtered to `post_type=post`, `status=publish`. Result: 49 records.
2. **Derive** post number, English Name, meaning, song, artist, country from the title using regex anchored on the period+space pattern `^(\d+(?:\/\d+)?)\.?\s+`. Country comes from a parenthetical like `(Pakistan)` or a trailing `, Pakistan`. Artist comes from the segment between the song title and the Name; song from the segment before the Name.
3. **Generate** the new slug from §3 (with the four titled `†` cases normalised to canonical Arabic transliteration in slug only).
4. **Convert** body HTML → markdown via `turndown` with custom rules:
   - Strip the redundant top-level `<h1>` that repeats the title.
   - Replace each YouTube `<iframe>` with a `[youtube:ID]` shortcode token.
   - Rewrite `images.squarespace-cdn.com` URLs to local `/archive/{nn}/...` paths.
   - Decode `&nbsp;`, `&amp;`, `&quot;` etc. to clean text/punctuation.
5. **Apply** YouTube replacements from `replacements.ts`. The headline `song.youtube` is replaced according to the table; `relatedMedia` IDs are replaced where also listed.
6. **Download** every image referenced in the body (and the Squarespace lead image from `wp:attachment_url`) to `public/archive/{nn}/`. Use a deterministic filename so repeat runs don't churn diffs.
7. **Extract** comments — every `<wp:comment>` with `wp:comment_approved=1`. Convert each `<wp:comment_content>` HTML to markdown via the same turndown ruleset. Preserve `wp:comment_id` and `wp:comment_parent` for stable threading.
8. **Write** the `.md` file: YAML frontmatter (the full schema from §2.2) + body.
9. **Report** to console: per-post summary line `[01-al-karim] body=8.2KB · 0 comments · YouTube replaced · 1 image · OK`.

Ordering the script must enforce: read all 49 posts first, build the canonical slug map, *then* do image downloads in parallel (rate-limited to 4 concurrent so we don't 429 the Squarespace CDN).

---

## 13. Acceptance criteria

- [ ] 49 `.md` files exist in `content/archive/`, one per post, slugs matching §3.
- [ ] Every `.md` file has a complete frontmatter block matching the §2.2 schema; YAML parses without error.
- [ ] `loader.ts` `loadAllArchivePosts()` returns exactly 49 records.
- [ ] All 49 single-post pages render without runtime error.
- [ ] All 49 hero images present in `/public/archive/{nn}/hero.{ext}`.
- [ ] Seven flagged posts (1, 3, 9, 14, 16, 19, 32, 34, 36, 38, 41, 49) have `hasReplacedYouTube: true` and the new YouTube ID matches §4.2.
- [ ] Posts 21 and 38 have `narrativeReviewNeeded: true`.
- [ ] `bun run check:archive` lists Posts 21 and 38 (and only those) as needing narrative review.
- [ ] `/archive` renders 49 alcoves on default Wander mode, sorted 1 → 50 with 45/46 between 44 and 47.
- [ ] Switching to `?wander=names` re-sorts to alphabetical by Name (article-stripped). `?wander=music` re-sorts by artist.
- [ ] Each old Squarespace path returns a 308 redirect to `/archive/{slug}`. Verified for at least 5 random posts via `agent-browser`.
- [ ] Comment threading on Post 30 (7 comments, 3 reply pairs) renders the replies indented under their parents.
- [ ] Footer threshold appears below `/archive` and below every `/archive/[slug]` page; the heading and copy match the brief exactly; the link target is `https://sufipunk.co.uk`. The full `Final_map.webp` does not appear anywhere on the site.
- [ ] No archive page has a visible "this post is under review" banner (private editorial flag only).
- [ ] Every YouTube embed uses `youtube-nocookie.com`.
- [ ] `bun run build` clean. Static generation completes for all 51 routes (`/`, `/archive`, plus 49 `/archive/[slug]` plus `/_not-found`).
- [ ] Browser-verified at desktop 1440×900 and mobile 390×844: index reads as a courtyard not a directory, post pages read as letters, alcove arch profile holds at every width.

---

## 14. Test plan

### 14.1 Unit / build-time

- Migration script idempotency: running `migrate-from-wxr.ts` twice produces identical `.md` and image files (no diffs).
- Slug uniqueness: no two posts share a slug.
- Replacement integrity: every post in `replacements.ts` corresponds to a real `wp:post_id` in the export.
- Frontmatter validation: every `.md` parses against the Zod schema with no missing required fields.
- Old-path uniqueness: every redirect source is unique; no destination is ever the same as its source.

### 14.2 Browser

Verified with `agent-browser` at both viewports:

- `/archive` default load — alcove count = 49, header copy is exactly "Forty-nine names. Forty-nine songs.", no time-duration claim anywhere on the page.
- Each Wander mode toggle changes the displayed order; query param updates without full reload; bookmark survives a page refresh.
- Five random post pages: hero loads, YouTube embed plays, body prose has italics and links rendered, comments thread (where present) reads cleanly.
- Five random old Squarespace paths: each returns 308 to the new slug, browser displays the new page.
- Footer threshold present at the very bottom of `/archive`, copy and heading match the brief, link target opens sufipunk.co.uk.

### 14.3 Manual editorial pass (for Naz, before merge)

- Standfirst on `/archive` reads correctly in Naz's own voice (one sentence, drafted by the implementing milestone, sent for sign-off).
- Posts 21 and 38 — narrative reviewed in person; either accepted as-is or edited inline, after which `narrativeReviewNeeded: false` is flipped.

---

## 15. Open questions — answered 22 June 2026

The six questions below are kept verbatim, with Naz's answers folded into the spec body above. Decisions live at the top of the document; this section is now historical.

### Open Q1 — slug normalisation for Posts 34, 41, 48, 50  
**ANSWERED — Naz's wording stays everywhere.** Slugs: `34-ya-darr`, `41-al-sabur`, `48-ya-jami`, `50-ya-muhaimin`.
Naz's titles use forms that depart from the canonical Arabic transliteration:

| Post | Naz's title form | Canonical form | Proposed slug |
|---|---|---|---|
| 34 | `Ya Darr` | `Ad-Darr` | `34-ad-darr` *(canonical)* |
| 41 | `Al Sabur` | `As-Sabur` | `41-al-sabur` *(Naz's form)* |
| 48 | `Ya Jami` | `Al-Jami` | `48-al-jami` *(canonical)* |
| 50 | `Ya Muhaimin` | `Al-Muhaimin` | `50-al-muhaimin` *(canonical)* |

**ANSWERED — leave blank, no inference.** Posts without a country in the title get `country: null` and the alcove omits the country line entirely. No artist-→-country guessing.

### Open Q3 — standfirst draft  
**ANSWERED — draft for Naz, never treat as final.** Implementation ships the draft inline with an `// AWAITING NAZ'S APPROVAL` code comment and a `bun run check:archive` warning. Replaced before launch with Naz's words.

### Open Q4 — comment migration of body URLs  
**ANSWERED — embed them as players, not hyperlinks.** Reader comments containing a YouTube URL render that URL as a `<YouTubeEmbed>` (no-cookie, lazy, alcove-wrapped). Other comment text stays plain prose.

### Open Q5 — son's age detail  
**ANSWERED — only when explicit in the post body.** No inference from post numbers, slug numbers, or the canonical 99-Names ordering. Numbers like `95th` / `60th` in old slugs are confirmed to refer to canonical Name position and are NOT to be read as age references.

### Open Q6 — transitional preview-URL redirects  
**ANSWERED — skip them.** Only the real Squarespace `oldPath` values from the WXR are added to the redirect map. Vercel preview URLs and Squarespace-subdomain bookmarks are out of scope.

---

## 16. What lands in M2 vs deferred

**M2 (this milestone)**
- Migration pipeline + 49 `.md` files committed
- Loader, types, redirect map
- `/archive` index page (Concept A alcove grid + Wander sentence)
- `/archive/[slug]` single-post page (header, hero, YouTube, body, related, comments, adjacent nav)
- Footer threshold component
- Old-path redirects in `next.config.js`
- `bun run check:archive` lint
- Browser-verified at both viewports
- Tarball + handoff

**Deferred (later milestones)**
- About page (M3)
- "Play with me" page + Formspree (M4)
- Replacement homepage (M5+) — the M1.5 preview homepage stays in place until then
- DNS cutover, Vercel domain pointing, Squarespace cancellation (user-side ops)
- Posts 21 / 38 narrative rewrites — flagged in M2, edited in person by Naz before launch

---

*Plan dated 22 June 2026. Implementation starts only after Naz confirms M1.5 is live.*