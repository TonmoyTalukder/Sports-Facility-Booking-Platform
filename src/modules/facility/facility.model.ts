import mongoose, { Document, Schema } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  description: string;
  pricePerHour: number;
  location: string;
  isDeleted: boolean;
}

const FacilitySchema: Schema<IFacility> = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  location: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
});

const Facility = mongoose.model<IFacility>('Facility', FacilitySchema);
export default Facility;
