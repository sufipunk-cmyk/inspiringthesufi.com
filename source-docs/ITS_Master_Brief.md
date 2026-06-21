# Inspiring the Sufi — Master Site Brief
## inspiringthesufi.com
### Last updated: 18 June 2026

---

## ⚠️ OUTSTANDING — ACTION BEFORE ANYTHING ELSE (added 18 June 2026)

**Context for this session — read first:** A previous agent session built a
working version of this site (Concept A confirmed, ~49 posts migrated, map
footer-threshold built) on 18 June 2026, but that session's underlying model
went down (repeated "error processing message" failures) and never
recovered. Because nothing had been pushed to GitHub yet, that build is
presumed lost. This is a fresh start. Do not assume any prior session state,
checkpoint, or sandbox exists — build from this brief alone. The good news:
the brief itself was already proven once (it produced a working build before
the outage), so this should be achievable again.

1. **GitHub push.** As of 18 June 2026, github.com/sufipunk-cmyk/inspiringthesufi.com
   is confirmed EMPTY — zero commits. A full build (all ~49 posts migrated,
   Concept A archive layout, link fixes attempted) currently exists only in a
   temporary e2b sandbox. Push everything to this repo as the first action of
   the next session.

2. **Broken YouTube links — confirmed still broken.** Despite the migration
   script being designed to fix exactly these using ITS_Replacement_Links.md,
   posts **49, 41, 32, 19, 16, 36, 34** are confirmed (by Naz, checking the
   live build) still showing broken embeds. Likely cause: the script matched
   against hardcoded title strings (e.g. exact text "34. Sidi Mansour") that
   may not exactly match the real post titles in the Squarespace XML. Next
   session: print the actual XML title for each of these 7 posts, compare
   against ITS_Replacement_Links.md's intended fixes, and correct the
   matching logic — do not just re-attempt the same string match.

3. **"Nine years" correction not yet reflected in any live copy.** This brief
   already correctly omits any "nine years" framing (see About text below —
   it was never in the confirmed About copy). But the agent's first live
   build still showed "Fifty names. Fifty songs. Nine years." on the archive
   page header — this was a sentence the agent generated independently, not
   from this brief. Confirm the archive header reads simply "Fifty names.
   Fifty songs." with no time-duration claim at all, anywhere on the site.

---

## PART ONE: INFRASTRUCTURE
### Fill this in as you set each thing up. Paste the completed version into every agent session.

---

### 1. GitHub
- **Account**: sufipunk-cmyk (same account as sufipunk.co.uk project)
- **Repository name**: inspiringthesufi.com
- **Repository URL**: https://github.com/sufipunk-cmyk/inspiringthesufi.com
- **Status**: [x] Empty and ready

---

### 2. Vercel
- **Account**: same as sufipunk.co.uk project
- **Connected to GitHub**: [x] Yes
- **Project name on Vercel**: inspiringthesufi-com
- **Current preview URL**: https://inspiringthesufi-com.vercel.app

---

### 3. Domain
- **Domain name**: inspiringthesufi.com
- **Domain registrar**: currently on Squarespace hosting
- **Pointed to Vercel**: [ ] Not yet — do this LAST, only once site is built and tested
- **Squarespace subscription**: £15/month — cancel only after new site is live and tested
  (saving: £180/year)

---

### 4. Content sources
- **Squarespace XML export**: completed June 2026 — contains all 50 posts and comments
- **Comments**: present in export, including genuine reader exchanges (e.g. Nathan
  Albright exchange on Post 41) — worth preserving during migration
- **YouTube link audit**: completed — see ITS_Replacement_Links.md for all confirmed
  replacement links for the 11 posts with broken media

---

## PART TWO: BUILD BRIEF
### Read this every session before touching any code.

---

## READ THIS FIRST — EVERY SESSION

This brief is the single source of truth. Do not make architectural decisions that
contradict it. The work is to build what is described — completely and beautifully —
not to expand it.

**The GitHub repo for this project is:**
https://github.com/sufipunk-cmyk/inspiringthesufi.com

**Start every session by cloning or pulling from this repo. Do not start from scratch.**

---

## What this site is

Inspiring the Sufi is a companion project to Sufi Punk's Sanctuary First — the origin
story and archive of the whole creative practice. It began in 2015 as a spiritual
parallel play project: pairing each of the 99 Names of Allah with a piece of global
music, created alongside her son from age 6.

50+ posts exist. The archive is real, documented, and deeply personal.

This is NOT being rebuilt as a primary site. It is being upgraded and redesigned to:
- Live freely on Vercel (moving off the £15/month Squarespace subscription)
- Reflect its identity as the origin story and archive of the Sufi Punk practice
- Link clearly into the main sufipunk.co.uk ecosystem
- Stand alone as a beautiful, complete project in its own right

---

## The ecology

**sufipunk.co.uk** = the living practice. Present tense. Sanctuary First, Safe
Passage, Spiritual Underground, the book.

**inspiringthesufi.com** = the root. Past continuous. Where the practice began and
was documented over years.

The link between them: *"This is where it started. Come and see."*

On the main site, Inspiring the Sufi appears within the Spiritual Underground
section as the named example of spiritual parallel play. Visitors click through to
the full archive here.

**Map placement — confirmed 18 June 2026:** The full illustrated zawiya map
(Final_map.png) lives only on sufipunk.co.uk — it is the present-tense
sanctuary's literal navigation, not this site's. inspiringthesufi.com does
NOT get the full map. Instead, the connection back is made via a "Footer
Threshold" at the very bottom of the archive page: a cropped, faded detail of
the map (e.g. the golden doors), with the heading "Return to the Sanctuary"
and copy *"Inspiring the Sufi is one part of the Spiritual Underground. Step
back into the garden."*, linking out to sufipunk.co.uk. This was built and
confirmed working in the first agent build (18 June 2026) — keep this
pattern, do not replace it with the full map image.

Reasoning: putting the full map on both sites would flip the hierarchy and
make the archive feel bigger than the sanctuary it's actually one part of.
The map is sufipunk.co.uk's literal navigation; here it's only ever a
glimpse, a door back, never the main event.

---

## What the rebuild needs to do

- Host 50+ existing posts cleanly and readably
- Feel like an archive — complete, curated, not actively growing (though see
  "Future Development" section below for the planned exception)
- Carry the same visual DNA as the main Sufi Punk site without being identical
- Be buildable and hostable on Vercel for free (Next.js, same as sufipunk.co.uk)
- Require no ongoing technical maintenance — posts are complete, not being added to
- Preserve genuine reader comments from the original Squarespace site where present
- Fix all broken YouTube embeds — see ITS_Replacement_Links.md for confirmed
  replacements for all known-broken videos
- Link back to sufipunk.co.uk clearly
- Be mobile friendly — most visitors arrive via phone

---

## Visual direction

The main Sufi Punk site uses:
- Parchment/cream background
- Dark green headings
- Gold/amber accents
- Cormorant Garamond serif typography
- Mosaic tile motifs from the handmade door

**The handmade door is a real, physical object Naz made** — a small mosaic
arch with hand-laid glass tiles (triangles and diamonds in blue, green, gold,
red, white), a working hinge and clasp, on a textured plinth. Photos exist
(see IMG_3057.jpeg and similar). This is the authentic source for the arch and
mosaic motifs referenced throughout both briefs — not a generated or
illustrated approximation. Naz is taking further photos (straight-on, even
light, close-up of the arch point, close-up of a border section) to give the
agent better raw material. Use crops or traced outlines from these real
photos for arch shapes and mosaic fragments. Do not substitute AI-generated
illustrations of an arch or mosaic pattern in place of the real object — Naz
has been deliberately moving away from AI-generated imagery across this whole
project, and the real door is more authentic and more interesting than any
generated equivalent would be.

**There are TWO real handmade doors, and they can serve two different roles:**

1. **The gold door** (warm amber/gold mosaic panel, diamond and star pattern,
   blue/green/red border tiles) — fits the existing parchment/amber/gold
   palette already established for sufipunk.co.uk. Suited to the main living-
   practice site.

2. **The green door** (cool white mosaic arch surround with eight-pointed star
   clusters, deep green door panel, triangle border) — better suited to
   inspiringthesufi.com specifically, since the brief already calls for this
   site to feel "distinctly like an archive rather than a sanctuary... quieter
   ... like a library," and the cooler green/white palette naturally supports
   that distinction without needing to be invented artificially.

Both doors are real, made by Naz, photographed (not AI-generated). Using one
per site lets the two sites feel like genuine siblings — same handmade,
mosaic-and-pointed-arch language, different colour mood — without needing two
different design systems invented from scratch. The green door is the
recommended source for inspiringthesufi.com's arch/mosaic motifs specifically.

**Note on the illustrated map (Final_map.png) — confirmed exception, 18 June
2026:** The guidance above against AI-generated imagery applies specifically
to repeating design elements (arch shapes, mosaic dividers used across all 50
archive entries). It does NOT rule out the illustrated zawiya map itself.
Naz put real care into that map, likes it, and has confirmed it as the
primary visual centrepiece for sufipunk.co.uk's "explore the zawiya" section
— see SufiPunk_Master_Brief.md. A real-photo fallback exists in
Real_Asset_Inventory.md if the map doesn't translate well once built, but the
map is the current direction, not a placeholder to be replaced by default.

Inspiring the Sufi should share this DNA but feel distinctly like an *archive*
rather than a *sanctuary*. Quieter. More like a library or a letter collection.

**Specific visual direction:**
- Slightly deeper parchment tone — aged rather than warm
- Each archive entry sits within a subtle, fine-line arch — an "alcove" rather
  than a card. No harsh borders; the gentle curve of the pointed arch (traced
  from the real door) encloses the Arabic calligraphy, English meaning, and
  song, the way a card never could.
- Mosaic fragments (cropped or traced from the real door photos) used sparingly
  as dividers between entries or as small accents at the top/bottom of each
  arch — never as a heavy repeating background pattern.
- Arabic typography: Amiri (Google Fonts) is the recommended choice for the 99
  Names — modelled on classical Naskh calligraphy, fits the contemplative tone.
  Noto Naskh Arabic is a cleaner alternative if Amiri causes rendering issues.
- The music pairing shown simply — song title, artist, Name of Allah — without
  looking like a standard card/database entry
- A sense of a collection being walked through (a courtyard) rather than a
  database being browsed
- The son's age at each post as a quiet detail where mentioned in original posts
- The "wander" menu (by Names, by music, in order written) should NOT be three
  buttons in a row. It should read as part of the same continuous voice as the
  rest of the page — closer to one sentence with three quiet inline links woven
  through it than a UI menu sitting separately from the writing.

**Confirmed as built, 18 June 2026 — "Concept A: The Alcove":** of three
mockup concepts trialled (A, B, C — built and reviewed via live preview, not
just described), Concept A was chosen and is the live direction. Specifics
that made it the right choice: the full About-page opening text is shown on
the home page (not hidden behind a "continue reading" click — the origin
story is visible immediately, before the archive); archive entries sit inside
a genuine arch frame (not corner-brackets, not a plain card); the "Wander"
links use small diamond bullets (♦) between them rather than reading as a
button row. Do not revert to Concepts B or C.

---

## Site title and subtitle

**Inspiring the Sufi: A Neurodivergent Practice in Parallel Play**

This subtitle is a deliberate claim of authority, not a marketing tagline. Naz is
naming a practice that had no name when she first lived it — "spiritual
parallel play" — and is now stepping into that naming as author and authority,
precisely because no one else has named it. The subtitle should be quiet and
confident, not explanatory. It does not need to argue for itself.

Placement: site title on home page, and in meta title/description for search and
browser tab. Subtitle sits directly under or beside the main title.

---

## Note: epistemology passage now resolved

An earlier version of this brief held a separate, unplaced "epistemology
passage" here (the idea that direct attention, like noticing a plant is unwell,
carries its own authority without needing external credentials). This has been
fully resolved and folded into Naz's confirmed About page text below — see the
line "trusting that longing itself could be a form of guidance and that
attention could become a form of devotion." No separate passage is needed.

## What this site actually is — read this before the structure below

**A warning to whoever builds this, including any future Claude session:**

Everything below this point — home page stages, archive, about page, find me —
describes pages and sequence, because that's how briefs and websites get built.
But the brief itself is not the thing. The pages are not the thing. Read this
section first, or the structure below will get built correctly and still miss
what it's for.

This site is not an archive someone browses. It is not a funnel that moves a
visitor from arrival to invitation to action. It is one continuous, timeless act:
contemplate the divine, and share what you know. That's it. Naz did this fifty
times and called the results "posts" because that's the form the internet gave
her, but the fifty posts are not the project — they are evidence that the
conversation has been happening the whole time.

People who think sequentially — and this includes most software, most briefs,
and most AI assistants, including earlier drafts of this very document — will
try to turn this into stages: first you arrive, then you learn what it is, then
you're invited, then you browse. That sequence is not wrong as a practical
scaffold (people do need *some* way to physically move through a website), but
it is not the truth of what's happening here, and it should never be mistaken
for the truth.

What's actually happening is closer to this: intuitives and empaths often live
outside strict sequence already — holding past, present, divine attribute, and
a pop song all at once, without needing it to resolve into a timeline. This site
is Naz recognising that way of being out loud, in public, and saying: *I've been
doing this too, here's mine, now you.* The fifty Names are her side of an ongoing
conversation. The site's job is to let other people join that conversation —
not browse a museum of it.

**The actual purpose of refusing to flatten this — stated plainly:**

This timeless, non-sequential way of holding meaning is part of ND experience
that almost never gets articulated on its own terms. It usually only gets named
from the outside, by clinical or deficit language, as something missing relative
to neurotypical sequence and structure. This site is evidence to the contrary —
a way of being that is generative, not deficient, capable of holding a divine
attribute and a pop song and a life's worth of unfolding diagnosis all at once,
producing something real.

The site's job, stated as a goal rather than just a caution, is to make
neurotypical visitors curious rather than certain. Not "how nice, an archive" —
closer to *there is a way of relating to time and meaning and the sacred that I
don't have a name for, and it is clearly not deficient, it's just different —
what is this?* The curiosity itself is the point. Naz is not asking visitors to
understand ND experience from a deficit framework looking in. She is showing
them something whole and letting them wonder what their own labels and
judgments might be missing.

**If you are building this site and you find yourself thinking in terms of
"conversion funnel," "user journey," or "stages a visitor moves through" — stop
and reread this section.** Those framings will produce a technically correct
website that has quietly killed the thing it was meant to hold, and missed the
actual point, which is provoking curiosity rather than delivering information.
Build the pages because pages are needed. Do not believe the pages are what's
actually happening.

---

## Structure / pages needed

**Home** — simplified structure, June 2026. Three elements only.

1. **Title** — "Inspiring the Sufi" with subtitle "A Neurodivergent Practice in
   Parallel Play"

2. **Opening excerpt from the About page** — show the first two paragraphs of
   the confirmed About page text (see "About" section below), starting with
   "Low-demand faith is the recognition that faith can be practised outside
   ritual..." through to "...applied to my own relationship with God." Then a
   clear link through to read the rest: "Read more" or similar, leading to the
   full About page.

   This replaces the earlier approach of writing separate, shorter home-page-
   only text for the concept and origin story. That created two versions of
   the same ideas that would need to stay in sync forever. Showing an excerpt
   of the single About page avoids that — one source of truth, maintained in
   one place.

   "Come sit with me" (Naz's confirmed invitation line) can sit as a closing
   line under the excerpt, before the link through, or alongside the link
   itself — Naz to decide once she sees it laid out, but the line itself does
   not need further drafting.

3. **Wander / entry point** — three ways to browse the archive, presented as
   equal options:
   - By the names of Allah (alphabetical or Names-order)
   - By the music (artist/song)
   - In the order it was written (post 1 through 50, chronological)

This replaces any earlier idea of a wordless single-Name arrival. Naz tested that
concept via mockup and rejected it as disorientating for visitors with no prior
context — Muslim or not. The home page now explains before it invites.

**The Archive (Names 1–50)** — the main collection. Each Name as an entry with:
- The Name in Arabic
- Its meaning in English
- The music pairing (song, artist, country)
- The written reflection (migrated faithfully from Squarespace export)
- Date posted
- Preserved reader comments where present in the export
- (Optional) son's age at time of writing, where mentioned in original text

**About** — CONFIRMED TEXT (Naz's words, June 2026). This is the full About page,
replacing all earlier draft passages including the original "In 2015 I couldn't
pray..." text, which is now superseded:

"Low-demand faith is the recognition that faith can be practised outside ritual,
standardised religious practices, and cultural norms. It is the understanding
that our relationship with the Divine is often alive in the ordinary moments of
our lives, not only within formal acts of worship.

For more than a decade, my work in community arts has centred around
accessibility, belonging, and faith. I have spent years designing spaces where
people can engage in ways that honour their own capacity, curiosity, and ways of
being. Spiritual Parallel Play grew out of that same curiosity and was eventually
applied to my own relationship with God.

I became interested in what contemplation of the Divine might look like outside
ritual and ceremony. What happens when we follow intuition, longing, wonder, and
direct guidance? What if faith could be approached with the same spirit of
exploration that we bring to art, creativity, and play?

In 2015, I wanted my son to have his own direct connection with God — one that
did not depend solely on inherited forms, rules, or the interpretations of
others. As I reflected on this, I began trying to understand and document my
own spiritual play with God, hoping that one day he might discover his own.

At the time, music was my special interest. I began a practice of allowing a
song to lead me towards God. Sometimes a Divine Name would lead me to a song.
Sometimes a feeling, a memory, or a question would become the starting point. I
followed these threads playfully, trusting that longing itself could be a form
of guidance and that attention could become a form of devotion.

Over time, I realised that many people were already doing something similar.
They encountered the Divine through nature, poetry, movement, gardening, art,
collecting objects, learning, making things, caring for others, or following a
fascination wherever it led. What connected these experiences was not the
activity itself but the quality of attention they brought to it.

Today, I invite others to sit with me in this space of Spiritual Parallel Play.
Together, we explore the ways God meets us through our interests, curiosities,
delights, and longings. We share the unexpected paths that have opened our
hearts, trusting that there are as many ways to turn towards the Divine as there
are people seeking.

Spiritual Parallel Play is not a replacement for traditional practice. Rather,
it is an invitation to notice the sacred conversations already taking place
within our lives and to recognise them as part of our relationship with God."

This single piece now carries both definitions (low-demand faith and spiritual
parallel play), the origin story, and the invitation. It replaces the need for a
separate epistemology passage — the line "trusting that longing itself could be
a form of guidance and that attention could become a form of devotion" already
does that work in Naz's own words.

---

**Play with me (the active page)** — CONFIRMED STRUCTURE, June 2026. This is a
short, active page — not a story, not an explanation. Three elements only:

1. One line, in the same voice as the About page: "There are as many ways to
   turn toward the Divine as there are people seeking. What's yours?"

2. **A note on what this is — important for the agent to understand, not just
   display:** This form is not asking visitors to find a connection to the 99
   Names of Allah specifically. The 99 Names are Naz's own fixed point, because
   that is her tradition. Asking everyone to connect their special interest to
   Islamic Names specifically would make this read as an invitation into Islam
   rather than an open practice — which is not the intent and must be avoided.

   The actual method being offered is transferable: take something you already
   love completely, without justifying it (a special interest, a fascination,
   an obsession — gaming, Gundam, gardening, anything), and let it sit next to
   whatever you hold sacred or significant in your own life — which may be a
   faith tradition, may not be. Notice where they touch, if they do. The
   noticing is the practice. You don't need to have found the connection yet.

   This page also functions as research. What comes back through these
   submissions is what will eventually inform how the Spiritual Underground
   section gets designed — its content does not exist yet and should not be
   built in advance of what's learned here. Do not pre-design Spiritual
   Underground content based on assumptions; let it emerge from what people
   actually submit.

3. The submission form itself, immediately below, with no further preamble.
   Fields:
   - What's your special interest, fascination, or obsession? (name it plainly,
     no need to justify it)
   - What do you hold sacred, significant, or essential in your life? (a faith
     tradition, a value, a person, anything — whatever your own fixed point is)
   - Have you noticed them touch? If so, how? (a few sentences — and it's
     completely fine to say "I don't know yet" or "I'm not sure")
   - Would you like a response? (yes/no toggle)
   - Anything else you'd like to share about yourself (optional, as much or as
     little as wanted)

4. One closing line: "I read these when I can. There's no schedule, and
   nothing you send needs to be perfect — half-formed noticing counts." Followed
   by small print: "This is an explorative project and a piece of research. I'm
   interested in how to develop and create spaces like this, and what you share
   helps shape that — I welcome ideas."

The "would you like a response" field gives Naz the ability to choose her own
pace and capacity for replying without that being a visible policy on the page
itself. The small print makes explicit that this is research toward Spiritual
Underground, not just an open-ended invitation with no purpose.

**Find me** — links to sufipunk.co.uk, Substack, Ko-fi

---

## Technical notes

- Build on Vercel (free hosting, same platform as sufipunk.co.uk)
- Repository: https://github.com/sufipunk-cmyk/inspiringthesufi.com
- Framework: Next.js
- Posts as markdown files with frontmatter (title, Name of Allah, Arabic, artist,
  song, country, date, comments where present)
- Import content from the Squarespace XML export — content and comments must be
  preserved faithfully, not paraphrased or summarised
- Fix YouTube embeds using the confirmed replacement links in
  ITS_Replacement_Links.md — do not search for or guess replacement links; use only
  the ones already confirmed in that document
- Two posts (21 and 38) reference a "discovery trail" through other media that no
  longer exists — these may need light copy editing so the narrative still makes
  sense without the missing intermediate link. Flag for Naz's review rather than
  editing independently.
- Mobile friendly — most visitors arrive via phone
- No CMS needed — archive is complete, not actively growing
- Domain inspiringthesufi.com to be pointed from Squarespace to Vercel once tested
- Once live and tested, Squarespace subscription (£15/month) can be cancelled

---

## What DONE looks like

1. Home page follows the simplified structure: title, an excerpt from the
   About page text, the invitation line, then three ways to browse
2. All 50 posts present, readable, correctly formatted
3. Broken YouTube embeds replaced using confirmed links from ITS_Replacement_Links.md
4. Genuine reader comments preserved where present in the original
5. Visual identity feels like an archive — quieter sibling to the main site
6. About page carries Naz's full confirmed text — both definitions, the origin
   story, and the invitation, in one place
7. "Play with me" page exists, with the submission form live and working
8. Clear links back to sufipunk.co.uk, Substack, Ko-fi
9. Mobile tested and working
10. Site deployed to Vercel and domain inspiringthesufi.com pointing to it
11. Squarespace subscription cancelled after testing confirms everything works
12. Footer Threshold present at the bottom of the archive page — a cropped,
    faded detail of the sufipunk.co.uk map, "Return to the Sanctuary" heading,
    linking out. The full map image does NOT appear anywhere on this site.

---

## What is NOT in scope for this phase

- A large-scale public "Next 50 Names" campaign with cultural funding outreach
  (see Future Development below) — the small, quiet version (the "Play with
  me" submission form) IS in scope and described above; only the bigger,
  publicised expansion of this is deferred
- Any e-commerce or product sales
- Member login or gated content
- A public comments system for NEW comments going forward (existing comments
  from the Squarespace export are preserved as static content, not as a live
  commenting system). Submissions via the "Play with me" form are reviewed
  privately by Naz, not posted automatically.
- Any AI-powered features

---

## When you get stuck

Stop. Do not make architectural workarounds or guess at missing information.
Describe the problem clearly and ask. If a YouTube link isn't in
ITS_Replacement_Links.md, flag it rather than searching for a replacement
independently — Naz may want to verify it herself given how personal this archive is.

---

## Future Development (do not build yet — for context only)

### The small version is already in scope — see "Play with me" page above

Earlier drafts of this brief described a "Next 50 Names" idea as a future-only
phase. That changed during the June 2026 writing session: a small, low-demand
version of this exists now, as the "Play with me" page — a single quiet form,
reviewed at Naz's own pace, with no schedule and no promise of response unless
requested. Build this now, as part of this phase.

### What remains genuinely future — the larger public expansion

What's still deferred is a bigger, more publicised version: actively promoting
the submission process, batching and publishing accepted submissions in the
same visual format as the original 50 Names, crediting contributors, syndicating
new entries via Substack, and potentially pursuing cultural funding relevance
(arts councils, faith arts funds, organisations like Rich Mix) on the strength
of "Next 50 Names" as a demonstrated community practice.

Build this larger phase only once the archive itself is live and stable, the
"Play with me" form has been running quietly for a while, and the main
sufipunk.co.uk site is also complete.

---

*Brief prepared June 2026*
*Site: inspiringthesufi.com*
*Contact: sufipunkmusic@gmail.com*
*Companion documents: ITS_Replacement_Links.md, Squarespace XML export*
