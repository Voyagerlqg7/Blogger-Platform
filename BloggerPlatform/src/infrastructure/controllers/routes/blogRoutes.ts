import { Router } from "express";
import { BlogController } from "../BlogHTTPController";
import { blogValidationMiddleware } from "../../middlewares/BlogsValidation";
import { basicAuthMiddleware } from "../../auth/BasicAuthMiddleware";
import { inputValidationMiddleware } from "../../middlewares/input-validation-middleware";
import { container } from "../../DIContainers";
import {postValidationMiddleware} from "../../middlewares/PostsValidation";
import {OptionalAuthMiddleware} from "../../auth/OptionalAuthMiddleware";

export const blogRouter = Router();
const blogController = container.get<BlogController>(BlogController);
const optionalAuthMiddleware = container.get(OptionalAuthMiddleware);


blogRouter.get("/", blogController.getAllBlogsHandler);
blogRouter.get("/:id", blogController.getBlogByIdHandler);
blogRouter.get("/:id/posts", optionalAuthMiddleware.execute.bind(optionalAuthMiddleware), blogController.getAllPostsFromBlogHandler);

blogRouter.put("/:id",
    basicAuthMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogController.updateBlogHandler
);

blogRouter.post("/",
    basicAuthMiddleware,
    blogValidationMiddleware,
    inputValidationMiddleware,
    blogController.createBlogHandler
);

blogRouter.post("/:id/posts",
    basicAuthMiddleware,
    postValidationMiddleware,
    inputValidationMiddleware,
    blogController.createPostForSpecialBlogHandler
);

blogRouter.delete("/:id",
    basicAuthMiddleware,
    blogController.deleteBlogHandler
);