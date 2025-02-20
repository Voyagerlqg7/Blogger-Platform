import { Request, Response, NextFunction } from 'express';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // Проверяем наличие заголовка Authorization и его формат
    if (!authHeader || !authHeader.startsWith('Basic')) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    // Извлекаем и декодируем Base64-строку
    const base64Credential = authHeader.split(' ')[1];
    let credentials: string;
    try {
        credentials = Buffer.from(base64Credential, 'base64').toString('utf-8');
    } catch (error) {
        return res.status(401).send({ message: 'Invalid authorization header' });
    }

    // Разделяем логин и пароль
    const [login, password] = credentials.split(':');

    // Проверяем логин и пароль
    const validLogin = process.env.ADMIN_LOGIN || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'qwerty';

    if (login !== validLogin || password !== validPassword) {
        return res.status(401).send({ message: 'Unauthorized' });
    }

    // Авторизация успешна
    return next();

};