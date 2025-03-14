import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDialog } from '@/hooks/useDialog';
import Dialog from '@/components/Dialog/Dialog';
import {
  emailFormSchema,
  useSendEmail,
  type EmailFormData,
} from '@/api/emailApi';

const EmailClientView: React.FC = () => {
  const formDefaultValues: EmailFormData = {
    subject: '',
    message: '',
    email: '',
    recipient: '',
  };

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormData>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(emailFormSchema),
  });

  const { isOpen, dialogProps, openDialog, closeDialog } = useDialog();
  const sendEmailMutation = useSendEmail();

  const recipientEmail = import.meta.env.VITE_EMAIL_ADDRESS;

  const validateAndSubmit = (data: EmailFormData) => {
    if (data.recipient) {
      return;
    }

    handleEmailSubmit(data);
  };

  const handleEmailSubmit = (data: EmailFormData) => {
    sendEmailMutation.mutate(data, {
      onSuccess: (response) => {
        openDialog({
          title: 'Message Sent',
          message:
            response.message || 'Your message has been queued for delivery.',
          icon: '/icons/success.png',
          buttons: [
            {
              label: 'OK',
              onClick: () => reset(formDefaultValues),
            },
          ],
        });
      },
      onError: (error) => {
        openDialog({
          title: 'Error',
          message:
            error instanceof Error ? error.message : 'Failed to send email',
          icon: '/icons/alert.png',
          buttons: [{ label: 'OK', onClick: () => {} }],
        });
      },
    });
  };

  const handleError = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
      .join('; ');

    if (errorMessages) {
      openDialog({
        title: 'Validation Error',
        message: errorMessages,
        icon: '/icons/alert.png',
        buttons: [{ label: 'OK', onClick: () => {} }],
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(validateAndSubmit, handleError)}
      className="flex flex-col flex-1  font-monaco text-[20px]"
    >
      <Dialog {...dialogProps} isOpen={isOpen} onClose={closeDialog} />
      {/* Email client header */}
      <div className="flex items-center justify-between p-2 border-b  pl-4 border-black bg-[#f3f3f3]">
        <button disabled className="rounded-md shadow-sm cursor-not-allowed">
          <img src="/icons/eudora1.png" alt="QP" />
        </button>
        <button disabled className="rounded-md shadow-sm cursor-not-allowed">
          <img src="/icons/eudora2.png" alt="connect" />
        </button>
        <button disabled className="rounded-md shadow-sm cursor-not-allowed">
          <img src="/icons/eudora3.png" alt="wrap" />
        </button>
        <button disabled className="rounded-md shadow-sm cursor-not-allowed">
          <img src="/icons/eudora4.png" alt="duplicate" />
        </button>
        <Controller
          control={control}
          name="recipient"
          render={({ field: { name, value, onChange } }) => (
            <input
              type="hidden"
              name={name}
              value={value}
              onChange={onChange}
              className="absolute"
            />
          )}
        />

        <button
          type="submit"
          className="px-4 bg-white border border-black rounded-md shadow-sm font-chicago text-[15px]"
        >
          Send
        </button>
      </div>

      {/* Email header section*/}
      <div className="flex flex-row justify-start flex-grow border-b border-black">
        <div className="flex flex-col justify-end pl-10 w-30">
          <div className="flex flex-row justify-end">To :</div>
          <div className="flex flex-row justify-end">From :</div>
          <div className="flex flex-row justify-end">Subject :</div>
          <div className="flex flex-row justify-end">X-Attachments :</div>
        </div>
        <div className="flex flex-col justify-start flex-1 pl-3 ">
          <p>{recipientEmail}</p>
          <Controller
            control={control}
            name="email"
            render={({ field: { name, value, onChange } }) => (
              <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border-transparent border-b-1 focus:border-black focus:outline-none"
              />
            )}
          />
          <Controller
            control={control}
            name="subject"
            render={({ field: { name, value, onChange } }) => (
              <input
                name={name}
                value={value}
                onChange={onChange}
                className="w-full border-transparent border-b-1 focus:border-black focus:outline-none"
              />
            )}
          />
          <p className="text-gray-400">Attachment is disabled</p>
        </div>
      </div>

      <Controller
        control={control}
        name="message"
        render={({ field: { name, value, onChange } }) => (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={11}
            maxLength={1000}
            className="w-full p-1 overflow-hidden border-transparent resize-none border-b-1 focus:border-black focus:outline-none scrollbar-hide"
          />
        )}
      />
    </form>
  );
};

export default EmailClientView;
