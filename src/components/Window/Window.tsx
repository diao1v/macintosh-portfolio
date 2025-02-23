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
  zIndex?: number;
  onMaximize?: () => void;
  type?: 'folder' | 'about';
  itemCount?: number;
  diskSpace?: string;
}

export const MENU_BAR_HEIGHT = 20; // Height of the menu bar

const Window: React.FC<WindowProps> = ({
  title,
  children,
  onClose,
  position = { x: 40, y: 40 },
  isFocused = false,
  onFocus,
  zIndex = 0,
  onMaximize,
  type,
  itemCount = 0,
  diskSpace,
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
      style={{ zIndex }}
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
            h-5 flex items-center select-none overflow-hidden
            ${
              isFocused
                ? 'bg-[url("/icons/titlebar.png")] bg-repeat border-b border-black'
                : 'bg-white border-b border-[#999999]'
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
                className='w-3 h-3 mx-1 bg-white border border-black rounded-none
                         flex items-center justify-center
                         active:bg-[#000] focus:outline-none'
              >
                <div className='w-2 h-0.5 bg-black' />
              </button>
              <div className='flex-grow flex justify-center h-full'>
                <span className='h-full px-2 text-[11px] flex items-center font-chicago text-black bg-repeat bg-gray-200'>
                  {title}123123
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMaximize?.();
                }}
                className='w-3 h-3 mx-1 bg-white border border-black rounded-none
                         flex items-center justify-center
                         active:bg-[#000] focus:outline-none'
              >
                <div className='w-2 h-2 border border-black'>
                  <div className='w-full h-full bg-black transform translate-x-[1px] translate-y-[-1px]' />
                </div>
              </button>
            </>
          ) : (
            <span className='flex-grow text-center text-[11px] leading-none font-chicago text-black'>
              {title}
            </span>
          )}
        </div>

        {/* Info Bar - Only show for folders */}
        {type === 'folder' && (
          <div className='h-[22px] flex justify-between items-center border-b border-[#999999] px-2 bg-white'>
            <div className='text-[11px] font-chicago text-black block'>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </div>
            <div className='text-[11px] font-chicago text-black block'>
              {diskSpace} MB in disk
            </div>
          </div>
        )}

        {/* Window Content - Adjust height based on info bar */}
        <div
          className='p-3 overflow-auto bg-white'
          style={{ height: `calc(100% - ${type === 'folder' ? 42 : 20}px)` }}
        >
          {children}
        </div>
      </div>
    </Rnd>
  );
};

export default Window;
