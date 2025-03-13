import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

export const emailFormSchema = z.object({
  subject: z
    .string()
    .min(1, "Subject can't be empty")
    .max(100, "Subject can't exceed 100 characters")
    .refine((val) => !/<script|javascript:/i.test(val), {
      message: 'Subject contains invalid characters',
    }),
  message: z
    .string()
    .min(1, "Message can't be empty")
    .max(1000, "Message can't exceed 1000 characters")
    .refine((val) => !/<script|javascript:|on\w+=/i.test(val), {
      message: 'Message contains invalid characters',
    }),
  sender: z
    .string()
    .min(1, "Sender can't be empty")
    .max(100, "Sender can't exceed 100 characters")
    .email('Please enter a valid email address')
    .refine((val) => !/<script|javascript:/i.test(val), {
      message: 'Sender contains invalid characters',
    }),
  honeyPot: z.string().max(0, 'This field should be empty'),
});

export type EmailFormData = z.infer<typeof emailFormSchema>;

const emailApiUrl = 'http://localhost:3000/api/send-email';

const sendEmail = async (
  data: EmailFormData,
): Promise<{ success: boolean; message: string }> => {
  const response = await fetch(emailApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to send email');
  }

  return response.json();
};

export const useSendEmail = () => {
  return useMutation({
    mutationFn: sendEmail,
    onError: (error) => {
      console.error('Email sending failed:', error);
    },
  });
};
