import React, { useEffect } from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { File } from '@/store/useFileStore';
import useIconStore from '@/store/useIconStore';
import { FOLDER_PADDING, ICON_WIDTH, ICON_SPACING } from '@/constants';

interface FolderViewProps {
  file: File;
  onOpenFolder?: (file: File) => void;
  onItemClick?: (id: string) => void;
  selectedItemId?: string | null;
}

const FolderView: React.FC<FolderViewProps> = ({
  file,
  onOpenFolder,
  onItemClick,
  selectedItemId,
}) => {
  const { positions, setPosition, ensurePositions } = useIconStore();

  // Seed default grid positions for any children that don't have one yet.
  useEffect(() => {
    if (!file.children) return;

    ensurePositions(
      file.children.map((item, index) => ({
        id: item.id,
        pos: {
          x: FOLDER_PADDING + (ICON_WIDTH + ICON_SPACING) * (index % 4),
          y:
            FOLDER_PADDING +
            Math.floor(index / 4) * (ICON_WIDTH + ICON_SPACING),
        },
      })),
    );
  }, [file.children, ensurePositions]);

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
            position={positions[item.id] || { x: 0, y: 0 }}
            onDrag={(x, y) => setPosition(item.id, { x, y })}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderView;
