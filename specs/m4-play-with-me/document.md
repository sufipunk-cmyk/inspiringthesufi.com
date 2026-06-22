# M4 — Play with me

> **Status: PLAN — implemented in this same milestone.** Naz's directive on 22 June 2026: build the active "Play with me" page, native to the site (no Google Form, no third-party iframe), backed by Formspree (or equivalent), with a conditional email field. Same discipline as M0–M3: spec → code → browser-test → tarball → stop for confirmation.

## Overview

`/play-with-me` is the **only active page** on the site. About is contemplative, the Archive is read-only — this page is where a visitor *does* something. The brief is precise about what that something is (master brief lines 442–490), and equally precise about what it must **not** become: it must not read as an invitation into Islam; it must stay a transferable practice anyone can do with whatever they already love.

This page is also research. What comes back through these submissions is what will eventually shape the Spiritual Underground section on `sufipunk.co.uk` — that section's content should not be pre-built; it should emerge from what people actually share here.

## Goals

1. Ship `/play-with-me` with the verbatim Physicians-of-the-Heart explanation Naz provided in chat (single source of truth) and the verbatim form fields and closing copy from the master brief.
2. Form is **native** to the site — same parchment ground, Cormorant Garamond, bronze accents, alcove vocabulary used quietly. Visitor never leaves the page to submit.
3. Submission goes to **Formspree** (or any equivalent lightweight email-forwarding service) via a server-side handler, so the form endpoint stays out of the client bundle and a honeypot anti-spam check can run server-side.
4. **Email field is conditional** on the "Would you like a response?" toggle: it appears, becomes required, and gets sent only when "yes" is selected.
5. Form has full UI state coverage: idle, validating, submitting, success, error. Error state explains what went wrong and offers retry. Success state replaces the form with a quiet thank-you panel — no spinner left ticking, no double-submit possible.
6. Server-side validation re-runs every check the client did, so a bypassed-JS submission can't write garbage into Naz's inbox.
7. Make the page reachable from the global header, and flip the M3 About-page closing line "Come sit with me." from plain italic to a real `Link` now that the route exists.

## Non-goals

- No Google Form. No `<iframe>` to any external service. No Disqus. No Typeform.
- No "thank-you for subscribing" newsletter framing. This is a quiet door, not a CRM.
- No CAPTCHA UI. We rely on Formspree's built-in spam handling + a local honeypot field. If spam ever becomes a real problem we'll add hCaptcha later, not in M4.
- No persistence of submissions in our own database. Formspree forwards to Naz's email; we don't store a copy.
- No Spiritual Underground content design based on assumed-shape submissions (master brief §462–467 is explicit on this).

## 1. Canonical text — locked verbatim

### 1.1 Heading + Physicians-of-the-Heart explanation
Naz's exact text in the M4 directive. Lives in `src/lib/play/text.ts` as named constants. Any future "tightening" of this is out of scope.

> There are as many ways to turn toward the Divine as there are people seeking. What's yours?
>
> This isn't an invitation to find your own way into the 99 Names of Allah. The Names are mine — the fixed point I happened to be given, the tradition I stand inside. For my own practice, I lean on **Physicians of the Heart** by Wali Ali Meyer, Bilal Hyde, Faisal Muqaddam, and Shabda Kahn for how I come to understand what each Name actually means.
>
> But the method underneath it travels further than the Names ever could. Take something you already love completely, without justifying it — a special interest, a fascination, an obsession, gaming, Gundam, gardening, anything — and let it sit next to whatever you hold sacred or significant in your own life. A faith tradition, maybe. Maybe not. Notice where they touch, if they do. The noticing is the practice. You don't need to have found the connection yet.
>
> You can see it already happening if you read through the archive's comments — people writing in from their own blogs, their own songs, their own reference points entirely, and finding they'd landed somewhere near mine. I never asked for that. It just kept happening, one comment at a time. This page is just a clearer door for it.

The phrase **"Physicians of the Heart"** is rendered as a link to <https://physiciansoftheheart.com> (target `_blank`, `rel="noreferrer"`).

### 1.2 Form fields — verbatim from master brief lines 471–479

| Key | Question (label, exactly) | Type | Required |
|---|---|---|---|
| `specialInterest` | What's your special interest, fascination, or obsession? (name it plainly, no need to justify it) | textarea | yes |
| `sacredFixedPoint` | What do you hold sacred, significant, or essential in your life? (a faith tradition, a value, a person, anything — whatever your own fixed point is) | textarea | yes |
| `noticedTouch` | Have you noticed them touch? If so, how? (a few sentences — and it's completely fine to say "I don't know yet" or "I'm not sure") | textarea | yes |
| `wantsResponse` | Would you like a response? | yes/no toggle | yes |
| `email` | Your email — only if you'd like a response | email | only if `wantsResponse === "yes"` |
| `aboutYou` | Anything else you'd like to share about yourself | textarea | optional |
| `_gotcha` | (honeypot — hidden from humans) | text | must stay empty |

Field order rendered on the page is exactly the order in the table above. The `email` field is **inserted between `wantsResponse` and `aboutYou`** when the toggle is "yes", with a small revealing transition; otherwise it is fully removed from the DOM (not just hidden by CSS) so screen readers don't announce it.

### 1.3 Closing copy — verbatim from master brief lines 481–485

Below the submit button, two lines:

1. *I read these when I can. There's no schedule, and nothing you send needs to be perfect — half-formed noticing counts.*
2. Small print: *This is an explorative project and a piece of research. I'm interested in how to develop and create spaces like this, and what you share helps shape that — I welcome ideas.*

These two strings are also locked in `src/lib/play/text.ts`.

---

## 2. Architecture

### 2.1 Files

```
src/
  app/
    play-with-me/
      page.tsx                 # server component — renders intro + <PlayForm/>
      actions.ts               # 'use server' — submitPlayForm Server Action
  components/
    play/
      PlayForm.tsx             # 'use client' — form, conditional email, states
  lib/
    play/
      text.ts                  # ABOUT-style typed module, verbatim copy
      validation.ts            # zod schema shared by client + server action
specs/
  m4-play-with-me/
    document.md                # this spec
scripts/
  check-play-with-me.ts        # lint
```

### 2.2 Submission flow

1. Visitor fills in the form. JS validates client-side using `validatePlaySubmission()` (zod).
2. On submit, the client component calls the **Server Action** `submitPlayForm(data)` from `src/app/play-with-me/actions.ts`.
3. The Server Action:
   - Re-runs the same zod validation server-side. Returns `{ status: "validation-error", fieldErrors }` if anything is bad.
   - Checks the honeypot field. If `_gotcha` is non-empty, returns a fake-success silently (so spambots think they got through). Nothing actually sent.
   - Reads `process.env.FORMSPREE_ENDPOINT` (the full URL, e.g. `https://formspree.io/f/abcdwxyz`). If it's missing in production, returns `{ status: "config-error" }`.
   - POSTs the validated payload to that endpoint as JSON, with `Accept: application/json` so Formspree responds with JSON not HTML.
   - On Formspree 2xx → returns `{ status: "ok" }`.
   - On Formspree non-2xx → returns `{ status: "send-error", message }`.
4. Client component switches into the matching state (`submitting → ok | send-error | validation-error | config-error`). Success state replaces the form with a thank-you panel; error states render an inline notice and let the visitor retry without losing their input.

### 2.3 Why a Server Action, not an API route

- The Formspree endpoint can stay in `process.env.FORMSPREE_ENDPOINT` and never appear in the client bundle.
- The honeypot check runs on the same machine as the email-forwarding call — no chance of a client-side bypass.
- Keeps the page module self-contained: page + action + form sit side-by-side in `src/app/play-with-me/`.
- M0 spec already locked in dynamic-route capability (`output: 'export'` deliberately not set). Server Actions are the Next 15 way.

### 2.4 Environment variable

| Var | Purpose | Required at runtime |
|---|---|---|
| `FORMSPREE_ENDPOINT` | Full URL of the Formspree (or compatible) JSON endpoint, e.g. `https://formspree.io/f/{form_id}` | Yes, in production. Page builds and renders without it; submission returns `config-error` until set. |

Documented in `README.md` and surfaced in `bun run check:play-with-me`. **Naz sets this on Vercel** — the agent never asks for it inside the sandbox.

### 2.5 Graceful "endpoint not configured" mode

If `FORMSPREE_ENDPOINT` is unset at runtime, the form still renders fully so Naz can review the UI on a preview deploy. The submission attempt returns `config-error` with the message *"Form backend isn't configured yet — set FORMSPREE_ENDPOINT on Vercel and redeploy. Your text will not be lost when you retry."* Everything you typed stays in the form fields.

## 3. Page layout

Top-to-bottom on `/play-with-me`:

1. `SiteHeader` (now includes a `Play with me` primary-nav link in the order *The Archive · About · Play with me · Sufi Punk*).
2. **Page header block**, max-width ≈ 36rem, centred:
   - Bronze, uppercase, tracking-[0.32em] overline: `Play with me`.
   - Cormorant Garamond H1 in green: the opening question — *There are as many ways to turn toward the Divine as there are people seeking. What's yours?* — rendered as a single Cormorant title (italic, smaller than archive H1s — this is a question, not a banner).
   - `❁` divider.
3. **Explanation block**, max-width ≈ 38rem, centred, font-serif at 1.1rem with generous leading. The four paragraphs of the Physicians-of-the-Heart text from §1.1, in order, verbatim. The phrase *Physicians of the Heart* in paragraph 2 is a real link to `https://physiciansoftheheart.com`.
4. A small `❁` divider — visual breath before the form starts.
5. **The form** — `<PlayForm />` client component, sits inside a tone="default" alcove (max-width ≈ 36rem) so it visually announces "this is the active part of the page" without becoming heavy. Field labels in font-serif, italic, ink-soft. Inputs in font-serif on parchment-deep, with bronze focus rings. Submit button is a single quiet bronze-bordered button reading *Send this to Naz*.
6. **Closing copy** below the form: the two lines from §1.3, the second in small italic.
7. `SiteFooter` — unchanged.

Mobile layout: same vertical sequence, same max-widths (which clamp safely on a 390px viewport), inputs at full container width, the "yes/no" toggle becomes two stacked radio-style buttons sized for thumb touch.

## 4. PlayForm states

| State | UI |
|---|---|
| `idle` | Empty fields (or whatever the visitor has typed). |
| `validating` | Inline error messages under offending fields; submit button stays enabled so they can fix and re-press. |
| `submitting` | Submit button disabled, label changes to *Sending…* |
| `ok` | Form is replaced inline by a quiet alcove holding the thank-you message + a "Send another" link. |
| `send-error` | Inline notice above the submit button explaining the failure and offering retry. Field values preserved. |
| `config-error` | Same as `send-error` but with the specific "form backend isn't configured yet" message from §2.5. |

The success message text:

> *Thank you. I'll read this when I can.*
>
> *Half-formed noticing counts.*

## 5. Validation rules

Implemented in `src/lib/play/validation.ts` as a `zod` schema, used by both client and server action:

- `specialInterest`: trimmed, 2–4000 chars
- `sacredFixedPoint`: trimmed, 2–4000 chars
- `noticedTouch`: trimmed, 2–4000 chars
- `wantsResponse`: literal `"yes" | "no"` (string-based, not boolean — Formspree dashboards display literal yes/no clearly to a non-technical reader)
- `email`: required + valid email iff `wantsResponse === "yes"`; **rejected entirely** if `wantsResponse === "no"` (so a visitor who typed an email then toggled No doesn't accidentally leak it)
- `aboutYou`: trimmed, 0–4000 chars, optional
- `_gotcha`: must be empty string

## 6. Edge cases / failure modes

| Case | Behaviour |
|---|---|
| Visitor toggles Yes → No after typing an email | The email field is removed from the DOM; the value is dropped from form state on the toggle event, so server never sees it. |
| Visitor toggles No → Yes after a failed submit | Email field re-appears empty; previous typed value (if any) is **not** restored — clean slate. |
| Submitting while still submitting | Submit button is `disabled` while `state === 'submitting'`, so a double-press is a no-op. |
| JavaScript disabled | Server Action still works via the form's standard POST behaviour (Next.js progressive enhancement). Conditional email reveal won't work; field stays visible by default. Acceptable graceful degradation. |
| Honeypot filled | Server returns `{ status: "ok" }` to the bot; no email sent. |
| Formspree returns 4xx with field errors | Mapped back to `validation-error` and displayed inline. |
| Formspree down (5xx) | `send-error` with the message *"Couldn't send right now. Please try again in a moment."* |
| `FORMSPREE_ENDPOINT` is set but malformed | Server action returns `config-error` after a one-line URL parse check. |
| Visitor pastes more than 4000 chars | Field hits maxLength locally, server-side zod also caps. |
| Empty payload (all blank) | Three `validation-error`s under the three required fields. |

## 7. Lint

`scripts/check-play-with-me.ts`:

- Asserts `PLAY_INTRO_PARAGRAPHS.length === 3` (the running-prose paragraphs after the heading; the opening question is held separately as `PLAY_INTRO_HEADING`).
- Asserts each paragraph is non-empty and ≥ 60 chars.
- Asserts the literal token `[PHYSICIANS_LINK]` appears in paragraph 1 (the render-time link marker; the spec text shows it as "Physicians of the Heart").
- Asserts the four author surnames (**Meyer, Hyde, Muqaddam, Kahn**) all appear in paragraph 1.
- Asserts the closing copy strings exactly match the locked text.
- Asserts `FORM_FIELD_LABELS` has 5 entries (the 5 visible fields excluding honeypot).
- Asserts the success message ends with *"Half-formed noticing counts."* — one of Naz's closing lines, used twice on the page intentionally (once before submit, once after).
- Reports whether `FORMSPREE_ENDPOINT` is set in the local env (informational only — its absence in dev is normal).

Run: `bun run check:play-with-me`.

## 8. Acceptance criteria

1. `/play-with-me` renders all four intro paragraphs **verbatim**, in order, with **Physicians of the Heart** linked.
2. The five form fields appear in the exact order, with the exact labels, from §1.2.
3. The email field is hidden until *Would you like a response?* is set to **Yes**, then it is visible and required. Toggling back to **No** removes it from the DOM.
4. Submitting fills `wantsResponse` as a literal `"yes"`/`"no"` so the email forwarded to Naz is human-readable.
5. With `FORMSPREE_ENDPOINT` set, a successful submit reaches Formspree and replaces the form with the thank-you panel.
6. Without `FORMSPREE_ENDPOINT`, submitting renders a clear *"Form backend isn't configured yet"* notice; entered text is preserved.
7. The honeypot blocks bot submissions silently.
8. Header nav order is *The Archive · About · Play with me · Sufi Punk*.
9. The About-page closing line *Come sit with me.* (M3) is now a real `Link` to `/play-with-me`, with the M3 toggle `COME_SIT_WITH_ME_LINKS_TO_PLAY` flipped to `true`.
10. Build is clean. `/play-with-me` is server-rendered (`ƒ`) so the Server Action can run; intro content is otherwise static.
11. Browser-tested at 1440×900 and 390×844, including: Yes/No toggle reveal, validation errors, success state.
12. No third-party iframes, no Google Form, no Disqus, no analytics widgets.

## 9. Test plan

Browser checks (per project standing discipline):

**Desktop 1440×900:**
1. `/play-with-me` direct URL — screenshot top (overline + question + start of paragraph 1).
2. Scroll to mid (paragraphs 2–3, with the Physicians link visible) — screenshot.
3. Scroll to form — screenshot the form in idle state with No selected, no email field.
4. Toggle Yes — screenshot showing the email field revealed.
5. Submit empty form — screenshot validation errors.
6. Fill in valid data with `FORMSPREE_ENDPOINT` unset — submit — screenshot the `config-error` state.
7. Header navigation: click *Play with me* from `/about` — confirm route change.

**Mobile 390×844:**
1. `/play-with-me` direct URL — screenshot top.
2. Scroll to form — confirm the Yes/No toggle is thumb-sized.
3. Toggle Yes — screenshot revealing the email field.
4. `document.documentElement.scrollWidth === clientWidth` (no horizontal overflow).

## 10. Open questions (drafted-for-approval, surfaced by the lint)

- **Submit button label.** Drafted as *Send this to Naz.* Approve, replace, or use something quieter (*Send.*, *Share with Naz.*, *Send across.*).
- **Page heading rendering.** Currently the question is rendered as a single italic Cormorant block at H1 size — not split, no kicker. Approve, or split into two lines?
- **Yes/No toggle visual.** Currently two parchment-deep buttons with a bronze ring on the active one (matches the alcove visual language). Approve, or prefer plain radio buttons in the body face?
- **Success-state offer.** Currently the post-submit panel offers a "Send another" link that resets the form. Approve, or end the conversation more decisively (no second-submit link, just the thank-you)?
- **Email field placeholder.** Drafted as *e.g. you@example.com.* Approve, replace, or remove placeholder altogether (label-only is sometimes calmer).

All five are agent decisions, not Naz's, so each carries an `// AWAITING NAZ'S APPROVAL` marker in source and is reported by `bun run check:play-with-me`.

## 11. Implementation notes

- The conditional email field is implemented by **conditional render**, not `display:none`. The DOM element is removed when `wantsResponse !== "yes"`.
- Form values are kept in a single `useState<PlaySubmission>()` object. The toggle handler resets `email` to `""` when switching away from Yes, so a stale value never gets sent on a later Yes toggle.
- The honeypot field uses `position:absolute; left:-9999px; height:0; opacity:0; pointer-events:none; tabindex={-1}; aria-hidden="true"` so neither sighted nor screen-reader visitors notice it.
- The page is a server component; it renders the intro statically and embeds `<PlayForm/>` (client component) for the interactive part.
- The Server Action returns a discriminated-union `PlayResult` so the client can `switch` on `result.status` exhaustively. No magic strings.

## 12. Status / open questions

- **Status:** PLAN, this same milestone implements it.
- **Naz-side configuration:** create a Formspree form (or equivalent) and add `FORMSPREE_ENDPOINT={url}` as a Vercel environment variable on the production environment.
- **Open questions:** §10 Q1–Q5, all flagged in source for review post-build.