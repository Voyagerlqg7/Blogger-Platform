import {client} from "../mongo/ConnectDB";
import jwt from "jsonwebtoken";
import {settings} from "../application/settings";


export const tokenDBCollection = client.db("BloggerPlatform").collection("token");

export const sessionsRepository = {
    async deleteToken(token: string): Promise<true | null> {
        try {
            const result = await tokenDBCollection.findOneAndDelete({ token });
            return result ? true : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    async findToken(token: string): Promise<string | null> {
        const tokenInDb = await tokenDBCollection.findOne({ token });
        if (!tokenInDb) return null;

        try {
            jwt.verify(token, settings.JWT_SECRET);
            return token; // токен валиден
        } catch (err) {
            console.log("Token is not valid" + err);
            return null;
        }
    },

    async saveToken(token: string): Promise<string | null> {
        try {
            const result = await tokenDBCollection.insertOne({ token });
            return result.insertedId ? token : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};
