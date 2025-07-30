import {MongoClient} from 'mongodb';
import * as dotenv from 'dotenv';
import {settings} from "../applicationSettings/settings";

dotenv.config();
const mongoURI = settings.MONGODB_URI;

if(!mongoURI){
    throw new Error("MongoDB URI is missing");
}
export const client = new MongoClient(mongoURI);

export async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Завершаем процесс
    }
}