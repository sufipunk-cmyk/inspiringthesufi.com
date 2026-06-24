/**
 * Shared quiet rectangular panel used to frame any in-atmosphere form
 * (and its post-submit thank-you state).
 *
 * Deliberately *not* the Alcove component — the alcove's crown is
 * aspect-locked, and at typical form-container widths (max-w-xl ≈
 * 576 px) it renders as a ~400 px-tall empty lancet that dominates
 * the whole page. The alcove vocabulary belongs to the archive's
 * narrow index cards; on a form page the form itself is the active
 * door, and a flat parchment panel reads better.
 *
 * Originally lived inline inside PlayForm.tsx (M4); extracted here so
 * the per-post "leave a reflection" form can share the exact same
 * treatment without duplicating the markup.
 */

import type { ReactNode } from "react";

export function FormPanel({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "deep";
}) {
  const bg =
    tone === "deep" ? "bg-parchment-deep/55" : "bg-parchment-deep/30";
  return (
    <div
      className={`mx-auto max-w-xl rounded-sm border-[1.5px] border-hairline ${bg} px-6 py-7 sm:px-8 sm:py-9`}
    >
      {children}
    </div>
  );
}

export const inputClass =
  "mt-2 w-full rounded-sm border-[1.5px] border-hairline/70 bg-parchment-deep/40 px-3 py-2 font-serif text-base text-ink placeholder:italic placeholder:text-ink-soft/60 focus:border-bronze focus:outline-none focus:ring-2 focus:ring-bronze/30";

export const textareaClass = `${inputClass} resize-y leading-relaxed`;

export function Field({
  id,
  label,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-7 first:mt-0">
      <label
        htmlFor={id}
        className="block font-serif text-base italic text-ink-soft"
      >
        {label}
        {optional ? (
          <span className="ml-2 not-italic text-xs uppercase tracking-[0.2em] text-ink-soft/60">
            optional
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 font-serif text-sm italic text-red-900">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ToggleButton({
  active,
  onClick,
  disabled,
  children,
}: {
  active: boolean;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`min-w-[5.5rem] rounded-sm border-[1.5px] px-4 py-1.5 font-display text-base transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "border-bronze bg-bronze/15 text-green"
          : "border-hairline/70 bg-parchment-deep/30 text-ink-soft hover:border-bronze/60 hover:text-green"
      }`}
    >
      {children}
    </button>
  );
}

export function FormBanner({
  tone,
  children,
}: {
  tone: "warn" | "error";
  children: ReactNode;
}) {
  return (
    <div
      role="alert"
      className={`mb-6 rounded-sm border-l-2 px-4 py-3 font-serif text-sm leading-relaxed ${
        tone === "warn"
          ? "border-bronze bg-bronze/10 text-ink"
          : "border-red-700/70 bg-red-900/5 text-red-900"
      }`}
    >
      {children}
    </div>
  );
}
