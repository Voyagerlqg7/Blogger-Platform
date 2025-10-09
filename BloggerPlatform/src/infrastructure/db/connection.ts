import * as dotenv from 'dotenv';
import {MongoClient} from "mongodb";
import {settings} from "../settings/settings";
import mongoose from "mongoose";

dotenv.config();
const mongoURI = settings.MONGODB_URI;
export const client = new MongoClient(mongoURI);

if(!mongoURI){
    throw new Error("MongoDB URI is missing");
}

export async function connectDB() {
    try {
        await mongoose.connect(mongoURI);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Завершаем процесс
    }
}