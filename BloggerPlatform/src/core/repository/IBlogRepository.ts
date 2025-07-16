import {Blog} from "../entities/Blog";
import {Post} from "../entities/Post";
import {CreateBlogDTO, CreatePostForSpecialBlogDTO} from "./DTO/BlogDTO";

export interface IBlogRepository {
    getAllBlogs(): Promise<Blog[]>;
    getAllPostsFromBlog(id:string) : Promise<Blog>;
    createBlog(dto:CreateBlogDTO):Promise<Blog>;
    createPostForSpecialBlog(dto:CreatePostForSpecialBlogDTO):Promise<Post>;
    getBlogById(blogId:string):Promise<Blog>;
    UpdateBlogById(blogId:string):Promise<Blog>;
    DeleteBlogById(blogId:string):Promise<void>;
}