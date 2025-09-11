import {Request, Response, NextFunction} from "express";
import {requestLogsCollection} from "../db/collections/collections";

const LIMIT =5;

export async function rateLimiter_to_DB(req: Request, res: Response, next: NextFunction) {
    try{
        const now = new Date();
        const tenSecondsAdo = new Date(now.getTime() - 10 * 1000);
        await requestLogsCollection.insertOne({
            ip: req.ip,
            url: req.originalUrl,
            date: now,
        })

        const count = await requestLogsCollection.countDocuments({
            ip: req.ip,
            utl: req.originalUrl,
            date: {$gte: tenSecondsAdo},
        })
        if(count > LIMIT){
            res.sendStatus(429)
        }
        next();
    }
    catch(error){
        console.log("internal request failed", error);
        res.sendStatus(500).send("server error");
    }
}