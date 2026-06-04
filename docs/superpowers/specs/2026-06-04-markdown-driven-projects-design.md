# Markdown-Driven Projects — Design

Date: 2026-06-04
Status: Approved (pending spec review)

## Context & Motivation

Projects, off-work projects, and achievements are currently authored as large
TypeScript objects in `src/content/projects.ts`, `off-work-projects.ts`, and
`achievements.ts`. Adding or editing one is ineffective because:

- **Markdown lives in TS template literals** — backtick/`${}` escaping, indentation
  pain, no markdown editing or preview.
- **Manual page bookkeeping** — `pageNumber` is hand-set yet ignored at render
  (ScrapbookView uses the array index), and `subContent` re-describes pages by hand
  ("Page 2: …"), which drifts out of sync.
- **Boilerplate + registration** — each project is a verbose object that must also be
  wired into an exported record.
- **Image hosting** — images are uploaded to Cloudinary by hand and referenced via long
  transform URLs interpolating `DEFAULT_IMAGE_WIDTH/HEIGHT`.

**Goal:** authoring a project becomes "drop a markdown file with frontmatter; reference
images by a short key." Pages and captions are derived; no registration; clear errors on
malformed input. The retro paginated Scrapbook UX is preserved.

## Decisions (from brainstorming)

1. **One markdown file per project**, auto-discovered via Vite glob (no registration).
2. **Keep the paginated Scrapbook**; derive pages from content (intro body + one page per
   media item) — eliminates `pageNumber`/`subContent`.
3. **Images on Cloudflare R2**, served via a custom domain; frontmatter references a short
   key, a helper builds the URL. Absolute URLs pass through unchanged (so existing
   Cloudinary URLs and YouTube embeds keep working with no re-upload).
4. Applies to **projects, off-work projects, and achievements** (all three retire the TS
   format).

## Non-goals

- `about-me.ts` (`resume`, `aboutMe`) — rendered by MarkdownView, not Scrapbook. Untouched.
- On-the-fly image resizing (Cloudflare Image Resizing). Images are pre-sized before
  upload. Can be added later via the asset resolver without touching content.
- A hosted CMS / admin UI. Content stays in-repo and git-versioned.
- Migrating existing images off Cloudinary onto R2 — the resolver passes absolute URLs
  through, so this can happen later, lazily, per image.

## Design

### File layout

```
src/content/
  projects/<id>.md
  off-work-projects/<id>.md
  achievements/<id>.md
```

The filename stem is the project id (e.g. `cheater-encoder.md` → id `cheater-encoder`),
replacing the record keys used today. The id flows into `useFileStore` as the file node id
exactly as before.

### Frontmatter schema

```markdown
---
title: Cheater Encoder
oneLiner: Mock manifest generator
links:
  - { name: GitHub, url: https://github.com/diao1v/cheater-encoder }
media:
  - { src: cheater-encoder/shot-1.png, caption: Dashboard }
  - { src: https://www.youtube.com/embed/abc, caption: Demo }   # type inferred: video
notes:
  - Still under construction
---
# Cheater Encoder

The **Cheater Encoder** is …   ← markdown body = the intro page
```

Field semantics:
- `title` (string, required) — folder/window title and file-tree label.
- `oneLiner` (string, required) — shown on the intro page's info bar.
- `links` (array of `{name, url}`, optional) — pinned in the info bar on every page.
- `media` (array, optional) — each item `{ src, caption?, type? }`. `src` is an R2 key or
  an absolute URL. `type` is `'photo' | 'video'`; if omitted it's inferred from the URL
  (contains `youtube`/`youtu.be`/`vimeo`/`embed` → `video`, otherwise `photo`).
- `notes` (array of strings, optional) — extra info-bar lines on the intro page (replaces
  the non-caption uses of the old `subContent`).
- Markdown **body** (after frontmatter) — the intro page content.

### In-memory model

The loader produces this shape (replaces the old `pages[]`-based `Project`):

```ts
interface MediaItem { type: 'photo' | 'video'; src: string; caption?: string }
export interface Project {
  title: string;
  oneLiner: string;
  links?: { name: string; url: string }[];
  body: string;          // intro markdown
  media: MediaItem[];
  notes?: string[];
}
```

`content.projects` / `content.offWorkProjects` / `content.achievements` remain
`Record<id, Project>`, so `useFileStore.createFileStructure` is unchanged.

### Loader

`src/content/loadCollection.ts` — a generic function used by all three categories:

```ts
// pseudo
loadCollection(globResult): Record<string, Project>
```

- Caller passes `import.meta.glob('./projects/*.md', { query: '?raw', eager: true, import: 'default' })`.
- For each entry: derive id from the path's filename stem; split frontmatter from body
  (leading `---\n…\n---\n`); parse the header with `js-yaml`; validate the parsed object +
  body against a **zod** schema; build the `Project` (infer media `type` where missing).
- On validation failure, throw an `Error` naming the file and the zod issue — surfaces
  immediately in the Vite dev overlay.
- `src/content/index.ts` calls `loadCollection` for the three globs and assembles the
  existing `content` object. `getContentForFile` (resume/aboutMe) is untouched.

### Asset resolver

`src/utils/resolveAssetUrl.ts` (exported via the `@/utils` barrel):

```ts
resolveAssetUrl(src: string): string
// absolute (^https?://) → returned unchanged
// otherwise            → `${import.meta.env.VITE_ASSET_BASE}/${src}` (no double slashes)
```

Used by ScrapbookView for `media.src`. Markdown body images (`![](key)`) are resolved via
a `react-markdown` `img` component override that runs `resolveAssetUrl` on the `src`.

### Rendering (ScrapbookView)

ScrapbookView is refactored to consume the new `Project`:
- Build pages: index 0 = `{ kind: 'description', body }`; indices 1…n = `media` items.
- Render description page via `react-markdown` (with the `img`/`a` overrides). Render photo
  pages via `<img src={resolveAssetUrl(src)}>` (existing spinner/`object-contain` logic).
  Render video pages via the existing `<iframe>`.
- Info bar shows the **current page's caption**: for media pages, `media.caption`; for the
  intro page, `oneLiner` + any `notes` lines. Project `links` stay pinned in the info bar
  on every page.
- Remove the old `Object.values(content).reduce(...)` project lookup and `pageNumber`
  handling. The slider/arrows logic and the custom vertical scrollbar are preserved.

### Validation

A zod schema (`projectSchema`) for frontmatter + body. Surfaces clear, file-scoped errors
at load time. zod is already a dependency.

## Migration

- Convert the 5 work + 3 off-work + 3 achievement entries (11 total) from TS to `.md` files,
  preserving current copy, links, and the existing Cloudinary image URLs as **absolute**
  `media.src` (no re-upload). Hand-written "Page N:" `subContent` becomes per-media
  `caption`s; non-page notes become `notes`.
- Delete `src/content/projects.ts`, `off-work-projects.ts`, `achievements.ts`. The
  `Project`/`MediaItem` types move into the loader module.
- `DEFAULT_IMAGE_WIDTH/HEIGHT` constants: no longer referenced by new content (the migrated
  Cloudinary URLs keep their existing transform baked in as literal strings). Remove if
  unreferenced after migration.

## Dependencies & ops

- Add `js-yaml` + `@types/js-yaml`.
- Add `VITE_ASSET_BASE=https://assets.os.diaoev.com` to the env. Document the R2
  bucket + Cloudflare custom-domain setup, and the "drop image in R2 under `<id>/<file>`"
  workflow, in the README.

## Files affected

- New: `src/content/loadCollection.ts`, `src/utils/resolveAssetUrl.ts`, the `*.md` content
  files, `docs/superpowers/specs/2026-06-04-markdown-driven-projects-design.md`.
- Changed: `src/content/index.ts`, `src/components/Views/ScrapbookView.tsx`, `@/utils`
  barrel, `package.json`, README, `.env`/example.
- Deleted: `src/content/projects.ts`, `off-work-projects.ts`, `achievements.ts` (and
  `constants` image-width entries if unreferenced).

## Risks & mitigations

- **Frontmatter parsing in the browser bundle.** Use `js-yaml` (browser-safe) + a simple
  `---` splitter; avoid Node-only libs like `gray-matter`.
- **Glob eager-loading raw markdown** increases the bundle slightly; acceptable for a small
  personal site and already the case (content was bundled as TS).
- **Malformed frontmatter** could break the build — mitigated by the zod schema throwing a
  clear, file-named error.
- **`VITE_ASSET_BASE` unset** in some environments → broken new-image URLs. Mitigate by
  documenting it and defaulting absolute URLs to passthrough (existing content unaffected).

## Verification

- `pnpm typecheck` + `pnpm build` pass.
- `pnpm dev` + Chrome DevTools MCP: open each migrated project/off-work/achievement window;
  confirm intro page renders markdown, media pages flip via slider/arrows, captions show
  per page, links are pinned, images/videos load (existing Cloudinary URLs pass through).
- Add a throwaway malformed `.md` → confirm a clear file-named error in the dev overlay,
  then remove it.
- Add a new test project referencing an R2 key → confirm `resolveAssetUrl` builds the
  custom-domain URL (with `VITE_ASSET_BASE` set).
