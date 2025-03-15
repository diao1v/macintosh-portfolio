import { create } from 'zustand';

export interface DialogButton {
  label: string;
  onClick: () => void;
  primary?: boolean;
}

export interface DialogProps {
  title: string;
  message: React.ReactNode;
  icon?: string;
  buttons: DialogButton[];
}

interface DialogStore {
  isOpen: boolean;
  dialogProps: DialogProps | null;
  openDialog: (props: DialogProps) => void;
  closeDialog: () => void;
}

const useDialogStore = create<DialogStore>((set) => ({
  isOpen: false,
  dialogProps: null,
  openDialog: (props: DialogProps) => set({ isOpen: true, dialogProps: props }),
  closeDialog: () => set({ isOpen: false }),
}));

export default useDialogStore; 