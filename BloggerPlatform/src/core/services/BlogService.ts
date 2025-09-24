import {IBlogRepository} from "../repository/IBlogRepository";
import {Blog} from "../entities/Blog";
import {v4 as uuidv4} from "uuid";
import {CreateBlogDTO, UpdateBlogDTO} from "../repository/DTO/BlogDTO";
import {Post} from "../entities/Post";
import {CreatePostForSpecialBlogDTO} from "../repository/DTO/PostDTO";
import {BlogsQueryDTO, PagedResponse, PostsQueryDTO} from "../repository/DTO/QueryParamsDTO";
import { injectable, inject } from "inversify";


@injectable()
export class BlogService {
    constructor(@inject ("IBlogRepository") private blogRepository: IBlogRepository) {}

    async getAllBlogs(query:BlogsQueryDTO): Promise<PagedResponse<Blog>>{
        return await this.blogRepository.getAllBlogs(query);
    }
    async createBlog(dto:CreateBlogDTO):Promise<Blog>{
        const id = uuidv4();
        const newBlog = new Blog(
            id,
            dto.name,
            dto.description,
            dto.websiteUrl,
            new Date().toISOString(),
            true
        );
        return await this.blogRepository.createBlog(newBlog);
    }
    async getAllPostsFromBlog(blogId:string, query:PostsQueryDTO):Promise<PagedResponse<Post>>{
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return await this.blogRepository.getAllPostsFromBlog(blogId,query);
    }
    async createNewPostForSpecialBlog(blogId:string, dto:CreatePostForSpecialBlogDTO):Promise<Post>{
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Cannot find blog with id 'blogId': " + blogId);
        }
        const id = uuidv4();
        const newPost = new Post(
            id,
            dto.title,
            dto.content,
            dto.shortDescription,
            blogId,
            blog.name,
            new Date().toISOString()
        )
        return await this.blogRepository.createNewPostForSpecialBlog(newPost);

    }
    async getBlogById(blogId:string):Promise<Blog | null> {
        return await this.blogRepository.getBlogById(blogId);
    }
    async updateBlogById(blogId:string, dto:UpdateBlogDTO):Promise<void | null>{
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        await this.blogRepository.updateBlogById(blogId, dto);
    }
    async deleteBlogById(blogId:string):Promise<void | null>{
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return await this.blogRepository.deleteBlogById(blogId);
    }
}