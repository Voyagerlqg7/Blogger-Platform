import {Request, Response, Router} from 'express';
import {UserService} from "../Domain/UserService";
import {JWTService} from "../application/JWTService";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {usersValidationMiddleware} from "../Validator/UserValidation";
import {EmailService} from "../Domain/EmailService";
import {NewUserTemplate} from "./UserRouter";
import {emailResendingValidation} from "../Validator/EmailValidation";
import {sessionsRepository} from "../Repository/sessionsRepository";
import {validateRefreshToken} from "../Validator/validateRefToken";
export const AuthRouter = Router();

AuthRouter.post('/login', inputValidationMiddleware, async (request:Request, response:Response) => {
    const user = await UserService.checkCredentials(request.body.loginOrEmail, request.body.password);
    try {
        if (user) {
            const accessToken = await JWTService.createAccessJWT(user);
            const refreshToken = await JWTService.createRefreshJWT(user);
            await sessionsRepository.saveToken(refreshToken);
            response.clearCookie("refreshToken");
            response.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                sameSite: 'strict',
                secure: true,
                maxAge: 20 * 1000
            });
            response.status(200).json({accessToken: accessToken});
        } else {
            response.status(401).send();
        }

    }
    catch (error) {
        console.log(error);
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
AuthRouter.post('/logout', validateRefreshToken, async (req: Request, res: Response) => {
    const oldtoken = req.refreshToken!;
    const result = await sessionsRepository.deleteToken(oldtoken);
    if(!result) {
        res.status(401).send()
    }
    else{res.sendStatus(204)}
})
AuthRouter.post('/refresh-token', validateRefreshToken, async (req, res) => {
    const user = req.user!;
    const oldToken = req.refreshToken!;
    try {
        await sessionsRepository.deleteToken(oldToken);

        const newAccessToken = await JWTService.createAccessJWT(user);
        const newRefreshToken = await JWTService.createRefreshJWT(user);

        await sessionsRepository.saveToken(newRefreshToken);

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 20 * 1000 // 20 seconds for cookie,
        }).status(200).json({accessToken: newAccessToken});
    }
    catch (error) {
        console.log(error);
        res.status(401).send();
    }
});
AuthRouter.get('/me', AuthMiddleware, async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.email,
        login: user.login,
        userId: user.id
    });
});
