import jwt from "jsonwebtoken";
import {settings} from "../settings/settings";
import {UserViewModel} from "../../core/entities/User";

export class JWTService {
    async createAccessToken(user:UserViewModel): Promise<string> {
        const accessToken:string = jwt.sign(
            {userId: user.id},
            settings.JWT_SECRET,
            {expiresIn: "10s"});
        return accessToken;
    }

    async createRefreshJWT(user:UserViewModel):Promise<string>{
        const refreshToken:string = jwt.sign(
            {userId: user.id},
            settings.JWT_SECRET,
            {expiresIn: "20s"}
        )
        return refreshToken;
    }
    async getUserIdFromToken(token:string):Promise<string | null>{
        try{
            const result:any = jwt.verify(token, settings.JWT_SECRET);
            return result.userId.toString();
        }
        catch(error){
            console.log(error);
            return null;
        }
    }
}