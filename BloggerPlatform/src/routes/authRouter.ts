import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
export const AuthRouter = Router();

AuthRouter.post('/login', usersValidationMiddleware, inputValidationMiddleware, async (request:Request, response:Response) => {
    const checkResult = await UserService.checkCredentials(request.body.loginOrEmail, request.body.password);
    if(checkResult){
        response.status(204).send();
    }
    else{response.status(401).send();}
})