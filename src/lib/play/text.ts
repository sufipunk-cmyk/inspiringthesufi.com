/**
 * Canonical text for /play-with-me.
 *
 * Sources:
 * - The four-paragraph "Physicians of the Heart" explanation: Naz's
 *   M4 directive (22 June 2026), reproduced verbatim with no edits.
 * - The form-field labels: master brief lines 471–479.
 * - The closing copy: master brief lines 481–485.
 *
 * This module is the SINGLE SOURCE OF TRUTH for the page wording.
 * `bun run check:play-with-me` asserts the Physicians text is intact
 * and the four authors' surnames are present.
 */

export type PlayParagraph = {
  /** 1..4, master-brief paragraph number for traceability. */
  index: number;
  /**
   * Verbatim paragraph body, with one structural marker:
   *  - the literal token `[PHYSICIANS_LINK]` is replaced at render-time
   *    by an <a> wrapping "Physicians of the Heart" pointing at
   *    https://physiciansoftheheart.com.
   * Everything else is plain prose.
   */
  body: string;
};

export const PHYSICIANS_HREF = "https://physiciansoftheheart.com";
export const PHYSICIANS_LINK_TEXT = "Physicians of the Heart";

export const PLAY_INTRO_HEADING =
  "There are as many ways to turn toward the Divine as there are people seeking. What's yours?";

export const PLAY_INTRO_PARAGRAPHS: PlayParagraph[] = [
  {
    index: 1,
    // Note: the heading IS paragraph 1 in Naz's text. We render the
    // heading separately, but we keep paragraph 1 here for traceability
    // and because the lint expects exactly 4 paragraphs of running prose
    // following the heading. Per Naz's text, paragraph 1 of running
    // prose is the "This isn't an invitation..." paragraph.
    body: "This isn't an invitation to find your own way into the 99 Names of Allah. The Names are mine — the fixed point I happened to be given, the tradition I stand inside. For my own practice, I lean on [PHYSICIANS_LINK] by Wali Ali Meyer, Bilal Hyde, Faisal Muqaddam, and Shabda Kahn for how I come to understand what each Name actually means.",
  },
  {
    index: 2,
    body: "But the method underneath it travels further than the Names ever could. Take something you already love completely, without justifying it — a special interest, a fascination, an obsession, gaming, Gundam, gardening, anything — and let it sit next to whatever you hold sacred or significant in your own life. A faith tradition, maybe. Maybe not. Notice where they touch, if they do. The noticing is the practice. You don't need to have found the connection yet.",
  },
  {
    index: 3,
    body: "You can see it already happening if you read through the archive's comments — people writing in from their own blogs, their own songs, their own reference points entirely, and finding they'd landed somewhere near mine. I never asked for that. It just kept happening, one comment at a time. This page is just a clearer door for it.",
  },
];

/**
 * Form field labels — verbatim from master brief lines 471–479.
 * The order in this array is the render order on the page.
 *
 * `email` is omitted here because it is conditionally rendered by the
 * client component when wantsResponse === "yes", and its label is
 * defined alongside the conditional render so the relationship is
 * obvious in code.
 */
export const PLAY_FIELD_LABELS = {
  specialInterest:
    "What's your special interest, fascination, or obsession? (name it plainly, no need to justify it)",
  sacredFixedPoint:
    "What do you hold sacred, significant, or essential in your life? (a faith tradition, a value, a person, anything — whatever your own fixed point is)",
  noticedTouch:
    "Have you noticed them touch? If so, how? (a few sentences — and it's completely fine to say \"I don't know yet\" or \"I'm not sure\")",
  wantsResponse: "Would you like a response?",
  email: "Your email — only if you'd like a response",
  aboutYou: "Anything else you'd like to share about yourself",
} as const;

/**
 * Closing copy — verbatim from master brief lines 481–485.
 * Two strings, rendered below the submit button.
 */
export const PLAY_CLOSING_LINE =
  "I read these when I can. There's no schedule, and nothing you send needs to be perfect — half-formed noticing counts.";

export const PLAY_CLOSING_SMALL_PRINT =
  "This is an explorative project and a piece of research. I'm interested in how to develop and create spaces like this, and what you share helps shape that — I welcome ideas.";

/**
 * Success-state copy. Two short lines, one of which intentionally echoes
 * Naz's "half-formed noticing counts" so the visitor leaves with the
 * same line they came in with.
 */
export const PLAY_SUCCESS_LINE_1 = "Thank you. I'll read this when I can.";
export const PLAY_SUCCESS_LINE_2 = "Half-formed noticing counts.";