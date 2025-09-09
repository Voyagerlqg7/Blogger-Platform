import {Router} from "express";
import {loginHandler, logoutHandler, aboutMeHandler, refreshTokenHandler} from "../AuthHTTPController";
import {registerHandler,registrationConfirmationHandler, registrationEmailResendingHandler} from "../AuthHTTPController";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {usersValidationMiddleware} from "../../middlewares/UserValidation";
import {emailResendingValidation} from "../../middlewares/EmailValidation";
import {validateRefreshToken} from "../../middlewares/validateRefToken";
import {authMiddleware} from "../../auth/AuthMiddleware";

export const authRouter = Router();

authRouter.post("/login",inputValidationMiddleware, loginHandler);
authRouter.post("/registration",usersValidationMiddleware,inputValidationMiddleware,registerHandler);
authRouter.post("/registration-confirmation",registrationConfirmationHandler);
authRouter.post('/registration-email-resending', emailResendingValidation,inputValidationMiddleware,registrationEmailResendingHandler);
authRouter.post("/logout",validateRefreshToken,logoutHandler);
authRouter.post("/refresh-token",validateRefreshToken,refreshTokenHandler)
authRouter.post("/me",authMiddleware,aboutMeHandler)