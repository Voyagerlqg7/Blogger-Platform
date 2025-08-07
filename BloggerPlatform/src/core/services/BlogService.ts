import {IBlogRepository} from "../repository/IBlogRepository";
import {Blog} from "../entities/Blog";
import {v4 as uuidv4} from "uuid";
import {CreateBlogDTO, UpdateBlogDTO} from "../repository/DTO/BlogDTO";
import {Post} from "../entities/Post";
import {CreatePostDTO} from "../repository/DTO/PostDTO";


export class BlogService {
    constructor(private readonly blogRepository: IBlogRepository) {}
    async getAllBlogs(): Promise<Blog[]>{
        return await this.blogRepository.getAllBlogs();
    }
    async createBlog(blog:Blog, dto:CreateBlogDTO):Promise<Blog>{
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
    async getAllPostsFromBlog(blogId:string):Promise<Post[]>{
        const blog = await this.blogRepository.getBlogById(blogId);
        if (!blog) {
            throw new Error("Blog not found");
        }
        return await this.blogRepository.getAllPostsFromBlog(blogId);
    }
    async createNewPostForSpecialBlog(dto:CreatePostDTO):Promise<Post>{
        const blog = await this.blogRepository.getBlogById(dto.blogId);
        if (!blog) {
            throw new Error("Cannot find blog with id 'blogId': " + dto.blogId);
        }
        const id = uuidv4();
        const newPost = new Post(
            id,
            dto.title,
            dto.content,
            dto.shortDescription,
            dto.blogId,
            blog.name,
            new Date().toISOString()
        )
        return await this.createNewPostForSpecialBlog(newPost);

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