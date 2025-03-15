import React from 'react';
import { DialogProps } from '@/store/useDialogStore';

export type DialogType =
  | 'CREDITS'
  | 'EMAIL_SUCCESS'
  | 'EMAIL_ERROR'
  | 'VALIDATION_ERROR';

export const getDialogProps = (type: DialogType, data?: any): DialogProps => {
  switch (type) {
    case 'CREDITS':
      return {
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
            ' for providing Macintosh emulator for experiencing Macintosh OS 7-8',
          ]),
          React.createElement('p', { key: 'credit-3' }, [
            '- Thanks Yuan for spiritual support',
          ]),
          React.createElement('p', { key: 'credit-4' }, [
            '- Thanks Deepseek for technical support',
          ]),
        ]),
        icon: '/icons/news.png',
        buttons: [{ label: 'OK', onClick: () => {} }],
      };

    case 'EMAIL_SUCCESS':
      return {
        title: 'Message Sent',
        message: data?.message || 'Your message has been queued for delivery.',
        icon: '/icons/success.png',
        buttons: [
          {
            label: 'OK',
            onClick: data?.onSuccess || (() => {}),
          },
        ],
      };

    case 'EMAIL_ERROR':
      return {
        title: 'Error',
        message: data?.message || 'Failed to send email',
        icon: '/icons/alert.png',
        buttons: [{ label: 'OK', onClick: () => {} }],
      };

    case 'VALIDATION_ERROR':
      return {
        title: 'Validation Error',
        message: data?.message || 'Please check your input and try again.',
        icon: '/icons/alert.png',
        buttons: [{ label: 'OK', onClick: () => {} }],
      };

    default:
      return {
        title: 'Information',
        message: 'No additional information available.',
        icon: '/icons/info.png',
        buttons: [{ label: 'OK', onClick: () => {} }],
      };
  }
};
