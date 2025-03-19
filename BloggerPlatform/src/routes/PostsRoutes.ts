import {Request, Response, Router} from 'express';
import {PostDBController} from "../Controllers/PostDBController";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";



export const PostRouter = Router();

// Public routes
PostRouter.get('/', async (request: Request, response: Response) => {
    const blogs = await PostDBController.GetAllPosts();
    response.status(200).send(blogs);
});

PostRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await PostDBController.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});

// Protected routes
PostRouter.post('/', authMiddleware, postValidationMiddleware,inputValidationMiddleware, async  (request: Request, response: Response) => {
    const newPost = await PostDBController.AddNewPost(request.body);
    response.status(201).send(newPost);
});


PostRouter.put('/:id', authMiddleware, postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedPost = await PostDBController.UpdatePostByID(request.params.id, request.body);
    if (updatedPost) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});

PostRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const postToDelete = await PostDBController.DeletePostByID(request.params.id);
    if (postToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});
