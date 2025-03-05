import { aboutMe, resume } from './about-me';
import { Project, projects } from './projects';

interface Content {
  resume: string;
  aboutMe: string;
  projects: {
    [key: string]: Project;
  };
}

export const content: Content = {
  resume,
  aboutMe,
  projects,
};

// Helper to get content for a file
export const getContentForFile = (id: string): string | undefined => {
  if (id === 'resume') return content.resume;
  if (id === 'about-me-java') return content.aboutMe;
  return undefined;
};
