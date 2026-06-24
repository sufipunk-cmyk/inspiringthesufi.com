"use server";

/**
 * Server Action that handles a "leave a reflection" submission from
 * an archive post page.
 *
 * Deliberately reuses the *same* FORMSPREE_ENDPOINT env var as the
 * Play-with-me form (src/app/play-with-me/actions.ts) — no new Vercel
 * configuration is needed for this to work. The two are told apart in
 * Naz's inbox purely by the `_subject` line and the distinct field
 * set, in particular the post Name/number included in every email.
 *
 * This does not write the reflection anywhere visible on the site —
 * there's no database. It only emails Naz. The page copy says this
 * explicitly so nobody expects their words to appear live.
 */

import {
  flattenCommentZodIssues,
  CommentSubmissionSchema,
  type CommentFieldErrors,
  type CommentSubmission,
} from "@/lib/comment/validation";

export type CommentResult =
  | { status: "ok" }
  | { status: "validation-error"; fieldErrors: CommentFieldErrors }
  | { status: "send-error"; message: string }
  | { status: "config-error"; message: string };

const CONFIG_ERROR_MESSAGE =
  "Form backend isn't configured yet — set FORMSPREE_ENDPOINT on Vercel and redeploy. Your text will not be lost when you retry.";

const GENERIC_SEND_ERROR =
  "Couldn't send right now. Please try again in a moment.";

export async function submitCommentForm(
  raw: CommentSubmission,
): Promise<CommentResult> {
  // 1. Validate
  const parsed = CommentSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "validation-error",
      fieldErrors: flattenCommentZodIssues(parsed.error.issues),
    };
  }
  const data = parsed.data;

  // 2. Honeypot — silent success
  if (data._gotcha && data._gotcha.length > 0) {
    return { status: "ok" };
  }

  // 3. Endpoint configuration (same env var as Play-with-me)
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

  // 4. Human-readable payload, with the post clearly named so Naz
  //    doesn't have to dig to know what a reflection is about.
  const payload: Record<string, string> = {
    "On this entry": data.postLabel,
    "From": data.name && data.name.length > 0 ? data.name : "A reader",
    "Their reflection": data.reflection,
    "Would you like a response?": data.wantsResponse,
  };
  if (data.wantsResponse === "yes") {
    payload["email"] = data.email;
    payload["_replyto"] = data.email;
  }
  payload["_subject"] = `A reflection on ${data.postLabel}`;

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
      cache: "no-store",
    });
  } catch (err) {
    console.error("[archive-comment] network error contacting Formspree", err);
    return { status: "send-error", message: GENERIC_SEND_ERROR };
  }

  if (!response.ok) {
    let detail: string | null = null;
    try {
      const body = (await response.json()) as {
        error?: string;
        errors?: Array<{ message?: string }>;
      };
      detail = body.error ?? body.errors?.[0]?.message ?? null;
    } catch {
      detail = null;
    }
    console.error(
      `[archive-comment] Formspree replied ${response.status}: ${detail ?? "(no detail)"}`,
    );
    return {
      status: "send-error",
      message: detail ?? GENERIC_SEND_ERROR,
    };
  }

  return { status: "ok" };
}
