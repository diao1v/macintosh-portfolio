import React, { useState, useEffect, useRef } from 'react';
import DropdownMenu from './DropdownMenu';
import { createMenuConfig, type MenuConfig } from '@/config/menus';
import { File } from '@/store/useFileStore';
import useWindowStore from '@/store/useWindowStore';

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
  const { openWindow } = useWindowStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  const menuConfig = createMenuConfig({
    onOpenAbout: () => openWindow('about'),
    selectedItemId,
    onOpenFile,
    onCloseWindow,
  });

  useEffect(() => {
    // Update time immediately to avoid delay
    setCurrentTime(new Date());

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0)

    // Add leading zero to minutes if needed
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${hours}:${minutesStr} ${ampm}`;
  };

  return (
    <div className='fixed top-0 left-0 right-0 z-50 flex items-center h-5 px-1 bg-white border-b border-black'>
      {menuConfig.map((menu, index) => (
        <div key={index} className='relative'>
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
              <div className='h-[20px] flex items-center'>
                <img
                  src='/icons/apple.png'
                  alt='Apple Logo'
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
      <div className='flex-grow' />
      <div className='text-[11px] leading-none pr-1'>
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default MenuBar;
