import {Router} from "express";
import {createBlogHandler, getAllBlogsHandler} from "../controllers/BlogHTTPController";
import {getBlogByIdHandler, updateBlogHandler, deleteBlogHandler} from "../controllers/BlogHTTPController";
import {getAllPostsFromBlogHandler,createPostForSpecialBlogHandler} from "../controllers/BlogHTTPController";

import {basicAuthMiddleware} from "../auth/BasicAuthMiddleware";

export const blogRouter = Router();

blogRouter.get("/", getAllBlogsHandler);
blogRouter.get("/:id", getAllPostsFromBlogHandler);
blogRouter.get("/:id", getBlogByIdHandler);

blogRouter.put("/:id", updateBlogHandler,basicAuthMiddleware);


blogRouter.post("/", createBlogHandler,basicAuthMiddleware);
blogRouter.post("/:id", createPostForSpecialBlogHandler, basicAuthMiddleware);
blogRouter.delete("/:id", deleteBlogHandler,basicAuthMiddleware);