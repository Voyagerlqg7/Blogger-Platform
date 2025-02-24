import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        // Убираем дубликаты ошибок для одного поля
        const uniqueErrors = errors.array().reduce((acc, error) => {
            // Проверяем, есть ли уже ошибка для этого поля
            if (!acc.some(e => e.field === error.path)) {
                acc.push({
                    message: error.msg,
                    field: error.path,
                });
            }
            return acc;
        }, [] as { message: string; field: string }[]);

        // Сортируем ошибки, чтобы shortDescription был первым
        const sortedErrors = uniqueErrors.sort((a, b) => {
            if (a.field === "shortDescription") return -1;
            if (b.field === "shortDescription") return 1;
            return 0;
        });

        response.status(400).json({ errorsMessages: sortedErrors });
    } else {
        next();
    }
};