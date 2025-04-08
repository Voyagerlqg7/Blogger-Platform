import { ObjectId } from 'mongodb';
import {BlogsDB, BlogsPage} from "../Objects/Blogs";
import { client } from "../mongo/ConnectDB";
import {BlogsQueryParams} from "../routes/BlogsRoutes";
export const blogsDBCollection = client.db("BloggerPlatform").collection<BlogsDB>("blogs");

export const BlogsDBController = {
    async GetAllBlogs(params: BlogsQueryParams): Promise<BlogsPage | undefined>{
        try {
            const {
                searchNameTerm,
                sortBy,
                sortDirection,
                pageNumber,
                pageSize
            } = params; //Тот самый квери

            //как это всё сортировать
            const filter = searchNameTerm
                ? { name: { $regex: searchNameTerm, $options: 'i' } }
                : {};

            const sort: Record<string, 1 | -1> = {
                [sortBy]: sortDirection === 'asc' ? 1 : -1
            };

            const totalCount = await blogsDBCollection.countDocuments(filter);
            const pagesCount = Math.ceil(totalCount / pageSize);

            const blogs = await blogsDBCollection
                .find(filter)
                .sort(sort)
                .skip((pageNumber - 1) * pageSize)
                .limit(pageSize)
                .toArray();

            const items = blogs.map(blog => ({
                id: blog._id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.websiteUrl,
                createdAt: blog.createdAt,
                isMembership: blog.isMembership
            }));

            return {
                pagesCount,
                page: pageNumber,
                pageSize,
                totalCount,
                items
            };
        } catch (error) {
            console.error("Error fetching blogs:", error);
            throw new Error("Failed to fetch blogs");
        }
    },
    async GetBlogByID(id: string): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        try {
            const blog = await blogsDBCollection.findOne({ _id: new ObjectId(id) });

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

    async AddNewBlog(newBlog: BlogsDB): Promise<BlogsDB | undefined> {

        try {
            const result = await blogsDBCollection.insertOne(newBlog);
            if (!result.acknowledged) return undefined;

            return {
                id: result.insertedId.toString(),
                name: newBlog.name,
                description: newBlog.description,
                websiteUrl: newBlog.websiteUrl,
                createdAt: newBlog.createdAt,
                isMembership: newBlog.isMembership
            };
        } catch (error) {
            console.error("Error adding new blog:", error);
            throw new Error("Failed to add blog");
        }
    },

    async DeleteBlogByID(id: string | null): Promise<boolean> {
        if (!id) return false;

        try {
            const result = await blogsDBCollection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting blog by ID:", error);
            throw new Error("Failed to delete blog");
        }
    },

    async UpdateBlogByID(id: string, blog: BlogsDB): Promise<BlogsDB | undefined> {
        if (!id) return undefined;

        try {
            const updateResult = await blogsDBCollection.findOneAndUpdate(
                { _id: new ObjectId(id) },
                { $set: blog },
                { returnDocument: "after" }
            );

            return updateResult ? {
                id: updateResult._id.toString(),
                name: updateResult.name,
                description: updateResult.description,
                websiteUrl: updateResult.websiteUrl,
                createdAt: updateResult.createdAt,
                isMembership: updateResult.isMembership
            } : undefined;
        } catch (error) {
            console.error("Error updating blog by ID:", error);
            throw new Error("Failed to update blog");
        }
    }
};
