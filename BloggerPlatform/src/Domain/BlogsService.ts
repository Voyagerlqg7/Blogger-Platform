import {BlogsQueryParams} from "../routes/BlogsRoutes";
import {BlogsDB, BlogsPage} from "../Objects/Blogs";
import {blogsDBCollection, BlogsDBController} from "../Repository/BlogsDBController";
import {PostsQueryParams} from "../routes/PostsRoutes";
import {PostsDB, PostsPage} from "../Objects/Posts";
import {PostDBController} from "../Repository/PostDBController";
import {ObjectId} from "mongodb";
import {NewUserTemplate, UserQueryParams} from "../routes/UserRouter";
import {UsersPage} from "../Objects/User";
import {UsersDBController} from "../Repository/UserDBController";


export const BlogsService = {
    async GetAllBlogs(queryParams:BlogsQueryParams): Promise<BlogsPage | undefined> {
        return BlogsDBController.GetAllBlogs(queryParams);
    },
    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        return BlogsDBController.GetBlogByID(id);
    },
    async GetAllPostsByBlogID(blogId :string, queryParams:PostsQueryParams): Promise<PostsPage | undefined> {
        return BlogsDBController.GetAllPostsByBlogID(blogId, queryParams);
    },
    async AddNewBlog(blog: BlogsDB): Promise<BlogsDB | undefined> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        return await BlogsDBController.AddNewBlog(newBlog);
    },
    async DeleteBlogByID(id: string | null): Promise<boolean> {
        return await BlogsDBController.DeleteBlogByID(id);
    },
    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        return await BlogsDBController.UpdateBlogByID(id, blog);
    }
}