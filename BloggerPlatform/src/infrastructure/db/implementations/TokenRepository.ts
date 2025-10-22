import {injectable} from "inversify";
import {TokenModel} from "../Models/collections";

@injectable()
export class TokenRepository {
    async deleteToken(token: string): Promise<true | null> {
        try {
            const result = await TokenModel.findOneAndDelete({ token });
            return result ? true : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
    async findToken(token: string): Promise<string | null> {
        try {
            const tokenInDb = await TokenModel.findOne({ token });
            return tokenInDb ? token : null;
        } catch (err) {
            return null;
        }
    }
    async saveToken(token: string): Promise<string | null> {
        try {
            const doc = await TokenModel.create({ _id: token, token });
            console.log('SAVED TOKEN:', doc.token);
            return doc.token;
        } catch (error) {
            console.log('SAVE ERROR:', error);
            return null;
        }
    }
};
