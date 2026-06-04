import React from 'react';
import { DialogProps } from '@/store/useDialogStore';

export type DialogType =
  | 'CREDITS'
  | 'EMAIL_SUCCESS'
  | 'EMAIL_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNSAVED_CHANGES';

export const getDialogProps = (type: DialogType, data?: any): DialogProps => {
  const dialogMap: Record<DialogType, (data?: any) => DialogProps> = {
    CREDITS: () => ({
      title: 'Credits',
      message: React.createElement('div', { className: 'space-y-3' }, [
        React.createElement('p', { key: 'credit-1' }, [
          '- Thanks henryjeff (',
          React.createElement(
            'a',
            {
              key: 'link-1',
              href: 'https://github.com/henryjeff',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-blue-600 hover:underline',
            },
            '@henryjeff',
          ),
          '), Renovamen (',
          React.createElement(
            'a',
            {
              key: 'link-2',
              href: 'https://github.com/Renovamen',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-blue-600 hover:underline',
            },
            '@Renovamen',
          ),
          ') for inspiring me about the OS mock portfolio site',
        ]),
        React.createElement('p', { key: 'credit-2' }, [
          '- Thanks ',
          React.createElement(
            'a',
            {
              key: 'link-3',
              href: 'https://infinitemac.org',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-blue-600 hover:underline',
            },
            'infinitemac.org',
          ),
          ' for providing Macintosh emulator to experience Macintosh OS 7-8',
        ]),
        React.createElement('p', { key: 'credit-3' }, [
          '- Thanks Yuan for the spiritual support',
        ]),
        React.createElement('p', { key: 'credit-4' }, [
          '- Thanks DeepSeek for the technical support',
        ]),
        React.createElement('p', { key: 'credit-5' }, [
          '- Thanks Darren Hogan (',
          React.createElement(
            'a',
            {
              key: 'link-5',
              href: 'https://sketchfab.com/Darren.Hogan',
              target: '_blank',
              rel: 'noopener noreferrer',
              className: 'text-blue-600 hover:underline',
            },
            '@Darren.Hogan',
          ),
          ')  for providing the Macintosh 128K Computer (1984) model',
        ]),
      ]),
      icon: '/icons/news.png',
      buttons: [{ label: 'OK', onClick: () => {} }],
    }),

    EMAIL_SUCCESS: (data) => ({
      title: 'Message Sent',
      message: data?.message || 'Your message has been queued for delivery.',
      icon: '/icons/success.png',
      buttons: [
        {
          label: 'OK',
          onClick: data?.onSuccess || (() => {}),
        },
      ],
    }),

    EMAIL_ERROR: (data) => ({
      title: 'Error',
      message: data?.message || 'Failed to send email',
      icon: '/icons/alert.png',
      buttons: [{ label: 'OK', onClick: () => {} }],
    }),

    VALIDATION_ERROR: (data) => ({
      title: 'Validation Error',
      message: data?.message || 'Please check your input and try again.',
      icon: '/icons/alert.png',
      buttons: [{ label: 'OK', onClick: () => {} }],
    }),

    UNSAVED_CHANGES: (props) => ({
      title: 'Unsaved Changes',
      message: 'This document has unsaved changes. What would you like to do?',
      type: 'UNSAVED_CHANGES',
      icon: '/icons/alert.png',
      buttons: [
        {
          label: 'Save',
          onClick: () => props?.onSave?.(),
          primary: true,
        },
        {
          label: 'Close',
          onClick: () => props?.onClose?.(),
        },
      ],
      data: props,
    }),
  };

  return (
    dialogMap[type]?.(data) || {
      title: 'Information',
      message: 'No additional information available.',
      icon: '/icons/about_macintosh.png',
      buttons: [{ label: 'OK', onClick: () => {} }],
    }
  );
};
