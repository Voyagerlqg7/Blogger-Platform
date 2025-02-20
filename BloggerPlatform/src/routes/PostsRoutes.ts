import {Request, Response, Router} from 'express';
import {PostController} from "../Controllers/PostController";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {validationResult} from "express-validator";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";



export const PostRouter = Router();

// Public routes
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

// Protected routes
PostRouter.post('/', authMiddleware, postValidationMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(error => {
            let field = "unknown";
            if (error.msg.includes("Title")) field = "title";
            if (error.msg.includes("ShortDescription")) field = "shortDescription";
            if (error.msg.includes("Content")) field = "content";
            if (error.msg.includes("BlogId")) field = "blogId";

            return {
                message: error.msg,
                field: field
            };
        });

        response.status(400).send({
            errorsMessages: errorsMessages
        });
    } else {
        const newPost = PostController.AddNewPost(request.body);
        response.status(201).send(newPost);
    }
});


PostRouter.put('/:id', authMiddleware, postValidationMiddleware, (request: Request, response: Response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array().map(error => {
            let field = "unknown";
            if (error.msg.includes("Title")) field = "title";
            if (error.msg.includes("ShortDescription")) field = "shortDescription";
            if (error.msg.includes("Content")) field = "content";
            if (error.msg.includes("BlogId")) field = "blogId";

            return {
                message: error.msg,
                field: field
            };
        });

        response.status(400).send({
            errorsMessages: errorsMessages
        });
    } else {
        const updatedPost = PostController.UpdatePostByID(request.params.id, request.body);
        if (updatedPost) {
            response.status(204).send(); // Успешное обновление, нет содержимого
        } else {
            response.status(404).send({ message: 'Post not found' }); // Пост не найден
        }
    }
});

PostRouter.delete('/:id', authMiddleware, (request: Request, response: Response) => {
    const postToDelete = PostController.DeletePostByID(request.params.id);
    if (postToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send({ message: 'Post not found' });
    }
});
