import {NextFunction, Request, Response} from "express";
import {JWTService} from "../application/JWTService";
import {UserService} from "../Domain/UserService";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) return res.sendStatus(401);

    const token = req.headers.authorization.split(' ')[1];
    const userId = await JWTService.GetUserIdByToken(token);

    if (!userId) return res.sendStatus(401);

    const user = await UserService.FindUserById(userId);
    if (!user) return res.sendStatus(401);
    else{
        return req.user = user;
        next();
    }
};
