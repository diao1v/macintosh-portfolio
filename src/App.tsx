import React, { useState } from 'react';
import MenuBar from './components/MenuBar/MenuBar';
import Window from './components/Window/Window';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import {
  MENU_BAR_HEIGHT,
  Z_INDEX,
  ICON_WIDTH,
  ICON_SPACING,
  FOLDER_PADDING,
} from './constants';
import { rootFile, type File } from './config/files';
import './App.css';
import AboutPortfolio from './components/AboutPortfolio/AboutPortfolio';
import useWindowStore from './store/useWindowStore';
import useFolderStore from './store/useFileStore';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  id: string;
  title: string;
  type: 'about' | 'folder';
  isOpen: boolean;
  position: Position;
  content?: File[];
  width?: number;
  height?: number;
  zIndex: number;
  diskSpace?: string;
  className?: string;
  isZoomed?: boolean;
  originalSize?: {
    width: number;
    height: number;
  };
}

interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const App: React.FC = () => {
  const {
    windows,
    focusedWindowId,
    closeWindow,
    focusWindow,
    setWindowPosition,
    toggleWindowZoom,
    openWindow,
  } = useWindowStore();
  const { rootFolder } = useFolderStore();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: rootFolder.id, x: window.innerWidth - 120, y: 20 }, // Initial position for root folder
  ]);

  const handleCloseWindow = (id: string): void => {
    closeWindow(id);
  };

  const handleWindowFocus = (id: string): void => {
    focusWindow(id);
  };

  // Initialize positions for new items in a folder
  const initializeIconPositions = (items: File[]) => {
    const newPositions = items.map((item, index) => ({
      id: item.id,
      x: FOLDER_PADDING + (ICON_WIDTH + ICON_SPACING) * index,
      y: FOLDER_PADDING,
    }));

    setIconPositions((prev) => {
      // Keep existing positions and add new ones
      const existingIds = prev.map((p) => p.id);
      const newItems = newPositions.filter((p) => !existingIds.includes(p.id));
      return [...prev, ...newItems];
    });
  };

  const openFolder = (folderConfig: File) => {
    const existingWindow = windows.find((w) => w.id === folderConfig.id);

    if (existingWindow) {
      if (!existingWindow.isOpen) {
        const newZIndex =
          Math.max(Z_INDEX.WINDOW_MIN, windows[windows.length - 1].zIndex) + 1;
        openWindow(folderConfig.id);
        setWindowPosition(folderConfig.id, {
          x: folderConfig.initialWindow?.x ?? 60,
          y: folderConfig.initialWindow?.y ?? MENU_BAR_HEIGHT + 20,
        });
        focusWindow(folderConfig.id);
      }
    } else {
      // Initialize positions for new folder content
      if (folderConfig.children) {
        initializeIconPositions(folderConfig.children);
      }

      // Calculate disk space for new window
      const diskSpace = (
        (folderConfig.children?.length || 0) *
        (Math.random() * 2 + 0.5)
      ).toFixed(2);

      const newWindow: WindowState = {
        id: folderConfig.id,
        title: folderConfig.name,
        type: 'folder',
        isOpen: true,
        position: {
          x: folderConfig.initialWindow?.x ?? 60,
          y: folderConfig.initialWindow?.y ?? MENU_BAR_HEIGHT + 20,
        },
        width: folderConfig.initialWindow?.width,
        height: folderConfig.initialWindow?.height,
        content: folderConfig.children,
        zIndex:
          Math.max(
            Z_INDEX.WINDOW_MIN,
            windows[windows.length - 1]?.zIndex || 0
          ) + 1,
        diskSpace,
      };

      useWindowStore.getState().addWindow(newWindow);
      focusWindow(folderConfig.id);
    }
  };

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.currentTarget === e.target) {
      setSelectedItemId(null);
    }
  };

  const handleIconDrag = (id: string, x: number, y: number) => {
    setIconPositions((prev) =>
      prev.map((pos) => (pos.id === id ? { ...pos, x, y } : pos))
    );
  };

  const getIconPosition = (id: string) => {
    return iconPositions.find((pos) => pos.id === id) || { x: 0, y: 0 };
  };

  const handleWindowZoom = (id: string): void => {
    toggleWindowZoom(id);
  };

  const renderWindowContent = (window: WindowState) => {
    switch (window.type) {
      case 'about':
        return <AboutPortfolio />;
      case 'folder':
        return (
          <div className='h-full p-2'>
            <div
              className='relative w-full h-full'
              style={{ minWidth: '400px' }}
            >
              {window.content?.map((item) => (
                <DesktopIcon
                  key={item.id}
                  name={item.name}
                  icon={item.icon}
                  onDoubleClick={() => openFolder(item as File)}
                  isSelected={selectedItemId === item.id}
                  onClick={() => handleItemClick(item.id)}
                  position={getIconPosition(item.id)}
                  onDrag={(x, y) => handleIconDrag(item.id, x, y)}
                />
              ))}
            </div>
          </div>
        );
    }
  };

  const handleOpenAbout = () => {
    openWindow('about');
    focusWindow('about');
  };

  return (
    <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
      <MenuBar onOpenAbout={handleOpenAbout} />

      {/* Desktop Area */}
      <div className='absolute inset-0 pt-5' onClick={handleBackgroundClick}>
        {/* Desktop Icons */}
        <div className='absolute inset-0' onClick={(e) => e.stopPropagation()}>
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
        <div className='absolute inset-0' onClick={(e) => e.stopPropagation()}>
          {windows.map(
            (window) =>
              window.isOpen && (
                <Window
                  key={window.id}
                  title={window.title}
                  position={window.position}
                  onClose={() => handleCloseWindow(window.id)}
                  isFocused={focusedWindowId === window.id}
                  onFocus={() => handleWindowFocus(window.id)}
                  zIndex={window.zIndex}
                  type={window.type}
                  itemCount={window.content?.length ?? 0}
                  diskSpace={window.diskSpace}
                  onZoom={() => handleWindowZoom(window.id)}
                  width={window.width}
                  height={window.height}
                  onPositionChange={(x, y) =>
                    setWindowPosition(window.id, { x, y })
                  }
                >
                  {renderWindowContent(window)}
                </Window>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
