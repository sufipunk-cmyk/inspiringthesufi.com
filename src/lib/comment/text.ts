/**
 * Canonical text for the "leave a reflection" form that sits under
 * each archive post's comment thread.
 *
 * Unlike /play-with-me's text (which is Naz's own verbatim words),
 * every string in this file is an agent draft written to fit the
 * site's existing voice — none of it is confirmed yet. Each drafted
 * string below carries an // AWAITING NAZ'S APPROVAL marker, same
 * convention as the rest of the codebase (see scripts/check-archive.ts,
 * scripts/check-about.ts). Clear the markers once approved.
 */

// AWAITING NAZ'S APPROVAL
export const COMMENT_INTRO_LINE =
  "This page doesn't take live comments — but you're welcome to leave a reflection on this entry below. It's sent straight to Sufi Punk by email; it won't appear here automatically.";

// AWAITING NAZ'S APPROVAL
export const COMMENT_FIELD_LABELS = {
  name: "Your name",
  reflection: "Your reflection on this entry",
  wantsResponse: "Would you like a response?",
  email: "Your email — only if you'd like a response",
} as const;

// AWAITING NAZ'S APPROVAL
export const COMMENT_SUBMIT_LABEL = "Send this reflection";

// AWAITING NAZ'S APPROVAL
export const COMMENT_SUCCESS_LINE_1 = "Thank you. It's been sent.";
// AWAITING NAZ'S APPROVAL
export const COMMENT_SUCCESS_LINE_2 = "Half-formed noticing counts here too.";

// AWAITING NAZ'S APPROVAL
export const COMMENT_SECTION_HEADING_NO_THREAD = "Leave a reflection";
// AWAITING NAZ'S APPROVAL
export const COMMENT_SECTION_HEADING_WITH_THREAD =
  "Leave a reflection of your own";
