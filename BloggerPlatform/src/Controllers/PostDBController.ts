import { PostsDB } from "../Objects/Posts";
import { client } from "../mongo/ConnectDB";
import {ObjectId} from "mongodb";
import {blogsDBCollection} from "./BlogsDBController";

export const postsDBCollection = client.db("BloggerPlatform").collection<PostsDB>("posts");

export const PostDBController = {
    async GetAllPosts(): Promise<PostsDB[]> {
        try {
            const posts = await postsDBCollection.find().toArray();
            return posts.map(posts => ({
                id: posts._id.toString(),
                title: posts.title,
                shortDescription: posts.shortDescription,
                content: posts.content,
                blogId: posts.blogId,
                blogName: posts.blogName,
                createdAt: posts.createdAt,
            }));
        } catch (error) {
            console.error('Error fetching blogs', error);
            throw new Error("Failed to fetch posts");
        }
    },
    async GetPostByID(id: string): Promise<PostsDB | undefined> {
        if (!ObjectId.isValid(id)) return undefined;

        const post = await postsDBCollection.findOne({ _id: new ObjectId(id) });
        if (!post) return undefined;

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
        };
    },
    async AddNewPost(newPost: PostsDB): Promise<PostsDB | undefined> {
        try {
            const result = await postsDBCollection.insertOne(newPost);
            if (!result.acknowledged) return undefined;

            return {
                id: result.insertedId.toString(),
                title: newPost.title,
                shortDescription: newPost.shortDescription,
                content: newPost.content,
                blogId: newPost.blogId,
                blogName: newPost.blogName,
                createdAt: newPost.createdAt,
            };
        } catch (error) {
            console.error("Error adding new post:", error);
            throw new Error("Failed to add post");
        }
    },
    async UpdatePostByID(id: string, post: Partial<PostsDB>): Promise<PostsDB | undefined> {
        if (!ObjectId.isValid(id)) {
            console.error("Invalid post ID:", id);
            return undefined;
        }

        let updateData: any = {...post};
        if (post.blogId && ObjectId.isValid(post.blogId)) {
            const blog = await blogsDBCollection.findOne({_id: new ObjectId(post.blogId)});
            if (!blog) {
                console.error("Blog not found for blogId:", post.blogId);
                return undefined;
            }
            updateData.blogName = blog.name; // Обновляем blogName, если меняем blogId
        }

        try {
            const updateResult = await postsDBCollection.findOneAndUpdate(
                {_id: new ObjectId(id)},
                {$set: updateData},
                {returnDocument: "after"}
            );

            return updateResult ? {
                id: updateResult._id.toString(),
                title: updateResult.title,
                shortDescription: updateResult.shortDescription,
                content: updateResult.content,
                blogId: updateResult.blogId,
                blogName: updateResult.blogName,
                createdAt: updateResult.createdAt
            } : undefined;
        } catch (error) {
            console.error("Error updating post by ID:", error);
            throw new Error("Failed to update post");
        }
    },
    async DeletePostByID(id: string | null): Promise<boolean> {
        if(!id) return false;
        if (!ObjectId.isValid(id)) {
            console.error("Invalid post ID:", id);
            return false;
        }
        try {
            const deleteResult = await postsDBCollection.deleteOne({ _id: new ObjectId(id) });
            return deleteResult.deletedCount > 0;
        } catch (error) {
            console.error("Error deleting post by ID:", error);
            throw new Error("Failed to delete post");
        }
    }
};

