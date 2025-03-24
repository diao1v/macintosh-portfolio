import React, { useState, useEffect, useRef } from 'react';
import {
  MENU_BAR_HEIGHT,
  ICON_WIDTH,
  ICON_SPACING,
  FOLDER_PADDING,
} from '@/constants';
import useWindowStore from '@/store/useWindowStore';
import useFolderStore from '@/store/useFileStore';
import { File } from '@/store/useFileStore';
import DesktopIcon from '@/components/DesktopIcon/DesktopIcon';
import Window from '@/components/Window/Window';
import MenuBar from '@/components/MenuBar/MenuBar';
import Dialog from '@/components/Dialog/Dialog';

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
  const { rootFolder } = useFolderStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: rootFolder.id, x: window.innerWidth - 120, y: 20 },
  ]);

  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    const rootWindowExists = windows.some((w) => w.id === rootFolder.id);

    if (!rootWindowExists) {
      addWindow({
        id: rootFolder.id,
        title: rootFolder.name,
        type: rootFolder.type,
        isOpen: true,
        position: {
          x: 60,
          y: 45,
        },
        width: rootFolder.window?.width || 600,
        height: rootFolder.window?.height || 400,
        zIndex: 1,
        diskSpace: '128.5',
        children: rootFolder.children,
      });

      focusWindow(rootFolder.id);
    }
  }, [addWindow, focusWindow, rootFolder, windows]);

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

  const handleFileOpen = (file: File) => {
    if (file.type === 'link' && file.content) {
      window.open(file.content, '_blank', 'noopener,noreferrer');
      return;
    }

    const existingWindow = windows.find((w) => w.id === file.id);

    if (existingWindow) {
      openWindow(file.id);
      focusWindow(file.id);
      return;
    }

    if (file.children) {
      initializeIconPositions(file.children);
    }

    const diskSpace = (
      (file.children?.length || 0) *
      (Math.random() * 2 + 0.5)
    ).toFixed(2);

    addWindow({
      id: file.id,
      title: file.name,
      type: file.type,
      isOpen: true,
      position: {
        x: file.window?.x || 60,
        y: file.window?.y || MENU_BAR_HEIGHT + 20,
      },
      width: file.window?.width || 400,
      height: file.window?.height || 300,
      zIndex: 1,
      diskSpace,
      children: file.children,
      content: file.content,
    });
    focusWindow(file.id);
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
        onOpenFile={handleFileOpen}
        onCloseWindow={() => handleCloseWindow(focusedWindowId!)}
      />
      <div className="absolute inset-0 pt-5" onClick={handleBackgroundClick}>
        {/* Desktop Icons */}
        <div className="absolute inset-0" onClick={(e) => e.stopPropagation()}>
          <DesktopIcon
            name={rootFolder.name}
            icon={rootFolder.icon}
            onDoubleClick={() => handleFileOpen(rootFolder)}
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
                  onOpenFolder={handleFileOpen}
                  onItemClick={handleItemClick}
                  onIconDrag={handleIconDrag}
                  getIconPosition={getIconPosition}
                  selectedItemId={selectedItemId}
                />
              ),
          )}
        </div>
        <Dialog />
      </div>
    </>
  );
};

export default Desktop;
