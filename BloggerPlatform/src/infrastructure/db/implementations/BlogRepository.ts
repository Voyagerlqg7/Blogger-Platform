import {IBlogRepository} from "../../../core/repository/IBlogRepository";
import {Blog} from "../../../core/entities/Blog";
import {blogsDBCollection} from "../collections/collections"
import {ObjectId} from "mongodb"
import {BlogMapper} from "../mappers/BlogMapper";
import {UpdateBlogDTO} from "../../../core/repository/DTO/BlogDTO";

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
    async deleteBlogById(blogId: string): Promise<void> {
        await blogsDBCollection.deleteOne({ _id: new ObjectId(blogId) });
    }

}