import Link from "next/link";

/**
 * SiteFooter — quiet, three columns, with a clear sister-door link
 * back to sufipunk.co.uk. The voice ("the sister door") is deliberate:
 * the two sites are siblings, not parent/child, and the door metaphor
 * is the visual lingua franca that runs through both.
 *
 * M2 scope: the Archive column now points at /archive and surfaces
 * the three Wander modes. About + Play with me will fill in their
 * own column entries as later milestones come online.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-hairline/60 bg-parchment-deep/40">
      <div className="container py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display text-2xl text-green">
              Inspiring the Sufi
            </p>
            <p className="mt-2 font-serif text-[0.95rem] italic text-ink-soft">
              Forty-nine names. Forty-nine songs.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-ink-soft">
              The Archive
            </h4>
            <ul className="mt-3 space-y-1.5 font-serif text-[0.95rem]">
              <li>
                <Link
                  href="/archive"
                  className="text-green hover:text-bronze"
                >
                  All forty-nine
                </Link>
              </li>
              <li>
                <Link
                  href="/archive?wander=names"
                  className="text-green hover:text-bronze"
                >
                  By the names of Allah
                </Link>
              </li>
              <li>
                <Link
                  href="/archive?wander=music"
                  className="text-green hover:text-bronze"
                >
                  By the music
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm uppercase tracking-[0.2em] text-ink-soft">
              Elsewhere
            </h4>
            <ul className="mt-3 space-y-1.5 font-serif text-[0.95rem]">
              <li>
                <a
                  href="https://sufipunk.co.uk"
                  className="inline-flex items-center gap-1.5 text-green hover:text-bronze"
                >
                  <span aria-hidden="true">↶</span>
                  <span>The sister door — Sufi Punk</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:sufipunk@icloud.com"
                  className="text-green hover:text-bronze"
                >
                  sufipunk@icloud.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-hairline/60 pt-6 text-center font-serif text-xs text-ink-soft">
          <p className="italic">
            The Names are mine. The method travels further.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Inspiring the Sufi. All writing is the author&apos;s own.
          </p>
        </div>
      </div>
    </footer>
  );
}
