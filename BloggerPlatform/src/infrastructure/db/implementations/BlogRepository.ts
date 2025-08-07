import {IBlogRepository} from "../../../core/repository/IBlogRepository";
import {Blog} from "../../../core/entities/Blog";
import {blogsDBCollection, postsDBCollection} from "../collections/collections"
import {ObjectId} from "mongodb"
import {BlogMapper} from "../mappers/BlogMapper";
import {UpdateBlogDTO} from "../../../core/repository/DTO/BlogDTO";
import {PostMapper} from "../mappers/PostMapper";
import {Post} from "../../../core/entities/Post";

export class BlogRepository implements IBlogRepository {
    async getAllBlogs(): Promise<Blog[]> {

    }
    async createBlog(blog:Blog): Promise<Blog> {
        const newBlog = BlogMapper.toPersistence(blog);
        await blogsDBCollection.insertOne(BlogMapper.toPersistence(blog));
        return BlogMapper.toDomain(newBlog);
    }
    async getBlogById(blogId:string):Promise<Blog | null> {
        const blog = await blogsDBCollection.findOne({_id: new ObjectId(blogId)});
        if (!blog) {
            return null;
        }
        return BlogMapper.toDomain(blog);
    }
    async updateBlogById(blogId: string, dto: UpdateBlogDTO): Promise<void> {
        await blogsDBCollection.updateOne(
            { _id: new ObjectId(blogId) },
            { $set: { name: dto.name, description: dto.description, websiteUrl: dto.websiteUrl } }
        );
    }
    async getAllPostsFromBlog(blogId:string):Promise<Post[]>{

    }
    async createNewPostForSpecialBlog(post:Post):Promise<Post>{
        const newPost = PostMapper.toPersistence(post);
        await postsDBCollection.insertOne(newPost);
        return PostMapper.toDomain(newPost);
    }
    async deleteBlogById(blogId: string): Promise<void> {
        await blogsDBCollection.deleteOne({ _id: new ObjectId(blogId) });
    }

}