import * as dotenv from 'dotenv';
import mongoose from "mongoose";
dotenv.config();

import { settings } from "../settings/settings";

const mongoURI =
    settings.NODE_ENV === "development"
        ? settings.LOCAL_MONGODB_URI
        : settings.ATLAS_MONGO_URI;

if (!mongoURI) {
    throw new Error("MongoDB URI is missing");
}

export const client = new mongoose.mongo.MongoClient(mongoURI);

export async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
        await client.connect();
        console.log(`Connected to MongoDB via ${settings.NODE_ENV === "development" ? "local" : "Atlas"} database`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
