import { Request, Response } from "express";
import {tokenRepository} from "../db/implementations/TokenRepository";
import {v4 as uuidv4} from "uuid";
import {sessionsRepository} from "../db/implementations/SessionsRepository";
import {injectable, inject} from "inversify";
import {UserService} from "../../core/services/UserService";
import {JWTService} from "../auth/JWTService";
import {AuthService} from "../applicationServices/AuthService";
import {UserConfirmationService} from "../applicationServices/UserConfirmationService";
import {EmailService} from "../applicationServices/EmailService";


@injectable()
export class AuthController {
    constructor(
        @inject(UserService) private userService: UserService,
        @inject(JWTService) private jwtService: JWTService,
        @inject(sessionsRepository) private sessionRepository:sessionsRepository,
        @inject(tokenRepository) private tokenRepository: tokenRepository,
        @inject(AuthService)private authService: AuthService,
        @inject(UserConfirmationService)private confirmationService: UserConfirmationService,
    ) {}

    loginHandler = async (req: Request, res: Response) => {
        try {
            const user = await this.authService.checkCredentials(
                req.body.loginOrEmail,
                req.body.password
            );

            if (!user) {
                res.status(401).json({
                    errorsMessages: [
                        {
                            message: "Invalid login or password",
                            field: "loginOrEmail",
                        },
                    ],
                });
                return;
            }
            if (!req.ip) {
                console.log("ip address is empty!")
                return;
            }
            const deviceId = uuidv4();
            await this.sessionRepository.create({
                userId: user.id,
                deviceId,
                ip: req.ip,
                title: req.headers["user-agent"] ?? "Unknown device",
                lastActiveDate: new Date(),
                expirationDate: new Date(Date.now() + 20_000),
            })

            const accessToken = await this.jwtService.createAccessToken(user);
            const refreshToken = await this.jwtService.createRefreshJWT(user, deviceId);

            await this.tokenRepository.saveToken(refreshToken);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 20 * 1000,
            });

            console.log("ACCESS TOKEN ACTUAL:", accessToken, "TYPE:", typeof accessToken);

            res.status(200).json({accessToken: String(accessToken)});
        } catch (error) {
            console.error("Login error:", error);
            res.status(500).send("Internal server error");
        }
    }
    registerHandler = async (req: Request, res: Response) => {
        try {
            const {login, password, email} = req.body;
            const dto = {login, password, email};
            const user = await this.userService.registrationUser(dto);
            if (!user) {
                res.status(400).json({message: "Invalid Credentials"});
                return;
            }
            await this.confirmationService.sendEmailConfirmation(user.id, user.email);
            res.sendStatus(204);
        } catch (error) {
            console.error("Register error:", error);
            res.status(500).json("Internal server error");
        }
    }
    registrationConfirmationHandler = async (req: Request, res: Response) => {
        try {
            let result: boolean | undefined;
            try {
                result = await this.confirmationService.checkCodeConfirmation(req.body.code);
            } catch (error) {
                // если сервис выбросил ошибку "код не найден", превращаем в undefined
                console.warn("CheckCodeConfirmation failed:", error);
                result = undefined;
            }

            if (result) {
                res.sendStatus(204);
                return;
            }
            if (result === undefined) {
                res.status(400).json({
                    errorsMessages: [
                        {message: "Email is already confirmed or doesnt exist", field: "code"}
                    ]
                });
                return;
            }
            res.status(400).json({
                errorsMessages: [{message: "Wrong code confirmation", field: "code"}]
            });

        } catch (error) {
            console.error("Registration confirmation error:", error);
            res.status(500).send("Internal server error");
        }
    }
    registrationEmailResendingHandler = async (req: Request, res: Response) => {
        try {
            const result = await this.confirmationService.resendCodeConfirmation(req.body.email);
            if (result) {
                res.sendStatus(204);
                return;
            }
            res.status(400).json({
                errorsMessages: [
                    {message: "Email doesnt exist or already confirmed", field: "email"}
                ]
            });
        } catch (error) {
            console.error("Resend email error:", error);
            res.status(500).json("Internal server error");
        }
    }
    logoutHandler = async (req: Request, res: Response) => {
        try {
            const oldToken = req.refreshToken!;
            const deviceId = req.deviceId!;
            const result = await this.tokenRepository.deleteToken(oldToken);
            if (!result) {
                res.sendStatus(401);
                return;
            }
            await this.sessionRepository.deleteDeviceById(deviceId);
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
            });

            res.sendStatus(204);
        } catch (error) {
            console.error("Logout error:", error);
            res.status(500).json("Internal server error");
        }
    };
    refreshTokenHandler = async (req: Request, res: Response) => {
        try {
            const user = req.user!;
            const oldToken = req.refreshToken!;
            const deviceId = req.deviceId!;
            await this.tokenRepository.deleteToken(oldToken);
            const newAccessToken = await this.jwtService.createAccessToken(user);
            const newRefreshToken = await this.jwtService.createRefreshJWT(user, deviceId);
            await this.sessionRepository.updateLastActiveDate(deviceId, {
                lastActiveDate: new Date(),
                expirationDate: new Date(Date.now() + 20_000)
            });

            await this.tokenRepository.saveToken(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "strict",
                maxAge: 20 * 1000
            });
            res.status(200).json({accessToken: newAccessToken});
        } catch (error) {
            console.error("Refresh token error:", error);
            res.status(401).send();
        }
    }
    aboutMeHandler = async (req: Request, res: Response) => {
        try {
            const user = req.user!;

            if (!user) {
                res.status(401)
            } else {
                res.status(200).json({
                    email: user.email,
                    login: user.login,
                    userId: user.id
                });
            }
        } catch (error) {
            console.error("About me error:", error);
            res.status(500).json("Internal server error");
        }
    }

    recoverPasswordHandler = async (req: Request, res: Response) => {
        await this.confirmationService.sendRecoverPasswordCode(req.body.email)
        res.sendStatus(204);
    }
    setNewPasswordHandler = async (req: Request, res: Response) => {
        const check = await this.confirmationService.checkCodeRecoverPassword(req.body.recoveryCode);
        if (!check) {
            res.sendStatus(400);
            return;
        }
        await this.userService.setNewPassword(req.user!.id, req.body.newPassword);
        res.sendStatus(204);
    }


}
