import {Blog} from "../entities/Blog";
import {UpdateBlogDTO} from "./DTO/BlogDTO";

export interface IBlogRepository {
    getAllBlogs(): Promise<Blog[]>;
    createBlog(blog:Blog):Promise<Blog>;
    getBlogById(blogId:string):Promise<Blog | null>;
    updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<void | null>;
    deleteBlogById(blogId:string):Promise<void | null>;
}