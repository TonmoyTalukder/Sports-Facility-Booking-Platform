import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next(); // Proceed if validation passes
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map(err => ({
        path: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: 'Validation Error',
        errorMessages,
        stack: error.stack, 
      });
    }
    next(error); // Pass other types of errors to the global error handler
  }
};
