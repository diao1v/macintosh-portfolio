import React, { useState } from 'react';
import {
  MENU_BAR_HEIGHT,
  ICON_WIDTH,
  ICON_SPACING,
  FOLDER_PADDING,
} from '@/constants';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import Window from '../Window/Window';
import useWindowStore from '@/store/useWindowStore';
import useFolderStore from '@/store/useFileStore';
import { File } from '@/store/useFileStore';
import MenuBar from '../MenuBar/MenuBar';

interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const Desktop: React.FC = () => {
  const {
    windows,
    focusedWindowId,
    closeWindow,
    focusWindow,
    setWindowPosition,
    toggleWindowZoom,
    openWindow,
    addWindow,
  } = useWindowStore();
  const { rootFolder, getFileById } = useFolderStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: rootFolder.id, x: window.innerWidth - 120, y: 20 },
  ]);

  const handleCloseWindow = (id: string) => closeWindow(id);
  const handleWindowFocus = (id: string) => focusWindow(id);
  const handleWindowZoom = (id: string) => toggleWindowZoom(id);

  const initializeIconPositions = (items: File[]) => {
    const newPositions = items.map((item, index) => ({
      id: item.id,
      x: FOLDER_PADDING + (ICON_WIDTH + ICON_SPACING) * index,
      y: FOLDER_PADDING,
    }));

    setIconPositions((prev) => {
      const existingIds = prev.map((p) => p.id);
      const newItems = newPositions.filter((p) => !existingIds.includes(p.id));
      return [...prev, ...newItems];
    });
  };

  const openFolder = (folderConfig: File) => {
    const existingWindow = windows.find((w) => w.id === folderConfig.id);

    if (existingWindow) {
      openWindow(folderConfig.id);
      focusWindow(folderConfig.id);
      return;
    }

    if (folderConfig.children) {
      initializeIconPositions(folderConfig.children);
    }

    const diskSpace = (
      (folderConfig.children?.length || 0) *
      (Math.random() * 2 + 0.5)
    ).toFixed(2);

    addWindow({
      id: folderConfig.id,
      title: folderConfig.name,
      type: folderConfig.type,
      isOpen: true,
      position: {
        x: folderConfig.window?.x || 60,
        y: folderConfig.window?.y || MENU_BAR_HEIGHT + 20,
      },
      width: folderConfig.window?.width || 400,
      height: folderConfig.window?.height || 300,
      zIndex: 1,
      diskSpace,
      children: folderConfig.children,
      content: folderConfig.content,
    });
    focusWindow(folderConfig.id);
  };

  const handleItemClick = (itemId: string) => setSelectedItemId(itemId);
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedItemId(null);
    }
  };

  const handleIconDrag = (id: string, x: number, y: number) => {
    setIconPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, x, y } : pos)),
    );
  };

  const getIconPosition = (id: string) => {
    return iconPositions.find((pos) => pos.id === id) || { x: 0, y: 0 };
  };

  return (
    <>
      <MenuBar
        selectedItemId={selectedItemId}
        onOpenFile={openFolder}
        onCloseWindow={() => handleCloseWindow(focusedWindowId!)}
      />
      <div className="absolute inset-0 pt-5" onClick={handleBackgroundClick}>
        {/* Desktop Icons */}
        <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
          <DesktopIcon
            name={rootFolder.name}
            icon={rootFolder.icon}
            onDoubleClick={() => openFolder(rootFolder)}
            isSelected={selectedItemId === rootFolder.id}
            onClick={() => handleItemClick(rootFolder.id)}
            position={getIconPosition(rootFolder.id)}
            onDrag={(x, y) => handleIconDrag(rootFolder.id, x, y)}
          />
        </div>

        {/* Windows Container */}
        <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
          {windows.map(
            (window) =>
              window.isOpen && (
                <Window
                  key={window.id}
                  id={window.id}
                  title={window.title}
                  position={window.position}
                  onClose={() => handleCloseWindow(window.id)}
                  isFocused={focusedWindowId === window.id}
                  onFocus={() => handleWindowFocus(window.id)}
                  zIndex={window.zIndex}
                  diskSpace={window.diskSpace}
                  onZoom={() => handleWindowZoom(window.id)}
                  width={window.width}
                  height={window.height}
                  onPositionChange={(x, y) =>
                    setWindowPosition(window.id, { x, y })
                  }
                  onOpenFolder={openFolder}
                  onItemClick={handleItemClick}
                  onIconDrag={handleIconDrag}
                  getIconPosition={getIconPosition}
                  selectedItemId={selectedItemId}
                />
              ),
          )}
        </div>
      </div>
    </>
  );
};

export default Desktop;
