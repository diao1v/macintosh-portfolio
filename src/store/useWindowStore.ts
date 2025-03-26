import { create } from 'zustand';
import { Z_INDEX } from '@/constants';
import { File } from './useFileStore';

interface Position {
  x: number;
  y: number;
}

interface WindowState {
  id: string;
  title: string;
  type:
    | 'about'
    | 'folder'
    | 'project'
    | 'text'
    | 'contact'
    | 'link'
    | 'scrapbook'
    | 'code'
    | 'pdf';
  isOpen: boolean;
  position: Position;
  zIndex: number;
  width?: number;
  height?: number;
  diskSpace?: string;
  className?: string;
  isZoomed?: boolean;
  originalSize?: {
    width: number;
    height: number;
  };
  children?: File[];
  content?: string;
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
        win.id === id ? { ...win, isOpen: false } : win,
      ),
      focusedWindowId:
        state.focusedWindowId === id ? '' : state.focusedWindowId,
    })),

  focusWindow: (id) =>
    set((state) => {
      const newZIndex =
        Math.max(...state.windows.map((w) => w.zIndex), Z_INDEX.WINDOW_MIN) + 1;

      return {
        focusedWindowId: id,
        topZIndex: newZIndex,
        windows: state.windows.map((win) =>
          win.id === id ? { ...win, zIndex: newZIndex } : win,
        ),
      };
    }),

  setWindowPosition: (id, position) =>
    set((state) => ({
      windows: state.windows.map((win) =>
        win.id === id ? { ...win, position } : win,
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
              width: Math.min(originalWidth * 1.5, maxWidth),
              height: Math.min(originalHeight * 1.5, maxHeight),
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
    set((state) => {
      // Find existing window
      const existingWindow = state.windows.find((w) => w.id === id);

      if (existingWindow) {
        // Update existing window
        return {
          windows: state.windows.map((win) =>
            win.id === id ? { ...win, isOpen: true } : win,
          ),
        };
      }

      // If window doesn't exist, create new one (for 'about' window case)
      const newWindow: WindowState = {
        id,
        title: id === 'about' ? 'About This Portfolio' : '',
        type: 'about',
        isOpen: true,
        position: { x: 40, y: 40 },
        zIndex: state.topZIndex + 1,
      };

      return {
        windows: [...state.windows, newWindow],
      };
    }),
}));

export default useWindowStore;
