import React, { useState, useRef, useEffect } from 'react';
import { ScrollInfo, TrackDimensions } from './types';

interface ScrollableContainerProps {
  children: React.ReactNode;
  type?:
    | 'about'
    | 'folder'
    | 'project'
    | 'text'
    | 'contact'
    | 'link'
    | 'scrapbook'
    | 'code'
    | 'pdf';
  isFocused?: boolean;
  hideHorizontal?: boolean;
}

const SCROLL_STEP = 32;

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({
  children,
  type,
  isFocused = false,
  hideHorizontal = false,
}) => {
  if (type === 'project') {
    return (
      <div className="relative h-full">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-white">{children}</div>

          {/* Corner Drag Button */}
          <div className="absolute right-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999] flex items-center justify-center z-[999]">
            <img
              src="/icons/maximize.png"
              alt="resize"
              className="w-3.5 h-3.5 z-50"
            />
          </div>
        </div>
      </div>
    );
  }

  const contentRef = useRef<HTMLDivElement>(null);
  const horizontalTrackRef = useRef<HTMLDivElement>(null);
  const verticalTrackRef = useRef<HTMLDivElement>(null);
  const [trackDimensions, setTrackDimensions] = useState<TrackDimensions>({
    width: 0,
    height: 0,
  });
  const [scrollInfo, setScrollInfo] = useState<ScrollInfo>({
    verticalThumbPosition: 0,
    horizontalThumbPosition: 0,
  });
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [dragType, setDragType] = useState<'vertical' | 'horizontal' | null>(
    null,
  );

  const updateDimensions = () => {
    const content = contentRef.current;
    const horizontalTrack = horizontalTrackRef.current;
    const verticalTrack = verticalTrackRef.current;

    if (content && horizontalTrack && verticalTrack) {
      // Update track dimensions
      const newTrackDimensions = {
        width: horizontalTrack.clientWidth,
        height: verticalTrack.clientHeight,
      };
      setTrackDimensions(newTrackDimensions);

      // Update thumb positions based on current scroll
      const verticalRatio =
        content.scrollHeight > content.clientHeight
          ? content.scrollTop / (content.scrollHeight - content.clientHeight)
          : 0;
      const horizontalRatio =
        content.scrollWidth > content.clientWidth
          ? content.scrollLeft / (content.scrollWidth - content.clientWidth)
          : 0;

      setScrollInfo({
        verticalThumbPosition: verticalRatio * (newTrackDimensions.height - 16),
        horizontalThumbPosition:
          horizontalRatio * (newTrackDimensions.width - 16),
      });
    }
  };

  // Call updateDimensions on mount and resize
  useEffect(() => {
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Update dimensions when content changes
  useEffect(() => {
    updateDimensions();
  }, [children]);

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
          Math.min(e.clientY - trackRect.top - 16, trackHeight),
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
          Math.min(e.clientX - trackRect.left - 16, trackWidth),
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

  const handleArrowClick = (direction: 'up' | 'down' | 'left' | 'right') => {
    const content = contentRef.current;
    if (!content) return;

    switch (direction) {
      case 'up':
        content.scrollTop = Math.max(0, content.scrollTop - SCROLL_STEP);
        break;
      case 'down':
        content.scrollTop = Math.min(
          content.scrollHeight - content.clientHeight,
          content.scrollTop + SCROLL_STEP,
        );
        break;
      case 'left':
        content.scrollLeft = Math.max(0, content.scrollLeft - SCROLL_STEP);
        break;
      case 'right':
        content.scrollLeft = Math.min(
          content.scrollWidth - content.clientWidth,
          content.scrollLeft + SCROLL_STEP,
        );
        break;
    }

    const maxVerticalScroll = content.scrollHeight - content.clientHeight;
    const maxHorizontalScroll = content.scrollWidth - content.clientWidth;

    const verticalRatio =
      maxVerticalScroll > 0 ? content.scrollTop / maxVerticalScroll : 0;
    const horizontalRatio =
      maxHorizontalScroll > 0 ? content.scrollLeft / maxHorizontalScroll : 0;

    const maxHorizontalThumbPosition = Math.max(0, trackDimensions.width - 16);
    const maxVerticalThumbPosition = Math.max(0, trackDimensions.height - 16);

    setScrollInfo({
      verticalThumbPosition: Math.min(
        verticalRatio * maxVerticalThumbPosition,
        maxVerticalThumbPosition,
      ),
      horizontalThumbPosition: Math.min(
        horizontalRatio * maxHorizontalThumbPosition,
        maxHorizontalThumbPosition,
      ),
    });
  };

  const calculateThumbPosition = (
    scrollPos: number,
    contentSize: number,
    viewportSize: number,
    trackSize: number,
  ) => {
    const scrollRatio = scrollPos / (contentSize - viewportSize);
    const maxThumbTravel = trackSize - 16; // 16 is thumb size
    return Math.min(scrollRatio * maxThumbTravel, maxThumbTravel);
  };

  const handleScroll = () => {
    const content = contentRef.current;
    if (!content) return;

    const verticalThumbPosition = calculateThumbPosition(
      content.scrollTop,
      content.scrollHeight,
      content.clientHeight,
      trackDimensions.height,
    );

    const horizontalThumbPosition = calculateThumbPosition(
      content.scrollLeft,
      content.scrollWidth,
      content.clientWidth,
      trackDimensions.width,
    );

    setScrollInfo({
      verticalThumbPosition,
      horizontalThumbPosition,
    });
  };

  return (
    <div
      className="relative"
      style={{ height: `calc(100% - ${type !== 'folder' ? 20 : 42}px)` }}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          ref={contentRef}
          className={`absolute inset-0 overflow-hidden ${
            isFocused ? 'bg-white' : 'bg-[#E6E6E6]'
          }`}
          style={{ zIndex: 1 }}
          onScroll={handleScroll}
        >
          <div className="relative min-h-full min-w-[400px]">{children}</div>
        </div>

        {/* Vertical Scrollbar */}
        <div
          className="absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]"
          style={{ zIndex: 2 }}
          onMouseDown={(e) => {
            setIsDraggingThumb(true);
            setDragType('vertical');
            const trackRect = e.currentTarget.getBoundingClientRect();
            const maxScroll = trackRect.height - 16;
            const thumbPosition = Math.max(
              0,
              Math.min(e.clientY - trackRect.top - 16, maxScroll),
            );
            setScrollInfo((prev) => ({
              ...prev,
              verticalThumbPosition: thumbPosition,
            }));
          }}
        >
          <button
            className="absolute top-0 right-0 w-4 h-4 bg-[#E6E6E6] border-l border-b border-[#999999] flex items-center justify-center"
            style={{ zIndex: 3 }}
            onClick={() => handleArrowClick('up')}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img
              src="/icons/arrow-up.png"
              alt="Scroll Up"
              className="w-3.5 h-3.5"
            />
          </button>

          <div
            ref={verticalTrackRef}
            className="absolute left-0 right-0 top-4 bottom-4"
            style={{ zIndex: 2 }}
          >
            <div
              className="absolute w-4 h-4 bg-[#E6E6E6] flex items-center justify-center"
              style={{
                top: Math.min(
                  scrollInfo.verticalThumbPosition,
                  trackDimensions.height - 16,
                ),
                zIndex: 3,
              }}
            >
              <img
                src="/icons/slider-vert-left.png"
                alt="Slider"
                className="w-3.5 h-3.5"
              />
            </div>
          </div>

          <button
            className="absolute bottom-4 right-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999] flex items-center justify-center"
            style={{ zIndex: 3 }}
            onClick={() => handleArrowClick('down')}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <img
              src="/icons/arrow-down.png"
              alt="Scroll Down"
              className="w-3.5 h-3.5"
            />
          </button>
        </div>

        {/* Horizontal Scrollbar */}
        {!hideHorizontal ? (
          <div
            className="absolute left-0 bottom-0 right-4 h-4 bg-[#E6E6E6] border-t border-[#999999]"
            style={{ zIndex: 2 }}
            onMouseDown={(e) => {
              setIsDraggingThumb(true);
              setDragType('horizontal');
              const trackRect = e.currentTarget.getBoundingClientRect();
              const maxScroll = trackDimensions.width - 16;
              const thumbPosition = Math.max(
                0,
                Math.min(e.clientX - trackRect.left - 16, maxScroll),
              );
              setScrollInfo((prev) => ({
                ...prev,
                horizontalThumbPosition: thumbPosition,
              }));
            }}
          >
            <button
              className="absolute left-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-r border-t border-[#999999] flex items-center justify-center"
              style={{ zIndex: 3 }}
              onClick={() => handleArrowClick('left')}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <img
                src="/icons/arrow-left.png"
                alt="Scroll Left"
                className="w-3.5 h-3.5"
              />
            </button>

            <div
              ref={horizontalTrackRef}
              className="absolute top-0 bottom-0 left-4 right-4"
              style={{ zIndex: 2 }}
            >
              <div
                className="absolute h-4 w-4 bg-[#E6E6E6] flex items-center justify-center"
                style={{
                  left: Math.min(
                    scrollInfo.horizontalThumbPosition,
                    trackDimensions.width - 16,
                  ),
                  zIndex: 3,
                }}
              >
                <img
                  src="/icons/slider-horiz-top.png"
                  alt="Slider"
                  className="w-3.5 h-3.5"
                />
              </div>
            </div>

            <button
              className="absolute right-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999] flex items-center justify-center"
              style={{ zIndex: 3 }}
              onClick={() => handleArrowClick('right')}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <img
                src="/icons/arrow-right.png"
                alt="Scroll Right"
                className="w-3.5 h-3.5"
              />
            </button>
          </div>
        ) : null}

        {/* Corner */}
        <div
          className="absolute right-0 bottom-0 w-4 h-4 bg-[#E6E6E6] border-l border-t border-[#999999]"
          style={{ zIndex: 3 }}
        />
      </div>
    </div>
  );
};

export default ScrollableContainer;
