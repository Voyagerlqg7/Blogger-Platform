import {JWTService} from "../application/JWTService";
import {Request, Response, NextFunction} from "express";
import {sessionsRepository} from "../Repository/sessionsRepository";
import {UserService} from "../Domain/UserService";
import jwt from "jsonwebtoken";
import {settings} from "../application/settings";

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.refreshToken;
    if (!token) {res.status(401).send("step 1"); return;}
    console.log('STEP 0: token from cookie:', token);

    try {
        jwt.verify(token, settings.JWT_SECRET);
    } catch (e) {
        console.log('STEP 1: JWT verification failed', e);
        res.status(401).send("step 0");
        return;
    }
    const userId = await JWTService.GetUserIdByToken(token);
    console.log('STEP 2: userId from token:', userId);
    if (!userId) {res.status(401).send("step 2"); return;}

    const tokenInDb = await sessionsRepository.findToken(token);
    console.log('STEP 3: token in DB:', tokenInDb);
    if (!tokenInDb) {res.status(401).send("step 3"); return;}

    const user = await UserService.FindUserById(userId);
    console.log('STEP 4: user from DB:', user);
    if (!user) {res.status(401).send("step 4"); return;}


    req.user = user;
    req.refreshToken = token;
    next();
};
