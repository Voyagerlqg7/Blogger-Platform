import {Blog} from "../entities/Blog";
import {UpdateBlogDTO} from "./DTO/BlogDTO";
import {Post} from "../entities/Post";
import {BlogsQueryDTO, PagedResponse, PostsQueryDTO} from "./DTO/QueryParamsDTO";


export interface IBlogRepository {
    getAllBlogs(Q_params:BlogsQueryDTO): Promise<PagedResponse<Blog>>;
    createBlog(blog:Blog):Promise<Blog>;
    getAllPostsFromBlog(blogId:string, query:PostsQueryDTO):Promise<PagedResponse<Post>>;
    createNewPostForSpecialBlog(post:Post):Promise<Post>;
    getBlogById(blogId:string):Promise<Blog | null>;
    updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<void | null>;
    deleteBlogById(blogId:string):Promise<void | null>;
}