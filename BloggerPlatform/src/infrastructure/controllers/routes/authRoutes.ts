import {Router} from "express";
import {loginHandler, logoutHandler, aboutMeHandler, refreshTokenHandler} from "../AuthHTTPController";
import {registerHandler,registrationConfirmationHandler, registrationEmailResendingHandler} from "../AuthHTTPController";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {usersValidationMiddleware} from "../../middlewares/UserValidation";
import {emailResendingValidation} from "../../middlewares/EmailValidation";
import {validateRefreshToken} from "../../middlewares/validateRefToken";
import {authMiddleware} from "../../auth/AuthMiddleware";

export const authRouter = Router();

authRouter.post("/login",loginHandler,inputValidationMiddleware);
authRouter.post("/registration",registerHandler,usersValidationMiddleware,inputValidationMiddleware);
authRouter.post("/registration-confirmation",registrationConfirmationHandler);
authRouter.post('/registration-email-resending',registrationEmailResendingHandler, emailResendingValidation,inputValidationMiddleware);
authRouter.post("/logout",logoutHandler,validateRefreshToken);
authRouter.post("/refresh-token",refreshTokenHandler,validateRefreshToken)
authRouter.post("/me",aboutMeHandler,authMiddleware)