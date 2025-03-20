import {BlogsDB} from "../Objects/Blogs";
import {client} from "../mongo/ConnectDB"

const blogDBController = client.db("BloggerPlatform").collection<BlogsDB>("blogs");

export const BlogsDBController = {
    async GetAllBlogs (): Promise<BlogsDB[]> {
        const blogs = await blogDBController.find().toArray();

        return blogs.map(blog => ({
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership
        }));
    },
    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        if (!id) return undefined;
        return await blogDBController.findOne({id:id}) || undefined;
    },
    async AddNewBlog (blog: BlogsDB): Promise<BlogsDB | undefined> {
        let newBlog = {
            id: new Date().getTime().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };
        const result = await blogDBController.insertOne(newBlog);
        return result.acknowledged ? newBlog : undefined;
    },
    async DeleteBlogByID(id: string | null): Promise<boolean> {
        if (!id) return false;
        const result = await blogDBController.deleteOne({ id: id });
        return result.deletedCount > 0;
    },
    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        if (!id) return undefined;
        const updateResult = await blogDBController.findOneAndUpdate(
            { id: id },
            { $set: blog },
            { returnDocument: "after" }
        );
        return updateResult || undefined;
    }
};