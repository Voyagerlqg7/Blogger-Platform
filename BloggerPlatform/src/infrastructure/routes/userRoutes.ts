import {Router} from "express";
import {getAllUsers, getUserById, createNewUser, deleteUserById} from "../controllers/UserHTTPController";

const userRouter = Router();

userRouter.get("/:id", getUserById);
userRouter.get("/", getAllUsers);
userRouter.post("/", createNewUser);
userRouter.delete("/:id", deleteUserById);
