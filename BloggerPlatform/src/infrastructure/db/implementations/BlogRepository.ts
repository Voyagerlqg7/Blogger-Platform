import {Blog} from "../../../core/entities/Blog";
import {blogsDBCollection} from "../collections/collections";
import {ObjectId} from "mongodb";
import {BlogsDB} from "../models/BlogModel";

export class BlogRepository {
    async getAllBlogs(): Promise<Blog[]> {

    }
    async getBlogById(id: string): Promise<Blog | null> {
        const blogDB = await blogsDBCollection.findOne({ _id: new ObjectId(id) });
        if (!blogDB) return null;

        return new Blog(
            blogDB._id.toString(),
            blogDB.name,
            blogDB.description,
            blogDB.websiteUrl,
            blogDB.createdAt.toISOString(),
            blogDB.isMembership
        );
    }
    async deleteBlogById(id: string): Promise<void | null> {
        const blogDB = await blogsDBCollection.findOne({ _id: new ObjectId(id) });
        if (!blogDB) return null;
        else {
            await blogsDBCollection.deleteOne({ _id: new ObjectId(id) });
        }
    }
    async UpdateBlog(id:string, blog:Blog): Promise<void | null> {
        const blogDB = await blogsDBCollection.findOne({ _id: new ObjectId(id) });
        if (!blogDB) return null;
        else {
            const result = await blogsDBCollection.updateOne(
                {_id: new ObjectId(id)},
                {
                    $set: {
                        name: blog.name,
                        description: blog.description,
                        websiteUrl: blog.websiteUrl
                    }
                },
            );
        }
    }
    async save(blog: Blog): Promise<void> {
        const blogToSave: BlogsDB = {
            _id: new ObjectId(blog.id),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date(blog.createdAt),
            isMembership: false
        };
        await blogsDBCollection.insertOne(blogToSave);
    }
}
