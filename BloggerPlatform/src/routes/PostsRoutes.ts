import {Request, Response, Router} from 'express';
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {basicAuthMiddleware} from "../Authorization/BasicAuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";
import {PostsService} from "../Domain/PostsService";
import {commentsValidationMiddleware} from "../Validator/CommentsValidation";
import {AuthMiddleware} from "../Authorization/AuthMiddleware";


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
        pageNumber,
        pageSize,
        sortDirection: sortDirection as 'asc' | 'desc',
    }

    const blogs = await PostsService.GetAllPosts(queryParams);
    response.status(200).send(blogs);
});
PostRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await PostsService.GetPostByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
PostRouter.post('/', basicAuthMiddleware, postValidationMiddleware,inputValidationMiddleware, async  (request: Request, response: Response) => {
    const newPost = await PostsService.AddNewPost(request.body);
    response.status(201).send(newPost);
});
PostRouter.put('/:id', basicAuthMiddleware, postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedPost = await PostsService.UpdatePostByID(request.params.id, request.body);
    if (updatedPost) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});
PostRouter.delete('/:id', basicAuthMiddleware, async (request: Request, response: Response) => {
    const postToDelete = await PostsService.DeletePostByID(request.params.id);
    if (postToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});
PostRouter.get('/:postId/comments', async (req: Request, res: Response) => {
    const postId = req.params.postId;
    const sortBy = req.query.sortBy as string || 'createdAt';
    const sortDirection = (req.query.sortDirection === 'asc' || req.query.sortDirection === 'desc')
        ? req.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    const queryParams: PostsQueryParams = {
        pageNumber,
        pageSize,
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc'
    };
    const CommentsUnderPost = await PostsService.GetCommentsFromPost(postId, queryParams);
    if(CommentsUnderPost) {
        res.status(200).send(CommentsUnderPost);
    }
    else{
        res.status(404).send();
    }
})
PostRouter.post('/:postId/comments', AuthMiddleware, commentsValidationMiddleware, inputValidationMiddleware, async (req: Request, res: Response) => {

        const userLogin = req.user!.email;
        const userId = req.user!._id; // безопасно, если есть AuthMiddleware
        const postId = req.params.postId;
        const newComment = await PostsService.CreateComment(req.body, userId.toString(), userLogin,postId);

        if (newComment) {
            res.status(201).send(newComment);
        } else {
            res.sendStatus(404);
        }
    });
