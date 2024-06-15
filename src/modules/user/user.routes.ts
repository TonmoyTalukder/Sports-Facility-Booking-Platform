// user.route.ts

import { Router, Request, Response, NextFunction } from 'express';
import { signUp, login } from './user.controller';

const userRouter = Router();

// User Sign Up Route
userRouter.post('/auth/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await signUp(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

// User Login Route
userRouter.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

export default userRouter;
