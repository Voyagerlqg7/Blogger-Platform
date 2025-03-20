import { ObjectId } from 'mongodb';
import { BlogsDB } from "../Objects/Blogs";
import { client } from "../mongo/ConnectDB";

const blogDBController = client.db("BloggerPlatform").collection<BlogsDB>("blogs");

export const BlogsDBController = {
    async GetAllBlogs(): Promise<BlogsDB[]> {
        const blogs = await blogDBController.find().toArray();
        return blogs;
        /*return blogs.map(blog => ({
            id: blog._id.toString(), // Преобразуем _id в id
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }));*/
    },

    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        const blog = await blogDBController.findOne({ _id: new ObjectId(id) });

        return blog ? {
            id: blog._id.toString(), // Преобразуем _id в id
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        } : undefined;
    },

    async AddNewBlog(blog: BlogsDB): Promise<BlogsDB | undefined> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        const result = await blogDBController.insertOne(newBlog);

        return result.acknowledged ? {
            id: result.insertedId.toString(), // Используем insertedId как id
            ...newBlog
        } : undefined;
    },

    async DeleteBlogByID(id: string | null): Promise<boolean> {
        if (!id) return false;

        const result = await blogDBController.deleteOne({ _id: new ObjectId(id) });
        return result.deletedCount > 0;
    },

    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        const updateResult = await blogDBController.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: blog },
            { returnDocument: "after" }
        );
        return updateResult ? {
            id: updateResult._id.toString(), // Преобразуем _id в id
            name: updateResult.name,
            description: updateResult.description,
            websiteUrl: updateResult.websiteUrl,
            createdAt: updateResult.createdAt,
            isMembership: updateResult.isMembership
        } : undefined;
    }
};