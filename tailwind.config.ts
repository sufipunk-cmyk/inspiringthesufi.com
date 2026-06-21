import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Brief: Cormorant Garamond + Amiri only (no EB Garamond on this
        // sister site — the body face is Cormorant too, deliberately, to
        // give the archive an older / more bookish register).
        // Amiri is appended as a tail fallback so Arabic codepoints
        // (e.g. ﷺ U+FDFA) render correctly when Cormorant does not
        // include them.
        display: [
          "var(--font-cormorant)",
          "Georgia",
          "var(--font-amiri)",
          "serif",
        ],
        serif: [
          "var(--font-cormorant)",
          "Georgia",
          "var(--font-amiri)",
          "serif",
        ],
      },
      colors: {
        // ITS tokens — one or two notches deeper / more aged than the
        // sufipunk.co.uk palette. The accent is `bronze`, not `amber`,
        // deliberately: this site is keyed to a green mosaic door, not
        // the gold one, so the warm metal note is older copper, not
        // fresh leaf-gold.
        parchment: {
          DEFAULT: "hsl(var(--parchment))",
          deep: "hsl(var(--parchment-deep))",
        },
        ink: {
          DEFAULT: "hsl(var(--ink))",
          soft: "hsl(var(--ink-soft))",
        },
        green: {
          DEFAULT: "hsl(var(--green))",
          soft: "hsl(var(--green-soft))",
        },
        bronze: {
          DEFAULT: "hsl(var(--bronze))",
          soft: "hsl(var(--bronze-soft))",
        },
        hairline: "hsl(var(--hairline))",

        // shadcn aliases (kept so any shadcn component still works)
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1.25rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;