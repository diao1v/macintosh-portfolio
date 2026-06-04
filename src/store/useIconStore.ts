import { create } from 'zustand';

export interface Position {
  x: number;
  y: number;
}

interface IconStore {
  positions: Record<string, Position>;
  /** Update a single icon's position (used while dragging). */
  setPosition: (id: string, pos: Position) => void;
  /**
   * Seed default positions for any ids that don't have one yet. Existing
   * positions are left untouched, and the state reference is preserved when
   * nothing changes to avoid needless re-renders.
   */
  ensurePositions: (items: { id: string; pos: Position }[]) => void;
}

const useIconStore = create<IconStore>((set) => ({
  positions: {},

  setPosition: (id, pos) =>
    set((state) => ({ positions: { ...state.positions, [id]: pos } })),

  ensurePositions: (items) =>
    set((state) => {
      const positions = { ...state.positions };
      let changed = false;
      for (const { id, pos } of items) {
        if (!(id in positions)) {
          positions[id] = pos;
          changed = true;
        }
      }
      return changed ? { positions } : state;
    }),
}));

export default useIconStore;
