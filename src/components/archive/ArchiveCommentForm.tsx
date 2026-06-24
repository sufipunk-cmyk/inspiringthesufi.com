"use client";

/**
 * ArchiveCommentForm — sits under the (read-only, migrated) comment
 * thread on every /archive/[slug] page.
 *
 * Same architecture as PlayForm (src/components/play/PlayForm.tsx):
 * client-side UI state, conditional email field, Server Action
 * delegation so the Formspree endpoint never reaches the client
 * bundle, honeypot. The two genuine differences:
 *
 *  1. Two hidden context fields — `postSlug` and `postLabel` — are
 *     set once from props and never edited, purely so the email Naz
 *     receives names the entry without her having to dig.
 *  2. This does not become a live comment on the page. There's no
 *     database backing the site, so "instant public comments" would
 *     need a much bigger rebuild. The intro line above the form says
 *     this plainly so nobody submits expecting to see it appear.
 */

import { useState, type FormEvent } from "react";
import { submitCommentForm, type CommentResult } from "@/lib/comment/actions";
import {
  FormPanel,
  Field,
  ToggleButton,
  FormBanner,
  inputClass,
  textareaClass,
} from "@/components/site/FormPanel";
import {
  COMMENT_FIELD_LABELS,
  COMMENT_INTRO_LINE,
  COMMENT_SECTION_HEADING_NO_THREAD,
  COMMENT_SECTION_HEADING_WITH_THREAD,
  COMMENT_SUBMIT_LABEL,
  COMMENT_SUCCESS_LINE_1,
  COMMENT_SUCCESS_LINE_2,
} from "@/lib/comment/text";
import {
  CommentSubmissionSchema,
  flattenCommentZodIssues,
  type CommentFieldErrors,
  type CommentSubmission,
} from "@/lib/comment/validation";

const EMAIL_PLACEHOLDER = "you@example.com";
const SEND_ANOTHER_LABEL = "Leave another";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "validation-error"; fieldErrors: CommentFieldErrors }
  | { kind: "send-error"; message: string }
  | { kind: "config-error"; message: string };

export function ArchiveCommentForm({
  postSlug,
  postLabel,
  hasExistingThread,
}: {
  postSlug: string;
  postLabel: string;
  hasExistingThread: boolean;
}) {
  const empty: CommentSubmission = {
    name: "",
    reflection: "",
    wantsResponse: "no",
    email: "",
    postSlug,
    postLabel,
    _gotcha: "",
  };

  const [data, setData] = useState<CommentSubmission>(empty);
  const [state, setState] = useState<FormState>({ kind: "idle" });

  function update<K extends keyof CommentSubmission>(
    key: K,
    value: CommentSubmission[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function setWantsResponse(v: "yes" | "no") {
    setData((prev) => ({
      ...prev,
      wantsResponse: v,
      email: v === "yes" ? prev.email : "",
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const parsed = CommentSubmissionSchema.safeParse(data);
    if (!parsed.success) {
      setState({
        kind: "validation-error",
        fieldErrors: flattenCommentZodIssues(parsed.error.issues),
      });
      return;
    }

    setState({ kind: "submitting" });
    const result: CommentResult = await submitCommentForm(data);
    switch (result.status) {
      case "ok":
        setState({ kind: "ok" });
        return;
      case "validation-error":
        setState({ kind: "validation-error", fieldErrors: result.fieldErrors });
        return;
      case "send-error":
        setState({ kind: "send-error", message: result.message });
        return;
      case "config-error":
        setState({ kind: "config-error", message: result.message });
        return;
    }
  }

  function reset() {
    setData(empty);
    setState({ kind: "idle" });
  }

  const heading = hasExistingThread
    ? COMMENT_SECTION_HEADING_WITH_THREAD
    : COMMENT_SECTION_HEADING_NO_THREAD;

  return (
    <section className="mx-auto mt-16 max-w-2xl">
      <h2 className="text-center font-display text-2xl text-green">
        {heading}
      </h2>
      <div className="divider-flower mt-3 mb-6" aria-hidden="true">
        ❁
      </div>
      <p className="mx-auto mb-8 max-w-xl text-center font-serif text-[0.95rem] italic leading-relaxed text-ink-soft">
        {COMMENT_INTRO_LINE}
      </p>

      {state.kind === "ok" ? (
        <FormPanel tone="deep">
          <div className="text-center">
            <p className="font-display text-2xl text-green sm:text-[1.7rem]">
              {COMMENT_SUCCESS_LINE_1}
            </p>
            <p className="mt-3 font-display text-xl italic text-bronze">
              {COMMENT_SUCCESS_LINE_2}
            </p>
            <p className="mt-6">
              <button
                type="button"
                onClick={reset}
                className="font-serif text-sm italic text-ink-soft underline decoration-bronze/50 underline-offset-4 transition-colors hover:text-bronze"
              >
                {SEND_ANOTHER_LABEL}
              </button>
            </p>
          </div>
        </FormPanel>
      ) : (
        <CommentFormBody
          data={data}
          state={state}
          update={update}
          setWantsResponse={setWantsResponse}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
}

function CommentFormBody({
  data,
  state,
  update,
  setWantsResponse,
  onSubmit,
}: {
  data: CommentSubmission;
  state: FormState;
  update: <K extends keyof CommentSubmission>(
    key: K,
    value: CommentSubmission[K],
  ) => void;
  setWantsResponse: (v: "yes" | "no") => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const fieldError =
    state.kind === "validation-error" ? state.fieldErrors : undefined;
  const submitting = state.kind === "submitting";
  const banner =
    state.kind === "send-error" || state.kind === "config-error"
      ? state.message
      : null;
  const bannerTone = state.kind === "config-error" ? "warn" : "error";

  return (
    <FormPanel tone="default">
      <form noValidate onSubmit={onSubmit}>
        {banner ? <FormBanner tone={bannerTone}>{banner}</FormBanner> : null}

        <Field
          id="name"
          label={COMMENT_FIELD_LABELS.name}
          optional
          error={fieldError?.name}
        >
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Leave blank to stay anonymous"
            value={data.name ?? ""}
            onChange={(e) => update("name", e.target.value)}
            maxLength={120}
            className={inputClass}
            disabled={submitting}
          />
        </Field>

        <Field
          id="reflection"
          label={COMMENT_FIELD_LABELS.reflection}
          error={fieldError?.reflection}
        >
          <textarea
            id="reflection"
            name="reflection"
            rows={4}
            value={data.reflection}
            onChange={(e) => update("reflection", e.target.value)}
            maxLength={4000}
            className={textareaClass}
            disabled={submitting}
          />
        </Field>

        <fieldset
          className="mt-7"
          aria-describedby={
            fieldError?.wantsResponse ? "comment-wantsResponse-error" : undefined
          }
        >
          <legend className="block font-serif text-base italic text-ink-soft">
            {COMMENT_FIELD_LABELS.wantsResponse}
          </legend>
          <div className="mt-3 inline-flex gap-2">
            <ToggleButton
              active={data.wantsResponse === "no"}
              onClick={() => setWantsResponse("no")}
              disabled={submitting}
            >
              No
            </ToggleButton>
            <ToggleButton
              active={data.wantsResponse === "yes"}
              onClick={() => setWantsResponse("yes")}
              disabled={submitting}
            >
              Yes
            </ToggleButton>
          </div>
          {fieldError?.wantsResponse ? (
            <p
              id="comment-wantsResponse-error"
              className="mt-2 font-serif text-sm italic text-red-900"
            >
              {fieldError.wantsResponse}
            </p>
          ) : null}
        </fieldset>

        {data.wantsResponse === "yes" ? (
          <Field
            id="email"
            label={COMMENT_FIELD_LABELS.email}
            error={fieldError?.email}
          >
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder={EMAIL_PLACEHOLDER}
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              className={inputClass}
              disabled={submitting}
            />
          </Field>
        ) : null}

        {/* Honeypot — visually hidden, off the keyboard tab order. */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "-9999px",
            height: 0,
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <label htmlFor="comment-_gotcha">Leave this field empty.</label>
          <input
            id="comment-_gotcha"
            name="_gotcha"
            type="text"
            tabIndex={-1}
            value={data._gotcha}
            onChange={(e) => update("_gotcha", e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="mt-8 text-center">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-sm border-[1.5px] border-bronze bg-parchment px-6 py-2.5 font-display text-base text-green transition-colors hover:bg-bronze/10 hover:text-bronze disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending…" : COMMENT_SUBMIT_LABEL}
          </button>
        </div>
      </form>
    </FormPanel>
  );
}
