import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {ValidationError} from "express-validator";

export const inputValidationMiddleware = (request: Request, response: Response, next: NextFunction)=> {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const errorMessages = (errors.array() as ValidationError[]).map(error =>({
            message: error.msg,
            filed: error.path,
        }))
        response.status(400).send(errorMessages);
    }
    else{next();}
};
