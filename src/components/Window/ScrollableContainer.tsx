import React, { useState, useRef, useEffect } from 'react';
import { Z_INDEX } from '../../constants';
import { ScrollInfo, TrackDimensions } from './types';

interface ScrollableContainerProps {
  children: React.ReactNode;
  type?: 'folder' | 'about';
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, type }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const verticalTrackRef = useRef<HTMLDivElement>(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [dragType, setDragType] = useState<'vertical' | 'horizontal' | null>(null);
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    verticalThumbPosition: 0,
    horizontalThumbPosition: 0,
  });
  const [trackDimensions, setTrackDimensions] = useState<TrackDimensions>({
    width: 0,
    height: 0,
  });

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
  };

  return (
    <div
      className='relative'
      style={{ height: `calc(100% - ${type === 'folder' ? 42 : 20}px)` }}
    >
      <div className='absolute inset-0 overflow-hidden'>
        <div
          ref={contentRef}
          className='absolute inset-0 overflow-auto bg-white'
          style={{ zIndex: 1 }}
          onScroll={() => {
            const content = contentRef.current;
            if (!content) return;

            const verticalRatio =
              content.scrollTop / (content.scrollHeight - content.clientHeight);
            const horizontalRatio =
              content.scrollLeft / (content.scrollWidth - content.clientWidth);
            const trackHeight = content.clientHeight - 32;
            const trackWidth = content.clientWidth - 32;

            setScrollInfo({
              verticalThumbPosition: verticalRatio * trackHeight,
              horizontalThumbPosition: horizontalRatio * trackWidth,
            });
          }}
        >
          <div className='relative min-h-full min-w-[400px]'>{children}</div>
        </div>

        {/* Vertical Scrollbar */}
        <div
          className='absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]'
          style={{ zIndex: 2 }}
        >
          <button
            className='absolute top-0 right-0 w-4 h-4 bg-[#E6E6E6] border-l border-b border-[#999999] flex items-center justify-center'
            style={{ zIndex: 3 }}
            onClick={() => handleArrowClick('up')}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img src='/icons/arrow-up.png' alt='Scroll Up' className='w-3.5 h-3.5' />
          </button>

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
        >
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
  );
};

export default ScrollableContainer; 