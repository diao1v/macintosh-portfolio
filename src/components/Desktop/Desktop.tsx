import React, { useState, useEffect, useRef } from 'react';
import { MENU_BAR_HEIGHT } from '@/constants';
import useWindowStore from '@/store/useWindowStore';
import useFolderStore from '@/store/useFileStore';
import { File } from '@/store/useFileStore';
import useIconStore from '@/store/useIconStore';
import DesktopIcon from '@/components/DesktopIcon/DesktopIcon';
import Window from '@/components/Window/Window';
import MenuBar from '@/components/MenuBar/MenuBar';
import Dialog from '@/components/Dialog/Dialog';
import { getDiskSpace } from '@/utils';

const Desktop: React.FC = () => {
  const {
    windows,
    focusedWindowId,
    closeWindow,
    focusWindow,
    setWindowPosition,
    setWindowSize,
    toggleWindowZoom,
    openWindow,
    addWindow,
  } = useWindowStore();
  const { rootFolder } = useFolderStore();
  const { positions, setPosition, ensurePositions } = useIconStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const rootDefaultPosition = { x: window.innerWidth - 120, y: 20 };

  // Seed the Macintosh HD icon position once.
  useEffect(() => {
    ensurePositions([{ id: rootFolder.id, pos: rootDefaultPosition }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ensurePositions, rootFolder.id]);

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
      });

      focusWindow(rootFolder.id);
    }
  }, [addWindow, focusWindow, rootFolder, windows]);

  const handleCloseWindow = (id: string) => closeWindow(id);
  const handleWindowFocus = (id: string) => focusWindow(id);
  const handleWindowZoom = (id: string) => toggleWindowZoom(id);

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

    const diskSpace = getDiskSpace(file.id, file.children?.length ?? 0);

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
    });
    focusWindow(file.id);
  };

  const handleItemClick = (itemId: string) => setSelectedItemId(itemId);
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedItemId(null);
    }
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
            position={positions[rootFolder.id] || rootDefaultPosition}
            onDrag={(x, y) => setPosition(rootFolder.id, { x, y })}
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
                  onSizeChange={(w, h) =>
                    setWindowSize(window.id, { width: w, height: h })
                  }
                  onOpenFolder={handleFileOpen}
                  onItemClick={handleItemClick}
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
