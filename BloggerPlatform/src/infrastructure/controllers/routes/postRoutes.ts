import {Router} from "express";
import {PostHTTPController} from "../PostHTTPController"
import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";
import {AuthMiddleware} from "../../auth/AuthMiddleware";
import {OptionalAuthMiddleware} from "../../auth/OptionalAuthMiddleware"; // Добавьте этот импорт
import {postValidationMiddleware} from "../../middlewares/PostsValidation";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";
import {commentsValidationMiddleware} from "../../middlewares/CommentsValidation";
import {container} from "../../composition";
import {likeStatusValidation} from "../../middlewares/likeStatusMiddleware";

export const postRouter = Router();
const postController = container.get<PostHTTPController>(PostHTTPController);
const authMiddleware = container.get(AuthMiddleware);
const optionalAuthMiddleware = container.get(OptionalAuthMiddleware);

postRouter.get("/", optionalAuthMiddleware.execute.bind(optionalAuthMiddleware), postController.getAllPosts);
postRouter.get("/:id", optionalAuthMiddleware.execute.bind(optionalAuthMiddleware), postController.getPostById);
postRouter.get("/:id/comments", optionalAuthMiddleware.execute.bind(optionalAuthMiddleware), postController.getAllCommentsByPostId);

postRouter.put("/:id", basicAuthMiddleware, postValidationMiddleware, inputValidationMiddleware, postController.updatePostById);
postRouter.put("/:id/like-status",
    authMiddleware.execute.bind(authMiddleware),
    likeStatusValidation,
    inputValidationMiddleware,
    postController.RatePost
    )


postRouter.post("/:id/comments", authMiddleware.execute.bind(authMiddleware), commentsValidationMiddleware, inputValidationMiddleware, postController.createCommentByPostId);
postRouter.post("/", basicAuthMiddleware, postValidationMiddleware, inputValidationMiddleware, postController.createPost);

postRouter.delete("/:id", basicAuthMiddleware, postController.deletePostById);