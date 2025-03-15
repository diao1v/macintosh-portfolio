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
  email: z
    .string()
    .min(1, "Sender can't be empty")
    .max(100, "Sender can't exceed 100 characters")
    .email('Please enter a valid email address')
    .refine((val) => !/<script|javascript:/i.test(val), {
      message: 'Sender contains invalid characters',
    }),
  recipient: z.string().max(0, 'Recipient'),
});

export type EmailFormData = z.infer<typeof emailFormSchema>;

const emailApiUrl = import.meta.env.VITE_EMAIL_API;

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

/**
 * Parses the API response and determines if it was successful
 * @param response The API response object
 * @returns An object with success status and message
 */
export const parseApiResponse = (response: any) => {
  try {
    if (response.statusCode !== undefined && response.body) {
      const bodyData =
        typeof response.body === 'string'
          ? JSON.parse(response.body)
          : response.body;

      if (response.statusCode === 200 && bodyData.message) {
        return {
          success: true,
          message: bodyData.message,
        };
      } else {
        return {
          success: false,
          message: bodyData.error || 'An unknown error occurred',
        };
      }
    }
    return {
      success: false,
      message: 'Invalid response format from server',
    };
  } catch (error) {
    console.error('Error parsing API response:', error);
    return {
      success: false,
      message: 'Failed to process server response',
    };
  }
};
