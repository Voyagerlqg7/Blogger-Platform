import {Blog} from "../entities/Blog";
import {UpdateBlogDTO} from "./DTO/BlogDTO";
import {Post} from "../entities/Post";

export interface IBlogRepository {
    getAllBlogs(): Promise<Blog[]>;
    createBlog(blog:Blog):Promise<Blog>;
    getAllPostsFromBlog(blogId:string):Promise<Post[]>;
    createNewPostForSpecialBlog(post:Post):Promise<Post>;
    getBlogById(blogId:string):Promise<Blog | null>;
    updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<void | null>;
    deleteBlogById(blogId:string):Promise<void | null>;
}