/**
 * /archive/[slug] — single archive post page.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ArchiveCommentList } from "@/components/archive/ArchiveCommentList";
import { ArchivePostBody } from "@/components/archive/ArchivePostBody";
import { ArchivePostHeader } from "@/components/archive/ArchivePostHeader";
import { ArchivePostNav } from "@/components/archive/ArchivePostNav";
import { FooterThreshold } from "@/components/archive/FooterThreshold";
import { YouTubeEmbed } from "@/components/archive/YouTubeEmbed";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { loadAllArchivePosts, loadArchivePost } from "@/lib/archive/loader";
import { isWanderMode } from "@/lib/archive/wander";
import type { WanderMode } from "@/lib/archive/types";

type Params = { slug: string };
type SearchParams = { from?: string | string[] };

export async function generateStaticParams() {
  return loadAllArchivePosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = loadArchivePost(slug);
  if (!post) return { title: "Not found — Inspiring the Sufi" };
  const description = [
    `${post.name.english}${post.secondName ? ` & ${post.secondName.english}` : ""} (${post.name.meaning}${post.secondName ? ` & ${post.secondName.meaning}` : ""})`,
    post.song.title || post.song.artist,
  ]
    .filter(Boolean)
    .join(" — ");
  return {
    title: `No. ${post.postNumber} · ${post.name.english} — Inspiring the Sufi`,
    description,
  };
}

export default async function ArchivePostPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const post = loadArchivePost(slug);
  if (!post) notFound();

  const allPosts = loadAllArchivePosts();
  const fromRaw = Array.isArray(sp.from) ? sp.from[0] : sp.from;
  const wander: WanderMode = isWanderMode(fromRaw) ? fromRaw : "order";

  const backHref =
    wander === "order" ? "/archive" : `/archive?wander=${wander}`;

  return (
    <>
      <SiteHeader />
      <main className="container py-16 sm:py-20">
        <ArchivePostHeader post={post} />

        <div className="divider-flower mt-10" aria-hidden="true">
          ❁
        </div>

        {post.song.youtube ? (
          <div className="mx-auto mt-10 max-w-2xl">
            <YouTubeEmbed
              videoId={post.song.youtube}
              title={`${post.song.title || post.song.artist} — ${post.name.english}`}
            />
          </div>
        ) : null}

        <div className="mt-12">
          <ArchivePostBody markdown={post.bodyMarkdown} />
        </div>

        {post.relatedMedia && post.relatedMedia.length > 0 ? (
          <section className="mx-auto mt-16 max-w-2xl">
            <h2 className="text-center font-display text-2xl text-green">
              Also referenced in this post
            </h2>
            <div className="divider-flower mt-3 mb-6" aria-hidden="true">
              ❁
            </div>
            <div className="space-y-8">
              {post.relatedMedia.map((m) =>
                m.youtube ? (
                  <div key={m.youtube}>
                    {m.label !== "Also referenced in this post" ? (
                      <p className="mb-3 text-center font-serif italic text-ink-soft">
                        {m.label}
                      </p>
                    ) : null}
                    <YouTubeEmbed videoId={m.youtube} title={m.label} />
                    {m.note ? (
                      <p className="mt-3 text-center font-serif text-sm italic text-ink-soft">
                        {m.note}
                      </p>
                    ) : null}
                  </div>
                ) : null,
              )}
            </div>
          </section>
        ) : null}

        <ArchiveCommentList comments={post.comments} />

        <ArchivePostNav current={post} allPosts={allPosts} wander={wander} />

        <p className="mt-16 text-center font-serif italic text-ink-soft">
          <Link
            href={backHref}
            className="text-green underline decoration-bronze/60 underline-offset-4 hover:text-bronze"
          >
            Step back into the archive.
          </Link>
        </p>
      </main>
      <FooterThreshold />
      <SiteFooter />
    </>
  );
}