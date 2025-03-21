import React, { useState, useEffect } from 'react';
import { Z_INDEX } from '@/constants';
import { formatName } from '@/utils';

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

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setHasMouseMoved(true);
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        onDrag(newX, newY);
        e.preventDefault();
      }
    };

    const handleMouseUp = () => {
      if (isDragging && !hasMouseMoved) {
        onClick?.(
          new MouseEvent('click', {
            bubbles: true,
          }) as unknown as React.MouseEvent<Element, MouseEvent>,
        );
      }
      setIsDragging(false);
      setHasMouseMoved(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, hasMouseMoved, onDrag, onClick]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true);
      setHasMouseMoved(false);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
      onClick?.(e);
      e.stopPropagation();
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDoubleClick?.();
  };

  const formattedName = formatName(name, 13);

  return (
    <div
      className="absolute w-[108px] flex flex-col items-center"
      style={{
        left: position.x,
        top: position.y,
        cursor: 'default',
      }}
      onMouseDown={handleMouseDown}
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
              : Z_INDEX.DESKTOP_ICON,
        }}
      >
        <img
          src={icon}
          alt={name}
          className="w-12 h-12 pointer-events-none"
          draggable={false}
        />
        <div className="flex flex-col gap-0.5">
          {formattedName.map((line, index) => (
            <span
              key={index}
              className={`
              text-[11px] text-center font-chicago whitespace-nowrap pointer-events-none
              ${isSelected ? 'text-white' : 'text-black'}
              `}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DesktopIcon;
