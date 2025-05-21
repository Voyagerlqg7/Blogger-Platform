import {NextFunction, Request, Response} from "express";
import {JWTService} from "../application/JWTService";
import {UserService} from "../Domain/UserService";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.headers.authorization) {
        res.sendStatus(401);
        return;
    }

    const token = req.headers.authorization.split(' ')[1];
    const userId = await JWTService.GetUserIdByToken(token);

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    const user = await UserService.FindUserById(userId);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    req.user = user;
    next();
};
