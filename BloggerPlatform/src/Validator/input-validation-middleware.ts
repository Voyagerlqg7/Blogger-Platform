import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction)=> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).send({
            errorsMessages : errors.array().map(error =>({
            message: error.msg,
            // @ts-ignore
            filed: error.path,
        }))}.errorsMessages.reverse());
    }
    else{next();}
};