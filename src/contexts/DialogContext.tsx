import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface DialogButton {
  label: string;
  onClick: () => void;
}

export interface DialogProps {
  title: string;
  message: React.ReactNode;
  icon?: string;
  buttons: DialogButton[];
}

interface DialogContextType {
  isOpen: boolean;
  dialogProps: DialogProps | null;
  openDialog: (props: DialogProps) => void;
  closeDialog: () => void;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogProps | null>(null);

  const openDialog = (props: DialogProps) => {
    setDialogProps(props);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ isOpen, dialogProps, openDialog, closeDialog }}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}; 