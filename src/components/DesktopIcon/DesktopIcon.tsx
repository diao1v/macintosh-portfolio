import React, { useState } from 'react';
import { Z_INDEX } from '../../App';

interface DesktopIconProps {
  name: string;
  icon: string;
  onDoubleClick?: () => void;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  position: { x: number; y: number };
  onDrag: (x: number, y: number) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({
  name,
  icon,
  onDoubleClick,
  isSelected = false,
  onClick,
  position,
  onDrag,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [hasMouseMoved, setHasMouseMoved] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click only
      setIsDragging(true);
      setHasMouseMoved(false);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onClick?.(e); // Trigger click on mousedown for selection
      e.stopPropagation();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setHasMouseMoved(true);
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      onDrag(newX, newY);
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsDragging(false);
    setHasMouseMoved(false);
    e.stopPropagation();
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDoubleClick?.();
  };

  return (
    <div
      className='absolute w-[108px] flex flex-col items-center'
      style={{ 
        left: position.x,
        top: position.y,
        cursor: 'default',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <div
        className={`
          flex flex-col items-center gap-1.5 px-2.5 py-0.5 rounded-sm select-none
          ${isSelected ? 'bg-[#000000] bg-opacity-50' : ''}
          ${isDragging ? 'opacity-70' : ''}
        `}
        style={{
          zIndex: isDragging 
            ? Z_INDEX.DRAGGING_ICON 
            : isSelected 
            ? Z_INDEX.SELECTED_ICON 
            : Z_INDEX.DESKTOP_ICON
        }}
      >
        <img 
          src={icon} 
          alt={name} 
          className='w-12 h-12 pointer-events-none'
          draggable={false}
        />
        <span
          className={`
            text-[11px] text-center font-chicago whitespace-nowrap pointer-events-none
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
