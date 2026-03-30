import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    password: string;
    role: string;
    createdAt : Date;
}

const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
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
