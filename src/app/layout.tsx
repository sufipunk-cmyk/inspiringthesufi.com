import type { Metadata } from "next";
import { Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { SITE_URL } from "@/lib/seo/site";

/**
 * Brief: Cormorant Garamond + Amiri only.
 * Cormorant carries display *and* body — same family, different sizes
 * — so the archive reads as one voice on one page. The sufipunk.co.uk
 * sister site uses EB Garamond for body; ITS does not.
 */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

/**
 * Amiri carries the full set of Arabic presentation forms — including
 * U+FDFA, the ligature for "sallallahu alayhi wa sallam" (ﷺ) used
 * after the Prophet Muhammad's name. Cormorant does not include this
 * codepoint, so without a fallback the glyph renders as a tofu box.
 *
 * We expose this as a CSS variable and attach it as a tail fallback
 * in the global font stacks so it kicks in automatically for any
 * Arabic codepoint anywhere in the site, with no per-element markup
 * needed.
 */
const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

/**
 * Root metadata. Note there is intentionally NO `openGraph.images` array
 * declared here: Naz's M6 directive is an explicit per-page OG image
 * rather than one site-wide default. Each page (/, /about,
 * /play-with-me, /archive, and every /archive/[slug]) attaches its own
 * `openGraph.images` and `twitter.images`, and Next merges those with
 * the rest of this default block.
 *
 * `metadataBase` is sourced from `SITE_URL` so the canonical host is
 * single-source — change `NEXT_PUBLIC_SITE_URL` in one place and every
 * absolute URL on the site (sitemap, robots, OG, JSON-LD) follows.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Inspiring the Sufi — The Archive",
    template: "%s · Inspiring the Sufi",
  },
  description:
    "Fifty Names of Allah, surrounded by songs — the secular music that calls them out.",
  openGraph: {
    title: "Inspiring the Sufi — The Archive",
    description:
      "Fifty Names of Allah, surrounded by songs — the secular music that calls them out.",
    url: SITE_URL,
    siteName: "Inspiring the Sufi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiring the Sufi — The Archive",
    description:
      "Fifty Names of Allah, surrounded by songs — the secular music that calls them out.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${amiri.variable}`}
    >
      <body suppressHydrationWarning className="antialiased">
        <ClientBody>{children}</ClientBody>
      </body>
    </html>
  );
}
