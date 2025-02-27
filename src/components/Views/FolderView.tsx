import React from 'react';
import DesktopIcon from '../DesktopIcon/DesktopIcon';
import { File } from '@/store/useFileStore';
import { Position } from '../Window/types';

interface FolderViewProps {
  file: File;
  onOpenFolder?: (file: File) => void;
  onItemClick?: (id: string) => void;
  onIconDrag?: (id: string, x: number, y: number) => void;
  getIconPosition?: (id: string) => Position;
  selectedItemId?: string | null;
}

const FolderView: React.FC<FolderViewProps> = ({
  file,
  onOpenFolder,
  onItemClick,
  onIconDrag,
  getIconPosition,
  selectedItemId,
}) => {
  return (
    <div className='h-full p-2'>
      <div className='relative w-full h-full' style={{ minWidth: '400px' }}>
        {file.children?.map((item) => (
          <DesktopIcon
            key={item.id}
            name={item.name}
            icon={item.icon}
            onDoubleClick={() => onOpenFolder?.(item)}
            isSelected={selectedItemId === item.id}
            onClick={() => onItemClick?.(item.id)}
            position={getIconPosition?.(item.id) || { x: 0, y: 0 }}
            onDrag={(x, y) => onIconDrag?.(item.id, x, y)}
          />
        ))}
      </div>
    </div>
  );
};

export default FolderView; 