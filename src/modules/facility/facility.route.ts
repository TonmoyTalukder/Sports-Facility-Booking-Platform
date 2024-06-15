import { Router, Request, Response, NextFunction } from 'express';
import {
  createFacility,
  deleteFacility,
  getAllFacilities,
  updateFacility,
} from './facility.controller';
import { protect } from '../../middleware/authMiddleware';
import { validate } from '../../config';
import {
  createFacilitySchema,
  updateFacilitySchema,
  deleteFacilitySchema,
} from './facility.validation';

const facilityRouter = Router();

// Route to create a new facility, only accessible by admin
facilityRouter.post(
  '/',
  protect(['admin']), // Ensuring only admins can create facilities
  validate(createFacilitySchema), // Validate request body for creating a facility
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await createFacility(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// Update an existing facility (Admin only)
facilityRouter.put(
  '/:id',
  protect(['admin']),
  validate(updateFacilitySchema), // Validate request params and body for updating a facility
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await updateFacility(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// Soft delete a facility by ID (Admin Only)
facilityRouter.delete(
  '/:id',
  protect(['admin']),
  validate(deleteFacilitySchema), // Validate request params for deleting a facility
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await deleteFacility(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

// Route to get all facilities
facilityRouter.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getAllFacilities(req, res);
    } catch (error) {
      next(error); // Passes errors to the global error handler
    }
  },
);

export default facilityRouter;
