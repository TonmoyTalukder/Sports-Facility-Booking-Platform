import { Router } from 'express';
import userRouter from '../modules/user/user.routes';
import facilityRouter from '../modules/facility/facility.route';
import bookingRouter from '../modules/booking/booking.route';

const router = Router();

// Define your base routes here
router.use('/auth', userRouter);
router.use('/facility', facilityRouter);
router.use('/', bookingRouter);

export default router;
