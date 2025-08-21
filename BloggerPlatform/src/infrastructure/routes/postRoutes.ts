import {Router} from "express";
import {getAllPosts,getPostById,createPost,deletePostById} from "../controllers/PostHTTPController";
import {updatePostById,getAllCommentsByPostId,createCommentByPostId} from "../controllers/PostHTTPController";

import {basicAuthMiddleware} from "../auth/BasicAuthMiddleware";

const postRouter = Router();

postRouter.get("/",getAllPosts);
postRouter.get("/:id",getPostById);
postRouter.get("/:id",getAllCommentsByPostId);

postRouter.put("/:id",updatePostById,basicAuthMiddleware);

postRouter.post("/:id",createCommentByPostId);
postRouter.post("/:id",createPost,basicAuthMiddleware);

postRouter.delete("/:id",deletePostById,basicAuthMiddleware);