import { splitPostBody } from "@/lib/archive/body-render";
import { YouTubeEmbed } from "@/components/archive/YouTubeEmbed";

export function ArchivePostBody({ markdown }: { markdown: string }) {
  const chunks = splitPostBody(markdown);
  return (
    <div className="archive-prose mx-auto max-w-2xl">
      {chunks.map((c, i) =>
        c.kind === "html" ? (
          // eslint-disable-next-line react/no-danger -- migrated archive content from our own WXR
          <div key={i} dangerouslySetInnerHTML={{ __html: c.html }} />
        ) : (
          <div key={i} className="my-8">
            <YouTubeEmbed videoId={c.videoId} />
          </div>
        ),
      )}
    </div>
  );
}