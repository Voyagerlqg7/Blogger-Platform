import {MongoClient} from "mongodb";

const mongoURI = process.env.MONGODB_URI || "mongodb://localhost:27017";


export const client = new MongoClient(mongoURI);

export async function connectDB() {
    try {
         await client.connect();
         console.log("Connected to DB successfully.");
    }
    catch (error) {
        console.error("Error connecting to DB");
        console.error(error);
        await client.close();
    }
}


