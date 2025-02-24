import {Request, Response, Router} from 'express';
import {BlogsController} from "../Controllers/BlogsController";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {validationResult} from 'express-validator';
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";

interface CustomValidationError {
    value: any;
    msg: string;
    param: string;
    location: string;
}

export const BlogsRouter = Router();

BlogsRouter.get('/',  (request: Request, response: Response) => {
    const blogs = BlogsController.GetAllBlogs();
    response.status(200).send(blogs);
});

BlogsRouter.get('/:id', (request: Request, response: Response) => {
    const blog = BlogsController.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
BlogsRouter.post('/', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, (request: Request, response: Response) => {
    const newBlog = BlogsController.AddNewBlog(request.body);
    response.status(201).send(newBlog);
});
BlogsRouter.put('/:id', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, (request: Request, response: Response) => {
    const updatedBlog = BlogsController.UpdateBlogByID(request.params.id, request.body);
    if (updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }

});
BlogsRouter.delete('/:id', authMiddleware, (request: Request, response: Response) => {
    const blogToDelete = BlogsController.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});