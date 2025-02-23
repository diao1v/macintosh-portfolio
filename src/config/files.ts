import { MENU_BAR_HEIGHT } from '@/constants';

export interface File {
  id: string;
  name: string;
  type: 'folder' | 'file';
  icon: string;
  children?: File[];
  initialWindow?: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    minWidth?: number;
    minHeight?: number;
  };
}

export const rootFile: File = {
  id: 'macHD',
  name: 'Macintosh HD',
  type: 'folder',
  icon: '/icons/drive-harddisk.png',
  initialWindow: {
    width: 400,
    height: 300,
    x: 60,
    y: MENU_BAR_HEIGHT + 20,
  },
  children: [
    {
      id: 'projects',
      name: 'Projects',
      type: 'folder',
      icon: '/icons/folder.png',
      initialWindow: {
        width: 500,
        height: 400,
        x: 80,
        y: MENU_BAR_HEIGHT + 40,
      },
      children: [
        {
          id: 'project1',
          name: 'Project 1',
          type: 'folder',
          icon: '/icons/folder.png',
        },
        {
          id: 'project2',
          name: 'Project 2',
          type: 'folder',
          icon: '/icons/folder.png',
        },
      ],
    },
    {
      id: 'about-me',
      name: 'About Me',
      type: 'folder',
      icon: '/icons/folder.png',
      initialWindow: {
        width: 400,
        height: 300,
        x: 100,
        y: MENU_BAR_HEIGHT + 60,
      },
      children: [
        {
          id: 'resume',
          name: 'Resume.pdf',
          type: 'file',
          icon: '/icons/document.png',
        },
      ],
    },
    {
      id: 'contact',
      name: 'Contact',
      type: 'folder',
      icon: '/icons/folder.png',
      children: [
        {
          id: 'github',
          name: 'GitHub',
          type: 'file',
          icon: '/icons/github.png',
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          type: 'file',
          icon: '/icons/linkedin.png',
        },
      ],
    },
  ],
};
