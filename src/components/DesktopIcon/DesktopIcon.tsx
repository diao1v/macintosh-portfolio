import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: string;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  name,
  icon,
  onDoubleClick,
  isSelected = false,
  onClick,
}) => {
  return (
    <div
      className='w-[108px] flex flex-col items-center cursor-default'
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick?.();
      }}
    >
      <div
        className={`
          flex flex-col items-center gap-1.5 px-2.5 py-0.5 rounded-sm
          ${isSelected ? 'bg-[#000000] bg-opacity-50' : ''}
        `}
      >
        <img src={icon} alt={name} className='w-12 h-12' />
        <span
          className={`
            text-[11px] text-center font-chicago whitespace-nowrap
            ${isSelected ? 'text-white' : 'text-black'}
          `}
        >
          {name}
        </span>
      </div>
    </div>
  );
};

export default DesktopIcon;
