import {IBlogRepository} from "../../../core/repository/IBlogRepository";
import {Blog} from "../../../core/entities/Blog";
import {BlogsDB} from "../models/BlogModel";

export class BlogRepository implements IBlogRepository {
    async getAllBlogs(): Promise<Blog[]> {

    }
    async createBlog(): Promise<Blog> {

    }
    async getBlogById(blogId:string):Promise<Blog> {

    }
    async updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<void> {

    }
    async deleteBlogById(blogId:string):Promise<void> {

    }


}