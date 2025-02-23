import { create } from 'zustand';
import { File } from '../config/files';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  id: string;
  title: string;
  type: 'about' | 'folder';
  isOpen: boolean;
  position: Position;
  content?: File[];
  width?: number;
  height?: number;
  zIndex: number;
  diskSpace?: string;
  className?: string;
  isZoomed?: boolean;
  originalSize?: {
    width: number;
    height: number;
  };
}

interface WindowStore {
  windows: WindowState[];
  focusedWindowId: string;
  topZIndex: number;
  addWindow: (window: WindowState) => void;
  closeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  setWindowPosition: (id: string, position: Position) => void;
  toggleWindowZoom: (id: string) => void;
  openWindow: (id: string) => void;
}

const useWindowStore = create<WindowStore>((set) => ({
  windows: [
    {
      id: 'about',
      title: 'About This Portfolio',
      type: 'about',
      isOpen: true,
      position: { x: 40, y: 40 },
      zIndex: 1,
    },
  ],
  focusedWindowId: 'about',
  topZIndex: 1,

  addWindow: (window) =>
    set((state) => ({
      windows: [...state.windows, window],
    })),

  closeWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, isOpen: false } : win
      ),
      focusedWindowId:
        state.focusedWindowId === id ? '' : state.focusedWindowId,
    })),

  focusWindow: (id) =>
    set((state) => {
      const newZIndex = state.topZIndex + 1;
      return {
        focusedWindowId: id,
        topZIndex: newZIndex,
        windows: state.windows.map((win) =>
          win.id === id ? { ...win, zIndex: newZIndex } : win
        ),
      };
    }),

  setWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, position } : win
      ),
    })),

  toggleWindowZoom: (id) =>
    set((state) => ({
      windows: state.windows.map((win) => {
        if (win.id === id) {
          if (!win.isZoomed) {
            const originalWidth = win.width || 400;
            const originalHeight = win.height || 300;
            const maxWidth = window.innerWidth - 40;
            const maxHeight = window.innerHeight - 20;

            return {
              ...win,
              isZoomed: true,
              originalSize: {
                width: originalWidth,
                height: originalHeight,
              },
              width: Math.min(originalWidth * 2, maxWidth),
              height: Math.min(originalHeight * 2, maxHeight),
              className: 'transition-all duration-200 ease-in-out',
            };
          } else {
            return {
              ...win,
              isZoomed: false,
              width: win.originalSize?.width,
              height: win.originalSize?.height,
              originalSize: undefined,
              className: 'transition-all duration-200 ease-in-out',
            };
          }
        }
        return win;
      }),
    })),

  openWindow: (id) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, isOpen: true } : win
      ),
    })),
}));

export default useWindowStore;
