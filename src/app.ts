import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import userRoutes from './modules/user/user.routes'; // Example route import

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', userRoutes);

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
