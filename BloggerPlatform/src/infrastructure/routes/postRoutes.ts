import {Router} from "express";
import {getAllPosts,getPostById,createPost,deletePostById} from "../controllers/PostHTTPController";
import {updatePostById,getAllCommentsByPostId,createCommentByPostId} from "../controllers/PostHTTPController";

import {basicAuthMiddleware} from "../auth/BasicAuthMiddleware";
import {authMiddleware} from "../auth/AuthMiddleware";
import {postValidationMiddleware} from "../middlewares/PostsValidation";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";
import {commentsValidationMiddleware} from "../middlewares/CommentsValidation";

export const postRouter = Router();

postRouter.get("/",getAllPosts);
postRouter.get("/:id",getPostById);
postRouter.get("/:id",getAllCommentsByPostId);

postRouter.put("/:id",updatePostById,basicAuthMiddleware, postValidationMiddleware, inputValidationMiddleware);

postRouter.post("/:id",createCommentByPostId,authMiddleware, commentsValidationMiddleware, inputValidationMiddleware);
postRouter.post("/",createPost,basicAuthMiddleware,postValidationMiddleware, inputValidationMiddleware);

postRouter.delete("/:id",deletePostById,basicAuthMiddleware);