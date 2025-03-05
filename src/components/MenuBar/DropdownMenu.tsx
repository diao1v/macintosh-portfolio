import React from 'react';
import { MenuItem } from '@/config/menus';

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className='fixed inset-0' onClick={onClose} />
      <div
        className='absolute z-50'
        style={{
          left: 0,
          top: '100%',
          minWidth: '200px',
        }}
      >
        <div className='bg-white border border-black shadow-md'>
          {items.map((item, index) =>
            item.label === '---' ? (
              <div key={index} className='h-[1px] bg-black my-1' />
            ) : (
              <button
                key={index}
                className={`
                  w-full px-4 py-1 text-left text-[11px] font-chicago
                  ${
                    item.disabled
                      ? 'text-gray-400'
                      : 'hover:bg-black hover:text-white'
                  }
                `}
                onClick={() => {
                  if (!item.disabled && item.action) {
                    item.action();
                    onClose();
                  }
                }}
                disabled={item.disabled}
              >
                <span>{item.label}</span>
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu;
