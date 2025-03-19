import {Request, Response, Router} from 'express';
import {BlogsDBController} from "../Controllers/BlogsDBController";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";

interface CustomValidationError {
    value: any;
    msg: string;
    param: string;
    location: string;
}

export const BlogsRouter = Router();

BlogsRouter.get('/',  async (request: Request, response: Response) => {
    const blogs = await BlogsDBController.GetAllBlogs();
    response.status(200).send(blogs);
});

BlogsRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await BlogsDBController.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
BlogsRouter.post('/', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const newBlog = await BlogsDBController.AddNewBlog(request.body);
    response.status(201).send(newBlog);
});
BlogsRouter.put('/:id', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedBlog = await BlogsDBController.UpdateBlogByID(request.params.id, request.body);
    if ( updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }

});
BlogsRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const blogToDelete = await BlogsDBController.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});