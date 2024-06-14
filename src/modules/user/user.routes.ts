// user.route.ts

import { Router, Request, Response, NextFunction } from 'express';
import { signUp, login } from './user.controller'; // Import both controllers

const router = Router();

// User Sign Up Route
router.post('/auth/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await signUp(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

// User Login Route
router.post('/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await login(req, res);
  } catch (error) {
    next(error); // Passes errors to the global error handler
  }
});

export default router;
