import React, { useState, useEffect, useRef } from 'react';
import DropdownMenu from './DropdownMenu';

interface MenuBarProps {
  onOpenAbout: () => void;
}

const MenuBar: React.FC<MenuBarProps> = ({ onOpenAbout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isAppleMenuOpen, setIsAppleMenuOpen] = useState(false);
  const appleIconRef = useRef<HTMLDivElement>(null);

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

  const appleMenuItems = [
    {
      label: 'About This Portfolio',
      onClick: onOpenAbout,
    },
  ];

  return (
    <div className='fixed top-0 left-0 right-0 z-50 flex items-center h-5 px-1 bg-white border-b border-black'>
      <div className='relative'>
        <div
          ref={appleIconRef}
          className={`
            px-2 py-1 cursor-default
            ${isAppleMenuOpen ? 'bg-black' : 'hover:bg-black hover:text-white'}
          `}
          onClick={() => setIsAppleMenuOpen(true)}
        >
          <img
            src='/icons/apple.png'
            alt='Apple Logo'
            className={`w-[13px] h-[13px] ${isAppleMenuOpen ? 'invert' : ''}`}
          />
        </div>
        <DropdownMenu
          items={appleMenuItems}
          isOpen={isAppleMenuOpen}
          onClose={() => setIsAppleMenuOpen(false)}
          position={{
            x: 0,
            y: 20,
          }}
        />
      </div>
      <div className='flex text-[11px] leading-none'>
        {['File', 'Edit', 'View', 'Label', 'Special'].map((item) => (
          <div key={item} className='relative px-2 py-1 cursor-default group'>
            <span className='group-hover:bg-black group-hover:text-white'>
              {item}
            </span>
          </div>
        ))}
      </div>
      <div className='flex-grow' />
      <div className='text-[11px] leading-none pr-1'>
        {formatTime(currentTime)}
      </div>
    </div>
  );
};

export default MenuBar;
