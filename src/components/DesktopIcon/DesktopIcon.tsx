import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  onDoubleClick: () => void;
  className?: string;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onDoubleClick, className = '' }) => {
  return (
    <div
      className={`w-[80px] flex flex-col items-center gap-1 cursor-default ${className}`}
      onDoubleClick={onDoubleClick}
    >
      <img src={icon} alt={name} className='w-10 h-10' />
      <span className='text-[11px] text-white text-center font-chicago leading-none px-1'>
        {name}
      </span>
    </div>
  );
};

export default DesktopIcon; 