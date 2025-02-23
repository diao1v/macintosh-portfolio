import React, { useState, useRef, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { Z_INDEX } from '../../App';

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
  const contentRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const verticalTrackRef = useRef<HTMLDivElement>(null);
  const [trackDimensions, setTrackDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [scrollInfo, setScrollInfo] = useState({
    verticalThumbPosition: 0,
    horizontalThumbPosition: 0,
  });
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [dragType, setDragType] = useState<'vertical' | 'horizontal' | null>(
    null
  );

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

  // Calculate track dimensions on mount and resize
  useEffect(() => {
    const updateTrackDimensions = () => {
      if (horizontalTrackRef.current && verticalTrackRef.current) {
        setTrackDimensions({
          width: horizontalTrackRef.current.clientWidth,
          height: verticalTrackRef.current.clientHeight,
        });
      }
    };

    updateTrackDimensions();
    window.addEventListener('resize', updateTrackDimensions);
    return () => window.removeEventListener('resize', updateTrackDimensions);
  }, []);

  // Add global mouse event handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingThumb || !dragType) return;

      if (dragType === 'vertical') {
        const content = contentRef.current;
        if (!content) return;

        const trackRect = content.getBoundingClientRect();
        const trackHeight = trackRect.height - 32;
        const thumbPosition = Math.max(
          0,
          Math.min(e.clientY - trackRect.top - 16, trackHeight)
        );
        const scrollRatio = thumbPosition / trackHeight;
        const scrollPos =
          scrollRatio * (content.scrollHeight - content.clientHeight);

        content.scrollTop = scrollPos;
        setScrollInfo((prev) => ({
          ...prev,
          verticalThumbPosition: thumbPosition,
        }));
      } else {
        const content = contentRef.current;
        if (!content) return;

        const trackRect = content.getBoundingClientRect();
        const trackWidth = trackRect.width - 32;
        const thumbPosition = Math.max(
          0,
          Math.min(e.clientX - trackRect.left - 16, trackWidth)
        );
        const scrollRatio = thumbPosition / trackWidth;
        const scrollPos =
          scrollRatio * (content.scrollWidth - content.clientWidth);

        content.scrollLeft = scrollPos;
        setScrollInfo((prev) => ({
          ...prev,
          horizontalThumbPosition: thumbPosition,
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingThumb(false);
      setDragType(null);
    };

    if (isDraggingThumb) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingThumb, dragType]);

  // Handle arrow button clicks
  const handleArrowClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    const content = contentRef.current;
    if (!content) return;

    const SCROLL_STEP = 32;

    switch (direction) {
      case 'up':
        content.scrollTop = Math.max(0, content.scrollTop - SCROLL_STEP);
        break;
      case 'down':
        content.scrollTop = Math.min(
          content.scrollHeight - content.clientHeight,
          content.scrollTop + SCROLL_STEP
        );
        break;
      case 'left':
        content.scrollLeft = Math.max(0, content.scrollLeft - SCROLL_STEP);
        break;
      case 'right':
        content.scrollLeft = Math.min(
          content.scrollWidth - content.clientWidth,
          content.scrollLeft + SCROLL_STEP
        );
        break;
    }

    const maxVerticalScroll = content.scrollHeight - content.clientHeight;
    const maxHorizontalScroll = content.scrollWidth - content.clientWidth;

    const verticalRatio =
      maxVerticalScroll > 0 ? content.scrollTop / maxVerticalScroll : 0;
    const horizontalRatio =
      maxHorizontalScroll > 0 ? content.scrollLeft / maxHorizontalScroll : 0;

    // Calculate thumb positions using track dimensions
    const maxHorizontalThumbPosition = Math.max(0, trackDimensions.width - 16);
    const maxVerticalThumbPosition = Math.max(0, trackDimensions.height - 16);

    setScrollInfo({
      verticalThumbPosition: Math.min(
        verticalRatio * maxVerticalThumbPosition,
        maxVerticalThumbPosition
      ),
      horizontalThumbPosition: Math.min(
        horizontalRatio * maxHorizontalThumbPosition,
        maxHorizontalThumbPosition
      ),
    });
  };

  return (
    <Rnd
      style={{
        zIndex: Math.max(zIndex, Z_INDEX.WINDOW_MIN),
      }}
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
          zIndex: 4,
          width: '16px',
          height: '16px',
          right: '0px',
          bottom: '0px',
          cursor: 'se-resize',
        },
      }}
      resizeHandleComponent={{
        bottomRight: (
          <div className='absolute bottom-[1px] right-[1px] w-4 h-4 bg-[#E6E6E6] border-t border-l border-[#999999] flex items-center justify-center'>
            <img src='/icons/drag.png' alt='Resize' className='w-4 h-4' />
          </div>
        ),
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
              <div className='flex justify-center flex-grow h-full'>
                <span className='h-full px-2 text-[11px] flex items-center font-chicago text-black bg-repeat bg-gray-200'>
                  {title}
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

        {/* Info Bar for folders */}
        {type === 'folder' && (
          <div className='h-[22px] flex items-center border-b border-[#999999] px-2 bg-white'>
            <span className='text-[11px] font-chicago text-black'>
              {itemCount} item{itemCount !== 1 ? 's' : ''}
            </span>
            <span className='flex-grow' />
            <span className='text-[11px] font-chicago text-black'>
              {diskSpace} MB in disk
            </span>
          </div>
        )}

        {/* Window Content */}
        <div
          className='relative'
          style={{ height: `calc(100% - ${type === 'folder' ? 42 : 20}px)` }}
        >
          <div className='absolute inset-0 overflow-hidden'>
            {/* Main Content Area */}
            <div
              ref={contentRef}
              className='absolute inset-0 overflow-auto bg-white'
              style={{ zIndex: 1 }}
              onScroll={() => {
                const content = contentRef.current;
                if (content) {
                  const verticalRatio =
                    content.scrollTop /
                    (content.scrollHeight - content.clientHeight);
                  const horizontalRatio =
                    content.scrollLeft /
                    (content.scrollWidth - content.clientWidth);
                  const trackHeight = content.clientHeight - 32;
                  const trackWidth = content.clientWidth - 32;

                  setScrollInfo({
                    verticalThumbPosition: verticalRatio * trackHeight,
                    horizontalThumbPosition: horizontalRatio * trackWidth,
                  });
                }
              }}
            >
              <div className='relative min-h-full min-w-[400px]'>
                {children}
              </div>
            </div>

            {/* Vertical Scrollbar */}
            <div
              className='absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]'
              style={{ zIndex: 2 }}
              onMouseDown={(e) => {
                setIsDraggingThumb(true);
                setDragType('vertical');
                // Initial position set
                const trackRect = e.currentTarget.getBoundingClientRect();
                const trackHeight = trackRect.height - 32;
                const thumbPosition = Math.max(
                  0,
                  Math.min(e.clientY - trackRect.top - 16, trackHeight)
                );
                setScrollInfo((prev) => ({
                  ...prev,
                  verticalThumbPosition: thumbPosition,
                }));
              }}
            >
              {/* Up Arrow */}
              <button
                className='absolute top-0 right-0 w-4 h-4 bg-[#E6E6E6] border-l border-b border-[#999999] flex items-center justify-center'
                style={{ zIndex: 3 }}
                onClick={() => handleArrowClick('up')}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <img
                  src='/icons/arrow-up.png'
                  alt='Scroll Up'
                  className='w-3.5 h-3.5'
                />
              </button>

              {/* Vertical Track */}
              <div
                ref={verticalTrackRef}
                className='absolute left-0 right-0 top-4 bottom-4'
                style={{ zIndex: 2 }}
              >
                <div
                  className='absolute w-4 h-4 bg-[#E6E6E6] border border-[#999999] flex items-center justify-center'
                  style={{
                    top: Math.min(
                      scrollInfo.verticalThumbPosition,
                      trackDimensions.height - 16
                    ),
                    zIndex: 3,
                  }}
                >
                  <img
                    src='/icons/slider-vert-left.png'
                    alt='Slider'
                    className='w-3.5 h-3.5'
                  />
                </div>
              </div>

              {/* Down Arrow */}
              <button
                className='absolute bottom-4 right-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999] flex items-center justify-center'
                style={{ zIndex: 3 }}
                onClick={() => handleArrowClick('down')}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <img
                  src='/icons/arrow-down.png'
                  alt='Scroll Down'
                  className='w-3.5 h-3.5'
                />
              </button>
            </div>

            {/* Horizontal Scrollbar */}
            <div
              className='absolute left-0 bottom-0 right-4 h-4 bg-[#E6E6E6] border-t border-[#999999]'
              style={{ zIndex: 2 }}
              onMouseDown={(e) => {
                setIsDraggingThumb(true);
                setDragType('horizontal');
                // Initial position set
                const trackRect = e.currentTarget.getBoundingClientRect();
                const maxScroll = trackDimensions.width - 16; // Subtract thumb width
                const thumbPosition = Math.max(
                  0,
                  Math.min(e.clientX - trackRect.left - 16, maxScroll)
                );
                setScrollInfo((prev) => ({
                  ...prev,
                  horizontalThumbPosition: thumbPosition,
                }));
              }}
            >
              {/* Left Arrow */}
              <button
                className='absolute left-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-r border-t border-[#999999] flex items-center justify-center'
                style={{ zIndex: 3 }}
                onClick={() => handleArrowClick('left')}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <img
                  src='/icons/arrow-left.png'
                  alt='Scroll Left'
                  className='w-3.5 h-3.5'
                />
              </button>

              {/* Horizontal Track */}
              <div
                ref={horizontalTrackRef}
                className='absolute top-0 bottom-0 left-4 right-4'
                style={{ zIndex: 2 }}
              >
                <div
                  className='absolute h-4 w-4 bg-[#E6E6E6] border border-[#999999] flex items-center justify-center'
                  style={{
                    left: Math.min(
                      scrollInfo.horizontalThumbPosition,
                      trackDimensions.width - 16
                    ),
                    zIndex: 3,
                  }}
                >
                  <img
                    src='/icons/slider-horiz-top.png'
                    alt='Slider'
                    className='w-3.5 h-3.5'
                  />
                </div>
              </div>

              {/* Right Arrow */}
              <button
                className='absolute right-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999] flex items-center justify-center'
                style={{ zIndex: 3 }}
                onClick={() => handleArrowClick('right')}
                onMouseDown={(e) => e.stopPropagation()}
              >
                <img
                  src='/icons/arrow-right.png'
                  alt='Scroll Right'
                  className='w-3.5 h-3.5'
                />
              </button>
            </div>

            {/* Corner */}
            <div
              className='absolute right-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999]'
              style={{ zIndex: 3 }}
            />
          </div>
        </div>
      </div>
    </Rnd>
  );
};

export default Window;
