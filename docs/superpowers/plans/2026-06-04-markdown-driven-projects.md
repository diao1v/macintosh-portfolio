# Markdown-Driven Projects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Author projects, off-work projects, and achievements as one markdown file each (frontmatter + body), auto-discovered at build, with images referenced by short R2 keys — replacing the hand-written TypeScript objects.

**Architecture:** A generic `loadCollection` loader globs `*.md` files per category with Vite's `import.meta.glob('…', { query: '?raw', eager: true })`, splits frontmatter (js-yaml) from the markdown body, validates with zod, and returns the existing `Record<id, Project>` shape so `useFileStore` is unchanged. `resolveAssetUrl` turns a bare key into an R2 custom-domain URL and passes absolute URLs through unchanged. ScrapbookView derives pages from `body` + `media[]` and shows a per-page caption.

**Tech Stack:** React 18, TypeScript, Vite, zod (existing), js-yaml (new), react-markdown (existing).

**Verification model:** This repo has no unit-test runner, and the approved spec defines verification as `pnpm typecheck` + `pnpm build` + live Chrome DevTools MCP checks. Each task ends by type-checking and committing; the final task does a full browser walkthrough. (A vitest setup for the pure `loadCollection`/`resolveAssetUrl` functions is a reasonable future addition but is out of scope here.)

**Source of truth for migration:** existing `src/content/projects.ts`, `off-work-projects.ts`, `achievements.ts`. Image transform constants resolve to: `DEFAULT_IMAGE_WIDTH = w_910`, `DEFAULT_IMAGE_HEIGHT = h_540`, achievements' local `ICON_WIDTH = w_300`. Bake these literal values into migrated URLs.

---

## File Structure

- Create: `src/utils/resolveAssetUrl.ts` — absolute-URL passthrough / R2 key → URL.
- Create: `src/content/loadCollection.ts` — `Project`/`MediaItem` types, zod schema, frontmatter splitter, `loadCollection`.
- Create: `src/content/projects/*.md` (5), `src/content/off-work-projects/*.md` (3), `src/content/achievements/*.md` (3).
- Create: `.env.example`.
- Modify: `src/content/index.ts` (use loader), `src/components/Views/ScrapbookView.tsx` (new shape + per-page caption + resolveAssetUrl), `src/utils/index.ts` (barrel export), `src/constants/index.ts` (drop unused image-width consts), `package.json` (js-yaml), `README.md`.
- Delete: `src/content/projects.ts`, `src/content/off-work-projects.ts`, `src/content/achievements.ts`.

---

## Task 1: Add js-yaml dependency and env scaffolding

**Files:**
- Modify: `package.json`
- Create: `.env.example`

- [ ] **Step 1: Install js-yaml**

Run:
```bash
pnpm add js-yaml && pnpm add -D @types/js-yaml
```
Expected: `package.json` gains `js-yaml` (dependencies) and `@types/js-yaml` (devDependencies); `pnpm-lock.yaml` updates.

- [ ] **Step 2: Create `.env.example`**

Create `.env.example`:
```
# Base URL for project image assets (Cloudflare R2 custom domain). No trailing slash.
VITE_ASSET_BASE=https://assets.os.diaoev.com

# Email sending endpoint (AWS API Gateway)
VITE_EMAIL_API=
VITE_EMAIL_ADDRESS=
```

- [ ] **Step 3: Set the var in the local `.env`**

If a local `.env` exists, add `VITE_ASSET_BASE=https://assets.os.diaoev.com`. (Do not commit `.env`.)

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: passes (no source changes yet).

- [ ] **Step 5: Commit**

```bash
git add package.json pnpm-lock.yaml .env.example
git commit -m "chore: add js-yaml and VITE_ASSET_BASE env scaffolding"
```

---

## Task 2: `resolveAssetUrl` helper

**Files:**
- Create: `src/utils/resolveAssetUrl.ts`
- Modify: `src/utils/index.ts`

- [ ] **Step 1: Create `src/utils/resolveAssetUrl.ts`**

```ts
const ABSOLUTE_URL = /^https?:\/\//i;

/**
 * Resolve a project media reference to a usable URL.
 * - Absolute URLs (http/https) are returned unchanged — keeps existing
 *   Cloudinary images and YouTube embeds working.
 * - Bare keys are served from the Cloudflare R2 custom domain in
 *   VITE_ASSET_BASE, e.g. "cheater-encoder/shot-1.png".
 */
export const resolveAssetUrl = (src: string): string => {
  if (ABSOLUTE_URL.test(src)) return src;
  const base = (import.meta.env.VITE_ASSET_BASE ?? '').replace(/\/+$/, '');
  const key = src.replace(/^\/+/, '');
  return base ? `${base}/${key}` : `/${key}`;
};
```

- [ ] **Step 2: Export it from the barrel**

Modify `src/utils/index.ts` to add:
```ts
export * from './resolveAssetUrl';
```

- [ ] **Step 3: Typecheck**

Run: `pnpm typecheck`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add src/utils/resolveAssetUrl.ts src/utils/index.ts
git commit -m "feat: add resolveAssetUrl helper for R2 keys / absolute URLs"
```

---

## Task 3: `loadCollection` loader (types, schema, parser)

**Files:**
- Create: `src/content/loadCollection.ts`

- [ ] **Step 1: Create `src/content/loadCollection.ts`**

```ts
import yaml from 'js-yaml';
import { z } from 'zod';

export interface MediaItem {
  type: 'photo' | 'video';
  src: string;
  caption?: string;
  makeImageSpin?: boolean;
}

export interface Project {
  title: string;
  oneLiner: string;
  links?: { name: string; url: string }[];
  body: string;
  media: MediaItem[];
  notes?: string[];
}

const linkSchema = z.object({ name: z.string(), url: z.string() });

const mediaInputSchema = z.object({
  src: z.string(),
  caption: z.string().optional(),
  type: z.enum(['photo', 'video']).optional(),
  makeImageSpin: z.boolean().optional(),
});

const frontmatterSchema = z.object({
  title: z.string(),
  oneLiner: z.string(),
  links: z.array(linkSchema).optional(),
  media: z.array(mediaInputSchema).optional(),
  notes: z.array(z.string()).optional(),
});

const VIDEO_HINT = /(youtube|youtu\.be|vimeo|embed)/i;

const splitFrontmatter = (raw: string): { data: unknown; body: string } => {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error('missing or malformed frontmatter block');
  return { data: yaml.load(match[1]), body: match[2].trim() };
};

const idFromPath = (path: string): string =>
  path.split('/').pop()!.replace(/\.md$/, '');

/**
 * Parse a set of raw markdown modules (from import.meta.glob with
 * { query: '?raw', eager: true, import: 'default' }) into projects keyed by id.
 */
export const loadCollection = (
  modules: Record<string, string>,
): Record<string, Project> => {
  const out: Record<string, Project> = {};

  for (const [path, raw] of Object.entries(modules)) {
    const id = idFromPath(path);
    try {
      const { data, body } = splitFrontmatter(raw);
      const fm = frontmatterSchema.parse(data);
      const media: MediaItem[] = (fm.media ?? []).map((m) => ({
        src: m.src,
        caption: m.caption,
        makeImageSpin: m.makeImageSpin,
        type: m.type ?? (VIDEO_HINT.test(m.src) ? 'video' : 'photo'),
      }));
      out[id] = {
        title: fm.title,
        oneLiner: fm.oneLiner,
        links: fm.links,
        body,
        media,
        notes: fm.notes,
      };
    } catch (err) {
      throw new Error(
        `Failed to load project "${id}" (${path}): ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }
  }

  return out;
};
```

- [ ] **Step 2: Typecheck**

Run: `pnpm typecheck`
Expected: passes (file is standalone, not yet imported).

- [ ] **Step 3: Commit**

```bash
git add src/content/loadCollection.ts
git commit -m "feat: add markdown collection loader with zod-validated frontmatter"
```

---

## Task 4: Migrate content to markdown files

Each file's **body** is the existing description markdown copied **verbatim** from the cited
TS `details` string (without the surrounding backticks). Image `src` values are the existing
Cloudinary URLs with the transform constant resolved to its literal value. Create the files,
then typecheck (still using old TS until Task 5) and commit.

> Where a project's first TS page was a `description`, that text is the body. Where there was
> no description page (woodworks, achievements), leave the body empty. The old `subContent`
> "Page N: …" lines become per-media `caption`s; non-page notes (and achievement detail
> lines) become `notes`.

- [ ] **Step 1: `src/content/projects/cheater-encoder.md`**

Frontmatter + body (body = verbatim from `projects.ts:219-296`):
```markdown
---
title: Cheater Encoder
oneLiner: A Mac OS portfolio website
links:
  - { name: Github, url: https://github.com/diao1v/cheater-encoder }
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-1_xha0k0.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-2_r0uypo.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-2.5_tpj6lk.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-3_pjeydc.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-4_mrcgxs.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-5_wqlead.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/cheater-encoder-6_rbkd1p.png'
---
# Cheater Encoder

…copy the full description body verbatim from projects.ts:219-296…
```

- [ ] **Step 2: `src/content/projects/macos-portfolio.md`**

Body = verbatim from `projects.ts:27-60`. The second TS description page ("…looking for the
screenshots?", `projects.ts:65`) becomes a `notes` line.
```markdown
---
title: Mac OS Portfolio
oneLiner: A Mac OS portfolio website
links:
  - { name: Github, url: https://github.com/diao1v/macintosh-portfolio }
  - { name: Demo, url: https://os.diao1v.me/ }
notes:
  - You're on this project already! Still looking for the screenshots?
---
# My Portfolio: Classic Macintosh System 7.6/8 Interface

…copy the full description body verbatim from projects.ts:27-60…
```

- [ ] **Step 3: `src/content/projects/macos-portfolio-outer.md`**

Body = verbatim from `projects.ts:87-105`. Second description page (`projects.ts:110`) → note.
```markdown
---
title: Mac OS Portfolio (Outer)
oneLiner: Macintosh 3D Viewer
links:
  - { name: Github, url: https://github.com/diao1v/macintosh-portfolio-outer }
  - { name: Demo, url: https://diao1v.me/ }
notes:
  - You're on this project already! Still looking for the screenshots?
---
# Macintosh 3D Viewer

…copy the full description body verbatim from projects.ts:87-105…
```

- [ ] **Step 4: `src/content/projects/grammar-tuner.md`**

Body = verbatim from `projects.ts:349-400`.
```markdown
---
title: Grammar Tuner
oneLiner: A desktop application for grammar tuning
links:
  - { name: Github, url: https://github.com/diao1v/grammar-tuner }
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741120267/macintosh-portfolio/grammar-tuner-1_gfpd1z.png'
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1741161031/macintosh-portfolio/grammar-tuner-2_o2kxzm.png'
---
# Grammar Tuner

…copy the full description body verbatim from projects.ts:349-400…
```

- [ ] **Step 5: `src/content/projects/my-house-shopping-diary.md`**

Body = verbatim from `projects.ts:132-206`. No media. `subContent` → `notes`.
```markdown
---
title: House Shopping Diary
oneLiner: Still under construction
notes:
  - App is still under construction
---
# My house shopping diary

…copy the full description body verbatim from projects.ts:132-206…
```

- [ ] **Step 6: `src/content/off-work-projects/skywatcher-start-adventure-adapter.md`**

Body = verbatim from `off-work-projects.ts:11-17`. Captions from `off-work-projects.ts:41-46`.
```markdown
---
title: 3D printed Adapter
oneLiner: 3D printed adapter for SkyWatcher Start Adventure
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1744014090/macintosh-portfolio/adapter-0_egt1en.png'
    caption: The 3d screenshot of the adapter.
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1742007049/macintosh-portfolio/adapter-1_z2gbo5.png'
    caption: The 3d printed adapter.
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1742007048/macintosh-portfolio/adapte-2_ztac4r.png'
    caption: The adapter on the SkyWatcher Start Adventure.
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1742007049/macintosh-portfolio/adapter-3_qobfn3.jpg'
    caption: Photo of M31 - Andromeda Galaxy
---
# SkyWatcher Start Adventure 3D printed Adapter

…copy the full description body verbatim from off-work-projects.ts:11-17…
```

- [ ] **Step 7: `src/content/off-work-projects/woodworks.md`**

No description page → **empty body**. Captions from `off-work-projects.ts:84-90`.
woodwork-1 uses `w_910`; woodwork-2..6 use `h_540`.
```markdown
---
title: Woodworks
oneLiner: Woodworks
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1742008713/macintosh-portfolio/woodwork-1_wdcxn7.jpg'
    caption: Big Dining Table
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,h_540/v1742008713/macintosh-portfolio/woodwork-2_gipydq.jpg'
    caption: Customized Tech Cabinet with Rattan Weave
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,h_540/v1742008713/macintosh-portfolio/woodwork-3_ukcijc.jpg'
    caption: Customized Shoe Rack + Bench + Coat Hanger
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,h_540/v1742008713/macintosh-portfolio/woodwork-4_ogiwwz.jpg'
    caption: Frames + Decorative Lighting
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,h_540/v1742008712/macintosh-portfolio/woodwork-5_oldtre.jpg'
    caption: Frames + Decorative Lighting
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,h_540/v1742018427/macintosh-portfolio/woodwork-6_midt2m.jpg'
    caption: "The famous Whistler's Mother - Mr.Bean version"
---
```
(Block style avoids the flow-map comma pitfall; `src` values are single-quoted since the
Cloudinary transform contains a comma. The last caption is double-quoted for the apostrophe.)

- [ ] **Step 8: `src/content/off-work-projects/lego-hplc-fragment-collector.md`**

Body = verbatim from `off-work-projects.ts:99-106`. Captions from `off-work-projects.ts:125-128`.
The two YouTube embeds infer `type: video`.
```markdown
---
title: Lego HPLC Fragment Collector
oneLiner: Lego HPLC Fragment Collector
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_910/v1742011209/macintosh-portfolio/Lego-1_jkkyvg.jpg'
    caption: Lego HPLC Fragment Collector Photo
  - src: 'https://www.youtube.com/embed/y1GQ3aLV3M4?si=7ah9HKEEDvCMxG7X'
    caption: Demo Video
  - src: 'https://www.youtube.com/embed/9etXPa5y8S4?si=_yrT1BJ5ZiPrxpA7'
    caption: Demo Video
---
# Lego HPLC Fragment Collector

…copy the full description body verbatim from off-work-projects.ts:99-106…
```

- [ ] **Step 9: `src/content/achievements/black-myth-wukong.md`**

No body. Single spinning photo (`w_300`). Detail lines → `notes`.
```markdown
---
title: "BLACK MYTH: WUKONG"
oneLiner: "BLACK MYTH: WUKONG"
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_300/v1742463867/macintosh-portfolio/achieve-bmw1_tgyk5l.jpg'
    makeImageSpin: true
notes:
  - "BLACK MYTH: WUKONG: Final Fulfillment (81 of 81)"
  - Achievement Date: 16 Nov, 2024 @ 3:03am
---
```
(Titles/notes with a colon are quoted for YAML safety.)

- [ ] **Step 10: `src/content/achievements/lake-taupo-cycle-challenge.md`**

Note the id is corrected from the old typo'd key `lake-taupo-cycle-changellenge:`.
```markdown
---
title: Lake Taupo Cycle Challenge
oneLiner: Lake Taupo Cycle Challenge
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_300/v1742463867/macintosh-portfolio/achieve-ltc1_rprvnq.png'
    makeImageSpin: true
notes:
  - "Lake Taupo Cycle Challenge: 160km in 7:30:17"
  - Achievement Date: 30 Nov, 2024 @ 13:56:09
---
```

- [ ] **Step 11: `src/content/achievements/aws-saa.md`**

```markdown
---
title: AWS Solutions Architect Associate
oneLiner: AWS Solutions Architect Associate
media:
  - src: 'https://res.cloudinary.com/dx7mr3wnr/image/upload/c_scale,w_300/v1742463867/macintosh-portfolio/achieve-saa1_nav8sy.png'
    makeImageSpin: true
notes:
  - "AWS Solutions Architect Associate: Certified"
  - Achievement Date: 27 Aug, 2024
---
```

- [ ] **Step 12: Typecheck and commit**

Run: `pnpm typecheck`
Expected: passes (old TS still in use; new `.md` files are not imported yet).
```bash
git add src/content/projects src/content/off-work-projects src/content/achievements
git commit -m "content: add markdown sources for projects, off-work, achievements"
```

---

## Task 5: Cutover — wire loader, refactor ScrapbookView, delete TS

This task must land atomically (the new `Project` shape and ScrapbookView change together).

**Files:**
- Modify: `src/content/index.ts`
- Modify: `src/components/Views/ScrapbookView.tsx`
- Delete: `src/content/projects.ts`, `src/content/off-work-projects.ts`, `src/content/achievements.ts`

- [ ] **Step 1: Rewrite `src/content/index.ts`**

Replace the whole file with:
```ts
import { aboutMe, resume } from './about-me';
import { loadCollection, Project } from './loadCollection';

const RAW = { query: '?raw', eager: true, import: 'default' } as const;

const projects = loadCollection(
  import.meta.glob('./projects/*.md', RAW) as Record<string, string>,
);
const offWorkProjects = loadCollection(
  import.meta.glob('./off-work-projects/*.md', RAW) as Record<string, string>,
);
const achievements = loadCollection(
  import.meta.glob('./achievements/*.md', RAW) as Record<string, string>,
);

interface Content {
  resume: string;
  aboutMe: string;
  projects: Record<string, Project>;
  offWorkProjects: Record<string, Project>;
  achievements: Record<string, Project>;
}

export const content: Content = {
  resume,
  aboutMe,
  projects,
  offWorkProjects,
  achievements,
};

// Helper to get content for a file (resume / About Me code view)
export const getContentForFile = (id: string): string | undefined => {
  if (id === 'resume') return content.resume;
  if (id === 'about-me-java') return content.aboutMe;
  return undefined;
};

export type { Project } from './loadCollection';
```

- [ ] **Step 2: Rewrite `src/components/Views/ScrapbookView.tsx`**

Full replacement (preserves the slider, arrows, and custom vertical scrollbar; changes only
data sourcing, page derivation, the render switch, and the info bar):
```tsx
import React, { useState, useRef, useEffect } from 'react';
import { File } from '@/store/useFileStore';
import ReactMarkdown from 'react-markdown';
import { content } from '@/content/';
import { Project, MediaItem } from '@/content/loadCollection';
import { resolveAssetUrl } from '@/utils';

interface ScrapbookViewProps {
  file: File;
}

type Page =
  | { kind: 'description' }
  | (MediaItem & { kind: 'media' });

const ScrapbookView: React.FC<ScrapbookViewProps> = ({ file }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showVerticalScrollbar, setShowVerticalScrollbar] = useState(false);
  const [verticalThumbPosition, setVerticalThumbPosition] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const collections: Record<string, Project>[] = [
    content.projects,
    content.offWorkProjects,
    content.achievements,
  ];
  const project: Project =
    collections.reduce<Project | null>(
      (found, c) => found ?? c[file.id] ?? null,
      null,
    ) ?? {
      title: file.name,
      oneLiner: '',
      links: [],
      body: '',
      media: [],
      notes: [],
    };

  // Page 1 = intro markdown (omitted if body is empty); then one page per media item.
  const pages: Page[] = [
    ...(project.body.trim() ? [{ kind: 'description' as const }] : []),
    ...project.media.map((m) => ({ kind: 'media' as const, ...m })),
  ];
  const totalPages = Math.max(1, pages.length);
  const page = pages[currentPage];

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      const checkScrollable = () =>
        setShowVerticalScrollbar(el.scrollHeight > el.clientHeight);
      checkScrollable();
      window.addEventListener('resize', checkScrollable);
      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(el);
      return () => {
        window.removeEventListener('resize', checkScrollable);
        resizeObserver.disconnect();
      };
    }
  }, [currentPage, pages.length]);

  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      const handleScroll = () => {
        const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight);
        setVerticalThumbPosition(ratio);
      };
      el.addEventListener('scroll', handleScroll);
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const newPage = Math.round(
      ((e.clientX - rect.left) / rect.width) * (totalPages - 1),
    );
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const newPage = Math.round(
      ((e.clientX - rect.left) / rect.width) * (totalPages - 1),
    );
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };
  const handleDragEnd = () => setIsDragging(false);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  const handlePosition =
    currentPage === totalPages - 1
      ? `${(currentPage / (totalPages - 1)) * 100 - 1.5}%`
      : `${(currentPage / (totalPages - 1)) * 100}%`;

  const handleVerticalThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingThumb(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingThumb || !contentRef.current) return;
      const el = contentRef.current;
      const track = el.parentElement?.querySelector('.vertical-track');
      if (!track) return;
      const trackRect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientY - trackRect.top) / trackRect.height),
      );
      el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
    };
    const handleMouseUp = () => setIsDraggingThumb(false);
    if (isDraggingThumb) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingThumb]);

  useEffect(() => {
    setIsImageLoading(true);
  }, [currentPage]);

  const CustomLink = (props: any) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  );
  const CustomImg = (props: any) => (
    <img {...props} src={resolveAssetUrl(props.src ?? '')} />
  );

  const renderContent = () => {
    if (!page) return null;
    if (page.kind === 'description') {
      return (
        <div className="h-full">
          <div className="prose prose-sm max-w-none font-torrance text-[11px]">
            <ReactMarkdown components={{ a: CustomLink, img: CustomImg }}>
              {project.body}
            </ReactMarkdown>
          </div>
        </div>
      );
    }
    if (page.type === 'photo') {
      return (
        <div className="relative flex items-start justify-center h-full min-h-[300px]">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-black animate-spin"></div>
            </div>
          )}
          <img
            src={resolveAssetUrl(page.src)}
            alt={page.caption || `${project.title} screenshot`}
            className={`object-contain max-w-full max-h-full transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            } ${page.makeImageSpin ? 'animate-spin-y' : ''}`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>
      );
    }
    // video
    return (
      <div className="flex items-start justify-start h-full min-h-[600px]">
        <iframe
          src={resolveAssetUrl(page.src)}
          title={page.caption || `${project.title} video`}
          allow="encrypted-media;"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full min-h-[500px]"
        ></iframe>
      </div>
    );
  };

  // Info bar: current page caption + project notes + links.
  const caption =
    page?.kind === 'media' ? page.caption : project.oneLiner;
  const infoLines = [
    ...(caption ? [caption] : []),
    ...(project.notes ?? []),
  ].map((line) => `- ${line}`);
  const linkLines = (project.links ?? []).map(
    (l) => `- ${l.name}: [${l.url}](${l.url})`,
  );
  const infoMarkdown = [infoLines.join('\n'), linkLines.join('\n')]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="flex flex-col h-full pb-4 overflow-hidden font-torrance text-[12px]">
      <div className="flex-1 min-h-0 p-4 ">
        <div className="relative h-full border border-[#999999] bg-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]">
          <div ref={contentRef} className="absolute inset-0 overflow-y-auto">
            <div className="p-4">{renderContent()}</div>
          </div>

          {showVerticalScrollbar && (
            <div
              className="vertical-track absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]"
              onClick={(e) => {
                const track = e.currentTarget;
                const trackRect = track.getBoundingClientRect();
                const el = contentRef.current;
                if (!el) return;
                const ratio = (e.clientY - trackRect.top) / trackRect.height;
                el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
              }}
            >
              <div
                className="absolute w-4 h-4 bg-[#E6E6E6] border border-[#999999] cursor-pointer"
                style={{
                  top: `calc(${verticalThumbPosition * 100}% - ${
                    verticalThumbPosition * 16
                  }px)`,
                }}
                onMouseDown={handleVerticalThumbMouseDown}
              >
                <img
                  src="/icons/handle-vert.png"
                  alt="Scroll"
                  className="w-3.5 h-3.5"
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-none">
        <div className="flex px-4 pb-3">
          <button
            className="flex items-center justify-center flex-none w-4 h-4 bg-gray-200 border border-gray-400"
            onClick={goToPrevPage}
          >
            <img
              src="/icons/arrow-left.png"
              alt="Scroll Left"
              className={`w-3.5 h-3.5 ${currentPage === 0 ? 'opacity-50' : ''}`}
            />
          </button>
          <div
            ref={trackRef}
            className='relative flex-1 h-4 border border-gray-400 bg-[url("/icons/scrollbg.png")] bg-repeat'
            onClick={handleTrackClick}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div
              className="absolute top-0 left-0 h-4 cursor-pointer"
              style={{ left: handlePosition }}
              onMouseDown={handleDragStart}
            >
              <img
                src="/icons/handle-horiz.png"
                alt="handle horizontal"
                className="w-3.5 h-3.5"
                draggable={false}
              />
            </div>
          </div>
          <button
            className="flex items-center justify-center flex-none w-4 h-4 border border-gray-400"
            onClick={goToNextPage}
          >
            <img
              src="/icons/arrow-right.png"
              alt="Scroll Right"
              className={`w-3.5 h-3.5 ${
                currentPage === totalPages - 1 ? 'opacity-50' : ''
              }`}
            />
          </button>
        </div>

        <div className=" bg-[#E6E6E6] px-4 py-1">
          <div className="h-28 bg-white border border-[#999999] px-2 py-0.5 overflow-x-auto">
            <div className="leading-tight prose-sm prose max-w-none text-[11px]">
              <ReactMarkdown components={{ a: CustomLink }}>
                {infoMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookView;
```

- [ ] **Step 3: Delete the old TS content files**

Run:
```bash
git rm src/content/projects.ts src/content/off-work-projects.ts src/content/achievements.ts
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: passes. (If a `Project` import error appears elsewhere, ensure it points at
`@/content/loadCollection` or `@/content`.)

- [ ] **Step 5: Build**

Run: `pnpm build`
Expected: builds successfully; no glob/parse errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: load projects from markdown; render via derived pages"
```

---

## Task 6: Cleanup constants and document

**Files:**
- Modify: `src/constants/index.ts`
- Modify: `README.md`

- [ ] **Step 1: Remove now-unused image-width constants**

Run to confirm they're unused (should print nothing):
```bash
grep -rn "DEFAULT_IMAGE_WIDTH\|DEFAULT_IMAGE_HEIGHT" src/
```
Then delete these two lines from `src/constants/index.ts`:
```ts
export const DEFAULT_IMAGE_WIDTH = 'w_910';
export const DEFAULT_IMAGE_HEIGHT = 'h_540';
```
(If grep still shows references, leave them and skip this step.)

- [ ] **Step 2: Document the authoring + asset workflow in `README.md`**

Add a section near "Technologies Used":
```markdown
## Adding a project

Projects, off-work projects, and achievements are markdown files:

- `src/content/projects/<id>.md`
- `src/content/off-work-projects/<id>.md`
- `src/content/achievements/<id>.md`

Each file has YAML frontmatter (`title`, `oneLiner`, optional `links`, `media`, `notes`)
and a markdown body that becomes the intro page. Each `media` item becomes its own page
with its caption. Files are auto-discovered — no registration needed.

Images live in a Cloudflare R2 bucket served via a custom domain
(`VITE_ASSET_BASE`, e.g. `https://assets.os.diaoev.com`). Reference an image by its
bucket key (`media: [{ src: <id>/shot-1.png }]`); absolute URLs (existing Cloudinary
images, YouTube embeds) are used as-is. Upload new images to R2 under `<id>/<file>`.
```

- [ ] **Step 3: Typecheck and commit**

Run: `pnpm typecheck`
Expected: passes.
```bash
git add src/constants/index.ts README.md
git commit -m "chore: drop unused image consts; document markdown project workflow"
```

---

## Task 7: Full verification

**Files:** none (verification only)

- [ ] **Step 1: Typecheck + build + prettier**

Run:
```bash
pnpm typecheck && pnpm build && pnpm exec prettier --check src
```
Expected: typecheck/build pass; prettier reports only the two pre-existing files
(`src/utils/index.ts`, `src/utils/windowUtils.ts`) if still unformatted — run
`pnpm exec prettier --write` on any new files you authored to clear them.

- [ ] **Step 2: Live walkthrough (Chrome DevTools MCP)**

Start `pnpm dev`, open the app, and verify (representative coverage):
- **Projects ▸ Cheater Encoder**: intro markdown renders on page 1; arrows/slider flip
  through the 7 photo pages; images load (Cloudinary passthrough); links pinned in info bar.
- **Projects ▸ Mac OS Portfolio**: intro renders; the "looking for the screenshots?" note
  shows in the info bar; Github + Demo links present.
- **Off Work ▸ Woodworks**: no intro page — first page is a photo; captions ("Big Dining
  Table", …) show per page.
- **Off Work ▸ Lego HPLC**: photo page then two video pages render via iframe; "Demo Video"
  caption shows.
- **Recent Achievements ▸ any**: single spinning image (`animate-spin-y`); the two note
  lines show in the info bar.
- Console: no errors beyond the known PostHog/Monaco-font warnings.

- [ ] **Step 3: Malformed-file guard check**

Temporarily create `src/content/projects/_broken.md` with body but no frontmatter; run
`pnpm dev`; confirm a clear error naming `_broken` appears in the Vite overlay/terminal.
Then delete the file.

- [ ] **Step 4: R2 key check (optional, needs VITE_ASSET_BASE)**

Temporarily add a `media: [{ src: test/x.png }]` item to one project; in the browser inspect
the `<img src>` and confirm it resolves to `https://assets.os.diaoev.com/test/x.png`. Revert.

- [ ] **Step 5: Final commit (if any prettier fixes were applied)**

```bash
git add -A
git commit -m "style: format new markdown-project files"
```
