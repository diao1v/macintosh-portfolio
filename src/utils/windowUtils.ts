import useFileStore from '@/store/useFileStore';
import { getDialogProps } from '@/config/dialogs';
import { DialogProps } from '@/store/useDialogStore';

export const handleWindowClose = (
  windowId: string,
  onClose: () => void,
  openDialog?: (dialogProps: DialogProps) => void
) => {
  // Check if there are unsaved changes
  if (useFileStore.getState().hasUnsavedChanges(windowId)) {
    if (openDialog) {
      openDialog(getDialogProps('UNSAVED_CHANGES', {
        fileId: windowId,
        onSave: () => {
          useFileStore.getState().saveFile(windowId);
          onClose();
        },
        onClose: () => {
          onClose();
        }
      }));
    }
  } else {
    onClose();
  }
}; 