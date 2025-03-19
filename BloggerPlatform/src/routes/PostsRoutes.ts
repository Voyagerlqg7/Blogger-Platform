import {Request, Response, Router} from 'express';
import {PostController} from "../Controllers/PostController";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {validationResult, } from "express-validator";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {BlogsController} from "../Controllers/BlogsController";



export const PostRouter = Router();

// Public routes
PostRouter.get('/', async (request: Request, response: Response) => {
    const blogs = await PostController.GetAllPosts();
    response.status(200).send(blogs);
});

PostRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await PostController.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});

// Protected routes
PostRouter.post('/', authMiddleware, postValidationMiddleware,inputValidationMiddleware, async  (request: Request, response: Response) => {
    const newPost = await PostController.AddNewPost(request.body);
    response.status(201).send(newPost);
});


PostRouter.put('/:id', authMiddleware, postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedPost = await PostController.UpdatePostByID(request.params.id, request.body);
    if (updatedPost) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});

PostRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const postToDelete = await PostController.DeletePostByID(request.params.id);
    if (postToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});
