import {Request, Response, Router} from 'express';
import {BlogsController} from "../Controllers/BlogsController";
import {blogValidationMiddleware} from "../Validator/BlogsValidation"
export const BlogsRouter = Router();

BlogsRouter.get('/', async (request: Request, response: Response) => {
    const blogs = BlogsController.GetAllBlogs();
    response.status(200).send(blogs);
})
BlogsRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = BlogsController.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
})
BlogsRouter.post('/', blogValidationMiddleware, async (request: Request, response: Response) => {
    const newblog = BlogsController.AddNewBlog(request.body);
    if(newblog){
        response.status(201).send(newblog);
    }
    else {
        response.status(404).send({ message: 'Blog not found' });
    }
})
BlogsRouter.put('/:id', async (request: Request, response: Response) => {

})
BlogsRouter.delete('/', async (request: Request, response: Response) => {
    const blogToDelete = BlogsController.DeleteBlogByID(request.params.id);
    if(blogToDelete){
        response.status(204).send();
    }
    else{response.status(404).send({ message: 'Post not found' });}
})