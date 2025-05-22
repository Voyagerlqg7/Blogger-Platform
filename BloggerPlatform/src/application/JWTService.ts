import {UserDBType} from "../Objects/User";
import jwt from "jsonwebtoken";
import {ObjectId} from "mongodb";
import {settings} from "./settings";

export const JWTService = {
    async createJWT(user:UserDBType){
        const token = await jwt.sign({userId : user._id}, settings.JWT_SECRET, {expiresIn: "30m"});
        return token;
    },
    async GetUserIdByToken(token: string){
        try{
            const result:any = jwt.verify(token, settings.JWT_SECRET);
            return new ObjectId(result.userId);
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
}