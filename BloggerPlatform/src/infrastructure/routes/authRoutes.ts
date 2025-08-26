import {Router} from "express"
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {usersValidationMiddleware} from "../middlewares/UserValidation";
import {emailResendingValidation} from "../middlewares/EmailValidation";
import {validateRefreshToken} from "../middlewares/validateRefToken";
import {authMiddleware} from "../auth/AuthMiddleware";

export const authRouter = Router();

authRouter.post("/login",inputValidationMiddleware);
authRouter.post("/registration",usersValidationMiddleware,inputValidationMiddleware);
authRouter.post("/registration-confirmation'", );
authRouter.post('/registration-email-resending',emailResendingValidation,inputValidationMiddleware);
authRouter.post("/logout",validateRefreshToken);
authRouter.post("/refresh-token",validateRefreshToken)
authRouter.post("/me",authMiddleware)