import useWindowStore from '@/store/useWindowStore';
import useFileStore, { typeToIcon, File } from '@/store/useFileStore';
import { FUN_NAMES } from '@/constants';

export interface MenuItem {
  label: string;
  action?: () => void;
  shortcut?: string;
  disabled?: boolean;
  submenu?: MenuItem[];
}

export interface MenuConfig {
  label: string;
  items: MenuItem[];
}

export const createMenuConfig = (handlers: { onOpenAbout: () => void }) => {
  const { focusedWindowId } = useWindowStore.getState();
  const { addItem, getFileById } = useFileStore.getState();

  const handleCreateFolder = () => {
    const focusedFile = focusedWindowId ? getFileById(focusedWindowId) : null;

    if (!focusedFile || focusedFile.type !== 'folder') return;

    const randomName = FUN_NAMES[Math.floor(Math.random() * FUN_NAMES.length)];

    const newFolder: File = {
      id: `folder-${Date.now()}`,
      name: randomName,
      type: 'folder',
      icon: typeToIcon['folder'],
      children: [],
      window: {
        width: 600,
        height: 400,
      },
    };

    addItem(focusedFile.id, newFolder);
  };

  const menus: MenuConfig[] = [
    {
      label: '',
      items: [
        {
          label: 'About This Portfolio',
          action: handlers.onOpenAbout,
        },
        { label: '---' },
        {
          label: 'Control Panels',
          disabled: true,
        },
      ],
    },
    {
      label: 'File',
      items: [
        {
          label: 'New Folder',
          shortcut: '⌘N',
          action: handleCreateFolder,
          disabled:
            !focusedWindowId || getFileById(focusedWindowId)?.type !== 'folder',
        },
        {
          label: 'Open',
          shortcut: '⌘O',
          disabled: true,
        },
        { label: '---' },
        {
          label: 'Close Window',
          shortcut: '⌘W',
          disabled: true,
        },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          shortcut: '⌘Z',
          disabled: true,
        },
        { label: '---' },
        {
          label: 'Cut',
          shortcut: '⌘X',
          disabled: true,
        },
        {
          label: 'Copy',
          shortcut: '⌘C',
          disabled: true,
        },
        {
          label: 'Paste',
          shortcut: '⌘V',
          disabled: true,
        },
      ],
    },
    {
      label: 'View',
      items: [
        {
          label: 'by Icon',
          disabled: true,
        },
        {
          label: 'by Name',
          disabled: true,
        },
      ],
    },
    {
      label: 'Special',
      items: [
        {
          label: 'Clean Up Window',
          disabled: true,
        },
        {
          label: 'Empty Trash',
          disabled: true,
        },
      ],
    },
  ];

  return menus;
};
