# M0 — Project bootstrap

## Overview

Initial scaffold for `inspiringthesufi.com`. Stop point: a clean `bun run build`, source documents committed, specs seeded, first checkpoint saved, tarball handed off. **No design or content work in this milestone.**

## Goals

- Stand up a Next.js 15 + Tailwind + shadcn project that mirrors `sufipunk-co-uk`'s stack 1:1.
- Pin in the M12 Vercel-clean config from day one so we don't repeat the standalone/distDir trap.
- Get the three source documents into the repo (not just the sandbox) so a future session crash can't lose them.
- Seed `specs/spec.md` and this M0 document with the three confirmed decisions and the seven corrected post titles already captured.
- Hand off a tarball; wait for user to push to GitHub from their own machine.

## Scope / non-goals

**In scope**
- Project init, dependency install
- Vercel-clean config patches
- `/source-docs` directory committed
- `/specs/spec.md` + `/specs/m0-bootstrap/document.md`
- First clean `bun run build`
- Save checkpoint
- Tarball + handoff summary

**Not in this milestone**
- No theming (no parchment palette, no arch components yet)
- No content loader
- No archive routes, no post pages
- No Formspree integration
- No header/footer styling beyond the template default
- No `git push` from inside the sandbox (deliberate — caused auth failures previously)

## Architecture rules applied at bootstrap

These come from sufipunk M12. Locking them in now prevents a repeat:

1. `next.config.js` does **not** set `output: 'standalone'`.
2. `next.config.js` does **not** override `distDir`.
3. **No `vercel.json`** in repo root.
4. `package.json` build script is `"prisma generate; next build"` (no `BUILD_DIR=…`).
5. CORS dev-mode headers and the image `remotePatterns` block carry over from the template — both are needed for Design Mode and remote image previews.

## Acceptance criteria

- [x] `/workspace/inspiringthesufi-com/next.config.js` matches sufipunk's M12 version (no standalone, no distDir).
- [x] `/workspace/inspiringthesufi-com/vercel.json` does not exist.
- [x] `/workspace/inspiringthesufi-com/package.json` build script has no `BUILD_DIR`.
- [x] `/workspace/inspiringthesufi-com/source-docs/ITS_Master_Brief.md` exists.
- [x] `/workspace/inspiringthesufi-com/source-docs/ITS_Replacement_Links.md` exists.
- [x] `/workspace/inspiringthesufi-com/source-docs/Squarespace-Wordpress-Export-06-16-2026.xml` exists.
- [x] `/workspace/inspiringthesufi-com/specs/spec.md` exists with 49-post fact, native-form decision, Physicians-of-the-Heart text, and seven corrected titles.
- [x] `/workspace/inspiringthesufi-com/specs/m0-bootstrap/document.md` exists (this file).
- [ ] `bun run build` completes with no errors.
- [ ] `save_checkpoint` succeeds.
- [ ] Tarball produced under `/workspace/inspiringthesufi-milestone-0-<timestamp>.tar.gz`.
- [ ] Handoff summary delivered. Stop. Wait for user.

## Test plan

- Visual: render the default scaffolded `/` page in the dev preview to confirm the server is running and Tailwind is wired.
- `bun run build` — must finish cleanly.
- `git status` inside the project dir — confirm `node_modules`, `.next`, `.next-build` are ignored.
- `git log` — confirm exactly one commit (the bootstrap commit), made by the local user identity.

## Implementation notes

- Used `fullstack_project_init` with `database: true, database_source: "default"` to mirror sufipunk's scaffold output exactly. The Neon/Prisma scaffold ships but is not wired into any route.
- Cleared `/workspace/.ii-app/web.json` (which was pinned to sufipunk-co-uk) to allow the new project to scaffold; original is backed up to `web.sufipunk.json.bak`.
- Source documents copied from `/workspace/uploads/` into `/source-docs/` and renamed (dropped the `_5` / `_3` version suffixes — the in-repo copies are now the canonical ones).

## Status / open questions

- **Status**: in progress — finishing build verification, checkpoint, and tarball.
- **Open**: nothing blocking. Waiting on the user to push to GitHub once handed off.