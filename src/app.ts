import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import globalErrorHandler from './middleware/globalErrorhandler';
import notFoundHandler from './middleware/notFound';
import userRouter from './modules/user/user.routes';
import facilityRouter from './modules/facility/facility.route';
import bookingRouter from './modules/booking/booking.route';
import router from './routes';

const app = express();

// Parsers
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api', userRouter);
// app.use('/api', facilityRouter);
// app.use('/api', bookingRouter);
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Sports Facility Booking Platform API');
});

// Global error handler
app.use(globalErrorHandler);

// Not Found handler middleware
app.use(notFoundHandler);

export default app;
