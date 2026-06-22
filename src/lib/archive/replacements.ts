/**
 * YouTube replacement table — single source of truth.
 *
 * Keyed on the **broken YouTube video ID** (the 11-char `v` parameter).
 * The migration walks every `[youtube:XYZ]` token in the body markdown
 * and, if `XYZ` matches a key here, swaps it for `newYouTube`.
 *
 * Why keyed on the YouTube ID, not on `oldPostId`:
 *   Several posts have multiple embeds in the body (Posts 3, 9, 14, 16,
 *   17, 19, 24, 26, 27, 28, 29, 31, 34, 36, 38, 42, 43, 45/46). Keying
 *   on `oldPostId` leaves "which embed gets replaced" ambiguous in
 *   those cases. Keying on the literal video ID makes the swap exact:
 *   the broken embed gets replaced, the working ones (e.g. Post 16's
 *   Noor Jahan) are left alone.
 *
 * Mirrors `source-docs/ITS_Replacement_Links.md` line-for-line. The
 * `reason` field is the verbatim line so audit traceability lives in
 * the diff.
 *
 * `postId` is the WXR `wp:post_id` value, recorded so the migration
 * can flag `hasReplacedYouTube: true` on the right post even when the
 * broken ID itself is otherwise anonymous.
 */

export type YouTubeReplacement = {
  newYouTube: string;
  postId: string; // WXR wp:post_id of the post this swap belongs to
  reason: string;
};

export const YOUTUBE_REPLACEMENTS: Record<string, YouTubeReplacement> = {
  // Post 1 — Man in the Mirror (Michael Jackson) — Al Karim
  BgpEg3tu01I: {
    newYouTube: "PivWY9wn5ps",
    postId: "1",
    reason: "Post 1 — Man in the Mirror, Michael Jackson — Al Karim",
  },

  // Post 3 — Hidden Place (Björk) — Al Batin
  // Two embeds in body: cpaK4CUhxJo, 3vEjKrP6tOs.
  // Brief says "Post 3 (Björk) had two videos embedded" and the
  // replacement is for "Hidden Place". Replace both: dedupe will
  // collapse them to one [youtube:54LQ_AO1gDI] in the final body.
  cpaK4CUhxJo: {
    newYouTube: "54LQ_AO1gDI",
    postId: "5",
    reason:
      'Post 3 — Hidden Place, Björk — Al Batin (Official "björk : hidden place (HD)")',
  },
  "3vEjKrP6tOs": {
    newYouTube: "54LQ_AO1gDI",
    postId: "5",
    reason: "Post 3 — Hidden Place, Björk — Al Batin (second embed)",
  },

  // Post 9 — Yny Maj Hyrynh (Marlui Miranda) — Al Badi
  // Two embeds, brief says "the same video embedded three times — only
  // need one". Two distinct IDs in the body though. Replace both.
  jKJo_IswPS0: {
    newYouTube: "ROzYz3HAfz0",
    postId: "11",
    reason:
      "Post 9 — Yny Maj Hyrynh, Marlui Miranda — Al Badi (exact track from IHU Todos os Sons)",
  },
  IWDiU4g5y0I: {
    newYouTube: "ROzYz3HAfz0",
    postId: "11",
    reason: "Post 9 — Yny Maj Hyrynh, Marlui Miranda — Al Badi (second embed)",
  },

  // Post 14 — Faraway (Demis Roussos) — Ar Rahman
  // Three embeds. Brief: replace headline with iKWL8viMjBM. The other
  // two are reference clips. Without a positive ID of which is which,
  // replace all three; dedupe to one will lose the reference variety.
  // Conservative call: only replace the broken ones if we know them.
  // The brief implies the original Demis Roussos embed was broken;
  // we'll replace all three since none are canonical.
  p20ay6Z2miE: {
    newYouTube: "iKWL8viMjBM",
    postId: "41",
    reason:
      "Post 14 — Faraway, Demis Roussos — Ar Rahman (Provided to YouTube by UMG)",
  },
  PB492naeXo4: {
    newYouTube: "iKWL8viMjBM",
    postId: "41",
    reason: "Post 14 — Faraway, Demis Roussos — Ar Rahman (second embed)",
  },
  vi6fWqnhyCw: {
    newYouTube: "iKWL8viMjBM",
    postId: "41",
    reason: "Post 14 — Faraway, Demis Roussos — Ar Rahman (third embed)",
  },

  // Post 16 — In God's House (Bat for Lashes) — Al Afuw
  // Two embeds: nhyjzHFbxcI (Noor Jahan, kept), PRBu6uZa5Hk (Bat for
  // Lashes, broken — replace).
  PRBu6uZa5Hk: {
    newYouTube: "XBjuJbvqm_Y",
    postId: "37",
    reason: "Post 16 — In God's House, Bat for Lashes — Al Afuw",
  },

  // Post 19 — Gold (Prince) — Al Majid
  // Three embeds (memorial set after Prince's death — region-blocked).
  // All three replaced with the official Prince Estate channel video.
  // Dedupe to one in the body.
  m8mg7CxAYUM: {
    newYouTube: "7IQE62Vn4_U",
    postId: "45",
    reason:
      "Post 19 — Gold, Prince — Al Majid (Official Prince Estate channel)",
  },
  "0XJz7vamkzk": {
    newYouTube: "7IQE62Vn4_U",
    postId: "45",
    reason: "Post 19 — Gold, Prince — Al Majid (second memorial embed)",
  },
  utRozVkd3g0: {
    newYouTube: "7IQE62Vn4_U",
    postId: "45",
    reason: "Post 19 — Gold, Prince — Al Majid (third memorial embed)",
  },

  // Post 32 — Ya Sen Ya Hiç (Bendeniz) — Al Hafiz
  O8yrt16hfgI: {
    newYouTube: "5gDZ5hWCZ7Y",
    postId: "69",
    reason:
      'Post 32 — Bendeniz, "Ya Sen Ya Hiç" — Al Hafiz (official video)',
  },

  // Post 34 — Sidi Mansour (Cheikha Rimitti) — Ya Darr
  // Two embeds, both replaced; dedupe to one.
  pCPB6WD87Yw: {
    newYouTube: "TLAnJaCawTA",
    postId: "21",
    reason: "Post 34 — Sidi Mansour, Cheikha Rimitti — Ya Darr",
  },
  fsAxnUuOhYo: {
    newYouTube: "TLAnJaCawTA",
    postId: "21",
    reason: "Post 34 — Sidi Mansour, Cheikha Rimitti — Ya Darr (second embed)",
  },

  // Post 36 — Miracle (Above & Beyond / OceanLab) — Al Alim
  // Two embeds, both replaced; dedupe to one.
  TGTWaUV6Z10: {
    newYouTube: "JsL9q3Pr4kw",
    postId: "25",
    reason: "Post 36 — Miracle, Above & Beyond OceanLab — Al Alim",
  },
  "-UsuVTRaglY": {
    newYouTube: "JsL9q3Pr4kw",
    postId: "25",
    reason: "Post 36 — Miracle, Above & Beyond OceanLab — Al Alim (second embed)",
  },

  // Post 38 — Nadia (Nitin Sawhney) — Al Muqsit
  // Three embeds: fko5v2Tewuk, wI2xQkjO4QA, 4jJJHfL1yQA. The brief
  // confirms ONE working: 4jJJHfL1yQA. The other two reference Prince
  // tangents flagged for narrative review. We do NOT auto-replace
  // them — narrativeReviewNeeded handles that.
  // (No entries here for Post 38; the working ID is already in body.)

  // Post 41 — Looking Through Patient Eyes (PM Dawn) — Al Sabur
  RPPvA3buNLU: {
    newYouTube: "k_0LHKxTy9g",
    postId: "81",
    reason: "Post 41 — Looking Through Patient Eyes, PM Dawn — Al Sabur",
  },

  // Post 49 — Disco Deewane (Nazia & Zoheb Hassan) — Al Basit
  mZqawa_lmSo: {
    newYouTube: "K797A36tjdo",
    postId: "93",
    reason: "Post 49 — Disco Deewane, Nazia & Zoheb Hassan — Al Basit",
  },
};

/**
 * Posts flagged for narrative review (content task, not technical):
 * Post 21 (Niyaz path) and Post 38 (Prince tangent). The migration
 * script does NOT auto-rewrite these — flag is editorial only.
 *
 * Keyed by `oldPostId`.
 */
export const NARRATIVE_REVIEW_POST_IDS = new Set<string>(["47", "83"]);
//                                                        ^^    ^^
//                                                        21    38   (oldPostId values)

/**
 * Per-post overrides that promote a NON-first body embed to the
 * headline `song.youtube` field. By default the migration uses the
 * first body embed as the headline; in a few posts the headline pairing
 * (per Naz's title) is at a different position.
 *
 * Keyed by `oldPostId`. Value is the canonical headline YouTube ID
 * AFTER all replacements have been applied.
 */
export const HEADLINE_OVERRIDES: Record<string, string> = {
  // Post 16 — headline pairing is "Chaadni Ratey - Noor Jahan", which
  // is the first body embed (`nhyjzHFbxcI`). Default first-embed pick
  // gives the right answer here, but we lock it explicitly.
  "37": "nhyjzHFbxcI",
};