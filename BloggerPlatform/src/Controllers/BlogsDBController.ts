import {BlogsDB} from "../Objects/Blogs";
import {client} from "../mongo/ConnectDB"

const blogDBController = client.db("Blogs").collection<BlogsDB>("blogs");

export const BlogsDBController = {
    async GetAllBlogs (): Promise<BlogsDB[]> {
        return await blogDBController.find().toArray();
    },
    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        if (!id) return undefined;
        return await blogDBController.findOne({id:id}) || undefined;
    },
    async AddNewBlog (blog: BlogsDB): Promise<BlogsDB | undefined> {
        let newBlog ={
            id: new Date().getTime().toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl
        }
        const result = await blogDBController.insertOne(newBlog);
        return result.acknowledged ? newBlog : undefined
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