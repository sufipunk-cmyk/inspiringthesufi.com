import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Alcove } from "@/components/site/Ornaments";

/**
 * M1 / M1.5 — visual foundation preview.
 *
 * This page is *not* the real homepage. It is a deliberate placeholder
 * that lets us see the palette, typography, header, footer, and the
 * traced Alcove arch working end-to-end in a live preview, without
 * committing any actual page content. The real homepage lands in a
 * later milestone, after the archive loader is wired up.
 *
 * The Alcove demo uses generic placeholder text (Lorem-style), not
 * pretend archive entries — the brief is explicit that no real Archive,
 * About, or Play-with-me content lands until M2+.
 */
export default function FoundationPreviewPage() {
  return (
    <>
      <SiteHeader />
      <main className="container py-20 sm:py-28">
        <div className="prose-archive">
          <p className="font-display text-sm uppercase tracking-[0.32em] text-bronze">
            The Archive
          </p>
          <h1 className="mt-3 font-display text-5xl leading-tight text-green sm:text-6xl">
            Inspiring the Sufi
          </h1>
          <p className="mt-4 font-display text-xl italic text-ink-soft sm:text-2xl">
            Forty-nine names. Forty-nine songs.
          </p>

          <div className="divider-flower mt-10" aria-hidden="true">
            ❁
          </div>

          <p className="mt-10">
            This is the visual foundation only — the deeper, aged parchment
            register that distinguishes this archive from its sister site,
            <a href="https://sufipunk.co.uk" className="ml-1">
              sufipunk.co.uk
            </a>
            . The accent here is older copper, not leaf-gold; the body face
            is Cormorant Garamond throughout, by deliberate design, so that
            every entry reads as one piece, in one voice, on one old paper.
          </p>

          <p>
            The pointed-arch <em>alcove</em> below is the frame each archive
            entry will eventually sit inside. Its silhouette is traced from
            a real photograph of the green mosaic door — not the gold one
            used on the sister site, and not an AI approximation. The same
            silhouette also carries the small door icon next to the
            wordmark up in the header.
          </p>
        </div>

        {/* M1.5 — Alcove demonstration. Generic placeholder text only;
            no pretend archive entry content. */}
        <div className="mt-16 sm:mt-20">
          <p className="text-center font-display text-xs uppercase tracking-[0.28em] text-ink-soft">
            Alcove — frame demo
          </p>
          <div className="mt-4 grid gap-8 sm:grid-cols-2 sm:gap-10">
            <Alcove tone="default">
              <p className="text-center font-display text-xs uppercase tracking-[0.24em] text-bronze">
                No. ___
              </p>
              <p className="mt-2 text-center font-display text-2xl italic text-green">
                Some Name will live here
              </p>
              <p className="mt-3 text-center font-serif text-sm text-ink-soft">
                A song, an artist, a place. Each archive entry sits inside
                an alcove like this one — the arch is the same in every
                size, so the archive reads as a continuous field of doors.
              </p>
            </Alcove>
            <Alcove tone="deep">
              <p className="text-center font-display text-xs uppercase tracking-[0.24em] text-bronze">
                No. ___
              </p>
              <p className="mt-2 text-center font-display text-2xl italic text-green">
                And another, side by side
              </p>
              <p className="mt-3 text-center font-serif text-sm text-ink-soft">
                The deeper tone variant — used sparingly for feature
                entries or for moments where the page needs a slightly
                more present niche.
              </p>
            </Alcove>
          </div>
        </div>

        <div className="prose-archive">
          <div className="divider-flower mt-16" aria-hidden="true">
            ❁
          </div>

          <p className="mt-12 font-serif text-sm italic text-ink-soft">
            The archive itself, the <em>About</em>, and the <em>Play with me</em> page
            arrive in the milestones to come.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}