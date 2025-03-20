import {MongoClient} from "mongodb";

const mongoURI = process.env.MONGODB_URI || "mongodb+srv://stepanenkovadik:<EvVKF2IITxfWqs8A>@cluster0.fxtec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";


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


