import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {EmailService} from "../Domain/EmailService";
import {NewUserTemplate} from "./UserRouter";
import {emailResendingValidation} from "../Validator/EmailValidation";

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
    const userLogin = request.body.login;
    const userPassword =  request.body.password;
    const userEmail= request.body.email;
    const newUser:NewUserTemplate ={
        login: userLogin,
        password: userPassword,
        email: userEmail
    }
    const createdUser = await UserService.RegistrationUser(newUser);
    if(createdUser) {
        response.status(204).send();
    }
    else{
        response.status(400).json({ errorsMessages: [{ message: "Failed to create user", field: "server" }] });
    }
})
AuthRouter.post('/registration-confirmation', async (request: Request, response:Response) => {
    const result = await EmailService.CheckCodeConfirmation(request.body.code);
    if(result) {
        response.status(204).send();
    }
    else if(result === undefined){
        response.status(400).send({ errorsMessages: [{ message: "Email is already confirmed or doesnt exist", field: "code" }] });
    }
    else if(!result){
        response.status(400).send({ errorsMessages: [{ message: "Wrong code confirmation", field: "code" }] });
    }

})
AuthRouter.post('/registration-email-resending', emailResendingValidation, inputValidationMiddleware, async (request: Request, response:Response) => {
    const result = await EmailService.ReSendCodeConfirmation(request.body.email);
    if(result) {
        response.status(204).send();
    }
    else if(!result) {
        response.status(400).send({ errorsMessages: [{ message: "email doesnt exist or already confirmed", field: "email" }] });
    }
})
AuthRouter.get('/me', AuthMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.accountData.email,
        login: user.accountData.login,
        userId: user._id
    });
});
