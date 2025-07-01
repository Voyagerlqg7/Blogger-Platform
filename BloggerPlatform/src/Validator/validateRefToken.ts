import {JWTService} from "../application/JWTService";
import {Request, Response, NextFunction} from "express";
import {sessionsRepository} from "../Repository/sessionsRepository";
import {UserService} from "../Domain/UserService";

export const validateRefreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.cookies?.refreshToken;
    console.log('STEP 1: token from cookie:', token);
    if (!token) {res.sendStatus(401).send("step 1"); return;}

    const userId = await JWTService.GetUserIdByToken(token);
    console.log('STEP 2: userId from token:', userId);
    if (!userId) {res.sendStatus(401).send("step 2"); return;}

    const tokenInDb = await sessionsRepository.findToken(token);
    console.log('STEP 3: token in DB:', tokenInDb);
    if (!tokenInDb) {res.sendStatus(401).send("step 3"); return;}

    const user = await UserService.FindUserById(userId);
    console.log('STEP 4: user from DB:', user);
    if (!user) {res.sendStatus(401).send("step 4"); return;}


    req.user = user;
    req.refreshToken = token;
    next();
};
