import mongoose, { Document, Schema, model } from 'mongoose'

export type AmisStatus = 'en attente' | 'accepter' | 'rejeter' | 'bloquer'

export interface IFriendship extends Document {
    requester: mongoose.Types.ObjectId
    recipient: mongoose.Types.ObjectId
    status: AmisStatus
    createdAt: Date
    respondedAt?: Date
}

const FriendshipSchema = new Schema<IFriendship>({
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    status: { type: String, enum: ['en attente', 'accepter', 'rejeter', 'bloquer'], default: 'en attente' },
    respondedAt: { type: Date }
}, { timestamps: true })

// Empêcher doublons requester->recipient
FriendshipSchema.index({ requester: 1, recipient: 1 }, { unique: true })

export const Friendship = model<IFriendship>('Friendship', FriendshipSchema)