import {Router} from "express";
import {getCommentById, updateComment, deleteCommentById} from "../controllers/CommentHTTPController";
import {authMiddleware} from "../auth/AuthMiddleware";
import {commentsValidationMiddleware} from "../middlewares/CommentsValidation";

export const commentRouter = Router();

commentRouter.get("/:id", getCommentById);
commentRouter.put("/:id", updateComment,authMiddleware,commentsValidationMiddleware);
commentRouter.delete("/:id", authMiddleware,deleteCommentById);