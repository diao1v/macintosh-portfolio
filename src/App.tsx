import React, { useState } from 'react';
import MenuBar from './components/MenuBar/MenuBar';
import Window from './components/Window/Window';
import DesktopIcon from './components/DesktopIcon/DesktopIcon';
import { MENU_BAR_HEIGHT } from './components/Window/Window';
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

  const openFolder = (folderId: string, title: string) => {
    const existingWindow = windows.find((w) => w.id === folderId);

    if (existingWindow) {
      if (!existingWindow.isOpen) {
        setWindows(
          windows.map((win) =>
            win.id === folderId ? { ...win, isOpen: true } : win
          )
        );
      }
    } else {
      // Calculate new window position with offset from top-left
      const newWindow: WindowState = {
        id: folderId,
        title,
        type: 'folder',
        isOpen: true,
        position: { x: 60, y: 40 }, // Consistent with menu bar height
      };
      setWindows([...windows, newWindow]);
    }
    setFocusedWindowId(folderId);
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
          <div className='min-h-[200px] min-w-[300px]'>
            {/* Folder contents will go here */}
          </div>
        );
    }
  };

  return (
    <div className='h-screen w-screen bg-[#666666] overflow-hidden'>
      <MenuBar />

      {/* Desktop Area - Add padding-top to account for menu bar */}
      <div className='absolute inset-0 pt-5'>
        {/* Desktop Icons */}
        <div className='absolute top-2 right-2'>
          <DesktopIcon
            name='Macintosh HD'
            icon='/icons/drive-harddisk.png'
            onDoubleClick={() => openFolder('macHD', 'Macintosh HD')}
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
                    y: Math.max(window.position.y, MENU_BAR_HEIGHT), // Ensure windows start below menu bar
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
