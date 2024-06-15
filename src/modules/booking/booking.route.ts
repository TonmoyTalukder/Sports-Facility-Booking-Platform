import { NextFunction, Request, Response, Router } from 'express';
import {
  cancelBooking,
  checkAvailability,
  createBooking,
  getAllBookings,
  getBookingsByUser,
} from './booking.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../config';
import {
  checkAvailabilitySchema,
  createBookingSchema,
  getBookingsByUserSchema,
  cancelBookingSchema,
} from './booking.validation';

const bookingRouter = Router();

// Route to check availability
bookingRouter.get(
  '/check-availability',
  validate(checkAvailabilitySchema), // Validate query params for checking availability
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await checkAvailability(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

bookingRouter.post(
  '/bookings',
  protect(['user']),
  validate(createBookingSchema), // Validate request body for creating a booking
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createBooking(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// View all bookings route (admin only)
bookingRouter.get(
  '/bookings',
  protect(['admin']),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllBookings(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// View bookings by user (user only)
bookingRouter.get(
  '/bookings/user',
  protect(['user']),
  validate(getBookingsByUserSchema), // Validate query params for getting bookings by user
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getBookingsByUser(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// Cancel a booking (User Only)
bookingRouter.delete(
  '/bookings/:id',
  protect(['user']),
  validate(cancelBookingSchema), // Validate request params for cancelling a booking
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await cancelBooking(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

export default bookingRouter;
