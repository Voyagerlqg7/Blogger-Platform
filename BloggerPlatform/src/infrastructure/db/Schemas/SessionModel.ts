import mongoose from "mongoose";

export type session = {
    userId: string;
    deviceId: string;
    ip: string;
    title: string;
    lastActiveDate: Date,
    expirationDate: Date,
}

export const SessionSchema = new mongoose.Schema<session>({
    userId: { type: String, required: true },
    deviceId: { type: String, required: true },
    ip: { type: String, required: true },
    title: { type: String, required: true },
    lastActiveDate: { type: Date, required: true },
    expirationDate: { type: Date, required: true },
})