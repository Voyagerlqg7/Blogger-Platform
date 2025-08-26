import {Router} from "express";
import {getAllUsers, getUserById, createNewUser, deleteUserById} from "../controllers/UserHTTPController";
import {basicAuthMiddleware} from "../auth/BasicAuthMiddleware";


export const userRouter = Router();

userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers,basicAuthMiddleware);
userRouter.post("/", createNewUser,basicAuthMiddleware);
userRouter.delete("/:id", deleteUserById,basicAuthMiddleware);
