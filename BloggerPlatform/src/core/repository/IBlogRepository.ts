import {Blog} from "../entities/Blog";
import {Post} from "../entities/Post";
import {CreateBlogDTO, CreatePostForSpecialBlogDTO} from "./DTO/BlogDTO";

export interface IBlogRepository {
    getAllBlogs(): Blog;
    getAllPostsFromBlog(id:string) : Blog;
    createBlog(dto:CreateBlogDTO):Blog;
    createPostForSpecialBlog(dto:CreatePostForSpecialBlogDTO):Post;
    getBlogById(blogId:string):Blog;
    UpdateBlogById(blogId:string):Blog;
    DeleteBlogById(blogId:string):void;
}