import { ErrorRequestHandler } from 'express';

// Custom error types
export class CustomError extends Error {
  statusCode: number;
  errorMessages?: any[];
  stack?: string;

  constructor(message: string, statusCode: number, errorMessages?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errorMessages = errorMessages;
    // Ensure stack is captured correctly
    Error.captureStackTrace(this, CustomError);
  }
}

// Error handler middleware
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const {
    statusCode = 500,
    message = 'Server Error',
    errorMessages,
    stack,
  } = err;

  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack,
  });
};
