import { MENU_BAR_HEIGHT } from '../constants';

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

export const createMenuConfig = (handlers: {
  onOpenAbout: () => void;
}) => {
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
          disabled: true,
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