import mongoose, { Document, Schema } from 'mongoose';

export interface IAvailability extends Document {
    event: mongoose.Types. ObjectId;
    user: mongoose.Types.ObjectId;
    availableDates: Date[];
    unavailableDates: Date[];
    submittedAt: Date;
    updatedAt: Date;
}

const AvailabilitySchema = new Schema({
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    user: { type: Schema. Types.ObjectId, ref: 'User', required: true, index: true },

    availableDates: [{ type: Date }],
    unavailableDates: [{ type: Date }],

    submittedAt: { type: Date, default:  Date.now }
}, { timestamps: true });

AvailabilitySchema.index({ event: 1, user:  1 }, { unique: true });

export default mongoose.model<IAvailability>('Availability', AvailabilitySchema);