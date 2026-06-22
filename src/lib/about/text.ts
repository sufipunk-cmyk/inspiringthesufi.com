/**
 * The canonical About-page text — Naz's own words, June 2026.
 *
 * Verbatim from `source-docs/ITS_Master_Brief.md` lines 391-432.
 *
 * This is the SINGLE source of truth for these eight paragraphs across
 * the whole site. The future home page (M5+) will excerpt the first
 * two paragraphs from here using `ABOUT_PARAGRAPHS.slice(0, 2)`. Do not
 * duplicate this text anywhere else. Do not paraphrase, summarise, or
 * "tighten" it. If a clarity edit feels tempting, it is out of scope —
 * the master brief is unambiguous: "this is the full About page,
 * replacing all earlier draft passages…".
 *
 * The `index` field carries the master-brief paragraph number (1..8)
 * for traceability. It also keeps the data shape future-proof: the
 * runtime `check:about` lint asserts `length === 8`.
 */

export type AboutParagraph = {
  index: number;
  body: string;
};

export const ABOUT_PARAGRAPHS: AboutParagraph[] = [
  {
    index: 1,
    body: "Low-demand faith is the recognition that faith can be practised outside ritual, standardised religious practices, and cultural norms. It is the understanding that our relationship with the Divine is often alive in the ordinary moments of our lives, not only within formal acts of worship.",
  },
  {
    index: 2,
    body: "For more than a decade, my work in community arts has centred around accessibility, belonging, and faith. I have spent years designing spaces where people can engage in ways that honour their own capacity, curiosity, and ways of being. Spiritual Parallel Play grew out of that same curiosity and was eventually applied to my own relationship with God.",
  },
  {
    index: 3,
    body: "I became interested in what contemplation of the Divine might look like outside ritual and ceremony. What happens when we follow intuition, longing, wonder, and direct guidance? What if faith could be approached with the same spirit of exploration that we bring to art, creativity, and play?",
  },
  {
    index: 4,
    body: "In 2015, I wanted my son to have his own direct connection with God — one that did not depend solely on inherited forms, rules, or the interpretations of others. As I reflected on this, I began trying to understand and document my own spiritual play with God, hoping that one day he might discover his own.",
  },
  {
    index: 5,
    body: "At the time, music was my special interest. I began a practice of allowing a song to lead me towards God. Sometimes a Divine Name would lead me to a song. Sometimes a feeling, a memory, or a question would become the starting point. I followed these threads playfully, trusting that longing itself could be a form of guidance and that attention could become a form of devotion.",
  },
  {
    index: 6,
    body: "Over time, I realised that many people were already doing something similar. They encountered the Divine through nature, poetry, movement, gardening, art, collecting objects, learning, making things, caring for others, or following a fascination wherever it led. What connected these experiences was not the activity itself but the quality of attention they brought to it.",
  },
  {
    index: 7,
    body: "Today, I invite others to sit with me in this space of Spiritual Parallel Play. Together, we explore the ways God meets us through our interests, curiosities, delights, and longings. We share the unexpected paths that have opened our hearts, trusting that there are as many ways to turn towards the Divine as there are people seeking.",
  },
  {
    index: 8,
    body: "Spiritual Parallel Play is not a replacement for traditional practice. Rather, it is an invitation to notice the sacred conversations already taking place within our lives and to recognise them as part of our relationship with God.",
  },
];

/**
 * The pull-quote rendered between paragraphs 5 and 6 on the About page.
 * Lifted verbatim from paragraph 5 — not new content, a moment of breath
 * inside the longer read.
 */
export const ABOUT_PULL_QUOTE =
  "trusting that longing itself could be a form of guidance and that attention could become a form of devotion.";