import {Request, Response, Router} from 'express';
import {BlogsController} from "../Controllers/BlogsController";
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
BlogsRouter.post('/', async (request: Request, response: Response) => {
    BlogsController.AddNewBlog(request.body);
    response.status(201).send();
})
BlogsRouter.put('/', async (request: Request, response: Response) => {

})
BlogsRouter.delete('/', async (request: Request, response: Response) => {

})