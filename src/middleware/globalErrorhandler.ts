import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

interface CustomError extends Error {
  statusCode?: number;
  errorMessages?: string[];
}

function globalErrorHandler(
  err: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Log the error if needed
  // console.error('Global Error:', err);

  // Send JSON response with appropriate status code and error details
  res.status(err.statusCode || 500).json({
    success: false,
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    errorMessages: err.errorMessages || [],
    stack: err.stack || '',
  });
}

export default globalErrorHandler;

export const generateToken = (userId: string): string => {
  // Throw an error if jwt_secret is not defined in the config
  if (!config.jwt_secret) {
    throw new Error('JWT secret is not defined');
  }

  // Generate JWT token with userId payload and 30 days expiration
  return jwt.sign({ id: userId }, config.jwt_secret, {
    expiresIn: '30d',
  });
};
