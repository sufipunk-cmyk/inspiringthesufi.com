import Link from "next/link";

/**
 * SiteHeader — quiet, no clutter.
 *
 * M1 scope: wordmark + a single sister-door link back to sufipunk.co.uk.
 * No archive / about / play-with-me nav yet — those routes don't exist
 * on this site until later milestones, and stub-linking to non-existent
 * pages would land visitors on a 404 with no warning.
 *
 * The mosaic-door icon (left of the wordmark, mirroring the pattern on
 * the sufipunk sister site) is deliberately not present yet: it must be
 * traced from a real photo of the *green* mosaic door, not the gold one,
 * and that photo hasn't arrived in the project. The icon will land in
 * a follow-up milestone the moment the photo does.
 */
export function SiteHeader() {
  return (
    <header className="w-full border-b border-hairline/60 bg-parchment/80 backdrop-blur-[2px]">
      <div className="container flex flex-col items-center gap-3 py-5 sm:flex-row sm:items-end sm:justify-between sm:py-6">
        <Link
          href="/"
          className="inline-flex items-center font-display text-2xl tracking-tight text-green sm:text-[1.75rem]"
        >
          <span>Inspiring the Sufi</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-serif text-sm text-ink-soft sm:text-[0.95rem]"
        >
          <a
            href="https://sufipunk.co.uk"
            className="inline-flex items-center gap-1.5 text-green transition-colors hover:text-bronze"
          >
            <span aria-hidden="true">↶</span>
            <span>Sufi Punk</span>
          </a>
        </nav>
      </div>
    </header>
  );
}
