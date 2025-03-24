import useWindowStore from '@/store/useWindowStore';
import useFileStore, { typeToIcon, File } from '@/store/useFileStore';
import { FUN_NAMES } from '@/constants';
import { DialogProps } from '@/store/useDialogStore';
import { getDialogProps } from '@/config/dialogs';
import { handleWindowClose } from '@/utils';

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
  openDialog?: (dialogProps: DialogProps) => void;
}) => {
  const { focusedWindowId } = useWindowStore.getState();
  const { addItem, getFileById, deleteItem, saveFile } =
    useFileStore.getState();
  const { selectedItemId, onOpenFile, onCloseWindow, openDialog } = handlers;

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

    const baseFileName = 'New File';
    const fileExtension = '.txt';

    const existingFiles = focusedFile.children || [];
    const similarFileNames = existingFiles
      .filter(
        (file) => file.type === type && file.name.startsWith(baseFileName),
      )
      .map((file) => file.name);

    let newFileName = `${baseFileName}${fileExtension}`;
    let counter = 2;

    while (similarFileNames.includes(newFileName)) {
      newFileName = `${baseFileName} ${counter}${fileExtension}`;
      counter++;
    }

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
      (item) => item.id === selectedItemId,
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
      (item) => item.id === selectedItemId,
    );

    if (selectedItem) {
      deleteItem(selectedItemId);
    }
  };

  const handleSave = () => {
    if (!focusedWindowId) return;

    saveFile(focusedWindowId);
  };

  const handleShowCredits = () => {
    if (openDialog) {
      openDialog(getDialogProps('CREDITS'));
    }
  };

  const handleOpenMacintoshHD = () => {
    const rootFolder = getFileById('root');
    if (rootFolder) {
      onOpenFile(rootFolder);
    }
  };

  const handleCloseWindow = () => {
    if (!focusedWindowId) return;
    handleWindowClose(focusedWindowId, onCloseWindow || (() => {}), openDialog);
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
          label: 'Open Macintosh HD',
          action: handleOpenMacintoshHD,
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
                  (item) => item.id === selectedItemId,
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
              (item) => item.id === selectedItemId,
            ),
        },
        { label: '---' },
        {
          label: 'Close Window',
          action: handleCloseWindow,
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
          label: 'Credits',
          action: handleShowCredits,
          disabled: false,
        },
        { label: '---' },
        {
          label: 'Restart',
          action: () => {
            window.location.reload();
          },
          disabled: false,
        },
      ],
    },
  ];

  return menus;
};
