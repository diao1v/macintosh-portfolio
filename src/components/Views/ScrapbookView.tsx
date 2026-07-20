import React, { useState, useRef, useEffect } from 'react';
import { File } from '@/store/useFileStore';
import ReactMarkdown from 'react-markdown';
import { content } from '@/content/';
import { Project, MediaItem } from '@/content/loadCollection';
import { resolveAssetUrl } from '@/utils';
import MacScrollArea from '../Window/MacScrollArea';

interface ScrapbookViewProps {
  file: File;
}

type Page = { kind: 'description' } | (MediaItem & { kind: 'media' });

const ScrapbookView: React.FC<ScrapbookViewProps> = ({ file }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const collections: Record<string, Project>[] = [
    content.projects,
    content.offWorkProjects,
    content.achievements,
  ];
  const project: Project = collections.reduce<Project | null>(
    (found, c) => found ?? c[file.id] ?? null,
    null,
  ) ?? {
    title: file.name,
    oneLiner: '',
    links: [],
    body: '',
    media: [],
    notes: [],
  };

  // Page 1 = intro markdown (omitted if body is empty); then one page per media item.
  const pages: Page[] = [
    ...(project.body.trim() ? [{ kind: 'description' as const }] : []),
    ...project.media.map((m) => ({ kind: 'media' as const, ...m })),
  ];
  const totalPages = Math.max(1, pages.length);
  const page = pages[currentPage];

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const newPage = Math.round(
      ((e.clientX - rect.left) / rect.width) * (totalPages - 1),
    );
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };

  const handleDragStart = () => setIsDragging(true);
  const handleDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const newPage = Math.round(
      ((e.clientX - rect.left) / rect.width) * (totalPages - 1),
    );
    setCurrentPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };
  const handleDragEnd = () => setIsDragging(false);

  const goToPrevPage = () => setCurrentPage((p) => Math.max(0, p - 1));
  const goToNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

  const handlePosition =
    currentPage === totalPages - 1
      ? `${(currentPage / (totalPages - 1)) * 100 - 1.5}%`
      : `${(currentPage / (totalPages - 1)) * 100}%`;

  // Reset image loading state when page changes
  useEffect(() => {
    setIsImageLoading(true);
  }, [currentPage]);

  const CustomLink = (props: any) => (
    <a {...props} target="_blank" rel="noopener noreferrer" />
  );
  const CustomImg = (props: any) => (
    <img {...props} src={resolveAssetUrl(props.src ?? '')} />
  );

  const renderContent = () => {
    if (!page) return null;
    if (page.kind === 'description') {
      return (
        <div className="h-full">
          <div className="prose prose-sm max-w-none font-torrance text-[11px]">
            <ReactMarkdown components={{ a: CustomLink, img: CustomImg }}>
              {project.body}
            </ReactMarkdown>
          </div>
        </div>
      );
    }
    if (page.type === 'photo') {
      return (
        <div className="relative flex items-start justify-center h-full min-h-[300px]">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-black animate-spin"></div>
            </div>
          )}
          <img
            src={resolveAssetUrl(page.src)}
            alt={page.caption || `${project.title} screenshot`}
            className={`object-contain max-w-full max-h-full transition-opacity duration-300 ${
              isImageLoading ? 'opacity-0' : 'opacity-100'
            } ${page.makeImageSpin ? 'animate-spin-y' : ''}`}
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
          />
        </div>
      );
    }
    // video
    return (
      <div className="flex items-start justify-start h-full min-h-[600px]">
        <iframe
          src={resolveAssetUrl(page.src)}
          title={page.caption || `${project.title} video`}
          allow="encrypted-media;"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full min-h-[500px]"
        ></iframe>
      </div>
    );
  };

  // Info bar: current page caption + project notes + links.
  const caption = page?.kind === 'media' ? page.caption : project.oneLiner;
  const infoLines = [
    ...(caption ? [caption] : []),
    ...(project.notes ?? []),
  ].map((line) => `- ${line}`);
  const linkLines = (project.links ?? []).map(
    (l) => `- ${l.name}: [${l.url}](${l.url})`,
  );
  const infoMarkdown = [infoLines.join('\n'), linkLines.join('\n')]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="flex flex-col h-full pb-4 overflow-hidden font-torrance text-[12px]">
      {/* Main Content Area */}
      <div className="flex-1 min-h-0 p-4 ">
        <MacScrollArea
          className="h-full border border-[#999999] bg-white shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6)]"
          contentClassName="p-4"
        >
          {renderContent()}
        </MacScrollArea>
      </div>

      {/* Navigation Controls */}
      <div className="flex-none">
        {/* Scroll Bar */}
        <div className="flex px-4 pb-3">
          <button
            className="flex items-center justify-center flex-none w-4 h-4 bg-gray-200 border border-gray-400"
            onClick={goToPrevPage}
          >
            <img
              src="/icons/arrow-left.png"
              alt="Scroll Left"
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
              className="absolute top-0 left-0 h-4 cursor-pointer"
              style={{ left: handlePosition }}
              onMouseDown={handleDragStart}
            >
              <img
                src="/icons/handle-horiz.png"
                alt="handle horizontal"
                className="w-3.5 h-3.5"
                draggable={false}
              />
            </div>
          </div>
          <button
            className="flex items-center justify-center flex-none w-4 h-4 border border-gray-400"
            onClick={goToNextPage}
          >
            <img
              src="/icons/arrow-right.png"
              alt="Scroll Right"
              className={`w-3.5 h-3.5 ${
                currentPage === totalPages - 1 ? 'opacity-50' : ''
              }`}
            />
          </button>
        </div>

        {/* Info Bar - Fixed Height */}
        <div className=" bg-[#E6E6E6] px-4 py-1">
          <MacScrollArea
            className="h-28 bg-white border border-[#999999]"
            contentClassName="px-2 py-0.5"
          >
            <div className="leading-tight prose-sm prose max-w-none text-[11px]">
              <ReactMarkdown components={{ a: CustomLink }}>
                {infoMarkdown}
              </ReactMarkdown>
            </div>
          </MacScrollArea>
        </div>
      </div>
    </div>
  );
};

export default ScrapbookView;
