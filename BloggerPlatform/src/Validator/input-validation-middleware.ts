import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const uniqueErrors = errors.array().reduce((acc, error) => {
            // Проверяем, есть ли уже ошибка для этого поля
            if (!acc.some(e => e.path === error.path)) {
                acc.push({
                    message: error.msg,
                    field: error.path,
                });
            }
            return acc;
        }, [] as { message: string; field: string }[]);

        response.status(400).json({ errorsMessages: uniqueErrors });
    } else {
        next();
    }
};