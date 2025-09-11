import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import Redis from 'ioredis';

const redisClient = new Redis({
    host: '127.0.0.1',
    port: 6419,
    enableOfflineQueue: false,
});

export function createRateLimiter(points: number, duration: number) {
    const limiter = new RateLimiterRedis({
        storeClient: redisClient,
        keyPrefix: `rl_${duration}_${points}`,
        points,
        duration,
    });

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await limiter.consume(req.ip as string);
            next();
        } catch {
            res.status(429).json({
                message: 'Too many requests. Please try again later.',
            });
        }
    };
}
