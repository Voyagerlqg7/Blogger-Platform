import { NextFunction, Request, Response } from 'express';
import {UserService} from "../../core/services/UserService";
import {UserRepository} from "../db/implementations/UserRepository";
import {PasswordService} from "../applicationServices/PasswordService";
import {jwtService} from "../composition";

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.sendStatus(401);
        return;
    }

    const token = authHeader.split(' ')[1];
    const userId = await jwtService.getUserIdFromToken(token);

    if (!userId) {
        res.sendStatus(401);
        return;
    }
    const passwordService = new PasswordService();
    const userRepository = new UserRepository(passwordService);
    const getUserByIdService = new UserService(userRepository);
    const user = await getUserByIdService.getUserById(userId);

    if (!user) {
        res.sendStatus(401);
        return;
    }
    req.user = user;
    next();
};
