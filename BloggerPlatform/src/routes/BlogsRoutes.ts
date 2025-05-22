import {Request, Response, Router} from 'express';
import {BlogsService} from "../Domain/BlogsService";
import {blogValidationMiddleware} from "../Validator/BlogsValidation";
import {postValidationMiddleware} from "../Validator/PostsValidation";
import {basicAuthMiddleware} from "../Authorization/BasicAuthMiddleware";
import {inputValidationMiddleware} from "../Validator/input-validation-middleware";

export const BlogsRouter = Router();
export interface BlogsPaginationParams {
    searchNameTerm: string | null;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    pageNumber: number;
    pageSize: number;
}
BlogsRouter.get('/', async (request: Request, response: Response) => {
    const searchNameTerm = request.query.searchNameTerm as string || null;
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;

    const queryParams: BlogsPaginationParams = {
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc'
    };

    const blogs = await BlogsService.GetAllBlogs(queryParams);
    response.status(200).send(blogs);
});
BlogsRouter.get('/:id', async (request: Request, response: Response) => {
    const blog = await BlogsService.GetBlogByID(request.params.id);
    if (blog) {
        response.status(200).send(blog);
    } else {
        response.status(404).send();
    }
});
BlogsRouter.get('/:blogId/posts', async (request:Request, response: Response)=>{
    const blogId = request.params.blogId;
    const searchNameTerm = request.query.searchNameTerm as string || null;
    const sortBy = request.query.sortBy as string || 'createdAt';
    const sortDirection = (request.query.sortDirection === 'asc' || request.query.sortDirection === 'desc')
        ? request.query.sortDirection
        : 'desc';
    const pageNumber = parseInt(request.query.pageNumber as string) || 1;
    const pageSize = parseInt(request.query.pageSize as string) || 10;


    const queryParams: BlogsPaginationParams = {
        pageNumber,
        pageSize,
        searchNameTerm,
        sortBy,
        sortDirection: sortDirection as 'asc' | 'desc'
    };
    const blogs = await BlogsService.GetAllPostsByBlogID(blogId, queryParams);
    if(!blogs){
        response.status(404).send();
    }
    else {
        response.status(200).send(blogs);
    }
});
BlogsRouter.post('/:blogId/posts',basicAuthMiddleware,postValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    try {
        const blogId = request.params.blogId;
        const updatedPost = await BlogsService.AddNewPostUsingBlogId(blogId, request.body);

        if (updatedPost) {
            response.status(201).send(updatedPost);
        } else {
            response.status(404).send({ error: "Failed to create post" });
        }
    } catch (error) {
        console.error("Error creating post:", error);
        response.status(500).send({ error: "A server error has occurred" });
    }
});
BlogsRouter.post('/', basicAuthMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const newBlog = await BlogsService.AddNewBlog(request.body);
    response.status(201).send(newBlog);
});
BlogsRouter.put('/:id', basicAuthMiddleware, blogValidationMiddleware, inputValidationMiddleware, async (request: Request, response: Response) => {
    const updatedBlog = await BlogsService.UpdateBlogByID(request.params.id, request.body);
    if ( updatedBlog) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }

});
BlogsRouter.delete('/:id', basicAuthMiddleware, async (request: Request, response: Response) => {
    const blogToDelete = await BlogsService.DeleteBlogByID(request.params.id);
    if (blogToDelete) {
        response.status(204).send();
    } else {
        response.status(404).send();
    }
});