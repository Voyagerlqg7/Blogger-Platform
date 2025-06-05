import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {EmailService} from "../Domain/EmailService";

export const AuthRouter = Router();

AuthRouter.post('/login', inputValidationMiddleware, async (request:Request, response:Response) => {
    const user = await UserService.checkCredentials(request.body.loginOrEmail, request.body.password);
    try {
        if (user) {
            const token = await JWTService.createJWT(user);
            response.status(200).json({accessToken: token});
        } else {
            response.status(401).send();
        }
    }
    catch (error) {
        response.status(400).send(error);
    }
})
AuthRouter.post('/registration', usersValidationMiddleware, inputValidationMiddleware, async (request:Request, response:Response) => {
    const login = request.body.login;
    const password =  request.body.password;
    const email= request.body.email;
    const result = EmailService.RegistrationProcess(login, password, email);
    if(!result){
        response.status(400).send("Something wrong");
    }
    else{response.status(200).send("Email with confirmation code will be send to passed email address");}
})
AuthRouter.get('/me', AuthMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.email,
        login: user.login,
        userId: user._id
    });
});
