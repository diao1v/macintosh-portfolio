import React, { useState, useEffect, useRef } from 'react';
import { MenuItem } from '@/config/menus';

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  parentPosition?: { left: number | string; top: number };
  level?: number; // Track nesting level
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
  parentPosition,
  level = 0,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setHoveredIndex(null);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !menuRef.current) return;

    const handleMouseLeave = () => {
      if (level === 0) {
        setHoveredIndex(null);
      }
    };

    const menuElement = menuRef.current;
    menuElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      menuElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isOpen, level]);

  if (!isOpen) return null;

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.action && !item.submenu) {
      item.action();
      onClose();
    }
  };

  return (
    <>
      {level === 0 && <div className="fixed inset-0 z-40" onClick={onClose} />}

      <div
        ref={menuRef}
        className="absolute"
        style={{
          left: parentPosition?.left || 0,
          top: parentPosition?.top || '100%',
          minWidth: '200px',
          zIndex: 50 + level,
        }}
      >
        <div className="bg-white border border-black shadow-md">
          {items.map((item, index) =>
            item.label === '---' ? (
              <div key={index} className="h-[1px] bg-black my-1" />
            ) : (
              <div
                key={index}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onClick={(e) => {
                  if (!item.submenu) {
                    e.stopPropagation();
                  }
                }}
              >
                <button
                  className={`
                    w-full px-4 py-1 text-left text-[11px] font-chicago flex justify-between items-center
                    ${
                      item.disabled
                        ? 'text-gray-400'
                        : hoveredIndex === index
                          ? 'bg-black text-white'
                          : 'hover:bg-black hover:text-white'
                    }
                  `}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                >
                  <span>{item.label}</span>
                  {item.submenu && <span>▶</span>}
                </button>

                {item.submenu && hoveredIndex === index && (
                  <DropdownMenu
                    items={item.submenu}
                    isOpen={true}
                    onClose={onClose}
                    parentPosition={{ left: '100%', top: -2 }}
                    level={level + 1}
                  />
                )}
              </div>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;
