import { useState } from 'react';

interface DialogOptions {
  title?: string;
  message: string;
  icon?: string;
  buttons?: Array<{
    label: string;
    onClick: () => void;
    primary?: boolean;
  }>;
}

export const useDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogProps, setDialogProps] = useState<DialogOptions>({
    message: '',
  });

  const openDialog = (options: DialogOptions) => {
    setDialogProps(options);
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    dialogProps,
    openDialog,
    closeDialog,
  };
};
