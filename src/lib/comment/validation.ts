/**
 * Shared validation schema for the "leave a reflection" form that sits
 * under each archive post's (read-only, migrated) comment thread.
 *
 * Mirrors the Play-with-me pattern exactly (src/lib/play/validation.ts)
 * — same shape of rules, same superRefine for the conditional email,
 * same honeypot. Used by both the client component (inline errors) and
 * the Server Action (so a JS-bypassed submission can't write garbage).
 */

import { z } from "zod";

const REFLECTION = z
  .string()
  .trim()
  .min(2, "A few words, even half-formed, is enough.")
  .max(4000, "Please keep this under 4,000 characters.");

const NAME = z
  .string()
  .trim()
  .max(120, "That's a bit long for a name.")
  .optional()
  .default("");

const EMAIL = z
  .string()
  .trim()
  .email("That doesn't look like a valid email address.");

/**
 * `postSlug` / `postLabel` are not user input — they're set once from
 * the page's own data when the form mounts (see ArchiveCommentForm)
 * and travel through state unedited, purely so the Server Action and
 * the email payload know which entry the reflection belongs to.
 */
export const CommentSubmissionSchema = z
  .object({
    name: NAME,
    reflection: REFLECTION,
    wantsResponse: z.enum(["yes", "no"], {
      message: "Please choose yes or no.",
    }),
    email: z.string().trim().optional().default(""),
    postSlug: z.string().min(1),
    postLabel: z.string().min(1),
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

export type CommentSubmission = z.input<typeof CommentSubmissionSchema>;
export type ValidatedCommentSubmission = z.output<
  typeof CommentSubmissionSchema
>;

export type CommentFieldErrors = Partial<
  Record<keyof CommentSubmission, string>
>;

export function flattenCommentZodIssues(
  issues: z.ZodIssue[],
): CommentFieldErrors {
  const out: CommentFieldErrors = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !(key in out)) {
      out[key as keyof CommentSubmission] = issue.message;
    }
  }
  return out;
}
