import {Router} from "express";
import {createBlogHandler, getAllBlogsHandler} from "../controllers/BlogHTTPController";
import {getBlogByIdHandler, updateBlogHandler, deleteBlogHandler} from "../controllers/BlogHTTPController";
import {getAllPostsFromBlogHandler,createPostForSpecialBlogHandler} from "../controllers/BlogHTTPController";

export const blogRouter = Router();

blogRouter.get("/", getAllBlogsHandler);
blogRouter.get("/:id", getAllPostsFromBlogHandler);
blogRouter.get("/:id", getBlogByIdHandler);

blogRouter.put("/:id", updateBlogHandler);


blogRouter.post("/", createBlogHandler);
blogRouter.post("/:id", createPostForSpecialBlogHandler);
blogRouter.delete("/:id", deleteBlogHandler);