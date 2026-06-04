import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import DropdownMenu from './DropdownMenu';
import { createMenuConfig, MenuConfig } from '@/config/menus';
import useFileStore, { File } from '@/store/useFileStore';
import useWindowStore from '@/store/useWindowStore';
import useDialogStore from '@/store/useDialogStore';
interface MenuBarProps {
  selectedItemId: string | null;
  onOpenFile: (folderConfig: File) => void;
  onCloseWindow: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({
  selectedItemId,
  onOpenFile,
  onCloseWindow,
}) => {
  const openWindow = useWindowStore((s) => s.openWindow);
  // Subscribe to the slices the menu's enabled/disabled state depends on so it
  // recomputes reactively (e.g. Save enables the moment a file becomes dirty).
  const focusedWindowId = useWindowStore((s) => s.focusedWindowId);
  const rootFolder = useFileStore((s) => s.rootFolder);
  const unsavedChanges = useFileStore((s) => s.unsavedChanges);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const { openDialog } = useDialogStore();

  const menuConfig = useMemo<MenuConfig[]>(
    () =>
      createMenuConfig({
        onOpenAbout: () => openWindow('about'),
        selectedItemId,
        onOpenFile,
        onCloseWindow,
        openDialog,
      }),
    // rootFolder/unsavedChanges identities change on every mutation, driving
    // recompute; createMenuConfig reads the freshest store state internally.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      selectedItemId,
      focusedWindowId,
      rootFolder,
      unsavedChanges,
      onOpenFile,
      onCloseWindow,
      openWindow,
      openDialog,
    ],
  );

  useEffect(() => {
    setCurrentTime(new Date());

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return format(date, 'h:mm a');
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center h-5 px-1 bg-white border-b border-black">
      {menuConfig.map((menu, index) => (
        <div key={index} className="relative">
          <div
            className={`
              px-3 cursor-default
              ${
                activeMenu === index
                  ? 'bg-black text-white'
                  : 'hover:bg-black hover:text-white'
              }
            `}
            onClick={() => setActiveMenu(activeMenu === index ? null : index)}
          >
            {index === 0 ? (
              <div className="h-[20px] flex items-center">
                <img
                  src="/icons/apple.png"
                  alt="Apple Logo"
                  className={`h-[15px] ${
                    activeMenu === index ? 'invert-0' : ''
                  }`}
                />
              </div>
            ) : (
              menu.label
            )}
          </div>
          <DropdownMenu
            items={menu.items}
            isOpen={activeMenu === index}
            onClose={() => setActiveMenu(null)}
          />
        </div>
      ))}
      <div className="flex-grow" />
      <div className="text-[11px] leading-none pr-1">
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default MenuBar;
