import { ObjectId } from 'mongodb';
import { BlogsDB } from "../Objects/Blogs";
import { client } from "../mongo/ConnectDB";

const blogDBController = client.db("BloggerPlatform").collection<BlogsDB>("blogs");

const COLLECTION_NAME = "blogs"; // Константа для имени коллекции

export const BlogsDBController = {
    async GetAllBlogs(): Promise<BlogsDB[]> {
        try {
            const blogs = await blogDBController.find().toArray();
            return blogs.map(blog => ({
                _id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            }));
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw new Error("Failed to fetch blogs");
        }
    },

    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        try {
            const blog = await blogDBController.findOne({ _id: new ObjectId(id) });

            return blog ? {
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            } : undefined;
        } catch (error) {
            console.error("Error fetching blog by ID:", error);
            throw new Error("Failed to fetch blog");
        }
    },

    async AddNewBlog(blog: BlogsDB): Promise<BlogsDB | undefined> {
        const newBlog = {
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: new Date().toISOString(),
            isMembership: false
        };

        try {
            const result = await blogDBController.insertOne(newBlog);
            return result.acknowledged ? {
                id: result.insertedId.toString(),
                ...newBlog
            } : undefined;
        } catch (error) {
            console.error("Error adding new blog:", error);
            throw new Error("Failed to add blog");
        }
    },

    async DeleteBlogByID(id: string | null): Promise<boolean> {
        if (!id) return false;

        try {
            const result = await blogDBController.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting blog by ID:", error);
            throw new Error("Failed to delete blog");
        }
    },

    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        try {
            const updateResult = await blogDBController.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: blog },
                { returnDocument: "after" }
            );

            return updateResult.value ? {
                id: updateResult.value._id.toString(),
                name: updateResult.value.name,
                description: updateResult.value.description,
                websiteUrl: updateResult.value.websiteUrl,
                createdAt: updateResult.value.createdAt,
                isMembership: updateResult.value.isMembership
            } : undefined;
        } catch (error) {
            console.error("Error updating blog by ID:", error);
            throw new Error("Failed to update blog");
        }
    }
};
