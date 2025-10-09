import {Request, Response, NextFunction} from "express";
import {requestLogsCollection} from "../db/Models/collections";

const LIMIT =5;

export async function rateLimiter_to_DB(req: Request, res: Response, next: NextFunction) {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);

    // логируем запрос, но ошибки не прерывают выполнение
    try {
        await requestLogsCollection.insertOne({
            ip: req.ip,
            url: req.originalUrl,
            date: now,
        });
    } catch (error) {
        console.warn("Failed to log request:", error);
    }

    let count = 0;
    try {
        count = await requestLogsCollection.countDocuments({
            ip: req.ip,
            url: req.originalUrl,
            date: { $gte: tenSecondsAgo },
        });
    } catch (error) {
        console.warn("Failed to count requests:", error);
        // не обрываем выполнение, пусть контроллер должен сам вернуть 400 при ошибке данных
    }

    if (count > LIMIT) {
        res.sendStatus(429);
        return;
    }

    next();
}
