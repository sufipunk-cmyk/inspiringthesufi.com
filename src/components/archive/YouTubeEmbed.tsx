/**
 * YouTubeEmbed — privacy-respecting (no-cookie host), lazy-loaded,
 * 16:9 player. Wrapped in a deep-tone alcove so the music sits inside
 * the same arch as everything else in the archive.
 */

import { Alcove } from "@/components/site/Ornaments";

export function YouTubeEmbed({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title?: string;
  className?: string;
}) {
  // youtube-nocookie is YouTube's own privacy-enhanced host: no
  // tracking cookies until the visitor actually presses play.
  const src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(
    videoId,
  )}?rel=0`;

  return (
    <div className={className}>
      <Alcove tone="deep" className="not-prose">
        <div
          className="relative w-full overflow-hidden rounded-sm"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={src}
            title={title ?? "Embedded YouTube video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </Alcove>
    </div>
  );
}