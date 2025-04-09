import {Request, Response, Router} from 'express';
import {BusinessLayer} from '../Domain/BusinessLayer'
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";



export const PostRouter = Router();
export interface PostsQueryParams {
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}

PostRouter.get('/', async (request: Request, response: Response) => {
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    const queryParams:PostsQueryParams = {
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc',
        pageNumber,
        pageSize
    }

    const blogs = await BusinessLayer.GetAllPosts(queryParams);
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
