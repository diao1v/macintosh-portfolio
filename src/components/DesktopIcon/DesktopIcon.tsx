import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onDoubleClick }) => {
  return (
    <div
      className='w-[80px] flex flex-col items-center gap-1 cursor-default'
      onDoubleClick={onDoubleClick}
    >
      <img src={icon} alt={name} className='w-8 h-8' />
      <span className='text-[11px] text-white text-center font-chicago leading-none'>
        {name}
      </span>
    </div>
  );
};

export default DesktopIcon; 