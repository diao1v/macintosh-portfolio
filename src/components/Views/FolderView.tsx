import React, { useState, useEffect } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { File } from '@/store/useFileStore';
import { Position } from '../Window/types';
import { FOLDER_PADDING, ICON_WIDTH, ICON_SPACING } from '@/constants';

interface FolderViewProps {
  file: File;
  onOpenFolder?: (file: File) => void;
  onItemClick?: (id: string) => void;
  onIconDrag?: (id: string, x: number, y: number) => void;
  selectedItemId?: string | null;
}

const FolderView: React.FC<FolderViewProps> = ({
  file,
  onOpenFolder,
  onItemClick,
  selectedItemId,
}) => {
  const [iconPositions, setIconPositions] = useState<{
    [key: string]: Position;
  }>({});

  // Initialize positions for new items
  useEffect(() => {
    if (!file.children) return;

    const newPositions: { [key: string]: Position } = {};
    file.children.forEach((item, index) => {
      if (!iconPositions[item.id]) {
        newPositions[item.id] = {
          x: FOLDER_PADDING + (ICON_WIDTH + ICON_SPACING) * (index % 4),
          y:
            FOLDER_PADDING +
            Math.floor(index / 4) * (ICON_WIDTH + ICON_SPACING),
        };
      }
    });

    setIconPositions((prev) => ({ ...prev, ...newPositions }));
  }, [file.children]);

  const handleIconDrag = (id: string, x: number, y: number) => {
    setIconPositions((prev) => ({
      ...prev,
      [id]: { x, y },
    }));
  };

  return (
    <div className="h-full p-2">
      <div className="relative w-full h-full" style={{ minWidth: '400px' }}>
        {file.children?.map((item) => (
          <DesktopIcon
            key={item.id}
            name={item.name}
            icon={item.icon}
            onDoubleClick={() => onOpenFolder?.(item)}
            isSelected={selectedItemId === item.id}
            onClick={() => onItemClick?.(item.id)}
            position={iconPositions[item.id] || { x: 0, y: 0 }}
            onDrag={(x, y) => handleIconDrag(item.id, x, y)}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderView;
