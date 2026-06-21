import type { Metadata } from "next";
import { Cormorant_Garamond, Amiri } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://inspiringthesufi.com"),
  title: {
    default: "Inspiring the Sufi — The Archive",
    template: "%s · Inspiring the Sufi",
  },
  description:
    "Forty-nine names, forty-nine songs — an archive pairing the 99 Names of Allah " +
    "with the secular music that calls them out.",
  openGraph: {
    title: "Inspiring the Sufi — The Archive",
    description:
      "Forty-nine names, forty-nine songs — an archive pairing the 99 Names of Allah " +
      "with the secular music that calls them out.",
    url: "https://inspiringthesufi.com",
    siteName: "Inspiring the Sufi",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inspiring the Sufi — The Archive",
    description:
      "Forty-nine names, forty-nine songs — an archive pairing the 99 Names of Allah " +
      "with the secular music that calls them out.",
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
