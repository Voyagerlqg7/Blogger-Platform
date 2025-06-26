import {UserDBType, UserViewModel} from "../Objects/User";
import jwt from "jsonwebtoken";
import {settings} from "./settings";

export const JWTService = {
    async createAccessJWT(user:UserViewModel){
        const accessToken = jwt.sign({userId : user.id}, settings.JWT_SECRET, {expiresIn: "10s"});
        return accessToken;
    },
    async createRefreshJWT(user:UserViewModel){
        const refreshToken = jwt.sign({
            userId: user.id,
        }, settings.JWT_SECRET, { expiresIn: '20s' });
        return refreshToken;
    },
    async GetUserIdByToken(token: string): Promise<string | null> {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return result.userId.toString();
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}