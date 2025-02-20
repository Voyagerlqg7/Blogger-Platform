import {Request, Response, NextFunction} from 'express';
import * as Buffer from "buffer";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic')) {
        res.status(401).send({ message: "Unauthorized" });
    } else {
        const base64Credential = authHeader.split(' ')[1];
        const credentials = Buffer.Buffer.from(base64Credential, 'base64').toString('utf-8');
        const [login, password] = credentials.split('\\');

        const validLogin = 'admin';
        const validPassword = 'qwerty';

        if (login !== validLogin || password !== validPassword) {
            res.status(401).send({ message: 'Unauthorized' });
        } else {
            next(); // Продолжаем выполнение, если авторизация успешна
        }
    }
};