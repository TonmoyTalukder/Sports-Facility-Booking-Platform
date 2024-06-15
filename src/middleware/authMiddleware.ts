import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../modules/user/user.model';
import config from '../config';

// Define an interface for the authenticated request to include user information
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
  };
}

// Protect middleware to ensure only authenticated users can access
export const protect = (roles: string[] = []) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      let token;

      // Check if the token is provided in the authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Extract the token from the authorization header
        token = req.headers.authorization.split(' ')[1];

        // Verify the token with the secret key
        const decoded = jwt.verify(token, config.jwt_secret) as { id: string };

        // Attach the decoded user information to the request object
        req.user = { _id: decoded.id };

        // Retrieve the user from the database
        const user = await User.findById(req.user._id) as IUser | null;
        if (!user) {
          return res.status(404).json({
            success: false,
            statusCode: 404,
            message: 'Not found',
          });
        }

        // Check if the user has the required role
        if (roles.length && !roles.includes(user.role)) {
          return res.status(403).json({
            success: false,
            statusCode: 403,
            message: 'Forbidden: You do not have access to this resource',
          });
        }
        
        next();
      } else {
        throw new Error('Unauthorized: No token provided');
      }
    } catch (error) {
      // Narrow down the type of error and handle it accordingly
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: 'Invalid token',
        });
      } else if (error instanceof Error) {
        return res.status(401).json({
          success: false,
          statusCode: 401,
          message: error.message || 'Not authorized, token failed',
        });
      } else {
        return res.status(500).json({
          success: false,
          statusCode: 500,
          message: 'An unknown error occurred',
        });
      }
    }
  };
};
