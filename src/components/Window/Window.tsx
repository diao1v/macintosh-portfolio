import React from 'react';

interface Position {
  x: number;
  y: number;
}

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  position?: Position;
  isFocused?: boolean;
  onFocus?: () => void;
}

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  position = { x: 40, y: 40 },
  isFocused = false,
  onFocus,
}) => {
  return (
    <div
      className={`
        absolute bg-[#E6E6E6] 
        ${
          isFocused
            ? 'border border-black shadow-[2px_2px_0_rgba(0,0,0,0.1)]'
            : 'border border-[#999999]'
        }
        min-w-[200px] min-h-[150px]
      `}
      style={{
        left: position.x,
        top: position.y,
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`
          h-5 flex items-center border-b
          ${
            isFocused
              ? 'bg-[repeating-linear-gradient(45deg,#888,#888_1px,#fff_1px,#fff_2px)] border-black px-2'
              : 'bg-white border-[#999999] px-0'
          }
        `}
      >
        {/* Control buttons only show when focused */}
        {isFocused ? (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className='w-3 h-3 bg-white border border-black rounded-none
                       flex items-center justify-center
                       active:bg-[#000] focus:outline-none'
            >
              <div className='w-2 h-0.5 bg-black' />
            </button>
            <span className='flex-grow text-[11px] leading-none font-chicago text-black px-2'>
              {title}
            </span>
            <button
              className='w-3 h-3 bg-white border border-black rounded-none
                       flex items-center justify-center
                       active:bg-[#000] focus:outline-none'
            >
              <div className='w-2 h-2 border border-black bg-white' />
            </button>
          </>
        ) : (
          // Centered title when unfocused
          <span className='flex-grow text-center text-[11px] leading-none font-chicago text-black'>
            {title}
          </span>
        )}
      </div>

      {/* Window Content */}
      <div className='p-3'>{children}</div>
    </div>
  );
};

export default Window;
