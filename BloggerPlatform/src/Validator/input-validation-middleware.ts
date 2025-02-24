import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction)=> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const errorsMessages =  errors.array().map(error =>({
            message: error.msg,
            // @ts-ignore
            filed: error.path,
        }));
    response.status(400).send(errorsMessages.reverse());
    }
    else{next();}

};