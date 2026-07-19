import React, { useState, useRef, useEffect } from 'react';

interface MacScrollAreaProps {
  children: React.ReactNode;
  /** Classes for the outer box (border, background, sizing). */
  className?: string;
  /** Classes for the inner padding wrapper around the content. */
  contentClassName?: string;
}

/**
 * A scroll container with the classic Macintosh vertical scrollbar (a plain
 * #E6E6E6 track with a draggable handle). The native scrollbar is hidden; the
 * custom track only appears when the content overflows vertically.
 */
const MacScrollArea: React.FC<MacScrollAreaProps> = ({
  children,
  className = '',
  contentClassName = '',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

  // Show the custom scrollbar only when the content overflows vertically.
  useEffect(() => {
    const el = contentRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const checkScrollable = () =>
      setShowScrollbar(el.scrollHeight > el.clientHeight);
    checkScrollable();
    const resizeObserver = new ResizeObserver(checkScrollable);
    resizeObserver.observe(el);
    resizeObserver.observe(inner);
    window.addEventListener('resize', checkScrollable);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkScrollable);
    };
  }, []);

  // Keep the thumb in sync with the scroll position.
  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const handleScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setThumbPosition(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Drag the thumb to scroll.
  useEffect(() => {
    if (!isDraggingThumb) return;
    const handleMouseMove = (e: MouseEvent) => {
      const el = contentRef.current;
      const track = el?.parentElement?.querySelector('.vertical-track');
      if (!el || !track) return;
      const trackRect = track.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientY - trackRect.top) / trackRect.height),
      );
      el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
    };
    const handleMouseUp = () => setIsDraggingThumb(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingThumb]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={contentRef}
        className="absolute inset-0 overflow-auto scrollbar-hide"
      >
        <div ref={innerRef} className={contentClassName}>
          {children}
        </div>
      </div>

      {showScrollbar && (
        <div
          className="vertical-track absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]"
          onClick={(e) => {
            const trackRect = e.currentTarget.getBoundingClientRect();
            const el = contentRef.current;
            if (!el) return;
            const ratio = (e.clientY - trackRect.top) / trackRect.height;
            el.scrollTop = ratio * (el.scrollHeight - el.clientHeight);
          }}
        >
          <div
            className="absolute w-4 h-4 bg-[#E6E6E6] border border-[#999999] cursor-pointer"
            style={{
              top: `calc(${thumbPosition * 100}% - ${thumbPosition * 16}px)`,
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setIsDraggingThumb(true);
            }}
          >
            <img
              src="/icons/handle-vert.png"
              alt="Scroll"
              className="w-3.5 h-3.5"
              draggable={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MacScrollArea;
