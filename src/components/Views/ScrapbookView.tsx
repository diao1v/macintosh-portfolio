import React, { useState, useRef, useEffect } from 'react';
import { File } from '@/store/useFileStore';
import ReactMarkdown from 'react-markdown';
import { content } from '@/content';

interface ScrapbookViewProps {
  file: File;
}

const ScrapbookView: React.FC<ScrapbookViewProps> = ({ file }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [showVerticalScrollbar, setShowVerticalScrollbar] = useState(false);
  const [verticalThumbPosition, setVerticalThumbPosition] = useState(0);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

  const project = content.projects[file.id] || {
    title: file.name,
    description: file.content || '',
    images: [],
    oneLiner: '',
    links: { github: '', demo: '' },
  };

  const totalPages = Math.max(1, (project.images?.length || 0) + 1);

  // Check if content is scrollable
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const checkScrollable = () => {
        setShowVerticalScrollbar(content.scrollHeight > content.clientHeight);
      };

      checkScrollable();

      window.addEventListener('resize', checkScrollable);

      const resizeObserver = new ResizeObserver(checkScrollable);
      resizeObserver.observe(content);

      return () => {
        window.removeEventListener('resize', checkScrollable);
        resizeObserver.disconnect();
      };
    }
  }, [currentPage, project.description]);

  // Update thumb position on scroll
  useEffect(() => {
    const content = contentRef.current;
    if (content) {
      const handleScroll = () => {
        const scrollRatio =
          content.scrollTop / (content.scrollHeight - content.clientHeight);
        setVerticalThumbPosition(scrollRatio);
      };

      content.addEventListener('scroll', handleScroll);
      return () => content.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;

    const rect = track.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const trackWidth = rect.width;
    const newPage = Math.round((clickPosition / trackWidth) * (totalPages - 1));
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;

    const track = trackRef.current;
    const rect = track.getBoundingClientRect();
    const position = e.clientX - rect.left;
    const trackWidth = rect.width;
    const newPage = Math.round((position / trackWidth) * (totalPages - 1));
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePosition =
    totalPages <= 1
      ? '50%'
      : `calc(${(currentPage / (totalPages - 1)) * 100}% - ${
          currentPage === 0
            ? '0px'
            : currentPage === totalPages - 1
            ? '14px'
            : '7px'
        })`;

  const handleVerticalTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    const trackRect = track.getBoundingClientRect();
    const clickPosition = e.clientY - trackRect.top;
    const content = contentRef.current;
    if (!content) return;

    const scrollRatio = clickPosition / trackRect.height;
    content.scrollTop =
      scrollRatio * (content.scrollHeight - content.clientHeight);
  };

  const handleVerticalThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDraggingThumb(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingThumb || !contentRef.current) return;

      const content = contentRef.current;
      const track = content.parentElement?.querySelector('.vertical-track');
      if (!track) return;

      const trackRect = track.getBoundingClientRect();
      const ratio = (e.clientY - trackRect.top) / trackRect.height;
      const boundedRatio = Math.max(0, Math.min(1, ratio));

      content.scrollTop =
        boundedRatio * (content.scrollHeight - content.clientHeight);
    };

    const handleMouseUp = () => {
      setIsDraggingThumb(false);
    };

    if (isDraggingThumb) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingThumb]);

  const renderContent = () => {
    if (currentPage === 0) {
      return (
        <div className='h-full'>
          <div className='prose prose-sm max-w-none font-chicago text-[11px]'>
            <ReactMarkdown>{project.description}</ReactMarkdown>
          </div>
        </div>
      );
    }

    const imageIndex = currentPage - 1;
    return (
      <div className='flex items-center justify-center h-full'>
        <img
          src={project.images[imageIndex]}
          alt={`${project.title} screenshot ${imageIndex + 1}`}
          className='object-contain max-w-full max-h-full'
        />
      </div>
    );
  };

  return (
    <div className='flex flex-col h-full pb-4 overflow-hidden'>
      {/* Main Content Area */}
      <div className='flex-1 min-h-0 p-4'>
        <div className='relative h-full border border-[#999999] bg-white'>
          <div ref={contentRef} className='absolute inset-0 overflow-y-auto'>
            <div className='p-4'>{renderContent()}</div>
          </div>

          {/* Vertical Scrollbar */}
          {showVerticalScrollbar && (
            <div
              className='vertical-track absolute right-0 top-0 bottom-0 w-4 bg-[#E6E6E6] border-l border-[#999999]'
              onClick={handleVerticalTrackClick}
            >
              <div
                className='absolute w-4 h-4 bg-[#E6E6E6] border border-[#999999] cursor-pointer'
                style={{
                  top: `calc(${verticalThumbPosition * 100}% - ${
                    verticalThumbPosition * 16
                  }px)`,
                }}
                onMouseDown={handleVerticalThumbMouseDown}
              >
                <img
                  src='/icons/handle-vert.png'
                  alt='Scroll'
                  className='w-3.5 h-3.5'
                  draggable={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className='flex-none'>
        {/* Scroll Bar */}
        <div className='flex px-4 pb-3'>
          <button
            className='flex items-center justify-center flex-none w-4 h-4 bg-gray-200 border border-gray-400'
            onClick={goToPrevPage}
          >
            <img
              src='/icons/arrow-left.png'
              alt='Scroll Left'
              className={`w-3.5 h-3.5 ${currentPage === 0 ? 'opacity-50' : ''}`}
            />
          </button>
          <div
            ref={trackRef}
            className='relative flex-1 h-4 border border-gray-400 bg-[url("/icons/scrollbg.png")] bg-repeat'
            onClick={handleTrackClick}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div
              className='absolute top-0 left-0 h-4 cursor-pointer'
              style={{
                left: handlePosition,
              }}
              onMouseDown={handleDragStart}
            >
              <img
                src='/icons/handle-horiz.png'
                alt='handle horizontal'
                className='w-3.5 h-3.5'
                draggable={false}
              />
            </div>
          </div>
          <button
            className='flex items-center justify-center flex-none w-4 h-4 border border-gray-400'
            onClick={goToNextPage}
          >
            <img
              src='/icons/arrow-right.png'
              alt='Scroll Right'
              className={`w-3.5 h-3.5 ${
                currentPage === totalPages - 1 ? 'opacity-50' : ''
              }`}
            />
          </button>
        </div>

        {/* Info Bar - Fixed Height */}
        <div className=' bg-[#E6E6E6] px-4 py-1'>
          {/* Project info with markdown */}
          <div className='h-28 bg-white border border-[#999999] px-2 py-0.5 overflow-x-auto'>
            <div className='leading-tight prose-sm prose max-w-none text-[11px]'>
              <ReactMarkdown>{`${project.oneLiner}`}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookView;
