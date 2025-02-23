import React, { useState, useEffect } from 'react';

const MenuBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

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
      <div className='relative group'>
        <div className='w-[13px] h-[13px] mr-2 ml-3'>
          <img
            src='/icons/apple.png'
            alt='Apple Logo'
            className='w-full h-full'
          />
        </div>
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
