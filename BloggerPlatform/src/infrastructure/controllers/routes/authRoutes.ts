import {Router} from "express";
import {loginHandler, logoutHandler, aboutMeHandler, refreshTokenHandler} from "../AuthHTTPController";
import {registerHandler,registrationConfirmationHandler, registrationEmailResendingHandler} from "../AuthHTTPController";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {usersValidationMiddleware} from "../../middlewares/UserValidation";
import {emailResendingValidation} from "../../middlewares/EmailValidation";
import {rateLimiter_to_DB} from "../../middlewares/CustomRateLimit";
import {validateRefreshToken} from "../../middlewares/validateRefToken";
import {authMiddleware} from "../../auth/AuthMiddleware";

export const authRouter = Router();

authRouter.post("/login",inputValidationMiddleware,rateLimiter_to_DB, loginHandler);
authRouter.post("/registration",usersValidationMiddleware,inputValidationMiddleware,rateLimiter_to_DB,registerHandler);
authRouter.post("/registration-confirmation",rateLimiter_to_DB,registrationConfirmationHandler);
authRouter.post('/registration-email-resending', emailResendingValidation,inputValidationMiddleware,rateLimiter_to_DB,registrationEmailResendingHandler);
authRouter.post("/logout",validateRefreshToken,logoutHandler);
authRouter.post("/refresh-token",validateRefreshToken,refreshTokenHandler)
authRouter.get("/me",authMiddleware,aboutMeHandler)