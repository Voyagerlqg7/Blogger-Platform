import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {EmailService} from "../Domain/EmailService";
import {NewUserTemplate} from "./UserRouter";

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
    const checkExisting = await EmailService.CheckExistingEmailOrLogin(newUser.login, newUser.email);
    if(checkExisting) {
        response.status(400).send();
    }
    else {
        const createdUser = await UserService.createUser(newUser);

        response.status(200).send();
    }
})
AuthRouter.get('/me', AuthMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.email,
        login: user.login,
        userId: user._id
    });
});
