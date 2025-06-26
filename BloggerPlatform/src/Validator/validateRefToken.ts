import {JWTService} from "../application/JWTService";
import {Request, Response, NextFunction} from "express";
import {sessionsRepository} from "../Repository/sessionsRepository";
import {UserService} from "../Domain/UserService";

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (!token) {res.sendStatus(401); return;}

    const userId = await JWTService.GetUserIdByToken(token);
    if (!userId) {res.sendStatus(401); return;}

    const tokenInDb = await sessionsRepository.findToken(token);
    if (!tokenInDb) {res.sendStatus(401); return;}

    const user = await UserService.FindUserById(userId);
    if (!user) {res.sendStatus(401); return;}

    req.user = user;
    req.refreshToken = token;
    next();
};
