/**
 * Footer threshold — the door back to sufipunk.co.uk.
 *
 * The brief is precise: a cropped, faded detail of the golden-doors
 * map (NOT the full Final_map.png which only lives on sufipunk.co.uk),
 * laid behind an alcove holding the verbatim copy and a clear link out.
 *
 * The image lives at `/public/threshold/return-to-the-sanctuary.jpg`
 * (the golden-doors detail copied across from sufipunk.co.uk in M2,
 * the same `the-golden-door.jpg` that anchors the Sanctuary map page
 * — only used here cropped, faded, and behind a parchment scrim, so
 * it reads as a doorway, never as the full Final_map). If the asset
 * is missing for any reason, the alcove still renders cleanly on the
 * default parchment ground.
 */

import { Alcove } from "@/components/site/Ornaments";

const THRESHOLD_IMAGE = "/threshold/return-to-the-sanctuary.jpg";

export function FooterThreshold() {
  return (
    <section
      aria-labelledby="threshold-heading"
      className="relative mt-24 overflow-hidden border-t border-hairline/40 bg-parchment-deep/30 py-20 sm:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
        style={{ backgroundImage: `url('${THRESHOLD_IMAGE}')` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-parchment/40 via-parchment/10 to-parchment/85"
      />
      <div className="container relative">
        <div className="mx-auto max-w-md">
          <Alcove tone="deep">
            <h2
              id="threshold-heading"
              className="text-center font-display text-3xl text-green"
            >
              Return to the Sanctuary
            </h2>
            <p className="mt-4 text-center font-serif text-[1.05rem] italic text-ink-soft">
              Inspiring the Sufi is one part of the Spiritual Underground.
              Step back into the garden.
            </p>
            <p className="mt-5 text-center">
              <a
                href="https://sufipunk.co.uk"
                className="inline-flex items-center gap-1.5 font-display text-base text-green underline decoration-bronze/65 underline-offset-4 transition-colors hover:text-bronze"
              >
                <span aria-hidden="true">↶</span>
                <span>sufipunk.co.uk</span>
              </a>
            </p>
          </Alcove>
        </div>
      </div>
    </section>
  );
}