import {Router} from "express";
import {getAllUsers, getUserById, createNewUser, deleteUserById} from "../UserHTTPController";
import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";

import {usersValidationMiddleware} from "../../middlewares/UserValidation";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const userRouter = Router();

userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers,basicAuthMiddleware);
userRouter.post("/", createNewUser,basicAuthMiddleware,usersValidationMiddleware,inputValidationMiddleware);
userRouter.delete("/:id", deleteUserById,basicAuthMiddleware);
