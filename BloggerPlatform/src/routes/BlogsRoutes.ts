import {Request, Response, Router} from 'express';
import {BlogsController} from "../Controllers/BlogsController";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {body, validationResult} from 'express-validator';
import {authMiddleware} from "../BasicAuthorization/authMiddleware";



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
        response.status(404).send({ message: 'Blog not found' });
    }
});
BlogsRouter.post('/', authMiddleware, blogValidationMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(error => ({
            message: error.msg,
            field: error
        }));
        response.status(400).send({
            errorsMessages: errorsMessages
        });
    } else {
        const newBlog = BlogsController.AddNewBlog(request.body);
        response.status(201).send(newBlog);
    }
});
BlogsRouter.put('/:id', authMiddleware,blogValidationMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).send({
            errorsMessages: errors.array()
        });
    }
    const updatedBlog = BlogsController.UpdateBlogByID(request.params.id, request.body);
    if (updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
});

BlogsRouter.delete('/:id', authMiddleware, (request: Request, response: Response) => {
    const blogToDelete = BlogsController.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
});