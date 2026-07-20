import { aboutMe, resume } from './about-me';
import { loadCollection, Project } from './loadCollection';

// NOTE: import.meta.glob options must be an inline object literal — Vite
// statically analyses this call, so the options cannot be a shared variable.
const projects = loadCollection(
  import.meta.glob('./projects/*.md', {
    query: '?raw',
    eager: true,
    import: 'default',
  }) as Record<string, string>,
);
const offWorkProjects = loadCollection(
  import.meta.glob('./off-work-projects/*.md', {
    query: '?raw',
    eager: true,
    import: 'default',
  }) as Record<string, string>,
);
const achievements = loadCollection(
  import.meta.glob('./achievements/*.md', {
    query: '?raw',
    eager: true,
    import: 'default',
  }) as Record<string, string>,
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
