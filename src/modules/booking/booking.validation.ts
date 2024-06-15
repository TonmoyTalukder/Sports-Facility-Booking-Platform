import { z } from 'zod';

// Schema for checking availability
export const checkAvailabilitySchema = z.object({
  query: z.object({
    date: z
      .string()
      .min(1, 'Date is required')
      .refine((val) => !isNaN(Date.parse(val)), {
        message: 'Invalid date format for date',
      }),
  }),
});

// Schema for creating a booking
export const createBookingSchema = z.object({
  body: z.object({
    facility: z.string().min(1, 'Facility ID is required'),
    date: z.string().min(1, 'Date is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
  }),
});

// Schema for getting bookings by user
export const getBookingsByUserSchema = z.object({
  query: z.object({
    userId: z.string().min(1, 'User ID is required').optional(),
  }),
});

// Schema for cancelling a booking
export const cancelBookingSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Booking ID is required'),
  }),
});
