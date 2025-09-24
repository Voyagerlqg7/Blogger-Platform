import {Router} from "express";
import {AuthController} from "../AuthHTTPController";
import {container} from "../../composition";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {createUsersValidationMiddleware} from "../../middlewares/UserValidation";
import {emailResendingValidation} from "../../middlewares/EmailValidation";
import {rateLimiter_to_DB} from "../../middlewares/CustomRateLimit";
import {createValidateRefreshToken} from "../../middlewares/validateRefToken";
import {authMiddleware} from "../../auth/AuthMiddleware";

export const authRouter = Router();
const authController = container.get<AuthController>(AuthController);

authRouter.post("/login",rateLimiter_to_DB,inputValidationMiddleware, authController.loginHandler);
authRouter.post("/registration",rateLimiter_to_DB,createUsersValidationMiddleware(),inputValidationMiddleware,authController.registerHandler);
authRouter.post("/registration-confirmation",rateLimiter_to_DB,authController.registrationConfirmationHandler);
authRouter.post('/registration-email-resending', emailResendingValidation,inputValidationMiddleware,rateLimiter_to_DB,authController.registrationConfirmationHandler);
authRouter.post("/logout",createValidateRefreshToken(),authController.logoutHandler);
authRouter.post("/refresh-token",createValidateRefreshToken(),authController.refreshTokenHandler);
authRouter.get("/me",authMiddleware,authController.aboutMeHandler);