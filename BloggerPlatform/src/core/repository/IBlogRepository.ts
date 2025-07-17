import {Blog} from "../entities/Blog";
import {CreateBlogDTO, UpdateBlogDTO} from "./DTO/BlogDTO";

export interface IBlogRepository {
    getAllBlogs(): Promise<Blog[]>;
    createBlog(dto:CreateBlogDTO):Promise<Blog>;
    getBlogById(blogId:string):Promise<Blog | null>;
    updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<Blog>;
    deleteBlogById(blogId:string):Promise<void | null>;
}