"use client";

/**
 * PlayForm — the active part of /play-with-me.
 *
 * Handles UI state (idle / submitting / ok / errors), conditional email
 * field, and a hidden honeypot. Submission is delegated to the Server
 * Action `submitPlayForm` from `../../app/play-with-me/actions.ts` so
 * the Formspree endpoint stays out of the client bundle.
 *
 * The conditional email field is *conditionally rendered* (not hidden
 * by CSS) so screen readers don't announce a phantom field when it
 * isn't applicable, and so the value is structurally absent from form
 * state when wantsResponse !== "yes".
 *
 * Submit-button label, email placeholder, success-state link, and the
 * Yes/No toggle visual were all confirmed by Naz post-M4.
 */

import { useState, type FormEvent } from "react";
import { submitPlayForm, type PlayResult } from "@/app/play-with-me/actions";
import {
  FormPanel,
  Field,
  ToggleButton,
  FormBanner,
  inputClass,
  textareaClass,
} from "@/components/site/FormPanel";
import {
  PLAY_FIELD_LABELS,
  PLAY_SUCCESS_LINE_1,
  PLAY_SUCCESS_LINE_2,
} from "@/lib/play/text";
import {
  PlaySubmissionSchema,
  flattenZodIssues,
  type PlayFieldErrors,
  type PlaySubmission,
} from "@/lib/play/validation";

const EMPTY: PlaySubmission = {
  specialInterest: "",
  sacredFixedPoint: "",
  noticedTouch: "",
  wantsResponse: "no",
  email: "",
  aboutYou: "",
  _gotcha: "",
};

// Confirmed by Naz post-M4. Label updated to "Sufi Punk" per Naz's
// June 2026 site-live feedback round.
const SUBMIT_LABEL = "Send this to Sufi Punk";
const EMAIL_PLACEHOLDER = "you@example.com";
const SEND_ANOTHER_LABEL = "Send another";

type FormState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "ok" }
  | { kind: "validation-error"; fieldErrors: PlayFieldErrors }
  | { kind: "send-error"; message: string }
  | { kind: "config-error"; message: string };

export function PlayForm() {
  const [data, setData] = useState<PlaySubmission>(EMPTY);
  const [state, setState] = useState<FormState>({ kind: "idle" });

  function update<K extends keyof PlaySubmission>(
    key: K,
    value: PlaySubmission[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function setWantsResponse(v: "yes" | "no") {
    setData((prev) => ({
      ...prev,
      wantsResponse: v,
      // Clean slate on toggle — never carry a stale email forward.
      email: v === "yes" ? prev.email : "",
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state.kind === "submitting") return;

    const parsed = PlaySubmissionSchema.safeParse(data);
    if (!parsed.success) {
      setState({
        kind: "validation-error",
        fieldErrors: flattenZodIssues(parsed.error.issues),
      });
      return;
    }

    setState({ kind: "submitting" });
    const result: PlayResult = await submitPlayForm(data);
    switch (result.status) {
      case "ok":
        setState({ kind: "ok" });
        return;
      case "validation-error":
        setState({
          kind: "validation-error",
          fieldErrors: result.fieldErrors,
        });
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
    setData(EMPTY);
    setState({ kind: "idle" });
  }

  if (state.kind === "ok") {
    return (
      <FormPanel tone="deep">
        <div className="text-center">
          <p className="font-display text-2xl text-green sm:text-[1.7rem]">
            {PLAY_SUCCESS_LINE_1}
          </p>
          <p className="mt-3 font-display text-xl italic text-bronze">
            {PLAY_SUCCESS_LINE_2}
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
    );
  }

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
      <form noValidate onSubmit={handleSubmit}>
        {banner ? <FormBanner tone={bannerTone}>{banner}</FormBanner> : null}

        <Field
          id="specialInterest"
          label={PLAY_FIELD_LABELS.specialInterest}
          error={fieldError?.specialInterest}
        >
          <textarea
            id="specialInterest"
            name="specialInterest"
            rows={3}
            value={data.specialInterest}
            onChange={(e) => update("specialInterest", e.target.value)}
            maxLength={4000}
            className={textareaClass}
            disabled={submitting}
          />
        </Field>

        <Field
          id="sacredFixedPoint"
          label={PLAY_FIELD_LABELS.sacredFixedPoint}
          error={fieldError?.sacredFixedPoint}
        >
          <textarea
            id="sacredFixedPoint"
            name="sacredFixedPoint"
            rows={3}
            value={data.sacredFixedPoint}
            onChange={(e) => update("sacredFixedPoint", e.target.value)}
            maxLength={4000}
            className={textareaClass}
            disabled={submitting}
          />
        </Field>

        <Field
          id="noticedTouch"
          label={PLAY_FIELD_LABELS.noticedTouch}
          error={fieldError?.noticedTouch}
        >
          <textarea
            id="noticedTouch"
            name="noticedTouch"
            rows={4}
            value={data.noticedTouch}
            onChange={(e) => update("noticedTouch", e.target.value)}
            maxLength={4000}
            className={textareaClass}
            disabled={submitting}
          />
        </Field>

        {/* Yes/No toggle */}
        <fieldset
          className="mt-7"
          aria-describedby={
            fieldError?.wantsResponse ? "wantsResponse-error" : undefined
          }
        >
          <legend className="block font-serif text-base italic text-ink-soft">
            {PLAY_FIELD_LABELS.wantsResponse}
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
              id="wantsResponse-error"
              className="mt-2 font-serif text-sm italic text-red-900"
            >
              {fieldError.wantsResponse}
            </p>
          ) : null}
        </fieldset>

        {/* Conditional email field */}
        {data.wantsResponse === "yes" ? (
          <Field
            id="email"
            label={PLAY_FIELD_LABELS.email}
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

        <Field
          id="aboutYou"
          label={PLAY_FIELD_LABELS.aboutYou}
          optional
          error={fieldError?.aboutYou}
        >
          <textarea
            id="aboutYou"
            name="aboutYou"
            rows={3}
            value={data.aboutYou ?? ""}
            onChange={(e) => update("aboutYou", e.target.value)}
            maxLength={4000}
            className={textareaClass}
            disabled={submitting}
          />
        </Field>

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
          <label htmlFor="_gotcha">Leave this field empty.</label>
          <input
            id="_gotcha"
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
            {submitting ? "Sending…" : SUBMIT_LABEL}
          </button>
        </div>
      </form>
    </FormPanel>
  );
}