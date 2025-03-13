import React, { useState, useEffect } from 'react';
import { Rnd } from 'react-rnd';
import { MENU_BAR_HEIGHT, Z_INDEX } from '../../constants';
import WindowHeader from './WindowHeader';
import WindowSubHeader from './WindowSubHeader';
import ScrollableContainer from './ScrollableContainer';
import { WindowProps } from './types';
import useFileStore from '@/store/useFileStore';
import FolderView from '../Views/FolderView';
import MarkdownView from '../Views/MarkdownView';
import ScrapbookView from '../Views/ScrapbookView';
import AboutPortfolio from '../AboutPortfolio/AboutPortfolio';
import EditableTextView from '../Views/EditableTextView';
import EmailClientView from '../Views/EmailClientView';

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
  zIndex = 1,
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
  children,
}) => {
  const { getFileById } = useFileStore();
  const file = id !== 'about' ? getFileById(id) : null;
  const type = id === 'about' ? 'about' : file?.type;
  const [size, setSize] = useState<Size>({ width, height });

  // Get minimum dimensions from file if they exist
  const minWidth = file?.window?.minWidth || 300;
  const minHeight = file?.window?.minHeight || 200;

  useEffect(() => {
    setSize({ width, height });
  }, [width, height]);

  const renderContent = () => {
    if (id === 'about') {
      return <AboutPortfolio />;
    }

    if (!file) return null;

    switch (file.type) {
      case 'folder':
        return (
          <FolderView
            file={file}
            onOpenFolder={onOpenFolder}
            onItemClick={onItemClick}
            onIconDrag={onIconDrag}
            selectedItemId={selectedItemId}
          />
        );
      case 'text':
        return <EditableTextView file={file} />;
      case 'code':
      case 'pdf':
        return <MarkdownView file={file} />;
      case 'project':
        return <ScrapbookView file={file} />;
      case 'contact':
        return <EmailClientView />;
      default:
        return <div>Unknown file type</div>;
    }
  };

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: position.x, y: position.y }}
      onDragStop={(e, d) => {
        if (onPositionChange) {
          onPositionChange(d.x, d.y);
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        setSize({
          width: parseInt(ref.style.width),
          height: parseInt(ref.style.height),
        });
      }}
      minWidth={minWidth}
      minHeight={minHeight}
      bounds="parent"
      style={{ zIndex }}
      dragHandleClassName="window-title-bar"
      className={`${isFocused ? 'window-focused' : ''}`}
      onClick={() => onFocus && onFocus()}
      resizeHandleComponent={{
        bottomRight: (
          <div className="absolute bottom-[11px] right-[11px] z-40 w-4 h-4 bg-[#E6E6E6] border-t border-l border-[#999999] flex items-center justify-center">
            <img src="/icons/maximize.png" alt="maximize" className="w-4 h-4" />
          </div>
        ),
      }}
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
    >
      <div
        className={`flex flex-col h-full border ${
          isFocused ? 'border-black' : 'border-[#999999]'
        } bg-[#E6E6E6] shadow-md`}
      >
        <WindowHeader
          title={title}
          onClose={onClose}
          onZoom={onZoom}
          isFocused={isFocused}
        />

        {type === 'folder' ? (
          <WindowSubHeader
            itemCount={file?.children?.length || 0}
            diskSpace={diskSpace}
          />
        ) : null}

        {type === 'project' ? (
          <div className="relative flex-1">
            <div className="absolute inset-0">{renderContent()}</div>
          </div>
        ) : (
          <ScrollableContainer
            type={type}
            isFocused={isFocused}
            hideHorizontal={type === 'contact'}
          >
            {renderContent()}
          </ScrollableContainer>
        )}
      </div>
    </Rnd>
  );
};

export default Window;
