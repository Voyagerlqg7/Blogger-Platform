import {Blog} from "../entities/Blog";
import {Post} from "../entities/Post";

export interface IBlogRepository {
    getAllBlogs(): Blog;
    getAllPostsFromBlog(id:string) : Blog;
    createBlog(name:string, description:string, websiteUrl:string):Blog;
    createPostForSpecialBlog(blogId: string, title:string, shortDescription:string, content:string):Post;
    getBlogById(id:string):Blog;
    UpdateBlogById(id:string):Blog;
    DeleteBlogById(id:string):void;
}