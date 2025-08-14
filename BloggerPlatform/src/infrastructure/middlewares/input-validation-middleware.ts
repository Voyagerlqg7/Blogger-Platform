import {validationResult} from "express-validator";
import {Request, Response, NextFunction} from "express";

interface ValidationError {
    path: string;
    msg: string;
}

export const inputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array() as ValidationError[];
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
                }
            }
        });

        const uniqueErrors = Array.from(errorMap.values());

        // Сортировка: shortDescription первой, остальные по порядку появления
        uniqueErrors.sort((a, b) =>
            a.field === "shortDescription" ? -1 :
                b.field === "shortDescription" ? 1 :
                    0
        );

        res.status(400).json({ errorsMessages: uniqueErrors });
    } else {
        next();
    }
};