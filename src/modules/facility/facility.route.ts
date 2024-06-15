import { Router, Request, Response, NextFunction } from 'express';
import { createFacility, deleteFacility, getAllFacilities, updateFacility } from './facility.controller';
import { protect } from '../../middleware/authMiddleware';

const facilityRouter = Router();

// Route to create a new facility, only accessible by admin
facilityRouter.post(
    '/facility',
    protect(['admin']), // Ensuring only admins can create facilities
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await createFacility(req, res);
        } catch (error) {
            next(error); // Passes errors to the global error handler
        }
    }
);

// Update an existing facility (Admin only)
facilityRouter.put(
    '/facility/:id',
    protect(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await updateFacility(req, res);
        } catch (error) {
            next(error); // Passes errors to the global error handler
        }
    }
);

// Soft delete a facility by ID (Admin Only)
facilityRouter.delete(
    '/facility/:id',
    protect(['admin']),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await deleteFacility(req, res);
        } catch (error) {
            next(error); // Passes errors to the global error handler
        }
    }
);

// Route to get all facilities
facilityRouter.get(
    '/facility/',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await getAllFacilities(req, res);
        } catch (error) {
            next(error); // Passes errors to the global error handler
        }
    }
);

export default facilityRouter;
