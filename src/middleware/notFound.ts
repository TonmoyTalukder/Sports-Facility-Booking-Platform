import { Request, Response, NextFunction } from 'express';

const notFoundHandler = (req: Request, res: Response, _next: NextFunction) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: 'Not Found',
  });
};

export default notFoundHandler;
