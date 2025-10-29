import {Router} from "express";
import {AuthMiddleware} from "../../auth/AuthMiddleware";
import {OptionalAuthMiddleware} from "../../auth/OptionalAuthMiddleware"; // Добавьте этот импорт
import {commentsValidationMiddleware} from "../../middlewares/CommentsValidation";
import {container} from "../../composition";
import {CommentController} from "../CommentHTTPController";

export const commentRouter = Router();
const commentController = container.get<CommentController>(CommentController);
const authMiddleware = container.get(AuthMiddleware);
const optionalAuthMiddleware = container.get(OptionalAuthMiddleware);

commentRouter.get("/:id", optionalAuthMiddleware.execute.bind(optionalAuthMiddleware), commentController.getCommentById);

commentRouter.put("/:id", authMiddleware.execute.bind(authMiddleware), commentsValidationMiddleware, commentController.updateComment);
commentRouter.put("/:id/like-status", authMiddleware.execute.bind(authMiddleware), commentController.RateComment);
commentRouter.delete("/:id", authMiddleware.execute.bind(authMiddleware), commentController.deleteCommentById);