import {Request, Response} from "express";
import {sessionsRepository} from "../db/implementations/SessionRepository";
import {JWTService} from "../auth/JWTService";
import {userService} from "../composition";
import {EmailService} from "../applicationServices/EmailService";
import {PasswordService} from "../applicationServices/PasswordService";

export const loginHandler = async (req: Request, res: Response) => {
    const user = await new PasswordService().checkCredentials(req.body.loginOrEmail, req.body.password);
    if (!user) {
        console.log()
        res.status(400).json({message: "Invalid Credentials"}); }
    else{
        const accessToken = await new JWTService().createAccessToken(user);
        const refreshToken = await new JWTService().createRefreshJWT(user);
        await sessionsRepository.saveToken(refreshToken);
        res.clearCookie("refreshToken");
        res.cookie("refreshToken", refreshToken,{
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 20 * 1000
        });
        res.status(200).json({accessToken: accessToken});
    }
}
export const registerHandler = async (req: Request, res: Response) => {
    const {login, password, email} = req.body;
    const dto = {login, password, email};
    const user = await userService.createUser(dto);
    if (!user) {
        res.status(400).send({message: "Invalid Credentials"});
    }
    else{res.status(204);}
}
export const registrationConfirmationHandler = async (req: Request, res: Response) => {
    const result = await EmailService.CheckCodeConfirmation(req.body.code)
    if(result){res.status(204)}
    else if(result ===undefined){ res.status(400).send({ errorsMessages: [{ message: "Email is already confirmed or doesnt exist", field: "code" }] }); }
    else if (!result){res.status(400).send({ errorsMessages: [{ message: "Wrong code confirmation", field: "code" }] } );}
}

export const registrationEmailResendingHandler = async (req: Request, res: Response) => {
    const result = await EmailService.ReSendCodeConfirmation(req.body.email);
    if(result) {
        res.status(204);
    }
    else if(!result) {
        res.status(400).send({ errorsMessages: [{ message: "email doesnt exist or already confirmed", field: "email" }] });
    }
}

export const logoutHandler = async (req: Request, res: Response) => {
    const oldToken = req.refreshToken!;
    const result = await sessionsRepository.deleteToken(oldToken);
    if(!result) {res.status(401)}
    else{res.sendStatus(204)}
}

export const refreshTokenHandler = async (req: Request, res: Response) => {
    const user = req.user!;
    const oldToken = req.refreshToken!;
    try {
        await sessionsRepository.deleteToken(oldToken);

        const newAccessToken = await new JWTService().createAccessToken(user);
        const newRefreshToken = await new JWTService().createRefreshJWT(user);

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
}

export const aboutMeHandler = async (req: Request, res: Response) => {
    const user = req.user!;
    res.status(200).json({
        email: user.email,
        login: user.login,
        userId: user.id
    });
}


