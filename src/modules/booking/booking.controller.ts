import { Request, Response } from 'express';
import Booking, { IBooking } from './booking.model';
import Facility, { IFacility } from '../facility/facility.model';
import moment from 'moment';
import { Document, Types } from 'mongoose';
import { CustomError } from '../../utils/error';


interface AuthenticatedRequest extends Request {
    user?: {
        _id: string;
    };
}
// Check the availability of time slots for booking on a specific date 
export const checkAvailability = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get the date from the query parameters or default to today's date
        const queryDate = req.query.date as string | undefined;
        const date = queryDate ? moment(queryDate, 'YYYY-MM-DD').startOf('day').toDate() : moment().startOf('day').toDate();

        // Retrieve all bookings for the specified date
        const bookings = await Booking.find({
            date: {
                $gte: moment(date).startOf('day').toDate(),
                $lte: moment(date).endOf('day').toDate()
            },
            isBooked: 'confirmed'
        }).lean();

        // Define total available time slots 
        const totalSlots = [
            { startTime: "08:00", endTime: "10:00" },
            { startTime: "10:00", endTime: "12:00" },
            { startTime: "12:00", endTime: "14:00" },
            { startTime: "14:00", endTime: "16:00" },
            { startTime: "16:00", endTime: "18:00" },
            { startTime: "18:00", endTime: "20:00" }
        ];

        // Filter out booked slots from total available slots
        const availableSlots = totalSlots.filter(slot => {
            const slotStart = moment(slot.startTime, 'HH:mm').toDate();
            const slotEnd = moment(slot.endTime, 'HH:mm').toDate();

            return !bookings.some(booking => {
                const bookingStart = moment(booking.startTime).toDate();
                const bookingEnd = moment(booking.endTime).toDate();

                return (bookingStart < slotEnd && bookingEnd > slotStart); // Check for overlap
            });
        });

        // Check if availableSlots array is empty
        if (availableSlots.length === 0) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: [],
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Availability checked successfully',
            data: availableSlots,
        });
    } catch (error: any) {
        // console.error('Error checking availability:', error);
        if (error.code === 11000) {
            throw new CustomError(`Duplicate entry: ${error.message}`, 400, [{ path: '', message: error.message }]);
        }

        throw new CustomError('Server error. Please try again later.', 500);
    }
};

// Create a new booking
export const createBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        const { facility, date, startTime, endTime } = req.body;
        const userId = req.user?._id;

        // Ensure userId is valid
        if (!userId) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'Unauthorized: User ID not found',
            });
            return;
        }

        // Parse and validate dates and times
        const bookingDate = moment(date, 'YYYY-MM-DD', true);
        const bookingStartTime = moment(startTime, 'HH:mm', true);
        const bookingEndTime = moment(endTime, 'HH:mm', true);

        if (!bookingDate.isValid() || !bookingStartTime.isValid() || !bookingEndTime.isValid()) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Invalid date or time format',
            });
            return;
        }

        // Combine date with startTime and endTime
        const bookingStart = moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm', true);
        const bookingEnd = moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm', true);

        if (!bookingStart.isValid() || !bookingEnd.isValid() || bookingEnd.isSameOrBefore(bookingStart)) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Invalid start or end time',
            });
            return;
        }

        // Check if the facility exists
        const facilityDoc = await Facility.findById(facility);
        if (!facilityDoc) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'Facility not found',
            });
            return;
        }

        // Check for availability
        const existingBookings = await Booking.find({
            facility,
            date: bookingDate.toDate(),
            $or: [
                { startTime: { $lt: bookingEnd.toDate() }, endTime: { $gt: bookingStart.toDate() } },
            ],
        });

        if (existingBookings.length > 0) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: 'Facility is unavailable for the requested time slot',
            });
            return;
        }

        // Calculate payable amount
        const durationInHours = moment.duration(bookingEnd.diff(bookingStart)).asHours();
        const payableAmount = durationInHours * facilityDoc.pricePerHour; // Adjust as per your pricing logic

        // Create the new booking
        const newBooking: IBooking = new Booking({
            facility,
            date: bookingDate.toDate(),
            startTime: bookingStart.toDate(),
            endTime: bookingEnd.toDate(),
            user: userId,
            payableAmount,
            isBooked: 'confirmed', // Assuming default status for new bookings
        });

        // Save the booking
        const savedBooking = await newBooking.save() as IBooking & Document & { _id: Types.ObjectId };

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Booking created successfully',
            data: {
                _id: savedBooking._id.toString(),
                facility: savedBooking.facility.toString(),
                date: moment(savedBooking.date).format('YYYY-MM-DD'),
                startTime: moment(savedBooking.startTime).format('HH:mm'),
                endTime: moment(savedBooking.endTime).format('HH:mm'),
                user: savedBooking.user.toString(),
                payableAmount: savedBooking.payableAmount,
                isBooked: savedBooking.isBooked,
            },
        });
    } catch (error: any) {
        if (error.code === 11000) {
            throw new CustomError(`Duplicate entry: ${error.message}`, 400, [{ path: '', message: error.message }]);
        }

        throw new CustomError('Server error. Please try again later.', 500);
    }
};

// Get all bookings (admin only)
export const getAllBookings = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all bookings and populate facility and user details
        const bookings = await Booking.find()
            .populate({
                path: 'facility',
                select: '_id name description pricePerHour location isDeleted',
            })
            .populate({
                path: 'user',
                select: '_id name email phone role address',
            });

        // Check if bookings were found
        if (!bookings) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved successfully',
            data: bookings.map(booking => ({
                _id: booking._id,
                facility: booking.facility,
                date: moment(booking.date).format('YYYY-MM-DD'),
                startTime: moment(booking.startTime).format('HH:mm'),
                endTime: moment(booking.endTime).format('HH:mm'),
                user: booking.user,
                payableAmount: booking.payableAmount,
                isBooked: booking.isBooked,
            })),
        });
    } catch (error: any) {
        // console.error('Error retrieving bookings:', error);
        if (error.code === 11000) {
            throw new CustomError(`Duplicate entry: ${error.message}`, 400, [{ path: '', message: error.message }]);
        }

        throw new CustomError('Server error. Please try again later.', 500);
    }
};

// Get bookings by user (user only)
export const getBookingsByUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
        // Get the authenticated user ID from the request
        const userId = req.user?._id;

        // Ensure userId is valid
        if (!userId) {
            res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'Unauthorized: User ID not found',
            });
            return;
        }

        // Fetch bookings for the authenticated user
        const bookings = await Booking.find({ user: userId })
            .populate({
                path: 'facility',
                select: '_id name description pricePerHour location isDeleted',
            });

        // Check if bookings were found
        if (!bookings || bookings.length === 0) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: []
            });
            return;
        }

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved successfully',
            data: bookings.map(booking => ({
                _id: booking._id,
                facility: booking.facility,
                date: moment(booking.date).format('YYYY-MM-DD'),
                startTime: moment(booking.startTime).format('HH:mm'),
                endTime: moment(booking.endTime).format('HH:mm'),
                user: booking.user.toString(), // Only return user ID
                payableAmount: booking.payableAmount,
                isBooked: booking.isBooked,
            })),
        });
    } catch (error: any) {
        // console.error('Error retrieving user bookings:', error);
        if (error.code === 11000) {
            throw new CustomError(`Duplicate entry: ${error.message}`, 400, [{ path: '', message: error.message }]);
        }

        throw new CustomError('Server error. Please try again later.', 500);
    }
};

// Cancel booking by user (user only)
export const cancelBooking = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    const userId = req.user?._id;
    const bookingId = req.params.id;

    try {
        // Find the booking by ID and populate the facility details
        const updatedBooking = await Booking.findById(bookingId)
            .populate({
                path: 'facility',
                select: '_id name description pricePerHour location isDeleted',
            })
            .exec();

        // Ensure updatedBooking exists and facility is populated
        if (!updatedBooking || !updatedBooking.facility) {
            res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No Data Found',
                data: []
            });
            return;
        }

        // Assign the populated facility to a variable of type `any`
        const populatedFacility: any = updatedBooking.facility;
        const facility = populatedFacility as IFacility; // Cast to IFacility

        // Update booking status to "canceled"
        updatedBooking.isBooked = 'canceled';
        const savedBooking = await updatedBooking.save();

        // Format date, startTime, and endTime
        const formattedDate = moment(savedBooking.date).format('YYYY-MM-DD');
        const formattedStartTime = moment(savedBooking.startTime).format('HH:mm');
        const formattedEndTime = moment(savedBooking.endTime).format('HH:mm');

        // Return success response with updated booking details
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Booking canceled successfully',
            data: {
                _id: savedBooking._id,
                facility: {
                    _id: facility._id,
                    name: facility.name,
                    description: facility.description,
                    pricePerHour: facility.pricePerHour,
                    location: facility.location,
                    isDeleted: facility.isDeleted,
                },
                date: formattedDate,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
                user: savedBooking.user,
                payableAmount: savedBooking.payableAmount,
                isBooked: savedBooking.isBooked,
            },
        });

    } catch (error: any) {
        // console.error('Error canceling booking:', error);
        if (error.code === 11000) {
            throw new CustomError(`Duplicate entry: ${error.message}`, 400, [{ path: '', message: error.message }]);
        }

        throw new CustomError('Server error. Please try again later.', 500);
    }
};
