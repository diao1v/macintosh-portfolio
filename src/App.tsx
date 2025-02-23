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
}

const App: React.FC = () => {
  const [windows, setWindows] = useState<WindowState[]>([
    {
      id: 'about',
      title: 'About This Portfolio',
      type: 'about',
      isOpen: true,
      position: { x: 40, y: 40 },
    },
  ]);
  const [focusedWindowId, setFocusedWindowId] = useState<string>('about');

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
  };

  const openFolder = (folderConfig: FolderConfig) => {
    const existingWindow = windows.find((w) => w.id === folderConfig.id);

    if (existingWindow) {
      if (!existingWindow.isOpen) {
        setWindows(
          windows.map((win) =>
            win.id === folderConfig.id ? { ...win, isOpen: true } : win
          )
        );
      }
    } else {
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
      };
      setWindows([...windows, newWindow]);
    }
    setFocusedWindowId(folderConfig.id);
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
            <div className='border-t border-b border-black py-2'>
              <p className='text-[11px]'>Memory Built-in: 8,192K</p>
              <p className='text-[11px]'>Total Memory: 8,192K</p>
            </div>
            <p className='text-[11px]'>© Your Name 2024</p>
          </div>
        );
      case 'folder':
        return (
          <div className='min-h-[200px] min-w-[300px] p-2'>
            <div className='grid grid-cols-4 gap-4'>
              {window.content?.map((item) => (
                <DesktopIcon
                  key={item.name}
                  name={item.name}
                  icon={item.icon}
                  onDoubleClick={() => openFolder(item as FolderConfig)}
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
      <div className='absolute inset-0 pt-5'>
        {/* Desktop Icons - Higher z-index */}
        <div className='absolute top-2 right-2 z-10'>
          <DesktopIcon
            name={rootFolder.name}
            icon={rootFolder.icon}
            onDoubleClick={() => openFolder(rootFolder)}
          />
        </div>

        {/* Windows Container */}
        <div className='absolute inset-0'>
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
