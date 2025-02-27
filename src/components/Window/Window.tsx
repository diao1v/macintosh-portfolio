import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { MENU_BAR_HEIGHT, Z_INDEX } from '../../constants';
import WindowHeader from './WindowHeader';
import WindowSubHeader from './WindowSubHeader';
import ScrollableContainer from './ScrollableContainer';
import { WindowProps } from './types';
import useFileStore, { File } from '@/store/useFileStore';
import FolderView from '../Views/FolderView';
import MarkdownView from '../Views/MarkdownView';
import AboutPortfolio from '../AboutPortfolio/AboutPortfolio';

interface Size {
  width: number;
  height: number;
}

const Window: React.FC<WindowProps> = ({
  id,
  title,
  onClose,
  position,
  isFocused = false,
  onFocus,
  zIndex = 0,
  itemCount = 0,
  diskSpace,
  onZoom,
  width = 400,
  height = 300,
  onPositionChange,
  onOpenFolder,
  onItemClick,
  onIconDrag,
  getIconPosition,
  selectedItemId,
}) => {
  const { getFileById } = useFileStore();
  const file = id !== 'about' ? getFileById(id) : null;
  const type = id === 'about' ? 'about' : file?.type;
  const [size, setSize] = useState<Size>({ width, height });
  // const [windowBounds, setWindowBounds] = useState({
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   bottom: 0,
  // });

  // useEffect(() => {
  //   const updateBounds = () => {
  //     setWindowBounds({
  //       top: MENU_BAR_HEIGHT,
  //       left: 0,
  //       right: window.innerWidth - size.width,
  //       bottom: window.innerHeight - size.height,
  //     });
  //   };

  //   updateBounds();
  //   window.addEventListener('resize', updateBounds);
  //   return () => window.removeEventListener('resize', updateBounds);
  // }, [size]);

  useEffect(() => {
    if (width && height) {
      setSize({ width, height });
    }
  }, [width, height]);

  const renderContent = () => {
    if (id === 'about') {
      return <AboutPortfolio />;
    }

    if (!file) {
      console.warn('No file found for id:', id);
      return null;
    }

    switch (file.type) {
      case 'folder':
        return (
          <FolderView
            file={file}
            onOpenFolder={onOpenFolder}
            onItemClick={onItemClick}
            onIconDrag={onIconDrag}
            getIconPosition={getIconPosition}
            selectedItemId={selectedItemId}
          />
        );
      case 'text':
        return <MarkdownView file={file} />;
      default:
        return null;
    }
  };

  return (
    <Rnd
      style={{
        zIndex: Math.max(zIndex, Z_INDEX.WINDOW_MIN),
      }}
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
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
      resizeHandleComponent={{
        bottomRight: (
          <div className='absolute  bottom-[11px] right-[11px] z-40 w-4 h-4 bg-[#E6E6E6] border-t border-l border-[#999999] flex items-center justify-center'>
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
        onPositionChange?.(d.x, y);
      }}
      maxWidth={window.innerWidth - 40}
      maxHeight={window.innerHeight - MENU_BAR_HEIGHT - 20}
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
        <WindowHeader
          title={title}
          onClose={onClose}
          onZoom={onZoom}
          isFocused={isFocused}
        />

        {file?.type === 'folder' ? (
          <WindowSubHeader
            itemCount={file.children?.length || 0}
            diskSpace={diskSpace}
          />
        ) : null}

        <ScrollableContainer type={type} isFocused={isFocused}>
          {renderContent()}
        </ScrollableContainer>
      </div>
    </Rnd>
  );
};

export default Window;
