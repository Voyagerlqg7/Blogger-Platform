import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";
import {UserHTTPController} from "../UserHTTPController";

import {createUsersValidationMiddleware} from "../../middlewares/UserValidation";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {container} from "../../DIContainers";

export const userRouter = Router();
const userController = container.get<UserHTTPController>(UserHTTPController);
userRouter.get("/:id", userController.getUserById);
userRouter.get("/", basicAuthMiddleware, userController.getAllUsers);
userRouter.post(
    "/",
    basicAuthMiddleware,
    inputValidationMiddleware,
    createUsersValidationMiddleware(),
    userController.createUser
);
userRouter.delete("/:id",basicAuthMiddleware,userController.deleteUserById);
