import {Request, Response} from "express";
import {sessionsRepository} from "../db/implementations/SessionRepository";
import {JWTService} from "../auth/JWTService";
import {userService} from "../composition";
import {EmailService} from "../applicationServices/EmailService";
import {PasswordService} from "../applicationServices/PasswordService";

export const loginHandler = async (req: Request, res: Response) => {
    try {
        const user = await new PasswordService().checkCredentials(
            req.body.loginOrEmail,
            req.body.password
        );
        if (!user) {
            res.status(400).json({ message: "Invalid Credentials" });
            return;
        }
        const accessToken = await new JWTService().createAccessToken(user);
        const refreshToken = await new JWTService().createRefreshJWT(user);
        await sessionsRepository.saveToken(refreshToken);
        res.clearCookie("refreshToken");
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 20 * 1000
        });
        res.status(200).send(accessToken);
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("Internal server error");
    }
};

export const registerHandler = async (req: Request, res: Response) => {
    try {
        const { login, password, email } = req.body;
        const dto = { login, password, email };
        const user = await userService.createUser(dto);
        if (!user) {
            res.status(400).send({ message: "Invalid Credentials" });
            return;
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).send("Internal server error");
    }
};

export const registrationConfirmationHandler = async (req: Request, res: Response) => {
    try {
        const result = await EmailService.CheckCodeConfirmation(req.body.code);
        if (result) {
            res.sendStatus(204);
            return;
        }
        if (result === undefined) {
            res.status(400).send({
                errorsMessages: [
                    { message: "Email is already confirmed or doesnt exist", field: "code" }
                ]
            });
            return;
        }
        res.status(400).send({
            errorsMessages: [{ message: "Wrong code confirmation", field: "code" }]
        });
    } catch (error) {
        console.error("Registration confirmation error:", error);
        res.status(500).send("Internal server error");
    }
};

export const registrationEmailResendingHandler = async (req: Request, res: Response) => {
    try {
        const result = await EmailService.ReSendCodeConfirmation(req.body.email);
        if (result) {
            res.sendStatus(204);
            return;
        }
        res.status(400).send({
            errorsMessages: [
                { message: "Email doesnt exist or already confirmed", field: "email" }
            ]
        });
    } catch (error) {
        console.error("Resend email error:", error);
        res.status(500).send("Internal server error");
    }
};

export const logoutHandler = async (req: Request, res: Response) => {
    try {
        const oldToken = req.refreshToken!;
        const result = await sessionsRepository.deleteToken(oldToken);
        if (!result) {
            res.sendStatus(401);
            return;
        }
        res.sendStatus(204);
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).send("Internal server error");
    }
};

export const refreshTokenHandler = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        const oldToken = req.refreshToken!;
        await sessionsRepository.deleteToken(oldToken);
        const newAccessToken = await new JWTService().createAccessToken(user);
        const newRefreshToken = await new JWTService().createRefreshJWT(user);
        await sessionsRepository.saveToken(newRefreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 20 * 1000
        });
        res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(401).send();
    }
};

export const aboutMeHandler = async (req: Request, res: Response) => {
    try {
        const user = req.user!;
        res.status(200).json({
            email: user.email,
            login: user.login,
            userId: user.id
        });
    } catch (error) {
        console.error("About me error:", error);
        res.status(500).send("Internal server error");
    }
};
