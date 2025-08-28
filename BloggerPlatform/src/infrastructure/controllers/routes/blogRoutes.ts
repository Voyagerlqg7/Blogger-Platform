import {Router} from "express";
import {createBlogHandler, getAllBlogsHandler} from "../BlogHTTPController";
import {getBlogByIdHandler, updateBlogHandler, deleteBlogHandler} from "../BlogHTTPController";
import {getAllPostsFromBlogHandler,createPostForSpecialBlogHandler} from "../BlogHTTPController";
import {blogValidationMiddleware} from "../../middlewares/BlogsValidation";


import {basicAuthMiddleware} from "../../auth/BasicAuthMiddleware";
import {inputValidationMiddleware} from "../../middlewares/input-validation-middleware";

export const blogRouter = Router();

blogRouter.get("/", getAllBlogsHandler);
blogRouter.get("/:id", getAllPostsFromBlogHandler);
blogRouter.get("/:id", getBlogByIdHandler);

blogRouter.put("/:id", updateBlogHandler,basicAuthMiddleware,blogValidationMiddleware,inputValidationMiddleware);


blogRouter.post("/", createBlogHandler,basicAuthMiddleware,blogValidationMiddleware,inputValidationMiddleware);
blogRouter.post("/:id", createPostForSpecialBlogHandler, basicAuthMiddleware,blogValidationMiddleware,inputValidationMiddleware);
blogRouter.delete("/:id", deleteBlogHandler,basicAuthMiddleware);