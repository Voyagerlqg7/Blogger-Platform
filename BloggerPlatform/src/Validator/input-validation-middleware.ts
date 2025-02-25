import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array();

        // Собираем ошибки по полям: оставляем первую ошибку, но для shortDescription проверяем приоритетное сообщение
        const errorMap = new Map<string, { message: string; field: string }>();

        errorsArray.forEach((err) => {
            const field = err.path;
            if (!errorMap.has(field)) {
                errorMap.set(field, { message: err.msg, field });
            } else if (field === "shortDescription") {
                // Если уже есть ошибка для shortDescription, и текущее сообщение приоритетное, заменяем
                const prev = errorMap.get(field)!;
                if (err.msg.includes("Short description must be")) {
                    errorMap.set(field, { message: err.msg, field });
                } else if (!prev.message.includes("Short description must be") && !err.msg.includes("Short description must be")) {
                    // Если ни одно не приоритетное, оставляем первое (ничего не меняем)
                }
            }
        });

        const uniqueErrors = Array.from(errorMap.values());

        // Сортировка: shortDescription первой, остальные по порядку появления
        uniqueErrors.sort((a, b) => {
            if (a.field === "shortDescription") return -1;
            if (b.field === "shortDescription") return 1;
            return 0;
        });

        res.status(400).json({ errorsMessages: uniqueErrors });
    } else {
        next();
    }
};
