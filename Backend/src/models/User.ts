import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    createdAt : Date;
}

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    consentGiven: {
        type: Boolean,
        default: false,
        required: true
    },
    consentDate: {
        type: Date,
        default: null
    },
    consentVersion: {
        type: String,
        default: '1.0'
    },
    consentAcceptedAt: Date
});

export default mongoose.model<IUser>("User", UserSchema);
