import {NextFunction, Request, Response} from "express";
import {JWTService} from "../application/JWTService";
import {UserService} from "../Domain/UserService";


export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(!req.headers.authorization){
        res.status(401).send();
    }
    const token = req.headers.authorization.split(" ")[1];
    const userId = await JWTService.GetUserIdByToken(token)
    if(userId){
        const user  = UserService.findUserById(userId);
        next();
    }
    res.status(401).send();
}