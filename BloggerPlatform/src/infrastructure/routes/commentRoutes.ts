import {Router} from "express";
import {getCommentById, updateComment, deleteCommentById} from "../controllers/CommentHTTPController";

const commentRouter = Router();

commentRouter.get("/:id", getCommentById);
commentRouter.put("/:id", updateComment);
commentRouter.delete("/:id", deleteCommentById);