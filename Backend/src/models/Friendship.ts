import mongoose, { Document, Schema, model } from 'mongoose';

export type FriendshipStatus = 'pending' | 'accepted' | 'rejected' | 'blocked';

export interface IFriendship extends Document {
    requester:  mongoose.Types.ObjectId; //Envoyeur
    recipient: mongoose.Types.ObjectId; // destinataire
    status: FriendshipStatus;
    createdAt: Date;
    respondedAt?: Date;
}

const FriendshipSchema = new Schema<IFriendship>({
    requester: { type: Schema.Types.ObjectId, ref: 'User', required:  true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index:  true },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'blocked'],
        default: 'pending'
    },
    respondedAt: { type:  Date }
}, { timestamps: true });

// Index unique pour éviter les doublons
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true });

export const Friendship = model<IFriendship>('Friendship', FriendshipSchema);