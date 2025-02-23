import React from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface DropdownMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  items,
  isOpen,
  onClose,
  position,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className='fixed inset-0'
        onClick={onClose}
      />
      <div
        className='fixed z-50'
        style={{ left: position.x, top: position.y }}
      >
        <div className='w-48 bg-white border border-black shadow-md'>
          {items.map((item, index) => (
            <button
              key={index}
              className={`
                w-full px-4 py-1 text-left text-[11px] font-chicago
                ${item.disabled ? 'text-gray-400' : 'hover:bg-black hover:text-white'}
              `}
              onClick={() => {
                if (!item.disabled) {
                  item.onClick();
                  onClose();
                }
              }}
              disabled={item.disabled}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default DropdownMenu; 