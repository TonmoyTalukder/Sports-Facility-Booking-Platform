import { Request, Response, NextFunction } from 'express';

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
//   console.error('Global Error:', err);
  
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    errorMessages: err.errorMessages || [],
    stack: err.stack || '',
  });
};

export default globalErrorHandler;
