/**
 * Shared validation schema for the Play-with-me form.
 *
 * Used both by the client component (for inline error display) and by
 * the Server Action (so a JS-bypass submission can't write garbage).
 */

import { z } from "zod";

const TEXTAREA = z
  .string()
  .trim()
  .min(2, "A few words, even if you're not sure.")
  .max(4000, "Please keep this under 4,000 characters.");

const OPTIONAL_TEXTAREA = z
  .string()
  .trim()
  .max(4000, "Please keep this under 4,000 characters.")
  .optional()
  .default("");

const EMAIL = z
  .string()
  .trim()
  .email("That doesn't look like a valid email address.");

/**
 * The full submission schema.
 *
 * `email` is enforced *only* when wantsResponse === "yes". When
 * wantsResponse === "no", any submitted email is dropped (set to "")
 * by `.transform()` so a stale value never reaches Naz's inbox.
 *
 * `_gotcha` is the honeypot field. The schema requires it be empty;
 * the Server Action treats a non-empty value as a silent "ok".
 */
export const PlaySubmissionSchema = z
  .object({
    specialInterest: TEXTAREA,
    sacredFixedPoint: TEXTAREA,
    noticedTouch: TEXTAREA,
    wantsResponse: z.enum(["yes", "no"], {
      message: "Please choose yes or no.",
    }),
    email: z.string().trim().optional().default(""),
    aboutYou: OPTIONAL_TEXTAREA,
    _gotcha: z
      .string()
      .max(0, "This field should be empty.")
      .optional()
      .default(""),
  })
  .superRefine((data, ctx) => {
    if (data.wantsResponse === "yes") {
      const result = EMAIL.safeParse(data.email);
      if (!result.success) {
        ctx.addIssue({
          code: "custom",
          path: ["email"],
          message:
            data.email.length === 0
              ? "We'll need an email if you'd like a reply."
              : result.error.issues[0]?.message ??
                "That doesn't look like a valid email.",
        });
      }
    }
  })
  .transform((data) => {
    // Drop any stray email if the visitor toggled No.
    if (data.wantsResponse === "no") {
      return { ...data, email: "" };
    }
    return data;
  });

export type PlaySubmission = z.input<typeof PlaySubmissionSchema>;
export type ValidatedPlaySubmission = z.output<typeof PlaySubmissionSchema>;

/** Field-error map keyed by field name. */
export type PlayFieldErrors = Partial<Record<keyof PlaySubmission, string>>;

export function flattenZodIssues(
  issues: z.ZodIssue[],
): PlayFieldErrors {
  const out: PlayFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key as keyof PlaySubmission] = issue.message;
    }
  }
  return out;
}