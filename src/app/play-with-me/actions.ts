"use server";

/**
 * Server Action that handles a Play-with-me submission.
 *
 * Flow:
 *   1. Re-validate the payload server-side using the shared zod schema.
 *      A JS-bypassed submission cannot skip this.
 *   2. Honeypot check: if `_gotcha` is non-empty, return a fake `ok`
 *      so the bot thinks it succeeded; nothing is forwarded.
 *   3. Look up FORMSPREE_ENDPOINT from process.env. If unset/malformed
 *      in production, return `config-error`.
 *   4. POST the validated payload to the endpoint as JSON, with
 *      `Accept: application/json` so the response is JSON not HTML.
 *   5. Map the result to a discriminated `PlayResult` union the client
 *      can switch on.
 */

import {
  flattenZodIssues,
  PlaySubmissionSchema,
  type PlayFieldErrors,
  type PlaySubmission,
} from "@/lib/play/validation";

export type PlayResult =
  | { status: "ok" }
  | { status: "validation-error"; fieldErrors: PlayFieldErrors }
  | { status: "send-error"; message: string }
  | { status: "config-error"; message: string };

const CONFIG_ERROR_MESSAGE =
  "Form backend isn't configured yet — set FORMSPREE_ENDPOINT on Vercel and redeploy. Your text will not be lost when you retry.";

const GENERIC_SEND_ERROR =
  "Couldn't send right now. Please try again in a moment.";

export async function submitPlayForm(
  raw: PlaySubmission,
): Promise<PlayResult> {
  // 1. Validate
  const parsed = PlaySubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "validation-error",
      fieldErrors: flattenZodIssues(parsed.error.issues),
    };
  }
  const data = parsed.data;

  // 2. Honeypot — silent success
  if (data._gotcha && data._gotcha.length > 0) {
    return { status: "ok" };
  }

  // 3. Endpoint configuration
  const endpoint = process.env.FORMSPREE_ENDPOINT?.trim();
  if (!endpoint) {
    return { status: "config-error", message: CONFIG_ERROR_MESSAGE };
  }
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(endpoint);
  } catch {
    return {
      status: "config-error",
      message:
        "FORMSPREE_ENDPOINT is set but doesn't parse as a URL. Check the value on Vercel.",
    };
  }
  if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
    return {
      status: "config-error",
      message: "FORMSPREE_ENDPOINT must be an http(s) URL.",
    };
  }

  // 4. Build a payload that's friendly to read in Formspree's dashboard.
  //    Field names are human-readable so the email Naz receives doesn't
  //    arrive as `specialInterest:` etc.
  const payload: Record<string, string> = {
    "Special interest, fascination, or obsession": data.specialInterest,
    "What you hold sacred, significant, or essential": data.sacredFixedPoint,
    "Have you noticed them touch?": data.noticedTouch,
    "Would you like a response?": data.wantsResponse,
    "Anything else you'd like to share": data.aboutYou ?? "",
  };
  if (data.wantsResponse === "yes") {
    payload["email"] = data.email; // Formspree uses _replyto / email — both work
    payload["_replyto"] = data.email;
  }
  payload["_subject"] = "Play with me — new submission";

  // 5. Send
  let response: Response;
  try {
    response = await fetch(parsedUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      // No-cache on the server; this is a one-shot mutation.
      cache: "no-store",
    });
  } catch (err) {
    console.error("[play-with-me] network error contacting Formspree", err);
    return { status: "send-error", message: GENERIC_SEND_ERROR };
  }

  if (!response.ok) {
    // Try to surface a more specific message if Formspree returned JSON.
    let detail: string | null = null;
    try {
      const body = (await response.json()) as { error?: string; errors?: Array<{ message?: string }> };
      detail = body.error ?? body.errors?.[0]?.message ?? null;
    } catch {
      detail = null;
    }
    console.error(
      `[play-with-me] Formspree replied ${response.status}: ${detail ?? "(no detail)"}`,
    );
    return {
      status: "send-error",
      message: detail ?? GENERIC_SEND_ERROR,
    };
  }

  return { status: "ok" };
}