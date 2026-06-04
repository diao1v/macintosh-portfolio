# My Portfolio: Classic Macintosh System 7.6/8 Interface

This project is a fun and nostalgic recreation of the Classic Macintosh System 7.6 and 8 interface, where I showcase my skills, projects, and information in a retro desktop environment. It’s a fully functional desktop with icons, folders, and files, mimicking the look and feel of the old MacOS

## Features

- **Functional Desktop**:
  - Icons, folders, and files (text, projects, code, photos/videos).
  - Create, move, and delete files/folders.
- **Mock Applications**:
  - **SimpleText**: A text editor mimicking the classic MacOS SimpleText.
  - **Scrapbook**: A scrapbook application for mimicking the classic MacOS. Use for displaying projects, photos, and videos.
  - **Email App**: A custom email application styled like the old MacOS email clients.
  - **Interactive Experience**:
    - Drag-and-drop functionality
    - Resizable windows
    - FRetro UI elements like menus, buttons

## Technologies Used

- React (with Vite for fast development)
- Tailwind CSS for styling
- React-Markdown for rendering Markdown content
- Zustand for code state management
- AWS API Gateway/Lambda/SES for email sending
- Cloudflare for DNS and CDN

## How to Use

1. Clone the repo:
2. run `pnpm install`
3. run `pnpm dev`
4. open `http://localhost:5173`

## Adding a project

Projects, off-work projects, and achievements are markdown files:

- `src/content/projects/<id>.md`
- `src/content/off-work-projects/<id>.md`
- `src/content/achievements/<id>.md`

Each file has YAML frontmatter (`title`, `oneLiner`, optional `links`, `media`, `notes`)
and a markdown body that becomes the intro page. Each `media` item becomes its own page
with its caption. Files are auto-discovered — no registration needed.

```markdown
---
title: My Project
oneLiner: One-line summary
links:
  - { name: GitHub, url: https://github.com/you/my-project }
media:
  - src: my-project/shot-1.png
    caption: Dashboard
  - src: https://www.youtube.com/embed/abc
    caption: Demo
notes:
  - Any extra info-bar line
---

# My Project

Markdown body becomes the intro page…
```

Images live in a Cloudflare R2 bucket served via a custom domain
(`VITE_ASSET_BASE`, e.g. `https://assets.os.diaoev.com`). Reference an image by its bucket
key (`media: [{ src: <id>/shot-1.png }]`); absolute URLs (existing Cloudinary images,
YouTube embeds) are used as-is. Upload new images to R2 under `<id>/<file>`. `media` `type`
is inferred (`video` for YouTube/Vimeo/embed URLs, otherwise `photo`) and can be set
explicitly with `type:`.

## To do

- [x] Add Project details (Grammar Tuner, Mac OS Portfolio, Cheater Encoder, House Shopping Diary)
- [x] Add off work projects (wood work, Lego building)
- [x] Add "Add new folder" function
- [x] Add "Open and Close" function from File menu dropdown
- [x] Add "Add new text file" function
- [x] Add "Delete" function
- [x] Add "Save" function
- [ ] Add "Move" function
- [x] Add load Mac interface
- [x] Add Email/Contact
- [x] Add Dialog
- [x] Add Email api
- [x] Add personal links (github, linkedin)
- [x] PostHog Analytics
