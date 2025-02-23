import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';

interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface WindowProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  position?: Position;
  isFocused?: boolean;
  onFocus?: () => void;
}

export const MENU_BAR_HEIGHT = 20; // Height of the menu bar

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  position = { x: 40, y: 40 },
  isFocused = false,
  onFocus,
}) => {
  const [size, setSize] = useState<Size>({ width: 400, height: 300 });
  const [windowBounds, setWindowBounds] = useState({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  });

  // Update bounds when window size changes
  useEffect(() => {
    const updateBounds = () => {
      setWindowBounds({
        top: MENU_BAR_HEIGHT, // Start below menu bar
        left: 0,
        right: window.innerWidth - size.width,
        bottom: window.innerHeight - size.height,
      });
    };

    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, [size]);

  return (
    <Rnd
      default={{
        x: position.x,
        y: Math.max(position.y, MENU_BAR_HEIGHT),
        width: size.width,
        height: size.height,
      }}
      minWidth={200}
      minHeight={150}
      bounds='parent'
      dragHandleClassName='window-title-bar'
      onMouseDown={onFocus}
      enableResizing={{
        top: false,
        right: false,
        bottom: false,
        left: false,
        topRight: false,
        bottomRight: true,
        bottomLeft: false,
        topLeft: false,
      }}
      resizeHandleStyles={{
        bottomRight: {
          bottom: '4px',
          right: '4px',
        },
      }}
      onResize={(e, direction, ref) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
      }}
      onDragStop={(e, d) => {
        const y = Math.max(d.y, MENU_BAR_HEIGHT);
        if (d.y !== y) {
          e.preventDefault();
        }
      }}
    >
      <div
        className={`
          bg-[#E6E6E6] h-full
          ${
            isFocused
              ? 'border border-black shadow-[2px_2px_0_rgba(0,0,0,0.1)]'
              : 'border border-[#999999]'
          }
        `}
      >
        {/* Title Bar */}
        <div
          className={`
            window-title-bar
            h-5 flex items-center border-b select-none
            ${
              isFocused
                ? 'bg-[repeating-linear-gradient(45deg,#888,#888_1px,#fff_1px,#fff_2px)] border-black px-2'
                : 'bg-white border-[#999999] px-0'
            }
          `}
        >
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
            <span className='flex-grow text-center text-[11px] leading-none font-chicago text-black'>
              {title}
            </span>
          )}
        </div>

        {/* Window Content */}
        <div
          className='p-3 overflow-auto'
          style={{ height: 'calc(100% - 20px)' }}
        >
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;
