import { Router, Request, Response, NextFunction } from 'express';
import { signUp, login } from './user.controller';
import { validate } from '../../middleware/validate';
import { loginSchema, signUpSchema } from './user.validation';

const userRouter = Router();

// User Sign Up Route
userRouter.post('/signup', 
  validate(signUpSchema),
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    await signUp(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

// User Login Route
userRouter.post('/login', 
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

export default userRouter;
