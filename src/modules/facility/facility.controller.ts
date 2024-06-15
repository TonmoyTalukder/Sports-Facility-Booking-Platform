import { Request, Response } from 'express';
import Facility, { IFacility } from './facility.model';
import { Types } from 'mongoose';

// Create a facility
export const createFacility = async (req: Request, res: Response): Promise<void> => {
    const { name, description, pricePerHour, location } = req.body;

    try {
        const newFacility = new Facility({
            name,
            description,
            pricePerHour,
            location,
        }) as IFacility & { _id: any }; // Explicitly typing newFacility to ensure _id is recognized correctly

        await newFacility.save();

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Facility added successfully',
            data: {
                _id: newFacility._id.toString(),
                name: newFacility.name,
                description: newFacility.description,
                pricePerHour: newFacility.pricePerHour,
                location: newFacility.location,
                isDeleted: newFacility.isDeleted,
            },
        });
    } catch (error) {
        console.error('Error creating facility:', error);
        res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Server error. Please try again later.',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};


// Update a facility by ID
export const updateFacility = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, pricePerHour, location } = req.body;
  
    try {
      // Find the facility by ID and update it using lean() to get a plain object
      const updatedFacility = await Facility.findByIdAndUpdate(
        id,
        { name, description, pricePerHour, location },
        { new: true, runValidators: true, lean: true } // using lean()
      );
  
      if (!updatedFacility) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Facility not found',
        });
        return;
      }
  
      // Send the updated facility data in the response
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Facility updated successfully',
        data: {
          ...updatedFacility,
          _id: updatedFacility._id.toString(), // Ensure _id is a string
        },
      });
    } catch (error) {
      console.error('Error updating facility:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Server error. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };


// Soft delete a facility by ID (Admin Only)
export const deleteFacility = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
  
    try {
      // Find the facility by ID and update its isDeleted field to true
      const deletedFacility = await Facility.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true } // Return the updated document
      ) as (IFacility & { _id: Types.ObjectId }) | null; // Use type assertion here
  
      if (!deletedFacility) {
        res.status(404).json({
          success: false,
          statusCode: 404,
          message: 'Facility not found',
        });
        return;
      }
  
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Facility deleted successfully',
        data: {
          _id: deletedFacility._id.toString(), // Ensure _id is recognized as a string
          name: deletedFacility.name,
          description: deletedFacility.description,
          pricePerHour: deletedFacility.pricePerHour,
          location: deletedFacility.location,
          isDeleted: deletedFacility.isDeleted,
        },
      });
    } catch (error) {
      console.error('Error deleting facility:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Server error. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };


// Get all facilities
export const getAllFacilities = async (req: Request, res: Response): Promise<void> => {
    try {
      // Find all facilities
      const facilities = await Facility.find({}).lean() as (IFacility & { _id: string })[];
  
      res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'Facilities retrieved successfully',
        data: facilities.map(facility => ({
          _id: facility._id.toString(),
          name: facility.name,
          description: facility.description,
          pricePerHour: facility.pricePerHour,
          location: facility.location,
          isDeleted: facility.isDeleted,
        })),
      });
    } catch (error) {
      console.error('Error retrieving facilities:', error);
      res.status(500).json({
        success: false,
        statusCode: 500,
        message: 'Server error. Please try again later.',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };