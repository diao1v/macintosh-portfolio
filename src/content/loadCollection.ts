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
