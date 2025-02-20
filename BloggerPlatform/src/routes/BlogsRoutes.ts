import {Request, Response, Router} from 'express';
import {BlogsController} from "../Controllers/BlogsController";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {validationResult} from 'express-validator';
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {blogs, BlogsDB} from "../DataB/Blogs";
import {posts} from "../DataB/Posts";
import app from "../index";

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
        response.status(400).send({
            errorsMessages: errors.array().map(err => ({
                message: err.msg,
                field: err.type
            }))
        });
    }
    else{
        const newBlog = BlogsController.AddNewBlog(request.body);
        response.status(201).send(newBlog);
    }
});
BlogsRouter.put('/:id',authMiddleware, blogValidationMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).send({
            errorsMessages: errors.array().map(err => ({
                message: err.msg,
                field: err.type
            }))
        });
    }
    const updatedBlog = BlogsController.UpdateBlogByID(request.params.id, request.body);
    if (updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
});

BlogsRouter.delete('/:id',authMiddleware, (request: Request, response: Response) => {
    const blogToDelete = BlogsController.DeleteBlogByID(request.params.id);
    if(blogToDelete){
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
});

BlogsRouter.get('/testing/all-data',  (request: Request, response: Response) => {
    blogs.length = 0;
    posts.length = 0;
    response.status(204).send();
});