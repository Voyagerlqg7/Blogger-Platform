import {Request, Response, Router} from 'express';
import {BusinessLayer} from "../Domain/BusinessLayer";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";



export const BlogsRouter = Router();

BlogsRouter.get('/',  async (request: Request, response: Response) => {
    const blogs = await BusinessLayer.GetAllBlogs();
    response.status(200).send(blogs);
});

BlogsRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await BusinessLayer.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
BlogsRouter.post('/', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const newBlog = await BusinessLayer.AddNewBlog(request.body);
    response.status(201).send(newBlog);
});
BlogsRouter.put('/:id', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedBlog = await BusinessLayer.UpdateBlogByID(request.params.id, request.body);
    if ( updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }

});
BlogsRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const blogToDelete = await BusinessLayer.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});