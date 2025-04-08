import {Request, Response, Router} from 'express';
import {BusinessLayer} from '../Domain/BusinessLayer'
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";



export const PostRouter = Router();

// Public routes
PostRouter.get('/', async (request: Request, response: Response) => {
    const sortBy_q = request.query.sortBy as string || 'createdAt';
    const sortDirection_q = request.query.sortDirection as string || 'desc';
    const pageNumber_q = parseInt(request.query.page as string) || 1;
    const pageSize_q = parseInt(request.query.limit as string) || 10;

    const PostsQueryObjectParameters = {
        page: Number(pageNumber_q),
        pageSz: Number(pageSize_q),
        sortBy: sortBy_q,
        sortDirection: sortDirection_q,
    }

    const blogs = await BusinessLayer.GetAllPosts();
    response.status(200).send(blogs);
});

PostRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await BusinessLayer.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});

// Protected routes
PostRouter.post('/', authMiddleware, postValidationMiddleware,inputValidationMiddleware, async  (request: Request, response: Response) => {
    const newPost = await BusinessLayer.AddNewPost(request.body);
    response.status(201).send(newPost);
});


PostRouter.put('/:id', authMiddleware, postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedPost = await BusinessLayer.UpdatePostByID(request.params.id, request.body);
    if (updatedPost) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});

PostRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const postToDelete = await BusinessLayer.DeletePostByID(request.params.id);
    if (postToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});
