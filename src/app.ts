import express, { Request, Response } from 'express';
import cors from 'cors';

import globalErrorHandler from './middleware/globalErrorhandler';
import notFoundHandler from './middleware/notFound';
import router from './routes';

const app = express();

// Parsers
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Sports Facility Booking Platform API');
});

// Global error handler
app.use(globalErrorHandler);

// Not Found handler middleware
app.use(notFoundHandler);

export default app;
