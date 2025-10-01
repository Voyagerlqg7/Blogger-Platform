import {Router} from "express";
import {AuthMiddleware} from "../../auth/AuthMiddleware";
import {commentsValidationMiddleware} from "../../middlewares/CommentsValidation";
import {container} from "../../composition";
import {CommentController} from "../CommentHTTPController";

export const commentRouter = Router();
const commentController = container.get<CommentController>(CommentController);
const authMiddleware = container.get(AuthMiddleware);



commentRouter.get("/:id", commentController.getCommentById);
commentRouter.put("/:id",authMiddleware.execute.bind(authMiddleware),commentsValidationMiddleware, commentController.updateComment);
commentRouter.delete("/:id", authMiddleware.execute.bind(authMiddleware),commentController.deleteCommentById);