import React, { useState } from 'react';
import MenuBar from './components/MenuBar/MenuBar';
import Window from './components/Window/Window';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import { MENU_BAR_HEIGHT } from './components/Window/Window';
import { rootFolder, type FolderConfig } from './config/folders';
import './App.css';

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
  content?: FolderConfig[];
  width?: number;
  height?: number;
  zIndex: number;
  diskSpace?: string;
}

interface IconPosition {
  id: string;
  x: number;
  y: number;
}

const ICON_WIDTH = 96;
const ICON_SPACING = 16;
const FOLDER_PADDING = 8;

export const Z_INDEX = {
  DESKTOP_ICON: 1,
  SELECTED_ICON: 2,
  DRAGGING_ICON: 3,
  WINDOW_MIN: 10, // Windows will start from this value
};

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'about',
      title: 'About This Portfolio',
      type: 'about',
      isOpen: true,
      position: { x: 40, y: 40 },
      zIndex: 1,
    },
  ]);
  const [focusedWindowId, setFocusedWindowId] = useState<string>('about');
  const [topZIndex, setTopZIndex] = useState(Z_INDEX.WINDOW_MIN);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [iconPositions, setIconPositions] = useState<IconPosition[]>([
    { id: rootFolder.id, x: window.innerWidth - 120, y: 20 }, // Initial position for root folder
  ]);

  const handleCloseWindow = (id: string): void => {
    setWindows(
      windows.map((win) => (win.id === id ? { ...win, isOpen: false } : win))
    );
    if (focusedWindowId === id) {
      setFocusedWindowId('');
    }
  };

  const handleWindowFocus = (id: string): void => {
    setFocusedWindowId(id);
    const newZIndex = Math.max(topZIndex, Z_INDEX.WINDOW_MIN) + 1;
    setTopZIndex(newZIndex);
    setWindows(
      windows.map((win) =>
        win.id === id ? { ...win, zIndex: newZIndex } : win
      )
    );
  };

  // Initialize positions for new items in a folder
  const initializeIconPositions = (items: FolderConfig[]) => {
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

  const openFolder = (folderConfig: FolderConfig) => {
    const existingWindow = windows.find((w) => w.id === folderConfig.id);

    if (existingWindow) {
      if (!existingWindow.isOpen) {
        const newZIndex = Math.max(topZIndex, Z_INDEX.WINDOW_MIN) + 1;
        setTopZIndex(newZIndex);
        setWindows(
          windows.map((win) =>
            win.id === folderConfig.id
              ? {
                  ...win,
                  isOpen: true,
                  zIndex: newZIndex,
                  // Add diskSpace if it doesn't exist
                  diskSpace:
                    win.diskSpace ||
                    (
                      (folderConfig.children?.length || 0) *
                      (Math.random() * 2 + 0.5)
                    ).toFixed(2),
                }
              : win
          )
        );
      }
    } else {
      // Initialize positions for new folder content
      if (folderConfig.children) {
        initializeIconPositions(folderConfig.children);
      }

      const newZIndex = Math.max(topZIndex, Z_INDEX.WINDOW_MIN) + 1;
      setTopZIndex(newZIndex);

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
        zIndex: newZIndex,
        diskSpace,
      };
      setWindows([...windows, newWindow]);
    }
    setFocusedWindowId(folderConfig.id);
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

  const renderWindowContent = (window: WindowState) => {
    switch (window.type) {
      case 'about':
        return (
          <div className='space-y-3'>
            <div className='flex items-center gap-4'>
              <img
                src='/icons/drive-harddisk.png'
                alt='Computer Icon'
                className='w-16 h-16'
              />
              <div>
                <h2 className='text-[13px] font-bold'>Your Name's Portfolio</h2>
                <p className='text-[11px]'>System Software 7.5.3</p>
              </div>
            </div>
            <div className='py-2 border-t border-b border-black'>
              <p className='text-[11px]'>Memory Built-in: 8,192K</p>
              <p className='text-[11px]'>Total Memory: 8,192K</p>
            </div>
            <p className='text-[11px]'>© Your Name 2024</p>
          </div>
        );
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
                  onDoubleClick={() => openFolder(item as FolderConfig)}
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

  return (
    <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
      <MenuBar />

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
                  position={{
                    x: window.position.x,
                    y: Math.max(window.position.y, MENU_BAR_HEIGHT),
                  }}
                  onClose={() => handleCloseWindow(window.id)}
                  isFocused={focusedWindowId === window.id}
                  onFocus={() => handleWindowFocus(window.id)}
                  zIndex={window.zIndex}
                  type={window.type}
                  itemCount={window.content?.length ?? 0}
                  diskSpace={window.diskSpace}
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
