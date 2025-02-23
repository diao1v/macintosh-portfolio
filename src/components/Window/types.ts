import { ReactNode } from 'react';

export interface Position {
  x: number;
  y: number;
}

export interface WindowProps {
  title: string;
  children: ReactNode;
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
}

export interface ScrollInfo {
  verticalThumbPosition: number;
  horizontalThumbPosition: number;
}

export interface TrackDimensions {
  width: number;
  height: number;
}
