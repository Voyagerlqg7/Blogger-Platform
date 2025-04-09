import {Request, Response, Router} from 'express';
import {BusinessLayer} from "../Domain/BusinessLayer";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {authMiddleware} from "../BasicAuthorization/authMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";

export const BlogsRouter = Router();
export interface BlogsQueryParams {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
BlogsRouter.get('/', async (request: Request, response: Response) => {
    const searchNameTerm = request.query.search as string || null;
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.page as string) || 1;
    const pageSize = parseInt(request.query.limit as string) || 10;

    const queryParams: BlogsQueryParams = {
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc'
    };

    const blogs = await BusinessLayer.GetAllBlogs(queryParams);
    response.status(200).send(blogs);
});
BlogsRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await BusinessLayer.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
BlogsRouter.get('/:blogId/posts', async (request:Request, response: Response)=>{
    const blogId = request.params.blogId;
    const searchNameTerm = request.query.search as string || null;
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.page as string) || 1;
    const pageSize = parseInt(request.query.limit as string) || 10;

    const queryParams: BlogsQueryParams = {
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc'
    };
    const blogs = await BusinessLayer.GetAllPostsByBlogID(blogId, queryParams);
    response.status(200).send(blogs);
});
BlogsRouter.post('/:blogId/posts',authMiddleware,postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const blogId = request.params.blogId;
    const UpdatedBlog = await BusinessLayer.AddNewPostUsingBlogId(blogId, request.body);
    response.status(201).send(UpdatedBlog);
});
BlogsRouter.post('/', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const newBlog = await BusinessLayer.AddNewBlog(request.body);
    response.status(201).send(newBlog);
});
BlogsRouter.put('/:id', authMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedBlog = await BusinessLayer.UpdateBlogByID(request.params.id, request.body);
    if ( updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }

});
BlogsRouter.delete('/:id', authMiddleware, async (request: Request, response: Response) => {
    const blogToDelete = await BusinessLayer.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});