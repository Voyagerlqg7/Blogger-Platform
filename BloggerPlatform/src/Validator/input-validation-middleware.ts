import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const uniqueErrors = errors.array().reduce((acc, error) => {
            const existingError = acc.find(e => e.field === error.path);
            if (existingError) {
                if (error.path === "shortDescription" && error.msg.includes("Short description must be")) {
                    existingError.message = error.msg;
                }
            } else {
                acc.push({
                    message: error.msg,
                    field: error.path,
                });
            }
            return acc;
        }, [] as { message: string; field: string }[]);

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
