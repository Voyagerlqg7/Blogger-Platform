import {Router} from "express";
import {authMiddleware} from "../../auth/AuthMiddleware";
import {commentsValidationMiddleware} from "../../middlewares/CommentsValidation";
import {container} from "../../composition";
import {CommentController} from "../CommentHTTPController";

export const commentRouter = Router();
const commentController = container.get<CommentController>(CommentController);

commentRouter.get("/:id", commentController.getCommentById);
commentRouter.put("/:id",authMiddleware,commentsValidationMiddleware, commentController.updateComment);
commentRouter.delete("/:id", authMiddleware,commentController.deleteCommentById);