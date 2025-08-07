import { NextFunction, Request, Response } from 'express';
import { JWTService } from './JWTService';
import {UserService} from "../../core/services/UserService";
import {UserRepository} from "../db/implementations/UserRepository";

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
    const jwtService = new JWTService();
    const userId = await jwtService.getUserIdFromToken(token);

    if (!userId) {
        res.sendStatus(401);
        return;
    }

    const userRepository = new UserRepository();
    const getUserByIdService = new UserService(userRepository);
    const user = await getUserByIdService.getUserById(userId);

    if (!user) {
        res.sendStatus(401);
        return;
    }
    (req as any).userId = user.id;
    next();
};
