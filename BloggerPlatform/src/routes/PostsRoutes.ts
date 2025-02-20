import {Request, Response, Router} from 'express';
import {PostController} from "../Controllers/PostController";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {validationResult} from "express-validator";
import {authMiddleware} from "../BasicAuthorization/authMiddleware"
import {blogs} from "../DataB/Blogs";
import {BlogsRouter} from "./BlogsRoutes";
import {posts} from "../DataB/Posts";

export const PostRouter = Router();


PostRouter.get('/', (request: Request, response: Response) => {
    const blogs = PostController.GetAllPosts();
    response.status(200).send(blogs);
});
PostRouter.get('/:id', (request: Request, response: Response) => {
    const blog = PostController.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send({ message: 'Post not found' });
    }
});
PostRouter.post('/', authMiddleware, postValidationMiddleware,(request: Request, response: Response) => {
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
        const newPost = PostController.AddNewPost(request.body);
        response.status(201).send(newPost);
    }
});
PostRouter.put('/:id',authMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        response.status(400).send({
            errorsMessages: errors.array().map(err => ({
                message: err.msg,
                field: err.type
            }))
        });
    }
    const updatedPost = PostController.UpdatePostByID(request.params.id, request.body);
    if (updatedPost) {
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Post not found' });
    }
});
PostRouter.delete('/:id', authMiddleware, (request: Request, response: Response) => {
    const postToDelete = PostController.DeletePostByID(request.params.id);
    if(postToDelete){
        response.status(204).send();
    }
    else{response.status(404).send({ message: 'Post not found' });}
});
PostRouter.get('/testing/all-data',  (request: Request, response: Response) => {
    posts.length = 0;
    response.status(204).send();
});