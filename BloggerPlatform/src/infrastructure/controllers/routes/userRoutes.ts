import {Router} from "express";
import {getAllUsers, getUserById, createUser, deleteUserById} from "../UserHTTPController";
import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";

import {usersValidationMiddleware} from "../../middlewares/UserValidation";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const userRouter = Router();

userRouter.get("/:id", getUserById);
userRouter.get("/", basicAuthMiddleware, getAllUsers);
userRouter.post(
    "/",
    basicAuthMiddleware,
    usersValidationMiddleware,
    inputValidationMiddleware,
    createUser
);
userRouter.delete("/:id", deleteUserById,basicAuthMiddleware);
