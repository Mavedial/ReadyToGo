import mongoose, { Document, Schema } from 'mongoose';

export type InvitationStatus = 'pending' | 'accepted' | 'declined';

export interface IEventInvitation extends Document {
    event: mongoose.Types.ObjectId;
    invitedUser: mongoose.Types.ObjectId;
    invitedBy: mongoose.Types.ObjectId;
    status: InvitationStatus;
    respondedAt?:  Date;
    createdAt: Date;
}

const EventInvitationSchema = new Schema({
    event:  { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    invitedUser: { type: Schema. Types.ObjectId, ref: 'User', required: true, index: true },
    invitedBy: { type: Schema. Types.ObjectId, ref: 'User', required: true },

    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },

    respondedAt: { type: Date }
}, { timestamps: true });

EventInvitationSchema.index({ event: 1, invitedUser: 1 }, { unique: true });

export default mongoose.model<IEventInvitation>('EventInvitation', EventInvitationSchema);