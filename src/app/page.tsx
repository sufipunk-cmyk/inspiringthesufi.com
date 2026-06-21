import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";

/**
 * M1 — visual foundation preview.
 *
 * This page is *not* the real homepage. It is a deliberate placeholder
 * that lets us see the palette, typography, header, and footer working
 * end-to-end in a live preview, without committing any actual page
 * content. The real homepage lands in a later milestone, after the
 * green-door mosaic-arch alcove component is in place and the archive
 * loader is wired up.
 */
export default function M1PreviewPage() {
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
            <a
              href="https://sufipunk.co.uk"
              className="ml-1"
            >
              sufipunk.co.uk
            </a>
            . The accent here is older copper, not leaf-gold; the body face
            is Cormorant Garamond throughout, by deliberate design, so that
            every entry reads as one piece, in one voice, on one old paper.
          </p>

          <p>
            The pointed-arch <em>alcove</em> that each archive entry will
            sit inside is being held back until a real photograph of the
            green mosaic door arrives — it is the silhouette traced from
            that photo, not an approximation of it, that will give the
            archive its true frame. Until then, the voice is here, the
            palette is here, and the doors are here.
          </p>

          <div className="divider-flower mt-12" aria-hidden="true">
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
