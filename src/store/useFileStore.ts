import { create } from 'zustand';
import { MENU_BAR_HEIGHT } from '../constants';
import { content } from '@/content';

export interface File {
  id: string;
  name: string;
  type: 'folder' | 'project' | 'text' | 'contact' | 'link';
  icon: string;
  children?: File[];
  content?: string;
  window?: {
    width: number;
    height: number;
    x?: number;
    y?: number;
  };
}

interface FileStore {
  rootFolder: File;
  getFileById: (id: string) => File | null;
  addItem: (parentId: string, item: File) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newParentId: string) => void;
}

const defaultRootFile: File = {
  id: 'macHD',
  name: 'Macintosh HD',
  type: 'folder',
  icon: '/icons/drive-harddisk.png',
  children: [
    {
      id: 'about-me',
      name: 'About Me',
      type: 'folder',
      icon: '/icons/folder.png',
      window: {
        width: 600,
        height: 400,
      },
      children: [
        {
          id: 'resume',
          name: 'Resume.pdf',
          type: 'text',
          icon: '/icons/text.png',
          content: content.resume,
          window: {
            width: 600,
            height: 1000,
          },
        },
      ],
    },
    {
      id: 'projects',
      name: 'Projects',
      type: 'folder',
      icon: '/icons/folder.png',
      window: {
        width: 500,
        height: 400,
        x: 80,
        y: MENU_BAR_HEIGHT + 40,
      },
      children: [
        {
          id: 'project1',
          name: 'Project 1',
          type: 'text',
          icon: '/icons/text.png',
          content: content.projects.project1.description,
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
      id: 'contact',
      name: 'Contact',
      type: 'contact',
      icon: '/icons/folder.png',
      children: [
        {
          id: 'github',
          name: 'GitHub',
          type: 'link',
          icon: '/icons/unknown.png',
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          type: 'link',
          icon: '/icons/unknown.png',
        },
      ],
    },
  ],
};

const findItemById = (folder: File, id: string): File | null => {
  if (folder.id === id) return folder;
  if (!folder.children) return null;

  for (const child of folder.children) {
    const found = findItemById(child, id);
    if (found) return found;
  }

  return null;
};

const useFolderStore = create<FileStore>((set, get) => ({
  rootFolder: defaultRootFile,

  getFileById: (id: string): File | null => {
    const findFileInFolder = (folder: File): File | null => {
      if (folder.id === id) {
        return folder;
      }

      if (folder.children) {
        for (const child of folder.children) {
          const found = findFileInFolder(child);
          if (found) {
            return found;
          }
        }
      }

      return null;
    };

    const file = findFileInFolder(get().rootFolder);
    return file;
  },

  addItem: (parentId, newItem) =>
    set((state) => {
      const addItemToFolder = (folder: File): File => {
        if (folder.id === parentId) {
          return {
            ...folder,
            children: [...(folder.children || []), newItem],
          };
        }
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.map(addItemToFolder),
          };
        }
        return folder;
      };

      return {
        rootFolder: addItemToFolder(state.rootFolder),
      };
    }),

  deleteItem: (id) =>
    set((state) => {
      const deleteItemFromFolder = (folder: File): File => {
        if (folder.children) {
          return {
            ...folder,
            children: folder.children
              .filter((child) => child.id !== id)
              .map(deleteItemFromFolder),
          };
        }
        return folder;
      };

      return {
        rootFolder: deleteItemFromFolder(state.rootFolder),
      };
    }),

  moveItem: (id, newParentId) =>
    set((state) => {
      let itemToMove: File | null = null;

      const removeItem = (folder: File): File => {
        if (folder.children) {
          const itemIndex = folder.children.findIndex(
            (child) => child.id === id
          );
          if (itemIndex !== -1) {
            itemToMove = folder.children[itemIndex];
            return {
              ...folder,
              children: folder.children.filter(
                (_, index) => index !== itemIndex
              ),
            };
          }
          return {
            ...folder,
            children: folder.children.map(removeItem),
          };
        }
        return folder;
      };

      const addToNewParent = (folder: File): File => {
        if (folder.id === newParentId && itemToMove) {
          return {
            ...folder,
            children: [...(folder.children || []), itemToMove],
          };
        }
        if (folder.children) {
          return {
            ...folder,
            children: folder.children.map(addToNewParent),
          };
        }
        return folder;
      };

      const rootWithItemRemoved = removeItem(state.rootFolder);
      return {
        rootFolder: addToNewParent(rootWithItemRemoved),
      };
    }),
}));

export default useFolderStore;
