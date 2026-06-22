import Link from "next/link";
import { MosaicDoorIcon } from "@/components/site/Ornaments";

/**
 * SiteHeader — quiet, no clutter.
 *
 * The mosaic-door icon (M1.5) sits immediately to the left of the
 * "Inspiring the Sufi" wordmark — small, roughly text-height,
 * green-on-parchment. Its silhouette is traced from the same green
 * mosaic door photograph as the Alcove component, so the door icon
 * here and the alcove frame around each archive entry are the same
 * arch in two sizes. Anyone reading both code and content will see
 * the relationship.
 *
 * Sister-door link to sufipunk.co.uk lives in the right-hand slot.
 * No archive / about / play-with-me links yet — those routes don't
 * exist in M1.5, and stub-linking would silently 404 visitors.
 */
export function SiteHeader() {
  return (
    <header className="w-full border-b border-hairline/60 bg-parchment/80 backdrop-blur-[2px]">
      <div className="container flex flex-col items-center gap-3 py-5 sm:flex-row sm:items-end sm:justify-between sm:py-6">
        <Link
          href="/"
          className="inline-flex items-center font-display text-2xl tracking-tight text-green sm:text-[1.75rem]"
        >
          <MosaicDoorIcon className="mr-2.5 h-7 w-auto sm:h-8" />
          <span>Inspiring the Sufi</span>
        </Link>
        <nav
          aria-label="Primary"
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-serif text-sm text-ink-soft sm:text-[0.95rem]"
        >
          <Link
            href="/archive"
            className="text-green transition-colors hover:text-bronze"
          >
            The Archive
          </Link>
          <Link
            href="/about"
            className="text-green transition-colors hover:text-bronze"
          >
            About
          </Link>
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