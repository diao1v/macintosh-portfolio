import { create } from 'zustand';
import { content } from '@/content';

export const typeToIcon = {
  harddisk: '/icons/drive-harddisk.png',
  folder: '/icons/folder.png',
  project: '/icons/scrapbook.png',
  text: '/icons/simple-text.png',
  contact: '/icons/gmail.png',
  link: '/icons/unknown.png',
  photo: '/icons/media.png',
  code: '/icons/text-script.png',
  pdf: '/icons/text.png',
  github: '/icons/github.png',
  linkedin: '/icons/linkedin.png',
};

export interface File {
  id: string;
  name: string;
  type:
    | 'folder'
    | 'project'
    | 'text'
    | 'pdf'
    | 'contact'
    | 'link'
    | 'scrapbook'
    | 'code';
  icon: string;
  children?: File[];
  content?: string;
  window?: {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    minWidth?: number;
    minHeight?: number;
  };
  projectId?: string;
}

interface FileStore {
  rootFolder: File;
  getFileById: (id: string) => File | null;
  addItem: (parentId: string, item: File) => void;
  deleteItem: (id: string) => void;
  moveItem: (id: string, newParentId: string) => void;
  updateFileContent: (id: string, content: string) => void;
  unsavedChanges: Set<string>;
  markFileAsDirty: (id: string) => void;
  markFileAsClean: (id: string) => void;
  hasUnsavedChanges: (id: string) => boolean;
  pendingContent: Record<string, string>;
  setPendingContent: (id: string, content: string) => void;
  saveFile: (id: string) => void;
}

// Helper function to create file structure from content
const createFileStructure = () => {
  const defaultRootFile: File = {
    id: 'root',
    name: 'Macintosh HD',
    type: 'folder',
    icon: typeToIcon['harddisk'],
    window: {
      width: 600,
      height: 400,
    },
    children: [
      {
        id: 'about-me',
        name: 'About Me',
        type: 'folder',
        icon: typeToIcon['folder'],
        window: {
          width: 600,
          height: 400,
        },
        children: [
          {
            id: 'resume',
            name: 'Resume.pdf',
            type: 'pdf',
            icon: typeToIcon['pdf'],
            window: {
              width: 600,
              height: 800,
            },
          },
          {
            id: 'about-me-java',
            name: 'About Me.java',
            type: 'code',
            icon: typeToIcon['code'],
            window: {
              width: 600,
              height: 800,
            },
          },
        ],
      },
      {
        id: 'projects',
        name: 'Projects',
        type: 'folder',
        icon: typeToIcon['folder'],
        window: {
          width: 600,
          height: 400,
        },
        children: Object.entries(content.projects).map(([id, project]) => ({
          id,
          name: project.title,
          type: 'project',
          icon: typeToIcon['project'],
          window: {
            width: 1000,
            height: 700,
          },
        })),
      },
      {
        id: 'socials',
        name: 'Socials',
        type: 'folder',
        icon: typeToIcon['folder'],
        window: {
          width: 600,
          height: 400,
        },
        children: [
          {
            id: 'github',
            name: 'GitHub',
            type: 'link',
            icon: typeToIcon['github'],
            content: 'https://github.com/diao1v',
          },
          {
            id: 'linkedin',
            name: 'LinkedIn',
            type: 'link',
            icon: typeToIcon['linkedin'],
            content: 'https://www.linkedin.com/in/yiwei-diao/',
          },
        ],
      },
      {
        id: 'off-work-projects',
        name: 'Off Work Projects',
        type: 'folder',
        icon: typeToIcon['folder'],
        window: {
          width: 600,
          height: 400,
        },
        children: Object.entries(content.offWorkProjects).map(
          ([id, project]) => ({
            id,
            name: project.title,
            type: 'project',
            icon: typeToIcon['project'],
            window: {
              width: 1000,
              height: 700,
            },
          }),
        ),
      },
      {
        id: 'contact',
        name: 'Eudora Light 3.0.1',
        type: 'contact',
        icon: typeToIcon['contact'],
        window: {
          width: 600,
          height: 430,
          minWidth: 420,
          minHeight: 430,
        },
      },
    ],
  };

  return defaultRootFile;
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

const useFileStore = create<FileStore>((set, get) => ({
  rootFolder: createFileStructure(),
  getFileById: (id) => findItemById(get().rootFolder, id),

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
            (child) => child.id === id,
          );
          if (itemIndex !== -1) {
            itemToMove = folder.children[itemIndex];
            return {
              ...folder,
              children: folder.children.filter(
                (_, index) => index !== itemIndex,
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

  updateFileContent: (id, content) =>
    set((state) => {
      const updateContent = (folder: File): File => {
        if (folder.id === id) {
          return {
            ...folder,
            content,
          };
        }

        if (folder.children) {
          return {
            ...folder,
            children: folder.children.map(updateContent),
          };
        }

        return folder;
      };

      return {
        rootFolder: updateContent(state.rootFolder),
      };
    }),

  unsavedChanges: new Set<string>(),
  pendingContent: {},

  markFileAsDirty: (id) =>
    set((state) => {
      const newUnsavedChanges = new Set(state.unsavedChanges);
      newUnsavedChanges.add(id);
      return { unsavedChanges: newUnsavedChanges };
    }),

  markFileAsClean: (id) =>
    set((state) => {
      const newUnsavedChanges = new Set(state.unsavedChanges);
      newUnsavedChanges.delete(id);
      return { unsavedChanges: newUnsavedChanges };
    }),

  hasUnsavedChanges: (id) => get().unsavedChanges.has(id),

  setPendingContent: (id, content) =>
    set((state) => ({
      pendingContent: { ...state.pendingContent, [id]: content },
    })),

  saveFile: (id) => {
    const { pendingContent, markFileAsClean, updateFileContent } = get();

    if (pendingContent[id]) {
      updateFileContent(id, pendingContent[id]);
      markFileAsClean(id);

      // Remove from pending content after saving
      set((state) => {
        const newPendingContent = { ...state.pendingContent };
        delete newPendingContent[id];
        return { pendingContent: newPendingContent };
      });
    }
  },
}));

export default useFileStore;
