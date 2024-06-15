import mongoose, { Document, Schema, Types } from 'mongoose';

// Interface definition
export interface IBooking extends Document {
  date: Date;
  startTime: Date;
  endTime: Date;
  user: Types.ObjectId;
  facility: Types.ObjectId;
  payableAmount: number;
  isBooked: 'confirmed' | 'unconfirmed' | 'canceled';
}

// Schema definition
const BookingSchema: Schema<IBooking> = new Schema({
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  facility: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
  payableAmount: { type: Number, required: true },
  isBooked: {
    type: String,
    enum: ['confirmed', 'unconfirmed', 'canceled'],
    default: 'unconfirmed',
  },
});

// Middleware to calculate payable amount and validate time slots before saving
BookingSchema.pre<IBooking>('save', async function (next) {
  try {
    const facility = await mongoose.model('Facility').findById(this.facility);
    if (!facility) {
      throw new Error('Facility not found');
    }

    const duration =
      (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * 60); // Calculate duration in hours
    this.payableAmount = duration * (facility as any).pricePerHour; // Calculate payable amount

    // Validate that endTime is after startTime
    if (this.endTime <= this.startTime) {
      throw new Error('End time must be after start time');
    }

    next();
  } catch (error) {
    next(); // Pass the caught error to the next middleware
  }
});

// Model creation
const Booking = mongoose.model<IBooking>('Booking', BookingSchema);
export default Booking;
