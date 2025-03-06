import useWindowStore from '@/store/useWindowStore';
import useFileStore, { typeToIcon, File } from '@/store/useFileStore';
import { FUN_NAMES } from '@/constants';

export interface MenuItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  submenu?: MenuItem[];
}

export interface MenuConfig {
  label: string;
  items: MenuItem[];
}

export const createMenuConfig = (handlers: {
  onOpenAbout: () => void;
  selectedItemId: string | null;
  onOpenFile: (folderConfig: File) => void;
  onCloseWindow?: () => void;
}) => {
  const { focusedWindowId } = useWindowStore.getState();
  const { addItem, getFileById, deleteItem, saveFile } =
    useFileStore.getState();
  const { selectedItemId, onOpenFile, onCloseWindow } = handlers;

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

  const handleCreateFile = (type: 'text') => {
    const focusedFile = focusedWindowId ? getFileById(focusedWindowId) : null;

    if (!focusedFile || focusedFile.type !== 'folder') return;

    const fileExtension = '.txt';
    const newFileName = `New File${fileExtension}`;

    const newFile: File = {
      id: `file-${Date.now()}`,
      name: newFileName,
      type: type,
      icon: typeToIcon[type],
      content: '',
      window: {
        width: 600,
        height: 400,
      },
    };

    addItem(focusedFile.id, newFile);
  };

  const handleOpen = () => {
    if (selectedItemId === 'root') {
      onOpenFile(getFileById('root')!);
      return;
    }

    const focusedFile = focusedWindowId ? getFileById(focusedWindowId) : null;
    const selectedItem = focusedFile?.children?.find(
      (item) => item.id === selectedItemId
    );

    if (selectedItem && onOpenFile) {
      onOpenFile(selectedItem);
    }
  };

  const handleDelete = () => {
    if (!selectedItemId) return;

    if (selectedItemId === 'root') return;

    const focusedFile = focusedWindowId ? getFileById(focusedWindowId) : null;
    const selectedItem = focusedFile?.children?.find(
      (item) => item.id === selectedItemId
    );

    if (selectedItem) {
      deleteItem(selectedItemId);
    }
  };

  const handleSave = () => {
    if (!focusedWindowId) return;

    saveFile(focusedWindowId);
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
          action: handleCreateFolder,
          disabled:
            !focusedWindowId || getFileById(focusedWindowId)?.type !== 'folder',
        },
        {
          label: 'New File',
          disabled:
            !focusedWindowId || getFileById(focusedWindowId)?.type !== 'folder',
          submenu: [
            {
              label: 'SimpleText',
              action: () => handleCreateFile('text'),
              disabled:
                !focusedWindowId ||
                getFileById(focusedWindowId)?.type !== 'folder',
            },
          ],
        },
        {
          label: 'Open',
          action: handleOpen,
          disabled:
            !selectedItemId ||
            (selectedItemId !== 'root' &&
              (!focusedWindowId ||
                !getFileById(focusedWindowId)?.children?.some(
                  (item) => item.id === selectedItemId
                ))),
        },
        { label: '---' },
        {
          label: 'Delete',
          action: handleDelete,
          disabled:
            !selectedItemId ||
            selectedItemId === 'root' ||
            !focusedWindowId ||
            !getFileById(focusedWindowId)?.children?.some(
              (item) => item.id === selectedItemId
            ),
        },
        { label: '---' },
        {
          label: 'Close Window',
          action: onCloseWindow,
          disabled: !focusedWindowId,
        },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Undo',
          disabled: true,
        },
        { label: '---' },
        {
          label: 'Cut',
          disabled: true,
        },
        {
          label: 'Copy',
          disabled: true,
        },
        {
          label: 'Paste',
          disabled: true,
        },
        { label: '---' },
        {
          label: 'Save',
          action: handleSave,
          disabled:
            !focusedWindowId ||
            !useFileStore.getState().hasUnsavedChanges(focusedWindowId),
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
