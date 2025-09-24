import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { settings } from "../settings/settings";
import { container } from "../composition";
import {UserService} from "../../core/services/UserService";
import { tokenRepository } from "../db/implementations/TokenRepository";
import { sessionsRepository } from "../db/implementations/SessionsRepository";

export const createValidateRefreshToken = () => {
    // Получаем зависимости из контейнера
    const userService = container.get<UserService>(UserService);
    const tokenRepo = container.get<tokenRepository>(tokenRepository);
    const sessionsRepo = container.get<sessionsRepository>(sessionsRepository);

    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const token = req.cookies?.refreshToken;
        if (!token) {
            res.status(401).send("no token");
            return;
        }

        let payload: any;
        try {
            payload = jwt.verify(token, settings.JWT_SECRET);
        } catch (e) {
            console.log('JWT verification failed:', e);
            res.status(401).send("invalid token");
            return;
        }

        const userId = payload.userId;
        const deviceId = payload.deviceId;
        if (!userId || !deviceId) {
            res.status(401).send("invalid payload");
            return;
        }

        const tokenInDb = await tokenRepo.findToken(token);
        if (!tokenInDb) {
            res.status(401).send("token not found");
            return;
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            res.status(401).send("user not found");
            return;
        }
        const session = await sessionsRepo.findByDeviceId(deviceId);
        if (!session) {
            res.status(401).send("session not found");
            return;
        }
        if (session.expirationDate < new Date()) {
            await sessionsRepo.deleteDeviceById(deviceId);
            res.status(401).send("session expired");
            return;
        }

        req.user = user;
        req.refreshToken = token;
        req.deviceId = deviceId;
        next();
    };
};
