import * as dotenv from 'dotenv';
import mongoose from "mongoose";

const envFile = process.env.NODE_ENV === "production" ? ".env.production" : ".env.development";
dotenv.config({ path: envFile });

import { settings } from "../settings/settings";

const mongoURI =
    settings.NODE_ENV === "development"
        ? settings.LOCAL_MONGODB_URI
        : settings.ATLAS_MONGO_URI;

if (!mongoURI) {
    throw new Error("MongoDB URI is missing");
}

export async function connectDB() {
    try {
        console.log("ENV NODE_ENV:", settings.NODE_ENV);
        console.log("MONGO URI:", mongoURI);

        await mongoose.connect(mongoURI);

        console.log(
            `Connected to MongoDB via ${settings.NODE_ENV === "development" ? "local" : "Atlas"} database`
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
