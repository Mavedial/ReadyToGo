import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    consentGiven: boolean;
    consentDate?: Date;
    consentVersion?: string;
    createdAt : Date;
}

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    consentGiven: {
        type: Boolean,
        required: true,
        default: false
    },
    consentDate: {
        type: Date,
        default: null
    },
    consentVersion: {
        type: String,
        default: '1.0'
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>("User", UserSchema);
