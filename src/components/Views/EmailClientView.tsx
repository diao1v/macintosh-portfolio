import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDialog } from '@/contexts/DialogContext';
import {
  emailFormSchema,
  useSendEmail,
  type EmailFormData,
  parseApiResponse,
} from '@/api/emailApi';
import { getDialogProps } from '@/config/dialogs';

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
    formState: { errors, isSubmitted },
  } = useForm<EmailFormData>({
    defaultValues: formDefaultValues,
    resolver: zodResolver(emailFormSchema),
    mode: 'onChange',
  });

  const { openDialog } = useDialog();
  const sendEmailMutation = useSendEmail();

  const recipientEmail = import.meta.env.VITE_EMAIL_ADDRESS;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateAndSubmit = (data: EmailFormData) => {
    if (data.recipient) {
      return;
    }

    handleEmailSubmit(data);
  };

  const handleEmailSubmit = (data: EmailFormData) => {
    setIsSubmitting(true);

    sendEmailMutation.mutate(data, {
      onSuccess: (response) => {
        const result = parseApiResponse(response);

        if (result.success) {
          openDialog(
            getDialogProps('EMAIL_SUCCESS', {
              message: result.message,
              onSuccess: () => reset(formDefaultValues),
            }),
          );
        } else {
          openDialog(
            getDialogProps('EMAIL_ERROR', {
              message: result.message,
            }),
          );
        }
        setIsSubmitting(false);
      },
      onError: (error) => {
        openDialog(
          getDialogProps('EMAIL_ERROR', {
            message:
              error instanceof Error ? error.message : 'Failed to send email',
          }),
        );
        setIsSubmitting(false);
      },
    });
  };

  const handleError = () => {
    const errorMessages = Object.values(errors)
      .map((error) => error?.message)
      .filter(Boolean)
      .join('; ');

    if (errorMessages) {
      openDialog(
        getDialogProps('VALIDATION_ERROR', {
          message: errorMessages,
        }),
      );
    }
  };

  useEffect(() => {
    if (isSubmitted && Object.keys(errors).length > 0) {
      handleError();
    }
  }, [isSubmitted, errors]);

  return (
    <form
      onSubmit={handleSubmit(validateAndSubmit, handleError)}
      className="flex flex-col flex-1 font-monaco text-[12px] pr-0"
    >
      {/* Email client header */}
      <div className="flex items-center justify-between p-2 border-b px-6 border-black bg-[#f3f3f3]">
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
              name={name}
              value={value}
              onChange={onChange}
              className="absolute hidden"
            />
          )}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 bg-white border border-black rounded-md shadow-sm font-chicago text-[15px]"
        >
          {isSubmitting ? 'Sending...' : 'Send'}
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
            rows={17}
            maxLength={1000}
            className="w-full p-1 overflow-hidden border-transparent resize-none border-b-1 focus:border-black focus:outline-none scrollbar-hide"
          />
        )}
      />
    </form>
  );
};

export default EmailClientView;
