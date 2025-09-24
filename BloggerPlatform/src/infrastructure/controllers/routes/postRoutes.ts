import {Router} from "express";
import {PostHTTPController} from "../PostHTTPController"

import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";
import {authMiddleware} from "../../auth/AuthMiddleware";
import {postValidationMiddleware} from "../../middlewares/PostsValidation";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {commentsValidationMiddleware} from "../../middlewares/CommentsValidation";
import {container} from "../../composition";

export const postRouter = Router();
const postController = container.get<PostHTTPController>(PostHTTPController);

postRouter.get("/",postController.getAllPosts);
postRouter.get("/:id",postController.getPostById);
postRouter.get("/:id",postController.getAllCommentsByPostId);

postRouter.put("/:id",basicAuthMiddleware, postValidationMiddleware, inputValidationMiddleware,postController.updatePostById);

postRouter.post("/:id",authMiddleware, commentsValidationMiddleware, inputValidationMiddleware);
postRouter.post("/",basicAuthMiddleware,postValidationMiddleware, inputValidationMiddleware);

postRouter.delete("/:id",basicAuthMiddleware,postController.deletePostById);