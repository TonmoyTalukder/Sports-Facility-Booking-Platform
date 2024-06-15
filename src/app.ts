import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRouter from './modules/user/user.routes';
import facilityRouter from './modules/facility/facility.route';
import bookingRouter from './modules/booking/booking.route';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRouter);
app.use('/api', facilityRouter);
app.use('/api', bookingRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Sports Facility Booking Platform API');
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Global Error:', err);
  res.status(500).json({
    success: false,
    message: 'Server error. Please try again later.',
    error: err.message,
  });
});

export default app;
