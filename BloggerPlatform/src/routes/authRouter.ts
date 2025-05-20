import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
export const AuthRouter = Router();

AuthRouter.post('/login', inputValidationMiddleware, async (request:Request, response:Response) => {
    const user = await UserService.checkCredentials(request.body.loginOrEmail, request.body.password);
    if(user){
        const token = await JWTService.createJWT(user);
        response.status(204).send(token);
    }
    else{response.status(401).send();}
})
AuthRouter.get('/me', async(req: Request, res: Response) =>{

})