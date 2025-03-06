import React, { useState } from 'react';
import { MenuItem } from '@/config/menus';

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  parentPosition?: { left: number | string; top: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
  parentPosition,
}) => {
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0' onClick={onClose} />
      <div
        className='absolute z-50'
        style={{
          left: parentPosition?.left || 0,
          top: parentPosition?.top || '100%',
          minWidth: '200px',
        }}
      >
        <div className='bg-white border border-black shadow-md'>
          {items.map((item, index) =>
            item.label === '---' ? (
              <div key={index} className='h-[1px] bg-black my-1' />
            ) : (
              <div
                key={index}
                className='relative'
                onMouseEnter={() => item.submenu && setActiveSubmenu(index)}
                onMouseLeave={() => setActiveSubmenu(null)}
              >
                <button
                  className={`
                    w-full px-4 py-1 text-left text-[11px] font-chicago flex justify-between items-center
                    ${
                      item.disabled
                        ? 'text-gray-400'
                        : 'hover:bg-black hover:text-white'
                    }
                  `}
                  onClick={() => {
                    if (!item.disabled && item.action && !item.submenu) {
                      item.action();
                      onClose();
                    }
                  }}
                  disabled={item.disabled}
                >
                  <span>{item.label}</span>
                  {item.submenu && <span>▶</span>}
                </button>

                {item.submenu && activeSubmenu === index && (
                  <DropdownMenu
                    items={item.submenu}
                    isOpen={true}
                    onClose={onClose}
                    parentPosition={{ left: '100%', top: -3 }}
                  />
                )}
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;
