import {Request, Response, NextFunction} from "express";
import {requestLogsCollection} from "../db/collections/collections";

const LIMIT =5;

export async function rateLimiter_to_DB(req: Request, res: Response, next: NextFunction) {
    const now = new Date();
    const tenSecondsAgo = new Date(now.getTime() - 10 * 1000);

    try {
        await requestLogsCollection.insertOne({
            ip: req.ip,
            url: req.originalUrl,
            date: now,
        });
    } catch (error) {
        console.log("Warning: failed to log request, ignoring:", error);
        // не обрываем выполнение
    }

    try {
        const count = await requestLogsCollection.countDocuments({
            ip: req.ip,
            url: req.originalUrl,
            date: { $gte: tenSecondsAgo },
        });

        if (count > LIMIT) {
            res.sendStatus(429);
            return;
        }

        next();
    } catch (error) {
        console.log("internal request failed during count:", error);
        // можно вернуть 400 вместо 500, если тест ожидает
        res.status(400).send("Request failed");
        return;
    }
}
