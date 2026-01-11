import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
    title: string;
    description?:  string;
    creator: mongoose.Types.ObjectId;
    startDateRange: Date;
    endDateRange: Date;
    finalDate?: Date;
    status:  'planning' | 'voting' | 'confirmed' | 'cancelled';
    invitedUsers: mongoose.Types. ObjectId[];
    participants: mongoose.Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}

const EventSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description:  { type: String, trim: true },
    creator:  { type: Schema.Types.ObjectId, ref: 'User', required: true },

    startDateRange: { type:  Date, required: true },
    endDateRange: { type: Date, required: true },
    finalDate: { type: Date },

    status: {
        type: String,
        enum: ['planning', 'voting', 'confirmed', 'cancelled'],
        default: 'planning'
    },

    invitedUsers: [{ type: Schema. Types.ObjectId, ref: 'User' }],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],

}, { timestamps: true });

EventSchema.index({ creator: 1, status: 1 });
EventSchema.index({ participants: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);