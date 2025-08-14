import {tokenDBCollection} from "../collections/collections"

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
        try {
            const tokenInDb = await tokenDBCollection.findOne({ token });
            return tokenInDb ? token : null;
        } catch (err) {
            return null;
        }
    },
    async saveToken(token: string): Promise<string | null> {
        try {
            const result = await tokenDBCollection.insertOne({ token });
            console.log('SAVED TOKEN:', token);
            return result.insertedId ? token : null;
        } catch (error) {
            console.log('SAVE ERROR:', error);
            return null;
        }
    }

};
