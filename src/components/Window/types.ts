import { ReactNode } from 'react';
import { File } from '@/store/useFileStore';

export interface Position {
  x: number;
  y: number;
}

export interface WindowProps {
  id: string;
  title: string;
  onClose: () => void;
  position: Position;
  isFocused?: boolean;
  onFocus?: () => void;
  zIndex?: number;
  type?: 'folder' | 'about';
  itemCount?: number;
  diskSpace?: string;
  onZoom?: () => void;
  width?: number;
  height?: number;
  onPositionChange?: (x: number, y: number) => void;
  onOpenFolder?: (file: File) => void;
  onItemClick?: (id: string) => void;
  onIconDrag?: (id: string, x: number, y: number) => void;
  getIconPosition?: (id: string) => Position;
  selectedItemId?: string | null;
  children?: React.ReactNode;
}

export interface ScrollInfo {
  verticalThumbPosition: number;
  horizontalThumbPosition: number;
}

export interface TrackDimensions {
  width: number;
  height: number;
}
