import { create } from 'zustand';
import { MENU_BAR_HEIGHT } from '../constants';

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

interface FileStore {
  rootFolder: File;
  addItem: (parentId: string, item: File) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newParentId: string) => void;
}

const defaultRootFile: File = {
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
          icon: '/icons/text.png',
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
          icon: '/icons/unknown.png',
        },
        {
          id: 'linkedin',
          name: 'LinkedIn',
          type: 'file',
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

const useFolderStore = create<FileStore>((set) => ({
  rootFolder: defaultRootFile,

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

      // First find and remove the item
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

      // Then add it to the new parent
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
