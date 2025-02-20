import {Request, Response, Router} from 'express';
import {PostController} from "../Controllers/PostController";

export const PostRouter = Router();

PostRouter.get('/', async (request: Request, response: Response) => {
    const blogs = PostController.GetAllPosts();
    response.status(200).send(blogs);
})
PostRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = PostController.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send({ message: 'Blog not found' });
    }
})
PostRouter.post('/', async (request: Request, response: Response) => {
    const newpost = PostController.AddNewPost(request.body);
    if(newpost){
        response.status(201).send(newpost);
    }
    else {
        response.status(404).send({ message: 'Blog not found' });
    }
})
PostRouter.put('/', async (request: Request, response: Response) => {

})
PostRouter.delete('/', async (request: Request, response: Response) => {

})